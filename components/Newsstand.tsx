import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, Check, Lock, Star, Download, Settings, Move, ArrowRight, Upload, Camera, ScanLine, Copy, RotateCcw, Trash2, Smile, BookOpen, LogOut, Image as ImageIcon, User, HelpCircle, Share, AlertCircle, CheckCircle2 } from 'lucide-react';
import { STICKERS_COLLECTION, STICKERS_COLLECTION_VOL2 } from '../services/stickersDatabase';
import { getProgress, openPack, spendTokens, getPassportCode, restorePassport, saveSticker, addDuplicate, tradeDuplicates, setPlayerName, decodePassport, saveProgress, addTokens, upgradeToNextAlbum } from '../services/tokens';
import { PlayerProgress, Sticker, AppView } from '../types';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

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

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(1.0, now + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start(now);
    noise.stop(now + duration);
};

const playFanfare = () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [
        { freq: 523.25, start: 0.0, dur: 0.1 }, 
        { freq: 659.25, start: 0.1, dur: 0.1 }, 
        { freq: 783.99, start: 0.2, dur: 0.1 }, 
        { freq: 1046.50, start: 0.3, dur: 1.5 } 
    ];

    notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = n.freq;
        gain.gain.setValueAtTime(0, now + n.start);
        gain.gain.linearRampToValueAtTime(0.3, now + n.start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur);
    });
};

const CARD_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/card-passport.webp'; 
const NEWSSTAND_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newsstandsf.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';

type Coords = { x: number, y: number };

type CardLayoutConfig = {
    qr: Coords;
    info: Coords;
};

// Layout ricalibrato per la nuova tessera card-passport.webp
const FINAL_LAYOUT: CardLayoutConfig = {
    qr: { x: 77.0, y: 58.0 }, 
    info: { x: 50.0, y: 92.0 } 
};

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

const ConfettiExplosion = () => {
    const particles = Array.from({ length: 60 }).map((_, i) => {
        const angle = Math.random() * 360;
        const velocity = 150 + Math.random() * 250; 
        const size = 6 + Math.random() * 8;
        const color = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#ec4899', '#ffffff'][Math.floor(Math.random() * 7)];
        const delay = Math.random() * 0.1;
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
    setView: (view: AppView) => void;
}

const Newsstand: React.FC<NewsstandProps> = ({ setView }) => {
    const [activeTab, setActiveTab] = useState<'SHOP' | 'ALBUM' | 'PASSPORT'>('SHOP');
    const [progress, setProgress] = useState<PlayerProgress>(getProgress());
    const [packOpening, setPackOpening] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);

    const maxUnlockedAlbum = progress.currentAlbum || 1;
    const [viewingAlbum, setViewingAlbum] = useState(maxUnlockedAlbum);
    const [isGeneratingImg, setIsGeneratingImg] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [tempSticker, setTempSticker] = useState<Sticker | null>(null);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [zoomedSticker, setZoomedSticker] = useState<Sticker | null>(null);

    const currentCardBg = CARD_BG;
    const packCost = viewingAlbum === 2 ? 100 : 50;
    const activeCollection = viewingAlbum === 2 ? STICKERS_COLLECTION_VOL2 : STICKERS_COLLECTION;

    useEffect(() => {
        setViewingAlbum(progress.currentAlbum || 1);
    }, [progress.currentAlbum]);

    useEffect(() => {
        const update = () => {
            const p = getProgress();
            setProgress(p);
        };
        window.addEventListener('progressUpdated', update);
        return () => window.removeEventListener('progressUpdated', update);
    }, []);

    const triggerPackAnimation = async (sticker: Sticker) => {
        playDrumRoll(3.0); 
        setPackOpening(true);
        setTempSticker(null);
        setShowConfetti(false);
        const minDelay = new Promise(resolve => setTimeout(resolve, 2500));
        const imageLoad = new Promise((resolve) => {
            const img = new Image(); img.src = sticker.image; img.onload = () => resolve(true); img.onerror = () => resolve(true);
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

    const handleCollect = () => { if (tempSticker) { saveSticker(tempSticker.id); setTempSticker(null); } };
    const handleDuplicate = () => { if (tempSticker) { addDuplicate(tempSticker.id); setTempSticker(null); } };

    const drawTextAt = (ctx: CanvasRenderingContext2D, text: string, xPercent: number, yPercent: number, canvasW: number, canvasH: number, color: string, fontSizePx: number, align: CanvasTextAlign = 'center') => {
        const x = (xPercent / 100) * canvasW; const y = (yPercent / 100) * canvasH;
        ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'top'; ctx.font = `bold ${fontSizePx}px Arial`;
        ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 4; ctx.fillText(text, x, y);
    };

    const generateAndDownloadCard = async () => {
        setIsGeneratingImg(true);
        const canvas = canvasRef.current; if (!canvas) { setIsGeneratingImg(false); return; }
        const ctx = canvas.getContext('2d'); if (!ctx) { setIsGeneratingImg(false); return; }
        const img = new Image(); img.crossOrigin = "Anonymous"; img.src = currentCardBg;
        await new Promise((resolve) => { img.onload = () => resolve(true); img.onerror = () => resolve(false); });
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const infoSize = canvas.height * 0.025; 
        const now = new Date(); 
        
        const code = getPassportCode();
        try {
            const qrUrl = await QRCode.toDataURL(code, { margin: 1, width: 512, color: { dark: '#312e81', light: '#ffffff' } });
            const qrImg = new Image(); qrImg.src = qrUrl; await new Promise((resolve) => { qrImg.onload = resolve; });
            
            // QR Code ricalibrato
            const qrSize = canvas.height * 0.28; 
            const qrX = (FINAL_LAYOUT.qr.x / 100) * canvas.width - (qrSize / 2); 
            const qrY = (FINAL_LAYOUT.qr.y / 100) * canvas.height - (qrSize / 2);
            
            ctx.fillStyle = "white"; 
            ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

            // Data e Ora in bianco su unica riga in basso
            const dateStr = now.toLocaleDateString('it-IT');
            const timeStr = now.toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'});
            drawTextAt(ctx, `SALVATAGGIO DEL ${dateStr} ALLE ORE ${timeStr}`, FINAL_LAYOUT.info.x, FINAL_LAYOUT.info.y, canvas.width, canvas.height, "#FFFFFF", infoSize, 'center');
        } catch (e) {}

        canvas.toBlob(async (blob) => {
            if (!blob) { setIsGeneratingImg(false); return; }
            const filename = `LONE-BOO-PASSPORT.jpg`;
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile && navigator.share && navigator.canShare) {
                const file = new File([blob], filename, { type: 'image/jpeg' });
                if (navigator.canShare({ files: [file] })) {
                    try { await navigator.share({ files: [file], title: 'Passaporto Lone Boo', text: 'Ecco il mio passaporto ufficiale di Lone Boo! 👻' }); setIsGeneratingImg(false); return; } catch (error) {}
                }
            }
            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            const link = document.createElement("a"); link.href = dataUrl; link.download = filename;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            setIsGeneratingImg(false);
        }, 'image/jpeg', 0.85);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (event.target?.result) {
                    const img = new Image(); img.src = event.target.result as string; await new Promise(r => img.onload = r);
                    const cvs = document.createElement('canvas'); cvs.width = img.width; cvs.height = img.height;
                    const ctxOk = cvs.getContext('2d');
                    if (ctxOk) {
                        ctxOk.drawImage(img, 0, 0);
                        const code = jsQR(ctxOk.getImageData(0, 0, cvs.width, cvs.height).data, cvs.width, cvs.height);
                        if (code && code.data) {
                            const decoded = decodePassport(code.data);
                            if (decoded && restorePassport(code.data)) {
                                setUploadStatus({ type: 'success', msg: 'Tessera caricata correttamente!' });
                                setProgress(getProgress());
                                setTimeout(() => setUploadStatus(null), 4000);
                            } else {
                                setUploadStatus({ type: 'error', msg: 'Codice tessera non valido.' });
                                setTimeout(() => setUploadStatus(null), 4000);
                            }
                        } else {
                            setUploadStatus({ type: 'error', msg: 'Non riesco a leggere la tessera!' });
                            setTimeout(() => setUploadStatus(null), 4000);
                        }
                    }
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <div className="fixed inset-0 z-0 bg-white flex flex-col animate-in fade-in pt-[64px] md:pt-[96px] overflow-hidden">
            <style>{`
                @keyframes confetti-blow { 0% { transform: translate(-50%, -50%) scale(0); opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(720deg); opacity: 0; } }
                @keyframes shake-hard { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
                .animate-pack-shake { animation: shake-hard 0.5s infinite; }
            `}</style>

            <img 
                src={NEWSSTAND_BG} 
                alt="" 
                className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0" 
                draggable={false}
            />

            {/* HEADER EDICOLA */}
            <div className="relative bg-transparent p-3 md:p-4 flex justify-between items-center z-20 shrink-0">
                {/* TASTO RITORNA AL PARCO (Coerente con altri minigiochi) */}
                <button
                    onClick={() => setView(AppView.PLAY)}
                    className="hover:scale-105 active:scale-95 transition-transform"
                >
                    <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-10 md:h-14 w-auto drop-shadow-md" />
                </button>

                {/* BOX GETTONI ALLINEATO A DESTRA */}
                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white font-black text-sm md:text-base border border-white/20 flex items-center gap-1 shadow-lg">
                    <span>{progress.tokens}</span> <span className="text-lg">🪙</span>
                </div>
            </div>

            {/* TABS */}
            <div className="flex bg-black/20 backdrop-blur-sm p-1 shrink-0 gap-1 overflow-x-auto z-10 border-y border-white/10">
                {['SHOP', 'ALBUM', 'PASSPORT'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-2 md:py-3 rounded-xl font-black text-xs md:text-sm uppercase tracking-wide transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-lg scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}>{tab === 'SHOP' ? 'NEGOZIO' : tab}</button>
                ))}
            </div>

            {/* CONTENUTO PRINCIPALE */}
            <div className="flex-1 bg-transparent overflow-hidden relative z-10">
                {activeTab === 'SHOP' && (
                    <div className="w-full h-full flex flex-col items-center justify-start md:justify-center p-4 gap-4 md:gap-6 animate-in slide-in-from-right">
                        {tempSticker ? (
                            <div className="flex flex-col items-center relative py-4">
                                {showConfetti && <ConfettiExplosion />}
                                <div className="mb-6 relative group animate-reveal-sticker">
                                    <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                    <div className="w-48 md:w-64"><StickerCard sticker={tempSticker} isOwned={true} showDetails={true} isNew={!isDuplicate} /></div>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2 uppercase">{tempSticker.name}</h3>
                                <div className={`px-4 py-1 rounded-full font-black text-sm uppercase mb-6 border-2 ${isDuplicate ? 'bg-orange-100 text-orange-600 border-orange-300' : 'bg-green-100 text-green-600 border-green-300'}`}>{isDuplicate ? 'DOPPIONE!' : 'NUOVA!'}</div>
                                <button onClick={isDuplicate ? handleDuplicate : handleCollect} className={`bg-${isDuplicate ? 'orange' : 'green'}-500 text-white font-black py-3 px-8 rounded-full text-lg shadow-lg border-4 border-white hover:scale-105 transition-transform flex items-center justify-center gap-2`}>{isDuplicate ? <Copy size={20} /> : <Check size={24} />} {isDuplicate ? 'AGGIUNGI AI DOPPIONI' : "METTI NELL'ALBUM"}</button>
                            </div>
                        ) : (
                            <div className="text-center max-w-md w-full relative flex flex-col items-center">
                                <div className="bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-[30px] shadow-2xl border-4 border-white/50 mb-4 relative overflow-visible group w-full">
                                    <img 
                                        src={viewingAlbum === 2 ? "https://loneboo-images.s3.eu-south-1.amazonaws.com/pack-gold.webp" : "https://loneboo-images.s3.eu-south-1.amazonaws.com/pack-standard.webp"} 
                                        alt="Pack" 
                                        className="w-44 h-44 md:w-64 md:h-64 object-contain mx-auto mb-2 drop-shadow-2xl transition-transform duration-300 group-hover:scale-105" 
                                    />
                                    <h3 className="text-xl md:text-2xl font-black text-blue-600 mb-1 uppercase">PACCHETTO {viewingAlbum === 2 ? 'GOLD' : 'STANDARD'}</h3>
                                    <button onClick={handleBuyPack} disabled={progress.tokens < packCost || packOpening} className="w-full bg-green-500 text-white font-black py-3 rounded-xl shadow-[0_4px_0_#15803d] active:translate-y-1 transition-all disabled:opacity-50 text-lg uppercase">{packOpening ? 'APERTURA...' : `COMPRA (${packCost} 🪙)`}</button>
                                </div>
                                <div className="bg-black/40 backdrop-blur-md p-3 md:p-4 rounded-2xl border-2 border-white/20 flex items-center justify-between shadow-xl w-full">
                                    <div className="text-left">
                                        <span className="block font-black text-orange-400 text-xs md:text-sm uppercase">SCAMBIO DOPPIONI</span>
                                        <span className="text-[10px] md:text-xs font-bold text-white/80">Hai {Math.max(progress.duplicates || 0, progress.duplicateStickers?.length || 0)}/5 doppioni</span>
                                    </div>
                                    <button onClick={handleExchangePack} disabled={(Math.max(progress.duplicates || 0, progress.duplicateStickers?.length || 0) < 5) || packOpening} className="bg-orange-500 text-white font-black px-4 py-2 rounded-lg text-xs md:text-sm shadow-md disabled:opacity-50 uppercase">SCAMBIA</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'ALBUM' && (
                    <div className="w-full h-full flex flex-col bg-transparent">
                        <div className="p-3 flex justify-center gap-2 bg-black/20 backdrop-blur-sm border-b border-white/10 shrink-0 shadow-sm">
                            <button onClick={() => setViewingAlbum(1)} className={`px-4 py-1 rounded-full font-black text-xs uppercase border-2 transition-all ${viewingAlbum === 1 ? 'bg-blue-500 border-white text-white shadow-lg' : 'bg-white/10 border-white/30 text-white/60'}`}>Volume 1</button>
                            <button onClick={() => setViewingAlbum(2)} disabled={maxUnlockedAlbum < 2} className={`px-4 py-1 rounded-full font-black text-xs uppercase border-2 flex items-center gap-1 transition-all ${viewingAlbum === 2 ? 'bg-yellow-500 border-white text-white shadow-lg' : 'bg-white/10 border-white/30 text-white/60 opacity-50'}`}>{maxUnlockedAlbum < 2 && <Lock size={10} />} Volume 2</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 pb-20">
                                {activeCollection.map((sticker) => (
                                    <div key={sticker.id} onClick={() => { if(progress.unlockedStickers.includes(sticker.id)) setZoomedSticker(sticker); }} className="cursor-pointer transition-transform hover:scale-105 active:scale-95"><StickerCard sticker={sticker} isOwned={progress.unlockedStickers.includes(sticker.id)} /></div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'PASSPORT' && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-8 overflow-hidden relative">
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                        
                        {/* ALERT STATUS OVERLAY */}
                        {uploadStatus && (
                            <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-sm p-4 rounded-3xl border-4 shadow-2xl animate-in slide-in-from-top-10 flex items-center gap-3 ${uploadStatus.type === 'success' ? 'bg-green-500 border-green-700 text-white' : 'bg-red-500 border-red-700 text-white'}`}>
                                {uploadStatus.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                                <span className="font-black text-sm md:text-lg uppercase leading-tight">{uploadStatus.msg}</span>
                            </div>
                        )}

                        <div className="flex-1 w-full flex items-center justify-center min-h-0 relative">
                            <div className="relative shadow-2xl rounded-xl border-4 border-white overflow-hidden flex justify-center items-center bg-white/20">
                                <img src={currentCardBg} className="block w-auto h-auto max-w-full max-h-[60vh] md:max-h-[65vh] object-contain pointer-events-none" alt="Tessera" />
                            </div>
                        </div>

                        {/* Pulsanti alzati ulteriormente con pb-24 */}
                        <div className="w-full max-w-[500px] flex flex-row gap-2 shrink-0 pb-24">
                            <label className="flex-1 bg-yellow-400 text-black font-black text-sm md:text-lg py-3 rounded-xl border-b-4 border-yellow-600 active:translate-y-1 shadow-md flex items-center justify-center gap-2 uppercase cursor-pointer">
                                <Upload size={20} /> CARICA TESSERA
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                            </label>
                            <button 
                                onClick={generateAndDownloadCard} 
                                disabled={isGeneratingImg} 
                                className="flex-1 bg-cyan-500 text-white font-black text-sm md:text-lg py-3 rounded-xl border-b-4 border-cyan-700 active:translate-y-1 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 uppercase"
                            >
                                {isGeneratingImg ? <ArrowRight className="animate-spin" size={20} /> : (isMobileDevice ? <Share size={20} /> : <Download size={20} />)} 
                                {isGeneratingImg ? '...' : 'SALVA TESSERA'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* POPUP ZOOM STICKER */}
            {zoomedSticker && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in" onClick={() => setZoomedSticker(null)}>
                    <div className="relative w-full max-w-[280px]" onClick={e => e.stopPropagation()}>
                        <button className="absolute -top-12 right-0 bg-red-500 text-white p-2 rounded-full border-2 border-white active:scale-95" onClick={() => setZoomedSticker(null)}><X size={24} /></button>
                        <div className="aspect-[3/4] w-full shadow-2xl rounded-2xl overflow-hidden"><StickerCard sticker={zoomedSticker} isOwned={true} showDetails={true} /></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Newsstand;