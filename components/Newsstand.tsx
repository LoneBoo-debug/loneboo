
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ShoppingBag, Check, Lock, Star, Download, Settings, Move, ArrowRight, Upload, Camera, ScanLine, Copy, RotateCcw, Trash2, Smile, BookOpen, LogOut, Image as ImageIcon, User, HelpCircle, Share, AlertCircle, CheckCircle2, Calendar, ArrowLeftRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { STICKERS_COLLECTION, STICKERS_COLLECTION_VOL2 } from '../services/stickersDatabase';
import { getProgress, openPack, spendTokens, getPassportCode, restorePassport, saveSticker, addDuplicate, tradeDuplicates, setPlayerName, decodePassport, saveProgress, addTokens, upgradeToNextAlbum } from '../services/tokens';
import { PlayerProgress, Sticker, AppView } from '../types';
import { isNightTime } from '../services/weatherService';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

// =================================================================================================
// 🎵 AUDIO SYNTHESIS ENGINE
// =================================================================================================
let audioCtx: AudioContext | null = null;
const getAudioContext = () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
};

const playDrumRoll = (duration: number) => {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 800;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(1.0, now + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    noise.start(now); noise.stop(now + duration);
};

const playFanfare = () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [{ freq: 523.25, start: 0.0, dur: 0.1 }, { freq: 659.25, start: 0.1, dur: 0.1 }, { freq: 783.99, start: 0.2, dur: 0.1 }, { freq: 1046.50, start: 0.3, dur: 1.5 }];
    notes.forEach(n => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.type = 'sawtooth'; osc.frequency.value = n.freq;
        gain.gain.setValueAtTime(0, now + n.start);
        gain.gain.linearRampToValueAtTime(0.3, now + n.start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + n.start); osc.stop(now + n.start + n.dur);
    });
};

const CARD_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/card-passport.webp'; 
const NEWSSTAND_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/edicolenwesw3300ijfnd3.webp';
const NEWSSTAND_NIGHT_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/edicolanottesdaa.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const CITY_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fdre66yhg7y80opipoi+(1).webp';

const IMG_PACK_STANDARD = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pack-standard.webp';
const IMG_PACK_GOLD = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pack-gold.webp';
const IMG_CALENDAR_BANNER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/calendarnewstand33eqa.webp';

// Nuovi Asset Frecce
const BTN_ARROW_LEFT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/freccia%20sibnistraedicoly87yt5.png';
const BTN_ARROW_RIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frecciadestraedicolj97yht.png';

const StickerCard: React.FC<{ sticker: Sticker, isOwned: boolean, showDetails?: boolean, isNew?: boolean }> = ({ sticker, isOwned, showDetails = false, isNew = false }) => {
    const isImage = sticker.image.startsWith('http') || sticker.image.startsWith('/');
    const rarityColor = { 'COMMON': 'border-gray-200', 'RARE': 'border-blue-400', 'EPIC': 'border-purple-500', 'LEGENDARY': 'border-yellow-400' }[sticker.rarity];
    const bgFallback = { 'COMMON': 'bg-gray-100', 'RARE': 'bg-blue-50', 'EPIC': 'bg-purple-50', 'LEGENDARY': 'bg-yellow-50' }[sticker.rarity];
    return (
        <div className={`relative bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform duration-300 aspect-[3/4.2] ${isOwned || showDetails ? `border-4 ${rarityColor}` : 'border-4 border-gray-300 opacity-60 grayscale'}`}>
            <div className={`flex-1 w-full relative flex items-center justify-center overflow-hidden ${bgFallback}`}>
                {(isOwned || showDetails) ? (isImage ? <img src={sticker.image} alt={sticker.name} className="w-full h-full object-cover" /> : <span className="text-6xl">{sticker.image}</span>) : <Lock size={32} className="text-gray-400" />}
                {isNew && <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-br-lg z-10 animate-pulse">NUOVA!</div>}
            </div>
            <div className="h-[25%] bg-white border-t-2 border-gray-100 flex flex-col items-center justify-center p-1 text-center">
                <p className="font-black text-gray-800 text-[10px] md:text-xs uppercase truncate w-full">{sticker.name}</p>
            </div>
        </div>
    );
};

const Newsstand: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [now, setNow] = useState(new Date());
    const [activeTab, setActiveTab] = useState<'SHOP' | 'ALBUM' | 'PASSPORT'>('SHOP');
    const [progress, setProgress] = useState<PlayerProgress>(getProgress());
    const [packOpening, setPackOpening] = useState(false);
    const [tempSticker, setTempSticker] = useState<Sticker | null>(null);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [viewingAlbum, setViewingAlbum] = useState(progress.currentAlbum || 1);
    const [isGenerating, setIsGenerating] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const packCost = viewingAlbum === 2 ? 100 : 50;

    const currentBg = useMemo(() => {
        return isNightTime(now) ? NEWSSTAND_NIGHT_BG : NEWSSTAND_BG;
    }, [now]);

    useEffect(() => {
        const update = () => setProgress(getProgress());
        window.addEventListener('progressUpdated', update);
        
        // Aggiorna l'orario ogni minuto per gestire il cambio giorno/notte
        const timeInterval = setInterval(() => {
            setNow(new Date());
        }, 60000);

        return () => {
            window.removeEventListener('progressUpdated', update);
            clearInterval(timeInterval);
        };
    }, []);

    const scrollShop = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;
            const currentScroll = container.scrollLeft;
            const scrollStep = clientWidth; 

            if (direction === 'left') {
                // Se siamo all'inizio (o quasi), andiamo alla fine per simulare il loop
                if (currentScroll <= 20) {
                    container.scrollTo({ left: scrollWidth, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: -scrollStep, behavior: 'smooth' });
                }
            } else {
                // Se siamo alla fine (o quasi), torniamo all'inizio per simulare il loop
                if (currentScroll + clientWidth >= scrollWidth - 20) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: scrollStep, behavior: 'smooth' });
                }
            }
        }
    };

    const triggerPackAnimation = async (sticker: Sticker) => {
        playDrumRoll(3.0); setPackOpening(true); setTempSticker(null);
        await new Promise(resolve => setTimeout(resolve, 2500));
        setIsDuplicate(progress.unlockedStickers.includes(sticker.id));
        setTempSticker(sticker); setPackOpening(false); playFanfare();
    };

    const handleBuyPack = () => {
        if (progress.tokens >= packCost && !packOpening) {
            if (spendTokens(packCost)) triggerPackAnimation(openPack(viewingAlbum));
        }
    };

    const handleExchangePack = () => {
        const dupCount = Math.max(progress.duplicates || 0, progress.duplicateStickers?.length || 0);
        if (dupCount >= 5 && !packOpening) {
            if (tradeDuplicates()) triggerPackAnimation(openPack(viewingAlbum));
        }
    };

    /**
     * Metodo di caricamento immagine ottimizzato per bypassare problemi di cache/CORS
     */
    const loadSafeImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            if (!src.startsWith('data:')) {
                img.crossOrigin = "anonymous";
                img.src = src + (src.includes('?') ? '&' : '?') + "t=" + Date.now();
            } else {
                img.src = src;
            }
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Impossibile caricare l'immagine: ${src}`));
        });
    };

    const generateAndDownloadPassport = async () => {
        if (isGenerating) return;
        
        const passportData = getPassportCode();
        if (!passportData) {
            alert("Errore: Immagine non generabile. Prova a giocare ancora!");
            return;
        }

        setIsGenerating(true);

        try {
            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Canvas non trovato");
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Contesto 2D non disponibile");

            const bgImg = await loadSafeImage(CARD_BG);
            canvas.width = bgImg.width;
            canvas.height = bgImg.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bgImg, 0, 0);

            const qrDataUrl = await QRCode.toDataURL(passportData, {
                margin: 2,
                width: 600,
                errorCorrectionLevel: 'M',
                color: { dark: '#000000', light: '#ffffff' }
            });

            const qrImg = await loadSafeImage(qrDataUrl);
            const qrSize = Math.floor(canvas.width * 0.2);
            const qrX = Math.floor(canvas.width * 0.62);
            const qrY = Math.floor(canvas.height * 0.62);
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
            
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `tessera-magica-loneboo-${Date.now()}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Errore salvataggio:", err);
            alert("Ops! C'è stato un problema nel creare la tua tessera. Riprova!");
        } finally {
            setIsGenerating(false);
        }
    };

    /**
     * Gestisce l'upload dell'immagine del passaporto
     * Ottimizzato per evitare crash di memoria su dispositivi mobili
     */
    const handleUploadPassport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsGenerating(true); // Usiamo il loader anche per l'upload

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    if (!ctx) throw new Error("Errore inizializzazione canvas lettura");

                    // Rimpiccioliamo l'immagine se è troppo grande (> 1024px) 
                    // per evitare crash di memoria (schermata bianca)
                    const MAX_SIZE = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    const imageData = ctx.getImageData(0, 0, width, height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code && code.data) {
                        if (restorePassport(code.data)) {
                            alert("Bravissimo! Tutti i tuoi progressi sono stati recuperati! ✨");
                            // Invece di reload() che può fallire, forziamo l'aggiornamento dello stato
                            const newProgress = getProgress();
                            setProgress(newProgress);
                            setViewingAlbum(newProgress.currentAlbum || 1);
                            setActiveTab('ALBUM');
                        } else {
                            alert("Oh no! Questa immagine non sembra contenere una tessera magica valida.");
                        }
                    } else {
                        alert("Non ho trovato nessun codice magico in questa foto. Assicurati che il quadratino nero sia ben visibile!");
                    }
                } catch (err) {
                    console.error("Errore lettura tessera:", err);
                    alert("C'è stato un errore nel leggere la foto. Forse l'immagine è troppo pesante.");
                } finally {
                    setIsGenerating(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }
            };
            img.src = event.target?.result as string;
        };
        reader.onerror = () => {
            setIsGenerating(false);
            alert("Impossibile leggere il file selezionato.");
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed inset-0 z-0 bg-white flex flex-col animate-in fade-in pt-[64px] md:pt-[96px] overflow-hidden">
            <img src={currentBg} alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0" />

            {/* HEADER */}
            <div className="relative z-20 p-3 md:p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                    <button onClick={() => setView(AppView.PLAY)} className="hover:scale-105 active:scale-95 transition-transform"><img src={EXIT_BTN_IMG} alt="Torna" className="h-10 md:h-14" /></button>
                    <button onClick={() => setView(AppView.CITY_MAP)} className="hover:scale-110 active:scale-95 transition-all"><img src={CITY_BACK_IMG} alt="Città" className="h-10 md:h-14" /></button>
                </div>
                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white font-black text-sm border border-white/20 flex items-center gap-1 shadow-lg">
                    <span>{progress.tokens}</span> <span className="text-lg">🪙</span>
                </div>
            </div>

            {/* TABS */}
            <div className="relative z-30 flex bg-black/40 backdrop-blur-md p-1 shrink-0 gap-1 mx-2 rounded-2xl shadow-xl">
                {['SHOP', 'ALBUM', 'PASSPORT'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-inner' : 'text-white hover:bg-white/10'}`}>
                        {tab === 'SHOP' ? 'NEGOZIO' : (tab === 'PASSPORT' ? 'TESSERA' : tab)}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-hidden relative z-10 mt-2">
                {activeTab === 'SHOP' && (
                    <div className="w-full h-full relative flex items-center justify-center">
                        {tempSticker ? (
                            <div className="flex flex-col items-center animate-in zoom-in">
                                <div className="w-48 md:w-64 mb-4"><StickerCard sticker={tempSticker} isOwned={true} showDetails={true} isNew={!isDuplicate} /></div>
                                <h3 className="text-2xl font-black text-white drop-shadow-md mb-2 uppercase">{tempSticker.name}</h3>
                                <button onClick={() => { if(isDuplicate) addDuplicate(tempSticker.id); else saveSticker(tempSticker.id); setTempSticker(null); }} className="bg-green-500 text-white font-black py-3 px-8 rounded-full shadow-lg border-4 border-white uppercase">OK!</button>
                            </div>
                        ) : (
                            <div className="w-full h-full relative flex flex-col items-center justify-center">
                                {/* FRECCE LATERALI PERSONALIZZATE */}
                                <button 
                                    onClick={() => scrollShop('left')}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-50 transition-all active:scale-90 hover:scale-110 outline-none"
                                >
                                    <img src={BTN_ARROW_LEFT} alt="Sinistra" className="w-20 md:w-40 h-auto drop-shadow-2xl" />
                                </button>
                                <button 
                                    onClick={() => scrollShop('right')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-50 transition-all active:scale-90 hover:scale-110 outline-none"
                                >
                                    <img src={BTN_ARROW_RIGHT} alt="Destra" className="w-20 md:w-40 h-auto drop-shadow-2xl" />
                                </button>

                                <div ref={scrollRef} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth items-center">
                                    <div className="flex-shrink-0 w-full h-full snap-center flex flex-col items-center justify-center p-4">
                                        <div className="h-64 md:h-80 mb-6 flex items-center justify-center"><img src={viewingAlbum === 2 ? IMG_PACK_GOLD : IMG_PACK_STANDARD} className="h-full w-auto object-contain drop-shadow-2xl animate-float" alt="Pack" /></div>
                                        <h3 className="text-xl md:text-3xl font-black text-white drop-shadow-[2px_2px_0_black] uppercase mb-4">Pacchetto {viewingAlbum === 2 ? 'Gold' : 'Standard'}</h3>
                                        <button onClick={handleBuyPack} disabled={progress.tokens < packCost || packOpening} className="bg-green-500 text-white font-black py-4 px-10 rounded-2xl border-b-8 border-green-800 shadow-xl active:translate-y-1 active:border-b-0 transition-all disabled:opacity-50 text-xl">{packOpening ? 'APERTURA...' : `COMPRA ${packCost} 🪙`}</button>
                                    </div>
                                    <div className="flex-shrink-0 w-full h-full snap-center flex flex-col items-center justify-center p-4">
                                        <div className="h-64 md:h-80 mb-6 flex items-center justify-center"><img src={IMG_CALENDAR_BANNER} className="h-full w-auto object-contain drop-shadow-2xl" alt="Calendario" /></div>
                                        <h3 className="text-xl md:text-3xl font-black text-white drop-shadow-[2px_2px_0_black] uppercase mb-4">Calendario Magico</h3>
                                        <button onClick={() => setView(AppView.CALENDAR)} className="bg-blue-600 text-white font-black py-4 px-10 rounded-2xl border-b-8 border-blue-900 shadow-xl active:translate-y-1 active:border-b-0 transition-all text-xl">ENTRA 0 🪙</button>
                                    </div>
                                    <div className="flex-shrink-0 w-20"></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'ALBUM' && (
                    <div className="w-full h-full flex flex-col bg-transparent">
                        <div className="p-2 md:p-3 flex flex-wrap justify-center items-center gap-3 md:gap-6 bg-black/30 backdrop-blur-sm shrink-0 border-b border-white/10">
                            <div className="flex gap-2">
                                <button onClick={() => setViewingAlbum(1)} className={`px-4 py-1.5 rounded-full font-black text-xs uppercase border-2 transition-all ${viewingAlbum === 1 ? 'bg-blue-500 border-white text-white shadow-lg scale-105' : 'bg-white/10 border-white/30 text-white/60 hover:bg-white/20'}`}>Vol. 1</button>
                                <button onClick={() => setViewingAlbum(2)} disabled={progress.currentAlbum < 2} className={`px-4 py-1.5 rounded-full font-black text-xs uppercase border-2 transition-all ${viewingAlbum === 2 ? 'bg-yellow-500 border-white text-white shadow-lg scale-105' : 'bg-white/10 border-white/30 text-white/60 hover:bg-white/20'}`}>Vol. 2</button>
                            </div>
                            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border-2 border-orange-500/50 flex items-center gap-3 shadow-lg">
                                <div className="text-left leading-none"><span className="block font-black text-orange-400 text-[8px] md:text-[9px] uppercase mb-0.5">Scambio Doppioni</span><span className="text-[10px] font-bold text-white/80">{Math.max(progress.duplicates || 0, progress.duplicateStickers?.length || 0)}/5</span></div>
                                <button onClick={handleExchangePack} disabled={(Math.max(progress.duplicates || 0, progress.duplicateStickers?.length || 0) < 5) || packOpening} className="bg-orange-500 text-white font-black px-3 py-1 rounded-lg text-[9px] uppercase shadow-md active:scale-95 disabled:opacity-30 disabled:grayscale transition-all">{packOpening ? '...' : 'SCAMBIA'}</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 pb-20">
                                {(viewingAlbum === 2 ? STICKERS_COLLECTION_VOL2 : STICKERS_COLLECTION).map(s => <div key={s.id}><StickerCard sticker={s} isOwned={progress.unlockedStickers.includes(s.id)} /></div>)}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'PASSPORT' && (
                    <div className="w-full h-full flex flex-col items-center justify-start p-4 gap-2 overflow-hidden relative">
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                        
                        <div className="flex-1 w-full flex items-center justify-center min-h-0">
                            <div className="relative group">
                                <img src={CARD_BG} className="block w-auto h-auto max-w-full max-h-[45vh] md:max-h-[55vh] object-contain border-4 border-white rounded-2xl shadow-2xl" alt="Tessera" />
                                {isGenerating && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
                                        <Loader2 className="animate-spin text-blue-600" size={48} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/20 max-w-[500px] text-center mb-2 animate-in fade-in duration-500">
                            <p className="text-white font-bold text-xs md:text-sm leading-tight">Scarica la tua <span className="text-yellow-400">Tessera Magica</span> per mettere al sicuro gettoni e figurine! Se cambi telefono potrai recuperare tutto caricando l'immagine. 👻</p>
                        </div>

                        <div className="w-full max-w-[500px] flex gap-2 pb-24 px-4">
                            <label className="flex-1 bg-yellow-400 text-black font-black text-xs py-4 rounded-xl border-b-4 border-yellow-600 shadow-md flex items-center justify-center gap-2 uppercase cursor-pointer active:translate-y-1 active:border-b-0 transition-all">
                                <Upload size={18} /> Carica
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUploadPassport} />
                            </label>
                            <button onClick={generateAndDownloadPassport} disabled={isGenerating} className="flex-1 bg-cyan-500 text-white font-black text-xs py-4 rounded-xl border-b-4 border-cyan-700 shadow-xl flex items-center justify-center gap-2 uppercase active:translate-y-1 active:border-b-0 transition-all disabled:opacity-50">
                                <Download size={18} /> {isGenerating ? 'SALVO...' : 'Salva'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Newsstand;
