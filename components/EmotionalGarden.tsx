
import React, { useState, useEffect, useRef } from 'react';
import { AppView, ChatMessage } from '../types';
import { Sparkles, MessageCircle, Send, X, Loader2, ArrowLeft, Mic, MicOff, MapPin } from 'lucide-react';
import { getGrufoResponse } from '../services/ai';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfgirdinfeemoxion55f4300.webp';
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
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gioiagrufoemotional.mp3'
        },
        { 
            id: 'entusiasmo', 
            label: 'Entusiasmo', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/entusitre33s.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/entusiasmogrufoemotional.mp3'
        },
        { 
            id: 'orgoglio', 
            label: 'Orgoglio', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/orgogli3ed44fee.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/orgogliogrufoemotionel.mp3'
        },
        { 
            id: 'soddisfazione', 
            label: 'Soddisfazione', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/soddisfazio44rre44.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/soddisfazionegrutioemotional.mp3'
        },
        { 
            id: 'felicita', 
            label: 'Felicità', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/felicire3ed.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/felicitagrufoemotional.mp3'
        },
        { 
            id: 'gratitudine', 
            label: 'Gratitudine', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gratitud4e3w2.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gratitudinegrufoemotional.mp3'
        },
        { 
            id: 'amore', 
            label: 'Amore', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/amorefr55rfr44.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/amoegrufoemotional.mp3'
        },
        { 
            id: 'affetto', 
            label: 'Affetto', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/affettoijr7urhr7.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/affettogrufoemotional.mp3'
        },
        { 
            id: 'empatia', 
            label: 'Empatia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/empatia44fre0oi888.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/empatiagrufoemotional.mp3'
        },
    ],
    TRISTE: [
        { 
            id: 'tristezza', 
            label: 'Tristezza', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tristezza3ed2sza.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tristezzafrufoemotional.mp3'
        },
        { 
            id: 'delusione', 
            label: 'Delusione', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dekusione4de3ws2q.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/delusionegrufoemotional.mp3'
        },
        { 
            id: 'vergogna', 
            label: 'Vergogna', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vergogna33de4w3.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vergognagrufoemotional.mp3'
        },
    ],
    ARRABBIATO: [
        { 
            id: 'rabbia', 
            label: 'Rabbia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rabbia44edfgtt99.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rabbisagrufoemotional.mp3'
        },
        { 
            id: 'frustrazione', 
            label: 'Frustrazione', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frustra33de5rferts4rr5.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frustrazionegrufoemotional.mp3'
        },
        { 
            id: 'gelosia', 
            label: 'Gelosia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gelosiadee4rfx.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gelosiagrufoemotionsal.mp3'
        },
        { 
            id: 'invidia', 
            label: 'Invidia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/invidia776yfbfgegxds.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/invidiagrufoemotional.mp3'
        },
        { 
            id: 'fastidio', 
            label: 'Fastidio', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/asidiie4edestidio.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fastidiogrufoemotional.mp3'
        },
        { 
            id: 'disgusto', 
            label: 'Disgusto', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/disgusto55rfex.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/disgustogrufoemotional.mp3'
        },
    ],
    PREOCCUPATO: [
        { 
            id: 'paura', 
            label: 'Paura', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/paurafear44fx.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pauragrufoemotional.mp3'
        },
        { 
            id: 'ansia', 
            label: 'Ansia', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ansiagrf55e4.webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ansiagrufoemotional.mp3'
        },
        { 
            id: 'timidezza', 
            label: 'Timidezza', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/timidezzaxsxw233ws2.jpg',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/timidezzagrufoamotional.mp3'
        },
        { 
            id: 'preoccupazione', 
            label: 'Preoccupazione', 
            icon: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/peeoccu76tdsa+(1).webp',
            audio: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/preoccupazionegrufoemotonal.mp3'
        },
    ]
};

const EmotionalGarden: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [selectedCategory, setSelectedCategory] = useState<EmotionCategory | null>(null);
    const [activeSubEmotionLabel, setActiveSubEmotionLabel] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    const voiceAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
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
        if (voiceAudioSourceRef.current) {
            try { voiceAudioSourceRef.current.stop(); } catch(e) {}
            voiceAudioSourceRef.current = null;
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

    const handleSubEmotionClick = async (emo: SubEmotion) => {
        if (!emo.audio) return;
        
        if (activeSubEmotionLabel === emo.label) {
            stopAllAudio();
            return;
        }

        stopAllAudio();
        setActiveSubEmotionLabel(emo.label);
        
        const bgMusic = new Audio(BG_MUSIC_URL);
        bgMusic.volume = 0.3; 
        bgMusicRef.current = bgMusic;
        bgMusic.play().catch(e => console.error("Audio background play blocked", e));
        
        voiceTimeoutRef.current = window.setTimeout(async () => {
            try {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                const response = await fetch(emo.audio!);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
                
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                
                const gainNode = ctx.createGain();
                gainNode.gain.value = 2.5; 
                
                source.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                source.onended = () => {
                    endMusicTimeoutRef.current = window.setTimeout(() => {
                        if (bgMusicRef.current) {
                            startFadeOut(bgMusicRef.current);
                        }
                    }, 5000);
                };
                
                source.start(0);
                voiceAudioSourceRef.current = source;
            } catch (err) {
                console.error("Errore amplificazione voce IA:", err);
            }
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

            {/* HEADER SUPERIORE: 3 COLONNE PER CENTRARE IL BANNER DI GRUFO */}
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

                {/* GRUFO AL CENTRO IN ALTO - BANNER IMMAGINE */}
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
                        <div className="grid grid-cols-2 gap-x-12 md:gap-x-72 gap-y-4 md:gap-y-12 mb-4 md:mb-8 shrink-0 relative z-20 border-none">
                            <button onClick={() => handleFlowerClick('FELICE')} className="group outline-none border-none bg-transparent relative z-30">
                                <img src={FLOWER_FELICE} className="w-44 h-44 md:w-[26rem] md:h-[26rem] object-contain opacity-100 flower-idle flower-halo drop-shadow-2xl group-hover:scale-110 transition-transform" alt="Felice" />
                            </button>
                            <button onClick={() => handleFlowerClick('TRISTE')} className="group outline-none border-none bg-transparent relative z-30">
                                <img src={FLOWER_TRISTE} className="w-44 h-44 md:w-[26rem] md:h-[26rem] object-contain opacity-100 flower-idle flower-halo drop-shadow-2xl group-hover:scale-110 transition-transform" alt="Triste" />
                            </button>
                            <button onClick={() => handleFlowerClick('ARRABBIATO')} className="group outline-none border-none bg-transparent relative z-30">
                                <img src={FLOWER_ARRABBIATO} className="w-44 h-44 md:w-[26rem] md:h-[26rem] object-contain opacity-100 flower-idle flower-halo drop-shadow-2xl group-hover:scale-110 transition-transform" alt="Arrabbiato" />
                            </button>
                            <button onClick={() => handleFlowerClick('PREOCCUPATO')} className="group outline-none border-none bg-transparent relative z-30">
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
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'it-IT';
            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                setIsListening(false);
            };
            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
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
