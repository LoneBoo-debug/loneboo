
import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, MessageCircle, Gamepad2, Clock, Star } from 'lucide-react';
import { AppView } from '../types';
import { addTokens } from '../services/tokens';
import { CALENDAR_INFO, monthNames } from '../services/calendarDatabase';

interface DailyRewardsModalProps {
    onClose: () => void;
    setView: (view: AppView) => void;
}

const ICON_CLOCK = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/orologiocalendar553ws+(1).webp';
const ICON_CALENDAR = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/claenxarclande432wws+(1).webp';
const IMG_CLAIM_TOKENS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gettonoprex4r3e2waa.webp';
const BTN_ATELIER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/personaliboo90i87y6.webp';
const IMG_GO_SCHOOL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/andiamoascuolamodaleewerfgr4rf.webp';

// Nuovi Asset per Riscossione
const IMG_SUCCESS_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/riscuotigettonirewards44f55tfre.webp';
const BTN_OTTIMO_CLOSE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/OTTIMOgettonirccolt654rf4.webp';
const IMG_CLAIMED_STATUS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gettoniriscossimosl5re3e.webp';

const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({ onClose, setView }) => {
    const [now, setNow] = useState(new Date());
    const [hasClaimed, setHasClaimed] = useState(false);
    const [showClaimSuccess, setShowClaimSuccess] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        
        const todayStr = new Date().toISOString().split('T')[0];
        const lastClaim = localStorage.getItem('loneboo_daily_tokens_last_claim');
        setHasClaimed(lastClaim === todayStr);

        return () => clearInterval(timer);
    }, []);

    const getTimeBasedData = () => {
        const h = now.getHours();
        const m = now.getMinutes();
        const totalMinutes = h * 60 + m;

        // 00:00 - 05:00
        if (totalMinutes >= 0 && totalMinutes < 300) {
            return {
                text: "non so come tu faccia a restare sveglio a quest'ora ma è veramente tardi di solito si dorme....",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boostupito44r3e3e+(1).webp"
            };
        }
        // 05:00 - 06:00
        if (totalMinutes >= 300 && totalMinutes < 360) {
            return {
                text: "Il sole sta per sorgere, ma è ancora molto presto!",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boostupito44r3e3e+(1).webp"
            };
        }
        // 06:00 - 06:30
        if (totalMinutes >= 360 && totalMinutes < 390) {
            return {
                text: "Direi che è abbastanza presto... non riesci a dormire? posso aiutarti in qualche modo?",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boodubbioso33d3+(1).webp",
                action: { label: "Parla con Grufo", view: AppView.EMOTIONAL_GARDEN, icon: MessageCircle }
            };
        }
        // 06:30 - 08:00
        if (totalMinutes >= 390 && totalMinutes < 480) {
            return {
                text: "ben svegliato, oggi è una giornata fantastica, hai fatto colazione?",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofelice4ed22s1qa+(1).webp"
            };
        }
        // 08:00 - 12:00
        if (totalMinutes >= 480 && totalMinutes < 720) {
            return {
                text: "giornata super bellissima per giocare e studiare",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boosuperfelice4ed3e3ws.webp"
            };
        }
        // 12:00 - 14:00
        if (totalMinutes >= 720 && totalMinutes < 840) {
            return {
                text: "a me sta venendo fame tu hai già mangiato?",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofame4e3ws2w+(1).webp"
            };
        }
        // 14:00 - 17:00
        if (totalMinutes >= 840 && totalMinutes < 1020) {
            return {
                text: "che pomeriggio intenso, pieno di emozioni, hai già studiato alla scuola arcobaleno?",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofelice4ed22s1qa+(1).webp"
            };
        }
        // 17:00 - 18:00
        if (totalMinutes >= 1020 && totalMinutes < 1080) {
            return {
                text: "momento super relax, ottimo per fare qualche gioco nel parco giochi",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boosuperfelice4ed3e3ws.webp",
                action: { label: "Al Parco Giochi", view: AppView.PLAY, icon: Gamepad2 }
            };
        }
        // 18:00 - 20:00
        if (totalMinutes >= 1080 && totalMinutes < 1200) {
            return {
                text: "a me sta venendo un pò di fame ci prepariamo per la cena?",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boofame4e3ws2w+(1).webp"
            };
        }
        // 20:00 - 21:00
        if (totalMinutes >= 1200 && totalMinutes < 1260) {
            return {
                text: "comincio ad essere un pò stanco sarebbe ora di prepararsi per andare a nanna",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boostupito44r3e3e+(1).webp"
            };
        }
        // 21:00 - 22:00
        if (totalMinutes >= 1260 && totalMinutes < 1320) {
            return {
                text: "sto crollando, ti direi che è arrivato il momento di chiudere tutto e dormire",
                img: "https://loneboo-images.s3.eu-south-1.amazonaws.com/boodormes2232qws+(1).webp"
            };
        }
        // 22:00 - 00:00
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
    };

    const handleGoAtelier = () => {
        onClose();
        setView(AppView.ATELIER);
    };

    const handleGoSchool = () => {
        onClose();
        setView(AppView.SCHOOL);
    };

    const dateKey = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const holidayInfo = CALENDAR_INFO[dateKey];
    const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const dateStr = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    const timeData = getTimeBasedData();

    return (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 pt-24 md:pt-32 animate-in fade-in duration-300" onClick={onClose}>
            <div 
                className="bg-white/30 backdrop-blur-xl border-4 border-white/20 rounded-[2.5rem] shadow-2xl w-full max-md overflow-hidden relative animate-in zoom-in duration-300 flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header Style Translucido */}
                <div className="bg-white/20 p-6 flex justify-between items-center border-b border-white/10 shrink-0">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">La tua Giornata</h2>
                    <button onClick={onClose} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                    {/* Orario e Data */}
                    <div className="bg-black/20 rounded-3xl p-5 border border-white/10 flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center gap-3">
                            <img src={ICON_CLOCK} alt="" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-md" />
                            <span className="font-black text-3xl md:text-5xl tracking-widest text-yellow-300 drop-shadow-sm">{timeStr}</span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-3">
                            <img src={ICON_CALENDAR} alt="" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-md" />
                            <p className="text-white font-black text-lg md:text-2xl uppercase opacity-90 drop-shadow-sm">{dateStr}</p>
                        </div>
                    </div>

                    {/* Stato del Giorno Personalizzato */}
                    <div className="bg-white/10 rounded-3xl p-5 border border-white/10 flex flex-col gap-4">
                        <h3 className="text-white/60 font-black text-[10px] uppercase tracking-widest leading-none">Stato del Giorno</h3>
                        
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
                                        onClick={() => { onClose(); setView(timeData.action!.view); }}
                                        className="bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-xl border border-white/30 text-[10px] md:text-xs font-black uppercase flex items-center gap-2 w-fit transition-all active:scale-95"
                                    >
                                        <timeData.action.icon size={14} />
                                        {timeData.action.label}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BOX RICORRENZA CALENDARIO */}
                    {holidayInfo && (
                        <div className="bg-gradient-to-r from-orange-500/30 to-yellow-500/30 rounded-3xl p-5 border-2 border-orange-400/40 shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-in slide-in-from-bottom-2 duration-500 flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-500 p-2 rounded-xl text-white shadow-md">
                                    <Star size={20} fill="currentColor" />
                                </div>
                                <h4 className="text-white font-black text-lg md:text-xl uppercase tracking-tight drop-shadow-md">
                                    {holidayInfo.event}
                                </h4>
                            </div>
                            {holidayInfo.description && (
                                <p className="text-orange-50 font-bold text-xs md:text-sm leading-relaxed italic opacity-90 pl-1">
                                    "{holidayInfo.description}"
                                </p>
                            )}
                        </div>
                    )}

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
                            onClick={handleGoAtelier}
                            className="w-[28%] hover:scale-105 active:scale-95 transition-all outline-none border-none bg-transparent"
                        >
                            <img src={BTN_ATELIER_IMG} alt="Personalizza Boo" className="w-full h-auto drop-shadow-xl" />
                        </button>

                        <button 
                            onClick={handleGoSchool}
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
