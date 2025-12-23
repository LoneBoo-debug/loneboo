
import React, { useState, useEffect, useRef } from 'react';
import { AppView, ChatMessage } from '../types';
import { Loader2, Send, Maximize2, X, Minimize2, Lock, Hourglass, Mic, MicOff, Volume2, VolumeX, Smile, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { getLoneBooChatResponse } from '../services/ai';
import RobotHint from './RobotHint';
import { OFFICIAL_LOGO } from '../constants';

const TOTEM_BG_MOBILE = 'https://i.postimg.cc/ZqYqdfGC/totemss.jpg';
const TOTEM_BG_DESKTOP = 'https://i.postimg.cc/FsGD0MQG/info-169.jpg';
const BOO_OFFENDED_IMG = 'https://i.postimg.cc/gr9D2tqS/boohungry-(1).png';

// --- MODERATION CONSTANTS ---
const OFFENSE_LIMIT_BEFORE_ULTIMATUM = 4; // At 4 offenses, stern warning
const OFFENSE_LIMIT_BAN = 5; // At 5 offenses, BAN
const BAN_DURATION_MS = 5 * 60 * 1000; // 5 Minutes

// Enhanced regex to catch repeated characters (e.g. s+u+c+a+)
const BAD_WORDS_REGEX = /\b(s+t+u+p+i+d+[o+a+]|s+c+e+m+[o+a+]|b+r+u+t+t+[o+a+]|c+a+t+t+i+v+[o+a+]|s+c+h+i+f+[o+a+]|c+a+c+c+[o+a+]|p+u+z+z+[o+a+]|i+d+i+o+t+a+|c+r+e+t+i+n+[o+a+]|i+m+b+e+c+i+l+l+e+|f+a+n+c+u+l+o+|m+e+r+d+a+|s+t+r+o+n+z+[o+a+]|b+a+s+t+a+r+d+[o+a+]|u+c+c+i+d+|m+o+r+t+[e+o+]|a+m+m+a+d+z+|p+i+c+c+h+i+|r+u+b+o+|l+a+d+r+o+|b+u+g+i+a+r+d+[o+a+]|d+e+f+i+c+i+e+n+t+e+|r+i+n+c+o+g+l+i+o+n+i+t+[o+a+]|p+i+r+l+a+|c+a+z+z+[o+a+]|v+a+f+f+a+n+c+u+l+o+|f+o+t+t+i+t+i+|m+u+o+r+i+|s+u+c+a+)\b/i;

const FALLBACK_OFFENSE_RESPONSES = [
    "Aia! Le parole appuntite mi fanno il solletico al cuore... usiamo parole morbide? ☁️",
    "Uhm... a Città Colorata preferiamo dire 'bricconcello' invece di quella parola! 🌈",
    "Non mi piace quando il tono diventa grigio. Coloriamolo con gentilezza! ✨",
    "Se continui a usare queste parole, dovrò andare a riposare le orecchie! 🙉"
];

// --- EMOJI LIST ---
const EMOJIS = ['😀', '😂', '😍', '😎', '😜', '😡', '😱', '👻', '🎃', '❤️', '🌟', '🎉', '🍕', '🍦', '🎈', '🐶', '🐱', '🌈', '🔥', '💀', '👋', '👍', '👎', '👀'];

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

// ZONE MOBILE
const ZONES_MOBILE: ZoneConfig[] = [
  { "id": "CHAT_DISPLAY", "points": [ { "x": 15.47, "y": 20.11 }, { "x": 50.53, "y": 20.98 }, { "x": 50.53, "y": 67.61 }, { "x": 18.09, "y": 69.58 } ] },
  { "id": "BTN_MAP", "points": [ { "x": 69.36, "y": 27.47 }, { "x": 69.36, "y": 48.12 }, { "x": 90.97, "y": 49.02 }, { "x": 91.23, "y": 27.65 } ] },
  { "id": "BTN_JOKES", "points": [ { "x": 88.3, "y": 63.2 }, { "x": 86.17, "y": 66.97 }, { "x": 93.9, "y": 68.05 }, { "x": 95.77, "y": 63.56 } ] },
  { "id": "BTN_DRAWINGS", "points": [ { "x": 83.77, "y": 68.23 }, { "x": 82.7, "y": 72.71 }, { "x": 90.43, "y": 73.97 }, { "x": 91.5, "y": 68.59 } ] },
  { "id": "BTN_VIDEOS", "points": [ { "x": 93.64, "y": 70.02 }, { "x": 93.37, "y": 74.33 }, { "x": 99.5, "y": 75.41 }, { "x": 99.24, "y": 70.02 } ] },
  { "id": "BTN_MUSIC", "points": [ { "x": 78.7, "y": 75.59 }, { "x": 78.43, "y": 84.92 }, { "x": 86.43, "y": 86.36 }, { "x": 86.7, "y": 76.66 } ] },
  { "id": "BTN_TALES", "points": [ { "x": 89.1, "y": 77.56 }, { "x": 89.1, "y": 86.72 }, { "x": 97.1, "y": 88.87 }, { "x": 97.9, "y": 78.82 } ] }
];

// ZONE DESKTOP
const ZONES_DESKTOP: ZoneConfig[] = [
  { "id": "CHAT_DISPLAY", "points": [ { "x": 52.63, "y": 20.03 }, { "x": 52.63, "y": 71.33 }, { "x": 66.96, "y": 68.41 }, { "x": 66.96, "y": 20.93 } ] },
  { "id": "BTN_MAP", "points": [ { "x": 75.08, "y": 27.9 }, { "x": 75.08, "y": 47.93 }, { "x": 84, "y": 49.28 }, { "x": 84.1, "y": 28.58 } ] },
  { "id": "BTN_JOKES", "points": [ { "x": 82.6, "y": 63.23 }, { "x": 81.8, "y": 66.83 }, { "x": 85, "y": 68.41 }, { "x": 85.71, "y": 65.03 } ] },
  { "id": "BTN_DRAWINGS", "points": [ { "x": 80.99, "y": 69.31 }, { "x": 80.49, "y": 74.03 }, { "x": 83.8, "y": 75.16 }, { "x": 84.2, "y": 68.86 } ] },
  { "id": "BTN_VIDEOS", "points": [ { "x": 85, "y": 70.66 }, { "x": 84.7, "y": 75.38 }, { "x": 88.81, "y": 76.73 }, { "x": 89.01, "y": 70.88 } ] },
  { "id": "BTN_MUSIC", "points": [ { "x": 78.59, "y": 76.73 }, { "x": 78.49, "y": 85.28 }, { "x": 81.8, "y": 87.08 }, { "x": 82, "y": 77.18 } ] },
  { "id": "BTN_TALES", "points": [ { "x": 83.3, "y": 78.98 }, { "x": 83.1, "y": 87.53 }, { "x": 86.61, "y": 90.01 }, { "x": 86.71, "y": 79.21 } ] }
];

interface ChatWithBooProps {
    setView: (view: AppView) => void;
}

const ChatWithBoo: React.FC<ChatWithBooProps> = ({ setView }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Chat State
  const [history, setHistory] = useState<ChatMessage[]>([
      { role: 'model', text: 'Ciao! Sono Lone Boo, come posso aiutarti?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<AppView | null>(null);
  
  // Native Voice State
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Permission Logic
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  // Moderation
  const [offenseCount, setOffenseCount] = useState(0);
  const [banUntil, setBanUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // --- NATIVE VOICE LOGIC (TOKEN FREE) ---
  const speakNative = (text: string) => {
      if (!window.speechSynthesis || !audioEnabled) return;
      window.speechSynthesis.cancel();
      
      const cleanText = text
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/gu, '')
        .replace(/\[.*?\]/g, '') // Remove tags
        .replace(/\*/g, '')
        .replace(/[#_~`]/g, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'it-IT';
      utterance.rate = 1.1; 
      utterance.pitch = 1.2;
      
      const voices = window.speechSynthesis.getVoices();
      const italianVoice = voices.find(v => v.lang === 'it-IT' && (v.name.includes('Google') || v.name.includes('Alice'))) || voices.find(v => v.lang === 'it-IT');
      
      if (italianVoice) utterance.voice = italianVoice;
      
      window.speechSynthesis.speak(utterance);
  };

  // --- HANDLE PERMISSION GRANT ---
  const handleGrantPermission = () => {
      setShowPermissionDialog(false);
      startListening(); 
  };

  const handleDenyPermission = () => {
      setShowPermissionDialog(false);
      setHistory(prev => [...prev, { role: 'model', text: "Va bene! Possiamo scriverci! ✍️" }]);
  };

  const handleMicClick = () => {
      if (isListening) {
          stopListening();
      } else if (hasMicPermission) {
          startListening();
      } else {
          setShowPermissionDialog(true);
      }
  };

  const startListening = () => {
      setMicError(null);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
          setMicError("Browser non supportato per la voce.");
          return;
      }

      try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'it-IT';
          recognition.interimResults = true;
          recognition.continuous = false;

          recognition.onstart = () => {
              setIsListening(true);
              setMicError(null);
              setHasMicPermission(true);
          };

          recognition.onresult = (event: any) => {
              let interimTranscript = '';
              let finalTranscript = '';

              for (let i = event.resultIndex; i < event.results.length; ++i) {
                  if (event.results[i].isFinal) {
                      finalTranscript += event.results[i][0].transcript;
                  } else {
                      interimTranscript += event.results[i][0].transcript;
                  }
              }

              const textToShow = finalTranscript || interimTranscript;
              if (textToShow) {
                  setInputText(textToShow);
              }
              
              if (finalTranscript) {
                  recognition.stop();
                  handleSendMessage(finalTranscript);
              }
          };

          recognition.onerror = (event: any) => {
              console.error("Speech error", event.error);
              setIsListening(false);
              
              if (event.error === 'not-allowed') {
                  setHasMicPermission(false); 
                  setMicError("Permesso negato.");
              } else if (event.error === 'no-speech-detected') {
                  // Ignore silence
              } else {
                  setMicError("Errore vocale. Riprova.");
              }
          };

          recognition.onend = () => {
              setIsListening(false);
          };

          recognitionRef.current = recognition;
          recognition.start();
      } catch (e) {
          console.error("Mic Start Error:", e);
          setMicError("Impossibile avviare.");
          setIsListening(false);
      }
  };

  const stopListening = () => {
      if (recognitionRef.current) {
          recognitionRef.current.stop();
      }
      setIsListening(false);
  };

  // Preload Voices
  useEffect(() => {
      if (window.speechSynthesis) {
          window.speechSynthesis.getVoices(); 
      }
  }, []);

  // Image Preload
  useEffect(() => {
      const imgMobile = new Image();
      imgMobile.src = TOTEM_BG_MOBILE;
      const imgDesktop = new Image();
      imgDesktop.src = TOTEM_BG_DESKTOP;
      const imgBan = new Image();
      imgBan.src = BOO_OFFENDED_IMG;

      let loadedCount = 0;
      const checkLoad = () => {
          loadedCount++;
          if (loadedCount >= 1) setIsLoaded(true);
      };

      imgMobile.onload = checkLoad;
      imgDesktop.onload = checkLoad;
      imgBan.onload = checkLoad;

      setTimeout(() => setIsLoaded(true), 1500);

      const timer = setTimeout(() => {
          setShowHint(true);
      }, 5000);

      return () => clearTimeout(timer);
  }, []);

  // Ban Logic
  useEffect(() => {
      const savedBan = localStorage.getItem('chat_ban_until');
      if (savedBan) {
          const until = parseInt(savedBan);
          if (until > Date.now()) {
              setBanUntil(until);
          } else {
              localStorage.removeItem('chat_ban_until');
          }
      }

      const interval = setInterval(() => {
          if (banUntil) {
              const remaining = Math.ceil((banUntil - Date.now()) / 1000);
              if (remaining <= 0) {
                  setBanUntil(null);
                  setOffenseCount(0);
                  localStorage.removeItem('chat_ban_until');
                  setHistory(prev => [...prev, { role: 'model', text: "Sono tornato! Spero che ora possiamo essere amici gentili. 😊" }]);
              } else {
                  setTimeLeft(remaining);
              }
          }
      }, 1000);

      return () => clearInterval(interval);
  }, [banUntil]);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isThinking, isFullScreen, pendingNavigation]);

  const handleInteraction = () => {
      if (showHint) setShowHint(false);
  };

  const handleOffense = (aiMessage?: string) => {
      const newCount = offenseCount + 1;
      setOffenseCount(newCount);

      let reply = "";
      
      if (newCount >= OFFENSE_LIMIT_BAN) {
          reply = "Mi dispiace, ma non posso più giocare con te se usi queste parole. Vado a fare un giro, ci rivediamo tra 5 minuti quando sarai più gentile. 👋";
          const banTime = Date.now() + BAN_DURATION_MS;
          setBanUntil(banTime);
          localStorage.setItem('chat_ban_until', banTime.toString());
      } else if (newCount >= OFFENSE_LIMIT_BEFORE_ULTIMATUM) {
          reply = "Ascolta, questo linguaggio non mi piace proprio. Te lo dico per l'ultima volta: se scrivi ancora una cosa del genere, me ne vado a fare altro! 🛑";
      } else {
          if (aiMessage && aiMessage.length > 5) {
              reply = aiMessage;
          } else {
              reply = FALLBACK_OFFENSE_RESPONSES[Math.floor(Math.random() * FALLBACK_OFFENSE_RESPONSES.length)];
          }
      }
      setHistory(prev => [...prev, { role: 'model', text: reply }]);
      speakNative(reply);
  };

  const handleSendMessage = async (text?: string) => {
      const messageToSend = text || inputText;
      
      handleInteraction();
      if (!messageToSend.trim() || banUntil) return; 

      const userMsg: ChatMessage = { role: 'user', text: messageToSend };
      setHistory(prev => [...prev, userMsg]);
      setInputText('');
      setPendingNavigation(null);

      if (BAD_WORDS_REGEX.test(messageToSend)) {
          setTimeout(() => handleOffense(), 500); 
          return;
      }

      setIsThinking(true);

      const responseText = await getLoneBooChatResponse(history, messageToSend);
      
      if (responseText.includes('[OFFENSE_DETECTED]')) {
          setIsThinking(false);
          const cleanReason = responseText.replace('[OFFENSE_DETECTED]', '').trim();
          handleOffense(cleanReason); 
          return;
      }
      
      let cleanText = responseText;
      const actionMatch = responseText.match(/\[ACTION:NAV:(\w+)\]/);
      
      if (actionMatch) {
          const actionView = actionMatch[1] as AppView;
          cleanText = responseText.replace(/\[ACTION:NAV:\w+\]/g, '').trim();
          cleanText += " Se vuoi ti accompagno?";
          if (Object.values(AppView).includes(actionView)) {
              setPendingNavigation(actionView);
          }
      }

      const modelMsg: ChatMessage = { role: 'model', text: cleanText };
      setHistory(prev => [...prev, modelMsg]);
      setIsThinking(false);
      
      speakNative(cleanText);
  };

  const confirmNavigation = () => {
      if (pendingNavigation) {
          setView(pendingNavigation);
          setPendingNavigation(null);
      }
  };

  const handlePresetClick = (type: string) => {
      handleInteraction();
      if (banUntil) return;
      let prompt = "";
      switch (type) {
          case 'BTN_JOKES': prompt = "Raccontami una barzelletta divertente!"; break;
          case 'BTN_DRAWINGS': prompt = "Voglio vedere dei disegni!"; break;
          case 'BTN_VIDEOS': prompt = "Fammi vedere dei video!"; break;
          case 'BTN_MUSIC': prompt = "Voglio ascoltare musica!"; break;
          case 'BTN_TALES': prompt = "Raccontami una fiaba!"; break;
      }
      if (prompt) handleSendMessage(prompt); 
  };

  const renderChatInterface = (fullScreenMode: boolean = false) => (
      <div className={`
          w-full h-full flex flex-col 
          ${fullScreenMode ? 'bg-white/95 p-4 rounded-3xl shadow-2xl border-4 border-cyan-500' : 'bg-white/90 backdrop-blur-sm p-1.5 rounded-lg border border-black/10'}
          overflow-hidden relative
      `}>
          <style>{`
            .scrollbar-thin-orange::-webkit-scrollbar { width: 4px; }
            .scrollbar-thin-orange::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); }
            .scrollbar-thin-orange::-webkit-scrollbar-thumb { background-color: #F97316; border-radius: 4px; }
          `}</style>

          {showPermissionDialog && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                  <div className="bg-white rounded-[30px] border-4 border-black p-6 w-full max-w-sm text-center shadow-2xl relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500 text-white p-4 rounded-full border-4 border-black">
                          <Mic size={32} />
                      </div>
                      
                      <h3 className="text-xl font-black text-blue-600 mt-6 mb-2 uppercase">Attivare il microfono?</h3>
                      <p className="text-gray-600 font-bold mb-6 text-sm">
                          Per parlare con me, devi dirmi di SÌ quando il telefono te lo chiede!
                      </p>

                      <div className="flex gap-3">
                          <button 
                              onClick={handleDenyPermission}
                              className="flex-1 bg-red-100 text-red-600 font-black py-3 rounded-xl border-2 border-red-200 hover:bg-red-200 flex items-center justify-center gap-2"
                          >
                              <ThumbsDown size={18} /> NO
                          </button>
                          <button 
                              onClick={handleGrantPermission}
                              className="flex-1 bg-green-500 text-white font-black py-3 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg"
                          >
                              <ThumbsUp size={18} /> SÌ, ATTIVA!
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {micError && (
              <div className="absolute top-2 left-2 right-2 z-40 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded shadow-lg flex justify-between items-start animate-in slide-in-from-top-2">
                  <div className="flex gap-2 items-center text-xs font-bold">
                      <AlertTriangle size={16} className="shrink-0" />
                      <span>{micError}</span>
                  </div>
                  <button onClick={() => setMicError(null)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
              </div>
          )}

          {banUntil && (
              <div className="absolute inset-0 z-50 bg-gray-100/95 flex flex-col items-center justify-center text-center p-4">
                  <button onClick={() => { if (isFullScreen) setIsFullScreen(false); else setView(AppView.HOME); }} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-transform active:scale-95 z-50">
                      <X size={24} strokeWidth={3} />
                  </button>
                  <div className="bg-white p-6 rounded-3xl border-4 border-gray-300 shadow-xl max-w-sm flex flex-col items-center">
                      <img src={BOO_OFFENDED_IMG} alt="Boo offeso" className="w-32 h-32 object-contain mb-6 drop-shadow-md" />
                      <h3 className="text-xl font-black text-gray-700 mb-2">Sono offeso!</h3>
                      <p className="text-sm font-bold text-gray-500 mb-6">Non mi piacciono le parole brutte. Torno tra poco.</p>
                      <div className="bg-red-100 text-red-600 px-6 py-3 rounded-full font-mono font-black text-2xl border-2 border-red-200 flex items-center justify-center gap-2">
                          <Hourglass size={24} />
                          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                      </div>
                  </div>
              </div>
          )}

          {fullScreenMode && (
              <div className="flex justify-between items-center mb-4 border-b-2 border-gray-100 pb-2 pr-12">
                  <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xl animate-bounce">👻</div>
                      <span className="font-black text-2xl text-cyan-600">Info Point</span>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => setAudioEnabled(!audioEnabled)} className={`p-2 rounded-full border-2 ${audioEnabled ? 'bg-green-100 text-green-600 border-green-300' : 'bg-gray-100 text-gray-400 border-gray-300'}`}>
                          {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                      </button>
                      <button onClick={() => setIsFullScreen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors flex items-center gap-1 font-bold">
                          <Minimize2 size={20} /> <span className="text-xs hidden md:inline">RIDUCI</span>
                      </button>
                  </div>
              </div>
          )}

          <div className={`flex-1 overflow-y-auto pr-1 space-y-2 mt-6 ${fullScreenMode ? 'p-2 custom-scrollbar mt-0' : 'scrollbar-thin-orange'}`}>
              {history.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                          p-2 rounded-xl font-bold shadow-sm leading-tight relative
                          ${fullScreenMode ? 'text-base md:text-lg max-w-[85%]' : 'max-w-[95%] text-[10px] md:text-xs'}
                          ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white text-gray-800 border-2 border-gray-200 rounded-tl-none'}
                      `}>
                          {msg.text}
                      </div>
                  </div>
              ))}
              {isThinking && (
                  <div className="flex justify-start">
                      <div className={`bg-white border-2 border-gray-200 p-2 rounded-xl rounded-tl-none shadow-sm flex items-center gap-1 ${fullScreenMode ? 'text-sm' : 'text-[9px]'}`}>
                          <Loader2 size={fullScreenMode ? 16 : 10} className="animate-spin text-gray-400" />
                          <span className="text-gray-400 font-bold">Scrivendo...</span>
                      </div>
                  </div>
              )}
              {!isThinking && pendingNavigation && (
                  <div className="flex justify-start w-full animate-in slide-in-from-bottom fade-in duration-300">
                      <div className="bg-yellow-100 border-2 border-yellow-400 p-1.5 rounded-xl rounded-tl-none shadow-md w-full max-w-[95%]">
                          <div className="flex gap-1 justify-between items-center">
                              <button onClick={confirmNavigation} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black py-1 px-2 rounded-lg text-[10px] md:text-xs flex items-center justify-center transition-transform active:scale-95 shadow-sm">ANDIAMO</button>
                              <button onClick={() => setPendingNavigation(null)} className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg transition-transform active:scale-95 shadow-sm"><X size={14} strokeWidth={3} /></button>
                          </div>
                      </div>
                  </div>
              )}
              <div ref={chatEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className={`w-full flex gap-1 shrink-0 items-center ${fullScreenMode ? 'mt-4 h-14 gap-2' : 'mt-1 h-10'}`}>
              
              <button 
                  onClick={handleMicClick}
                  disabled={isThinking || !!banUntil}
                  className={`
                      aspect-square rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm
                      ${isListening 
                          ? 'bg-red-500 border-red-700 text-white animate-pulse shadow-[0_0_10px_red]' 
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-blue-500'}
                      ${micError ? 'border-red-500 text-red-500 animate-shake' : ''}
                      ${fullScreenMode ? 'w-14' : 'w-9'}
                  `}
                  title={micError || (isListening ? "Ferma ascolto" : "Parla")}
              >
                  {isListening ? <MicOff size={fullScreenMode ? 24 : 16} /> : <Mic size={fullScreenMode ? 24 : 16} />}
              </button>

              <input 
                  type="text" 
                  value={inputText}
                  disabled={!!banUntil || isListening}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                  placeholder={banUntil ? "Chat bloccata..." : (isListening ? "Ti ascolto..." : "Scrivi...")}
                  className={`flex-1 min-0 rounded-full border-2 border-black bg-white px-3 font-bold outline-none focus:border-blue-500 text-black disabled:bg-gray-100 disabled:text-gray-400 ${fullScreenMode ? 'text-lg h-full' : 'text-[10px] h-8'}`}
              />
              
              {fullScreenMode && (
                  <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                      <Smile size={28} />
                  </button>
              )}

              <button 
                  onClick={() => handleSendMessage(inputText)}
                  disabled={!inputText.trim() || isThinking || !!banUntil}
                  className={`bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center aspect-square transition-transform active:scale-95 shadow-md ${fullScreenMode ? 'w-14' : 'w-9'}`}
              >
                  {banUntil ? <Lock size={fullScreenMode ? 24 : 14}/> : <Send size={fullScreenMode ? 24 : 14} />}
              </button>
          </div>

          {fullScreenMode && showEmojiPicker && (
              <div className="grid grid-cols-8 gap-1 p-2 bg-gray-100 rounded-lg mt-2 border border-gray-200">
                  {EMOJIS.map(e => (
                      <button key={e} onClick={() => { setInputText(p => p + e); }} className="hover:bg-white rounded p-1 text-xl">{e}</button>
                  ))}
              </div>
          )}

          {!fullScreenMode && (
              <button onClick={(e) => { e.stopPropagation(); setIsFullScreen(true); }} className="mt-1 w-full bg-cyan-600/90 hover:bg-cyan-500 text-white text-[9px] font-black uppercase py-1 rounded flex items-center justify-center gap-1 transition-colors" title="Schermo Intero">
                  <Maximize2 size={10} /> INGRANDISCI
              </button>
          )}
      </div>
  );

  const getBoundingBox = (points: {x: number, y: number}[]) => {
      if (!points || points.length < 2) return { top: '0%', left: '0%', width: '0%', height: '0%' };
      const xs = points.map(p => p.x);
      const ys = points.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      return { left: `${minX}%`, top: `${minY}%`, width: `${maxX - minX}%`, height: `${maxY - minY}%` };
  };

  const getClipPath = (points: {x: number, y: number}[]) => {
      if (!points || points.length < 3) return 'none';
      const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
      return `polygon(${poly})`;
  };

  const renderZones = (isDesktop: boolean) => {
      const activeZones = isDesktop ? ZONES_DESKTOP : ZONES_MOBILE;
      return activeZones.map((zone) => {
          if (zone.id === 'CHAT_DISPLAY') {
              const style = getBoundingBox(zone.points);
              return (
                  <div key={zone.id} className="absolute z-10" style={{ ...style, perspective: '800px' }}>
                      <div className="w-full h-full" style={{ transform: 'rotateX(0deg) rotateY(-5deg)', transformStyle: 'preserve-3d' }}>
                          {renderChatInterface(false)}
                      </div>
                  </div>
              );
          }
          return (
              <div
                  key={zone.id}
                  className="absolute cursor-pointer"
                  style={{ clipPath: getClipPath(zone.points), top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'auto' }}
                  onClick={() => { if (zone.id === 'BTN_MAP') setView(AppView.CITY_MAP); else handlePresetClick(zone.id); }}
              ></div>
          );
      });
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-gradient-to-b from-[#b388f4] to-white overflow-hidden flex flex-col" onClick={handleInteraction}>
      
      {!isLoaded && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cyan-900/90 backdrop-blur-md">
                <img 
                    src={OFFICIAL_LOGO} 
                    alt="Caricamento..." 
                    className="w-32 h-32 object-contain animate-spin-horizontal mb-4" 
                />
                <span className="text-white font-bold text-lg tracking-widest animate-pulse">
                    STO CARICANDO...
                </span>
          </div>
      )}

      {isFullScreen && (
          <div className="fixed inset-0 z-[100] flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start p-4 md:p-8 pt-20 md:pt-24 animate-in fade-in duration-300">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setIsFullScreen(false)}></div>
              <div className="relative w-full md:w-[40%] h-[80vh] md:h-full z-10 shadow-2xl animate-in slide-in-from-left duration-300">
                  {renderChatInterface(true)}
              </div>
          </div>
      )}

      <RobotHint show={showHint && isLoaded} message="Tocca il microfono e parla con Boo!" />

      <div ref={containerRef} className="relative flex-1 w-full h-full overflow-hidden select-none">
          <div className="block md:hidden w-full h-full relative">
              <img src={TOTEM_BG_MOBILE} alt="Totem Mobile" className={`w-full h-full object-fill object-center transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} draggable={false} />
              {renderZones(false)}
          </div>
          <div className="hidden md:block w-full h-full relative overflow-hidden">
               <img src={TOTEM_BG_DESKTOP} alt="Totem Desktop" className={`absolute inset-0 w-full h-full object-fill object-center transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} draggable={false} />
              {renderZones(true)}
          </div>
      </div>
    </div>
  );
};

export default ChatWithBoo;
