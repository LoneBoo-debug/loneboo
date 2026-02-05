
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppView, PlayerProgress } from '../types';
import { getProgress, equipClothing, purchaseClothing } from '../services/tokens';
import { ATELIER_COMBO_CSV_URL } from '../constants';
import { ChevronLeft, ChevronRight, Check, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';

const BG_ATELIER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfatelieradjncnd77en3h32ws.webp';
const BOO_BASE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boonudoede32ws34r.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

const BTN_TSHIRT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtbooteliren4r699gt+(1).webp';
const BTN_HATS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/capprllibuttonboo6trate+(1).webp';
const BTN_GLASSES = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/occhialibuttonboosate6t54+(1).webp';

const BTN_ACQUISTA_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/acquisatelier55r+(1).webp';
const IMG_ALERT_NO_TOKENS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/genericalertnoacqui5r4r3.webp';

const BTN_INDOSSA_MENU = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ndossabuttonemenutendi88+(1).webp';
const BTN_RIMUOVI_MENU = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rimuvobutoenmndutdbexs+(1).webp';

interface AtelierItem {
    id: string;
    icon: string;
    price: number;
    category: Category;
}

const TSHIRT_DATA: AtelierItem[] = [
    { id: 'T1', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtbooyellow3e32w+(1).webp', price: 10, category: 'TSHIRT' },
    { id: 'T2', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtboostar4e4e4+(1).webp', price: 15, category: 'TSHIRT' },
    { id: 'T3', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtboolove8i87u+(1).webp', price: 20, category: 'TSHIRT' },
    { id: 'T4', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtboogray55+(1).webp', price: 12, category: 'TSHIRT' },
    { id: 'T5', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtboogreen67y67y+(1).webp', price: 12, category: 'TSHIRT' }
];

const HAT_DATA: AtelierItem[] = [
    { id: 'H1', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cappellinoboosimpa5t5y6y+(1).webp', price: 8, category: 'HATS' },
    { id: 'H2', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cappellozuccotooboo5r5r+(1).webp', price: 10, category: 'HATS' },
    { id: 'H3', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cappelloboootuba3e3e3+(1).webp', price: 25, category: 'HATS' },
    { id: 'H4', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/capprllopirtaboo5t6t6+(1).webp', price: 18, category: 'HATS' },
    { id: 'H5', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coronaboo3e3e+(1).webp', price: 50, category: 'HATS' }
];

const GLASSES_DATA: AtelierItem[] = [
    { id: 'G1', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/glassblackboo98ud83+(1).webp', price: 5, category: 'GLASSES' },
    { id: 'G2', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/glassloveboo9i8j32+(1).webp', price: 10, category: 'GLASSES' },
    { id: 'G3', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/glasspilotboo7ue7h3+(1).webp', price: 15, category: 'GLASSES' },
    { id: 'G4', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/glassredboo9i8u+(1).webp', price: 7, category: 'GLASSES' },
    { id: 'G5', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/glassrotondboo432+(1).webp', price: 8, category: 'GLASSES' }
];

type Category = 'TSHIRT' | 'HATS' | 'GLASSES';
type MenuType = Category | null;

interface ActionFeedback {
    message: string;
    icon?: string;
    type: 'SUCCESS' | 'ERROR';
}

const AtelierView: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [openMenu, setOpenMenu] = useState<MenuType>(null);
    const [progress, setProgress] = useState<PlayerProgress>(getProgress());
    
    // previewLook memorizza la configurazione attuale degli oggetti visualizzati su Boo
    const [previewLook, setPreviewLook] = useState(progress.equippedClothing);
    const [comboMap, setComboMap] = useState<Record<string, string>>({});
    
    // Feedback e Pulsanti d'azione
    const [itemToBuy, setItemToBuy] = useState<AtelierItem | null>(null);
    const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
    
    const menuRef = useRef<HTMLDivElement>(null);
    const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Caricamento mappa combinazioni dal foglio Google
    useEffect(() => {
        const fetchMap = async () => {
            try {
                const response = await fetch(ATELIER_COMBO_CSV_URL);
                if (response.ok) {
                    const text = await response.text();
                    const cleanText = text.replace(/\r/g, '');
                    const lines = cleanText.split('\n');
                    const map: Record<string, string> = {};
                    lines.slice(1).forEach(line => {
                        if (!line.trim()) return;
                        const separator = line.includes(';') ? ';' : ',';
                        // Rimuove virgolette e spazi bianchi da chiavi e URL
                        const parts = line.split(separator).map(s => s.trim().replace(/^"|"$/g, ''));
                        if (parts.length >= 2) {
                            const [key, url] = parts;
                            if (key && url) map[key.toUpperCase()] = url;
                        }
                    });
                    setComboMap(map);
                }
            } catch (e) { console.error("Atelier: Error fetching combo map:", e); }
        };
        fetchMap();
        
        // Sincronizzazione con il progresso salvato
        const syncProgress = () => {
            const p = getProgress();
            setProgress(p);
            setPreviewLook(p.equippedClothing);
        };
        window.addEventListener('progressUpdated', syncProgress);
        
        setTimeout(() => setIsLoaded(true), 800);
        return () => {
            window.removeEventListener('progressUpdated', syncProgress);
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        };
    }, []);

    // ALGORITMO DI RISOLUZIONE IMMAGINE (Stacking Logic)
    const currentBooImage = useMemo(() => {
        const activeIds = Object.values(previewLook)
            .filter(Boolean)
            .map(id => (id as string).toUpperCase());

        if (activeIds.length === 0) return BOO_BASE;

        // 1. Prova combinazione corrente (può essere singola H1 o multipla H1_T1)
        // Ordinando e unendo, gestiamo sia i singoli che i mix nello stesso modo
        const currentKey = [...activeIds].sort().join('_');
        if (comboMap[currentKey]) return comboMap[currentKey];

        // 2. Se abbiamo 3 oggetti ma non c'è la combo da 3, prova le coppie (es. H1_T1)
        if (activeIds.length === 3) {
            const pairs = [
                [previewLook.hat, previewLook.tshirt],
                [previewLook.glasses, previewLook.tshirt],
                [previewLook.glasses, previewLook.hat]
            ];
            for (const pair of pairs) {
                if (pair[0] && pair[1]) {
                    const pairKey = pair.map(id => (id as string).toUpperCase()).sort().join('_');
                    if (comboMap[pairKey]) return comboMap[pairKey];
                }
            }
        }

        // 3. Fallback sull'oggetto singolo se non troviamo combo
        // Priorità: Occhiali > Cappello > Maglietta
        const priorityOrder: (keyof typeof previewLook)[] = ['glasses', 'hat', 'tshirt'];
        for (const key of priorityOrder) {
            const id = (previewLook[key] as string | undefined)?.toUpperCase();
            if (id && comboMap[id]) return comboMap[id];
        }

        return BOO_BASE;
    }, [previewLook, comboMap]);

    const toggleMenu = (menu: Category) => {
        setOpenMenu(prev => prev === menu ? null : menu);
        setActionFeedback(null);
    };

    // Il bambino tocca un oggetto nel menu: lo visualizziamo in anteprima mantenendo gli altri
    const handleSelectItem = (item: AtelierItem) => {
        const key = item.category.toLowerCase() as 'tshirt' | 'hat' | 'glasses';
        const isOwned = progress.purchasedClothing.includes(item.id);

        // Se l'oggetto è lo stesso già presente in preview, lo togliamo (toggle)
        if (previewLook[key] === item.id) {
            setPreviewLook(prev => ({ ...prev, [key]: undefined }));
            setItemToBuy(null);
        } else {
            // Aggiorniamo solo lo slot specifico, mantenendo gli altri (STACKING)
            setPreviewLook(prev => ({ ...prev, [key]: item.id }));
            // Mostriamo il tasto acquista solo se non lo possediamo già
            if (!isOwned) {
                setItemToBuy(item);
            } else {
                setItemToBuy(null);
            }
        }
        
        setActionFeedback(null);
        // CHIUDI IL MENU dopo la selezione per vedere l'anteprima pulita
        setOpenMenu(null);
    };

    const handleEquipDirect = (item: AtelierItem) => {
        const key = item.category.toLowerCase() as 'tshirt' | 'hat' | 'glasses';
        equipClothing(key, item.id);
        
        // Aggiorniamo lo stato locale
        const p = getProgress();
        setProgress(p);
        setPreviewLook(p.equippedClothing);
        
        // Messaggio specifico per categoria
        const labels: Record<Category, string> = {
            TSHIRT: "MAGLIETTA INDOSSATA!",
            HATS: "CAPPELLO INDOSSATO!",
            GLASSES: "OCCHIALI INDOSSATI!"
        };

        triggerFeedback(labels[item.category], "SUCCESS", item.icon);
        setOpenMenu(null);
        setItemToBuy(null);
    };

    const handleRemoveDirect = (cat: Category) => {
        const key = cat.toLowerCase() as 'tshirt' | 'hat' | 'glasses';
        equipClothing(key, undefined);
        
        const p = getProgress();
        setProgress(p);
        setPreviewLook(p.equippedClothing);
        
        // Messaggio specifico per categoria
        const labels: Record<Category, string> = {
            TSHIRT: "MAGLIETTA RIMOSSA!",
            HATS: "CAPPELLO RIMOSSO!",
            GLASSES: "OCCHIALI RIMOSSI!"
        };

        triggerFeedback(labels[cat], "SUCCESS");
        setOpenMenu(null);
        setItemToBuy(null);
    };

    const triggerFeedback = (message: string, type: 'SUCCESS' | 'ERROR', icon?: string) => {
        setActionFeedback({ message, type, icon });
        if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = setTimeout(() => {
            setActionFeedback(null);
        }, 4000);
    };

    // Azione del tastone principale "Acquista"
    const handleAction = () => {
        if (!itemToBuy) return;

        if (purchaseClothing(itemToBuy.id, itemToBuy.price)) {
            // Se l'acquisto va a buon fine, lo equipaggiamo anche
            const key = itemToBuy.category.toLowerCase() as 'tshirt' | 'hat' | 'glasses';
            equipClothing(key, itemToBuy.id);
            
            const p = getProgress();
            setProgress(p);
            setPreviewLook(p.equippedClothing);

            // Messaggio specifico per categoria
            const buyLabels: Record<Category, string> = {
                TSHIRT: "MAGLIETTA ACQUISTATA!",
                HATS: "CAPPELLO ACQUISTATO!",
                GLASSES: "OCCHIALI ACQUISTATI!"
            };

            triggerFeedback(buyLabels[itemToBuy.category], "SUCCESS", itemToBuy.icon);
            setItemToBuy(null);
            setOpenMenu(null);
        } else {
            triggerFeedback("NON HAI ABBASTANZA GETTONI!", "ERROR");
        }
    };

    const handleExit = () => {
        const origin = sessionStorage.getItem('atelier_origin') as AppView;
        if (origin && Object.values(AppView).includes(origin)) {
            setView(origin);
        } else {
            setView(AppView.BOO_BATHROOM);
        }
        sessionStorage.removeItem('atelier_origin');
    };

    const renderDropdown = (items: AtelierItem[], cat: Category) => (
        <div className="absolute top-[110%] right-0 bg-white/40 backdrop-blur-2xl border-4 border-blue-400 rounded-[2.5rem] shadow-2xl p-3 flex flex-col gap-2 w-[200px] md:w-[260px] animate-in slide-in-from-top-4 duration-300 z-[100]">
            <div className="flex flex-col gap-3">
                {items.map((item) => {
                    const isOwned = progress.purchasedClothing.includes(item.id);
                    const isEquipped = progress.equippedClothing[item.category.toLowerCase() as 'tshirt' | 'hat' | 'glasses'] === item.id;
                    const isPreviewed = previewLook[item.category.toLowerCase() as 'tshirt' | 'hat' | 'glasses'] === item.id;

                    return (
                        <div 
                            key={item.id} 
                            onPointerDown={(e) => {
                                e.preventDefault();
                                handleSelectItem(item);
                            }}
                            className={`flex items-center gap-1 transition-all p-1 rounded-2xl border-2 cursor-pointer ${isPreviewed ? 'border-yellow-400 bg-white/50 shadow-lg' : 'border-transparent bg-black/5 active:scale-95'}`}
                        >
                            <div className="relative shrink-0 pointer-events-none">
                                <img src={item.icon} alt="item" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md" />
                                {isOwned && <div className="absolute -top-1 -left-1 bg-green-500 rounded-full p-1 border-2 border-white shadow-sm z-10"><Check size={10} className="text-white" strokeWidth={5} /></div>}
                            </div>
                            
                            <div className="flex-1 flex items-center justify-end pr-0.5">
                                {isOwned ? (
                                    <div className="flex items-center pointer-events-auto">
                                        {!isEquipped ? (
                                            <button 
                                                onPointerDown={(e) => { e.stopPropagation(); handleEquipDirect(item); }}
                                                className="hover:scale-105 active:scale-95 transition-all outline-none"
                                            >
                                                <img src={BTN_INDOSSA_MENU} alt="Indossa" className="h-10 md:h-12 w-auto drop-shadow-md" />
                                            </button>
                                        ) : (
                                            <button 
                                                onPointerDown={(e) => { e.stopPropagation(); handleRemoveDirect(cat); }}
                                                className="hover:scale-105 active:scale-95 transition-all outline-none"
                                            >
                                                <img src={BTN_RIMUOVI_MENU} alt="Rimuovi" className="h-10 md:h-12 w-auto drop-shadow-md" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 font-black text-base md:text-2xl text-slate-800 drop-shadow-sm pointer-events-none">
                                        <span>{item.price}</span>
                                        <span className="text-lg md:text-xl">🪙</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="text-center pt-1.5 mt-0.5 border-t border-white/10 pointer-events-none">
                <p className="text-[8px] font-black text-blue-800 uppercase tracking-widest opacity-60">Personalizza Boo!</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-700">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes boo-vibe {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-10px) scale(1.02); }
                }
                @keyframes lucky-breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
                .boo-animation { animation: boo-vibe 4s ease-in-out infinite; }
                .text-stroke-lucky {
                    -webkit-text-stroke: 2px black;
                    text-shadow: 4px 4px 0px rgba(0,0,0,0.5);
                }
                .animate-lucky-breathe {
                    animation: lucky-breathe 2.5s ease-in-out infinite;
                }
            `}</style>

            <div className="absolute inset-0 z-0">
                <img src={BG_ATELIER} alt="" className="w-full h-full object-fill" />
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="relative w-full h-full flex items-center justify-center max-w-4xl mx-auto">
                    <img 
                        src={currentBooImage} 
                        alt="Boo" 
                        className={`w-full h-full object-contain boo-animation transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.4))' }}
                    />
                </div>
            </div>

            <div className="relative z-50 w-full pt-[75px] md:pt-[105px] px-6 flex justify-between items-center pointer-events-none">
                <div className="flex items-center gap-3 pointer-events-auto">
                    <button 
                        onClick={handleExit}
                        className="hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <img src={BTN_CLOSE_IMG} alt="Esci" className="w-14 h-14 md:w-22 h-auto drop-shadow-xl" />
                    </button>
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                        <span>{progress.tokens}</span> <span className="text-xl">🪙</span>
                    </div>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-3 pointer-events-auto" ref={menuRef}>
                    <div className="relative">
                        <button onClick={() => toggleMenu('TSHIRT')} className="hover:scale-110 active:scale-95 transition-all outline-none">
                            <img src={BTN_TSHIRT} alt="T-shirt" className="w-14 h-14 md:w-22 h-auto drop-shadow-xl scale-110" />
                        </button>
                        {openMenu === 'TSHIRT' && renderDropdown(TSHIRT_DATA, 'TSHIRT')}
                    </div>
                    <div className="relative">
                        <button onClick={() => toggleMenu('HATS')} className="hover:scale-110 active:scale-95 transition-all outline-none">
                            <img src={BTN_HATS} alt="Cappelli" className="w-14 h-14 md:w-22 h-auto drop-shadow-xl" />
                        </button>
                        {openMenu === 'HATS' && renderDropdown(HAT_DATA, 'HATS')}
                    </div>
                    <div className="relative">
                        <button onClick={() => toggleMenu('GLASSES')} className="hover:scale-110 active:scale-95 transition-all outline-none">
                            <img src={BTN_GLASSES} alt="Occhiali" className="w-14 h-14 md:w-22 h-auto drop-shadow-xl" />
                        </button>
                        {openMenu === 'GLASSES' && renderDropdown(GLASSES_DATA, 'GLASSES')}
                    </div>
                </div>
            </div>

            {/* AREA ACQUISTO DINAMICA */}
            {itemToBuy && (
                <div className="absolute bottom-[4%] left-6 z-50 flex items-center gap-4 animate-in slide-in-from-left-10 duration-500 pointer-events-none">
                    {/* CARD INFO OGGETTO */}
                    <div className="bg-white/90 backdrop-blur-md p-2 rounded-3xl border-4 border-yellow-400 shadow-2xl flex items-center gap-3 pr-6 pointer-events-auto">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-2xl border-2 border-blue-100 flex items-center justify-center p-1">
                            <img src={itemToBuy.icon} alt="buy-item" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-blue-900 text-[10px] md:text-xs uppercase opacity-60">Stai provando</span>
                            <div className="flex items-center gap-2">
                                <span className="font-black text-2xl md:text-4xl text-slate-800">{itemToBuy.price}</span>
                                <span className="text-xl md:text-3xl">🪙</span>
                            </div>
                        </div>
                    </div>

                    {/* TASTO ACQUISTA */}
                    <button 
                        onClick={handleAction}
                        className="hover:scale-105 active:scale-95 transition-all outline-none pointer-events-auto"
                    >
                        <img 
                            src={BTN_ACQUISTA_IMG} 
                            alt="Acquista" 
                            className="w-40 md:w-60 h-auto drop-shadow-2xl" 
                        />
                    </button>
                </div>
            )}

            {actionFeedback && (
                <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center pointer-events-none animate-in zoom-in duration-500 px-4">
                    <div className="flex flex-col items-center gap-6 animate-lucky-breathe">
                        {actionFeedback.type === 'SUCCESS' ? (
                            <>
                                <h2 className="font-luckiest text-white text-4xl md:text-8xl uppercase text-center text-stroke-lucky tracking-tighter">
                                    {actionFeedback.message}
                                </h2>
                                {actionFeedback.icon && (
                                    <div className="relative w-32 h-32 md:w-56 md:h-56">
                                        <img 
                                            src={actionFeedback.icon} 
                                            className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] rotate-[-6deg]" 
                                            alt="" 
                                        />
                                        <Sparkles className="absolute -top-4 -right-4 text-yellow-400 animate-pulse" size={48} />
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <img 
                                    src={IMG_ALERT_NO_TOKENS} 
                                    className="w-40 h-40 md:w-72 md:h-72 object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] rotate-[-12deg]" 
                                    alt="Alert" 
                                />
                                <h2 className="font-luckiest text-red-500 text-4xl md:text-8xl uppercase text-center text-stroke-lucky tracking-tighter leading-none">
                                    NON HAI ABBASTANZA<br/>GETTONI!
                                </h2>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AtelierView;
