
import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Trophy, Loader2, X, Star, Download, Gift, User, Check } from 'lucide-react';
import { checkScavengerHuntMatch } from '../services/ai';
import { CHANNEL_LOGO, OFFICIAL_LOGO } from '../constants';

const TITLE_IMG = 'https://i.postimg.cc/G2jmLsc6/cacciamagica-(1)-(1).png';
const BOO_DIPLO_IMG = 'https://i.postimg.cc/cLdsKxJp/boodiplo-(1).png';
const DIPLOMA_ART_IMG = 'https://i.postimg.cc/GhCRNLvL/foto-diploma-ricerca-(1).png';
const DIPLOMA_SYMBOL = 'https://i.postimg.cc/zX4RgRhJ/lofofodp-(1).png';
const DIPLOMA_STAMP = 'https://i.postimg.cc/B6hrvF6X/timbgrro-(1).png';
const BTN_OPEN_CAMERA_IMG = 'https://i.postimg.cc/tRsR832Z/aperifot-(1).png';

// Nuovi asset per i pulsanti di azione
const BTN_RETRY_IMG = 'https://i.postimg.cc/nLcbtxKg/riprovea-(1)-(1).png';
const BTN_CHANGE_IMG = 'https://i.postimg.cc/y8jtj54C/cambuss-(1).png';
const BTN_CONTINUE_IMG = 'https://i.postimg.cc/tJGBptQz/cdjssjs-(1)-(1).png';

const BAR_START_IMG = 'https://i.postimg.cc/263jkrwQ/ico32-(3).png';
const BAR_PLAYER_IMG = 'https://i.postimg.cc/G2Z4641W/ico32-(1).png';
const BAR_END_IMG = 'https://i.postimg.cc/4xJYCCrY/ico32-(2).png';

const HUNT_GOAL = 5; 

interface MagicHuntProps {
    onClose?: () => void;
}

const MagicHunt: React.FC<MagicHuntProps> = ({ onClose }) => {
  const [challenge, setChallenge] = useState(CHALLENGES[0]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const [showChestModal, setShowChestModal] = useState(false); 
  const [isNameInputStep, setIsNameInputStep] = useState(false); 
  const [isCertificateView, setIsCertificateView] = useState(false); 
  const [childName, setChildName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
      isMountedRef.current = true;
      try {
          const savedProgress = localStorage.getItem('magicHuntProgress');
          const savedName = localStorage.getItem('magicHuntName');
          if (savedProgress) setProgress(parseInt(savedProgress, 10));
          if (savedName) setChildName(savedName);
      } catch (e) {}
      return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
      try {
          const savedProgressNum = parseInt(localStorage.getItem('magicHuntProgress') || '0', 10);
          if (savedProgressNum !== progress) {
            localStorage.setItem('magicHuntProgress', progress.toString());
          }
          if (progress >= HUNT_GOAL && !showChestModal && !childName) {
               setShowChestModal(true);
          }
      } catch (e) {}
  }, [progress, showChestModal, childName]);

  const confirmName = () => {
      if (childName.trim()) {
          try {
              localStorage.setItem('magicHuntName', childName.trim());
          } catch (e) {}
          setIsNameInputStep(false);
          setIsCertificateView(true);
      }
  };

  const stopCamera = () => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsCameraOpen(false);
  };

  const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (!isMountedRef.current) {
            stream.getTracks().forEach(t => t.stop());
            return;
        }
        streamRef.current = stream;
        setIsCameraOpen(true);
        setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch (err) {
        alert("Impossibile accedere alla fotocamera. Controlla i permessi!");
    }
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
          if (success && progress < HUNT_GOAL) setProgress(prev => prev + 1);
      } catch (e) {
          if (isMountedRef.current) setResult({ success: false, message: "Oops! Non sono riuscito a vedere bene. Riprova!" });
      }
      if (isMountedRef.current) setIsAnalyzing(false);
  };

  const nextChallenge = () => {
      let random;
      do { random = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]; } while (random.text === challenge.text && CHALLENGES.length > 1);
      setChallenge(random);
      setPhoto(null);
      setResult(null);
  };

  const handleExitGame = () => {
      setProgress(0);
      localStorage.setItem('magicHuntProgress', '0');
      localStorage.removeItem('magicHuntName');
      if (onClose) onClose();
  };

  const handleSaveDiploma = async () => {
      setIsSaving(true);
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Sfondo Pergamena
      ctx.fillStyle = '#fdf6e3';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Effetto invecchiato (bordi scuri)
      const gradient = ctx.createRadialGradient(600, 800, 200, 600, 800, 900);
      gradient.addColorStop(0, 'rgba(253, 246, 227, 0)');
      gradient.addColorStop(1, 'rgba(215, 195, 145, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bordo Pergamena
      ctx.strokeStyle = '#8b5e34';
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
      ctx.strokeStyle = '#a67c52';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      const loadImage = (src: string) => new Promise<HTMLImageElement>((res) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = src;
          img.onload = () => res(img);
          img.onerror = () => res(new Image());
      });

      const symbolImg = await loadImage(DIPLOMA_SYMBOL);
      const mainArtImg = await loadImage(DIPLOMA_ART_IMG);
      const stampImg = await loadImage(DIPLOMA_STAMP);

      // Immagine in alto rimpicciolita e corretta (no stretch)
      const maxArtW = 500;
      const artRatio = mainArtImg.height / mainArtImg.width;
      const artW = maxArtW;
      const artH = maxArtW * (artRatio || 0.6); // Fallback se ratio non disponibile
      ctx.drawImage(mainArtImg, (canvas.width - artW)/2, 140, artW, artH);
      
      // Simbolo centrale
      const symSize = 220;
      ctx.drawImage(symbolImg, canvas.width/2 - symSize/2, 580, symSize, symSize);

      // Titoli
      ctx.fillStyle = '#5d4037';
      ctx.textAlign = 'center';
      ctx.font = 'bold 90px serif';
      ctx.fillText('DIPLOMA', canvas.width/2, 920);
      
      ctx.font = 'bold 45px serif';
      ctx.fillText('DI ESPLORATORE MAGICO', canvas.width/2, 990);

      ctx.fillStyle = '#3e2723';
      ctx.font = 'italic 38px serif';
      ctx.fillText('Questo certificato è assegnato a:', canvas.width/2, 1120);

      // Nome (in arancione bruciato/scuro)
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 100px serif';
      ctx.fillText(childName.toUpperCase(), canvas.width/2, 1250);

      ctx.fillStyle = '#5d4037';
      ctx.font = '32px serif';
      ctx.fillText("Per aver completato con successo la Caccia al Tesoro Fantasma", canvas.width/2, 1340);
      ctx.fillText("trovando tutti gli oggetti magici!", canvas.width/2, 1390);

      // Data
      const dateStr = new Date().toLocaleDateString();
      ctx.fillStyle = '#8d6e63';
      ctx.font = 'bold 30px serif';
      ctx.textAlign = 'left';
      ctx.fillText(`DATA: ${dateStr}`, 120, 1500);

      // Timbro Inclinato in basso a destra
      ctx.save();
      const stampX = 950;
      const stampY = 1450;
      const stampS = 200;
      ctx.translate(stampX, stampY);
      ctx.rotate(15 * Math.PI / 180);
      ctx.drawImage(stampImg, -stampS/2, -stampS/2, stampS, stampS);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `diploma-loneboo-${childName}.jpg`, { type: 'image/jpeg' });

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
              await navigator.share({ files: [file], title: 'Il mio Diploma Lone Boo', text: 'Guarda cosa ho vinto!' });
          } catch (e) {
              const link = document.createElement('a');
              link.href = dataUrl;
              link.download = `diploma-loneboo-${childName}.jpg`;
              link.click();
          }
      } else {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `diploma-loneboo-${childName}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
      setIsSaving(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in py-4">
        
        {/* HEADER TITOLO E ISTRUZIONE */}
        <div className="text-center mb-6 flex flex-col items-center">
            <img src={TITLE_IMG} alt="Caccia Magica" className="w-72 md:w-[420px] h-auto mb-4 drop-shadow-md" />
            <p 
                className="text-yellow-400 font-black text-xl md:text-2xl uppercase tracking-wider drop-shadow-md" 
                style={{ 
                    textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' 
                }}
            >
                Trova 5 oggetti per aprire il forziere!
            </p>
        </div>

        {/* PROGRESS BAR - RESSA TRASLUCIDA */}
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl border-4 border-amber-800 p-4 mb-8 relative shadow-lg overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] bg-amber-100"></div>
            <div className="flex items-center justify-between relative z-10 px-2">
                <div className="flex flex-col items-center">
                    <img src={BAR_START_IMG} alt="Inizio" className="w-10 h-10 object-contain" />
                </div>
                <div className="flex-1 h-3 bg-amber-900/20 mx-2 rounded-full relative">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${(progress / HUNT_GOAL) * 100}%` }}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000" style={{ left: `${(progress / HUNT_GOAL) * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}>
                        <img src={BAR_PLAYER_IMG} alt="Giocatore" className="w-14 h-14 drop-shadow-md object-contain" />
                    </div>
                </div>
                <div className={`flex flex-col items-center transition-all duration-300 ${progress >= HUNT_GOAL ? 'cursor-pointer hover:scale-110' : ''}`} onClick={() => progress >= HUNT_GOAL && setShowChestModal(true)}>
                    <img 
                        src={BAR_END_IMG} 
                        alt="Traguardo" 
                        className={`w-14 h-14 object-contain transition-transform ${progress >= HUNT_GOAL ? 'animate-bounce drop-shadow-[0_0_10px_gold]' : 'grayscale opacity-50'}`} 
                    />
                </div>
            </div>
            <p className="text-center font-bold text-amber-900 mt-2 text-sm">Tesori trovati: {progress} / {HUNT_GOAL}</p>
        </div>

        {/* CAMERA OVERLAY */}
        {isCameraOpen && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="relative w-full max-w-lg bg-black rounded-[30px] border-4 border-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-end">
                         <button onClick={stopCamera} className="bg-black/50 text-white p-2 rounded-full border-2 border-white hover:bg-red-500"><X size={24} /></button>
                    </div>
                    <div className="flex-1 relative overflow-hidden bg-black aspect-[3/4] md:aspect-video">
                        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 border-[3px] border-white/40 m-6 rounded-3xl pointer-events-none flex items-end justify-center pb-8">
                            <div className="bg-black/60 px-4 py-2 rounded-xl text-white font-bold text-center text-sm backdrop-blur-md mb-12">Inquadra: {challenge.target}</div>
                        </div>
                    </div>
                    <div className="bg-gray-900 p-6 flex justify-center border-t-2 border-gray-800">
                        <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full border-[6px] border-gray-300 shadow-[0_0_20px_white] active:scale-90 flex items-center justify-center"><div className="w-16 h-16 rounded-full border-2 border-black/10"></div></button>
                    </div>
                </div>
            </div>
        )}

        {/* CHALLENGE CARD - RESA TRASLUCIDA */}
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-[40px] border-4 border-orange-500 shadow-xl w-full max-w-md text-center relative overflow-hidden">
             <div className="bg-orange-100/50 p-4 rounded-2xl border-2 border-orange-200 mb-6 inline-block">
                 <h3 className="text-xl md:text-2xl font-black text-orange-700 leading-tight">{challenge.text}</h3>
             </div>
             <div className="mb-8 flex justify-center">
                 {!photo ? (
                     <div className="w-64 h-64 bg-gray-100/40 rounded-3xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4">
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
                                 <div className="text-6xl mb-2">{result.success ? '🤩' : '🤔'}</div>
                                 <div className={`px-4 py-2 rounded-xl font-black text-lg border-2 mb-2 ${result.success ? 'bg-green-500 text-white border-green-300' : 'bg-red-500 text-white border-red-300'}`}>{result.success ? 'TROVATO!' : 'NON PROPRIO...'}</div>
                             </div>
                         )}
                     </div>
                 )}
             </div>
             {!isAnalyzing && result && <div className="mb-8 animate-in slide-in-from-bottom"><p className="text-lg font-bold text-gray-800 italic">"{result.message}"</p></div>}
             <div className="flex flex-col gap-4">
                 {!photo ? (
                    <button 
                        onClick={startCamera} 
                        className="w-full hover:scale-105 active:scale-95 transition-transform outline-none"
                    >
                        <img 
                            src={BTN_OPEN_CAMERA_IMG} 
                            alt="Apri Fotocamera" 
                            className="w-[70%] h-auto mx-auto drop-shadow-lg" 
                        />
                    </button>
                 ) : (
                     <div className="flex gap-2 justify-center items-center w-full">
                        {result?.success ? (
                            <button 
                                onClick={nextChallenge} 
                                className="w-[70%] hover:scale-105 active:scale-95 transition-transform outline-none"
                            >
                                <img src={BTN_CONTINUE_IMG} alt="Continua" className="w-full h-auto drop-shadow-md" />
                            </button>
                        ) : (
                            <div className="flex gap-2 w-full">
                                <button 
                                    onClick={startCamera} 
                                    className="flex-1 hover:scale-105 active:scale-95 transition-transform outline-none"
                                >
                                    <img src={BTN_RETRY_IMG} alt="Riprova" className="w-full h-auto drop-shadow-md" />
                                </button>
                                <button 
                                    onClick={nextChallenge} 
                                    className="flex-1 hover:scale-105 active:scale-95 transition-transform outline-none"
                                >
                                    <img src={BTN_CHANGE_IMG} alt="Cambia" className="w-full h-auto drop-shadow-md" />
                                </button>
                            </div>
                        )}
                     </div>
                 )}
                 {!photo && <button onClick={nextChallenge} className="text-gray-400 font-bold text-sm underline hover:text-orange-500">Questa è difficile, cambiala</button>}
             </div>
        </div>

        {/* REWARD MODAL SYSTEM */}
        {showChestModal && (
            <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
                {!isCertificateView && !isNameInputStep && (
                    <div className="flex flex-col items-center text-center animate-in zoom-in duration-500">
                        <h2 className="text-4xl font-black text-yellow-400 mb-8 drop-shadow-lg animate-pulse">{childName ? 'IL TUO PREMIO!' : 'HAI VINTO! 🎉'}</h2>
                        <button onClick={() => childName ? setIsCertificateView(true) : setIsNameInputStep(true)} className="group relative">
                            <div className="text-9xl drop-shadow-[0_0_50px_rgba(250,204,21,0.6)] group-hover:scale-110 transition-transform duration-300">🎁</div>
                            <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white text-black font-black px-6 py-2 rounded-full whitespace-nowrap shadow-xl">TOCCA PER APRIRE</span>
                        </button>
                        <button onClick={() => setShowChestModal(false)} className="mt-20 text-white/50 hover:text-white font-bold underline">Chiudi</button>
                    </div>
                )}

                {isNameInputStep && (
                    <div className="bg-white p-8 rounded-[40px] border-8 border-boo-purple shadow-[0_0_50px_rgba(139,92,246,0.5)] max-w-sm w-full text-center animate-in slide-in-from-bottom">
                         <img src={BOO_DIPLO_IMG} alt="Lone Boo" className="w-32 h-32 mx-auto mb-4 object-contain" />
                         <h3 className="text-2xl font-black text-boo-purple mb-2">Ciao! Come ti chiami?</h3>
                         <p className="text-gray-600 font-bold text-sm mb-6">Voglio scrivere il tuo nome sul diploma magico!</p>
                         <input type="text" value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Il tuo nome..." className="w-full text-center text-2xl font-black p-4 rounded-xl border-4 border-gray-200 focus:border-boo-purple outline-none mb-6 uppercase bg-white text-black" maxLength={12} />
                         <button onClick={confirmName} disabled={!childName.trim()} className="w-full bg-boo-green text-white font-black text-xl py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:shadow-none disabled:opacity-50 flex items-center justify-center gap-2"><Check size={24} strokeWidth={4} /> ECCOMI!</button>
                    </div>
                )}

                {isCertificateView && (
                    <div className="bg-white p-2 rounded-[30px] max-w-lg w-full relative animate-in zoom-in duration-500 border-8 border-yellow-400 shadow-[0_0_100px_rgba(250,204,21,0.5)] h-[550px] md:h-[600px] flex flex-col overflow-hidden">
                        
                        <button onClick={handleExitGame} className="absolute top-4 right-4 z-50 bg-red-500 text-white w-10 h-10 rounded-full border-4 border-black shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
                            <X size={20} strokeWidth={4} />
                        </button>

                        <div className="border-8 border-dashed border-boo-purple rounded-[20px] p-6 text-center bg-[#fdf6e3] relative flex-1 flex flex-col items-center justify-between shadow-inner overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(215,195,145,0.2)_100%)] pointer-events-none"></div>
                            
                            <div className="w-[55%] aspect-video overflow-hidden mb-2 shrink-0">
                                <img src={DIPLOMA_ART_IMG} alt="Boo Explorer" className="w-full h-full object-contain" />
                            </div>

                            <img src={DIPLOMA_SYMBOL} alt="Simbolo" className="w-20 h-20 mx-auto mb-1 object-contain" />
                            <h2 className="text-3xl md:text-4xl font-black text-stone-800 mb-0.5 font-serif uppercase tracking-widest">DIPLOMA</h2>
                            <p className="text-sm font-bold text-stone-500 mb-2 uppercase tracking-wide">DI ESPLORATORE MAGICO</p>
                            
                            <p className="text-stone-700 font-medium italic text-xs mb-1">Questo certificato è assegnato a:</p>
                            <div className="border-b-4 border-stone-400/30 pb-1 mb-2">
                                <span className="text-3xl md:text-5xl font-black text-[#b45309] drop-shadow-sm uppercase font-serif">
                                    {childName || 'Amico di Lone Boo'}
                                </span>
                            </div>
                            
                            <p className="text-stone-600 font-bold text-[10px] md:text-xs mb-4 leading-tight max-w-[280px]">
                                Per aver completato con successo la Caccia al Tesoro Fantasma trovando tutti gli oggetti magici!
                            </p>

                            <div className="flex justify-between items-end w-full border-t-2 border-stone-200 pt-2">
                                <div className="text-left">
                                    <p className="text-[8px] text-stone-400 font-bold uppercase">DATA</p>
                                    <p className="text-xs font-bold text-stone-700">{new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <img 
                                        src={DIPLOMA_STAMP} 
                                        alt="Timbro" 
                                        className="w-16 h-16 object-contain rotate-12 drop-shadow-md" 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-2 flex gap-3 px-4 pb-4 shrink-0 bg-white">
                             <button onClick={() => { setProgress(0); setIsCertificateView(false); setShowChestModal(false); setChildName(''); localStorage.setItem('magicHuntProgress', '0'); localStorage.removeItem('magicHuntName'); nextChallenge(); }} className="flex-1 bg-boo-purple text-white font-black py-2.5 rounded-xl border-b-4 border-purple-800 active:translate-y-1 active:border-b-0 text-xs">NUOVA CACCIA</button>
                             <button onClick={handleSaveDiploma} disabled={isSaving} className="flex-1 bg-green-500 text-white font-black py-2.5 rounded-xl border-b-4 border-green-700 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 text-xs">
                                 {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />} {isSaving ? 'SALVATAGGIO...' : 'SALVA'}
                             </button>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

const CHALLENGES = [
    { text: "Trova qualcosa di ROSSO 🔴", target: "Qualcosa di colore rosso" },
    { text: "Trova qualcosa di BLU 🔵", target: "Qualcosa di colore blu" },
    { text: "Trova qualcosa di VERDE 🟢", target: "Qualcosa di colore verde" },
    { text: "Trova qualcosa di GIALLO 🟡", target: "Qualcosa di colore giallo" },
    { text: "Trova qualcosa di ROSA 🩷", target: "Qualcosa di colore rosa" },
    { text: "Trova qualcosa di VIOLA 💜", target: "Qualcosa di colore viola" },
    { text: "Trova something di NERO ⚫", target: "Qualcosa di colore nero" },
    { text: "Trova qualcosa di BIANCO ⚪", target: "Qualcosa di colore bianco" },
    { text: "Trova qualcosa di ARANCIONE 🟠", target: "Qualcosa di colore arancione" },
    { text: "Trova qualcosa di ROTONDO ⚽", target: "Un oggetto di forma rotonda" },
    { text: "Trova qualcosa di QUADRATO ⬛", target: "Un oggetto di forma quadrata" },
    { text: "Trova qualcosa di MORBIDO ☁️", target: "Qualcosa che sembra morbido o peloso" },
    { text: "Trova qualcosa di DURO 🪨", target: "Un oggetto duro o solido" },
    { text: "Trova qualcosa di LUCIDO ✨", target: "Qualcosa che riflette la luce o brilla" },
    { text: "Trova qualcosa di LEGNO 🪵", target: "Un oggetto fatto di legno" },
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
    { text: "Trova qualcosa da MANGIARE 🍎", target: "Cibo o frutta" },
    { text: "Fai un bel SORRISO 😁", target: "Una faccia che sorride" },
    { text: "Fai una faccia BUFFA 🤪", target: "Una smorfia divertente" },
    { text: "Fai vedere la tua MANO ✋", target: "Una mano aperta" },
    { text: "Trova un DISEGNO 🎨", target: "Un disegno o un quadro" },
    { text: "Trova una FORCHETTA 🍴", target: "Una forchetta" },
    { text: "Trova uno SPAZZOLINO 🪥", target: "Uno spazzolino da denti" },
    { text: "Trova un CALZINO 🧦", target: "Un calzino" },
    { text: "Trova un PETTINE o SPAZZOLA 🪮", target: "Un pettine o una spazzola per capelli" },
    { text: "Trova una MONETA 🪙", target: "Una moneta" },
    { text: "Trova un CUSCINO 🛋️", target: "Un cuscino da divano o letto" },
];

export default MagicHunt;
