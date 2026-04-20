
import { PlayerProgress, Sticker, Rarity, AvatarConfig, TokenTransaction } from '../types';
import { STICKERS_COLLECTION, STICKERS_COLLECTION_VOL2 } from './stickersDatabase';
import { CAR_DATA } from './carData';
import { SHOP_DATA } from './shopData';

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
    transactions: [],
    hasTrainPass: false,
    hasStudentPass: false,
    ownedCars: []
};

export const getProgress = (): PlayerProgress => {
    try {
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            const parsed = JSON.parse(localData);
            if (parsed && typeof parsed === 'object') {
                const progress: PlayerProgress = { 
                    ...INITIAL_PROGRESS, 
                    ...parsed,
                    completedQuizzes: parsed.completedQuizzes || {},
                    completedActivities: parsed.completedActivities || {},
                    equippedClothing: parsed.equippedClothing || {},
                    purchasedClothing: parsed.purchasedClothing || [],
                    transactions: parsed.transactions || [],
                    duplicatesVol2: parsed.duplicatesVol2 || 0,
                    duplicateStickersVol2: parsed.duplicateStickersVol2 || [],
                    hasTrainPass: !!parsed.hasTrainPass,
                    hasStudentPass: !!parsed.hasStudentPass,
                    ownedCars: (parsed.ownedCars || []).filter((name: string) => name !== "Lumachina Sprint"),
                    carStats: parsed.carStats || {},
                    carLaps: parsed.carLaps || {},
                    installedComponents: parsed.installedComponents || {}
                };

                // One-time cleanup requested by user to reset car stats and components
                if (!parsed.hasCleanedUp) {
                    const cleanedProgress = { ...progress, hasCleanedUp: true };
                    if (cleanedProgress.ownedCars) {
                        cleanedProgress.ownedCars.forEach((carName: string) => {
                            const baseCar = CAR_DATA.find(c => c.name === carName);
                            if (baseCar) {
                                if (!cleanedProgress.carStats) cleanedProgress.carStats = {};
                                cleanedProgress.carStats[carName] = { ...baseCar.stats };
                                
                                if (!cleanedProgress.installedComponents) cleanedProgress.installedComponents = {};
                                cleanedProgress.installedComponents[carName] = {};
                                
                                if (!cleanedProgress.carLaps) cleanedProgress.carLaps = {};
                                cleanedProgress.carLaps[carName] = 0;
                            }
                        });
                    }
                    saveProgress(cleanedProgress);
                    return cleanedProgress;
                }

                return progress;
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

export const purchaseTrainPass = (): boolean => {
    const progress = getProgress();
    if (progress.hasTrainPass) return true;
    if (progress.tokens >= 850) {
        progress.tokens -= 850;
        progress.hasTrainPass = true;
        recordTransaction(progress, -850, 'Acquisto Abbonamento Treno');
        saveProgress(progress);
        return true;
    }
    return false;
};

export const unlockStudentPass = () => {
    const progress = getProgress();
    if (progress.hasStudentPass) return;
    progress.hasStudentPass = true;
    recordTransaction(progress, 0, 'Sblocco Abbonamento Studente');
    saveProgress(progress);
};

export const getOwnedCars = (): string[] => {
    const progress = getProgress();
    return progress.ownedCars || [];
};

export const purchaseCar = (carName: string, cost: number, initialStats?: Record<string, number>): boolean => {
    const progress = getProgress();
    if (!progress.ownedCars) progress.ownedCars = [];
    if (progress.ownedCars.includes(carName)) return true;
    
    if (progress.tokens >= cost) {
        progress.tokens -= cost;
        progress.ownedCars.push(carName);
        if (!progress.carStats) progress.carStats = {};
        if (initialStats) {
            progress.carStats[carName] = initialStats;
        }
        // Se è la prima auto, selezionala automaticamente
        if (progress.ownedCars.length === 1) {
            progress.selectedCar = carName;
        }
        recordTransaction(progress, -cost, `Acquisto Auto: ${carName}`);
        saveProgress(progress);
        return true;
    }
    return false;
};

export const getCarStats = (carName: string): Record<string, number> | undefined => {
    const progress = getProgress();
    return progress.carStats?.[carName];
};

export const getInstalledComponents = (carName: string): Record<string, string> => {
    const progress = getProgress();
    return progress.installedComponents?.[carName] || {};
};

export const installComponent = (carName: string, category: string, itemId: string) => {
    const progress = getProgress();
    if (!progress.installedComponents) progress.installedComponents = {};
    if (!progress.installedComponents[carName]) progress.installedComponents[carName] = {};
    
    progress.installedComponents[carName][category] = itemId;
    saveProgress(progress);
};

export const getCarLaps = (carName: string): number => {
    const progress = getProgress();
    return progress.carLaps?.[carName] || 0;
};

export const addCarLaps = (carName: string, laps: number) => {
    const progress = getProgress();
    if (!progress.carLaps) progress.carLaps = {};
    const currentLaps = progress.carLaps[carName] || 0;
    const newLaps = currentLaps + laps;
    progress.carLaps[carName] = newLaps;

    // Logica di usura: ogni 4 giri perde qualcosa in maniera random
    // Se passiamo una soglia di 4 giri (es: da 3 a 4, da 7 a 8, ecc.)
    const oldCycles = Math.floor(currentLaps / 4);
    const newCycles = Math.floor(newLaps / 4);

    if (newCycles > oldCycles) {
        if (!progress.carStats) progress.carStats = {};
        const stats = progress.carStats[carName];
        if (stats) {
            const statKeys = Object.keys(stats);
            // Riduciamo 1-2 punti da 1-2 statistiche a caso
            const numStatsToReduce = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < numStatsToReduce; i++) {
                const randomKey = statKeys[Math.floor(Math.random() * statKeys.length)];
                const reduction = Math.floor(Math.random() * 2) + 1;
                stats[randomKey] = Math.max(1, stats[randomKey] - reduction);
            }
        }
    }

    saveProgress(progress);
};

export const repairCar = (carName: string, cost: number, baseStats: Record<string, number>): boolean => {
    const progress = getProgress();
    if (progress.tokens >= cost) {
        progress.tokens -= cost;
        if (!progress.carStats) progress.carStats = {};
        
        // Calcoliamo le stats massime (base + componenti)
        const maxStats = { ...baseStats };
        const installed = progress.installedComponents?.[carName] || {};
        
        Object.entries(installed).forEach(([category, itemId]) => {
            const item = SHOP_DATA[category]?.find(i => i.id === itemId);
            if (item) {
                const boosts = item.statBoost.split(',').map(s => {
                    const parts = s.trim().split(' ');
                    const label = parts[0];
                    const val = parseInt(parts[1].replace('+', ''));
                    const statKey = {
                        "Velocità": "speed", "Accel": "accel", "Tenuta": "grip",
                        "Sicurezza": "safety", "Affidabilità": "reliability", "Frenata": "braking"
                    }[label];
                    return { statKey, val };
                });
                boosts.forEach(b => {
                    if (b.statKey) {
                        maxStats[b.statKey] = (maxStats[b.statKey] || 0) + b.val;
                    }
                });
            }
        });

        progress.carStats[carName] = maxStats;
        
        if (!progress.carLaps) progress.carLaps = {};
        progress.carLaps[carName] = 0; 
        
        recordTransaction(progress, -cost, `Riparazione Auto: ${carName}`);
        saveProgress(progress);
        return true;
    }
    return false;
};

export const updateCarStats = (carName: string, stats: Record<string, number>) => {
    const progress = getProgress();
    if (!progress.carStats) progress.carStats = {};
    progress.carStats[carName] = stats;
    saveProgress(progress);
};

export const getSelectedCar = (): string | undefined => {
    const progress = getProgress();
    return progress.selectedCar;
};

export const setSelectedCar = (carName: string) => {
    const progress = getProgress();
    if (progress.ownedCars?.includes(carName)) {
        progress.selectedCar = carName;
        saveProgress(progress);
    }
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
 * Mappa degli alias per comprimere il JSON del passaporto
 */
const PASSPORT_KEYS_MAP: Record<string, string> = {
    playerName: 'n',
    avatar: 'v',
    avatarConfig: 'vc',
    tokens: 't',
    unlockedStickers: 's',
    hardModeUnlocked: 'h',
    duplicates: 'd',
    duplicateStickers: 'ds',
    duplicatesVol2: 'd2',
    duplicateStickersVol2: 'v2',
    currentAlbum: 'ca',
    completedQuizzes: 'q',
    completedActivities: 'a',
    equippedClothing: 'e',
    purchasedClothing: 'pc',
    hasTrainPass: 'tp',
    hasStudentPass: 'sp',
    ownedCars: 'oc',
    carStats: 'cs',
    carLaps: 'cl',
    installedComponents: 'ic',
    magicHatStickers: 'ms',
    hasCleanedUp: 'hc'
};

const REVERSE_PASSPORT_KEYS_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(PASSPORT_KEYS_MAP).map(([k, v]) => [v, k])
);

/**
 * Converte gli ID delle figurine in numeri per risparmiare spazio
 */
const stickerIdToNum = (id: string): number => {
    if (id.startsWith('stk2-')) return parseInt(id.replace('stk2-', '')) + 100;
    if (id.startsWith('stk-')) return parseInt(id.replace('stk-', ''));
    return 0;
};

const numToStickerId = (num: number): string => {
    if (num > 100) return `stk2-${(num - 100).toString().padStart(3, '0')}`;
    return `stk-${num.toString().padStart(3, '0')}`;
};

/**
 * Codifica i progressi in Base64 comprimendo le chiavi e i valori per minimizzare il QR
 */
export const encodePassport = (progress: PlayerProgress): string => {
    try {
        const essentialProgress: any = { ...progress };
        delete essentialProgress.transactions; // Cronologia non necessaria per recupero
        
        // 1. Ottimizzazione delle figurine: convertiamo l'array di stringhe in array di numeri
        if (essentialProgress.unlockedStickers) {
            essentialProgress.unlockedStickers = essentialProgress.unlockedStickers.map(stickerIdToNum);
        }
        if (essentialProgress.magicHatStickers) {
            essentialProgress.magicHatStickers = essentialProgress.magicHatStickers.map(stickerIdToNum);
        }
        
        // 2. Ottimizzazione Quizzes e Activities: convertiamo [true, false] in [1, 0]
        const optimizeMap = (map: Record<string, boolean[]>) => {
            const optimized: Record<string, number[]> = {};
            Object.entries(map).forEach(([k, v]) => {
                optimized[k] = v.map(b => b ? 1 : 0);
            });
            return optimized;
        };
        
        if (essentialProgress.completedQuizzes) {
            essentialProgress.completedQuizzes = optimizeMap(essentialProgress.completedQuizzes);
        }
        if (essentialProgress.completedActivities) {
            essentialProgress.completedActivities = optimizeMap(essentialProgress.completedActivities);
        }

        // 3. Compressione delle chiavi
        const compressed: any = {};
        Object.entries(essentialProgress).forEach(([k, v]) => {
            const alias = PASSPORT_KEYS_MAP[k] || k;
            compressed[alias] = v;
        });

        const jsonString = JSON.stringify(compressed);
        return btoa(unescape(encodeURIComponent(jsonString)));
    } catch (e) {
        console.error("Error encoding passport:", e);
        return "";
    }
};

/**
 * Decodifica i progressi da una stringa Base64 ripristinando chiavi e valori originali
 */
export const decodePassport = (code: string): PlayerProgress | null => {
    try {
        const decodedString = decodeURIComponent(escape(atob(code)));
        const compressed = JSON.parse(decodedString);
        
        // 1. Decomprimiamo le chiavi
        const decompressed: any = {};
        Object.entries(compressed).forEach(([k, v]) => {
            const originalKey = REVERSE_PASSPORT_KEYS_MAP[k] || k;
            decompressed[originalKey] = v;
        });

        // 2. Ripristino dei valori (Figurine e Quizzes)
        if (decompressed.unlockedStickers && Array.isArray(decompressed.unlockedStickers)) {
            decompressed.unlockedStickers = decompressed.unlockedStickers.map((n: any) => typeof n === 'number' ? numToStickerId(n) : n);
        }
        if (decompressed.magicHatStickers && Array.isArray(decompressed.magicHatStickers)) {
            decompressed.magicHatStickers = decompressed.magicHatStickers.map((n: any) => typeof n === 'number' ? numToStickerId(n) : n);
        }
        
        const restoreMap = (map: any) => {
            if (!map) return {};
            const restored: Record<string, boolean[]> = {};
            Object.entries(map).forEach(([k, v]) => {
                if (Array.isArray(v)) {
                    restored[k] = v.map(n => n === 1);
                }
            });
            return restored;
        };
        
        decompressed.completedQuizzes = restoreMap(decompressed.completedQuizzes);
        decompressed.completedActivities = restoreMap(decompressed.completedActivities);

        return decompressed as PlayerProgress;
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
        // Quando ripristiniamo, assicuriamoci di mantenere le transazioni correnti se presenti
        // o inizializzarle a vuoto, dato che non sono nel QR
        const currentProgress = getProgress();
        const mergedProgress = {
            ...p,
            transactions: currentProgress.transactions || []
        };
        saveProgress(mergedProgress);
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
