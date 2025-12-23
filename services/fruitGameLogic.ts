export interface FruitUpgrades {
    fireRate: number; // 0 to 5
    power: number;    // 1 to 5
    magnet: number;   // 0 to 5
    shield: number;   // 0 to 5
}

export interface FruitInventory {
    strawberries: number;
    bananas: number;
    grapes: number;
    oranges: number;
    apples: number;
    pears: number;
    pineapples: number;
    watermelons: number;
}

export interface FruitGameState {
    banknotes: number;
    upgrades: FruitUpgrades;
    inventory: FruitInventory;
    reachedLevel: number; // Nuovo campo per il progresso
}

const STORAGE_KEY = 'loneboo_fruit_game_state';

const DEFAULT_STATE: FruitGameState = {
    banknotes: 0,
    inventory: { 
        strawberries: 0, 
        bananas: 0, 
        grapes: 0, 
        oranges: 0, 
        apples: 0, 
        pears: 0,
        pineapples: 0, 
        watermelons: 0 
    },
    upgrades: { fireRate: 0, power: 1, magnet: 0, shield: 0 },
    reachedLevel: 1 // Livello iniziale predefinito
};

export const getFruitGameState = (): FruitGameState => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migrazione per vecchi salvataggi senza reachedLevel
            if (parsed && parsed.reachedLevel === undefined) {
                parsed.reachedLevel = 1;
            }
            return parsed;
        }
    } catch (e) { console.error(e); }
    return DEFAULT_STATE;
};

export const saveFruitGameState = (state: FruitGameState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('fruitStateUpdated'));
};

export const sellFruit = () => {
    const state = getFruitGameState();
    
    const earnings = 
        (state.inventory.strawberries * 2) + 
        (state.inventory.bananas * 3) + 
        (state.inventory.grapes * 7) + 
        (state.inventory.oranges * 10) + 
        (state.inventory.apples * 13) + 
        (state.inventory.pears * 15) +
        (state.inventory.pineapples * 17) + 
        (state.inventory.watermelons * 20);
    
    if (earnings === 0) return 0;

    state.banknotes += earnings;
    // Reset inventory
    state.inventory = { 
        strawberries: 0, 
        bananas: 0, 
        grapes: 0, 
        oranges: 0, 
        apples: 0, 
        pears: 0,
        pineapples: 0, 
        watermelons: 0 
    };
    
    saveFruitGameState(state);
    return earnings;
};

export const buyFruitUpgrade = (type: keyof FruitUpgrades): boolean => {
    const state = getFruitGameState();
    const currentLevel = state.upgrades[type];
    if (currentLevel >= 5) return false;

    const costs = [200, 500, 1200, 2500, 5000];
    const cost = costs[currentLevel] || 99999;

    if (state.banknotes >= cost) {
        state.banknotes -= cost;
        state.upgrades[type]++;
        saveFruitGameState(state);
        return true;
    }
    return false;
};