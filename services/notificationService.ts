
import { NOTIFICATIONS_CSV_URL } from '../constants';
import { AppNotification } from '../types';

/**
 * Servizio NotificationService v2.8
 * Risolve l'errore 404 assicurando una richiesta pulita verso Google Sheets.
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
    const result: string[] = [];
    let curVal = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"' && inQuotes && nextChar === '"') {
            curVal += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(curVal.trim());
            curVal = '';
        } else {
            curVal += char;
        }
    }
    result.push(curVal.trim());
    return result;
};

export const fetchAppNotifications = async (): Promise<AppNotification[]> => {
    if (!NOTIFICATIONS_CSV_URL) return [];

    try {
        // Fetch semplice senza header personalizzati per evitare problemi di preflight/CORS/404
        const response = await fetch(NOTIFICATIONS_CSV_URL, {
            method: 'GET',
            cache: 'no-store' // Forza il recupero dei dati più recenti senza cache locale
        });

        if (!response.ok) {
            console.warn(`Google Sheets ha risposto con errore ${response.status} per le notifiche.`);
            return [];
        }

        const text = await response.text();
        const cleanText = text.replace(/^\uFEFF/, '').trim();
        const lines = cleanText.split(/\r?\n/);
        
        if (lines.length < 2) return [];

        const notifications = lines.slice(1)
            .map((line, index) => {
                const parts = parseCSVLine(line);
                if (parts.length < 2 || !parts[1]) return null;

                const id = parts[0] || `notif-${index}`;
                const message = parts[1];
                const link = (parts[2] && parts[2] !== "" && parts[2] !== "-") ? parts[2].trim() : undefined;
                let image = (parts[3] && parts[3] !== "" && parts[3] !== "-") ? parts[3].trim() : undefined;
                
                if (!image && link && (link.includes('youtube.com') || link.includes('youtu.be'))) {
                    image = getYouTubeThumbnail(link);
                }

                return {
                    id,
                    message,
                    link,
                    image,
                    linkText: "VAI",
                    active: true
                } as AppNotification;
            })
            .filter((n): n is AppNotification => n !== null);

        return notifications.reverse();
    } catch (error) {
        console.error("Errore critico recupero notifiche:", error);
        return [];
    }
};

export const checkHasNewNotifications = async (): Promise<boolean> => {
    try {
        const notifications = await fetchAppNotifications();
        if (notifications.length === 0) return false;
        const lastSeenId = localStorage.getItem('last_notif_id');
        const latestId = notifications[0].id;
        return lastSeenId !== latestId;
    } catch {
        return false;
    }
};

export const markNotificationsAsRead = async () => {
    try {
        const notifications = await fetchAppNotifications();
        if (notifications.length > 0) {
            localStorage.setItem('last_notif_id', notifications[0].id);
            window.dispatchEvent(new Event('notificationsRead'));
        }
    } catch (error) {
        console.error("Impossibile segnare notifiche come lette:", error);
    }
};
