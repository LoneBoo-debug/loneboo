
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppView, ChatMessage } from '../types';
import { Sparkles, MessageCircle, Send, X, Loader2, ArrowLeft, Mic, MicOff, MapPin } from 'lucide-react';
import { getGrufoResponse } from '../services/ai';
import { getWeatherForDate, isNightTime } from '../services/weatherService';

const BG_SUN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/emozzzionisole.webp';
const BG_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/emozzzionipioggia.webp';
const BG_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/emozzzionivento.webp';
const BG_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/emozzzionineve.webp';

// Nuovi Asset Notturni
const NIGHT_SUN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/emozioninttesolexsa.webp';
const NIGHT_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/emozioninottepioggiaxsa.webp';
const NIGHT_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/emozioninotteventoytr.webp';
const NIGHT_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/emozioninttenevesd.webp';

const BTN_BACK_GARDEN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torndagiargardes332+(2).webp';
const BTN_BACK_CITY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tornacuty55frxxw21+(1).webp';

const FLOWER_FELICE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/feliceflower44s.webp';
const FLOWER_TRISTE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tristeflower44fx33.webp';
const FLOWER_ARRABBIATO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/arrabbiatoflower44fx4455+(3).webp';
const FLOWER_PREOCCUPATO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/preoccupaflower44fx5rf+(1).webp';

const GRUFO_CHAT_ICON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grufo.webp';
const GRUFO_BANNER_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grufobannerdaij32+(1).webp';
const BTN_MARAGNO_NAV = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/HATRUFOMARAGNO.webp';
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/calm-piano-mickeyscat-147764.mp3';

// Asset per il Dialogo Iniziale
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';
const GRUFO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grufanimation131.mp4';

const AUDIO_SEQ_1 = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/oonebooemozioni1.mp3';
const AUDIO_SEQ_2 = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gruforsispondea+boo2parte.mp3';
const AUDIO_SEQ_3 = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boo2parteripgrufo.mp3';

type EmotionCategory = 'FELICE' | 'TRISTE' | 'ARRABBIATO' | 'PREOCCUPATO';

interface SubEmotion {
    id: string;
    label: string;
    icon?: string;
    audio?: string;
}

const EMOTIONS_DATA: Record<EmotionCategory, SubEmotion[]> = {
    FELICE: [
        { 
            id: 'gioia', 
            label: 'Gioia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gioiaentr44.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/2a91fb88-e921-477c-b821-54fa41f3dd73.mp3'
        },
        { 
            id: 'entusiasmo', 
            label: 'Entusiasmo', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/entusitre33s.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/a7d81f87-9b8d-4b36-825f-2fca5efd864b.mp3'
        },
        { 
            id: 'orgoglio', 
            label: 'Orgoglio', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/orgogli3ed44fee.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/2835eb80-5dc8-4157-8baa-02be43f10fb8.mp3'
        },
        { 
            id: 'soddisfazione', 
            label: 'Soddisfazione', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/soddisfazio44rre44.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/80fe2fea-39fa-4d06-bf3c-9fa3215af04f.mp3'
        },
        { 
            id: 'felicita', 
            label: 'Felicità', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/felicire3ed.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/428a6c25-22fe-4c6b-b31c-025844a6717b.mp3'
        },
        { 
            id: 'gratitudine', 
            label: 'Gratitudine', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gratitud4e3w2.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/5e0e2ed4-6d05-4667-b7eb-7c2af2fe8825.mp3'
        },
        { 
            id: 'amore', 
            label: 'Amore', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/amorefr55rfr44.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/302c04c3-8fc3-4136-9d97-60a8e79fbb16.mp3'
        },
        { 
            id: 'affetto', 
            label: 'Affetto', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/affettoijr7urhr7.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/7806f1e7-591f-4735-ba39-d343c0cfa81a.mp3'
        },
        { 
            id: 'empatia', 
            label: 'Empatia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/empatia44fre0oi888.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/02632d98-8577-4655-81d7-9d264c57256b.mp3'
        },
    ],
    TRISTE: [
        { 
            id: 'tristezza', 
            label: 'Tristezza', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tristezza3ed2sza.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/64b243c6-56f3-4679-b570-4a5e2cdadf16.mp3'
        },
        { 
            id: 'delusione', 
            label: 'Delusione', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dekusione4de3ws2q.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/c5d1f580-cf70-45ba-9815-eb92350dcd3c.mp3'
        },
        { 
            id: 'vergogna', 
            label: 'Vergogna', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vergogna33de4w3.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/461fa534-89b3-4a58-88f8-75aaab3f98ac.mp3'
        },
    ],
    ARRABBIATO: [
        { 
            id: 'rabbia', 
            label: 'Rabbia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rabbia44edfgtt99.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/114a7a7d-4307-4b0a-9824-622adc813f9d.mp3'
        },
        { 
            id: 'frustrazione', 
            label: 'Frustrazione', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frustra33de5rferts4rr5.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/7c35e87e-85c2-4beb-9643-125dbd6c6d25.mp3'
        },
        { 
            id: 'gelosia', 
            label: 'Gelosia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gelosiadee4rfx.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/77e10211-3362-4a1a-8a84-29d00db5ab07.mp3'
        },
        { 
            id: 'invidia', 
            label: 'Invidia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/invidia776yfbfgegxds.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/45607662-aa6e-4e31-b876-1906ad97afb8.mp3'
        },
        { 
            id: 'fastidio', 
            label: 'Fastidio', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/asidiie4edestidio.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/f85058ed-bd4c-4998-8f6e-5e4db1fc5975.mp3'
        },
        { 
            id: 'disgusto', 
            label: 'Disgusto', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/disgusto55rfex.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/e183985d-4c5a-43db-8fbb-be2db5a81494.mp3'
        },
    ],
    PREOCCUPATO: [
        { 
            id: 'paura', 
            label: 'Paura', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/paurafear44fx.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/0bc0faae-6197-4f0b-a087-8ba41c738771.mp3'
        },
        { 
            id: 'ansia', 
            label: 'Ansia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ansiagrf55e4.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/f255db69-567c-4a29-ab2d-82f2dab6975f.mp3'
        },
        { 
            id: 'timidezza', 
            label: 'Timidezza', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/timidezzaxsxw233ws2.jpg',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/d7d031e7-3bab-4254-b8de-c993e0e72408.mp3'
        },
        { 
            id: 'preoccupazione', 
            label: 'Preoccupazione', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/peeoccu76tdsa+(1).webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/51aabaca-b89b-46b1-941e-0abc7cf7de46.mp3'
        },
    ]
};

const EmotionalGarden: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [selectedCategory, setSelectedCategory] = useState<EmotionCategory | null>(null);
    const [activeSubEmotionLabel, setActiveSubEmotionLabel] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    // --- STATI PER LA SEQUENZA DIALOGO ---
    const [isSeqPlaying, setIsSeqPlaying] = useState(false);
    const [currentVideoSrc, setCurrentVideoSrc] = useState(BOO_TALK_VIDEO);
    const [showMiniTV, setShowMiniTV] = useState(false);
    
    const seqAudioRef = useRef<HTMLAudioElement | null>(null);
    const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);
    
    const sequenceTimerRef = useRef<number | null>(null);
    const fadeIntervalRef = useRef<number | null>(null);

    // DETERMINAZIONE METEO E SFONDO
    const todayWeather = useMemo(() => getWeatherForDate(new Date()), []);
    const currentBg = useMemo(() => {
        const isNight = isNightTime(new Date());
        if (isNight) {
            switch (todayWeather) {
                case 'SNOW': return NIGHT_SNOW;
                case 'RAIN': return NIGHT_RAIN;
                case 'WIND': return NIGHT_WIND;
                default: return NIGHT_SUN;
            }
        } else {
            switch (todayWeather) {
                case 'SNOW': return BG_SNOW;
                case 'RAIN': return BG_RAIN;
                case 'WIND': return BG_WIND;
                default: return BG_SUN;
            }
        }
    }, [todayWeather]);

    useEffect(() => {
        window.scrollTo(0, 0);

        // Controllo audio iniziale per la sequenza
        const isAudioEnabled = localStorage.getItem('loneboo_music_enabled') === 'true';
        if (isAudioEnabled) {
            startDialogueSequence();
        }

        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            if (enabled) {
                startDialogueSequence();
            } else {
                stopAllAudio();
            }
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

        return () => {
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            stopAllAudio();
        };
    }, []);

    const stopAllAudio = () => {
        setActiveSubEmotionLabel(null);
        setIsSeqPlaying(false);
        setShowMiniTV(false);
        
        if (seqAudioRef.current) {
            seqAudioRef.current.pause();
            seqAudioRef.current = null;
        }
        if (voiceAudioRef.current) {
            voiceAudioRef.current.pause();
            voiceAudioRef.current = null;
        }
        if (bgMusicRef.current) {
            bgMusicRef.current.pause();
            bgMusicRef.current = null;
        }

        if (sequenceTimerRef.current) {
            clearTimeout(sequenceTimerRef.current);
            sequenceTimerRef.current = null;
        }
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
    };

    // --- LOGICA SEQUENZA DIALOGO ---
    const startDialogueSequence = () => {
        stopAllAudio();
        setIsSeqPlaying(true);
        runStep1();
    };

    const runStep1 = () => {
        setCurrentVideoSrc(BOO_TALK_VIDEO);
        setShowMiniTV(true);
        const audio = new Audio(AUDIO_SEQ_1);
        audio.onended = () => {
            setShowMiniTV(false);
            sequenceTimerRef.current = window.setTimeout(runStep2, 1000);
        };
        seqAudioRef.current = audio;
        audio.play().catch(e => console.error("Audio step 1 blocked", e));
    };

    const runStep2 = () => {
        setCurrentVideoSrc(GRUFO_TALK_VIDEO);
        setShowMiniTV(true);
        const audio = new Audio(AUDIO_SEQ_2);
        audio.onended = () => {
            setShowMiniTV(false);
            sequenceTimerRef.current = window.setTimeout(runStep3, 1000);
        };
        seqAudioRef.current = audio;
        audio.play().catch(e => console.error("Audio step 2 blocked", e));
    };

    const runStep3 = () => {
        setCurrentVideoSrc(BOO_TALK_VIDEO);
        setShowMiniTV(true);
        const audio = new Audio(AUDIO_SEQ_3);
        audio.onended = () => {
            setShowMiniTV(false);
            setIsSeqPlaying(false);
        };
        seqAudioRef.current = audio;
        audio.play().catch(e => console.error("Audio step 3 blocked", e));
    };

    const handleFlowerClick = (cat: EmotionCategory) => {
        setSelectedCategory(cat);
    };

    const resetSelection = () => {
        stopAllAudio();
        setSelectedCategory(null);
    };

    const handleSubEmotionClick = (emo: SubEmotion) => {
        if (!emo.audio) return;
        
        if (activeSubEmotionLabel === emo.label) {
            stopAllAudio();
            return;
        }

        stopAllAudio();
        setActiveSubEmotionLabel(emo.label);
        
        const bgMusic = new Audio(BG_MUSIC_URL);
        bgMusic.volume = 0.5; 
        bgMusicRef.current = bgMusic;
        bgMusic.play().catch(e => console.error("Audio background play blocked", e));
        
        sequenceTimerRef.current = window.setTimeout(() => {
            const voice = new Audio(emo.audio);
            voice.volume = 1.0;
            voiceAudioRef.current = voice;

            voice.onended = () => {
                sequenceTimerRef.current = window.setTimeout(() => {
                    if (bgMusicRef.current) {
                        startFadeOut(bgMusicRef.current);
                    }
                }, 5000);
            };

            voice.play().catch(err => console.error("Errore riproduzione voce narrata:", err));
        }, 5000);
    };

    const startFadeOut = (audio: HTMLAudioElement) => {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        const fadeStep = 0.02;
        fadeIntervalRef.current = window.setInterval(() => {
            if (audio.volume > fadeStep) {
                audio.volume -= fadeStep;
            } else {
                audio.volume = 0;
                audio.pause();
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = null;
            }
        }, 100); 
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-10 bg-[#e0f2fe] flex flex-col overflow-hidden pt-[64px] md:pt-[96px] select-none">
            <style>{`
                @keyframes flower-breath {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
                .flower-idle { animation: flower-breath 3s ease-in-out infinite; }
                .text-cartoon-garden {
                    font-family: 'Luckiest Guy', cursive;
                    -webkit-text-stroke: 1.5px black;
                    text-shadow: 4px 4px 0px rgba(0,0,0,0.2);
                }
                .flower-halo {
                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes slide-label {
                    0% { transform: translateX(-50px); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                .animate-subemotion-label {
                    animation: slide-label 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>

            <div className="fixed inset-0 z-0 pointer-events-none">
                <img src={currentBg} alt="" className="w-full h-full object-fill animate-in fade-in duration-1000" />
            </div>

            {/* MINI TV PER LA SEQUENZA DIALOGO */}
            {showMiniTV && (
                <div className="absolute top-20 md:top-28 left-4 z-[110] animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video 
                            src={currentVideoSrc} 
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

            {/* HEADER SUPERIORE */}
            <div className="relative z-[60] w-full p-4 md:p-6 grid grid-cols-3 items-center shrink-0">
                <div className="flex justify-start">
                    {selectedCategory && (
                        <button 
                            onClick={resetSelection}
                            className="hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent"
                        >
                            <img src={BTN_BACK_GARDEN} alt="Indietro" className="w-16 h-16 md:w-28 h-auto drop-shadow-2xl" />
                        </button>
                    )}
                </div>

                <div className="flex justify-center">
                    <button 
                        onClick={() => setIsChatOpen(true)}
                        className="hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent"
                    >
                        <img 
                            src={GRUFO_BANNER_BTN} 
                            alt="Parla con Grufo" 
                            className="w-32 md:w-64 h-auto drop-shadow-2xl" 
                        />
                    </button>
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={() => { stopAllAudio(); setView(AppView.CITY_MAP); }}
                        className="hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent"
                    >
                        <img src={BTN_BACK_CITY} alt="Torna in Città" className="w-16 h-16 md:w-28 h-auto drop-shadow-2xl" />
                    </button>
                </div>
            </div>

            <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-start pt-2 md:pt-4 p-4 overflow-hidden">
                {!selectedCategory && (
                    <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-start">
                        {/* FIORI SPOSTATI PIÙ IN BASSO */}
                        <div className="flex flex-row flex-wrap justify-center items-center gap-4 md:gap-12 relative z-20 border-none animate-in slide-in-from-bottom duration-1000 mt-24 md:mt-40">
                            <button onClick={() => handleFlowerClick('FELICE')} className="group outline-none border-none bg-transparent relative z-30">
                                <img 
                                    src={FLOWER_FELICE} 
                                    className="w-28 h-28 md:w-64 md:h-64 object-contain opacity-100 flower-idle flower-halo drop-shadow-2xl group-hover:scale-110 transition-transform" 
                                    style={{ animationDelay: '0s' }}
                                    alt="Felice" 
                                />
                            </button>
                            <button onClick={() => handleFlowerClick('TRISTE')} className="group outline-none border-none bg-transparent relative z-30">
                                <img 
                                    src={FLOWER_TRISTE} 
                                    className="w-28 h-28 md:w-64 md:h-64 object-contain opacity-100 flower-idle flower-halo drop-shadow-2xl group-hover:scale-110 transition-transform" 
                                    style={{ animationDelay: '1.2s' }}
                                    alt="Triste" 
                                />
                            </button>
                            <button onClick={() => handleFlowerClick('ARRABBIATO')} className="group outline-none border-none bg-transparent relative z-30">
                                <img 
                                    src={FLOWER_ARRABBIATO} 
                                    className="w-28 h-28 md:w-64 md:h-64 object-contain opacity-100 flower-idle flower-halo drop-shadow-2xl group-hover:scale-110 transition-transform" 
                                    style={{ animationDelay: '0.6s' }}
                                    alt="Arrabbiato" 
                                />
                            </button>
                            <button onClick={() => handleFlowerClick('PREOCCUPATO')} className="group outline-none border-none bg-transparent relative z-30">
                                <img 
                                    src={FLOWER_PREOCCUPATO} 
                                    className="w-28 h-28 md:w-64 md:h-64 object-contain opacity-100 flower-idle flower-halo drop-shadow-2xl group-hover:scale-110 transition-transform" 
                                    style={{ animationDelay: '1.8s' }}
                                    alt="Preoccupato" 
                                />
                            </button>
                        </div>

                        {/* TITOLO SPOSTATO PIÙ IN BASSO */}
                        <div className="flex flex-col items-center gap-2 mb-8 mt-16 md:mt-28 animate-in slide-in-from-top duration-700">
                            <h2 className="text-white text-3xl md:text-7xl text-cartoon-garden text-center px-4 leading-tight drop-shadow-xl">Come ti senti oggi?...</h2>
                            <p className="text-white text-xl md:text-4xl text-cartoon-garden text-center px-4 leading-tight drop-shadow-xl opacity-90">Grufo il Saggio ti spiega le emozioni</p>
                        </div>
                    </div>
                )}
                {selectedCategory && (
                    <div className="w-full max-w-2xl animate-in slide-in-from-bottom-10 duration-500 flex flex-col items-center mt-2 z-50">
                        <div className="bg-white/25 backdrop-blur-xl p-4 md:p-6 rounded-[3rem] border-4 border-white/40 shadow-2xl w-full">
                            <div className="flex items-center justify-between mb-2 md:mb-4 border-b-2 border-white/20 pb-2">
                                <div className="flex items-center gap-3">
                                    <img src={selectedCategory === 'FELICE' ? FLOWER_FELICE : selectedCategory === 'TRISTE' ? FLOWER_TRISTE : selectedCategory === 'ARRABBIATO' ? FLOWER_ARRABBIATO : FLOWER_PREOCCUPATO} className="w-10 h-10 md:w-16 md:h-16 object-contain flower-halo" alt="" />
                                    <h3 className="text-white text-xl md:text-5xl text-cartoon-garden uppercase shrink-0">{selectedCategory === 'FELICE' ? 'Felice' : selectedCategory === 'TRISTE' ? 'Triste' : selectedCategory === 'ARRABBIATO' ? 'Arrabbiato' : 'Preoccupato'}</h3>
                                </div>
                                {activeSubEmotionLabel && (
                                    <div className="animate-subemotion-label pr-4 flex-1 text-right overflow-visible">
                                        <span className="text-yellow-400 text-3xl md:text-8xl text-cartoon-garden uppercase drop-shadow-2xl block whitespace-nowrap">{activeSubEmotionLabel}</span>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-6 max-h-[50vh] overflow-y-auto no-scrollbar px-6 py-6">
                                {EMOTIONS_DATA[selectedCategory].map((emo) => (
                                    <button key={emo.id} onClick={() => handleSubEmotionClick(emo)} className={`bg-white/95 hover:bg-white p-1 rounded-2xl border-b-4 border-slate-300 transition-all flex flex-col items-center group shadow-md relative ${activeSubEmotionLabel === emo.label ? 'ring-8 ring-yellow-400 border-yellow-500 scale-110 z-20 shadow-2xl' : 'active:border-b-0 active:translate-y-0.5'}`}>
                                        {emo.icon ? (
                                            <img src={emo.icon} alt={emo.label} className="w-24 h-24 md:w-48 md:h-48 object-contain group-hover:scale-105 transition-transform" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 w-full p-2">
                                                <div className="w-16 h-16 md:w-32 md:h-32 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 group-hover:scale-105 transition-transform overflow-hidden">
                                                    <span className="text-6xl">✨</span>
                                                </div>
                                                <span className="font-black text-slate-800 text-[10px] md:text-sm uppercase tracking-tighter truncate w-full text-center">{emo.label}</span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p className="mt-3 md:mt-6 text-white/80 font-black uppercase tracking-widest text-[8px] md:text-[10px] bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">Tocca un'emozione per ascoltare Grufo</p>
                    </div>
                )}
            </div>

            {isChatOpen && <GrufoChatModal setView={setView} onClose={() => setIsChatOpen(false)} />}

            <div className="absolute bottom-2 left-0 right-0 flex justify-center opacity-30 pointer-events-none z-0">
                <p className="text-white font-black text-[7px] uppercase tracking-[0.4em]">Lone Boo World • 2025</p>
            </div>
        </div>
    );
};

// --- COMPONENTE CHAT GRUFO ---
const GrufoChatModal: React.FC<{ onClose: () => void; setView: (v: AppView) => void }> = ({ onClose, setView }) => {
    const [history, setHistory] = useState<ChatMessage[]>([
        { role: 'model', text: 'Ciao. Sono Grufo il Saggio. Se senti un peso nel cuore o un pensiero che ti disturba, raccontamelo. Sono qui per aiutarti a capire i tuoi sentimenti con chiarezza. 🦉' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [pendingNav, setPendingNav] = useState<AppView | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            // FIX: Defined 'recognition' locally before assigning to the ref to fix 'Cannot find name recognition' error
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'it-IT';
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                setIsListening(false);
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isThinking, pendingNav]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || isThinking) return;
        const userMsg: ChatMessage = { role: 'user', text: inputText };
        setHistory(prev => [...prev, userMsg]);
        setInputText('');
        setIsThinking(true);
        setPendingNav(null);

        try {
            const responseText = await getGrufoResponse(history, userMsg.text);
            const navMatch = responseText.match(/\[ACTION:NAV:(\w+)\]/);
            
            let cleanResponse = responseText
                .replace(/\[ACTION:NAV:\w+\]/g, '')
                .trim();

            setHistory(prev => [...prev, { role: 'model', text: cleanResponse }]);
            
            if (navMatch) {
                setPendingNav(navMatch[1] as AppView);
            }
        } catch (e) {
            setHistory(prev => [...prev, { role: 'model', text: "Le nuvole della mente sono un po' fitte. Prova a ridirmi cosa provi." }]);
        } finally {
            setIsThinking(false);
        }
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) recognitionRef.current.stop();
        else { setIsListening(true); recognitionRef.current.start(); }
    };

    const handleNavClick = () => {
        if (pendingNav) {
            onClose();
            setView(pendingNav);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#0c1a2c]/95 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-[#1a2e44] w-full max-w-2xl h-[85vh] rounded-[3rem] border-8 border-yellow-400 shadow-2xl flex flex-col overflow-hidden relative">
                
                {/* Header Chat */}
                <div className="bg-[#2c4a6b] p-4 flex items-center gap-3 border-b-4 border-[#0c1a2c] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 md:w-20 md:h-20 bg-black/20 rounded-full p-1 border-2 border-yellow-400/30">
                            <img src={GRUFO_CHAT_ICON} alt="Grufo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h3 className="text-yellow-400 font-luckiest text-xl md:text-3xl uppercase leading-none">Grufo il Saggio</h3>
                            <span className="text-blue-300 font-black text-[10px] md:text-xs uppercase tracking-widest opacity-70">Guida Emotiva</span>
                        </div>
                    </div>
                    <div className="flex-1"></div>
                    <button onClick={onClose} className="hover:scale-110 active:scale-95 transition-all outline-none">
                        <img src={BTN_BACK_GARDEN} alt="Chiudi" className="w-12 h-12 md:w-16 md:h-16" />
                    </button>
                </div>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat no-scrollbar">
                    {history.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                            <div className={`max-w-[85%] p-4 rounded-[2rem] shadow-xl font-bold text-sm md:text-xl leading-relaxed relative ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none border-b-4 border-blue-800' : 'bg-slate-100 text-slate-800 rounded-tl-none border-b-4 border-slate-300'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-md flex items-center gap-2 border-b-4 border-slate-900">
                                <Loader2 className="animate-spin text-yellow-400" size={18} />
                                <span className="text-yellow-400/60 font-black text-[10px] uppercase">Grufo sta riflettendo... 🦉</span>
                            </div>
                        </div>
                    )}

                    {pendingNav && !isThinking && (
                        <div className="flex flex-col items-center py-4 animate-in zoom-in duration-500">
                            {pendingNav === AppView.CHAT ? (
                                <button 
                                    onClick={handleNavClick}
                                    className="hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent"
                                >
                                    <img 
                                        src={BTN_MARAGNO_NAV} 
                                        alt="Vai da Maragno" 
                                        className="w-48 md:w-64 h-auto drop-shadow-2xl" 
                                    />
                                </button>
                            ) : (
                                <button 
                                    onClick={handleNavClick}
                                    className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-luckiest py-4 px-8 rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-3 uppercase"
                                >
                                    <MapPin size={24} />
                                    {`VAI A ${pendingNav.replace('SCHOOL', 'SCUOLA').replace('PLAY', 'PARCO GIOCHI').replace('BOOKS', 'LIBRERIA').replace('VIDEOS', 'CINEMA')}`}
                                </button>
                            )}
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#0c1a2c] border-t-4 border-yellow-400/20 shrink-0">
                    <div className="flex items-center gap-2 max-w-4xl mx-auto">
                        <button 
                            onClick={toggleListening} 
                            className={`shrink-0 p-3 md:p-4 rounded-full transition-all border-4 ${isListening ? 'bg-red-500 text-white border-red-700 animate-pulse' : 'bg-slate-800 text-yellow-400 border-slate-700 hover:border-yellow-400'}`}
                        >
                            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                        </button>
                        <input 
                            type="text" 
                            value={inputText} 
                            onChange={(e) => setInputText(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Racconta a Grufo..." 
                            className="flex-1 bg-slate-800 border-4 border-slate-700 rounded-[2rem] px-5 py-3 md:py-4 font-bold text-white text-sm md:text-lg focus:outline-none focus:border-yellow-400 transition-all placeholder-slate-500"
                        />
                        <button 
                            onClick={handleSendMessage} 
                            disabled={!inputText.trim() || isThinking}
                            className="bg-yellow-400 text-blue-900 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50 border-4 border-black"
                        >
                            <Send size={24} strokeWidth={3} />
                        </button>
                    </div>
                    <p className="text-center text-[8px] md:text-[10px] font-bold text-slate-500 uppercase mt-3 tracking-widest">Consultati sempre con un genitore per i pensieri più importanti.</p>
                </div>
            </div>
        </div>
    );
};

export default EmotionalGarden;
