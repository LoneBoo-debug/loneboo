import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { CITY_MAP_IMAGE, CITY_MAP_IMAGE_MOBILE, MAP_LOCATIONS, OFFICIAL_LOGO } from '../constants';
import { LOCAL_ASSET_MAP } from '../services/LocalAssets';

interface CityMapProps {
    setView: (view: AppView) => void;
    lastView?: AppView | null;
}

const CityMap: React.FC<CityMapProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const imgDesktop = new Image();
        const imgMobile = new Image();
        
        let loadedCount = 0;
        const checkLoad = () => {
            loadedCount++;
            if (loadedCount >= 1) setIsLoaded(true);
        };

        imgDesktop.onload = checkLoad;
        imgMobile.onload = checkLoad;
        imgDesktop.onerror = checkLoad;
        imgMobile.onerror = checkLoad;

        imgDesktop.src = CITY_MAP_IMAGE;
        imgMobile.src = CITY_MAP_IMAGE_MOBILE;
        
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
        <div className="relative w-full h-[calc(100vh-68px)] md:h-[calc(100vh-106px)] bg-gradient-to-b from-[#b388f4] to-white overflow-hidden flex flex-col">
            <div className="relative flex-1 w-full h-full overflow-hidden">
                {!isLoaded && (
                    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-blue-300/95 backdrop-blur-md">
                        <img 
                            src={OFFICIAL_LOGO} 
                            alt="Caricamento..." 
                            className="w-32 h-32 object-contain animate-spin-horizontal mb-6" 
                            onError={(e) => {
                                e.currentTarget.src = 'https://i.postimg.cc/tCZGcq9V/official.png';
                            }}
                        />
                        <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">
                            Sto Caricando...
                        </span>
                    </div>
                )}

                <div className="hidden md:block w-full h-full relative overflow-hidden">
                    <div className="w-full h-full relative">
                        <img src={CITY_MAP_IMAGE} alt="Mappa Città" className={`w-full h-full object-fill object-center transition-opacity duration-500 select-none ${isLoaded ? 'opacity-100' : 'opacity-0'}`} draggable={false} onError={handleImageError} />
                        {isLoaded && (
                            <div className="absolute inset-0 w-full h-full pointer-events-none animate-in fade-in duration-500">
                                {MAP_LOCATIONS.map((loc) => (
                                    <button key={loc.id} onClick={(e) => { e.stopPropagation(); setView(loc.id); }} className="absolute transform -translate-x-1/2 -translate-y-[100%] group flex flex-col items-center transition-transform hover:scale-110 hover:-translate-y-[110%] z-20 origin-bottom cursor-pointer pointer-events-auto" style={{ top: loc.top, left: loc.left }}>
                                        <div className={`px-5 py-3 rounded-2xl border-4 border-black shadow-[0_4px_8px_rgba(0,0,0,0.3)] flex items-center justify-center whitespace-nowrap relative ${loc.color} ${loc.textDark ? 'text-black' : 'text-white'} transition-all duration-300`}>
                                            <span className="font-black text-xl uppercase tracking-wide drop-shadow-sm">{loc.label}</span>
                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-black"></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="block md:hidden w-full h-full relative overflow-hidden">
                    <div className="w-full h-full relative">
                        <img src={CITY_MAP_IMAGE_MOBILE} alt="Mappa Città Mobile" className={`w-full h-full object-fill object-center transition-opacity duration-500 select-none ${isLoaded ? 'opacity-100' : 'opacity-0'}`} draggable={false} onError={handleImageError} />
                        {isLoaded && (
                            <div className="absolute inset-0 w-full h-full pointer-events-none animate-in fade-in duration-500">
                                {MAP_LOCATIONS.map((loc) => (
                                    <button key={loc.id} onClick={(e) => { e.stopPropagation(); setView(loc.id); }} className="absolute transform -translate-x-1/2 -translate-y-[100%] group flex flex-col items-center z-20 origin-bottom cursor-pointer active:scale-95 transition-transform pointer-events-auto" style={{ top: loc.mobileTop, left: loc.mobileLeft }}>
                                        <div className={`px-3 py-1.5 rounded-xl border-2 border-black shadow-lg flex items-center justify-center whitespace-nowrap relative ${loc.color} ${loc.textDark ? 'text-black' : 'text-white'}`}>
                                            <span className="font-black text-xs uppercase tracking-wide drop-shadow-sm leading-none">{loc.label}</span>
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black"></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CityMap;