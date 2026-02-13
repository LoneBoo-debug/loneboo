
import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, X, Loader2, ArrowLeft, Clock, MapPin } from 'lucide-react';
import { getTeacherResponse } from '../services/ai';
import { ChatMessage, AppView } from '../types';

const TEACHER_AVATAR = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dffdfdfdfds+(1)9870.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const PUNISHMENT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/presid7763ybd3.webp';
const BTN_MARAGNO_NAV = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/indicainfopoinrne22.webp';

const INSULT_LIMIT = 3;
const BAN_DURATION_MS = 5 * 60 * 1000;

interface TeacherChatProps {
    onClose: () => void;
    grade: number;
    setView?: (view: AppView) => void;
}

const TeacherChat: React.FC<TeacherChatProps> = ({ onClose, grade, setView }) => {
    const [history, setHistory] = useState<ChatMessage[]>([
        { role: 'model', text: `Ciao tesoro! Cosa vuoi chiedermi?` }
    ]);
    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [pendingNav, setPendingNav] = useState<AppView | null>(null);
    
    // Safety & Punishment Logic
    const [insultCount, setInsultCount] = useState(() => Number(localStorage.getItem('teacher_insults') || 0));
    const [banUntil, setBanUntil] = useState(() => Number(localStorage.getItem('teacher_ban_until') || 0));
    const [timeLeft, setTimeLeft] = useState(0);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
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

    // Timer per il castigo
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
                    localStorage.removeItem('teacher_ban_until');
                    localStorage.setItem('teacher_insults', '0');
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [banUntil]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isThinking, pendingNav]);

    const speakText = (text: string) => {
        if (!audioEnabled || !window.speechSynthesis) return;
        
        let cleanText = text
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/gu, '')
            .replace(/\[.*?\]/g, '')
            .trim();

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'it-IT';
        utterance.rate = 0.9; 
        utterance.pitch = 1.1; 
        window.speechSynthesis.speak(utterance);
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || isThinking || timeLeft > 0) return;
        
        const userMsg: ChatMessage = { role: 'user', text: inputText };
        setHistory(prev => [...prev, userMsg]);
        setInputText('');
        setIsThinking(true);
        setPendingNav(null);

        try {
            const response = await getTeacherResponse(history, userMsg.text, grade);
            const navMatch = response.match(/\[ACTION:NAV:(\w+)\]/);
            const isOffense = response.includes('[OFFENSE_DETECTED]');
            
            let cleanResponse = response
                .replace(/\[ACTION:NAV:\w+\]/g, '')
                .replace(/\[OFFENSE_DETECTED\]/g, '')
                .trim();

            if (isOffense) {
                const newCount = insultCount + 1;
                setInsultCount(newCount);
                localStorage.setItem('teacher_insults', String(newCount));

                if (newCount === 1) {
                    cleanResponse = "Tesoro, le parole hanno un peso importante e dobbiamo usarle per fare del bene, non per offendere. Cerchiamo di parlare con gentilezza, d'accordo? 🌸";
                } else if (newCount === 2) {
                    cleanResponse = "Adesso basta. Se continui con questo comportamento sarò costretta a informare il Preside. Per favore, scusati e riprendiamo la lezione con rispetto. ⚠️";
                } else if (newCount >= INSULT_LIMIT) {
                    const banTime = Date.now() + BAN_DURATION_MS;
                    setBanUntil(banTime);
                    localStorage.setItem('teacher_ban_until', String(banTime));
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
            setHistory(prev => [...prev, { role: 'model', text: "Scusami caro, non ho sentito bene. Ripeti?" }]);
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
        if (pendingNav && setView) {
            onClose(); // Chiudiamo la chat
            setView(pendingNav); // Navighiamo
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in slide-in-from-right duration-300">
            {/* MODALE CASTIGO */}
            {timeLeft > 0 && (
                <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[40px] border-8 border-red-600 p-6 w-full max-sm text-center shadow-2xl flex flex-col items-center animate-in zoom-in duration-300">
                        <div className="w-full aspect-square mb-4 overflow-hidden rounded-2xl border-4 border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center">
                            <img 
                                src={PUNISHMENT_IMG} 
                                alt="In presidenza" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-black text-red-600 mb-2 uppercase leading-none font-luckiest">IN PRESIDENZA!</h2>
                        <p className="text-gray-700 font-bold text-base mb-6 leading-snug px-2">
                            Il tuo comportamento è stato riferito al Preside. Devi riflettere sulle tue parole per 5 minuti prima di poter parlare ancora con la maestra Ornella.
                        </p>
                        
                        <div className="bg-red-50 px-6 py-3 rounded-full border-4 border-red-600 flex items-center gap-3 text-red-600 font-black text-2xl shadow-inner">
                            <Clock size={28} />
                            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                        </div>

                        <button onClick={onClose} className="mt-6 text-red-400 font-bold text-sm underline uppercase tracking-widest">Torna a sedere</button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-blue-600 p-4 flex items-center gap-3 border-b-4 border-blue-800 shrink-0 pt-20 md:pt-28">
                <button onClick={onClose} className="text-white p-2 hover:bg-white/20 rounded-full transition-colors">
                    <ArrowLeft size={28} strokeWidth={3} />
                </button>
                <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 flex items-center justify-center">
                    <img src={TEACHER_AVATAR} alt="Maestra" className="w-full h-full object-contain drop-shadow-md" />
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-black text-lg md:text-2xl uppercase leading-none">Chiedi alla Maestra</h3>
                    <span className="text-blue-100 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                        {isThinking ? 'La maestra riflette...' : `Classe ${grade}ª 👩‍🏫`}
                    </span>
                </div>
                <button 
                    onClick={() => setAudioEnabled(!audioEnabled)} 
                    className={`p-2 rounded-full transition-all ${audioEnabled ? 'bg-white/20 text-white' : 'bg-red-400 text-white'}`}
                >
                    {audioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-50/50 custom-scrollbar">
                {history.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm font-bold text-base md:text-xl leading-relaxed relative ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border-b-4 border-slate-200'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 border-b-4 border-slate-100">
                            <Loader2 className="animate-spin text-blue-500" size={18} />
                            <span className="text-slate-400 font-black text-xs uppercase">La maestra scrive...</span>
                        </div>
                    </div>
                )}

                {pendingNav && !isThinking && (
                    <div className="flex flex-col items-center py-6 animate-in zoom-in duration-500">
                        <button 
                            onClick={handleNavClick}
                            className="hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent"
                        >
                            <img 
                                src={BTN_MARAGNO_NAV} 
                                alt="Vai da Maragno" 
                                className="w-56 md:w-80 h-auto drop-shadow-2xl" 
                            />
                        </button>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t-2 border-slate-200 shrink-0 pb-8 md:pb-4">
                <div className="flex items-center gap-2 max-w-4xl mx-auto">
                    <button 
                        onClick={toggleListening} 
                        className={`shrink-0 p-3 rounded-full transition-all border-2 ${isListening ? 'bg-red-500 text-white border-red-700 animate-pulse' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                    >
                        <Mic size={24} strokeWidth={2.5} />
                    </button>
                    <input 
                        type="text" 
                        value={inputText} 
                        onChange={(e) => setInputText(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Chiedi qualcosa..." 
                        className="flex-1 bg-slate-100 border-2 border-slate-200 rounded-2xl px-5 py-3 font-bold text-slate-800 text-base focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <button 
                        onClick={handleSendMessage} 
                        disabled={!inputText.trim() || isThinking}
                        className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50"
                    >
                        <Send size={22} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherChat;
