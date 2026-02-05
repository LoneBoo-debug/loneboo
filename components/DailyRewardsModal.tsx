
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Sparkles, CheckCircle2, MessageCircle, Gamepad2, Clock, Star, Info } from 'lucide-react';
import { AppView, PlayerProgress } from '../types';
import { addTokens, getProgress } from '../services/tokens';
import { CALENDAR_INFO, monthNames } from '../services/calendarDatabase';
import { ATELIER_COMBO_CSV_URL } from '../constants';

interface DailyRewardsModalProps {
    onClose: () => void;
    setView: (view: AppView) => void;
    currentView?: AppView;
}

const ICON_CLOCK = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/orologiocalendar553ws+(1).webp';
const ICON_CALENDAR = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/claenxarclande432wws+(1).webp';
const IMG_CLAIM_TOKENS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gettonoprex4r3e2waa.webp';
const BTN_ATELIER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/personaliboo90i87y6.webp';
const IMG_GO_SCHOOL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/andiamoascuolamodaleewerfgr4rf.webp';

const IMG_SUCCESS_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/riscuotigettonirewards44f55tfre.webp';
const BTN_OTTIMO_CLOSE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/OTTIMOgettonirccolt654rf4.webp';
const IMG_CLAIMED_STATUS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gettoniriscossimosl5re3e.webp';

const BOO_BASE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boonudoede32ws34r.webp';

// Configurazione Overlay (Sync con AtelierView)
const SPECIAL_OVERLAYS: Record<string, string> = {
    'S1': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sciarpacolorataboocaracters.webp',
    'S2': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cappelobeardnatalebbo5fr42.webp',
    'S3': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zuccahalloweenboocarxe4e3ws.webp',
    'S4': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boxcompete55rt44+(1).webp',
    'S5': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/completosera998gre.webp'
};

const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({ onClose, setView, currentView }) => {
    const [now, setNow] = useState(new Date());
    const [progress, setProgress] = useState<PlayerProgress>(getProgress());
    const [hasClaimed, setHasClaimed] = useState(false);
    const [showClaimSuccess, setShowClaimSuccess] = useState(false);
    const [comboMap, setComboMap] = useState<Record<string, string>>({});
    
    // Stato per l'alternanza del messaggio nel box stato
    const [displayMode, setDisplayMode] = useState<'BOO' | 'EVENT'>('BOO');

    const dateKey = useMemo(() => `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`, [now]);
    const holidayInfo = useMemo(() => CALENDAR_INFO[dateKey], [dateKey]);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        
        const todayStr = new Date().toISOString().split('T')[0];
        const lastClaim = localStorage.getItem('loneboo_daily_tokens_last_claim');
        setHasClaimed(lastClaim === todayStr);

        // Fetch combo map per l'avatar
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
            } catch (e) { console.error("DailyModal: Error fetching combo map:", e); }
        };
        fetchMap();

        return () => clearInterval(timer);
    }, []);

    // Effetto per l'alternanza dei messaggi ogni 5 secondi
    useEffect(() => {
        if (!holidayInfo) {
            setDisplayMode('BOO');
            return;
        }

        const interval = setInterval(() => {
            setDisplayMode(prev => prev === 'BOO' ? 'EVENT' : 'BOO');
        }, 5000);

        return () => clearInterval(interval);
    }, [holidayInfo]);

    // --- LOGICA RENDERING AVATAR (Sync con AtelierView) ---
    const currentBooImage = useMemo(() => {
        const look = progress.equippedClothing;
        const isHeadOverlayWorn = look.special2 === 'S2' || look.special3 === 'S3' || look.special4 === 'S4';
        const effectiveHat = isHeadOverlayWorn ? undefined : look.hat;

        // Se è equipaggiato l'Abito Sera (S5), nascondiamo la maglietta standard
        const isBodyOverlayWorn = look.special5 === 'S5';
        const effectiveTshirt = isBodyOverlayWorn ? undefined : look.tshirt;

        const activeIds = [effectiveTshirt, effectiveHat, look.glasses]
            .filter(Boolean)
            .map(id => (id as string).toUpperCase());

        if (activeIds.length === 0) return BOO_BASE;

        const currentKey = [...activeIds].sort().join('_');
        if (comboMap[currentKey]) return comboMap[currentKey];

        const priorityOrder: (keyof typeof look)[] = ['glasses', 'hat', 'tshirt'];
        for (const key of priorityOrder) {
            const idToUse = key === 'hat' ? effectiveHat : (key === 'tshirt' ? effectiveTshirt : look[key]);
            const idStr = (idToUse as string | undefined)?.toUpperCase();
            if (idStr && comboMap[idStr]) return comboMap[idStr];
        }

        return BOO_BASE;
    }, [progress.equippedClothing, comboMap]);

    const specialOverlayImages = useMemo(() => {
        const layers: string[] = [];
        const look = progress.equippedClothing;
        if (look.special === 'S1') layers.push(SPECIAL_OVERLAYS['S1']);
        if (look.special5 === 'S5') layers.push(SPECIAL_OVERLAYS['S5']);
        if (look.special2 === 'S2') layers.push(SPECIAL_OVERLAYS['S2']);
        if (look.special3 === 'S3') layers.push(SPECIAL_OVERLAYS['S3']);
        if (look.special4 === 'S4') layers.push(SPECIAL_OVERLAYS['S4']);
        return layers;
    }, [progress.equippedClothing]);

    const getTimeBasedData = () => {
        const h = now.getHours();
        const m = now.getMinutes();
        const totalMinutes = h * 60 + m;

        if (totalMinutes >= 0 && totalMinutes < 300) {
            return {
                text: "non so come tu faccia a restare sveglio a quest'ora ma è veramente tardi di solito si dorme....",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boostupito44r3e3e+(1).webp"
            };
        }
        if (totalMinutes >= 300 && totalMinutes < 360) {
            return {
                text: "Il sole sta per sorgere, ma è ancora molto presto!",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boostupito44r3e3e+(1).webp"
            };
        }
        if (totalMinutes >= 360 && totalMinutes < 390) {
            return {
                text: "Direi che è abbastanza presto... non riesci a dormire? posso aiutarti in qualche modo?",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boodubbioso33d3+(1).webp",
                action: { label: "Parla con Grufo", view: AppView.EMOTIONAL_GARDEN, icon: MessageCircle }
            };
        }
        if (totalMinutes >= 390 && totalMinutes < 480) {
            return {
                text: "ben svegliato, oggi è una giornata fantastica, hai fatto colazione?",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofelice4ed22s1qa+(1).webp"
            };
        }
        if (totalMinutes >= 480 && totalMinutes < 720) {
            return {
                text: "giornata super bellissima per giocare e studiare",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boosuperfelice4ed3e3ws.webp"
            };
        }
        if (totalMinutes >= 720 && totalMinutes < 840) {
            return {
                text: "a me sta venendo fame tu hai già mangiato?",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofame4e3ws2w+(1).webp"
            };
        }
        if (totalMinutes >= 840 && totalMinutes < 1020) {
            return {
                text: "che pomeriggio intenso, pieno di emozioni, hai già studiato alla scuola arcobaleno?",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofelice4ed22s1qa+(1).webp"
            };
        }
        if (totalMinutes >= 1020 && totalMinutes < 1080) {
            return {
                text: "momento super relax, ottimo per fare qualche gioco nel parco giochi",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boosuperfelice4ed3e3ws.webp",
                action: { label: "Al Parco Giochi", view: AppView.PLAY, icon: Gamepad2 }
            };
        }
        if (totalMinutes >= 1080 && totalMinutes < 1200) {
            return {
                text: "a me sta venendo un pò di fame ci prepariamo per la cena?",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofame4e3ws2w+(1).webp"
            };
        }
        if (totalMinutes >= 1200 && totalMinutes < 1260) {
            return {
                text: "comincio ad essere un pò stanco sarebbe ora di prepararsi per andare a nanna",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boostupito44r3e3e+(1).webp"
            };
        }
        if (totalMinutes >= 1260 && totalMinutes < 1320) {
            return {
                text: "sto crollando, ti direi che è arrivato il momento di chiudere tutto e dormire",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boodormes2232qws+(1).webp"
            };
        }
        return {
            text: "sei ancora qui? ma guarda l'orario è veramente tardi, dai spegniamo su...",
            img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/booarrabbiato4r33e+(1).webp"
        };
    };

    const handleClaim = () => {
        if (hasClaimed) return;
        addTokens(5);
        const todayStr = new Date().toISOString().split('T')[0];
        localStorage.setItem('loneboo_daily_tokens_last_claim', todayStr);
        setHasClaimed(true);
        setShowClaimSuccess(true);
        setProgress(getProgress());
    };

    const handleNavigate = (target: AppView, originKey?: string) => {
        if (currentView) {
            if (originKey) sessionStorage.setItem(originKey, currentView);
            // Salvataggio generico per navigazioni non specifiche
            if (target === AppView.SCHOOL) sessionStorage.setItem('school_origin', currentView);
            if (target === AppView.PLAY) sessionStorage.setItem('play_origin', currentView);
        }
        onClose();
        setView(target);
    };

    const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const dateStr = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    const timeData = getTimeBasedData();

    return (
        <div className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 pt-24 md:pt-32 animate-in fade-in duration-300" onClick={onClose}>
            <style>{`
                .text-stroke-lucky-small {
                    -webkit-text-stroke: 1.2px black;
                    text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
            
            <div 
                className="bg-white/30 backdrop-blur-xl border-4 border-white/20 rounded-[2.5rem] shadow-2xl w-full max-md overflow-hidden relative animate-in zoom-in duration-300 flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header Style Translucido con Saldo Gettoni */}
                <div className="bg-white/20 p-6 flex justify-between items-center border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-white/50 flex items-center gap-1.5 text-white font-black text-xs md:text-base shadow-lg">
                            <span>{progress.tokens}</span> <span className="text-lg">🪙</span>
                        </div>
                        <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight">La tua Giornata</h2>
                    </div>
                    <button onClick={onClose} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                    
                    {/* Orario, Data e Avatar Avatar */}
                    <div className="bg-black/20 rounded-3xl p-4 border border-white/10 flex flex-row items-center justify-between overflow-hidden">
                        <div className="flex flex-col items-start gap-3 py-2">
                            <div className="flex items-center gap-3">
                                <img src={ICON_CLOCK} alt="" className="w-8 h-8 md:w-12 md:h-12 object-contain drop-shadow-md" />
                                <span className="font-black text-2xl md:text-5xl tracking-widest text-yellow-300 drop-shadow-sm">{timeStr}</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <img src={ICON_CALENDAR} alt="" className="w-7 h-7 md:w-10 md:h-10 object-contain drop-shadow-md" />
                                <p className="text-white font-black text-base md:text-2xl uppercase opacity-90 drop-shadow-sm">{dateStr}</p>
                            </div>
                        </div>

                        {/* Avatar Personalizzato di Boo */}
                        <div className="flex flex-col items-center gap-0 shrink-0 pr-1 md:pr-4">
                            <div className="relative w-28 h-28 md:w-44 md:h-44 flex items-center justify-center overflow-visible">
                                <img 
                                    src={currentBooImage} 
                                    alt="Boo" 
                                    className="absolute inset-0 w-full h-full object-contain"
                                    style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' }}
                                />
                                {specialOverlayImages.map((src, idx) => (
                                    <img 
                                        key={idx}
                                        src={src} 
                                        alt="" 
                                        className="absolute inset-0 w-full h-full object-contain"
                                        style={{ zIndex: 10 + idx }}
                                    />
                                ))}
                            </div>
                            <span className="font-luckiest text-yellow-400 text-sm md:text-xl uppercase text-stroke-lucky-small tracking-wider mt-[-8px]">
                                BENTORNATO
                            </span>
                        </div>
                    </div>

                    {/* Stato del Giorno / Evento Calendario (Alternati) */}
                    <div className="bg-white/10 rounded-3xl p-5 border border-white/10 flex flex-col gap-4 min-h-[140px] justify-center relative overflow-hidden transition-all duration-500">
                        {displayMode === 'BOO' ? (
                            <div className="animate-in fade-in slide-in-from-right duration-500 w-full">
                                <h3 className="text-white/60 font-black text-[10px] uppercase tracking-widest leading-none mb-4">Stato del Giorno</h3>
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={timeData.img} 
                                        alt="" 
                                        className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-xl shrink-0" 
                                    />
                                    <div className="flex flex-col gap-3 flex-1">
                                        <p className="text-white font-bold text-sm md:text-lg leading-snug">
                                            {timeData.text}
                                        </p>
                                        {timeData.action && (
                                            <button 
                                                onClick={() => handleNavigate(timeData.action!.view)}
                                                className="bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-xl border border-white/30 text-[10px] md:text-xs font-black uppercase flex items-center gap-2 w-fit transition-all active:scale-95"
                                            >
                                                <timeData.action.icon size={14} />
                                                {timeData.action.label}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right duration-500 w-full">
                                <h3 className="text-orange-400 font-black text-[10px] uppercase tracking-widest leading-none mb-4 flex items-center gap-1.5">
                                    <Star size={10} fill="currentColor" /> Evento Speciale
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="bg-orange-500 p-4 rounded-2xl text-white shadow-lg shrink-0 flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
                                        <Star size={40} fill="currentColor" className="animate-pulse" />
                                    </div>
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <h4 className="text-yellow-300 font-black text-lg md:text-2xl uppercase tracking-tight drop-shadow-md">
                                            {holidayInfo.event}
                                        </h4>
                                        <p className="text-white font-bold text-xs md:text-sm leading-snug italic opacity-90">
                                            "{holidayInfo.description}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Gettoni Giornalieri, Atelier e Scuola affiancati */}
                    <div className="flex flex-row justify-center items-center gap-3 pb-4 shrink-0 px-2">
                        {!hasClaimed ? (
                            <button 
                                onClick={handleClaim}
                                className="w-[28%] hover:scale-105 active:scale-95 transition-all outline-none border-none bg-transparent"
                            >
                                <img src={IMG_CLAIM_TOKENS} alt="Prendi 5 gettoni" className="w-full h-auto drop-shadow-xl" />
                            </button>
                        ) : (
                            <div className="w-[28%] opacity-90 transition-all">
                                <img src={IMG_CLAIMED_STATUS} alt="Gettoni Riscossi" className="w-full h-auto drop-shadow-lg" />
                            </div>
                        )}

                        <button 
                            onClick={() => handleNavigate(AppView.ATELIER, 'atelier_origin')}
                            className="w-[28%] hover:scale-105 active:scale-95 transition-all outline-none border-none bg-transparent"
                        >
                            <img src={BTN_ATELIER_IMG} alt="Personalizza Boo" className="w-full h-auto drop-shadow-xl" />
                        </button>

                        <button 
                            onClick={() => handleNavigate(AppView.SCHOOL, 'school_origin')}
                            className="w-[31%] hover:scale-105 active:scale-95 transition-all outline-none border-none bg-transparent"
                        >
                            <img src={IMG_GO_SCHOOL} alt="Vai a Scuola" className="w-full h-auto drop-shadow-xl" />
                        </button>
                    </div>
                </div>

                {showClaimSuccess && (
                    <div className="absolute inset-0 z-[100] flex flex-col animate-in zoom-in duration-500 overflow-hidden">
                        <img src={IMG_SUCCESS_BG} className="absolute inset-0 w-full h-full object-cover" alt="Successo" />
                        <div className="absolute bottom-6 left-6 z-[110]">
                            <button 
                                onClick={() => setShowClaimSuccess(false)}
                                className="hover:scale-110 active:scale-95 transition-all outline-none border-4 border-white rounded-[2rem] shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-white/20 backdrop-blur-sm"
                            >
                                <img src={BTN_OTTIMO_CLOSE} alt="Ottimo!" className="w-32 md:w-52 h-auto block" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyRewardsModal;
