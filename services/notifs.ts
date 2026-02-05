
import { NOTIFICATIONS_CSV_URL } from '../constants';
import { AppNotification } from '../types';

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
    if (!NOTIFICATIONS_CSV_URL) return null;

    try {
        const response = await fetch(NOTIFICATIONS_CSV_URL, { cache: 'no-store' });
        if (response.ok) {
            const text = await response.text();
            const lines = text.split('\n');
            if (lines.length < 2) return null;
            
            const dataRows = lines.slice(1);
            for (let i = dataRows.length - 1; i >= 0; i--) {
                const line = dataRows[i];
                if (!line || !line.trim()) continue;
                
                const parts = parseCSVLine(line);
                if (parts.length < 2) continue;

                const id = parts[0];
                const message = parts[1];
                const link = (parts[2] && parts[2] !== "-") ? parts[2] : undefined;
                const image = (parts[3] && parts[3] !== "-") ? parts[3] : undefined;

                return {
                    id,
                    message,
                    link,
                    active: true,
                    image
                };
            }
        }
    } catch (error) {
        console.warn("Could not load notifications:", error);
    }
    return null;
};

export const getAllNotifications = async (): Promise<AppNotification[]> => {
    if (!NOTIFICATIONS_CSV_URL) return [];

    try {
        const response = await fetch(NOTIFICATIONS_CSV_URL, { cache: 'no-store' });
        if (response.ok) {
            const text = await response.text();
            const lines = text.split('\n');
            if (lines.length < 2) return [];
            
            const dataRows = lines.slice(1);
            const notifications: AppNotification[] = [];

            for (let i = dataRows.length - 1; i >= 0; i--) {
                const line = dataRows[i];
                if (!line || !line.trim()) continue;
                
                const parts = parseCSVLine(line);
                if (parts.length < 2) continue;

                notifications.push({
                    id: parts[0],
                    message: parts[1],
                    link: (parts[2] && parts[2] !== "-") ? parts[2] : undefined,
                    active: true,
                    image: (parts[3] && parts[3] !== "-") ? parts[3] : undefined
                });
            }
            return notifications;
        }
    } catch (error) {
        console.warn("Could not load all notifications:", error);
    }
    return [];
};
