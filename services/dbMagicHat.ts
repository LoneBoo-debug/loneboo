export interface HatItem {
    id: string;
    name: string;
    img: string;
}

export interface HatRecipe {
    name: string;
    img: string;
    desc: string;
}

// --- DATABASE OGGETTI INPUT ---
export const HAT_INPUT_ITEMS: HatItem[] = [
    { id: 'aereo', name: 'Aereo', img: 'https://i.postimg.cc/NMjHWp2J/aereo.png' },
    { id: 'auto', name: 'Automobile', img: 'https://i.postimg.cc/GtZTTRgH/auoxx.png' },
    { id: 'cane', name: 'Cagnolino', img: 'https://i.postimg.cc/Hk08nfQF/canexx.png' },
    { id: 'coniglio', name: 'Coniglietto', img: 'https://i.postimg.cc/LsHY1NDY/conixx.png' },
    { id: 'fantasma', name: 'Fantasma', img: 'https://i.postimg.cc/sXxMnxty/fantaxx.png' },
    { id: 'elefante', name: 'Elefante', img: 'https://i.postimg.cc/26tVgmD7/fantexx.png' },
    { id: 'frigorifero', name: 'Frigorifero', img: 'https://i.postimg.cc/J0BGLg7z/frigo.png' },
    { id: 'frullatore', name: 'Frullatore', img: 'https://i.postimg.cc/1RgHX3fs/frullaxx.png' },
    { id: 'gatto', name: 'Gattino', img: 'https://i.postimg.cc/Qx1JgYgr/gattoxx.png' },
    { id: 'giraffa', name: 'Giraffa', img: 'https://i.postimg.cc/Cx4CXZ6b/giraffaxx.png' },
    { id: 'gufo', name: 'Gufo', img: 'https://i.postimg.cc/9fFPhW63/gufoxx.png' },
    { id: 'monopattino', name: 'Monopattino', img: 'https://i.postimg.cc/8CKRk2Gf/monoxx.png' },
    { id: 'orso', name: 'Orsetto', img: 'https://i.postimg.cc/B6jxjmZC/orsoxx.png' },
    { id: 'poltrona', name: 'Poltrona', img: 'https://i.postimg.cc/90TZpz70/poltroxx.png' },
    { id: 'ragno', name: 'Ragnetto', img: 'https://i.postimg.cc/gkFv0yCj/ragnoxx.png' },
    { id: 'ruota', name: 'Ruota', img: 'https://i.postimg.cc/wj9LXqT7/ruota.png' },
    { id: 'sedia', name: 'Sedia', img: 'https://i.postimg.cc/256Wt0Zt/sedia.png' },
    { id: 'tavolo', name: 'Tavolo', img: 'https://i.postimg.cc/d0xCcGRk/tavolo.png' },
    { id: 'topo', name: 'Topolino', img: 'https://i.postimg.cc/ZRvdb0Vh/topoxx.png' },
    { id: 'tv', name: 'Televisore', img: 'https://i.postimg.cc/xjHzBJXb/tvxxx.png' }
];

// --- DATABASE RICETTE ---
// I percorsi ora puntano correttamente alla cartella public (mappata come /assets/...)
export const HAT_RECIPES: Record<string, HatRecipe> = {
    'aereo-cane': { 
        name: 'Super Dog Volante!', 
        img: '/assets/images/magichat/aereo_cane.webp', 
        desc: 'Un cucciolo che abbaia tra le nuvole!' 
    },
    'aereo-auto': { 
        name: 'VolaVruum', 
        img: '/assets/images/magichat/aereo_auto.webp', 
        desc: 'Il sogno di ogni autista...' 
    },
};