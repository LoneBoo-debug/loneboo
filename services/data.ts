
import { NOTIFICATIONS_CSV_URL, COMMUNITY_CSV_URL, SOCIAL_STATS_CSV_URL, FAN_ART_CSV_URL } from '../constants';
import { AppNotification, CommunityPost, FanArt, SocialStats } from '../types';
import { FAN_ART_DATABASE } from './dbfanart';

const parseCSVLine = (line: string): string[] => {
    if (!line.includes('"')) return line.split(',').map(s => s.trim());
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
        else current += char;
    }
    result.push(current.trim());
    return result;
};

export const getAllNotifications = async (): Promise<AppNotification[]> => {
    if (!NOTIFICATIONS_CSV_URL) return [];
    try {
        const res = await fetch(NOTIFICATIONS_CSV_URL);
        if (!res.ok) return [];
        const text = await res.text();
        return text.split('\n').slice(1).map((line, i) => {
            const p = parseCSVLine(line);
            if (p.length < 5) return null;
            const active = p[4].trim().toUpperCase() === 'TRUE' || p[4].trim().toUpperCase() === 'SI';
            if (!active) return null;
            return { id: p[0], message: p[1], link: p[2] === '-' ? undefined : p[2], linkText: p[3] === '-' ? undefined : p[3], active: true, image: p[5]?.startsWith('http') ? p[5] : undefined } as AppNotification;
        }).filter((n): n is AppNotification => n !== null).reverse();
    } catch (e) { return []; }
};

export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
    if (!COMMUNITY_CSV_URL) return [];
    try {
        const res = await fetch(COMMUNITY_CSV_URL);
        if (!res.ok) return [];
        const text = await res.text();
        return text.split('\n').slice(1).map((line, i) => {
            const p = parseCSVLine(line);
            if (p.length < 2) return null;
            return { id: `post-${i}`, type: p[2]?.startsWith('http') ? 'IMAGE' : 'TEXT', date: p[0], content: p[1], image: p[2]?.startsWith('http') ? p[2] : undefined, likes: parseInt(p[3]) || 0 } as CommunityPost;
        }).filter((p): p is CommunityPost => p !== null).reverse();
    } catch (e) { return []; }
};

export const getSocialStatsFromCSV = async (): Promise<SocialStats> => {
    const stats: SocialStats = {};
    if (!SOCIAL_STATS_CSV_URL) return stats;
    try {
        const res = await fetch(SOCIAL_STATS_CSV_URL);
        if (!res.ok) return stats;
        const text = await res.text();
        text.split('\n').forEach(line => {
            const p = parseCSVLine(line);
            if (p.length < 2) return;
            const key = p[0].toLowerCase();
            if (key.includes('insta')) stats.instagram = p[1];
            if (key.includes('tik')) stats.tiktok = p[1];
            if (key.includes('face')) stats.facebook = p[1];
        });
    } catch (e) {}
    return stats;
};

export const getFanArt = async (): Promise<FanArt[]> => {
    let dynamicArts: FanArt[] = [];
    if (FAN_ART_CSV_URL) {
        try {
            const res = await fetch(FAN_ART_CSV_URL);
            if (res.ok) {
                const text = await res.text();
                dynamicArts = text.split('\n').slice(1).map((line, i) => {
                    const p = parseCSVLine(line);
                    if (p.length < 3 || !p[2].startsWith('http')) return null;
                    return { 
                        id: `art-${i}`, 
                        author: p[0], 
                        age: p[1].includes('anni') ? p[1] : `${p[1]} anni`, 
                        image: p[2], 
                        city: p[3] || '', 
                        province: p[4] || '' 
                    } as FanArt;
                }).filter((a): a is FanArt => a !== null).reverse();
            }
        } catch (e) {
            console.warn("Could not fetch dynamic Fan Art, using database fallback.");
        }
    }
    
    // Se abbiamo meno di 4 disegni dal foglio, riempiamo con quelli del database
    if (dynamicArts.length < 4) {
        const needed = 4 - dynamicArts.length;
        const fill = FAN_ART_DATABASE.slice(0, needed);
        return [...dynamicArts, ...fill];
    }
    
    return dynamicArts;
};
