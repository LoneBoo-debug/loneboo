
import React, { useState, useEffect, useMemo } from 'react';
import { AppView } from '../types';
import { CITY_MAP_IMAGE, CITY_MAP_IMAGE_MOBILE, MAP_LOCATIONS, OFFICIAL_LOGO } from '../constants';
import { LOCAL_ASSET_MAP } from '../services/LocalAssets';

const NO_FROGO_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nofrogo.webp';
const NIGHT_MAP_IMAGE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/macityngh.webp';
const NIGHT_SHIFT_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nightshift.webp';

interface CityMapProps {
    setView: (view: AppView) => void;
    lastView?: AppView | null;
}

const CityMap: React.FC<CityMapProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showBubbles, setShowBubbles] = useState(true);
    const [isNight, setIsNight] = useState(false);

    const bubbleDelays = useMemo(() => {
        return MAP_LOCATIONS.map(() => `-${(Math.random() * 5).toFixed(2)}s`);
    }, []);

    useEffect(() => {
        const imgDesktop = new Image();
        const imgMobile = new Image();
        const imgNight = new Image();
        
        let loadedCount = 0;
        const checkLoad = () => {
            loadedCount++;
            if (loadedCount >= 2) setIsLoaded(true);
        };

        imgDesktop.onload = checkLoad;
        imgMobile.onload = checkLoad;
        imgNight.onload = checkLoad;
        imgDesktop.onerror = checkLoad;
        imgMobile.onerror = checkLoad;
        imgNight.onerror = checkLoad;

        imgDesktop.src = CITY_MAP_IMAGE;
        imgMobile.src = CITY_MAP_IMAGE_MOBILE;
        imgNight.src = NIGHT_MAP_IMAGE;
        
        window.scrollTo(0, 0);
        const timer = setTimeout(() => { if (!isLoaded) setIsLoaded(true); }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        const currentSrc = target.getAttribute('src') || '';
        const originalUrl = Object.keys(LOCAL_ASSET_MAP).find(key => LOCAL_ASSET_MAP[key] === currentSrc || (currentSrc.startsWith(window.location.origin) && currentSrc.endsWith(LOCAL_ASSET_MAP[key])));
        if (originalUrl && currentSrc !== originalUrl) { target.src = originalUrl; }
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-indigo-900 overflow-hidden touch-none overscroll-none select-none">
            <div className="relative w-full h-full overflow-hidden">
                
                {!isLoaded && (
                    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-blue-300/95 backdrop-blur-md">
                        <img 
                            src={OFFICIAL_LOGO} 
                            alt="Caricamento..." 
                            className="w-32 h-32 object-contain animate-spin-horizontal mb-6" 
                            onError={(e) => { e.currentTarget.src = 'https://i.postimg.cc/tCZGcq9V/official.png'; }}
                        />
                        <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Sto Caricando...</span>
                    </div>
                )}

                <div className="absolute inset-0 z-10 w-full h-full overflow-hidden pointer-events-none">
                    {/* Immagini Giorno */}
                    {!isNight && (
                        <>
                            <img 
                                src={CITY_MAP_IMAGE} 
                                alt="" 
                                className={`hidden md:block w-full h-full object-fill transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                            />
                            <img 
                                src={CITY_MAP_IMAGE_MOBILE} 
                                alt="" 
                                className={`block md:hidden w-full h-full object-fill transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                            />
                        </>
                    )}
                    {/* Immagine Notte */}
                    {isNight && (
                        <img 
                            src={NIGHT_MAP_IMAGE} 
                            alt="" 
                            className={`w-full h-full object-fill transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                </div>

                <div className={`absolute inset-0 z-30 w-full h-full pointer-events-none transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    {MAP_LOCATIONS.map((loc, idx) => {
                        // Logica Dimensioni Desktop
                        let dWidth = 'md:w-64';
                        if (loc.id === AppView.SOUNDS) dWidth = 'md:w-40';
                        else if ([AppView.VIDEOS, AppView.PLAY, AppView.AI_MAGIC].includes(loc.id)) dWidth = 'md:w-48';
                        else if (loc.id === AppView.SOCIALS) dWidth = 'md:w-48'; 
                        else if (loc.id === AppView.BOOKS) dWidth = 'md:w-56';
                        else if (loc.id === AppView.TALES) dWidth = 'md:w-52';
                        else if (loc.id === AppView.FANART) dWidth = 'md:w-52';
                        else if ([AppView.CHAT, AppView.COMMUNITY].includes(loc.id)) dWidth = 'md:w-56';

                        // Logica Dimensioni Mobile
                        let mWidth = 'w-32';
                        if (loc.id === AppView.SOUNDS) mWidth = 'w-20';
                        else if (loc.id === AppView.VIDEOS) mWidth = 'w-24';
                        else if ([AppView.PLAY, AppView.AI_MAGIC, AppView.COLORING].includes(loc.id)) mWidth = 'w-[100px]';
                        else if (loc.id === AppView.SOCIALS) mWidth = 'w-24'; 
                        else if (loc.id === AppView.BOOKS_LIST) mWidth = 'w-[85px]';
                        else if (loc.id === AppView.BOOKS) mWidth = 'w-[100px]';
                        else if (loc.id === AppView.TALES) mWidth = 'w-28';
                        else if (loc.id === AppView.FANART) mWidth = 'w-24';
                        else if ([AppView.CHAT, AppView.COMMUNITY].includes(loc.id)) mWidth = 'w-28';

                        return (
                            <button 
                                key={loc.id} 
                                onClick={(e) => { e.stopPropagation(); setView(loc.id); }} 
                                className="absolute transform -translate-x-1/2 -translate-y-[100%] group flex flex-col items-center z-30 origin-bottom cursor-pointer pointer-events-auto hover:scale-110 active:scale-95 transition-transform" 
                                style={{ 
                                    top: window.innerWidth < 768 ? loc.mobileTop : loc.top, 
                                    left: window.innerWidth < 768 ? loc.mobileLeft : loc.left 
                                }}
                            >
                                {loc.bubbleImg ? (
                                    <img 
                                        src={loc.bubbleImg} 
                                        alt={loc.label} 
                                        className={`${mWidth} ${dWidth} h-auto drop-shadow-xl animate-cloud-breath flex-shrink-0 max-w-none transition-opacity duration-500 ${showBubbles ? 'opacity-100' : 'opacity-0'}`} 
                                        style={{ animationDelay: bubbleDelays[idx] }}
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <div 
                                        className={`px-3 py-1.5 md:px-5 md:py-3 rounded-xl md:rounded-2xl border-2 md:border-4 border-black shadow-xl flex items-center justify-center whitespace-nowrap relative ${loc.color} ${loc.textDark ? 'text-black' : 'text-white'} animate-cloud-breath transition-opacity duration-500 ${showBubbles ? 'opacity-100' : 'opacity-0'}`}
                                        style={{ animationDelay: bubbleDelays[idx] }}
                                    >
                                        <span className="font-black text-[10px] md:text-xl uppercase tracking-wide drop-shadow-sm">{loc.label}</span>
                                        <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] md:border-l-[10px] border-l-transparent border-r-[6px] md:border-r-[10px] border-r-transparent border-t-[6px] md:border-t-[10px] border-t-black"></div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* PULSANTI DI CONTROLLO IN BASSO A SINISTRA (DISPOSTI IN COLONNA E ALZATI) */}
                {isLoaded && (
                    <div className="absolute bottom-12 left-6 z-[60] flex flex-col items-center gap-4">
                        {/* TOGGLE BUBBLES */}
                        <button 
                            onClick={() => setShowBubbles(!showBubbles)}
                            className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/50 shadow-2xl active:scale-90 transition-all overflow-hidden flex items-center justify-center hover:bg-white/40 group"
                            title={showBubbles ? "Nascondi Fumetti" : "Mostra Fumetti"}
                        >
                            <img 
                                src={NO_FROGO_IMG} 
                                alt="Toggle Bubbles" 
                                className={`w-full h-full object-cover transition-transform duration-300 ${!showBubbles ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`} 
                            />
                        </button>

                        {/* TOGGLE NIGHT MODE */}
                        <button 
                            onClick={() => setIsNight(!isNight)}
                            className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/50 shadow-2xl active:scale-90 transition-all overflow-hidden flex items-center justify-center hover:bg-white/40 group"
                            title={isNight ? "Passa al Giorno" : "Passa alla Notte"}
                        >
                            <img 
                                src={NIGHT_SHIFT_BTN} 
                                alt="Toggle Night Mode" 
                                className={`w-full h-full object-cover transition-transform duration-300 ${isNight ? 'brightness-125 scale-110' : 'grayscale group-hover:grayscale-0'}`} 
                            />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CityMap;
