export type BinType = 'PAPER' | 'PLASTIC' | 'GLASS' | 'ORGANIC';

export interface RecycleItem {
    id: number;
    name: string;
    icon: string; 
    image: string; 
    type: BinType;
}

export const RECYCLE_DATABASE: RecycleItem[] = [
    { id: 1, name: 'barattoli di vetro', icon: '🫙', image: 'https://i.postimg.cc/xT6B3zs5/barattoli-vetro.jpg', type: 'GLASS' },
    { id: 2, name: 'bicchiere di carta', icon: '🥤', image: 'https://i.postimg.cc/nzn1Wdzy/bicchiere-di-carta.jpg', type: 'PAPER' },
    { id: 3, name: 'bicchiere di vetro', icon: '🍷', image: 'https://i.postimg.cc/L8fB8dZX/bicchiere-di-vetro.jpg', type: 'GLASS' },
    { id: 4, name: 'bottiglietta', icon: '🍼', image: 'https://i.postimg.cc/3NVm398m/bottigli-plastica2.jpg', type: 'PLASTIC' },
    { id: 5, name: 'dispenser sapone', icon: '🧼', image: 'https://i.postimg.cc/vmhn4G8w/bottiglia-sapone-plastica.jpg', type: 'PLASTIC' },
    { id: 6, name: 'bottiglia di vino', icon: '🍾', image: 'https://i.postimg.cc/C53B317q/bottiglia-vino.jpg', type: 'GLASS' },
    { id: 7, name: 'bottiglia', icon: '🥤', image: 'https://i.postimg.cc/C1dRdD6H/bottiglietta-plastica.jpg', type: 'PLASTIC' },
    { id: 8, name: 'buccia di banana', icon: '🍌', image: 'https://i.postimg.cc/MXJHsLZ5/buccia-di-banana.jpg', type: 'ORGANIC' },
    { id: 9, name: 'carta regalo', icon: '🎁', image: 'https://i.postimg.cc/4NcW22Qx/carta-regalo.jpg', type: 'PAPER' },
    { id: 10, name: 'contenitore uova', icon: '🥚', image: 'https://i.postimg.cc/Dzv5ZvkW/cartone-uova.jpg', type: 'PAPER' },
    { id: 11, name: 'contenitori alimenti', icon: '🍱', image: 'https://i.postimg.cc/4xJpvW8q/contenitori-per-alimenti-in-plastica.jpg', type: 'PLASTIC' },
    { id: 12, name: 'fogli di quaderno', icon: '📄', image: 'https://i.postimg.cc/zf4LQ7jW/fogli-carta.jpg', type: 'PAPER' },
    { id: 13, name: 'giornali', icon: '📰', image: 'https://i.postimg.cc/y8dkYtp8/giornali.jpg', type: 'PAPER' },
    { id: 14, name: 'gusci d\'uovo', icon: '🥚', image: 'https://i.postimg.cc/858545pZ/gusc-uovo.jpg', type: 'ORGANIC' },
    { id: 15, name: 'lattina', icon: '🥤', image: 'https://i.postimg.cc/dVptQ1T2/lattina-de.jpg', type: 'PLASTIC' },
    { id: 16, name: 'lattina bibita', icon: '🥤', image: 'https://i.postimg.cc/nzYH1Gwc/lattina.jpg', type: 'PLASTIC' },
    { id: 17, name: 'flacone detersivo', icon: '🧴', image: 'https://i.postimg.cc/ZYHbBjds/ottiglia-detersivo-plastica.jpg', type: 'PLASTIC' },
    { id: 18, name: 'bottiglia vuota', icon: '🍾', image: 'https://i.postimg.cc/YCGMPHyz/ottiglia-vetro.jpg', type: 'GLASS' },
    { id: 19, name: 'posate usa e getta', icon: '🍴', image: 'https://i.postimg.cc/wvVpNT3n/posate-di-plastica.jpg', type: 'PLASTIC' },
    { id: 20, name: 'quotidiani', icon: '🗞️', image: 'https://i.postimg.cc/v80yHBJz/quotididnia.jpg', type: 'PAPER' },
    { id: 21, name: 'resti di anguria', icon: '🍉', image: 'https://i.postimg.cc/6QVJs5Vd/resti-anguria.jpg', type: 'ORGANIC' },
    { id: 22, name: 'resti di cibo', icon: '🍱', image: 'https://i.postimg.cc/yxdwSmMF/resti-di-cibo.jpg', type: 'ORGANIC' },
    { id: 23, name: 'resti di frutta', icon: '🍎', image: 'https://i.postimg.cc/xTXwfPy9/resti-di-frutta.jpg', type: 'ORGANIC' },
    { id: 24, name: 'rotoli carta igienica', icon: '🧻', image: 'https://i.postimg.cc/wjJnJTrp/rotoli-cartone.jpg', type: 'PAPER' },
    { id: 25, name: 'sacchetto del pane', icon: '🥖', image: 'https://i.postimg.cc/L5nbsHPx/sacchetto-carta.jpg', type: 'PAPER' },
    { id: 26, name: 'sacchetti per la spesa', icon: '🛍️', image: 'https://i.postimg.cc/hPQYWtcc/sacetti-plastica-2.jpg', type: 'PLASTIC' },
    { id: 27, name: 'scatola imballaggio', icon: '📦', image: 'https://i.postimg.cc/bvgCHG9c/scatola-cartone.jpg', type: 'PAPER' },
    { id: 28, name: 'scatole biscotti', icon: '🍪', image: 'https://i.postimg.cc/vZsw0VfB/scatole-biscotti.jpg', type: 'PAPER' },
    { id: 29, name: 'torsolo di mela', icon: '🍎', image: 'https://i.postimg.cc/WpBB4k90/torsolo-di-mela.jpg', type: 'ORGANIC' },
    { id: 30, name: 'vasetto yogurt vuoto', icon: '🍦', image: 'https://i.postimg.cc/JhYgCDDj/yougurt.jpg', type: 'PLASTIC' },
    { id: 31, name: 'vecchi libri strappati', icon: '📚', image: 'https://i.postimg.cc/65Vm512b/vecchi-libri.jpg', type: 'PAPER' },
    { id: 32, name: 'scatoletta tonno', icon: '🐟', image: 'https://i.postimg.cc/7Lhs9Hsq/scatoletta-tonno.jpg', type: 'PLASTIC' }
];