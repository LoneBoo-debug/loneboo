
import React, { useState, useEffect, useRef } from 'react';
import { AppView, ChatMessage } from '../types';
import { Loader2, Send, Volume2, VolumeX, ArrowLeft, Clock, Mic, MicOff, X } from 'lucide-react';
import { getMaragnoChatResponse } from '../services/ai';
import { OFFICIAL_LOGO } from '../constants';

const INFO_POINT_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/info-point.webp';
const MARAGNO_FULL_BODY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/maragno-full.webp';
const MARAGNO_OFFENDED = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/offended.webp';
const BTN_BACK_CITY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bkcitmaraginfpo.webp';
const BTN_CHAT_MARAGNO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/askmaragncart.webp';
const MARLO_TAXI_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/marlo-taxi.webp';

const INSULT_LIMIT = 5;
const BAN_DURATION_MS = 5 * 60 * 1000;

const ChatWithBoo: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [history, setHistory] = useState<ChatMessage[]>([
        { role: 'model', text: 'Ehilà! Sono Maragno, la tua guida a otto zampe! Come posso aiutarti oggi? 🕷️' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [pendingNav, setPendingNav] = useState<AppView | null>(null);
    
    // Safety & Ban Logic
    const [insultCount, setInsultCount] = useState(() => Number(localStorage.getItem('maragno_insults') || 0));
    const [banUntil, setBanUntil] = useState(() => Number(localStorage.getItem('maragno_ban_until') || 0));
    const [timeLeft, setTimeLeft] = useState(0);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    const speakText = (text: string) => {
        if (!audioEnabled || !window.speechSynthesis) return;
        let cleanText = text
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/gu, '')
            .replace(/\[.*?\]/g, '')
            .trim();
        const phoneticText = cleanText
            .replace(/Maragno/gi, 'Mara-nio')
            .replace(/Lone\s*Boo/gi, 'Lon Bu');
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phoneticText);
        utterance.lang = 'it-IT';
        utterance.rate = 1.05; 
        utterance.pitch = 1.15; 
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        const img = new Image();
        img.src = INFO_POINT_BG;
        img.onload = () => setIsLoaded(true);
        setTimeout(() => setIsLoaded(true), 2000);

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'it-IT';
            recognitionRef.current.interimResults = false;
            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputText(prev => (prev ? prev + ' ' + transcript : transcript));
                setIsListening(false);
            };
            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            if (banUntil > now) {
                setTimeLeft(Math.ceil((banUntil - now) / 1000));
            } else {
                setTimeLeft(0);
                if (banUntil > 0) {
                    setBanUntil(0);
                    setInsultCount(0);
                    localStorage.removeItem('maragno_ban_until');
                    localStorage.setItem('maragno_insults', '0');
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [banUntil]);

    useEffect(() => {
        if (isChatOpen) {
            const timer = setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [history, isThinking, isChatOpen, pendingNav]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || isThinking || timeLeft > 0) return;

        const userMsg: ChatMessage = { role: 'user', text: inputText };
        setHistory(prev => [...prev, userMsg]);
        setInputText('');
        setIsThinking(true);
        setPendingNav(null); 

        try {
            const responseText = await getMaragnoChatResponse(history, userMsg.text);
            const navMatch = responseText.match(/\[ACTION:NAV:(\w+)\]/);
            const isOffense = responseText.includes('[OFFENSE_DETECTED]');

            let cleanResponse = responseText
                .replace(/\[ACTION:NAV:\w+\]/g, '')
                .replace(/\[OFFENSE_DETECTED\]/g, '')
                .trim();

            if (isOffense) {
                const newCount = insultCount + 1;
                setInsultCount(newCount);
                localStorage.setItem('maragno_insults', String(newCount));
                
                // --- LOGICA BAN PROGRESSIVA ---
                if (newCount === 4) {
                    cleanResponse = "Attenzione! Questo è l'ultimo avviso. Se continui così interromperò il servizio e entrerò in modalità offeso per 5 minuti! 🕷️⚠️";
                }
                
                if (newCount >= INSULT_LIMIT) {
                    const banTime = Date.now() + BAN_DURATION_MS;
                    setBanUntil(banTime);
                    localStorage.setItem('maragno_ban_until', String(banTime));
                    setIsChatOpen(false); 
                    return; 
                }
            }

            const modelMsg: ChatMessage = { role: 'model', text: cleanResponse };
            setHistory(prev => [...prev, modelMsg]);
            speakText(cleanResponse);

            if (navMatch && !isOffense) {
                const targetView = navMatch[1] as AppView;
                setPendingNav(targetView);
            }

        } catch (e) {
            setHistory(prev => [...prev, { role: 'model', text: "Le mie zampe si sono incrociate! Riprova? 🕷️" }]);
        } finally {
            setIsThinking(false);
        }
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) recognitionRef.current.stop();
        else { setIsListening(true); recognitionRef.current.start(); }
    };

    const toggleChat = () => {
        if (timeLeft > 0) return;
        const willBeOpen = !isChatOpen;
        setIsChatOpen(willBeOpen);
        if (willBeOpen) {
            speakText(history[history.length - 1].text);
        }
    };

    const handleTaxiClick = () => {
        if (pendingNav) {
            setIsChatOpen(false);
            setView(pendingNav);
            setPendingNav(null);
        }
    };

    return (
        <div className="fixed inset-0 z-0 bg-sky-200 overflow-hidden touch-none overscroll-none select-none">
            <div className="absolute inset-0 z-0">
                <img 
                    src={INFO_POINT_BG} 
                    alt="Info Point Maragno" 
                    className={`w-full h-full object-fill transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
            </div>

            {!isLoaded && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-sky-400/90 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento" className="w-32 h-32 animate-spin-horizontal mb-4" />
                    <span className="text-white font-black text-xl animate-pulse uppercase">Arrivo all'Info Point...</span>
                </div>
            )}

            {/* MODALE MARAGNO OFFESO - VISIBILE SE BAN ATTIVO */}
            {timeLeft > 0 && (
                <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[40px] border-8 border-red-600 p-6 w-full max-w-sm text-center shadow-[0_0_50px_rgba(220,38,38,0.5)] flex flex-col items-center animate-in zoom-in duration-300 relative m-auto">
                        <button onClick={() => setView(AppView.CITY_MAP)} className="absolute -top-4 -right-4 bg-red-600 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all shadow-lg z-50">
                            <X size={24} strokeWidth={4} />
                        </button>
                        
                        <div className="w-full h-40 md:h-56 mb-4 overflow-hidden rounded-2xl border-4 border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center">
                            <img 
                                src={MARAGNO_OFFENDED} 
                                alt="Maragno Offeso" 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-black text-red-600 mb-2 uppercase leading-none">Sono offeso!</h2>
                        <p className="text-gray-700 font-bold text-base md:text-lg leading-snug mb-6 px-2">Queste parole non mi piacciono. Ci rivediamo tra 5 minuti quando ti sarai calmato... 🕷️💨</p>
                        
                        <div className="bg-red-50 px-6 py-3 rounded-full border-4 border-red-600 flex items-center gap-3 text-red-600 font-black text-2xl shadow-inner">
                            <Clock size={28} />
                            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>
            )}

            {isLoaded && !isChatOpen && (
                <div className="absolute bottom-0 left-0 right-0 px-6 z-30 flex justify-between items-end animate-in slide-in-from-bottom-4 duration-500">
                    <button onClick={() => setView(AppView.CITY_MAP)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                        <img src={BTN_BACK_CITY} alt="Torna in Città" className="w-32 md:w-48 h-auto drop-shadow-xl" />
                    </button>
                    <button onClick={toggleChat} disabled={timeLeft > 0} className={`hover:scale-110 active:scale-95 transition-all outline-none ${timeLeft > 0 ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}>
                        <img src={BTN_CHAT_MARAGNO} alt="Chatta!" className="w-28 md:w-52 h-auto drop-shadow-xl" />
                    </button>
                </div>
            )}

            {isChatOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-100 flex flex-col pt-[64px] md:pt-[96px] animate-in slide-in-from-right duration-300">
                    <div className="bg-blue-600 p-2 md:p-3 flex items-center gap-3 border-b-4 border-blue-800 shrink-0 shadow-md relative overflow-visible">
                        <button onClick={toggleChat} className="text-white p-2 hover:bg-white/20 rounded-full transition-colors relative z-30">
                            <ArrowLeft size={28} strokeWidth={3} />
                        </button>
                        <div className="w-24 h-24 md:w-40 md:h-40 shrink-0 flex items-center justify-center -mb-12 md:-mb-20 relative z-30 pointer-events-none">
                            <img src={MARAGNO_FULL_BODY} alt="Maragno" className="w-full h-full object-contain drop-shadow-lg" />
                        </div>
                        <div className="flex-1 overflow-hidden relative z-30">
                            <h3 className="text-white font-black text-lg md:text-2xl uppercase leading-none truncate">Maragno</h3>
                            <span className="text-blue-100 text-[10px] md:text-xs font-bold uppercase tracking-widest">{isThinking ? 'Tesse una risposta... 🕸️' : 'In linea 🕷️'}</span>
                        </div>
                        <div className="flex gap-2 relative z-30">
                             <button onClick={() => { const next = !audioEnabled; setAudioEnabled(next); if (!next) window.speechSynthesis.cancel(); else speakText(history[history.length - 1].text); }} className={`p-2 rounded-full ${audioEnabled ? 'bg-white/20 text-white' : 'bg-red-400 text-white'}`}>
                                {audioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                             </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 pt-10 md:pt-14 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat relative z-10 custom-scrollbar">
                        {history.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                                <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl shadow-md font-bold text-sm md:text-xl leading-relaxed relative ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-tr-none border-b-4 border-blue-700' : 'bg-white text-slate-800 rounded-tl-none border-b-4 border-slate-200'}`}>
                                    {msg.text}
                                    <div className={`absolute top-0 ${msg.role === 'user' ? '-right-2 border-l-[10px] border-l-blue-500' : '-left-2 border-r-[10px] border-r-white'} border-t-[10px] border-t-transparent`}></div>
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex justify-start animate-pulse">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-md border-b-4 border-slate-200 flex items-center gap-2">
                                    <Loader2 className="animate-spin text-blue-500" size={18} />
                                    <span className="text-slate-400 font-black text-xs uppercase">Maragno scrive...</span>
                                </div>
                            </div>
                        )}

                        {pendingNav && !isThinking && (
                            <div className="flex flex-col items-center py-10 animate-in slide-in-from-right-full duration-[1200ms] ease-out">
                                <button 
                                    onClick={handleTaxiClick}
                                    className="group transition-transform hover:scale-105 active:scale-95 outline-none"
                                >
                                    <img 
                                        src={MARLO_TAXI_IMG} 
                                        alt="Taxi di Marlo" 
                                        className="w-72 md:w-[750px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]" 
                                    />
                                </button>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="bg-white p-3 md:p-4 border-t-2 border-slate-200 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] relative z-30">
                        <div className="flex items-center gap-2 md:gap-4 max-w-5xl mx-auto">
                            <button onClick={toggleListening} className={`shrink-0 p-3 rounded-full transition-all border-2 ${isListening ? 'bg-red-500 text-white border-red-700 animate-pulse scale-110' : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-blue-500'}`} title="Parla con Maragno">
                                {isListening ? <MicOff size={28} strokeWidth={2.5} /> : <Mic size={28} strokeWidth={2.5} />}
                            </button>
                            <div className="flex-1 relative">
                                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={isListening ? "Ti ascolto..." : "Scrivi a Maragno..."} className="w-full bg-slate-100 border-2 border-slate-200 rounded-[2rem] px-5 py-3 md:py-4 font-bold text-slate-800 text-sm md:text-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                            </div>
                            <button onClick={handleSendMessage} disabled={!inputText.trim() || isThinking} className="bg-blue-600 text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-90 transition-all disabled:opacity-50 disabled:grayscale">
                                <Send size={24} className="md:w-8 md:h-8" strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWithBoo;
