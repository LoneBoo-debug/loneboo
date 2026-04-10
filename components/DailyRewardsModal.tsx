
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Sparkles, MessageCircle, Gamepad2, Clock, Star, Info, Check } from 'lucide-react';
import { AppView, PlayerProgress } from '../types';
import { addTokens, getProgress } from '../services/tokens';
import { CALENDAR_INFO, monthNames } from '../services/calendarDatabase';
import { ATELIER_COMBO_CSV_URL, TOKEN_ICON_URL } from '../constants';
import TokenIcon from './TokenIcon';
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
const IMG_GO_MARAGNO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/chiedibuttonmara66gno9.webp';
const IMG_HEADER_TITLE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tonjournee5r4e3.webp';
const IMG_CINEMA_BANNER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/iconbannerusicte5533.webp';
const IMG_BANNER_ELEMENTARY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elemtarybannerschool44.webp';
const IMG_BANNER_MIDDLE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mediabannerschool445.webp';

const IMG_SUCCESS_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/riscuotigettonirewards44f55tfre.webp';
const BTN_OTTIMO_CLOSE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/OTTIMOgettonirccolt654rf4.webp';
const IMG_CLAIMED_STATUS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gettoniriscossimosl5re3e.webp';

const BOO_BASE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boonudoede32ws34r.webp';

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

const HIDES_BASE_CLOTHING = ['SUB_ELF_OUTFIT', 'SUB_DEMOGORGON_OUTFIT', 'SUB_NINJA_OUTFIT', 'SUB_ROBOT_OUTFIT', 'SUB_GLADIATOR_OUTFIT', 'S5'];

const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({ onClose, setView, currentView }) => {
    const [now, setNow] = useState(new Date());
    const [progress, setProgress] = useState<PlayerProgress>(getProgress());
    const [hasClaimed, setHasClaimed] = useState(false);
    const [showClaimSuccess, setShowClaimSuccess] = useState(false);
    const [comboMap, setComboMap] = useState<Record<string, string>>({});
    const [viewMode, setViewMode] = useState<'STANDARD' | 'STATEMENT'>('STANDARD');
    const [showSchoolChoice, setShowSchoolChoice] = useState(false);
    const [showTravelConfirm, setShowTravelConfirm] = useState(false);

    const dateKey = useMemo(() => `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`, [now]);
    const holidayInfo = useMemo(() => CALENDAR_INFO[dateKey], [dateKey]);

    const forecast = useMemo(() => getForecast(now), [now]);

    // LOGICA MESSAGGIO METEO DINAMICO
    const weatherNarrative = useMemo(() => {
        if (!forecast || forecast.length < 3) return "";

        const today = forecast[0];
        const tomorrow = forecast[1];
        const dayAfter = forecast[2];

        let weatherDesc = "";
        switch (today.type) {
            case 'WIND': weatherDesc = "c'è vento"; break;
            case 'RAIN': weatherDesc = "piove"; break;
            case 'SNOW': weatherDesc = "nevica"; break;
            case 'SUN': default: weatherDesc = "c'è un bel sole"; break;
        }

        let phrase = `Oggi ${weatherDesc} a Città Colorata`;

        if (today.type === tomorrow.type && today.type === dayAfter.type) {
            phrase += " e la situazione non cambierà tanto presto!";
        } else if (today.type === tomorrow.type) {
            phrase += " e continuerà così anche domani!";
        } else {
            phrase += ". Goditi questa giornata!";
        }

        return phrase;
    }, [forecast]);

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

    const currentBooImage = useMemo(() => {
        const look = progress.equippedClothing;
        const isHeadOverlayWorn = look.special2 === 'S2' || look.special3 === 'S3' || look.special4 === 'S4' || (look.special5 && HIDES_BASE_CLOTHING.includes(look.special5)) || (look.hat && SPECIAL_OVERLAYS[look.hat]);
        const isBodyOverlayWorn = (look.special5 && HIDES_BASE_CLOTHING.includes(look.special5)) || (look.tshirt && SPECIAL_OVERLAYS[look.tshirt]);
        
        const effectiveHat = isHeadOverlayWorn ? undefined : look.hat;
        const effectiveTshirt = isBodyOverlayWorn ? undefined : look.tshirt;
        
        const activeIds = [effectiveTshirt, effectiveHat, look.glasses].filter(Boolean).map(id => (id as string).toUpperCase());
        if (activeIds.length === 0) return BOO_BASE;
        const currentKey = [...activeIds].sort().join('_');
        if (comboMap[currentKey]) return comboMap[currentKey];

        // Fallback: se la combo non esiste, prova a cercare i singoli pezzi in ordine di priorità
        // Includiamo anche i pezzi originali se quelli "effective" sono undefined (perché sono diventati overlay)
        const priorityOrder: (keyof typeof look)[] = ['glasses', 'hat', 'tshirt'];
        for (const key of priorityOrder) {
            const idToUse = look[key];
            const idStr = (idToUse as string | undefined)?.toUpperCase();
            if (idStr && comboMap[idStr]) return comboMap[idStr];
        }

        return BOO_BASE;
    }, [progress.equippedClothing, comboMap]);

    const specialOverlayImages = useMemo(() => {
        const layers: string[] = []; const look = progress.equippedClothing;
        if (look.special5 && SPECIAL_OVERLAYS[look.special5]) layers.push(SPECIAL_OVERLAYS[look.special5]);
        
        const slots: (keyof typeof look)[] = ['glasses', 'tshirt', 'hat', 'special', 'special2', 'special3', 'special4'];
        slots.forEach(slot => {
            const id = look[slot];
            if (id && SPECIAL_OVERLAYS[id]) {
                layers.push(SPECIAL_OVERLAYS[id]);
            }
        });
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
        if (totalMinutes < 1260) return { text: "comincio ad essere stanco, Sarebbe ora della nanna", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boostupito44r3e3e+(1).webp" };
        if (totalMinutes < 1320) return { text: "sto crollando, è il momento di chiudere tutto e dormire", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boodormes2232qws+(1).webp" };
        return { text: "sei ancora qui? guarda l'orario è tardi, spegniamo su...", img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/booarrabbiato4r33e+(1).webp" };
    };

    const handleClaim = () => { if (!hasClaimed) { addTokens(5, 'Premio Giornaliero'); localStorage.setItem('loneboo_daily_tokens_last_claim', new Date().toISOString().split('T')[0]); setHasClaimed(true); setShowClaimSuccess(true); setProgress(getProgress()); } };
    const handleNavigate = (target: AppView, originKey?: string) => { if (currentView) { if (originKey) sessionStorage.setItem(originKey, currentView); if (target === AppView.SCHOOL) sessionStorage.setItem('school_origin', currentView); if (target === AppView.PLAY) sessionStorage.setItem('play_origin', currentView); } onClose(); setView(target); };

    const handleSchoolClick = () => {
        setShowSchoolChoice(true);
    };

    const handleSelectSchool = (type: 'ELEMENTARY' | 'MIDDLE') => {
        if (type === 'ELEMENTARY') {
            handleNavigate(AppView.SCHOOL, 'school_origin');
        } else {
            // Check for train pass or student pass
            if (progress.hasTrainPass || progress.hasStudentPass) {
                handleNavigate(AppView.RAINBOW_CITY_SCUOLA_MEDIA);
            } else {
                setShowSchoolChoice(false);
                setShowTravelConfirm(true);
            }
        }
    };

    const handleConfirmTravel = () => {
        sessionStorage.setItem('train_target_city', AppView.RAINBOW_CITY);
        handleNavigate(AppView.TRAIN_JOURNEY);
    };

    const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const dateStr = `${now.getDate()} ${monthNames[now.getMonth()].slice(0, 3)} ${now.getFullYear()}`;
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
                        {viewMode === 'STATEMENT' && (
                            <button 
                                onClick={() => setViewMode('STANDARD')}
                                className="bg-white/20 text-white p-1.5 rounded-full hover:bg-white/40 transition-all shrink-0"
                            >
                                <X size={18} />
                            </button>
                        )}
                        <button 
                            onClick={() => setViewMode('STATEMENT')}
                            className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-white/50 flex items-center gap-1.5 text-white font-black text-xs md:text-base shadow-lg shrink-0 hover:scale-105 active:scale-95 transition-all"
                        >
                            <span>{progress.tokens}</span> <TokenIcon className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <div className="flex justify-center flex-1 px-2"><img src={IMG_HEADER_TITLE} alt="La tua giornata" className="h-10 md:h-14 w-auto object-contain drop-shadow-md" /></div>
                    </div>
                    <button onClick={onClose} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition-all shrink-0"><X size={20} /></button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto no-scrollbar flex-1 relative z-10">
                    {viewMode === 'STANDARD' ? (
                        <>
                            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-4 border border-white/20 flex flex-col gap-3 w-full shadow-xl">
                                
                                <div className="flex flex-row items-center justify-between w-full gap-2">
                                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                                        <img src={ICON_CLOCK} className="w-8 h-8 md:w-12 md:h-12 object-contain drop-shadow-md shrink-0" alt="" />
                                        <span className="font-black text-xl md:text-3xl tracking-widest text-yellow-300 drop-shadow-sm leading-none">{timeStr}</span>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                                        <img src={ICON_CALENDAR} className="w-8 h-8 md:w-12 md:h-12 object-contain drop-shadow-md shrink-0" alt="" />
                                        <p className="text-white font-black text-xl md:text-3xl uppercase opacity-90 leading-tight">{dateStr}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 w-full border-t border-white/10 pt-3">
                                    {forecast.map((f, i) => (
                                        <div 
                                            key={i} 
                                            className="flex flex-col items-center justify-center p-1 transition-all duration-300"
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

                                {/* MESSAGGIO METEO NARRATIVO IN STILE LUCKY GUY GIALLO */}
                                <div className="border-t border-white/10 pt-2 w-full text-center">
                                    <p className="font-luckiest text-yellow-400 text-sm md:text-xl uppercase tracking-tighter text-stroke-lucky-small leading-tight">
                                        {weatherNarrative}
                                    </p>
                                </div>
                            </div>

                            <div 
                                onClick={() => handleNavigate(AppView.CINEMA_PREVIEW)}
                                className="bg-black/40 backdrop-blur-md rounded-3xl p-3 border border-white/20 flex items-center gap-4 shadow-xl cursor-pointer hover:bg-black/50 transition-all min-h-[100px]"
                            >
                                <img src={IMG_CINEMA_BANNER} className="w-20 md:w-28 h-auto rounded-xl shadow-lg shrink-0" alt="Anteprima Cinema" />
                                <div className="flex-1">
                                    <p className="font-luckiest text-yellow-400 text-xl md:text-3xl uppercase leading-tight text-stroke-lucky-small">
                                        Prossime uscite<br />al cinema
                                    </p>
                                </div>
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
                                <button onClick={handleSchoolClick} className="w-[26%] hover:scale-105 active:scale-95 transition-all outline-none border-none bg-transparent translate-y-2">
                                    <img src={IMG_GO_SCHOOL} alt="Vai a Scuola" className="w-full h-auto drop-shadow-xl" />
                                </button>
                                <button onClick={() => handleNavigate(AppView.CHAT)} className="w-[24%] hover:scale-105 active:scale-95 transition-all outline-none border-none bg-transparent translate-y-0.5">
                                    <img src={IMG_GO_MARAGNO} alt="Chiedi a Maragno" className="w-full h-auto drop-shadow-xl" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom duration-300">
                            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-4 border border-white/20 flex flex-row items-center justify-between px-6 shadow-xl shrink-0">
                                <div className="flex flex-col">
                                    <span className="text-white/60 font-black text-[10px] uppercase tracking-widest">Il tuo saldo</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl md:text-5xl font-black text-yellow-300 drop-shadow-md">{progress.tokens}</span>
                                        <TokenIcon className="w-6 h-6 md:w-10 md:h-10 drop-shadow-md" />
                                    </div>
                                </div>
                                <div className="bg-white/10 p-2 rounded-2xl">
                                    <Clock size={24} className="text-white/40" />
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-3 border border-white/20 flex flex-col shadow-lg">
                                <h3 className="text-white font-black text-xs md:text-sm uppercase tracking-wider border-b border-white/10 pb-2 mb-2 flex items-center gap-2">
                                    Ultimi 6 Movimenti
                                </h3>
                                <div className="flex flex-col gap-1.5">
                                    {progress.transactions && progress.transactions.length > 0 ? (
                                        progress.transactions.slice(0, 6).map((t) => (
                                            <div key={t.id} className="bg-black/20 rounded-xl p-2 px-3 flex justify-between items-center border border-white/5">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-white font-bold text-[11px] md:text-xs truncate">{t.description}</span>
                                                    <span className="text-white/40 text-[9px] md:text-[10px]">
                                                        {new Date(t.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - {new Date(t.date).toLocaleDateString('it-IT')}
                                                    </span>
                                                </div>
                                                <div className={`flex items-center gap-1 font-black text-xs md:text-base shrink-0 ml-2 ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {t.amount > 0 ? '+' : ''}{t.amount}
                                                    <TokenIcon className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-10 text-center text-white/40 italic text-sm">
                                            Nessun movimento registrato
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
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

                {showSchoolChoice && (
                    <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <div className="bg-white/10 border-4 border-white/20 rounded-[3rem] p-4 md:p-5 max-w-lg w-full relative shadow-2xl animate-in zoom-in duration-300">
                            <button onClick={() => setShowSchoolChoice(false)} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-all z-10">
                                <X size={18} strokeWidth={3} />
                            </button>
                            <h3 className="text-white font-black text-lg md:text-2xl uppercase tracking-tighter text-center mb-4 drop-shadow-md px-10 whitespace-nowrap overflow-hidden text-ellipsis">Dove vuoi andare?</h3>
                            
                            <div className="flex flex-col gap-3">
                                {/* SCUOLA ELEMENTARE */}
                                <button 
                                    onClick={() => handleSelectSchool('ELEMENTARY')}
                                    className="flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded-3xl p-2 md:p-3 transition-all hover:scale-[1.01] active:scale-95 text-left group"
                                >
                                    <img src={IMG_BANNER_ELEMENTARY} alt="Scuola Elementare" className="w-20 md:w-28 h-auto rounded-xl shadow-lg" />
                                    <div className="flex-1">
                                        <h4 className="text-white font-black text-base md:text-lg uppercase group-hover:text-yellow-400 transition-colors leading-tight">Scuola Elementare</h4>
                                        <p className="text-white/60 text-[10px] md:text-xs font-bold uppercase">Città Colorata</p>
                                    </div>
                                </button>

                                {/* SCUOLA MEDIA */}
                                <div className="flex flex-col gap-2 bg-white/5 rounded-3xl p-2 md:p-3">
                                    <button 
                                        onClick={() => handleSelectSchool('MIDDLE')}
                                        className="flex items-center gap-4 hover:bg-white/5 rounded-2xl p-1 transition-all hover:scale-[1.01] active:scale-95 text-left group w-full"
                                    >
                                        <img src={IMG_BANNER_MIDDLE} alt="Scuola Media" className="w-20 md:w-28 h-auto rounded-xl shadow-lg" />
                                        <div className="flex-1">
                                            <h4 className="text-white font-black text-base md:text-lg uppercase group-hover:text-blue-400 transition-colors leading-tight">Scuola Media</h4>
                                            <p className="text-white/60 text-[10px] md:text-xs font-bold uppercase">Città degli Arcobaleni</p>
                                        </div>
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-1 border-t border-white/10 pt-2">
                                        <div className="flex items-center justify-between bg-black/20 p-1.5 px-3 rounded-xl border border-white/5">
                                            <span className="text-white/70 text-[9px] md:text-[10px] font-bold uppercase">Abbonamento Treno</span>
                                            {progress.hasTrainPass ? <Check size={14} className="text-green-400" /> : <X size={14} className="text-red-400" />}
                                        </div>
                                        <div className="flex items-center justify-between bg-black/20 p-1.5 px-3 rounded-xl border border-white/5">
                                            <span className="text-white/70 text-[9px] md:text-[10px] font-bold uppercase">Abbonamento Studenti</span>
                                            {progress.hasStudentPass ? <Check size={14} className="text-green-400" /> : <X size={14} className="text-red-400" />}
                                        </div>
                                        <div className="flex items-center justify-between bg-black/20 p-1.5 px-3 rounded-xl border border-white/5 md:col-span-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white/70 text-[9px] md:text-[10px] font-bold uppercase">Costo Biglietto (255</span>
                                                <TokenIcon className="w-2.5 h-2.5" />
                                                <span className="text-white/70 text-[9px] md:text-[10px] font-bold uppercase">)</span>
                                            </div>
                                            {progress.tokens >= 255 ? <Check size={14} className="text-green-400" /> : <X size={14} className="text-red-400" />}
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-white/40 uppercase text-center mt-0.5 font-bold italic">
                                        Per accedere devi possedere un abbonamento o i gettoni necessari
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showTravelConfirm && (
                    <div className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <div className="bg-white/10 border-4 border-white/20 rounded-[3rem] p-8 max-w-md w-full relative shadow-2xl animate-in zoom-in duration-300 text-center">
                            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                                <Info size={40} className="text-white" />
                            </div>
                            <h3 className="text-white font-black text-2xl uppercase mb-4">Viaggio in treno</h3>
                            <p className="text-yellow-300 font-bold text-lg leading-snug mb-8">
                                La scuola media si trova in Città degli Arcobaleni. Per andarci devi affrontare un viaggio in treno del costo di 255 gettoni.<br /><br />Vuoi partire?
                            </p>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowTravelConfirm(false)}
                                    className="flex-1 bg-white/20 hover:bg-white/30 text-white font-black py-4 rounded-2xl border-2 border-white/30 transition-all uppercase tracking-widest"
                                >
                                    No
                                </button>
                                <button 
                                    onClick={handleConfirmTravel}
                                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 rounded-2xl border-2 border-white transition-all uppercase tracking-widest shadow-lg"
                                >
                                    Sì, partiamo!
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyRewardsModal;
