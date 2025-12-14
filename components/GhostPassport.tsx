
import React, { useState, useRef, useEffect } from 'react';
import { User, Sparkles, Fingerprint, Camera, X, RotateCcw } from 'lucide-react';
import { CHANNEL_LOGO, HOME_HERO_IMAGE } from '../constants';

const GHOST_ROLES = [
    'Acchiappa-Nuvole', 'Spaventatore Gentile', 'Mangiatore di Biscotti', 
    'Ballerino Notturno', 'Custode dei Segreti', 'Pittore di Arcobaleni',
    'Amico dei Gatti Neri', 'Cacciatore di Incubi', 'Inventore di Scherzi',
    'Esploratore di Soffitte', 'Collezionista di Echi', 'Dottore dei Mostri',
    'Musicista del Vento', 'Giardiniere della Luna', 'Pilota di Scope',
    'Guardiano del Sonno', 'Cuoco di Zuppe Magiche', 'Sarto di Lenzuola',
    'Bibliotecario Fantasma', 'Messaggero delle Stelle'
];

const GHOST_SURNAMES = [
    'Spettrale', 'Buu', 'Trasparente', 'Volante', 'Ridarella', 
    'Luminoso', 'Sussurro', 'Ectoplasma', 'Mistero', 'Nebbia', 
    'Ombra', 'Gelido', 'Spiritello', 'Vaporoso'
];

const GHOST_POWERS = [
    'Passare attraverso i muri', 'Diventare invisibile a comando',
    'Volare alla velocità della luce', 'Parlare con i pipistrelli',
    'Trasformare sassi in caramelle', 'Creare vento gelido',
    'Illuminare il buio', 'Rimpicciolirsi come una formica',
    'Far galleggiare gli oggetti', 'Cambiare colore per mimetizzarsi',
    'Entrare nei sogni', 'Teletrasporto istantaneo',
    'Congelare il tempo per 5 secondi', 'Parlare tutte le lingue del mondo'
];

// NUOVI DATASET PER NOMI DIVERTENTI & BRAINROT
const PREFIXES = ["Mastro", "Capitan", "Mega", "Giga", "Professor", "Nonno", "Baby", "Pixel", "Glitch", "Lord", "Re", "Agente", "Super", "Ultra", "Maxi", "Mini", "Dottor", "The Real"];
const SUFFIXES = ["-ino", "-etto", "-one", "-zilla", "-tron", "-craft", "-ix", "-us", "-bot", "-top", "-bomba", "-pazzo", "-mitico", "-legend", "-pro", "-vip", "-star", "-zoom", "-flex", ".exe", " 2000", " 3000", "X", "Z", "Sgravato"];
const TITLES = ["il Supremo", "lo Sgravato", "il Magico", "il Terribile", "il Goloso", "il Dormiglione", "il Veloce", "il Gamer", "il Boss", "l'Incredibile", "il Misterioso", "il Pro", "l'Hacker", "il Glitchato"];

const GhostPassport: React.FC = () => {
  const [name, setName] = useState('');
  const [passport, setPassport] = useState<any>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // Independent stream reference
  const isMountedRef = useRef(true);

  // Mount tracking
  useEffect(() => {
      isMountedRef.current = true;
      return () => { isMountedRef.current = false; };
  }, []);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      closeCamera();
    };
  }, []);

  const startCamera = async () => {
    if (!name.trim()) return;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Check if user left while waiting for permission
        if (!isMountedRef.current) {
            stream.getTracks().forEach(t => t.stop());
            return;
        }

        streamRef.current = stream;
        setIsCameraOpen(true);
        // Small delay to ensure video ref is mounted
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }, 100);
    } catch (err) {
        // Fallback if camera denied or error
        console.warn("Camera access denied or error", err);
        generatePassport(null);
    }
  };

  const capturePhoto = () => {
      if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          
          // Flip horizontally for selfie mirror effect
          if (ctx) {
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(videoRef.current, 0, 0);
          }
          
          const photoUrl = canvas.toDataURL('image/jpeg');
          closeCamera();
          
          generatePassport(photoUrl);
      }
  };

  const closeCamera = () => {
      // Clean up stream directly
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
      }
      
      if (videoRef.current) {
          videoRef.current.srcObject = null;
      }
      setIsCameraOpen(false);
  };

  const generatePassport = (customPhoto: string | null) => {
    if (!name.trim() || !isMountedRef.current) return;

    // Use name + random for varied but somewhat consistent results
    const randomFactor = Math.floor(Math.random() * 1000);
    const cleanName = name.trim();
    
    // --- NEW NAME GENERATION LOGIC (BRAINROT STYLE) ---
    const patterns = [
        () => `${cleanName}${SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]}`, // Marcozilla
        () => `${PREFIXES[Math.floor(Math.random() * PREFIXES.length)]} ${cleanName}`, // Giga Marco
        () => `${cleanName} ${TITLES[Math.floor(Math.random() * TITLES.length)]}`, // Marco lo Sgravato
        () => `${cleanName} ${GHOST_SURNAMES[Math.floor(Math.random() * GHOST_SURNAMES.length)]}`, // Marco Spettrale (Classic)
    ];

    // Pick a random pattern
    const nameGenerator = patterns[Math.floor(Math.random() * patterns.length)];
    const ghostName = nameGenerator();

    const role = GHOST_ROLES[randomFactor % GHOST_ROLES.length];
    const power = GHOST_POWERS[randomFactor % GHOST_POWERS.length];
    const idNumber = Math.floor(Math.random() * 8999) + 1000;
    const photoBg = randomFactor % 2 === 0 ? 'bg-blue-200' : 'bg-purple-200';

    setPassport({
        fullName: ghostName,
        role: role,
        id: `BOO-${idNumber}`,
        power: power,
        photoBg: photoBg,
        photo: customPhoto || HOME_HERO_IMAGE
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in py-4">
        
        {/* CAMERA MODAL (POPUP STYLE) */}
        {isCameraOpen && (
            <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="relative w-full max-w-md bg-gray-900 rounded-[30px] border-4 border-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                    
                    {/* Header */}
                    <div className="absolute top-0 right-0 z-20 p-4">
                        <button 
                            onClick={closeCamera}
                            className="bg-black/50 text-white p-2 rounded-full border-2 border-white hover:bg-red-500 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Camera Feed */}
                    <div className="flex-1 relative bg-black aspect-[3/4] overflow-hidden">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" 
                        />
                        {/* Overlay Frame */}
                        <div className="absolute inset-0 border-[2px] border-white/30 rounded-3xl m-6 pointer-events-none">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                        </div>
                    </div>
                    
                    {/* Control Bar */}
                    <div className="bg-gray-800 p-6 flex flex-col items-center border-t-2 border-gray-700">
                        <p className="text-white font-black text-lg mb-4 drop-shadow-md">Fai un sorriso da fantasma! 📸</p>
                        <button 
                            onClick={capturePhoto}
                            className="bg-white text-black p-4 rounded-full border-8 border-gray-200 hover:scale-110 transition-transform shadow-[0_0_30px_white] active:scale-95"
                        >
                            <Camera size={40} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-cyan-600 mb-2 drop-shadow-sm">
                Passaporto Fantasma 🛂
            </h2>
            <p className="text-gray-600 font-bold text-lg">
                Come ti chiameresti se fossi un fantasma?
            </p>
        </div>

        {!passport ? (
            <div className="bg-white p-8 rounded-[40px] border-4 border-cyan-500 shadow-xl w-full max-w-md text-center">
                <div className="mb-6">
                    <label className="block text-cyan-800 font-black text-xl mb-2">IL TUO NOME:</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Scrivi qui..."
                        className="w-full text-center text-2xl font-bold text-cyan-900 bg-cyan-50 border-b-4 border-cyan-300 p-3 rounded-xl focus:outline-none focus:border-cyan-600 placeholder-cyan-300"
                        maxLength={15}
                    />
                </div>
                
                <button 
                    onClick={startCamera}
                    disabled={!name.trim()}
                    className="w-full bg-cyan-500 text-white text-xl font-black px-6 py-4 rounded-full border-4 border-black hover:scale-105 active:shadow-none active:translate-y-1 shadow-[4px_4px_0_black] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 mb-4"
                >
                    <Camera size={24} /> SCATTA FOTO E CREA
                </button>
                
                <div className="flex justify-center">
                    <button 
                        onClick={() => generatePassport(null)}
                        disabled={!name.trim()}
                        className="bg-orange-500 text-white text-lg font-black px-6 py-2 rounded-full border-4 border-black hover:scale-105 active:shadow-none active:translate-y-1 shadow-[2px_2px_0_black] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        Salta foto (Usa Lone Boo)
                    </button>
                </div>
            </div>
        ) : (
            <div className="animate-in flip-in-y duration-700 w-full max-w-md flex flex-col items-center">
                 {/* PASSPORT CARD */}
                 <div className="bg-gradient-to-br from-cyan-600 to-blue-900 p-6 rounded-[30px] border-4 border-black shadow-2xl text-white relative overflow-hidden w-full">
                     
                     {/* Watermark */}
                     <Fingerprint className="absolute -bottom-10 -right-10 text-white/10 w-64 h-64" />

                     {/* Header */}
                     <div className="flex items-center gap-3 border-b-2 border-white/20 pb-4 mb-4">
                         <img src={CHANNEL_LOGO} alt="Logo" className="w-12 h-12 bg-white rounded-full p-1" />
                         <div>
                             <h3 className="font-black text-xl uppercase tracking-widest">LONE BOO WORLD</h3>
                             <p className="text-xs font-bold text-cyan-200">Official Ghost Identity</p>
                         </div>
                     </div>

                     {/* Content */}
                     <div className="flex gap-4 items-start relative z-10">
                         {/* Photo Section */}
                         <div className={`w-28 h-36 rounded-xl border-4 border-white shadow-lg flex items-center justify-center shrink-0 overflow-hidden relative bg-white`}>
                             <img 
                                src={passport.photo} 
                                alt="Passport Photo" 
                                className="w-full h-full object-cover" 
                             />
                             {/* Gloss effect */}
                             <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/30 pointer-events-none"></div>
                         </div>

                         {/* Text Section */}
                         <div className="flex flex-col gap-3 w-full min-w-0">
                             <div>
                                 <p className="text-cyan-200 text-[10px] uppercase font-bold">NOME FANTASMA</p>
                                 <p 
                                    className="font-black text-2xl md:text-3xl leading-none text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] tracking-tight mb-1 break-words"
                                    style={{ WebkitTextStroke: '1px black' }}
                                 >
                                     {passport.fullName}
                                 </p>
                             </div>
                             <div>
                                 <p className="text-cyan-200 text-[10px] uppercase font-bold">RUOLO</p>
                                 <p className="font-bold text-sm leading-tight text-white">{passport.role}</p>
                             </div>
                             <div>
                                 <p className="text-cyan-200 text-[10px] uppercase font-bold">SUPERPOTERE</p>
                                 <p className="font-bold text-sm leading-tight text-white">{passport.power}</p>
                             </div>
                         </div>
                     </div>

                     {/* Footer ID */}
                     <div className="mt-6 pt-4 border-t-2 border-white/20 flex justify-between items-end">
                         <div className="font-mono text-cyan-200 text-lg tracking-widest">{passport.id}</div>
                         <Sparkles className="text-yellow-400 animate-pulse" />
                     </div>
                 </div>

                 <button 
                    onClick={() => { setPassport(null); setName(''); }}
                    className="mt-8 flex items-center gap-2 bg-boo-yellow text-black font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 active:translate-y-1 transition-all shadow-[4px_4px_0_black]"
                 >
                     <RotateCcw size={20} /> CREA UN ALTRO
                 </button>
            </div>
        )}

    </div>
  );
};

export default GhostPassport;
