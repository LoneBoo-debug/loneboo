
import { NOTIFICATIONS_CSV_URL } from '../constants';
import { AppNotification } from '../types';

/**
 * Parses a single line of CSV.
 * Columns: ID, Message, Link, LinkText, Active, Image
 */
const parseCSVLine = (line: string): string[] => {
    if (!line.includes('"')) {
        return line.split(',').map(s => s.trim());
    }
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
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

export const getLatestNotification = async (): Promise<AppNotification | null> => {
    if (!NOTIFICATIONS_CSV_URL || NOTIFICATIONS_CSV_URL.includes('ExamplePlaceholder')) return null;

    try {
        const response = await fetch(NOTIFICATIONS_CSV_URL);
        if (response.ok) {
            const text = await response.text();
            const lines = text.split('\n');
            if (lines.length < 2) return null;
            
            const dataRows = lines.slice(1);

            for (let i = dataRows.length - 1; i >= 0; i--) {
                const line = dataRows[i];
                if (!line || !line.trim()) continue;
                
                const parts = parseCSVLine(line);
                if (parts.length < 5) continue;

                const id = parts[0];
                const message = parts[1];
                const link = parts[2];
                const linkText = parts[3];
                const activeRaw = parts[4] ? parts[4].trim().toUpperCase() : 'FALSE';
                const image = parts[5] ? parts[5].trim() : undefined;

                if (activeRaw === 'TRUE' || activeRaw === 'SI' || activeRaw === 'YES') {
                    return {
                        id,
                        message,
                        link: link === '-' ? undefined : link,
                        linkText: linkText === '-' ? undefined : linkText,
                        active: true,
                        image: (image && image !== '-' && image.startsWith('http')) ? image : undefined
                    };
                }
            }
        }
    } catch (error) {
        console.warn("Could not load notifications:", error);
    }
    return null;
};

export const getAllNotifications = async (): Promise<AppNotification[]> => {
    if (!NOTIFICATIONS_CSV_URL || NOTIFICATIONS_CSV_URL.includes('ExamplePlaceholder')) return [];

    try {
        const response = await fetch(NOTIFICATIONS_CSV_URL);
        if (response.ok) {
            const text = await response.text();
            const lines = text.split('\n');
            if (lines.length < 2) return [];
            
            const dataRows = lines.slice(1);
            const notifications: AppNotification[] = [];

            // Iteriamo dal fondo (più recenti) verso l'inizio
            for (let i = dataRows.length - 1; i >= 0; i--) {
                const line = dataRows[i];
                if (!line || !line.trim()) continue;
                
                const parts = parseCSVLine(line);
                if (parts.length < 5) continue;

                const activeRaw = parts[4] ? parts[4].trim().toUpperCase() : 'FALSE';

                if (activeRaw === 'TRUE' || activeRaw === 'SI' || activeRaw === 'YES') {
                    notifications.push({
                        id: parts[0],
                        message: parts[1],
                        link: parts[2] === '-' ? undefined : parts[2],
                        linkText: parts[3] === '-' ? undefined : parts[3],
                        active: true,
                        image: (parts[5] && parts[5] !== '-' && parts[5].startsWith('http')) ? parts[5].trim() : undefined
                    });
                }
            }
            return notifications;
        }
    } catch (error) {
        console.warn("Could not load all notifications:", error);
    }
    return [];
};
