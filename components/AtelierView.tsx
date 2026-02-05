
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppView, PlayerProgress } from '../types';
import { getProgress, equipClothing, purchaseClothing } from '../services/tokens';
import { ATELIER_COMBO_CSV_URL } from '../constants';
import { ChevronLeft, ChevronRight, Check, Sparkles, AlertCircle, ShoppingCart, Volume2, VolumeX } from 'lucide-react';

const BG_ATELIER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfatelieradjncnd77en3h32ws.webp';
const BOO_BASE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boonudoede32ws34r.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

const BTN_TSHIRT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtbooteliren4r699gt+(1).webp';
const BTN_HATS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/capprllibuttonboo6trate+(1).webp';
const BTN_GLASSES = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/occhialibuttonboosate6t54+(1).webp';
const BTN_SPECIAL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/buttonspecial7jr83jeduij23ws.webp';

const BTN_ACQUISTA_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/acquisatelier55r+(1).webp';
const IMG_ALERT_NO_TOKENS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/genericalertnoacqui5r4r3.webp';

const BTN_INDOSSA_MENU = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ndossabuttonemenutendi88+(1).webp';
const BTN_RIMUOVI_MENU = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rimuvobutoenmndutdbexs+(1).webp';

// Nuovi Asset Audio/Video
const ATELIER_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/6a67060f-4b78-4653-991e-80cee04291cc.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Category = 'TSHIRT' | 'HATS' | 'GLASSES' | 'SPECIAL';
type MenuType = Category | null;

interface AtelierItem {
    id: string;
    icon: string;
    overlay?: string; 
    price: number;
    category: Category;
    slot: keyof PlayerProgress['equippedClothing'];
}

const TSHIRT_DATA: AtelierItem[] = [
    { id: 'T1', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtbooyellow3e32w+(1).webp', price: 10, category: 'TSHIRT', slot: 'tshirt' },
    { id: 'T2', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtboostar4e4e4+(1).webp', price: 15, category: 'TSHIRT', slot: 'tshirt' },
    { id: 'T3', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtboolove8i87u+(1).webp', price: 20, category: 'TSHIRT', slot: 'tshirt' },
    { id: 'T4', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtboogray55+(1).webp', price: 12, category: 'TSHIRT', slot: 'tshirt' },
    { id: 'T5', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tshirtboogreen67y67y+(1).webp', price: 12, category: 'TSHIRT', slot: 'tshirt' }
];

const HAT_DATA: AtelierItem[] = [
    { id: 'H1', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cappellinoboosimpa5t5y6y+(1).webp', price: 8, category: 'HATS', slot: 'hat' },
    { id: 'H2', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cappellozuccotooboo5r5r+(1).webp', price: 10, category: 'HATS', slot: 'hat' },
    { id: 'H3', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cappelloboootuba3e3e3+(1).webp', price: 25, category: 'HATS', slot: 'hat' },
    { id: 'H4', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/capprllopirtaboo5t6t6+(1).webp', price: 18, category: 'HATS', slot: 'hat' },
    { id: 'H5', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coronaboo3e3e+(1).webp', price: 50, category: 'HATS', slot: 'hat' }
];

const GLASSES_DATA: AtelierItem[] = [
    { id: 'G1', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/glassblackboo98ud83+(1).webp', price: 5, category: 'GLASSES', slot: 'glasses' },
    { id: 'G2', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/glassloveboo9i8j32+(1).webp', price: 10, category: 'GLASSES', slot: 'glasses' },
    { id: 'G3', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/glasspilotboo7ue7h3+(1).webp', price: 15, category: 'GLASSES', slot: 'glasses' },
    { id: 'G4', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/glassredboo9i8u+(1).webp', price: 7, category: 'GLASSES', slot: 'glasses' },
    { id: 'G5', icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/glassrotondboo432+(1).webp', price: 8, category: 'GLASSES', slot: 'glasses' }
];

const SPECIAL_DATA: AtelierItem[] = [
    { 
        id: 'S1', 
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sciarcolored4rg6t5r.webp', 
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sciarpacolorataboocaracters.webp',
        price: 50, 
        category: 'SPECIAL',
        slot: 'special'
    },
    {
        id: 'S2',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/iconbbbonoel5tfe.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cappelobeardnatalebbo5fr42.webp',
        price: 75,
        category: 'SPECIAL',
        slot: 'special2'
    },
    {
        id: 'S3',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icnnzucc54redsa.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zuccahalloweenboocarxe4e3ws.webp',
        price: 75,
        category: 'SPECIAL',
        slot: 'special3'
    },
    {
        id: 'S4',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/iconboxpugil778js.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boxcompete55rt44+(1).webp',
        price: 85,
        category: 'SPECIAL',
        slot: 'special4'
    },
    {
        id: 'S5',
        icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/completosera998gicoooore.webp',
        overlay: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/completosera998gre.webp',
        price: 100,
        category: 'SPECIAL',
        slot: 'special5'
    }
];

interface ActionFeedback {
    message: string;
    icon?: string;
    type: 'SUCCESS' | 'ERROR';
}

const AtelierView: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [openMenu, setOpenMenu] = useState<MenuType>(null);
    const [progress, setProgress] = useState<PlayerProgress>(getProgress());
    
    const [previewLook, setPreviewLook] = useState(progress.equippedClothing);
    const [comboMap, setComboMap] = useState<Record<string, string>>({});
    
    const [itemToBuy, setItemToBuy] = useState<AtelierItem | null>(null);
    const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
    
    // Gestione Audio Ambientale
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    const menuRef = useRef<HTMLDivElement>(null);
    const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        
        const syncProgress = () => {
            const p = getProgress();
            setProgress(p);
            setPreviewLook(p.equippedClothing);
        };
        window.addEventListener('progressUpdated', syncProgress);

        // Inizializzazione Audio
        if (!audioRef.current) {
            audioRef.current = new Audio(ATELIER_VOICE_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.5;
            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.currentTime = 0;
            });
        }

        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
            if (enabled && isLoaded) {
                audioRef.current?.play().catch(() => {});
            } else {
                audioRef.current?.pause();
                if (audioRef.current) audioRef.current.currentTime = 0;
            }
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);
        
        setTimeout(() => setIsLoaded(true), 800);
        return () => {
            window.removeEventListener('progressUpdated', syncProgress);
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [isLoaded]);

    // Logica intelligente per l'avvio automatico
    useEffect(() => {
        if (isLoaded && isAudioOn && audioRef.current) {
            const alreadyHeard = sessionStorage.getItem('heard_audio_atelier') === 'true';
            if (!alreadyHeard) {
                audioRef.current.play().catch(e => console.log("Audio play blocked", e));
                sessionStorage.setItem('heard_audio_atelier', 'true');
            }
        }
    }, [isLoaded, isAudioOn]);

    const currentBooImage = useMemo(() => {
        // Se è equipaggiato il cappello speciale S2, la zucca S3 o il casco da boxe S4, nascondiamo il cappello standard
        const isHeadOverlayWorn = previewLook.special2 === 'S2' || previewLook.special3 === 'S3' || previewLook.special4 === 'S4';
        const effectiveHat = isHeadOverlayWorn ? undefined : previewLook.hat;

        // Se è equipaggiato l'Abito Sera (S5), nascondiamo la maglietta standard
        const isBodyOverlayWorn = previewLook.special5 === 'S5';
        const effectiveTshirt = isBodyOverlayWorn ? undefined : previewLook.tshirt;

        const activeIds = [effectiveTshirt, effectiveHat, previewLook.glasses]
            .filter(Boolean)
            .map(id => (id as string).toUpperCase());

        if (activeIds.length === 0) return BOO_BASE;

        const currentKey = [...activeIds].sort().join('_');
        if (comboMap[currentKey]) return comboMap[currentKey];

        // Fallback per combo a 3 pezzi
        if (activeIds.length === 3) {
            if (effectiveHat && effectiveTshirt) {
                const pk = [effectiveHat, effectiveTshirt].map(id => id!.toUpperCase()).sort().join('_');
                if (comboMap[pk]) return comboMap[pk];
            }
            if (previewLook.glasses && effectiveTshirt) {
                const pk = [previewLook.glasses, effectiveTshirt].map(id => id!.toUpperCase()).sort().join('_');
                if (comboMap[pk]) return comboMap[pk];
            }
            if (previewLook.glasses && effectiveHat) {
                const pk = [previewLook.glasses, effectiveHat].map(id => id!.toUpperCase()).sort().join('_');
                if (comboMap[pk]) return comboMap[pk];
            }
        }

        const priorityOrder: (keyof typeof previewLook)[] = ['glasses', 'hat', 'tshirt'];
        for (const key of priorityOrder) {
            const idToUse = key === 'hat' ? effectiveHat : (key === 'tshirt' ? effectiveTshirt : previewLook[key]);
            const idStr = (idToUse as string | undefined)?.toUpperCase();
            if (idStr && comboMap[idStr]) return comboMap[idStr];
        }

        return BOO_BASE;
    }, [previewLook, comboMap]);

    const specialOverlayImages = useMemo(() => {
        const layers: string[] = [];
        // La sciarpa (S1) va sotto
        if (previewLook.special === 'S1') {
            const item = SPECIAL_DATA.find(i => i.id === 'S1');
            if (item?.overlay) layers.push(item.overlay);
        }
        // L'abito da sera (S5) è come una maglietta, va sopra la sciarpa se presente
        if (previewLook.special5 === 'S5') {
            const item = SPECIAL_DATA.find(i => i.id === 'S5');
            if (item?.overlay) layers.push(item.overlay);
        }
        // Il cappello Babbo Natale (S2)
        if (previewLook.special2 === 'S2') {
            const item = SPECIAL_DATA.find(i => i.id === 'S2');
            if (item?.overlay) layers.push(item.overlay);
        }
        // La zucca di Halloween (S3)
        if (previewLook.special3 === 'S3') {
            const item = SPECIAL_DATA.find(i => i.id === 'S3');
            if (item?.overlay) layers.push(item.overlay);
        }
        // Casco da boxe (S4)
        if (previewLook.special4 === 'S4') {
            const item = SPECIAL_DATA.find(i => i.id === 'S4');
            if (item?.overlay) layers.push(item.overlay);
        }
        return layers;
    }, [previewLook.special, previewLook.special2, previewLook.special3, previewLook.special4, previewLook.special5]);

    const toggleMenu = (menu: Category) => {
        setOpenMenu(prev => prev === menu ? null : menu);
        setActionFeedback(null);
    };

    const handleSelectItem = (item: AtelierItem) => {
        const slot = item.slot;
        const isOwned = progress.purchasedClothing.includes(item.id);

        if (previewLook[slot] === item.id) {
            setPreviewLook(prev => ({ ...prev, [slot]: undefined }));
            setItemToBuy(null);
        } else {
            // Creiamo il nuovo look per la prova
            let nextLook = { ...previewLook, [slot]: item.id };
            
            // Logica mutua esclusione per l'area testa: Cappello vs Babbo Natale (S2) vs Zucca (S3) vs Boxe (S4)
            if (slot === 'hat') {
                nextLook.special2 = undefined;
                nextLook.special3 = undefined;
                nextLook.special4 = undefined;
            } else if (item.id === 'S2') {
                nextLook.hat = undefined;
                nextLook.special3 = undefined;
                nextLook.special4 = undefined;
            } else if (item.id === 'S3') {
                nextLook.hat = undefined;
                nextLook.special2 = undefined;
                nextLook.special4 = undefined;
            } else if (item.id === 'S4') {
                nextLook.hat = undefined;
                nextLook.special2 = undefined;
                nextLook.special3 = undefined;
            }

            // Logica mutua esclusione per l'area corpo: Magliette vs Abito Sera (S5)
            if (slot === 'tshirt') {
                nextLook.special5 = undefined;
            } else if (item.id === 'S5') {
                nextLook.tshirt = undefined;
            }

            setPreviewLook(nextLook);
            if (!isOwned) {
                setItemToBuy(item);
            } else {
                setItemToBuy(null);
            }
        }
        
        setActionFeedback(null);
        setOpenMenu(null);
    };

    const handleEquipDirect = (item: AtelierItem) => {
        // Logica mutua esclusione persistente per l'area testa
        if (item.slot === 'hat') {
            equipClothing('special2', undefined);
            equipClothing('special3', undefined);
            equipClothing('special4', undefined);
        } else if (item.id === 'S2') {
            equipClothing('hat', undefined);
            equipClothing('special3', undefined);
            equipClothing('special4', undefined);
        } else if (item.id === 'S3') {
            equipClothing('hat', undefined);
            equipClothing('special2', undefined);
            equipClothing('special4', undefined);
        } else if (item.id === 'S4') {
            equipClothing('hat', undefined);
            equipClothing('special2', undefined);
            equipClothing('special3', undefined);
        }

        // Logica mutua esclusione persistente per l'area corpo
        if (item.slot === 'tshirt') {
            equipClothing('special5', undefined);
        } else if (item.id === 'S5') {
            equipClothing('tshirt', undefined);
        }

        equipClothing(item.slot, item.id);
        
        const p = getProgress();
        setProgress(p);
        setPreviewLook(p.equippedClothing);
        
        // Messaggi dinamici per categoria
        let message = "OGGETTO INDOSSATO!";
        if (item.category === 'TSHIRT') message = "MAGLIETTA INDOSSATA!";
        else if (item.category === 'HATS') message = "CAPPELLO INDOSSATO!";
        else if (item.category === 'GLASSES') message = "OCCHIALI INDOSSATI!";
        
        // Messaggi speciali personalizzati
        const specialLabels: Record<string, string> = {
            S1: "SCIARPA INDOSSATA!",
            S2: "NATALE È ARRIVATO! 🎅",
            S3: "DOLCETTO O SCHERZETTO? 🎃",
            S4: "PRONTO PER IL MATCH! 🥊",
            S5: "ELEGANTE COME NON MAI! ✨"
        };

        triggerFeedback(specialLabels[item.id] || message, "SUCCESS", item.icon);
        setOpenMenu(null);
        setItemToBuy(null);
    };

    const handleRemoveDirect = (item: AtelierItem) => {
        equipClothing(item.slot, undefined);
        
        const p = getProgress();
        setProgress(p);
        setPreviewLook(p.equippedClothing);
        
        // Messaggi dinamici per rimozione
        let message = "OGGETTO RIMOSSO!";
        if (item.category === 'TSHIRT') message = "MAGLIETTA RIMOSSA!";
        else if (item.category === 'HATS') message = "CAPPELLO RIMOSSO!";
        else if (item.category === 'GLASSES') message = "OCCHIALI RIMOSSI!";
        
        triggerFeedback(message, "SUCCESS");
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

    const handleAction = () => {
        if (!itemToBuy) return;

        if (purchaseClothing(itemToBuy.id, itemToBuy.price)) {
            // All'acquisto applichiamo la stessa logica di mutua esclusione per l'area testa
            if (itemToBuy.slot === 'hat') {
                equipClothing('special2', undefined);
                equipClothing('special3', undefined);
                equipClothing('special4', undefined);
            } else if (itemToBuy.id === 'S2') {
                equipClothing('hat', undefined);
                equipClothing('special3', undefined);
                equipClothing('special4', undefined);
            } else if (itemToBuy.id === 'S3') {
                equipClothing('hat', undefined);
                equipClothing('special2', undefined);
                equipClothing('special4', undefined);
            } else if (itemToBuy.id === 'S4') {
                equipClothing('hat', undefined);
                equipClothing('special2', undefined);
                equipClothing('special3', undefined);
            }

            // Logica mutua esclusione per l'area corpo all'acquisto
            if (itemToBuy.slot === 'tshirt') {
                equipClothing('special5', undefined);
            } else if (itemToBuy.id === 'S5') {
                equipClothing('tshirt', undefined);
            }

            equipClothing(itemToBuy.slot, itemToBuy.id);
            
            const p = getProgress();
            setProgress(p);
            setPreviewLook(p.equippedClothing);

            // Messaggi dinamici per acquisto
            let message = "OGGETTO ACQUISTATO!";
            if (itemToBuy.category === 'TSHIRT') message = "MAGLIETTA ACQUISTATA!";
            else if (itemToBuy.category === 'HATS') message = "CAPPELLO ACQUISTATO!";
            else if (itemToBuy.category === 'GLASSES') message = "OCCHIALI ACQUISTATI!";

            // Messaggi speciali per acquisto
            const buyLabels: Record<string, string> = {
                S1: "SCIARPA ACQUISTATA!",
                S2: "CAPPELLO NATALE ACQUISTATO! 🎅",
                S3: "ZUCCA DI HALLOWEEN PRESA! 🎃",
                S4: "EQUIP. BOXE ACQUISTATO! 🥊",
                S5: "ABITO SERA ACQUISTATO! ✨"
            };

            triggerFeedback(buyLabels[itemToBuy.id] || message, "SUCCESS", itemToBuy.icon);
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
        <div className={`absolute top-[110%] ${cat === 'TSHIRT' ? 'left-0' : 'right-0'} bg-white/40 backdrop-blur-2xl border-4 border-blue-400 rounded-[2.5rem] shadow-2xl p-3 flex flex-col gap-2 w-[180px] md:w-[220px] animate-in slide-in-from-top-4 duration-300 z-[100]`}>
            <div className="flex flex-col gap-3">
                {items.map((item) => {
                    const isOwned = progress.purchasedClothing.includes(item.id);
                    const isEquipped = progress.equippedClothing[item.slot] === item.id;
                    const isPreviewed = previewLook[item.slot] === item.id;
                    const isSpecial = item.category === 'SPECIAL';
                    const isSpecialIconSmaller = item.id === 'S3' || item.id === 'S4';

                    return (
                        <div 
                            key={item.id} 
                            onPointerDown={(e) => {
                                e.preventDefault();
                                handleSelectItem(item);
                            }}
                            className={`flex items-center gap-1 transition-all p-1 rounded-2xl border-2 cursor-pointer ${isPreviewed ? 'border-yellow-400 bg-white/50 shadow-lg' : 'border-transparent bg-black/5 active:scale-95'}`}
                        >
                            <div className="relative shrink-0 pointer-events-none w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
                                <img 
                                    src={item.icon} 
                                    alt="item" 
                                    className={`${isSpecial ? (isSpecialIconSmaller ? 'w-16 h-16 md:w-20 md:h-20' : 'w-20 h-20 md:w-24 md:h-24') : 'w-14 h-14 md:w-16 md:h-16'} object-contain drop-shadow-md`} 
                                />
                                {isOwned && <div className="absolute top-0 left-0 bg-green-500 rounded-full p-1 border-2 border-white shadow-sm z-10"><Check size={10} className="text-white" strokeWidth={5} /></div>}
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
                                                onPointerDown={(e) => { e.stopPropagation(); handleRemoveDirect(item); }}
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
                .boo-animation-wrapper { animation: boo-vibe 4s ease-in-out infinite; width: 100%; height: 100%; position: relative; }
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
                <div className="relative w-full h-full max-w-4xl mx-auto flex items-center justify-center overflow-hidden">
                    <div className={`boo-animation-wrapper transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        <img 
                            src={currentBooImage} 
                            alt="Boo" 
                            className="absolute inset-0 w-full h-full object-contain"
                            style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.4))' }}
                        />
                        
                        {specialOverlayImages.map((src, idx) => (
                            <img 
                                key={idx}
                                src={src} 
                                alt={`Special Layer ${idx}`} 
                                className="absolute inset-0 w-full h-full object-contain"
                                style={{ 
                                    filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.4))',
                                    pointerEvents: 'none',
                                    zIndex: 20 + idx 
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative z-50 w-full pt-[75px] md:pt-[105px] px-4 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col items-start gap-3 pointer-events-auto">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                        <span>{progress.tokens}</span> <span className="text-xl">🪙</span>
                    </div>
                    <button 
                        onClick={handleExit}
                        className="hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <img src={BTN_CLOSE_IMG} alt="Esci" className="w-14 h-14 md:w-22 h-auto drop-shadow-xl" />
                    </button>

                    {/* Mini TV di Boo - Appare solo se l'audio è in riproduzione */}
                    {isAudioOn && isPlaying && (
                        <div className="mt-4 z-50 animate-in zoom-in duration-500">
                            <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                                <video 
                                    src={BOO_TALK_VIDEO} 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline 
                                    className="w-full h-full object-cover" 
                                    style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 md:gap-3 pointer-events-auto" ref={menuRef}>
                    <div className="relative">
                        <button onClick={() => toggleMenu('TSHIRT')} className="hover:scale-110 active:scale-95 transition-all outline-none">
                            <img src={BTN_TSHIRT} alt="T-shirt" className="w-14 h-14 md:w-20 md:h-20 drop-shadow-xl scale-110" />
                        </button>
                        {openMenu === 'TSHIRT' && renderDropdown(TSHIRT_DATA, 'TSHIRT')}
                    </div>
                    <div className="relative">
                        <button onClick={() => toggleMenu('HATS')} className="hover:scale-110 active:scale-95 transition-all outline-none">
                            <img src={BTN_HATS} alt="Cappelli" className="w-14 h-14 md:w-20 md:h-20 drop-shadow-xl" />
                        </button>
                        {openMenu === 'HATS' && renderDropdown(HAT_DATA, 'HATS')}
                    </div>
                    <div className="relative">
                        <button onClick={() => toggleMenu('GLASSES')} className="hover:scale-110 active:scale-95 transition-all outline-none">
                            <img src={BTN_GLASSES} alt="Occhiali" className="w-14 h-14 md:w-20 md:h-20 drop-shadow-xl" />
                        </button>
                        {openMenu === 'GLASSES' && renderDropdown(GLASSES_DATA, 'GLASSES')}
                    </div>
                    <div className="relative">
                        <button onClick={() => toggleMenu('SPECIAL')} className="hover:scale-110 active:scale-95 transition-all outline-none">
                            <img src={BTN_SPECIAL} alt="Special" className="w-14 h-14 md:w-20 md:h-20 drop-shadow-xl" />
                        </button>
                        {openMenu === 'SPECIAL' && renderDropdown(SPECIAL_DATA, 'SPECIAL')}
                    </div>
                </div>
            </div>

            {itemToBuy && (
                <div className="absolute bottom-[4%] left-6 z-50 flex items-center gap-4 animate-in slide-in-from-left-10 duration-500 pointer-events-none">
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
