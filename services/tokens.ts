
import { PlayerProgress, Sticker, Rarity, AvatarConfig } from '../types';
import { STICKERS_COLLECTION, STICKERS_COLLECTION_VOL2 } from './stickersDatabase';

const STORAGE_KEY = 'loneboo_player_progress';

// --- DIZIONARIO 256 PAROLE ITALIANE (Byte Map) ---
const ITALIAN_WORDS = [
    "ACQUA", "AEREO", "ALBERO", "ALICE", "AMICO", "AMORE", "ANGELO", "ANIMA", "ANNO", "APE", 
    "ARCO", "ARIA", "ARTE", "ASINO", "ATTO", "AUTO", "BACIO", "BAFFO", "BALLO", "BANANA", 
    "BANCO", "BARCA", "BASSO", "BECCO", "BELLO", "BENE", "BIANCO", "BICI", "BIRRA", "BISCOTTO", 
    "BLU", "BOCCA", "BOLLA", "BORSA", "BOSCO", "BOTTE", "BRACCIO", "BUCO", "BUFFO", "BUIO", 
    "BURRO", "CACAO", "CAFFE", "CALDO", "CALZA", "CAMPO", "CANE", "CANTO", "CAPRA", "CARRO", 
    "CARTA", "CASA", "CASCO", "CASSA", "CATENA", "CAVALLO", "CENA", "CERA", "CESTO", "CIELO", 
    "CIGNO", "CIMA", "CINQUE", "CITTA", "CLASSE", "CODA", "COLLA", "COLLO", "COLORE", "CONTE", 
    "CORDA", "CORNO", "CORPO", "CORSA", "CORTO", "COSA", "COSTA", "CREMA", "CROCE", "CUBO", 
    "CUCINA", "CULLA", "CUORE", "CURA", "DADO", "DAMA", "DENTE", "DISCO", "DITO", "DIVANO", 
    "DOLCE", "DONNA", "DONO", "DOTTORE", "DRAGO", "DUE", "DURO", "ERBA", "ESTATE", "FAME", 
    "FARINA", "FARO", "FATA", "FATTO", "FAVOLA", "FEDE", "FELPA", "FERRO", "FESTA", "FETTA", 
    "FIANO", "FICO", "FIGLIO", "FILO", "FINE", "FIORE", "FIUME", "FOGLIA", "FOLLA", "FONTE", 
    "FORMA", "FORNO", "FORZA", "FOTO", "FUOCO", "FUMO", "FUNGO", "GABBIA", "GALLO", "GAMBA", 
    "GATTO", "GELATO", "GENTE", "GIOCO", "GIORNO", "GIRAFFA", "GIRO", "GLOBO", "GOCCIA", "GOMMA", 
    "GONNA", "GRANO", "GRAZIE", "GRILLO", "GROTTA", "GUFO", "GUSTO", "IDEA", "ISOLA", "LAGO", 
    "LAMA", "LANA", "LATO", "LATTE", "LAVORO", "LEGNO", "LEONE", "LETTO", "LIBRO", "LIMONE", 
    "LINEA", "LINGUA", "LIRA", "LISTA", "LITRO", "LUCE", "LUNA", "LUPO", "MADRE", "MAGIA", 
    "MAGO", "MAIALE", "MAIS", "MALTO", "MAMMA", "MANO", "MARE", "MARTE", "MASCHERA", "MATITA", 
    "MATTO", "MELA", "MENTA", "MENU", "MESE", "META", "METRO", "MEZZO", "MIELE", "MILLE", 
    "MINUTO", "MIO", "MODO", "MONDO", "MONTE", "MOTO", "MOZZO", "MUCCA", "MULO", "MURO", 
    "MUSICA", "NASO", "NATA", "NAVE", "NAZIO", "NEBBIA", "NEVE", "NIDO", "NODO", "NOME", 
    "NONNO", "NORD", "NOTE", "NOTTE", "NOVE", "NUBE", "NULLA", "NUMERO", "NUOVO", "OCA", 
    "OCCHIO", "OGGI", "OLIO", "OMBRA", "ONDA", "ORA", "ORCO", "ORO", "ORSO", "ORTO", 
    "OSSO", "OTTO", "PACE", "PADRE", "PAGLIA", "PALLA", "PALMA", "PANE", "PANNA", "PAPA", 
    "PARCO", "PARTE", "PASSO", "PASTA", "PATATA", "PAURA", "PAZZO", "PECORA", "PELLE", "PELO", 
    "PENNA", "PEPE", "PERA", "PESCA", "PESCE", "PEZZO", "PIANO", "PIATTO", "PIEDE", "PIETRA", 
    "PIGRO", "PILA", "PINO", "PIOGGIA", "PIPA", "PISTA", "PIZZA", "POLLO", "POLSO", "POLVERE", 
    "POMO", "PONTE", "POPOLO", "PORTA", "PORTO", "POSTA", "PRATO", "PRETE", "PREZZO", "PRIMO", 
    "PUNTO", "PURO", "QUADRO", "QUATTRO", "QUI", "RANA", "RAGNO", "RAMO", "RATO", "RE", 
    "RETE", "RICCO", "RISO", "RIVA", "ROBA", "ROCCA", "ROSA", "ROSSO", "ROTA", "RUOTA", 
    "SABBIA", "SACCO", "SALE", "SALTO", "SANGUE", "SANTO", "SAPONE", "SASSO", "SCALA", "SCATOLA", 
    "SCUOLA", "SECCHIO", "SEDE", "SEGNO", "SELLA", "SEME", "SENSO", "SERA", "SERPE", "SETE", 
    "SETTE", "SFERA", "SFIDA", "SI", "SLITTA", "SOGNO", "SOLDI", "SOLE", "SONNO", "SOPRA", 
    "SORELLA", "SORRISO", "SOTTO", "SPADA", "SPAGO", "SPAZIO", "SPIA", "SPORT", "SPOSA", "STALLA", 
    "STANZA", "STELLA", "STORIA", "STRADA", "SUCCO", "SUONO", "SUORA", "TAVOLO", "TAZZA", "TE", 
    "TEMPO", "TENDA", "TERRA", "TESTA", "TETTO", "TIGRE", "TIPO", "TIRO", "TOPO", "TORRE", 
    "TORTA", "TRE", "TRENO", "TRONO", "TUBO", "TUTTO", "UCCELLO", "UOMO", "UOVO", "UVA", 
    "VACA", "VALLE", "VAPORE", "VASO", "VELA", "VELO", "VENA", "VENTO", "VERDE", "VERO", 
    "VESTA", "VETRO", "VIA", "VIAGGIO", "VITA", "VOCE", "VOLO", "VOLPE", "VOLTO", "VOTO", 
    "ZAFFIRO", "ZAINO", "ZAMPA", "ZERO", "ZIA", "ZIO", "ZONA", "ZOO", "ZUPPA"
];

const SAFE_WORD_LIST = [...ITALIAN_WORDS, ...Array(256).fill('BOO')].slice(0, 256);

// V2 Default - Used only for fallback in decoding, NOT for initial state
const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
    charIndex: 0,
    bgIndex: 0
};

const INITIAL_PROGRESS: PlayerProgress = {
    playerName: '',
    avatar: 'BOY',
    avatarConfig: undefined, // IMPORTANT: Start undefined so we know user hasn't created one
    tokens: 0,
    unlockedStickers: [],
    hardModeUnlocked: false,
    duplicates: 0,
    duplicateStickers: [],
    currentAlbum: 1
};

export const getProgress = (): PlayerProgress => {
    try {
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            const parsed = JSON.parse(localData);
            if (parsed && typeof parsed === 'object') {
                return { ...INITIAL_PROGRESS, ...parsed };
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

export const setPlayerName = (name: string, avatar: 'BOY' | 'GIRL') => {
    const progress = getProgress();
    progress.playerName = name.trim().toUpperCase();
    progress.avatar = avatar;
    saveProgress(progress);
};

// Explicitly define return type to fix inference errors in consumer components
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

export const unlockHardMode = (): boolean => {
    const progress = getProgress();
    if (progress.tokens >= 1500) {
        progress.tokens -= 1500;
        progress.hardModeUnlocked = true;
        saveProgress(progress);
        return true;
    }
    return false;
}

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

export const upgradeToNextAlbum = (): boolean => {
    const progress = getProgress();
    if (progress.currentAlbum === 1) {
        progress.currentAlbum = 2;
        saveProgress(progress);
        return true;
    }
    return false;
}

const getWordIndex = (word: string): number => SAFE_WORD_LIST.indexOf(word.toUpperCase());
const calculateChecksum = (bytes: number[]): number => {
    let sum1 = 0, sum2 = 0;
    for (let byte of bytes) {
        sum1 = (sum1 + byte) % 255;
        sum2 = (sum2 + sum1) % 255;
    }
    return (sum1 + sum2) % 256;
};

// --- ENCODE V2: SIMPLIFIED ---
export const encodePassport = (data: PlayerProgress): string => {
    try {
        const bytes: number[] = [];

        // TOKENS (2 Bytes)
        const tokens = Math.min(data.tokens, 65535);
        bytes.push((tokens >> 8) & 0xFF);
        bytes.push(tokens & 0xFF);

        // STICKERS VOL 1 (4 Bytes)
        let stickerMask1 = 0;
        STICKERS_COLLECTION.forEach((s, idx) => { if (data.unlockedStickers.includes(s.id)) stickerMask1 |= (1 << idx); });
        if (data.avatar === 'GIRL') stickerMask1 |= (1 << 30);
        if (data.hardModeUnlocked) stickerMask1 |= (1 << 31);
        bytes.push((stickerMask1 >>> 24) & 0xFF);
        bytes.push((stickerMask1 >>> 16) & 0xFF);
        bytes.push((stickerMask1 >>> 8) & 0xFF);
        bytes.push(stickerMask1 & 0xFF);

        // STICKERS VOL 2 (4 Bytes) - Optional
        if (data.currentAlbum && data.currentAlbum >= 2) {
            let stickerMask2 = 0;
            STICKERS_COLLECTION_VOL2.forEach((s, idx) => { if (data.unlockedStickers.includes(s.id)) stickerMask2 |= (1 << idx); });
            stickerMask2 |= (1 << 31); // Flag for Vol2 presence
            bytes.push((stickerMask2 >>> 24) & 0xFF);
            bytes.push((stickerMask2 >>> 16) & 0xFF);
            bytes.push((stickerMask2 >>> 8) & 0xFF);
            bytes.push(stickerMask2 & 0xFF);
        }

        // AVATAR V2 (2 Bytes)
        // Byte 1: Character Index (0-255)
        // Byte 2: Background Index (0-255)
        const ac = data.avatarConfig || DEFAULT_AVATAR_CONFIG;
        // Basic clamp to avoid errors if index is huge
        bytes.push(Math.min(ac.charIndex, 255));
        bytes.push(Math.min(ac.bgIndex, 255));

        // CHECKSUM
        bytes.push(calculateChecksum(bytes));

        const words = bytes.map(b => SAFE_WORD_LIST[b]);
        const name = data.playerName ? data.playerName.split(' ')[0] : 'AGENTE';
        
        return [name, ...words].join(' ');

    } catch (e) { return "ERRORE"; }
};

export const decodePassport = (phrase: string): PlayerProgress | null => {
    try {
        const words = phrase.trim().toUpperCase().split(/[\s-]+/).filter(w => w.length > 0);
        if (words.length < 8) return null;

        const name = words[0];
        const allBytes = words.slice(1).map(w => getWordIndex(w));
        if (allBytes.includes(-1)) return null;

        const payloadBytes = allBytes.slice(0, -1);
        const providedChecksum = allBytes[allBytes.length - 1];
        if (calculateChecksum(payloadBytes) !== providedChecksum) return null;

        const bytes = payloadBytes;
        let cursor = 0;

        // TOKENS
        const tokens = (bytes[cursor] << 8) | bytes[cursor + 1];
        cursor += 2;

        // STICKERS 1
        let mask1 = ((bytes[cursor] << 24) | (bytes[cursor+1] << 16) | (bytes[cursor+2] << 8) | bytes[cursor+3]) >>> 0;
        cursor += 4;
        
        const unlockedStickers: string[] = [];
        const avatar = (mask1 & (1 << 30)) ? 'GIRL' : 'BOY';
        const hardModeUnlocked = (mask1 & (1 << 31)) !== 0;

        STICKERS_COLLECTION.forEach((s, idx) => { if ((mask1 & (1 << idx)) !== 0) unlockedStickers.push(s.id); });

        let currentAlbum = 1;

        if (cursor < bytes.length) {
            const remaining = bytes.length - cursor;
            
            // CHECK VOL 2
            if (remaining >= 4) {
                 // Check potential Vol2 mask
                 let potentialMask2 = ((bytes[cursor] << 24) | (bytes[cursor+1] << 16) | (bytes[cursor+2] << 8) | bytes[cursor+3]) >>> 0;
                 // Vol2 mask must have bit 31 set
                 if ((potentialMask2 & (1 << 31)) !== 0) {
                     STICKERS_COLLECTION_VOL2.forEach((s, idx) => { if ((potentialMask2 & (1 << idx)) !== 0) unlockedStickers.push(s.id); });
                     currentAlbum = 2;
                     cursor += 4;
                 }
            }
        }

        // AVATAR DECODE V2 (Expect 2 Bytes remaining)
        let avatarConfig = DEFAULT_AVATAR_CONFIG;
        
        // If we have at least 2 bytes left, assume it's the new format
        if (cursor + 2 <= bytes.length) {
             const charIdx = bytes[cursor];
             const bgIdx = bytes[cursor+1];
             avatarConfig = { charIndex: charIdx, bgIndex: bgIdx };
        } else if (cursor + 5 <= bytes.length) {
             // Legacy V1 Avatar (5 bytes) - Reset to default because it's incompatible
             // or try to map it? Nah, reset is safer for now.
             avatarConfig = DEFAULT_AVATAR_CONFIG;
        }

        return {
            ...INITIAL_PROGRESS,
            playerName: name,
            avatar,
            tokens,
            unlockedStickers,
            hardModeUnlocked,
            currentAlbum,
            avatarConfig
        };

    } catch (e) { return null; }
};

export const getPassportCode = (): string => {
    const progress = getProgress();
    return encodePassport(progress);
};

export const restorePassport = (code: string): boolean => {
    const decoded = decodePassport(code);
    if (decoded) {
        saveProgress(decoded);
        return true;
    }
    return false;
};
