
import { SOCIAL_STATS_CSV_URL } from '../constants';

export interface SocialStats {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
}

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

export const getSocialStatsFromCSV = async (): Promise<SocialStats> => {
    const stats: SocialStats = {};

    if (SOCIAL_STATS_CSV_URL) {
        try {
            const response = await fetch(SOCIAL_STATS_CSV_URL);
            if (response.ok) {
                const text = await response.text();
                const lines = text.split('\n');
                
                // Iterate through lines (skip header usually, but here we look for keys)
                // Expected format: Platform,Count
                lines.forEach(line => {
                    if (!line.trim()) return;
                    const parts = parseCSVLine(line);
                    if (parts.length < 2) return;

                    const platform = parts[0].toLowerCase();
                    const count = parts[1];

                    if (platform.includes('instagram')) stats.instagram = count;
                    if (platform.includes('tiktok')) stats.tiktok = count;
                    if (platform.includes('facebook')) stats.facebook = count;
                });
            }
        } catch (error) {
            console.warn("Could not load Social Stats CSV:", error);
        }
    }
    return stats;
};
