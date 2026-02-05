
import { PlayerProgress, Sticker, Rarity, AvatarConfig } from '../types';
import { STICKERS_COLLECTION, STICKERS_COLLECTION_VOL2 } from './stickersDatabase';

const STORAGE_KEY = 'loneboo_player_progress';

const INITIAL_PROGRESS: PlayerProgress = {
    playerName: '',
    avatar: 'BOY',
    avatarConfig: undefined,
    tokens: 300, // Impostato a 300 per facilitare i test
    unlockedStickers: [],
    hardModeUnlocked: false,
    duplicates: 0,
    duplicateStickers: [],
    currentAlbum: 1,
    completedQuizzes: {},
    completedActivities: {},
    equippedClothing: {},
    purchasedClothing: []
};

export const getProgress = (): PlayerProgress => {
    try {
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            const parsed = JSON.parse(localData);
            if (parsed && typeof parsed === 'object') {
                return { 
                    ...INITIAL_PROGRESS, 
                    ...parsed,
                    completedQuizzes: parsed.completedQuizzes || {},
                    completedActivities: parsed.completedActivities || {},
                    equippedClothing: parsed.equippedClothing || {},
                    purchasedClothing: parsed.purchasedClothing || []
                };
            }
        }
    } catch (e) { console.error("Error reading progress:", e); }
    return { ...INITIAL_PROGRESS };
};

export const saveProgress = (progress: PlayerProgress) => {
    try {
        const jsonStr = JSON.stringify(progress);
        localStorage.setItem(STORAGE_KEY, jsonStr);
        window.dispatchEvent(new Event('progressUpdated'));
    } catch (e) { console.error("Error saving progress:", e); }
};

// --- SETTERS AND ACTIONS ---

export const setPlayerName = (name: string) => {
    const progress = getProgress();
    progress.playerName = name;
    saveProgress(progress);
};

export const addTokens = (amount: number): number => {
    const progress = getProgress();
    progress.tokens = (progress.tokens || 0) + amount; 
    saveProgress(progress);
    return progress.tokens;
};

export const spendTokens = (amount: number): boolean => {
    const progress = getProgress();
    if (progress.tokens >= amount) {
        progress.tokens -= amount;
        saveProgress(progress);
        return true;
    }
    return false;
};

export const equipClothing = (type: 'tshirt' | 'hat' | 'glasses', id: string | undefined) => {
    const progress = getProgress();
    progress.equippedClothing[type] = id;
    saveProgress(progress);
};

export const purchaseClothing = (id: string, cost: number): boolean => {
    const progress = getProgress();
    if (progress.purchasedClothing.includes(id)) return true;
    
    if (progress.tokens >= cost) {
        progress.tokens -= cost;
        progress.purchasedClothing.push(id);
        saveProgress(progress);
        return true;
    }
    return false;
};

export const unlockHardMode = (): boolean => {
    const progress = getProgress();
    if (progress.tokens >= 1500) {
        progress.tokens -= 1500;
        progress.hardModeUnlocked = true;
        saveProgress(progress);
        return true;
    }
    return false;
};

export const upgradeToNextAlbum = (): boolean => {
    const progress = getProgress();
    if ((progress.currentAlbum || 1) < 2) {
        progress.currentAlbum = 2;
        saveProgress(progress);
        return true;
    }
    return false;
};

// --- STICKERS LOGIC ---

export const openPack = (albumVersion: number = 1): Sticker => {
    const currentCollection = (albumVersion === 2) ? STICKERS_COLLECTION_VOL2 : STICKERS_COLLECTION;
    const rand = Math.random();
    let selectedRarity: Rarity = 'COMMON';
    if (rand > 0.98) selectedRarity = 'LEGENDARY';
    else if (rand > 0.90) selectedRarity = 'EPIC';
    else if (rand > 0.60) selectedRarity = 'RARE';
    const pool = currentCollection.filter(s => s.rarity === selectedRarity);
    const finalPool = pool.length > 0 ? pool : currentCollection;
    return finalPool[Math.floor(Math.random() * finalPool.length)];
};

export const saveSticker = (stickerId: string) => {
    const progress = getProgress();
    if (!progress.unlockedStickers.includes(stickerId)) {
        progress.unlockedStickers.push(stickerId);
        saveProgress(progress);
    }
};

export const addDuplicate = (stickerId?: string) => {
    const progress = getProgress();
    if (!progress.duplicateStickers) progress.duplicateStickers = [];
    const currentCount = Math.max(progress.duplicates || 0, progress.duplicateStickers.length);
    if (currentCount < 5) {
        if (stickerId) progress.duplicateStickers.push(stickerId);
        progress.duplicates = currentCount + 1;
        saveProgress(progress);
    }
};

export const tradeDuplicates = (): boolean => {
    const progress = getProgress();
    const count = Math.max(progress.duplicates || 0, progress.duplicateStickers?.length || 0);
    if (count >= 5) {
        progress.duplicates = 0;
        progress.duplicateStickers = [];
        saveProgress(progress);
        return true;
    }
    return false;
};

// --- PASSPORT ENCODING & RECOVERY ---

/**
 * Codifica i progressi in Base64 supportando caratteri UTF-8 (accenti, emoji, ecc.)
 */
export const encodePassport = (progress: PlayerProgress): string => {
    try {
        const jsonString = JSON.stringify(progress);
        // encodeURIComponent + unescape è necessario per permettere a btoa di gestire caratteri non-latin1
        return btoa(unescape(encodeURIComponent(jsonString)));
    } catch (e) {
        console.error("Error encoding passport:", e);
        return "";
    }
};

/**
 * Decodifica i progressi da una stringa Base64 gestendo correttamente UTF-8
 */
export const decodePassport = (code: string): PlayerProgress | null => {
    try {
        const decodedString = decodeURIComponent(escape(atob(code)));
        return JSON.parse(decodedString);
    } catch (e) {
        console.error("Error decoding passport:", e);
        return null;
    }
};

export const getPassportCode = (): string => {
    return encodePassport(getProgress());
};

export const restorePassport = (code: string): boolean => {
    const p = decodePassport(code);
    if (p) {
        saveProgress(p);
        return true;
    }
    return false;
};

// --- SCHOOL PROGRESS ---

export const markQuizComplete = (lessonId: string, quizIdx: number) => {
    const progress = getProgress();
    if (!progress.completedQuizzes) progress.completedQuizzes = {};
    if (!progress.completedQuizzes[lessonId]) progress.completedQuizzes[lessonId] = [];
    progress.completedQuizzes[lessonId][quizIdx] = true;
    saveProgress(progress);
};

export const markActivityComplete = (lessonId: string, activityIdx: number) => {
    const progress = getProgress();
    if (!progress.completedActivities) progress.completedActivities = {};
    if (!progress.completedActivities[lessonId]) progress.completedActivities[lessonId] = [];
    progress.completedActivities[lessonId][activityIdx] = true;
    saveProgress(progress);
};
