
import React, { useState, useRef, useEffect } from 'react';
import { User, Sparkles, Fingerprint, Camera, X, RotateCcw } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';

const TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/passport-title.webp';
const LONE_BOO_PHOTO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/passport-boo.webp';
const BTN_CAPTURE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fotofantpasspw.webp';
const BTN_SKIP_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nofotopassfantsaed.webp';
const BTN_RETRY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/generalrtropasswd.webp';

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

const PREFIXES = ["Mastro", "Capitan", "Mega", "Giga", "Professor", "Nonno", "Baby", "Pixel", "Glitch", "Lord", "Re", "Agente", "Super", "Ultra", "Maxi", "Mini", "Dottor", "The Real"];
const SUFFIXES = ["-ino", "-etto", "-one", "-zilla", "-tron", "-craft", "-ix", "-us", "-bot", "-top", "-bomba", "-pazzo", "-mitico", "-legend", "-pro", "-vip", "-star", "-zoom", "-flex", ".exe", " 2000", " 3000", "X", "Z", "Sgravato"];
const TITLES = ["il Supremo", "lo Sgravato", "il Magico", "il Terribile", "il Goloso", "il Dormiglione", "il Veloce", "il Gamer", "il Boss", "l'Incredibile", "il Misterioso", "il Pro", "l'Hacker", "il Glitchato"];

const GhostPassport: React.FC = () => {
  const [name, setName] = useState('');
  const [passport, setPassport] = useState<any>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
      isMountedRef.current = true;
      return () => { isMountedRef.current = false; closeCamera(); };
  }, []);

  const startCamera = async () => {
    if (!name.trim()) return;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (!isMountedRef.current) {
            stream.getTracks().forEach(t => t.stop());
            return;
        }
        streamRef.current = stream;
        setIsCameraOpen(true);
        setTimeout(() => {
            if (videoRef.current) videoRef.current.srcObject = stream;
        }, 100);
    } catch (err) {
        generatePassport(null);
    }
  };

  const capturePhoto = () => {
      if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
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
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsCameraOpen(false);
  };

  const generatePassport = (customPhoto: string | null) => {
    if (!name.trim() || !isMountedRef.current) return;
    const randomFactor = Math.floor(Math.random() * 1000);
    const cleanName = name.trim();
    
    const patterns = [
        () => `${cleanName}${SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]}`,
        () => `${PREFIXES[Math.floor(Math.random() * PREFIXES.length)]} ${cleanName}`,
        () => `${cleanName} ${TITLES[Math.floor(Math.random() * TITLES.length)]}`,
        () => `${cleanName} ${GHOST_SURNAMES[Math.floor(Math.random() * GHOST_SURNAMES.length)]}`,
    ];

    const ghostName = patterns[Math.floor(Math.random() * patterns.length)]();
    const role = GHOST_ROLES[randomFactor % GHOST_ROLES.length];
    const power = GHOST_POWERS[randomFactor % GHOST_POWERS.length];
    const idNumber = Math.floor(Math.random() * 8999) + 1000;

    setPassport({
        fullName: ghostName,
        role: role,
        id: `BOO-${idNumber}`,
        power: power,
        photo: customPhoto || LONE_BOO_PHOTO
    });
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start p-4 pt-40 md:pt-56 overflow-hidden">
        
        {/* FOTOCAMERA OVERLAY */}
        {isCameraOpen && (
            <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="relative w-full max-w-md bg-gray-900 rounded-[30px] border-4 border-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="absolute top-0 right-0 z-20 p-4">
                        <button onClick={closeCamera} className="bg-black/50 text-white p-2 rounded-full border-2 border-white hover:bg-red-500 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-1 relative bg-black aspect-[3/4] overflow-hidden">
                        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />
                    </div>
                    <div className="bg-gray-800 p-4 flex flex-col items-center">
                        <p className="text-white font-black mb-4">Sorridi! 📸</p>
                        <button onClick={capturePhoto} className="bg-white text-black p-4 rounded-full border-8 border-gray-200 shadow-[0_0_20px_white] active:scale-95">
                            <Camera size={32} />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* HEADER GIOCO - FISSO E ABBASSATO ULTERIORMENTE */}
        <div className={`text-center flex flex-col items-center shrink-0 mb-8 animate-in slide-in-from-top duration-500`}>
            <img 
                src={TITLE_IMG} 
                alt="Passaporto Fantasma" 
                className="w-72 md:w-[600px] h-auto mb-1 drop-shadow-md" 
            />
            {!passport && (
                <p className="text-white font-black text-[11px] md:text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,1)] uppercase tracking-wider">
                    Come ti chiameresti se fossi un fantasma?
                </p>
            )}
        </div>

        {/* AREA PRINCIPALE - FISSA */}
        <div className="w-full flex flex-col items-center justify-center min-h-0">
            {!passport ? (
                /* BOX INSERIMENTO NOME */
                <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[30px] md:rounded-[40px] border-4 border-cyan-500 shadow-2xl w-full max-w-md text-center animate-in zoom-in duration-300">
                    <div className="mb-6">
                        <label className="block text-cyan-900 font-black text-xs md:text-lg mb-1 uppercase">IL TUO NOME:</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Scrivi qui..."
                            className="w-full text-center text-lg md:text-2xl font-black text-cyan-900 bg-white border-b-4 border-cyan-300 p-3 rounded-xl focus:outline-none focus:border-cyan-600 placeholder-cyan-100 uppercase"
                            maxLength={15}
                        />
                    </div>
                    
                    <div className="flex flex-row gap-4 justify-center items-center">
                        <button 
                            onClick={startCamera}
                            disabled={!name.trim()}
                            className="w-24 md:w-32 hover:scale-105 active:scale-95 transition-all outline-none disabled:opacity-50"
                        >
                            <img src={BTN_CAPTURE_IMG} alt="Scatta foto" className="w-full h-auto drop-shadow-lg" />
                        </button>
                        
                        <button 
                            onClick={() => generatePassport(null)}
                            disabled={!name.trim()}
                            className="w-24 md:w-32 hover:scale-105 active:scale-95 transition-all outline-none disabled:opacity-50"
                        >
                            <img src={BTN_SKIP_IMG} alt="Usa Lone Boo" className="w-full h-auto drop-shadow-md" />
                        </button>
                    </div>
                </div>
            ) : (
                /* PASSPORT CARD */
                <div className="animate-in flip-in-y duration-700 w-full max-w-4xl flex flex-col items-center px-4 overflow-hidden">
                    <div className="bg-gradient-to-br from-cyan-600 to-blue-900 p-3 md:p-6 rounded-[25px] md:rounded-[40px] border-4 md:border-[6px] border-black shadow-2xl text-white relative overflow-hidden w-full aspect-[1.6/1] max-h-[50vh] md:max-h-[60vh]">
                        
                        <Fingerprint className="absolute -bottom-10 -right-10 text-white/10 w-40 h-40 md:w-96 md:h-96" />
                        
                        <div className="flex items-center gap-2 md:gap-4 border-b-2 md:border-b-4 border-white/20 pb-1.5 mb-1.5 md:mb-5">
                            <img src={OFFICIAL_LOGO} alt="Logo" className="w-8 h-8 md:w-16 md:h-16 bg-white rounded-full p-0.5 md:p-1 shadow-md" />
                            <div className="flex-1">
                                <h3 className="font-black text-[10px] md:text-2xl uppercase tracking-wider leading-none">LONE BOO WORLD</h3>
                                <p className="text-[7px] md:text-sm font-bold text-cyan-200 uppercase">Documento Ufficiale</p>
                            </div>
                            <div className="text-right">
                                <div className="text-[6px] md:text-xs uppercase font-black text-white/40 leading-none">ID NO.</div>
                                <div className="font-mono text-[8px] md:text-xl text-cyan-200 font-bold leading-none">{passport.id}</div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-3 md:gap-8 items-stretch relative z-10 flex-1">
                            <div className="w-20 h-28 md:w-40 md:h-56 rounded-xl md:rounded-[30px] border-2 md:border-6 border-white shadow-xl shrink-0 overflow-hidden bg-white relative self-center">
                                <img src={passport.photo} alt="Passport" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none"></div>
                            </div>

                            <div className="flex flex-col justify-around py-0.5 md:py-1 flex-1 min-w-0 pr-1 text-left">
                                <div className="mb-1 md:mb-3">
                                    <p className="text-cyan-200 text-[6px] md:text-sm uppercase font-black tracking-wider opacity-80 mb-0.5">NOME FANTASMA</p>
                                    <p 
                                        className="font-cartoon text-sm md:text-4xl leading-none text-yellow-400 drop-shadow-[1px_1px_0_rgba(0,0,0,1)] tracking-wide uppercase break-words"
                                        style={{ WebkitTextStroke: '0.5px black' }}
                                    >
                                        {passport.fullName}
                                    </p>
                                </div>
                                
                                <div className="space-y-1 md:space-y-4">
                                    <div>
                                        <p className="text-cyan-200 text-[6px] md:text-sm uppercase font-black tracking-wider opacity-80 mb-0.5">IL TUO RUOLO</p>
                                        <p className="font-black text-[9px] md:text-2xl text-white drop-shadow-md uppercase truncate italic leading-tight">{passport.role}</p>
                                    </div>
                                    <div>
                                        <p className="text-cyan-200 text-[6px] md:text-sm uppercase font-black tracking-wider opacity-80 mb-0.5">SUPERPOTERE</p>
                                        <p className="font-black text-[8px] md:text-xl text-white leading-tight drop-shadow-md italic">
                                            {passport.power}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-2 right-4 flex items-center gap-2 opacity-80">
                            <Sparkles className="text-yellow-400 animate-pulse w-5 h-5 md:w-10 md:h-10" />
                        </div>
                    </div>

                    <button 
                        onClick={() => { setPassport(null); setName(''); }}
                        className="mt-6 md:mt-8 hover:scale-105 active:scale-95 transition-all outline-none shrink-0 animate-in slide-in-from-bottom duration-500 mb-2"
                    >
                        <img src={BTN_RETRY_IMG} alt="Crea un altro" className="h-24 md:h-40 w-auto drop-shadow-lg" />
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default GhostPassport;
