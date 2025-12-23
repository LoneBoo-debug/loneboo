
import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, Check, Lock, Star, Download, Settings, Move, ArrowRight, Upload, Camera, ScanLine, Copy, RotateCcw, Trash2, Smile, BookOpen, LogOut, Image as ImageIcon, User, HelpCircle, Share } from 'lucide-react';
import { STICKERS_COLLECTION, STICKERS_COLLECTION_VOL2 } from '../services/stickersDatabase';
import { getProgress, openPack, spendTokens, getPassportCode, restorePassport, saveSticker, addDuplicate, tradeDuplicates, setPlayerName, decodePassport, saveProgress, addTokens, upgradeToNextAlbum } from '../services/tokens';
import { PlayerProgress, Sticker, AvatarConfig } from '../types';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import AvatarCreator, { generateAvatarDataUrl } from './AvatarCreator';

// =================================================================================================
// 🎵 AUDIO SYNTHESIS ENGINE (LAZY LOADED)
// =================================================================================================
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

const playDrumRoll = (duration: number) => {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Create White Noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to make it sound more like a drum (Lowpass)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    // Gain for Volume Envelope (Crescendo)
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(1.0, now + duration - 0.1); // Build up
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Quick stop

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start(now);
    noise.stop(now + duration);
};

const playFanfare = () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Notes: C4, E4, G4, C5 (Major Chord Arpeggio)
    const notes = [
        { freq: 523.25, start: 0.0, dur: 0.1 }, // C5 (Short)
        { freq: 659.25, start: 0.1, dur: 0.1 }, // E5 (Short)
        { freq: 783.99, start: 0.2, dur: 0.1 }, // G5 (Short)
        { freq: 1046.50, start: 0.3, dur: 1.5 } // C6 (Long Final)
    ];

    notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Sawtooth sounds brassy/trumpet-like
        osc.type = 'sawtooth';
        osc.frequency.value = n.freq;

        // Envelope (Attack -> Decay)
        gain.gain.setValueAtTime(0, now + n.start);
        gain.gain.linearRampToValueAtTime(0.3, now + n.start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur);
    });
};

// =================================================================================================
// 🧢 IMMAGINI CARD
// =================================================================================================
const CARD_BG = 'https://i.postimg.cc/BQphG6ys/tedredr-(1).jpg'; 

// LAYOUT CONFIG
type Coords = { x: number, y: number };
type PhotoCoords = { x: number, y: number, scale: number };

type CardLayoutConfig = {
    name: Coords;
    date: Coords;
    time: Coords;
    photo: PhotoCoords;
};

const FINAL_LAYOUT: CardLayoutConfig = {
    name: { x: 56.97, y: 25.98 },
    date: { x: 74.88, y: 34.69 },
    time: { x: 54.07, y: 42.19 },
    photo: { x: 7.53, y: 16.76, scale: 1.2 } 
};

// --- STICKER CARD COMPONENT ---
const StickerCard: React.FC<{ sticker: Sticker, isOwned: boolean, showDetails?: boolean, isNew?: boolean }> = ({ sticker, isOwned, showDetails = false, isNew = false }) => {
    const isImage = sticker.image.startsWith('http') || sticker.image.startsWith('/');
    const rarityColor = {
        'COMMON': 'border-gray-200',
        'RARE': 'border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]',
        'EPIC': 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]',
        'LEGENDARY': 'border-yellow-400 shadow-[0_0_20px_gold]'
    }[sticker.rarity];
    const bgFallback = {
        'COMMON': 'bg-gray-100',
        'RARE': 'bg-blue-50',
        'EPIC': 'bg-purple-50',
        'LEGENDARY': 'bg-yellow-50'
    }[sticker.rarity];

    return (
        <div className={`
            relative bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform duration-300 will-change-transform
            ${isOwned || showDetails ? `border-4 ${rarityColor}` : 'border-4 border-gray-300 opacity-60 grayscale'}
            ${showDetails ? 'w-full h-full' : 'aspect-[3/4]'}
        `}>
            <div className={`flex-1 w-full relative flex items-center justify-center overflow-hidden ${bgFallback} ${showDetails ? 'min-h-[200px]' : ''}`}>
                {(isOwned || showDetails) ? (
                    isImage ? (
                        <img src={sticker.image} alt={sticker.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                        <span className="text-6xl md:text-7xl filter drop-shadow-md">{sticker.image}</span>
                    )
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <Lock size={32} className="mb-2" />
                        <span className="text-xs font-bold text-center px-2">???</span>
                    </div>
                )}
                {(isOwned || showDetails) && sticker.rarity !== 'COMMON' && (
                    <div className="absolute top-2 right-2">
                        <Star 
                            size={20} 
                            className={`${sticker.rarity === 'LEGENDARY' ? 'text-yellow-500 fill-yellow-500 animate-spin-slow' : sticker.rarity === 'EPIC' ? 'text-purple-500 fill-purple-500' : 'text-blue-400 fill-blue-400'}`} 
                        />
                    </div>
                )}
                {isNew && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-br-lg z-10 animate-pulse">
                        NUOVA!
                    </div>
                )}
            </div>
            <div className="h-[25%] min-h-[40px] bg-white border-t-2 border-gray-100 flex flex-col items-center justify-center p-1 text-center z-10">
                <p className="font-black text-gray-800 text-[10px] md:text-xs uppercase leading-tight truncate w-full px-1">
                    {sticker.name}
                </p>
                {showDetails && (
                    <p className="text-9px text-gray-500 font-bold mt-1 px-2 leading-tight">
                        {sticker.description}
                    </p>
                )}
            </div>
        </div>
    );
};

// --- CONFETTI EXPLOSION COMPONENT ---
const ConfettiExplosion = () => {
    // Generate 60 particles
    const particles = Array.from({ length: 60 }).map((_, i) => {
        const angle = Math.random() * 360;
        const velocity = 150 + Math.random() * 250; // Distance force
        const size = 6 + Math.random() * 8;
        const color = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#ec4899', '#ffffff'][Math.floor(Math.random() * 7)];
        const delay = Math.random() * 0.1;
        
        // Calculate exact coordinates for CSS to avoid relying on complex var parsing
        const tx = Math.cos(angle * Math.PI / 180) * velocity;
        const ty = Math.sin(angle * Math.PI / 180) * velocity;
        
        return (
            <div 
                key={i}
                className="absolute top-1/2 left-1/2 rounded-sm"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    // Use CSS variables for the animation keyframe to pick up
                    // @ts-ignore
                    '--tx': `${tx}px`,
                    // @ts-ignore
                    '--ty': `${ty}px`,
                    animation: `confetti-blow 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards ${delay}s`
                }}
            />
        );
    });

    return <div className="absolute inset-0 z-[60] pointer-events-none overflow-visible w-full h-full">{particles}</div>;
};

interface NewsstandProps {
    onClose: () => void;
    initialTab?: 'SHOP' | 'ALBUM' | 'PASSPORT';
}

const Newsstand: React.FC<NewsstandProps> = ({ onClose, initialTab = 'SHOP' }) => {
    const [activeTab, setActiveTab] = useState<'SHOP' | 'ALBUM' | 'PASSPORT'>(initialTab);
    const [progress, setProgress] = useState<PlayerProgress>(getProgress());
    const [packOpening, setPackOpening] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    
    // Welcome / Login State
    const [showWelcome, setShowWelcome] = useState(false);
    const [newName, setNewName] = useState('');
    
    // AVATAR CREATOR STATE
    const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);
    
    // Initialize Avatar Image from stored config
    const [tempAvatarImage, setTempAvatarImage] = useState<string | null>(() => {
        const p = getProgress();
        if (p.avatarConfig) {
            return generateAvatarDataUrl(p.avatarConfig.charIndex, p.avatarConfig.bgIndex);
        }
        return null;
    });

    // View Logic
    const maxUnlockedAlbum = progress.currentAlbum || 1;
    const [viewingAlbum, setViewingAlbum] = useState(maxUnlockedAlbum);

    // Save Logic States
    const [isGeneratingImg, setIsGeneratingImg] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Scanner States (Restore)
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    const isBoy = progress.avatar !== 'GIRL'; 
    const currentCardBg = CARD_BG;

    // Restore Logic
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [restoreStatus, setRestoreStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [restoredName, setRestoredName] = useState<string>('');

    useEffect(() => {
        setViewingAlbum(progress.currentAlbum || 1);
        if (!progress.playerName || progress.playerName.trim() === '') {
            setShowWelcome(true);
        }
    }, [progress.currentAlbum, progress.playerName]);

    // Listen for updates and refresh avatar if config changed
    useEffect(() => {
        const update = () => {
            const p = getProgress();
            setProgress(p);
            if (p.avatarConfig) {
                const url = generateAvatarDataUrl(p.avatarConfig.charIndex, p.avatarConfig.bgIndex);
                setTempAvatarImage(url);
            } else {
                setTempAvatarImage(null);
            }
        };
        window.addEventListener('progressUpdated', update);
        return () => window.removeEventListener('progressUpdated', update);
    }, []);

    // Sticker logic
    const [tempSticker, setTempSticker] = useState<Sticker | null>(null);
    const [isDuplicate, setIsDuplicate] = useState(false);
    
    // Zoom Logic
    const [zoomedSticker, setZoomedSticker] = useState<Sticker | null>(null);
    
    // Config
    const packCost = viewingAlbum === 2 ? 100 : 50;
    const activeCollection = viewingAlbum === 2 ? STICKERS_COLLECTION_VOL2 : STICKERS_COLLECTION;

    // --- AVATAR HANDLERS ---
    const handleSaveAvatar = (config: AvatarConfig, dataUrl: string) => {
        setTempAvatarImage(dataUrl);
        setIsAvatarCreatorOpen(false);
        
        // FIX: Salviamo SEMPRE la configurazione in memoria, anche se non c'è ancora un nome.
        const currentP = getProgress();
        const newProgress = { ...currentP, avatarConfig: config };
        saveProgress(newProgress);
        setProgress(newProgress);
    };

    const handleSetName = () => {
        if (newName.trim().length > 0 && tempAvatarImage) {
            setPlayerName(newName, 'BOY');
            setShowWelcome(false);
            setProgress(getProgress()); 
            setActiveTab('PASSPORT');
        }
    };

    const triggerPackAnimation = async (sticker: Sticker) => {
        playDrumRoll(3.0); 
        setPackOpening(true);
        setTempSticker(null);
        setShowConfetti(false);

        const minDelay = new Promise(resolve => setTimeout(resolve, 2500));
        
        const imageLoad = new Promise((resolve) => {
            const img = new Image();
            img.src = sticker.image;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
        });

        await Promise.all([minDelay, imageLoad]);

        const alreadyOwned = progress.unlockedStickers.includes(sticker.id);
        setIsDuplicate(alreadyOwned);
        setTempSticker(sticker);
        setPackOpening(false);
        
        playFanfare();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); 
    };

    const handleBuyPack = () => {
        if (progress.tokens >= packCost && !packOpening && !tempSticker) {
            const success = spendTokens(packCost);
            if (success) {
                const sticker = openPack(viewingAlbum); 
                triggerPackAnimation(sticker);
            }
        }
    };

    const handleExchangePack = () => {
        const dupCount = Math.max(progress.duplicates || 0, progress.duplicateStickers?.length || 0);
        if (dupCount >= 5 && !packOpening && !tempSticker) {
            const success = tradeDuplicates();
            if (success) {
                const sticker = openPack(viewingAlbum); 
                triggerPackAnimation(sticker);
            }
        }
    };

    const handleCollect = () => {
        if (!tempSticker) return;
        saveSticker(tempSticker.id);
        setTempSticker(null); 
    };

    const handleDuplicate = () => {
        if (!tempSticker) return;
        addDuplicate(tempSticker.id);
        setTempSticker(null); 
    };

    // --- CANVAS GENERATION LOGIC ---
    const drawTextAt = (ctx: CanvasRenderingContext2D, text: string, xPercent: number, yPercent: number, canvasW: number, canvasH: number, color: string, fontSizePx: number) => {
        const x = (xPercent / 100) * canvasW;
        const y = (yPercent / 100) * canvasH;

        ctx.fillStyle = color;
        ctx.textAlign = 'left'; 
        ctx.textBaseline = 'top';
        ctx.font = `bold ${fontSizePx}px Arial`;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.fillText(text, x, y);
    };

    const generateAndDownloadCard = async () => {
        // Fallback: If no avatar, force creation or use current temp
        if (!tempAvatarImage) {
            alert("Per favore crea prima il tuo Avatar!");
            setIsAvatarCreatorOpen(true);
            return;
        }

        setIsGeneratingImg(true);
        const canvas = canvasRef.current;
        if (!canvas) { setIsGeneratingImg(false); return; }

        const ctx = canvas.getContext('2d');
        if (!ctx) { setIsGeneratingImg(false); return; }

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = currentCardBg;

        await new Promise((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        });

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // 1. BG
        ctx.drawImage(img, 0, 0);

        // 2. USER AVATAR (Use tempAvatarImage which is guaranteed to be a string here)
        if (tempAvatarImage) { 
            const userPhoto = new Image();
            userPhoto.src = tempAvatarImage;
            await new Promise((resolve) => { userPhoto.onload = resolve; userPhoto.onerror = resolve; });
            
            const phX = (FINAL_LAYOUT.photo.x / 100) * canvas.width;
            const phY = (FINAL_LAYOUT.photo.y / 100) * canvas.height;
            const phW = (canvas.width * 0.25) * FINAL_LAYOUT.photo.scale; 
            const aspectRatio = userPhoto.naturalWidth / userPhoto.naturalHeight;
            const phH = phW / aspectRatio;

            ctx.save();
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 10;
            ctx.drawImage(userPhoto, phX, phY, phW, phH);
            ctx.restore();
        }

        // 3. TEXT FIELDS
        const nameSize = canvas.height * 0.05; 
        const infoSize = canvas.height * 0.035; 

        drawTextAt(ctx, progress.playerName || "GIOCATORE", FINAL_LAYOUT.name.x, FINAL_LAYOUT.name.y, canvas.width, canvas.height, "#FFFFFF", nameSize);
        
        const now = new Date();
        const dateStr = now.toLocaleDateString('it-IT'); 
        const timeStr = now.toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'}); 

        drawTextAt(ctx, dateStr, FINAL_LAYOUT.date.x, FINAL_LAYOUT.date.y, canvas.width, canvas.height, "#FFFFFF", infoSize);
        drawTextAt(ctx, timeStr, FINAL_LAYOUT.time.x, FINAL_LAYOUT.time.y, canvas.width, canvas.height, "#FFFFFF", infoSize);

        // 4. QR Code Stamp
        const code = getPassportCode();
        try {
            const qrUrl = await QRCode.toDataURL(code, { margin: 1, width: 256 });
            const qrImg = new Image();
            qrImg.src = qrUrl;
            await new Promise((resolve) => { qrImg.onload = resolve; });
            
            const qrSize = canvas.height * 0.20; 
            const margin = canvas.width * 0.04; 
            const qrX = canvas.width - qrSize - margin;
            const qrY = canvas.height - qrSize - margin;
            const padding = 10; 

            ctx.shadowColor = "transparent"; 
            ctx.shadowBlur = 0;
            ctx.fillStyle = "white";
            ctx.fillRect(qrX - padding, qrY - padding, qrSize + (padding*2), qrSize + (padding*2));
            
            ctx.lineWidth = 4;
            ctx.strokeStyle = "black";
            ctx.strokeRect(qrX - padding, qrY - padding, qrSize + (padding*2), qrSize + (padding*2));

            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        } catch (e) {
            console.error("QR Generation failed", e);
        }

        // --- NEW SAVING LOGIC WITH WEB SHARE API (MOBILE FRIENDLY) ---
        canvas.toBlob(async (blob) => {
            if (!blob) {
                setIsGeneratingImg(false);
                return;
            }

            const filename = `LONE-BOO-CARD-${progress.playerName || 'GHOST'}.jpg`;
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            // 1. Try Web Share API ONLY ON MOBILE
            if (isMobile && navigator.share && navigator.canShare) {
                const file = new File([blob], filename, { type: 'image/jpeg' });
                if (navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'La mia Tessera Lone Boo',
                            text: 'Ecco la mia tessera ufficiale di Lone Boo! 👻'
                        });
                        setIsGeneratingImg(false);
                        return; // Stop if share was successful
                    } catch (error) {
                        console.warn('Share aborted or failed, falling back to download.', error);
                    }
                }
            }

            // 2. Standard Download (Desktop or older devices)
            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsGeneratingImg(false);

        }, 'image/jpeg', 0.85);
    };

    // --- RESTORE LOGIC ---
    const handleRestoreWithCode = (code: string) => {
        const decoded = decodePassport(code);
        if (decoded && restorePassport(code)) {
            setRestoredName(decoded.playerName || '');
            setRestoreStatus('SUCCESS');
        } else {
            setRestoreStatus('ERROR');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (event.target?.result) {
                    const img = new Image();
                    img.src = event.target.result as string;
                    await new Promise(r => img.onload = r);
                    
                    const cvs = document.createElement('canvas');
                    cvs.width = img.width;
                    cvs.height = img.height;
                    
                    const ctxOk = cvs.getContext('2d');
                    if (ctxOk) {
                        ctxOk.drawImage(img, 0, 0);
                        const imageData = ctxOk.getImageData(0, 0, cvs.width, cvs.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        if (code && code.data) {
                            handleRestoreWithCode(code.data);
                        } else {
                            alert("Non trovo il QR Code!");
                        }
                    }
                }
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const startScanner = async () => {
        setIsScannerOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute("playsinline", "true"); 
                videoRef.current.play();
                requestRef.current = requestAnimationFrame(scanTick);
            }
        } catch (err) {
            alert("Impossibile accedere alla fotocamera.");
            setIsScannerOpen(false);
        }
    };

    const stopScanner = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(t => t.stop());
        }
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        setIsScannerOpen(false);
    };

    const scanTick = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const video = videoRef.current;
            const canvas = scannerCanvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    canvas.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
                    
                    if (code && code.data) {
                        handleRestoreWithCode(code.data);
                        stopScanner();
                        return; 
                    }
                }
            }
        }
        requestRef.current = requestAnimationFrame(scanTick);
    };

    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <>
            <style>{`
                @keyframes shake-hard {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                .animate-pack-shake { animation: shake-hard 0.5s infinite; }
                
                @keyframes confetti-blow {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(720deg); opacity: 0; }
                }

                @keyframes reveal-sticker {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-reveal-sticker { animation: reveal-sticker 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
            `}</style>

            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 animate-in fade-in">
                <div className="bg-white w-full max-w-4xl h-[95vh] md:h-[90vh] rounded-[30px] md:rounded-[40px] border-4 md:border-8 border-blue-600 shadow-2xl flex flex-col overflow-hidden relative">
                    
                    {/* --- WELCOME MODAL (FIRST TIME / LOGIN) --- */}
                    {showWelcome && (
                        <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                            <div className="bg-white rounded-[30px] md:rounded-[40px] border-4 md:border-8 border-blue-600 p-4 flex flex-col items-center max-w-sm w-full relative shadow-2xl animate-in zoom-in overflow-hidden max-h-full">
                                
                                <button 
                                    onClick={() => setShowWelcome(false)}
                                    className="absolute top-2 right-2 bg-gray-100 p-2 rounded-full border-2 border-gray-300 text-gray-500 hover:bg-red-100 hover:text-red-500 hover:border-red-400 transition-all z-50"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>

                                <div className="w-24 h-24 shrink-0 mb-1">
                                    <img src="https://i.postimg.cc/pX1Tpb68/edicolabooo.png" alt="Edicola" className="w-full h-full object-contain drop-shadow-2xl" />
                                </div>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none mb-1">EDICOLA</h3>
                                
                                {restoreStatus === 'SUCCESS' ? (
                                    <div className="flex flex-col items-center w-full animate-in zoom-in">
                                        <h2 className="text-3xl md:text-4xl font-black text-green-600 mb-1 uppercase text-center leading-none">
                                            BENTORNATO
                                        </h2>
                                        <div className="text-2xl md:text-3xl font-black text-orange-500 uppercase text-center mb-4 drop-shadow-sm">
                                            {restoredName}
                                        </div>
                                        <p className="text-gray-600 font-bold text-center text-xs md:text-sm mb-6 px-4 leading-tight">
                                            I tuoi progressi e il tuo Avatar sono stati caricati!
                                        </p>
                                        <button 
                                            onClick={onClose}
                                            className="w-full bg-green-500 text-white font-black py-3 px-8 rounded-full text-xl shadow-[4px_4px_0_black] border-4 border-black hover:scale-105 active:shadow-none active:translate-y-1 transition-all mb-4"
                                        >
                                            ENTRA NEL PARCO
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-black text-blue-600 mb-1 uppercase text-center leading-none">Ciao Giocatore!</h2>
                                        <p className="text-gray-600 font-bold text-center text-xs mb-3 px-2 leading-tight">Crea la tua identità per iniziare.</p>
                                        
                                        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="NOME..." className="w-full bg-white border-4 border-black text-black font-black text-lg p-2 rounded-xl text-center uppercase focus:outline-none focus:border-blue-500 placeholder:text-gray-300 mb-2 shadow-sm shrink-0" maxLength={12} />

                                        {/* AVATAR CREATION TRIGGER */}
                                        <div className="w-full mb-3 flex flex-col items-center">
                                            {tempAvatarImage ? (
                                                <div className="relative w-28 h-28 rounded-full border-4 border-blue-600 overflow-hidden shadow-lg mb-1 group bg-blue-100">
                                                    <img src={tempAvatarImage} className="w-full h-full object-contain" alt="Avatar" />
                                                    <button 
                                                        onClick={() => setIsAvatarCreatorOpen(true)} 
                                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Settings className="text-white" size={24} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => setIsAvatarCreatorOpen(true)}
                                                    className="w-28 h-28 rounded-full border-4 border-dashed border-gray-400 flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors mb-1 text-gray-500"
                                                >
                                                    <Smile size={32} />
                                                    <span className="text-[10px] font-black mt-1">CREA AVATAR</span>
                                                </button>
                                            )}
                                        </div>

                                        <button 
                                            onClick={handleSetName} 
                                            disabled={!newName.trim() || !tempAvatarImage} 
                                            className="w-full bg-green-500 text-white font-black py-2.5 px-4 rounded-full text-lg shadow-[3px_3px_0_black] border-4 border-black hover:scale-105 active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none shrink-0 mb-1"
                                        >
                                            CREA TESSERA
                                        </button>
                                        
                                        {/* Missing Info Hint */}
                                        {(!newName.trim() || !tempAvatarImage) && (
                                            <p className="text-[10px] text-red-500 font-bold text-center mb-2 animate-pulse">
                                                {!tempAvatarImage ? "Prima crea il tuo Avatar!" : "Inserisci un nome!"}
                                            </p>
                                        )}

                                        <div className="w-full border-t-2 border-blue-200 pt-2 bg-white/50 p-2 rounded-xl mt-1">
                                            <p className="text-[9px] text-gray-500 font-bold text-center mb-1 uppercase">Hai già una tessera?</p>
                                            <div className="flex gap-1 mb-1 w-full">
                                                <button onClick={startScanner} className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-lg border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-1 text-[9px] sm:text-[10px] whitespace-nowrap px-1">
                                                    <Camera size={12} /> SCANSIONA
                                                </button>
                                                <label className="flex-1 bg-blue-500 text-white font-bold py-2 rounded-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-1 text-[9px] sm:text-[10px] whitespace-nowrap px-1 cursor-pointer hover:brightness-110">
                                                    <Upload size={12} /> CARICA
                                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                                </label>
                                            </div>
                                            {restoreStatus === 'ERROR' && <p className="text-red-500 font-bold mt-1 text-center text-[10px] animate-shake">Codice non valido.</p>}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- HEADER --- */}
                    <div className="bg-blue-600 p-3 md:p-4 flex justify-between items-center z-20 shadow-md shrink-0 border-b-4 border-blue-800">
                        <div className="flex items-center">
                            <img src="https://i.postimg.cc/x13ZxzS1/eicoljue-(1)-(1).png" alt="Edicola" className="h-20 md:h-28 w-auto object-contain drop-shadow-md transform rotate-2" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div 
                                className="bg-black/20 px-3 py-1 rounded-full text-white font-black text-sm md:text-base border border-white/20 shadow-inner flex items-center gap-1 cursor-default"
                            >
                                <span>{progress.tokens}</span> <span className="text-lg">🪙</span>
                            </div>
                            <button onClick={onClose} className="bg-white/20 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors border border-white/10">
                                <X size={20} className="md:w-6 md:h-6" />
                            </button>
                        </div>
                    </div>

                    {/* --- TABS --- */}
                    <div className="flex bg-blue-800 p-1 shrink-0 gap-1 overflow-x-auto">
                        <button 
                            onClick={() => setActiveTab('SHOP')}
                            className={`flex-1 py-2 md:py-3 rounded-t-xl font-black text-xs md:text-sm uppercase tracking-wide transition-colors ${activeTab === 'SHOP' ? 'bg-white text-blue-600' : 'bg-blue-900/50 text-blue-300 hover:bg-blue-700'}`}
                        >
                            NEGOZIO
                        </button>
                        <button 
                            onClick={() => setActiveTab('ALBUM')}
                            className={`flex-1 py-2 md:py-3 rounded-t-xl font-black text-xs md:text-sm uppercase tracking-wide transition-colors ${activeTab === 'ALBUM' ? 'bg-white text-blue-600' : 'bg-blue-900/50 text-blue-300 hover:bg-blue-700'}`}
                        >
                            ALBUM
                        </button>
                        <button 
                            onClick={() => setActiveTab('PASSPORT')}
                            className={`flex-1 py-2 md:py-3 rounded-t-xl font-black text-xs md:text-sm uppercase tracking-wide transition-colors ${activeTab === 'PASSPORT' ? 'bg-white text-blue-600' : 'bg-blue-900/50 text-blue-300 hover:bg-blue-700'}`}
                        >
                            TESSERA
                        </button>
                    </div>

                    {/* --- MAIN CONTENT AREA --- */}
                    <div className="flex-1 bg-gray-100 overflow-hidden relative">
                        
                        {/* SHOP VIEW */}
                        {activeTab === 'SHOP' && (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6 animate-in slide-in-from-right">
                                {tempSticker ? (
                                    <div className="flex flex-col items-center relative">
                                        
                                        {/* CONFETTI LAYER ON TOP OF STICKER */}
                                        {showConfetti && <ConfettiExplosion />}

                                        <div className="mb-6 relative group animate-reveal-sticker">
                                            <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                            <div className="w-48 md:w-64 transform transition-transform hover:scale-105 duration-300">
                                                <StickerCard sticker={tempSticker} isOwned={true} showDetails={true} isNew={!isDuplicate} />
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-2 uppercase animate-in slide-in-from-bottom fade-in duration-500 delay-200">{tempSticker.name}</h3>
                                        <div className={`px-4 py-1 rounded-full font-black text-sm uppercase mb-6 border-2 animate-in zoom-in duration-500 delay-300 ${isDuplicate ? 'bg-orange-100 text-orange-600 border-orange-300' : 'bg-green-100 text-green-600 border-green-300'}`}>
                                            {isDuplicate ? 'DOPPIONE Trovato!' : 'NUOVA AGGIUNTA!'}
                                        </div>

                                        {isDuplicate ? (
                                            <button onClick={handleDuplicate} className="bg-orange-500 text-white font-black py-3 px-8 rounded-full text-lg shadow-lg border-4 border-white hover:scale-105 transition-transform flex items-center gap-2 animate-in slide-in-from-bottom fade-in duration-500 delay-500">
                                                <Copy size={20} /> AGGIUNGI AI DOPPIONI
                                            </button>
                                        ) : (
                                            <button onClick={handleCollect} className="bg-green-500 text-white font-black py-3 px-8 rounded-full text-lg shadow-lg border-4 border-white hover:scale-105 transition-transform flex items-center gap-2 animate-in slide-in-from-bottom fade-in duration-500 delay-500">
                                                <Check size={24} strokeWidth={4} /> METTI NELL'ALBUM
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center max-w-md w-full relative">
                                        <div className="bg-white p-6 rounded-[30px] shadow-xl border-4 border-blue-200 mb-6 relative overflow-visible group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50"></div>
                                            
                                            <div className="relative z-10">
                                                <img 
                                                    src={viewingAlbum === 2 ? "https://i.postimg.cc/kgRv53vs/goldedition-(1).png" : "https://i.postimg.cc/QCqn0Lyy/standardedition-(2).png"} 
                                                    alt="Pack" 
                                                    className={`w-64 h-64 md:w-80 md:h-80 object-contain mx-auto mb-2 drop-shadow-2xl transition-transform duration-100 ${packOpening ? 'animate-pack-shake' : 'group-hover:scale-110'}`} 
                                                />
                                                <h3 className="text-2xl font-black text-blue-600 mb-1">PACCHETTO {viewingAlbum === 2 ? 'GOLD' : 'STANDARD'}</h3>
                                                <p className="text-gray-500 font-bold text-sm mb-4">Contiene 1 figurina a sorpresa</p>
                                                
                                                <button 
                                                    onClick={handleBuyPack}
                                                    disabled={progress.tokens < packCost || packOpening}
                                                    className="w-full bg-green-500 text-white font-black py-3 rounded-xl shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                                                >
                                                    {packOpening ? 'APERTURA...' : `COMPRA (${packCost} 🪙)`}
                                                </button>
                                            </div>
                                        </div>

                                        {/* SCAMBIO DOPPIONI */}
                                        <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-200 flex items-center justify-between">
                                            <div className="text-left">
                                                <span className="block font-black text-orange-600 text-sm">SCAMBIO DOPPIONI</span>
                                                <span className="text-xs font-bold text-gray-500">Hai {Math.max(progress.duplicates || 0, progress.duplicateStickers?.length || 0)}/5 doppioni</span>
                                            </div>
                                            <button 
                                                onClick={handleExchangePack}
                                                disabled={(Math.max(progress.duplicates || 0, progress.duplicateStickers?.length || 0) < 5) || packOpening}
                                                className="bg-orange-500 text-white font-black px-4 py-2 rounded-lg text-sm shadow-md disabled:opacity-50"
                                            >
                                                SCAMBIA
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ALBUM VIEW */}
                        {activeTab === 'ALBUM' && (
                            <div className="w-full h-full flex flex-col bg-gray-100">
                                {/* Album Selector */}
                                <div className="p-3 flex justify-center gap-2 bg-white border-b border-gray-200 shrink-0 shadow-sm">
                                    <button onClick={() => setViewingAlbum(1)} className={`px-4 py-1 rounded-full font-black text-xs uppercase border-2 ${viewingAlbum === 1 ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>Volume 1</button>
                                    <button onClick={() => setViewingAlbum(2)} disabled={maxUnlockedAlbum < 2} className={`px-4 py-1 rounded-full font-black text-xs uppercase border-2 flex items-center gap-1 ${viewingAlbum === 2 ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
                                        {maxUnlockedAlbum < 2 && <Lock size={10} />} Volume 2
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 pb-20">
                                        {activeCollection.map((sticker) => (
                                            <div 
                                                key={sticker.id} 
                                                onClick={() => { if(progress.unlockedStickers.includes(sticker.id)) setZoomedSticker(sticker); }}
                                                className="cursor-pointer"
                                            >
                                                <StickerCard sticker={sticker} isOwned={progress.unlockedStickers.includes(sticker.id)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PASSPORT VIEW */}
                        {activeTab === 'PASSPORT' && (
                            <div className="w-full h-full flex flex-col items-center p-4 gap-4 overflow-hidden relative">
                                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                                
                                {/* Preview Card Container - Centered and Responsive */}
                                <div className="flex-1 w-full flex items-center justify-center min-h-0 relative py-2">
                                    <div className={`relative shadow-2xl rounded-xl border-4 border-white overflow-hidden group flex justify-center items-center`}>
                                        
                                        {/* Background Image */}
                                        <img src={currentCardBg} className="block w-auto h-auto max-w-full max-h-[50vh] md:max-h-[55vh] object-contain pointer-events-none" alt="Card Background" />
                                        
                                        {/* Overlay Content */}
                                        <div className="absolute inset-0">
                                            
                                            {/* AVATAR RENDER (SVG Overlay) */}
                                            {tempAvatarImage ? (
                                                <div 
                                                    style={{
                                                        position: 'absolute',
                                                        top: `${FINAL_LAYOUT.photo.y}%`,
                                                        left: `${FINAL_LAYOUT.photo.x}%`,
                                                        width: '25%', 
                                                        transform: `scale(${FINAL_LAYOUT.photo.scale})`,
                                                        transformOrigin: 'top left',
                                                        zIndex: 1
                                                    }}
                                                >
                                                    <img 
                                                        src={tempAvatarImage} 
                                                        alt="User Avatar" 
                                                        className="w-full h-auto object-contain drop-shadow-md"
                                                    />
                                                </div>
                                            ) : (
                                                <div 
                                                    style={{
                                                        position: 'absolute',
                                                        top: `${FINAL_LAYOUT.photo.y}%`,
                                                        left: `${FINAL_LAYOUT.photo.x}%`,
                                                        width: '25%', 
                                                        height: '42%',
                                                        transform: `scale(${FINAL_LAYOUT.photo.scale})`,
                                                        transformOrigin: 'top left',
                                                        zIndex: 1,
                                                        backgroundColor: '#e5e7eb',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '8px',
                                                        border: '4px solid #9ca3af'
                                                    }}
                                                >
                                                    <User size={64} className="text-gray-400" />
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md animate-pulse">
                                                        <HelpCircle size={16} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* TEXT FIELDS */}
                                            <div style={{ position: 'absolute', top: `${FINAL_LAYOUT.name.y}%`, left: `${FINAL_LAYOUT.name.x}%`, zIndex: 10 }}>
                                                <span className="text-white font-black whitespace-nowrap drop-shadow-md" style={{ fontSize: 'clamp(14px, 4vw, 32px)', lineHeight: 1 }}>{progress.playerName || "NOME"}</span>
                                            </div>
                                            <div style={{ position: 'absolute', top: `${FINAL_LAYOUT.date.y}%`, left: `${FINAL_LAYOUT.date.x}%`, zIndex: 10 }}>
                                                <span className="text-white font-bold whitespace-nowrap drop-shadow-md" style={{ fontSize: 'clamp(10px, 2.5vw, 20px)' }}>{new Date().toLocaleDateString('it-IT')}</span>
                                            </div>
                                            <div style={{ position: 'absolute', top: `${FINAL_LAYOUT.time.y}%`, left: `${FINAL_LAYOUT.time.x}%`, zIndex: 10 }}>
                                                <span className="text-white font-bold whitespace-nowrap drop-shadow-md" style={{ fontSize: 'clamp(10px, 2.5vw, 20px)' }}>{new Date().toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="w-full max-w-[500px] flex flex-col gap-2 shrink-0 pb-4">
                                    <button 
                                        onClick={() => setIsAvatarCreatorOpen(true)}
                                        className="bg-yellow-400 text-black font-black text-lg py-3 rounded-xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2 hover:brightness-110"
                                    >
                                        <Smile size={24} strokeWidth={2.5} /> {tempAvatarImage ? "MODIFICA AVATAR" : "CREA AVATAR"}
                                    </button>
                                    
                                    <button 
                                        onClick={generateAndDownloadCard}
                                        disabled={isGeneratingImg || !tempAvatarImage}
                                        className={`w-full text-white font-black text-xl py-3 rounded-xl border-b-4 hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${isBoy ? 'bg-cyan-500 border-cyan-700' : 'bg-pink-500 border-pink-700'}`}
                                    >
                                        {isGeneratingImg ? <ArrowRight className="animate-spin" /> : (isMobileDevice ? <Share size={24} strokeWidth={3} /> : <Download size={24} strokeWidth={3} />)}
                                        {isGeneratingImg ? 'SALVATAGGIO...' : (isMobileDevice ? 'SALVA LA FOTO JPG NEL RULLINO FOTO' : 'SALVA NEL DOWNLOAD')}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* AVATAR CREATOR MODAL */}
            {isAvatarCreatorOpen && (
                <AvatarCreator 
                    initialConfig={progress.avatarConfig}
                    onSave={handleSaveAvatar}
                    onClose={() => setIsAvatarCreatorOpen(false)}
                />
            )}

            {/* SCANNER MODAL */}
            {isScannerOpen && (
                <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-in fade-in">
                    <div className="relative w-full max-w-lg aspect-[3/4] bg-black">
                        <video ref={videoRef} className="w-full h-full object-cover" />
                        <canvas ref={scannerCanvasRef} className="hidden" />
                        <div className="absolute inset-0 border-4 border-white/30 m-8 rounded-3xl pointer-events-none flex flex-col items-center justify-center">
                            <ScanLine className="text-red-500 w-full h-1/2 animate-pulse opacity-50" />
                            <p className="bg-black/50 text-white px-2 py-1 rounded mt-4 font-bold text-sm">INQUADRA IL QR CODE</p>
                        </div>
                        <button onClick={stopScanner} className="absolute top-4 right-4 bg-white text-black p-3 rounded-full shadow-lg z-50 hover:bg-gray-200"><X size={24} /></button>
                    </div>
                </div>
            )}
            
            {/* STICKER ZOOM MODAL */}
            {zoomedSticker && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in duration-300" onClick={() => setZoomedSticker(null)}>
                    <div className="relative w-full max-w-[280px]" onClick={e => e.stopPropagation()}>
                        <button className="absolute -top-12 right-0 bg-red-500 text-white p-2 rounded-full border-2 border-white hover:scale-110 active:scale-95 transition-transform shadow-[0_0_15px_rgba(255,0,0,0.5)] z-50" onClick={() => setZoomedSticker(null)}><X size={24} strokeWidth={3} /></button>
                        <div className="aspect-[3/4] w-full transform transition-transform hover:scale-[1.02] duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden"><StickerCard sticker={zoomedSticker} isOwned={true} showDetails={true} /></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Newsstand;
