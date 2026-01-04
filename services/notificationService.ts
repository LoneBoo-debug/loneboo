import { NOTIFICATIONS_CSV_URL } from '../constants';
import { AppNotification } from '../types';

/**
 * Servizio NotificationService v2.5
 * Supporto per miniature automatiche YouTube e immagini personalizzate (Colonna D)
 */

const getYouTubeThumbnail = (url: string): string | undefined => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
    return undefined;
};

const parseCSVLine = (line: string): string[] => {
    const cleanLine = line.trim();
    if (!cleanLine) return [];
    
    if (!cleanLine.includes('"')) {
        return cleanLine.split(',').map(s => s.trim());
    }

    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < cleanLine.length; i++) {
        const char = cleanLine[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
};

export const fetchAppNotifications = async (): Promise<AppNotification[]> => {
    if (!NOTIFICATIONS_CSV_URL) return [];

    try {
        const separator = NOTIFICATIONS_CSV_URL.includes('?') ? '&' : '?';
        const urlWithCacheBuster = `${NOTIFICATIONS_CSV_URL}${separator}t=${Date.now()}`;
        
        const response = await fetch(urlWithCacheBuster, { mode: 'cors' });
        if (!response.ok) throw new Error("Errore nel caricamento");

        const text = await response.text();
        const cleanText = text.replace(/^\uFEFF/, '').trim();
        const lines = cleanText.split(/\r?\n/);
        
        if (lines.length < 2) return [];

        const notifications = lines.slice(1)
            .map((line, index) => {
                const parts = parseCSVLine(line);
                
                // Mappatura: 
                // Colonna A (0) = ID
                // Colonna B (1) = Messaggio
                // Colonna C (2) = Link
                // Colonna D (3) = Immagine Personalizzata
                if (parts.length < 2 || !parts[1]) return null;

                const id = parts[0] || `notif-${index}`;
                const message = parts[1];
                const link = (parts[2] && parts[2] !== "" && parts[2] !== "-") ? parts[2].trim() : undefined;
                
                // Se c'è un'immagine manuale in Colonna D, usa quella. 
                // Altrimenti, se il link è YouTube, genera la miniatura.
                let image = (parts[3] && parts[3] !== "" && parts[3] !== "-") ? parts[3].trim() : undefined;
                if (!image && link) {
                    image = getYouTubeThumbnail(link);
                }

                return {
                    id,
                    message,
                    link,
                    image,
                    linkText: "VAI", // Testo fisso per il tasto sotto l'immagine
                    active: true
                } as AppNotification;
            })
            .filter((n): n is AppNotification => n !== null);

        return notifications.reverse();
    } catch (error) {
        console.error("Errore recupero notifiche:", error);
        return [];
    }
};

export const checkHasNewNotifications = async (): Promise<boolean> => {
    const notifications = await fetchAppNotifications();
    if (notifications.length === 0) return false;
    const lastSeenId = localStorage.getItem('last_notif_id');
    const latestId = notifications[0].id;
    return lastSeenId !== latestId;
};

export const markNotificationsAsRead = async () => {
    const notifications = await fetchAppNotifications();
    if (notifications.length > 0) {
        localStorage.setItem('last_notif_id', notifications[0].id);
        window.dispatchEvent(new Event('notificationsRead'));
    }
};