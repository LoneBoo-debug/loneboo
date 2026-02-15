
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AppView } from '../../types';
import { HOUSE_ROOMS } from '../../constants';
import RobotHint from '../RobotHint';
import { preloadImages } from '../../services/imagePreloader';
import { isNightTime } from '../../services/weatherService';

// --- ASSET FISSI LAYOUT ---
const CONSTRUCTION_IMG = 'https://i.postimg.cc/13NBmSgd/vidu-image-3059119613071461-(1).png';
const ROOM_DECOR_IMG = 'https://i.postimg.cc/Y9wfF76h/arreddder.png';
const RETURN_HOUSE_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/wsqqa33.webp';

// TASTI NAVIGAZIONE SPECIFICI
const NAV_KITCHEN_LEFT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nav-to-living-sx.webp';
const NAV_KITCHEN_RIGHT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nav-to-bedroom-dx.webp';
const NAV_LIVING_LEFT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nav-to-kitchen-sx.webp';
const NAV_LIVING_RIGHT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nav-to-bathroom-dx.webp';
const NAV_BATHROOM_LEFT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nav-to-garden-sx.webp';
const NAV_BATHROOM_RIGHT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nav-to-living-dx.webp';
const NAV_BEDROOM_LEFT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nav-to-living-sx.webp';
const NAV_BEDROOM_RIGHT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nav-to-kitchen-dx.webp';

const ROOM_IMAGES_MOBILE: Record<string, string> = {
    [AppView.BOO_KITCHEN]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cucinadaytre.webp',
    [AppView.BOO_LIVING_ROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/salottosundaytrew.webp',
    [AppView.BOO_BEDROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lettocadaytre.webp',
    [AppView.BOO_BATHROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bagnoboogiornodie.webp',
    [AppView.BOO_GARDEN]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boohousemobiledefnewmao776gbs11.webp',
};

const ROOM_IMAGES_DESKTOP: Record<string, string> = {
    [AppView.BOO_KITCHEN]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cucinadaytre.webp', 
    [AppView.BOO_LIVING_ROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/salottosundaytrew.webp', 
    [AppView.BOO_BEDROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lettocadaytre.webp',
    [AppView.BOO_BATHROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bagnoboogiornodie.webp',
    [AppView.BOO_GARDEN]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boohousnewdesktopmversi87y33.webp',
};

const ROOM_NIGHT_IMAGES_MOBILE: Record<string, string> = {
    [AppView.BOO_BATHROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bagnoboonottenighte.webp',
    [AppView.BOO_LIVING_ROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/salottonightrewq.webp',
    [AppView.BOO_KITCHEN]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cucinanightrew.webp',
    [AppView.BOO_BEDROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lettocanightre.webp',
};

const ROOM_NIGHT_IMAGES_DESKTOP: Record<string, string> = {
    [AppView.BOO_BATHROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bagnoboonottenighte.webp',
    [AppView.BOO_LIVING_ROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/salottonightrewq.webp',
    [AppView.BOO_KITCHEN]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cucinanightrew.webp',
    [AppView.BOO_BEDROOM]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lettocanightre.webp',
};

const ROOM_NAVIGATION: Record<string, { left?: { view: AppView; label: string }; right?: { view: AppView; label: string } }> = {
    [AppView.BOO_KITCHEN]: { left: { view: AppView.BOO_LIVING_ROOM, label: "SALOTTO" }, right: { view: AppView.BOO_BEDROOM, label: "CAMERA" } },
    [AppView.BOO_BEDROOM]: { left: { view: AppView.BOO_LIVING_ROOM, label: "SALOTTO" }, right: { view: AppView.BOO_KITCHEN, label: "CUCINA" } },
    [AppView.BOO_LIVING_ROOM]: { left: { view: AppView.BOO_KITCHEN, label: "CUCINA" }, right: { view: AppView.BOO_BATHROOM, label: "BAGNO" } },
    [AppView.BOO_BATHROOM]: { left: { view: AppView.BOO_GARDEN, label: "GIARDINO" }, right: { view: AppView.BOO_LIVING_ROOM, label: "SALOTTO" } },
    [AppView.BOO_GARDEN]: {} 
};

interface RoomLayoutProps {
    roomType: AppView;
    setView: (view: AppView) => void;
    children: React.ReactNode;
    hintMessage?: string;
    disableHint?: boolean;
    hintVariant?: 'ROBOT' | 'GHOST' | 'GREEN' | 'PURPLE' | 'YELLOW';
}

const RoomLayout: React.FC<RoomLayoutProps> = ({ roomType, setView, children, hintMessage, disableHint = false, hintVariant = 'GHOST' }) => {
    const [now, setNow] = useState(new Date());
    const [showHint, setShowHint] = useState(false);
    
    const isNight = useMemo(() => isNightTime(now), [now]);

    const room = HOUSE_ROOMS.find(r => r.id === roomType);
    const navigation = ROOM_NAVIGATION[roomType];

    const currentBgMobile = useMemo(() => {
        if (isNight && ROOM_NIGHT_IMAGES_MOBILE[roomType]) return ROOM_NIGHT_IMAGES_MOBILE[roomType];
        return ROOM_IMAGES_MOBILE[roomType];
    }, [roomType, isNight]);

    const currentBgDesktop = useMemo(() => {
        if (isNight && ROOM_NIGHT_IMAGES_DESKTOP[roomType]) return ROOM_NIGHT_IMAGES_DESKTOP[roomType];
        return ROOM_IMAGES_DESKTOP[roomType];
    }, [roomType, isNight]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setInterval(() => setNow(new Date()), 60000);

        if (navigation) {
            preloadImages([
                navigation.left ? ROOM_IMAGES_MOBILE[navigation.left.view] : undefined,
                navigation.right ? ROOM_IMAGES_MOBILE[navigation.right.view] : undefined
            ]);
        }
        
        if (!disableHint) {
            const hintTimer = setTimeout(() => setShowHint(true), 1500);
            return () => {
                clearInterval(timer);
                clearTimeout(hintTimer);
            };
        }
        return () => clearInterval(timer);
    }, [roomType, disableHint, navigation]);

    if (!room) return null;

    const getNavImg = (side: 'left' | 'right') => {
        if (side === 'left') {
            if (roomType === AppView.BOO_KITCHEN) return NAV_KITCHEN_LEFT_IMG;
            if (roomType === AppView.BOO_LIVING_ROOM) return NAV_LIVING_LEFT_IMG;
            if (roomType === AppView.BOO_BATHROOM) return NAV_BATHROOM_LEFT_IMG;
            if (roomType === AppView.BOO_BEDROOM) return NAV_BEDROOM_LEFT_IMG;
        } else {
            if (roomType === AppView.BOO_KITCHEN) return NAV_KITCHEN_RIGHT_IMG;
            if (roomType === AppView.BOO_LIVING_ROOM) return NAV_LIVING_RIGHT_IMG;
            if (roomType === AppView.BOO_BATHROOM) return NAV_BATHROOM_RIGHT_IMG;
            if (roomType === AppView.BOO_BEDROOM) return NAV_BEDROOM_RIGHT_IMG;
            if (roomType === AppView.BOO_GARDEN) return RETURN_HOUSE_BTN_IMG;
        }
        return null;
    };

    const isGarden = roomType === AppView.BOO_GARDEN;

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-black overflow-hidden flex flex-col animate-in fade-in touch-none overscroll-none select-none" onClick={() => setShowHint(false)}>
            
            {!disableHint && (
                <RobotHint show={showHint} message={hintMessage || "TOCCA GLI OGGETTI EVIDENZIATI PER SCOPRIRLI"} variant={hintVariant} />
            )}

            {/* BACKGROUNDS */}
            <div className="absolute inset-0 z-0">
                <img src={currentBgMobile} alt="" className="block md:hidden w-full h-full object-fill select-none" style={{ objectPosition: roomType === AppView.BOO_BATHROOM ? '70% center' : 'center' }} />
                <img src={currentBgDesktop} alt="" className="hidden md:block w-full h-full object-fill object-center select-none" />
            </div>

            {/* INTERACTIVE CONTENT (STANZA SPECIFICA) */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>

            {/* NAVIGATION */}
            {navigation && (
                <>
                    {navigation.left && (
                        <button 
                            onClick={() => setView(navigation.left!.view)} 
                            className={`z-30 hover:scale-105 active:scale-95 transition-transform absolute top-20 md:top-32 left-2 md:left-4`}
                        >
                            <img 
                                src={getNavImg('left') || ''} 
                                alt={navigation.left.label} 
                                className={`h-28 md:h-40 drop-shadow-md w-auto`} 
                            />
                        </button>
                    )}
                    {navigation.right && (
                        <button 
                            onClick={() => setView(navigation.right!.view)} 
                            className={`z-30 hover:scale-105 active:scale-95 transition-transform ${
                                isGarden 
                                ? "absolute top-[76%] right-[26%] translate-x-1/2 -translate-y-1/2" 
                                : "absolute top-20 md:top-32 right-2 md:right-4"
                            }`}
                        >
                            <img 
                                src={getNavImg('right') || ''} 
                                alt={navigation.right.label} 
                                className={`${
                                    isGarden 
                                    ? "h-64 md:h-84 drop-shadow-2xl" 
                                    : "h-28 md:h-40 drop-shadow-md"
                                } w-auto`} 
                            />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default RoomLayout;
