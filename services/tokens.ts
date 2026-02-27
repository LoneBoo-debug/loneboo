
import { PlayerProgress, Sticker, Rarity, AvatarConfig, TokenTransaction } from '../types';
import { STICKERS_COLLECTION, STICKERS_COLLECTION_VOL2 } from './stickersDatabase';

const STORAGE_KEY = 'loneboo_player_progress';

const INITIAL_PROGRESS: PlayerProgress = {
    playerName: '',
    avatar: 'BOY',
    avatarConfig: undefined,
    tokens: 100, // Valore predefinito per il lancio
    unlockedStickers: [],
    hardModeUnlocked: false,
    duplicates: 0,
    duplicateStickers: [],
    duplicatesVol2: 0,
    duplicateStickersVol2: [],
    currentAlbum: 1,
    completedQuizzes: {},
    completedActivities: {},
    equippedClothing: {},
    purchasedClothing: [],
    transactions: []
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
                    purchasedClothing: parsed.purchasedClothing || [],
                    transactions: parsed.transactions || [],
                    duplicatesVol2: parsed.duplicatesVol2 || 0,
                    duplicateStickersVol2: parsed.duplicateStickersVol2 || []
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

const recordTransaction = (progress: PlayerProgress, amount: number, description: string) => {
    if (!progress.transactions) progress.transactions = [];
    const newTransaction: TokenTransaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount,
        description,
        date: new Date().toISOString()
    };
    progress.transactions.unshift(newTransaction);
    // Mantieni solo gli ultimi 50 movimenti per non appesantire il localStorage
    if (progress.transactions.length > 50) {
        progress.transactions = progress.transactions.slice(0, 50);
    }
};

export const setPlayerName = (name: string) => {
    const progress = getProgress();
    progress.playerName = name;
    saveProgress(progress);
};

export const addTokens = (amount: number, description: string = 'Guadagno'): number => {
    const progress = getProgress();
    progress.tokens = (progress.tokens || 0) + amount; 
    recordTransaction(progress, amount, description);
    saveProgress(progress);
    return progress.tokens;
};

export const getTokens = (): number => {
    const progress = getProgress();
    return progress.tokens || 0;
};

export const spendTokens = (amount: number, description: string = 'Spesa'): boolean => {
    const progress = getProgress();
    if (progress.tokens >= amount) {
        progress.tokens -= amount;
        recordTransaction(progress, -amount, description);
        saveProgress(progress);
        return true;
    }
    return false;
};

export const equipClothing = (type: 'tshirt' | 'hat' | 'glasses' | 'special' | 'special2' | 'special3' | 'special4' | 'special5', id: string | undefined) => {
    const progress = getProgress();
    progress.equippedClothing[type] = id;
    saveProgress(progress);
};

export const purchaseClothing = (id: string, cost: number, description: string = 'Acquisto'): boolean => {
    const progress = getProgress();
    if (progress.purchasedClothing.includes(id)) return true;
    
    if (progress.tokens >= cost) {
        progress.tokens -= cost;
        progress.purchasedClothing.push(id);
        recordTransaction(progress, -cost, description);
        saveProgress(progress);
        return true;
    }
    return false;
};

export const isAlbumComplete = (albumVersion: number = 1): boolean => {
    const progress = getProgress();
    const collection = albumVersion === 2 ? STICKERS_COLLECTION_VOL2 : STICKERS_COLLECTION;
    const unlockedIds = progress.unlockedStickers || [];
    return collection.every(s => unlockedIds.includes(s.id));
};

export const isAnyAlbumComplete = (): boolean => {
    return isAlbumComplete(1) || isAlbumComplete(2);
};

export const unlockHardMode = (): boolean => {
    const progress = getProgress();
    if (progress.tokens >= 1500) {
        progress.tokens -= 1500;
        progress.hardModeUnlocked = true;
        recordTransaction(progress, -1500, 'Sblocco Modalità Difficile');
        saveProgress(progress);
        return true;
    }
    return false;
};

export const upgradeToNextAlbum = (): boolean => {
    // Ora entrambi sono sbloccati di default, quindi questa funzione non serve più a sbloccare
    // ma la manteniamo per compatibilità o per cambiare l'album visualizzato se necessario
    const progress = getProgress();
    if ((progress.currentAlbum || 1) < 2) {
        progress.currentAlbum = 2;
        saveProgress(progress);
        return true;
    }
    return false;
};

// --- STICKERS LOGIC ---

export const openPack = (albumVersion: number = 1, isGold: boolean = false): Sticker => {
    const currentCollection = (albumVersion === 2) ? STICKERS_COLLECTION_VOL2 : STICKERS_COLLECTION;
    const rand = Math.random();
    let selectedRarity: Rarity = 'COMMON';

    if (isGold) {
        // Gold Pack Odds: Legendary 5%, Epic 20%, Rare 35%, Common 40%
        if (rand > 0.95) selectedRarity = 'LEGENDARY';
        else if (rand > 0.75) selectedRarity = 'EPIC';
        else if (rand > 0.40) selectedRarity = 'RARE';
    } else {
        // Standard Pack Odds: Legendary 1%, Epic 7%, Rare 22%, Common 70%
        if (rand > 0.99) selectedRarity = 'LEGENDARY';
        else if (rand > 0.92) selectedRarity = 'EPIC';
        else if (rand > 0.70) selectedRarity = 'RARE';
    }

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

export const saveMagicHatSticker = (stickerId: string) => {
    const progress = getProgress();
    if (!progress.magicHatStickers) progress.magicHatStickers = [];
    if (!progress.magicHatStickers.includes(stickerId)) {
        progress.magicHatStickers.push(stickerId);
        saveProgress(progress);
    }
};

export const addDuplicate = (stickerId: string, albumVersion: number = 1) => {
    const progress = getProgress();
    if (albumVersion === 2) {
        if (!progress.duplicateStickersVol2) progress.duplicateStickersVol2 = [];
        const currentCount = Math.max(progress.duplicatesVol2 || 0, progress.duplicateStickersVol2.length);
        if (currentCount < 5) {
            progress.duplicateStickersVol2.push(stickerId);
            progress.duplicatesVol2 = currentCount + 1;
            saveProgress(progress);
        }
    } else {
        if (!progress.duplicateStickers) progress.duplicateStickers = [];
        const currentCount = Math.max(progress.duplicates || 0, progress.duplicateStickers.length);
        if (currentCount < 5) {
            progress.duplicateStickers.push(stickerId);
            progress.duplicates = currentCount + 1;
            saveProgress(progress);
        }
    }
};

export const tradeDuplicates = (albumVersion: number = 1): boolean => {
    const progress = getProgress();
    if (albumVersion === 2) {
        const count = Math.max(progress.duplicatesVol2 || 0, progress.duplicateStickersVol2?.length || 0);
        if (count >= 5) {
            progress.duplicatesVol2 = 0;
            progress.duplicateStickersVol2 = [];
            saveProgress(progress);
            return true;
        }
    } else {
        const count = Math.max(progress.duplicates || 0, progress.duplicateStickers?.length || 0);
        if (count >= 5) {
            progress.duplicates = 0;
            progress.duplicateStickers = [];
            saveProgress(progress);
            return true;
        }
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
