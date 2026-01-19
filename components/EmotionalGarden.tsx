
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { Sparkles } from 'lucide-react';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfgirdinfeemoxion55f4300.webp';
const BTN_BACK_GARDEN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torndagiargardes332+(2).webp';
const BTN_BACK_CITY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tornacuty55frxxw21+(1).webp';

const FLOWER_FELICE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/feliceflower44s.webp';
const FLOWER_TRISTE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tristeflower44fx33.webp';
const FLOWER_ARRABBIATO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/arrabbiatoflower44fx4455+(3).webp';
const FLOWER_PREOCCUPATO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/preoccupaflower44fx5rf+(1).webp';

const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/calm-piano-mickeyscat-147764.mp3';

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
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-16T14_22_19_Antonio+Farina+-+Italian+PRO+Talent+-+Audiobook%2C+Narration_pvc_sp77_s30_sb74_se6_m2.mp3'
        },
        { 
            id: 'entusiasmo', 
            label: 'Entusiasmo', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/entusitre33s.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-16T14_30_19_Antonio+Farina+-+Italian+PRO+Talent+-+Audiobook%2C+Narration_pvc_sp77_s30_sb74_se6_m2.mp3'
        },
        { 
            id: 'orgoglio', 
            label: 'Orgoglio', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/orgogli3ed44fee.webp' 
        },
        { 
            id: 'soddisfazione', 
            label: 'Soddisfazione', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/soddisfazio44rre44.webp' 
        },
        { 
            id: 'felicita', 
            label: 'Felicità', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/felicire3ed.webp' 
        },
        { 
            id: 'gratitudine', 
            label: 'Gratitudine', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gratitud4e3w2.webp' 
        },
        { 
            id: 'amore', 
            label: 'Amore', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/amorefr55rfr44.webp' 
        },
        { 
            id: 'affetto', 
            label: 'Affetto', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/affettoijr7urhr7.webp' 
        },
        { 
            id: 'empatia', 
            label: 'Empatia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/empatia44fre0oi888.webp' 
        },
    ],
    TRISTE: [
        { 
            id: 'tristezza', 
            label: 'Tristezza',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tristezza3ed2sza.webp'
        },
        { 
            id: 'delusione', 
            label: 'Delusione',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dekusione4de3ws2q.webp'
        },
        { 
            id: 'vergogna', 
            label: 'Vergogna',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vergogna33de4w3.webp'
        },
    ],
    ARRABBIATO: [
        { 
            id: 'rabbia', 
            label: 'Rabbia',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rabbia44edfgtt99.webp'
        },
        { 
            id: 'frustrazione', 
            label: 'Frustrazione',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frustra33de5rferts4rr5.webp'
        },
        { 
            id: 'gelosia', 
            label: 'Gelosia',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gelosiadee4rfx.webp'
        },
        { 
            id: 'invidia', 
            label: 'Invidia',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/invidia776yfbfgegxds.webp'
        },
        { 
            id: 'fastidio', 
            label: 'Fastidio',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/asidiie4edestidio.webp'
        },
        { 
            id: 'disgusto', 
            label: 'Disgusto',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/disgusto55rfex.webp'
        },
    ],
    PREOCCUPATO: [
        { 
            id: 'paura', 
            label: 'Paura',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/paurafear44fx.webp'
        },
        { 
            id: 'ansia', 
            label: 'Ansia',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ansiagrf55e4.webp'
        },
        { 
            id: 'timidezza', 
            label: 'Timidezza',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/timidezzaxsxw233ws2.jpg'
        },
        { 
            id: 'preoccupazione', 
            label: 'Preoccupazione',
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/peeoccu76tdsa+(1).webp'
        },
    ]
};

const EmotionalGarden: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [selectedCategory, setSelectedCategory] = useState<EmotionCategory | null>(null);
    const [activeSubEmotionLabel, setActiveSubEmotionLabel] = useState<string | null>(null);
    
    const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);
    const voiceTimeoutRef = useRef<number | null>(null);
    const endMusicTimeoutRef = useRef<number | null>(null);
    const fadeIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        return () => {
            stopAllAudio();
        };
    }, []);

    const stopAllAudio = () => {
        setActiveSubEmotionLabel(null);
        if (voiceAudioRef.current) {
            voiceAudioRef.current.pause();
            voiceAudioRef.current = null;
        }
        if (bgMusicRef.current) {
            bgMusicRef.current.pause();
            bgMusicRef.current = null;
        }
        if (voiceTimeoutRef.current) {
            clearTimeout(voiceTimeoutRef.current);
            voiceTimeoutRef.current = null;
        }
        if (endMusicTimeoutRef.current) {
            clearTimeout(endMusicTimeoutRef.current);
            endMusicTimeoutRef.current = null;
        }
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
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
                setActiveSubEmotionLabel(null);
            }
        }, 100); 
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
        bgMusic.volume = 0.6;
        bgMusicRef.current = bgMusic;
        bgMusic.play().catch(e => console.error("Audio background play blocked", e));
        voiceTimeoutRef.current = window.setTimeout(() => {
            const voice = new Audio(emo.audio);
            voiceAudioRef.current = voice;
            voice.onended = () => {
                endMusicTimeoutRef.current = window.setTimeout(() => {
                    if (bgMusicRef.current) {
                        startFadeOut(bgMusicRef.current);
                    }
                }, 5000);
                voiceAudioRef.current = null;
                voiceTimeoutRef.current = null;
            };
            voice.play().catch(e => console.error("Voice play blocked", e));
        }, 4000);
    };

    return (
        <div className="fixed inset-0 z-10 bg-[#e0f2fe] flex flex-col overflow-hidden pt-[64px] md:pt-[96px] select-none">
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
                <img src={BG_URL} alt="" className="w-full h-full object-fill" />
            </div>

            <div className="relative z-[60] w-full p-4 md:p-6 flex justify-between items-center shrink-0">
                <div className="flex gap-2">
                    {selectedCategory && (
                        <button 
                            onClick={resetSelection}
                            className="hover:scale-110 active:scale-95 transition-all outline-none"
                        >
                            <img src={BTN_BACK_GARDEN} alt="Indietro" className="w-16 h-16 md:w-28 h-auto drop-shadow-2xl" />
                        </button>
                    )}
                </div>
                <button 
                    onClick={() => { stopAllAudio(); setView(AppView.CITY_MAP); }}
                    className="hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={BTN_BACK_CITY} alt="Torna in Città" className="w-16 h-16 md:w-28 h-auto drop-shadow-2xl" />
                </button>
            </div>

            <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-start pt-2 md:pt-4 p-4 overflow-hidden">
                {!selectedCategory && (
                    <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-start">
                        <div className="grid grid-cols-2 gap-x-12 md:gap-x-72 gap-y-4 md:gap-y-12 mb-4 md:mb-8 shrink-0 relative z-20">
                            <button onClick={() => handleFlowerClick('FELICE')} className="group outline-none relative z-30">
                                <img src={FLOWER_FELICE} className="w-44 h-44 md:w-[26rem] md:h-[26rem] object-contain opacity-100 flower-idle flower-halo drop-shadow-2xl group-hover:scale-110 transition-transform" alt="Felice" />
                            </button>
                            <button onClick={() => handleFlowerClick('TRISTE')} className="group outline-none relative z-30">
                                <img src={FLOWER_TRISTE} className="w-44 h-44 md:w-[26rem] md:h-[26rem] object-contain opacity-100 flower-idle flower-halo drop-shadow-2xl group-hover:scale-110 transition-transform" alt="Triste" />
                            </button>
                            <button onClick={() => handleFlowerClick('ARRABBIATO')} className="group outline-none relative z-30">
                                <img src={FLOWER_ARRABBIATO} className="w-44 h-44 md:w-[26rem] md:h-[26rem] object-contain opacity-100 flower-idle flower-halo drop-shadow-2xl group-hover:scale-110 transition-transform" alt="Arrabbiato" />
                            </button>
                            <button onClick={() => handleFlowerClick('PREOCCUPATO')} className="group outline-none relative z-30">
                                <img src={FLOWER_PREOCCUPATO} className="w-44 h-44 md:w-[26rem] md:h-[26rem] object-contain opacity-100 flower-idle flower-halo drop-shadow-2xl group-hover:scale-110 transition-transform" alt="Preoccupato" />
                            </button>
                        </div>
                        <div className="mt-4 flex flex-col items-center gap-2">
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
            <div className="absolute bottom-2 left-0 right-0 flex justify-center opacity-30 pointer-events-none z-0">
                <p className="text-white font-black text-[7px] uppercase tracking-[0.4em]">Lone Boo World • 2025</p>
            </div>
        </div>
    );
};

export default EmotionalGarden;
