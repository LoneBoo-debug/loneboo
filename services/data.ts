
import { NOTIFICATIONS_CSV_URL, COMMUNITY_CSV_URL, SOCIAL_STATS_CSV_URL, FAN_ART_CSV_URL, FAN_ART_GALLERY } from '../constants';
import { AppNotification, CommunityPost, FanArt, SocialStats } from '../types';

// --- SHARED HELPER ---
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

// --- NOTIFICATIONS ---
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
    } catch (error) { console.warn("Notifs Error", error); }
    return [];
};

// --- COMMUNITY POSTS ---
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
    let posts: CommunityPost[] = [];
    if (COMMUNITY_CSV_URL) {
        try {
            const response = await fetch(COMMUNITY_CSV_URL);
            if (response.ok) {
                const text = await response.text();
                const lines = text.split('\n');
                const dataRows = lines.slice(1);
                posts = dataRows.map((line, index) => {
                    if (!line.trim()) return null;
                    const parts = parseCSVLine(line);
                    if (parts.length < 2) return null;
                    const date = parts[0] || 'Oggi';
                    const content = parts[1] || '';
                    const image = parts[2] || '';
                    const likes = parseInt(parts[3]) || 0;
                    const type = (image && image.startsWith('http')) ? 'IMAGE' : 'TEXT';
                    return {
                        id: `csv-post-${index}`,
                        type: type,
                        content,
                        image: type === 'IMAGE' ? image : undefined,
                        date,
                        likes
                    } as CommunityPost;
                }).filter((p): p is CommunityPost => p !== null);
                posts.reverse();
            }
        } catch (error) { console.warn("Community Error", error); }
    }
    return posts;
};

// --- SOCIAL STATS ---
export const getSocialStatsFromCSV = async (): Promise<SocialStats> => {
    const stats: SocialStats = {};
    if (SOCIAL_STATS_CSV_URL) {
        try {
            const response = await fetch(SOCIAL_STATS_CSV_URL);
            if (response.ok) {
                const text = await response.text();
                const lines = text.split('\n');
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
        } catch (error) { console.warn("Stats Error", error); }
    }
    return stats;
};

// --- FAN ART ---
export const getFanArt = async (): Promise<FanArt[]> => {
    let dynamicArts: FanArt[] = [];
    if (FAN_ART_CSV_URL) {
        try {
            const response = await fetch(FAN_ART_CSV_URL);
            if (response.ok) {
                const text = await response.text();
                const lines = text.split('\n');
                const dataRows = lines.slice(1);
                dynamicArts = dataRows.map((line, index): FanArt | null => {
                        if (!line.trim()) return null;
                        const parts = parseCSVLine(line);
                        if (parts.length < 3) return null;
                        const author = parts[0];
                        let age = parts[1];
                        const image = parts[2];
                        const city = parts[3] || '';
                        const province = parts[4] || '';
                        if (!image || !image.startsWith('http')) return null;
                        if (age && !String(age).toLowerCase().includes('anni')) {
                            age = `${age} anni`;
                        }
                        return { id: `csv-${index}`, author, age, image, city, province };
                    }).filter((item): item is FanArt => item !== null);
                dynamicArts.reverse();
            }
        } catch (error) { console.warn("FanArt Error", error); }
    }
    const MIN_ITEMS = 4;
    if (dynamicArts.length < MIN_ITEMS) {
        const slotsToFill = MIN_ITEMS - dynamicArts.length;
        const fillerItems = FAN_ART_GALLERY.slice(0, slotsToFill);
        return [...dynamicArts, ...fillerItems];
    }
    return dynamicArts;
};
    