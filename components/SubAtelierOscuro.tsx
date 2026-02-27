
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppView, PlayerProgress } from '../types';
import { getProgress, equipClothing, purchaseClothing } from '../services/tokens';
import { ATELIER_COMBO_CSV_URL, TOKEN_ICON_URL } from '../constants';
import TokenIcon from './TokenIcon';
import { Check, Sparkles, Copy, ShoppingCart } from 'lucide-react';
import { getSubMusic, playSubMusic, pauseSubMusic } from '../services/bgMusic';

const BG_ATELIER_OSCURO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfondoatelieroscurowebdsa3.webp';
const BOO_BASE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boonudoede32ws34r.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

const BTN_HATS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cappellisotternnai.webp';
const BTN_TSHIRT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/magliettesotterianue.webp';
const BTN_COMPLETI = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/completisotterianu4hw.webp';
const BTN_OGGETTI = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/oggettisotteranie77.webp';

const BTN_ACQUISTA_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/acquioscuroateli56721.webp';
const IMG_ALERT_NO_TOKENS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/genericalertnoacqui5r4r3.webp';
const BTN_INDOSSA_MENU = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ndossabuttonemenutendi88+(1).webp';
const BTN_RIMUOVI_MENU = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rimuvobutoenmndutdbexs+(1).webp';

const BTN_AUDIO_ON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';
const BTN_AUDIO_OFF = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';
const EXPLORE_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diamond_tunes-spectral-resonance-269427.mp3';

type Category = 'HATS' | 'TSHIRT' | 'COMPLETI' | 'OGGETTI';
type MenuType = Category | null;

interface AtelierItem {
    id: string;
    icon: string;
    overlay?: string; 
    price: number;
    category: Category;
    slot: keyof PlayerProgress['equippedClothing'];
}

// Placeholder data - verranno popolati con le immagini fornite in seguito
const HAT_DATA: AtelierItem[] = [
    {
        id: 'SUB_HAT_BASCO',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bascooscuroboo5jen3.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bascooscuroboo5jen3.webp',
        price: 55,
        category: 'HATS',
        slot: 'hat'
    },
    {
        id: 'SUB_HAT_ELMO',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elmooscuroboo54.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elmooscuroboo54.webp',
        price: 55,
        category: 'HATS',
        slot: 'hat'
    },
    {
        id: 'SUB_HAT_MAGO',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/magoboooscuro6789.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/magoboooscuro6789.webp',
        price: 40,
        category: 'HATS',
        slot: 'hat'
    },
    {
        id: 'SUB_HAT_COWBOY',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cowboyoscuro44e23.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cowboyoscuro44e23.webp',
        price: 40,
        category: 'HATS',
        slot: 'hat'
    }
];
const TSHIRT_DATA: AtelierItem[] = [
    {
        id: 'SUB_TSHIRT_RUDEN',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rudenfien4wsd.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rudenfien4wsd.webp',
        price: 70,
        category: 'TSHIRT',
        slot: 'tshirt'
    },
    {
        id: 'SUB_TSHIRT_MAGIC',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/magictoeern4w.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/magictoeern4w.webp',
        price: 70,
        category: 'TSHIRT',
        slot: 'tshirt'
    },
    {
        id: 'SUB_TSHIRT_ONEBOO',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/onebootshirtue432.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/onebootshirtue432.webp',
        price: 70,
        category: 'TSHIRT',
        slot: 'tshirt'
    },
    {
        id: 'SUB_TSHIRT_COORAA',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cooraaoscurobooe4.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cooraaoscurobooe4.webp',
        price: 70,
        category: 'TSHIRT',
        slot: 'tshirt'
    },
    {
        id: 'SUB_TSHIRT_LONEBOO',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/loneboooscurotshirt.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/loneboooscurotshirt.webp',
        price: 70,
        category: 'TSHIRT',
        slot: 'tshirt'
    }
];
const COMPLETI_DATA: AtelierItem[] = [
    {
        id: 'SUB_ELF_OUTFIT',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elfatelierscoiru54.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elfatelierscoiru54.webp',
        price: 120,
        category: 'COMPLETI',
        slot: 'special5'
    },
    {
        id: 'SUB_DEMOGORGON_OUTFIT',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/demogorgoboo8ur.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/demogorgoboo8ur.webp',
        price: 150,
        category: 'COMPLETI',
        slot: 'special5'
    },
    {
        id: 'SUB_NINJA_OUTFIT',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ninjiaboosocuteate44.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ninjiaboosocuteate44.webp',
        price: 120,
        category: 'COMPLETI',
        slot: 'special5'
    },
    {
        id: 'SUB_ROBOT_OUTFIT',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rbotoneboodww+(1).webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rbotoneboodww+(1).webp',
        price: 120,
        category: 'COMPLETI',
        slot: 'special5'
    },
    {
        id: 'SUB_GLADIATOR_OUTFIT',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gladiatorboodnej33+(1).webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gladiatorboodnej33+(1).webp',
        price: 120,
        category: 'COMPLETI',
        slot: 'special5'
    }
];
const OGGETTI_DATA: AtelierItem[] = [
    {
        id: 'SUB_OBJ_CLOWN_NOSE',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nasorossoclownboo5.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nasorossoclownboo5.webp',
        price: 45,
        category: 'OGGETTI',
        slot: 'special3'
    },
    {
        id: 'SUB_OBJ_NECKLACE',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/collanaboooscuro.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/collanaboooscuro.webp',
        price: 45,
        category: 'OGGETTI',
        slot: 'special'
    },
    {
        id: 'SUB_OBJ_EYEPATCH',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bendaocchiboooscur.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bendaocchiboooscur.webp',
        price: 45,
        category: 'OGGETTI',
        slot: 'glasses'
    }
];

const HIDES_BASE_CLOTHING = ['SUB_ELF_OUTFIT', 'SUB_DEMOGORGON_OUTFIT', 'SUB_NINJA_OUTFIT', 'SUB_ROBOT_OUTFIT', 'SUB_GLADIATOR_OUTFIT', 'S5'];

const SPECIAL_OVERLAYS: Record<string, string> = {
    'S1': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sciarpacolorataboocaracters.webp',
    'S2': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cappelobeardnatalebbo5fr42.webp',
    'S3': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zuccahalloweenboocarxe4e3ws.webp',
    'S4': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boxcompete55rt44+(1).webp',
    'S5': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/completosera998gre.webp',
    'SUB_ELF_OUTFIT': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elfatelierscoiru54.webp',
    'SUB_DEMOGORGON_OUTFIT': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/demogorgoboo8ur.webp',
    'SUB_NINJA_OUTFIT': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ninjiaboosocuteate44.webp',
    'SUB_ROBOT_OUTFIT': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rbotoneboodww+(1).webp',
    'SUB_GLADIATOR_OUTFIT': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gladiatorboodnej33+(1).webp',
    'SUB_TSHIRT_RUDEN': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rudenfien4wsd.webp',
    'SUB_TSHIRT_MAGIC': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/magictoeern4w.webp',
    'SUB_TSHIRT_ONEBOO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/onebootshirtue432.webp',
    'SUB_TSHIRT_COORAA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cooraaoscurobooe4.webp',
    'SUB_TSHIRT_LONEBOO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/loneboooscurotshirt.webp',
    'SUB_OBJ_CLOWN_NOSE': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nasorossoclownboo5.webp',
    'SUB_OBJ_NECKLACE': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/collanaboooscuro.webp',
    'SUB_OBJ_EYEPATCH': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bendaocchiboooscur.webp',
    'SUB_HAT_BASCO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bascooscuroboo5jen3.webp',
    'SUB_HAT_ELMO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elmooscuroboo54.webp',
    'SUB_HAT_MAGO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/magoboooscuro6789.webp',
    'SUB_HAT_COWBOY': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cowboyoscuro44e23.webp'
};

interface ActionFeedback {
    message: string;
    icon?: string;
    type: 'SUCCESS' | 'ERROR';
}

const SubAtelierOscuro: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [openMenu, setOpenMenu] = useState<MenuType>(null);
    const [progress, setProgress] = useState<PlayerProgress>(getProgress());
    const [previewLook, setPreviewLook] = useState(progress.equippedClothing);
    const [comboMap, setComboMap] = useState<Record<string, string>>({});
    const [itemToBuy, setItemToBuy] = useState<AtelierItem | null>(null);
    const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
    const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_sub_bg_music_enabled') !== 'false');

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
                        const parts = line.split(/[;,]/).map(s => s.trim().replace(/^"|"$/g, ''));
                        if (parts.length >= 2) {
                            const [key, url] = parts;
                            if (key && url) map[key.toUpperCase()] = url;
                        }
                    });
                    setComboMap(map);
                }
            } catch (e) { console.error("SubAtelier: Error fetching combo map:", e); }
        };
        fetchMap();
        
        const syncProgress = () => {
            const p = getProgress();
            setProgress(p);
            setPreviewLook(p.equippedClothing);
        };
        window.addEventListener('progressUpdated', syncProgress);
        setTimeout(() => setIsLoaded(true), 800);

        const handleAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_sub_bg_music_enabled') !== 'false';
            setIsAudioOn(enabled);
            if (enabled) playSubMusic();
            else pauseSubMusic();
        };
        window.addEventListener('loneboo_sub_music_changed', handleAudioChange);

        return () => {
            window.removeEventListener('progressUpdated', syncProgress);
            window.removeEventListener('loneboo_sub_music_changed', handleAudioChange);
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (isLoaded) {
            if (isAudioOn) playSubMusic();
            else pauseSubMusic();
        }
    }, [isAudioOn, isLoaded]);

    const toggleAudio = () => {
        const nextState = !isAudioOn;
        setIsAudioOn(nextState);
        localStorage.setItem('loneboo_sub_bg_music_enabled', String(nextState));
        window.dispatchEvent(new Event('loneboo_sub_music_changed'));
        if (nextState) playSubMusic();
        else pauseSubMusic();
    };

    const currentBooImage = useMemo(() => {
        // Se è equipaggiato un completo speciale (special5), nascondiamo maglietta e cappello
        const isFullOutfitWorn = previewLook.special5 && HIDES_BASE_CLOTHING.includes(previewLook.special5);
        const isHeadOverlayWorn = previewLook.special2 === 'S2' || previewLook.special3 === 'S3' || previewLook.special4 === 'S4' || isFullOutfitWorn || (previewLook.hat && SPECIAL_OVERLAYS[previewLook.hat]);
        const isBodyOverlayWorn = isFullOutfitWorn || (previewLook.tshirt && SPECIAL_OVERLAYS[previewLook.tshirt]);

        const effectiveHat = isHeadOverlayWorn ? undefined : previewLook.hat;
        const effectiveTshirt = isBodyOverlayWorn ? undefined : previewLook.tshirt;

        const activeIds = [effectiveTshirt, effectiveHat, previewLook.glasses]
            .filter(Boolean)
            .map(id => (id as string).toUpperCase());

        if (activeIds.length === 0) return BOO_BASE;
        const currentKey = [...activeIds].sort().join('_');
        if (comboMap[currentKey]) return comboMap[currentKey];

        // Fallback: se la combo non esiste, prova a cercare i singoli pezzi in ordine di priorità
        // Includiamo anche i pezzi originali se quelli "effective" sono undefined (perché sono diventati overlay)
        const priorityOrder: (keyof typeof previewLook)[] = ['glasses', 'hat', 'tshirt'];
        for (const key of priorityOrder) {
            const idToUse = previewLook[key];
            const idStr = (idToUse as string | undefined)?.toUpperCase();
            if (idStr && comboMap[idStr]) return comboMap[idStr];
        }
        return BOO_BASE;
    }, [previewLook, comboMap]);

    const specialOverlayImages = useMemo(() => {
        const layers: string[] = [];
        
        // I completi speciali (special5)
        if (previewLook.special5 && SPECIAL_OVERLAYS[previewLook.special5]) {
            layers.push(SPECIAL_OVERLAYS[previewLook.special5]);
        }

        const slots: (keyof typeof previewLook)[] = ['glasses', 'tshirt', 'hat', 'special', 'special2', 'special3', 'special4'];
        slots.forEach(slot => {
            const id = previewLook[slot];
            if (id && SPECIAL_OVERLAYS[id]) {
                layers.push(SPECIAL_OVERLAYS[id]);
            }
        });
        return layers;
    }, [previewLook]);

    const toggleMenu = (menu: Category) => {
        setOpenMenu(prev => prev === menu ? null : menu);
        setActionFeedback(null);
    };

    const handleSelectItem = (item: AtelierItem) => {
        const slot = item.slot;
        const isOwned = progress.purchasedClothing.includes(item.id);
        if (previewLook[slot] === item.id) {
            // Deselecting: revert to equipped state for this slot
            setPreviewLook(prev => {
                const next = { ...prev, [slot]: progress.equippedClothing[slot] };
                // Restore mutual exclusion if needed
                if (slot === 'special5') {
                    next.hat = progress.equippedClothing.hat;
                    next.tshirt = progress.equippedClothing.tshirt;
                } else if ((slot === 'tshirt' || slot === 'hat') && !next.tshirt && !next.hat) {
                    next.special5 = progress.equippedClothing.special5;
                }
                return next;
            });
            setItemToBuy(null);
        } else {
            let nextLook = { ...previewLook, [slot]: item.id };
            
            // Logica mutua esclusione: I completi (special5) rimuovono magliette e cappelli
            if (slot === 'special5') {
                nextLook.hat = undefined;
                nextLook.tshirt = undefined;
            }
            // Se indosso una maglietta o un cappello, rimuovo il completo speciale
            else if (slot === 'tshirt' || slot === 'hat') {
                nextLook.special5 = undefined;
            }

            setPreviewLook(nextLook);
            if (!isOwned) setItemToBuy(item);
            else setItemToBuy(null);
        }
        setActionFeedback(null);
        setOpenMenu(null);
    };

    const handleEquipDirect = (item: AtelierItem) => {
        // Logica mutua esclusione persistente
        if (item.slot === 'special5') {
            equipClothing('hat', undefined);
            equipClothing('tshirt', undefined);
        } else if (item.slot === 'tshirt' || item.slot === 'hat') {
            equipClothing('special5', undefined);
        }

        equipClothing(item.slot, item.id);
        const p = getProgress();
        setProgress(p);
        setPreviewLook(p.equippedClothing);
        triggerFeedback("OGGETTO INDOSSATO!", "SUCCESS", item.icon);
        setOpenMenu(null);
    };

    const handleRemoveDirect = (item: AtelierItem) => {
        equipClothing(item.slot, undefined);
        const p = getProgress();
        setProgress(p);
        setPreviewLook(p.equippedClothing);
        triggerFeedback("OGGETTO RIMOSSO!", "SUCCESS");
        setOpenMenu(null);
    };

    const triggerFeedback = (message: string, type: 'SUCCESS' | 'ERROR', icon?: string) => {
        setActionFeedback({ message, type, icon });
        if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = setTimeout(() => setActionFeedback(null), 3000);
    };

    const handleAction = () => {
        if (!itemToBuy) return;
        if (purchaseClothing(itemToBuy.id, itemToBuy.price)) {
            // Logica mutua esclusione all'acquisto
            if (itemToBuy.slot === 'special5') {
                equipClothing('hat', undefined);
                equipClothing('tshirt', undefined);
            } else if (itemToBuy.slot === 'tshirt' || itemToBuy.slot === 'hat') {
                equipClothing('special5', undefined);
            }

            equipClothing(itemToBuy.slot, itemToBuy.id);
            const p = getProgress();
            setProgress(p);
            setPreviewLook(p.equippedClothing);
            triggerFeedback("ACQUISTATO!", "SUCCESS", itemToBuy.icon);
            setItemToBuy(null);
        } else {
            triggerFeedback("GETTONI INSUFFICIENTI!", "ERROR");
        }
    };

    const renderDropdown = (items: AtelierItem[], cat: Category) => {
        // Allineamento a destra per le ultime due categorie per evitare che escano dallo schermo
        const isRightAligned = cat === 'COMPLETI' || cat === 'OGGETTI';
        
        return (
            <div className={`absolute top-[110%] ${isRightAligned ? 'right-0' : 'left-1/2 -translate-x-1/2'} bg-slate-900/40 backdrop-blur-2xl border-4 border-purple-500 rounded-[2.5rem] shadow-2xl p-3 flex flex-col gap-2 w-[200px] md:w-[240px] animate-in slide-in-from-top-4 duration-300 z-[100]`}>
                {items.length === 0 ? (
                    <div className="text-purple-300 text-xs font-black uppercase text-center py-4 opacity-50 italic">In arrivo...</div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {items.map((item) => {
                            const isOwned = progress.purchasedClothing.includes(item.id);
                            const isEquipped = progress.equippedClothing[item.slot] === item.id;
                            const isPreviewed = previewLook[item.slot] === item.id;
                            return (
                                <div 
                                    key={item.id} 
                                    onClick={() => handleSelectItem(item)}
                                    className={`flex items-center gap-2 p-2 rounded-2xl border-2 cursor-pointer transition-all ${isPreviewed ? 'border-purple-400 bg-purple-500/20 shadow-lg' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                                >
                                    <img src={item.icon} alt="" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                                    <div className="flex-1 flex flex-col items-end">
                                        {isOwned ? (
                                            <div className="flex gap-1">
                                                {!isEquipped ? (
                                                    <button onClick={(e) => { e.stopPropagation(); handleEquipDirect(item); }}>
                                                        <img src={BTN_INDOSSA_MENU} className="h-8 md:h-10 w-auto" alt="Indossa" />
                                                    </button>
                                                ) : (
                                                    <button onClick={(e) => { e.stopPropagation(); handleRemoveDirect(item); }}>
                                                        <img src={BTN_RIMUOVI_MENU} className="h-8 md:h-10 w-auto" alt="Rimuovi" />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 font-black text-white text-sm md:text-lg">
                                                <span>{item.price}</span> <TokenIcon className="w-4 h-4 md:w-5 md:h-5" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-0 bg-black flex flex-col overflow-hidden animate-in fade-in duration-700">
            <style>{`
                @keyframes boo-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .boo-float { animation: boo-float 4s ease-in-out infinite; }
                .text-stroke-purple { -webkit-text-stroke: 2px #7e22ce; text-shadow: 0 0 20px rgba(126, 34, 206, 0.5); }
            `}</style>

            <img src={BG_ATELIER_OSCURO} alt="" className="absolute inset-0 w-full h-full object-fill" />

            {/* Avatar Section */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`relative w-full h-full max-w-4xl mx-auto flex items-center justify-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="boo-float relative w-full h-full flex items-center justify-center">
                        <img 
                            src={currentBooImage} 
                            alt="Boo" 
                            className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.3)]" 
                        />
                        {specialOverlayImages.map((src, i) => (
                            <img key={i} src={src} className="absolute inset-0 w-full h-full object-contain" alt="" />
                        ))}
                    </div>
                </div>
            </div>

            {/* HUD */}
            <div className="relative z-50 w-full pt-20 md:pt-28 pl-6 pr-2 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col items-start gap-4 pointer-events-auto">
                    <div className="bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border-2 border-purple-500/50 flex items-center gap-3 text-white font-black text-lg md:text-2xl shadow-2xl">
                        <span className="text-purple-400">{progress.tokens}</span> <TokenIcon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <button onClick={() => setView(AppView.MAGIC_TOWER_SUB_EXPLORE)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                        <img src={BTN_CLOSE_IMG} alt="Esci" className="w-16 h-16 md:w-24 h-auto drop-shadow-2xl" />
                    </button>
                    <button onClick={toggleAudio} className={`hover:scale-110 active:scale-95 transition-all outline-none ${!isAudioOn ? 'grayscale opacity-60' : ''}`}>
                        <img src={isAudioOn ? BTN_AUDIO_ON : BTN_AUDIO_OFF} alt="Audio" className="w-14 h-14 md:w-20 h-auto drop-shadow-2xl" />
                    </button>
                </div>

                <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
                    <div className="relative">
                        <button onClick={() => toggleMenu('HATS')} className="hover:scale-110 active:scale-95 transition-all">
                            <img src={BTN_HATS} className="w-16 h-16 md:w-24 md:h-24 object-contain aspect-square drop-shadow-xl" alt="Cappelli" />
                        </button>
                        {openMenu === 'HATS' && renderDropdown(HAT_DATA, 'HATS')}
                    </div>
                    <div className="relative">
                        <button onClick={() => toggleMenu('TSHIRT')} className="hover:scale-110 active:scale-95 transition-all">
                            <img src={BTN_TSHIRT} className="w-16 h-16 md:w-24 md:h-24 object-contain aspect-square drop-shadow-xl" alt="T-shirt" />
                        </button>
                        {openMenu === 'TSHIRT' && renderDropdown(TSHIRT_DATA, 'TSHIRT')}
                    </div>
                    <div className="relative">
                        <button onClick={() => toggleMenu('COMPLETI')} className="hover:scale-110 active:scale-95 transition-all">
                            <img src={BTN_COMPLETI} className="w-16 h-16 md:w-24 md:h-24 object-contain aspect-square drop-shadow-xl" alt="Completi" />
                        </button>
                        {openMenu === 'COMPLETI' && renderDropdown(COMPLETI_DATA, 'COMPLETI')}
                    </div>
                    <div className="relative">
                        <button onClick={() => toggleMenu('OGGETTI')} className="hover:scale-110 active:scale-95 transition-all">
                            <img src={BTN_OGGETTI} className="w-16 h-16 md:w-24 md:h-24 object-contain aspect-square drop-shadow-xl" alt="Oggetti" />
                        </button>
                        {openMenu === 'OGGETTI' && renderDropdown(OGGETTI_DATA, 'OGGETTI')}
                    </div>
                </div>
            </div>

            {/* Buy Section */}
            {itemToBuy && (
                <div className="absolute bottom-6 left-6 z-50 flex items-center gap-4 animate-in slide-in-from-left-10 duration-500 pointer-events-none">
                    <div className="bg-slate-900/90 backdrop-blur-xl p-3 rounded-[1.5rem] border-4 border-purple-500 shadow-2xl flex items-center gap-3 pr-6 pointer-events-auto">
                        <div className="w-16 h-16 bg-purple-900/50 rounded-xl flex items-center justify-center p-2">
                            <img src={itemToBuy.icon} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-purple-400 text-[10px] uppercase opacity-60 leading-none mb-1">Prova in corso</span>
                            <div className="flex items-center gap-1">
                                <span className="font-black text-2xl md:text-4xl text-white">{itemToBuy.price}</span>
                                <TokenIcon className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                        </div>
                    </div>
                    <button onClick={handleAction} className="hover:scale-105 active:scale-95 transition-all pointer-events-auto">
                        <img src={BTN_ACQUISTA_IMG} alt="Acquista" className="w-28 md:w-40 h-auto drop-shadow-2xl" />
                    </button>
                </div>
            )}

            {/* Feedback Overlay */}
            {actionFeedback && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center pointer-events-none animate-in zoom-in duration-300">
                    <div className="flex flex-col items-center gap-8">
                        {actionFeedback.type === 'SUCCESS' ? (
                            <>
                                <h2 className="font-luckiest text-white text-5xl md:text-9xl uppercase text-center text-stroke-purple tracking-tighter">
                                    {actionFeedback.message}
                                </h2>
                                {actionFeedback.icon && (
                                    <img src={actionFeedback.icon} className="w-40 h-40 md:w-64 md:h-64 object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.8)] rotate-[-6deg]" alt="" />
                                )}
                            </>
                        ) : (
                            <>
                                <img src={IMG_ALERT_NO_TOKENS} className="w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-2xl rotate-[-12deg]" alt="Alert" />
                                <h2 className="font-luckiest text-red-500 text-5xl md:text-9xl uppercase text-center text-stroke-purple tracking-tighter leading-none">
                                    GETTONI<br/>INSUFFICIENTI!
                                </h2>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubAtelierOscuro;
