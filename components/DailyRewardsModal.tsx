
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Sparkles, MessageCircle, Gamepad2, Clock, Star, Info } from 'lucide-react';
import { AppView, PlayerProgress } from '../types';
import { addTokens, getProgress } from '../services/tokens';
import { CALENDAR_INFO, monthNames } from '../services/calendarDatabase';
import { ATELIER_COMBO_CSV_URL } from '../constants';
import { getForecast } from '../services/weatherService';

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
const IMG_GO_EXTRA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/exextraaasqq12q.webp';
const IMG_HEADER_TITLE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tonjournee5r4e3.webp';

const IMG_SUCCESS_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/riscuotigettonirewards44f55tfre.webp';
const BTN_OTTIMO_CLOSE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/OTTIMOgettonirccolt654rf4.webp';
const IMG_CLAIMED_STATUS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gettoniriscossimosl5re3e.webp';

const BOO_BASE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boonudoede32ws34r.webp';

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
    const [displayMode, setDisplayMode] = useState<'BOO' | 'EVENT'>('BOO');

    const dateKey = useMemo(() => `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`, [now]);
    const holidayInfo = useMemo(() => CALENDAR_INFO[dateKey], [dateKey]);

    const forecast = useMemo(() => getForecast(now), [now]);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        const todayStr = new Date().toISOString().split('T')[0];
        const lastClaim = localStorage.getItem('loneboo_daily_tokens_last_claim');
        setHasClaimed(lastClaim === todayStr);

        const fetchMap = async () => {
            try {
                const response = await fetch(ATELIER_COMBO_CSV_URL);
                if (response.ok) {
                    const text = await response.text();
                    const cleanText = text.replace(/\r/g, '');
                    const lines = cleanText.split('\n');
                    const map: Record<string, string> = {};
                    lines.slice(1).forEach(line => {
                        const parts = line.split(line.includes(';') ? ';' : ',').map(s => s.trim().replace(/^"|"$/g, ''));
                        if (parts.length >= 2) map[parts[0].toUpperCase()] = parts[1];
                    });
                    setComboMap(map);
                }
            } catch (e) {}
        };
        fetchMap();
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!holidayInfo) return;
        // Alternanza ogni 10 secondi per permettere una lettura più rilassata
        const interval = setInterval(() => setDisplayMode(prev => prev === 'BOO' ? 'EVENT' : 'BOO'), 10000);
        return () => clearInterval(interval);
    }, [holidayInfo]);

    const seasonData = useMemo(() => {
        const springStart = new Date(now.getFullYear(), 2, 20);
        const summerStart = new Date(now.getFullYear(), 5, 21);
        const autumnStart = new Date(now.getFullYear(), 8, 22);
        const winterStart = new Date(now.getFullYear(), 11, 21);
        let label, nextLabel, nextDate;
        if (now < springStart) { label = "Inverno"; nextLabel = "Primavera"; nextDate = springStart; }
        else if (now < summerStart) { label = "Primavera"; nextLabel = "Estate"; nextDate = summerStart; }
        else if (now < autumnStart) { label = "Estate"; nextLabel = "Autunno"; nextDate = autumnStart; }
        else if (now < winterStart) { label = "Autunno"; nextLabel = "Inverno"; nextDate = winterStart; }
        else { label = "Inverno"; nextLabel = "Primavera"; nextDate = new Date(now.getFullYear() + 1, 2, 20); }
        const diffDays = Math.ceil(Math.abs(nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const preposition = (nextLabel === 'Estate' || nextLabel === 'Autunno' || nextLabel === 'Inverno') ? "all'" : "alla ";
        let message = `Siamo in ${label}. Mancano ${diffDays} giorni ${preposition}${nextLabel}.`;
        if (diffDays <= 7) message = `Manca solo una settimana ${preposition}${nextLabel}! 🤩`;
        return { message };
    }, [now]);

    const currentBooImage = useMemo(() => {
        const look = progress.equippedClothing;
        const isHeadOverlayWorn = look.special2 === 'S2' || look.special3 === 'S3' || look.special4 === 'S4';
        const isBodyOverlayWorn = look.special5 === 'S5';
        const effectiveHat = isHeadOverlayWorn ? undefined : look.hat;
        const effectiveTshirt = isBodyOverlayWorn ? undefined : look.tshirt;
        const activeIds = [effectiveTshirt, effectiveHat, look.glasses].filter(Boolean).map(id => (id as string).toUpperCase());
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
        const layers: string[] = []; const look = progress.equippedClothing;
        if (look.special5 === 'S5') layers.push(SPECIAL_OVERLAYS['S5']);
        if (look.special === 'S1') layers.push(SPECIAL_OVERLAYS['S1']);
        if (look.special2 === 'S2') layers.push(SPECIAL_OVERLAYS['S2']);
        if (look.special3 === 'S3') layers.push(SPECIAL_OVERLAYS['S3']);
        if (look.special4 === 'S4') layers.push(SPECIAL_OVERLAYS['S4']);
        return layers;
    }, [progress.equippedClothing]);

    const getTimeBasedData = () => {
        const h = now.getHours(); const m = now.getMinutes(); const totalMinutes = h * 60 + m;
        if (totalMinutes < 300) return { text: "non so come tu faccia a restare sveglio ma è tardi!", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boostupito44r3e3e+(1).webp" };
        if (totalMinutes < 360) return { text: "Il sole sta per sorgere, ma è ancora molto presto!", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boostupito44r3e3e+(1).webp" };
        if (totalMinutes < 390) return { text: "Direi che è abbastanza presto... non riesci a dormire?", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boodubbioso33d3+(1).webp", action: { label: "Parla con Grufo", view: AppView.EMOTIONAL_GARDEN, icon: MessageCircle } };
        if (totalMinutes < 480) return { text: "ben svegliato oggi è una giornata fantastica!", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofelice4ed22s1qa+(1).webp" };
        if (totalMinutes < 720) return { text: "giornata super bellissima per giocare e studiare", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boosuperfelice4ed3e3ws.webp" };
        if (totalMinutes < 840) return { text: "a me sta venendo fame tu hai già mangiato?", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofame4e3ws2w+(1).webp" };
        if (totalMinutes < 1020) return { text: "pomeriggio intenso, hai già studiato oggi?", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofelice4ed22s1qa+(1).webp" };
        if (totalMinutes < 1080) return { text: "momento relax, ottimo per il parco giochi", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boosuperfelice4ed3e3ws.webp", action: { label: "Al Parco", view: AppView.PLAY, icon: Gamepad2 } };
        if (totalMinutes < 1200) return { text: "a me sta venendo fame, ci prepariamo per la cena?", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofame4e3ws2w+(1).webp" };
        if (totalMinutes < 1260) return { text: "comincio ad essere stanco, sarebbe ora della nanna", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boostupito44r3e3e+(1).webp" };
        if (totalMinutes < 1320) return { text: "sto crollando, è il momento di chiudere tutto e dormire", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boodormes2232qws+(1).webp" };
        return { text: "sei ancora qui? guarda l'orario è tardi, spegniamo su...", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/booarrabbiato4r33e+(1).webp" };
    };

    const handleClaim = () => { if (!hasClaimed) { addTokens(5); localStorage.setItem('loneboo_daily_tokens_last_claim', new Date().toISOString().split('T')[0]); setHasClaimed(true); setShowClaimSuccess(true); setProgress(getProgress()); } };
    const handleNavigate = (target: AppView, originKey?: string) => { if (currentView) { if (originKey) sessionStorage.setItem(originKey, currentView); if (target === AppView.SCHOOL) sessionStorage.setItem('school_origin', currentView); if (target === AppView.PLAY) sessionStorage.setItem('play_origin', currentView); } onClose(); setView(target); };

    const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const dateStr = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    const timeData = getTimeBasedData();

    return (
        <div className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 pt-24 md:pt-32 animate-in fade-in duration-300" onClick={onClose}>
            <style>{`.text-stroke-lucky-small { -webkit-text-stroke: 1.2px black; text-shadow: 2px 2px 0px rgba(0,0,0,0.5); } .no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            
            <div className="bg-white/30 backdrop-blur-xl border-4 border-white/20 rounded-[2.5rem] shadow-2xl w-full max-md overflow-hidden relative animate-in zoom-in duration-300 flex flex-col max-h-[92vh]" onClick={e => e.stopPropagation()}>
                
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center opacity-60">
                        <img src={currentBooImage} className="absolute w-auto h-[70%] max-w-none scale-[1.3] md:scale-[1.6] transform translate-y-[5%]" style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))' }} alt="" />
                        {specialOverlayImages.map((src, idx) => (
                            <img key={idx} src={src} className="absolute w-auto h-[70%] max-w-none scale-[1.3] md:scale-[1.6] transform translate-y-[5%]" style={{ zIndex: 10 + idx, filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))' }} alt="" />
                        ))}
                    </div>
                </div>

                <div className="bg-white/20 p-4 flex justify-between items-center border-b border-white/10 shrink-0 relative z-10">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-white/50 flex items-center gap-1.5 text-white font-black text-xs md:text-base shadow-lg shrink-0">
                            <span>{progress.tokens}</span> <span className="text-lg">🪙</span>
                        </div>
                        <div className="flex justify-center flex-1 px-2"><img src={IMG_HEADER_TITLE} alt="La tua giornata" className="h-10 md:h-14 w-auto object-contain drop-shadow-md" /></div>
                    </div>
                    <button onClick={onClose} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition-all shrink-0"><X size={20} /></button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto no-scrollbar flex-1 relative z-10">
                    <div className="bg-black/40 backdrop-blur-md rounded-3xl p-4 border border-white/20 flex flex-col gap-4 w-full shadow-xl">
                        
                        {/* RIGA 1: ORARIO */}
                        <div className="flex flex-row items-center gap-4 w-full">
                            <img src={ICON_CLOCK} className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-md shrink-0" alt="" />
                            <div className="flex flex-col">
                                <span className="font-black text-3xl md:text-5xl tracking-widest text-yellow-300 drop-shadow-sm leading-none">{timeStr}</span>
                            </div>
                        </div>

                        {/* RIGA 2: DATA */}
                        <div className="flex flex-row items-center gap-3 w-full border-t border-white/10 pt-3">
                            <img src={ICON_CALENDAR} className="w-8 h-8 md:w-11 md:h-11 object-contain drop-shadow-md shrink-0" alt="" />
                            <p className="text-white font-black text-sm md:text-xl uppercase opacity-90">{dateStr}</p>
                        </div>
                        
                        {/* NUOVA RIGA 3: METEO CITTÀ COLORATA */}
                        <div className="grid grid-cols-3 gap-2 w-full pt-1 border-t border-white/10 pt-3">
                            {forecast.map((f, i) => (
                                <div 
                                    key={i} 
                                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-300 ${i === 0 ? 'bg-white/15 border-yellow-400/50 shadow-lg scale-[1.03]' : 'bg-black/20 border-white/10'}`}
                                >
                                    <span className={`text-[8px] md:text-[10px] font-black uppercase mb-1 ${i === 0 ? 'text-yellow-400' : 'text-white/60'}`}>
                                        {f.label}
                                    </span>
                                    <img src={f.icon} className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-md" alt={f.type} />
                                    <span className="text-[7px] md:text-[9px] font-bold text-white/40 uppercase mt-1">
                                        {f.date}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <p className="text-green-300 font-black text-[9px] md:text-sm uppercase tracking-tight opacity-90 border-t border-white/10 pt-2 w-full text-center">{seasonData.message}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 flex flex-col justify-center relative overflow-hidden transition-all duration-500 shadow-lg min-h-[120px]">
                        {displayMode === 'BOO' ? (
                            <div className="animate-in fade-in slide-in-from-right duration-500 flex items-center gap-4">
                                <img src={timeData.img} className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-xl shrink-0" alt="" />
                                <div className="flex flex-col gap-3 flex-1">
                                    <p className="text-yellow-300 font-bold text-base md:text-xl leading-snug">{timeData.text}</p>
                                    {timeData.action && <button onClick={() => handleNavigate(timeData.action!.view)} className="bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-xl border border-white/30 text-[10px] md:text-xs font-black uppercase flex items-center gap-2 w-fit transition-all"><timeData.action.icon size={14} /> {timeData.action.label}</button>}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right duration-500 flex items-center gap-4">
                                <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg shrink-0 flex items-center justify-center w-20 h-20 md:w-28 md:h-28"><Star size={32} fill="currentColor" className="animate-pulse" /></div>
                                <div className="flex flex-col flex-1">
                                    <h4 className="text-yellow-300 font-black text-base md:text-2xl uppercase tracking-tight drop-shadow-md">{holidayInfo.event}</h4>
                                    <p className="text-yellow-300 font-bold text-sm md:text-lg italic opacity-90 leading-tight">"{holidayInfo.description}"</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-row justify-center items-end gap-3 pb-6 shrink-0 px-2 mt-auto">
                        {!hasClaimed ? (
                            <button onClick={handleClaim} className="w-[22%] hover:scale-105 active:scale-95 transition-all outline-none border-none bg-transparent">
                                <img src={IMG_CLAIM_TOKENS} alt="Prendi 5 gettoni" className="w-full h-auto drop-shadow-xl" />
                            </button>
                        ) : (
                            <div className="w-[28%] opacity-90 transition-all flex items-center justify-center">
                                <img src={IMG_CLAIMED_STATUS} alt="Gettoni Riscossi" className="w-full h-auto drop-shadow-lg transform scale-110" />
                            </div>
                        )}
                        <button onClick={() => handleNavigate(AppView.ATELIER, 'atelier_origin')} className="w-[22%] hover:scale-105 active:scale-95 transition-all outline-none border-none bg-transparent">
                            <img src={BTN_ATELIER_IMG} alt="Personalizza Boo" className="w-full h-auto drop-shadow-xl" />
                        </button>
                        <button onClick={() => handleNavigate(AppView.SCHOOL, 'school_origin')} className="w-[26%] hover:scale-105 active:scale-95 transition-all outline-none border-none bg-transparent translate-y-2">
                            <img src={IMG_GO_SCHOOL} alt="Vai a Scuola" className="w-full h-auto drop-shadow-xl" />
                        </button>
                        <button onClick={() => { sessionStorage.setItem('show_extra_immediately', 'true'); handleNavigate(AppView.SCHOOL_ARCHIVE); }} className="w-[21%] hover:scale-105 active:scale-95 transition-all outline-none border-none bg-transparent translate-y-0.5">
                            <img src={IMG_GO_EXTRA} alt="Contenuti Extra" className="w-full h-auto drop-shadow-xl" />
                        </button>
                    </div>
                </div>

                {showClaimSuccess && (
                    <div className="absolute inset-0 z-[100] flex flex-col animate-in zoom-in duration-500 overflow-hidden">
                        <img src={IMG_SUCCESS_BG} className="absolute inset-0 w-full h-full object-cover" alt="Successo" />
                        <div className="absolute bottom-6 left-6 z-110">
                            <button onClick={() => setShowClaimSuccess(false)} className="hover:scale-110 active:scale-95 transition-all outline-none border-4 border-white rounded-[2rem] shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-white/20 backdrop-blur-sm">
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
