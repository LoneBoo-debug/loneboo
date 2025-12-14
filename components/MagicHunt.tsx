
import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Trophy, Loader2, X, Star, Download, Gift, User, Check } from 'lucide-react';
import { checkScavengerHuntMatch } from '../services/ai';
import { CHANNEL_LOGO } from '../constants';

const HUNT_GOAL = 5; // Number of items to find to open the chest

const CHALLENGES = [
    // Colors
    { text: "Trova qualcosa di ROSSO 🔴", target: "Qualcosa di colore rosso" },
    { text: "Trova qualcosa di BLU 🔵", target: "Qualcosa di colore blu" },
    { text: "Trova qualcosa di VERDE 🟢", target: "Qualcosa di colore verde" },
    { text: "Trova qualcosa di GIALLO 🟡", target: "Qualcosa di colore giallo" },
    { text: "Trova qualcosa di ROSA 🩷", target: "Qualcosa di colore rosa" },
    { text: "Trova qualcosa di VIOLA 💜", target: "Qualcosa di colore viola" },
    { text: "Trova qualcosa di NERO ⚫", target: "Qualcosa di colore nero" },
    { text: "Trova qualcosa di BIANCO ⚪", target: "Qualcosa di colore bianco" },
    { text: "Trova qualcosa di ARANCIONE 🟠", target: "Qualcosa di colore arancione" },

    // Shapes & Textures
    { text: "Trova qualcosa di ROTONDO ⚽", target: "Un oggetto di forma rotonda" },
    { text: "Trova qualcosa di QUADRATO ⬛", target: "Un oggetto di forma quadrata" },
    { text: "Trova qualcosa di MORBIDO ☁️", target: "Qualcosa che sembra morbido o peloso" },
    { text: "Trova qualcosa di DURO 🪨", target: "Un oggetto duro o solido" },
    { text: "Trova qualcosa di LUCIDO ✨", target: "Qualcosa che riflette la luce o brilla" },
    { text: "Trova qualcosa di LEGNO 🪵", target: "Un oggetto fatto di legno" },
    
    // Objects
    { text: "Trova un GIOCATTOLO 🧸", target: "Un giocattolo" },
    { text: "Trova una SCARPA 👟", target: "Una scarpa o ciabatta" },
    { text: "Trova un LIBRO 📚", target: "Un libro o un quaderno" },
    { text: "Trova una TAZZA ☕", target: "Una tazza, un bicchiere o una tazzina" },
    { text: "Trova un CUCCHIAIO 🥄", target: "Un cucchiaio o posata" },
    { text: "Trova una SEDIA 🪑", target: "Una sedia o poltrona" },
    { text: "Trova un CUSCINO 🛌", target: "Un cuscino" },
    { text: "Trova una PIANTA o FIORE 🪴", target: "Una pianta, un fiore o una foglia" },
    { text: "Trova una CHIAVE 🔑", target: "Una chiave o un portachiavi" },
    { text: "Trova un OROLOGIO ⏰", target: "Un orologio da polso o da muro" },
    { text: "Trova una BOTTIGLIA 🍼", target: "Una bottiglia d'acqua o bibita" },
    { text: "Trova un CAPPELLO 🧢", target: "Un cappello o berretto" },
    { text: "Trova degli OCCHIALI 👓", target: "Un paio di occhiali da vista o da sole" },
    { text: "Trova una PENNA o MATITA ✏️", target: "Una penna, matita o pennarello" },
    { text: "Trova un TELECOMANDO 📱", target: "Un telecomando TV" },
    { text: "Trova uno ZAINO o BORSA 🎒", target: "Uno zaino, borsa o cartella" },

    // Fun Actions
    { text: "Trova qualcosa da MANGIARE 🍎", target: "Cibo o frutta" },
    { text: "Fai un bel SORRISO 😁", target: "Una faccia che sorride" },
    { text: "Fai una faccia BUFFA 🤪", target: "Una smorfia divertente" },
    { text: "Fai vedere la tua MANO ✋", target: "Una mano aperta" },
    { text: "Trova un DISEGNO 🎨", target: "Un disegno o un quadro" },
];

const MagicHunt: React.FC = () => {
  const [challenge, setChallenge] = useState(CHALLENGES[0]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Progression State
  const [progress, setProgress] = useState(0);
  
  // Modal States
  const [showChestModal, setShowChestModal] = useState(false); // The black overlay
  const [isNameInputStep, setIsNameInputStep] = useState(false); // Asking for name
  const [isCertificateView, setIsCertificateView] = useState(false); // Showing the actual diploma
  const [childName, setChildName] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // Store stream independently for reliable cleanup
  const isMountedRef = useRef(true);

  useEffect(() => {
      isMountedRef.current = true;
      return () => { isMountedRef.current = false; };
  }, []);

  // Load progress from local storage
  useEffect(() => {
      try {
          const savedProgress = localStorage.getItem('magicHuntProgress');
          const savedName = localStorage.getItem('magicHuntName');
          if (savedProgress) {
              setProgress(parseInt(savedProgress, 10));
          }
          if (savedName) {
              setChildName(savedName);
          }
      } catch (e) {
          // Ignore storage errors
      }
  }, []);

  // Save progress
  useEffect(() => {
      try {
          localStorage.setItem('magicHuntProgress', progress.toString());
          if (progress >= HUNT_GOAL && !showChestModal && !childName) {
               setShowChestModal(true);
          }
      } catch (e) {
          // Ignore storage errors
      }
  }, [progress, showChestModal, childName]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const nextChallenge = () => {
      let random;
      do {
          random = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
      } while (random.text === challenge.text && CHALLENGES.length > 1);
      
      setChallenge(random);
      setPhoto(null);
      setResult(null);
  };

  const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        
        // Safety check: if user navigated away while waiting for permission
        if (!isMountedRef.current) {
            stream.getTracks().forEach(t => t.stop());
            return;
        }

        streamRef.current = stream;
        setIsCameraOpen(true);
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }, 100);
    } catch (err) {
        alert("Impossibile accedere alla fotocamera. Controlla i permessi!");
        console.error(err);
    }
  };

  const stopCamera = () => {
      // Clean up stream directly from reference
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
      
      if (videoRef.current) {
          videoRef.current.srcObject = null;
      }
      setIsCameraOpen(false);
  };

  const takePhoto = async () => {
      if (!videoRef.current) return;

      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0);
          const photoUrl = canvas.toDataURL('image/jpeg', 0.8);
          stopCamera();
          setPhoto(photoUrl);
          analyzePhoto(photoUrl);
      }
  };

  const analyzePhoto = async (base64Image: string) => {
      setIsAnalyzing(true);
      try {
          const response = await checkScavengerHuntMatch(base64Image, challenge.target);
          
          if (!isMountedRef.current) return;

          const parts = response.split('|');
          let success = false;
          let message = response;

          if (parts.length > 1) {
              success = parts[0].trim().toUpperCase().includes('SÌ');
              message = parts[1].trim();
          } else {
              success = response.toLowerCase().includes('sì') || response.toLowerCase().includes('yes') || response.toLowerCase().includes('bravo');
          }

          setResult({ success, message });
          
          // Increment progress if successful
          if (success && progress < HUNT_GOAL) {
              setProgress(prev => prev + 1);
          }

      } catch (e) {
          if (isMountedRef.current) {
            setResult({ success: false, message: "Oops! Non sono riuscito a vedere bene. Riprova!" });
          }
      }
      if (isMountedRef.current) setIsAnalyzing(false);
  };

  // --- REWARD LOGIC ---

  const handleChestClick = () => {
      setShowChestModal(true);
      if (childName) {
          // If we already know the name, go straight to certificate
          setIsCertificateView(true);
          setIsNameInputStep(false);
      } else {
          // Otherwise, start from the closed chest
          setIsCertificateView(false);
          setIsNameInputStep(false);
      }
  };

  const openChestInteraction = () => {
      if (!childName) {
          // If name is missing, ask for it
          setIsNameInputStep(true);
      } else {
          // If name exists, show certificate
          setIsCertificateView(true);
      }
  };

  const confirmName = () => {
      if (childName.trim()) {
          try {
              localStorage.setItem('magicHuntName', childName);
          } catch(e) {}
          setIsNameInputStep(false);
          setIsCertificateView(true);
      }
  };

  const closeCertificate = () => {
      setShowChestModal(false);
      // We keep the state so next click re-opens it correctly
  };

  const resetProgress = () => {
      setProgress(0);
      setIsCertificateView(false);
      setIsNameInputStep(false);
      setShowChestModal(false);
      setChildName('');
      try {
          localStorage.setItem('magicHuntProgress', '0');
          localStorage.removeItem('magicHuntName'); // Forget name on reset
      } catch(e) {}
      nextChallenge();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in py-4">
        
        {/* --- PIRATE MAP PROGRESS BAR --- */}
        <div className="w-full max-w-md bg-white rounded-2xl border-4 border-amber-800 p-4 mb-8 relative shadow-lg overflow-hidden">
            {/* Map Texture Background */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] bg-amber-100"></div>
            
            <div className="flex items-center justify-between relative z-10 px-2">
                <div className="flex flex-col items-center">
                    <span className="text-2xl">🏁</span>
                </div>

                {/* Path Line */}
                <div className="flex-1 h-3 bg-amber-900/20 mx-2 rounded-full relative">
                    <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(progress / HUNT_GOAL) * 100}%` }}
                    ></div>
                    {/* Ghost Avatar Moving */}
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                        style={{ left: `${(progress / HUNT_GOAL) * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                    >
                        <img src={CHANNEL_LOGO} alt="You" className="w-8 h-8 drop-shadow-md bg-white rounded-full border-2 border-amber-800" />
                    </div>
                </div>

                {/* CHEST ICON ON MAP - CLICKABLE WHEN DONE */}
                <div 
                    className={`flex flex-col items-center transition-all duration-300 ${progress >= HUNT_GOAL ? 'cursor-pointer hover:scale-110' : ''}`} 
                    onClick={() => progress >= HUNT_GOAL && handleChestClick()}
                >
                    <span className={`text-3xl transition-transform ${progress >= HUNT_GOAL ? 'animate-bounce drop-shadow-[0_0_10px_gold]' : 'grayscale opacity-50'}`}>
                        {progress >= HUNT_GOAL ? '🎁' : '🏴‍☠️'}
                    </span>
                </div>
            </div>
            
            <p className="text-center font-bold text-amber-900 mt-2 text-sm">
                Tesori trovati: {progress} / {HUNT_GOAL}
            </p>
        </div>


        {/* CAMERA OVERLAY (POPUP STYLE) */}
        {isCameraOpen && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="relative w-full max-w-lg bg-black rounded-[30px] border-4 border-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                    <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-end">
                         <button 
                            onClick={stopCamera}
                            className="bg-black/50 text-white p-2 rounded-full border-2 border-white hover:bg-red-500 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-1 relative overflow-hidden bg-black aspect-[3/4] md:aspect-video">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 border-[3px] border-white/40 m-6 rounded-3xl pointer-events-none flex items-end justify-center pb-8">
                            <div className="bg-black/60 px-4 py-2 rounded-xl text-white font-bold text-center text-sm md:text-base backdrop-blur-md mb-12">
                                Inquadra: {challenge.target}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900 p-6 flex justify-center border-t-2 border-gray-800">
                        <button 
                            onClick={takePhoto}
                            className="w-20 h-20 bg-white rounded-full border-[6px] border-gray-300 shadow-[0_0_20px_white] active:scale-90 transition-transform flex items-center justify-center"
                        >
                            <div className="w-16 h-16 rounded-full border-2 border-black/10"></div>
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-orange-600 mb-2 drop-shadow-sm">
                Caccia Magica 🕵️‍♂️
            </h2>
            <p className="text-gray-600 font-bold text-lg">
                Trova 5 oggetti per aprire il forziere!
            </p>
        </div>

        {/* CHALLENGE CARD */}
        <div className="bg-white p-8 rounded-[40px] border-4 border-orange-500 shadow-xl w-full max-w-md text-center relative overflow-hidden">
             
             {/* Challenge Header */}
             <div className="bg-orange-100 p-4 rounded-2xl border-2 border-orange-200 mb-6 inline-block">
                 <h3 className="text-xl md:text-2xl font-black text-orange-700 leading-tight">
                     {challenge.text}
                 </h3>
             </div>

             {/* MAIN DISPLAY AREA */}
             <div className="mb-8 flex justify-center">
                 {!photo ? (
                     <div className="w-64 h-64 bg-gray-100 rounded-3xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4">
                         <Camera size={48} className="text-gray-300" />
                         <p className="text-gray-400 font-bold px-4">Premi il tasto sotto per cercare!</p>
                     </div>
                 ) : (
                     <div className="relative w-64 h-64 rounded-3xl border-4 border-black overflow-hidden shadow-lg bg-black">
                         <img src={photo} alt="Captured" className="w-full h-full object-cover opacity-80" />
                         
                         {isAnalyzing && (
                             <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                                 <Loader2 size={48} className="animate-spin mb-2 text-boo-purple" />
                                 <p className="font-bold">Lone Boo sta guardando...</p>
                             </div>
                         )}

                         {!isAnalyzing && result && (
                             <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in zoom-in">
                                 <div className="text-6xl mb-2 drop-shadow-lg">
                                     {result.success ? '🤩' : '🤔'}
                                 </div>
                                 <div className={`px-4 py-2 rounded-xl font-black text-lg border-2 mb-2 ${result.success ? 'bg-green-500 text-white border-green-300' : 'bg-red-500 text-white border-red-300'}`}>
                                     {result.success ? 'TROVATO!' : 'NON PROPRIO...'}
                                 </div>
                             </div>
                         )}
                     </div>
                 )}
             </div>

             {/* Result Message Text */}
             {!isAnalyzing && result && (
                 <div className="mb-8 animate-in slide-in-from-bottom">
                     <p className="text-lg font-bold text-gray-800 italic">
                         "{result.message}"
                     </p>
                 </div>
             )}

             {/* CONTROLS */}
             <div className="flex flex-col gap-4">
                 {!photo ? (
                    <button 
                        onClick={startCamera}
                        className="w-full bg-orange-500 text-white text-xl font-black px-6 py-4 rounded-full border-4 border-black hover:scale-105 active:shadow-none active:translate-y-1 shadow-[4px_4px_0_black] transition-all flex items-center justify-center gap-2"
                    >
                        <Camera size={24} strokeWidth={3} /> APRI FOTOCAMERA
                    </button>
                 ) : (
                     <div className="flex gap-4">
                        {!result?.success && (
                            <button 
                                onClick={startCamera}
                                className="flex-1 bg-gray-200 text-gray-800 font-black px-4 py-3 rounded-full border-4 border-black hover:bg-gray-300"
                            >
                                RIPROVA
                            </button>
                        )}
                        <button 
                            onClick={nextChallenge}
                            className="flex-1 bg-boo-purple text-white font-black px-4 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
                        >
                            {result?.success ? <Trophy size={20}/> : <RefreshCw size={20} />}
                            {result?.success ? 'CONTINUA' : 'CAMBIA'}
                        </button>
                     </div>
                 )}
                 
                 {!photo && (
                     <button 
                        onClick={nextChallenge}
                        className="text-gray-400 font-bold text-sm underline hover:text-orange-500"
                     >
                         Questa è difficile, cambiala
                     </button>
                 )}
             </div>
        </div>

        {/* --- REWARD MODAL SYSTEM --- */}
        {showChestModal && (
            <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
                
                {/* 1. CLOSED CHEST VIEW (First time or Re-opening) */}
                {!isCertificateView && !isNameInputStep && (
                    <div className="flex flex-col items-center text-center animate-in zoom-in duration-500">
                        <h2 className="text-4xl font-black text-yellow-400 mb-8 drop-shadow-lg animate-pulse">
                            {childName ? 'IL TUO PREMIO!' : 'HAI VINTO! 🎉'}
                        </h2>
                        
                        <button 
                            onClick={openChestInteraction}
                            className="group relative"
                        >
                            <div className="text-9xl drop-shadow-[0_0_50px_rgba(250,204,21,0.6)] group-hover:scale-110 transition-transform duration-300">
                                🎁
                            </div>
                            <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white text-black font-black px-6 py-2 rounded-full whitespace-nowrap shadow-xl">
                                TOCCA PER APRIRE
                            </span>
                        </button>
                        
                        <button 
                            onClick={() => setShowChestModal(false)}
                            className="mt-20 text-white/50 hover:text-white font-bold underline"
                        >
                            Chiudi
                        </button>
                    </div>
                )}

                {/* 2. ASK FOR NAME (If not set) */}
                {isNameInputStep && (
                    <div className="bg-white p-8 rounded-[40px] border-8 border-boo-purple shadow-[0_0_50px_rgba(139,92,246,0.5)] max-w-sm w-full text-center animate-in slide-in-from-bottom">
                         <img src={CHANNEL_LOGO} alt="Lone Boo" className="w-24 h-24 mx-auto mb-4" />
                         <h3 className="text-2xl font-black text-boo-purple mb-2">Ciao! Come ti chiami?</h3>
                         <p className="text-gray-600 font-bold text-sm mb-6">Voglio scrivere il tuo nome sul diploma magico!</p>
                         
                         <input 
                            type="text" 
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            placeholder="Il tuo nome..."
                            className="w-full text-center text-2xl font-black p-4 rounded-xl border-4 border-gray-200 focus:border-boo-purple outline-none mb-6 uppercase text-gray-800"
                            maxLength={15}
                         />

                         <button 
                            onClick={confirmName}
                            disabled={!childName.trim()}
                            className="w-full bg-boo-green text-white font-black text-xl py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                         >
                             <Check size={24} strokeWidth={4} /> ECCOMI!
                         </button>
                    </div>
                )}

                {/* 3. CERTIFICATE VIEW */}
                {isCertificateView && (
                    <div className="bg-white p-2 rounded-[30px] max-w-lg w-full relative animate-in zoom-in duration-500 border-8 border-yellow-400 shadow-[0_0_100px_rgba(250,204,21,0.5)]">
                        
                        {/* CARTOON CLOSE BUTTON (X) */}
                        <button 
                            onClick={closeCertificate}
                            className="absolute -top-6 -right-6 z-50 bg-red-500 text-white w-14 h-14 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-110 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center"
                        >
                            <X size={32} strokeWidth={4} />
                        </button>

                        {/* CERTIFICATE DESIGN */}
                        <div className="border-8 border-dashed border-boo-purple rounded-[20px] p-6 text-center bg-yellow-50 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-24 h-24 bg-yellow-300 rounded-br-full opacity-50"></div>
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-boo-purple rounded-tl-full opacity-20"></div>

                            <img src={CHANNEL_LOGO} alt="Logo" className="w-24 h-24 mx-auto mb-4 drop-shadow-md" />
                            
                            <h2 className="text-3xl md:text-4xl font-black text-boo-purple mb-2 font-serif uppercase tracking-widest">
                                DIPLOMA
                            </h2>
                            <p className="text-xl font-bold text-gray-500 mb-6 uppercase tracking-wide">
                                DI ESPLORATORE MAGICO
                            </p>

                            <p className="text-gray-800 font-medium italic mb-2">Questo certificato è assegnato a:</p>
                            
                            <div className="border-b-4 border-black/20 pb-2 mb-6">
                                <span className="text-3xl md:text-5xl font-black text-boo-orange font-handwriting drop-shadow-sm uppercase">
                                    {childName || 'Amico di Lone Boo'}
                                </span>
                            </div>

                            <p className="text-gray-600 font-bold text-sm mb-8 leading-relaxed">
                                Per aver completato con successo la Caccia al Tesoro Fantasma trovando tutti gli oggetti magici!
                            </p>

                            <div className="flex justify-between items-end border-t-2 border-gray-200 pt-4">
                                <div className="text-left">
                                    <p className="text-xs text-gray-400 font-bold uppercase">DATA</p>
                                    <p className="font-bold text-gray-700">{new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                     <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner border-4 border-yellow-600 rotate-12 ml-auto">
                                         <Star fill="white" className="text-white" size={32} />
                                     </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-3 px-4 pb-2">
                             <button 
                                onClick={resetProgress}
                                className="flex-1 bg-boo-purple text-white font-black py-3 rounded-xl border-b-4 border-purple-800 active:translate-y-1 active:border-b-0 text-sm md:text-base"
                             >
                                 NUOVA CACCIA
                             </button>
                             {/* Note: Real download would require html2canvas, simulating action here */}
                             <button 
                                onClick={() => alert("Fai uno screenshot per salvare il tuo diploma! 📸")}
                                className="flex-1 bg-green-500 text-white font-black py-3 rounded-xl border-b-4 border-green-700 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 text-sm md:text-base"
                             >
                                 <Download size={20} /> SALVA
                             </button>
                        </div>
                    </div>
                )}
            </div>
        )}

    </div>
  );
};

export default MagicHunt;
