
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AppView } from '../../types';
import { HOUSE_ROOMS } from '../../constants';
import RobotHint from '../RobotHint';
import { preloadImages } from '../../services/imagePreloader';

// --- ASSET FISSI LAYOUT ---
const CONSTRUCTION_IMG = 'https://i.postimg.cc/13NBmSgd/vidu-image-3059119613071461-(1).png';
const ROOM_DECOR_IMG = 'https://i.postimg.cc/Y9wfF76h/arreddder.png';
const RETURN_HOUSE_BTN_IMG = 'https://i.postimg.cc/BQCK3D7t/rientragiu.png';

// TASTI NAVIGAZIONE SPECIFICI
const NAV_KITCHEN_LEFT_IMG = 'https://i.postimg.cc/Mp8f1HCL/salottosix.png';
const NAV_KITCHEN_RIGHT_IMG = 'https://i.postimg.cc/nVykrv1Y/camera-dx.png';
const NAV_LIVING_LEFT_IMG = 'https://i.postimg.cc/L5LjLbVf/cucinasx.png';
const NAV_LIVING_RIGHT_IMG = 'https://i.postimg.cc/pdsCL40Z/bagnodx.png';
const NAV_BATHROOM_LEFT_IMG = 'https://i.postimg.cc/LsWP7pQd/gardensx.png';
const NAV_BATHROOM_RIGHT_IMG = 'https://i.postimg.cc/KY1ktWGK/salottodx.png';
const NAV_BEDROOM_LEFT_IMG = 'https://i.postimg.cc/Mp8f1HCL/salottosix.png';
const NAV_BEDROOM_RIGHT_IMG = 'https://i.postimg.cc/y8PXL2zs/cucina-dx.png';

const ROOM_IMAGES_MOBILE: Record<string, string> = {
    [AppView.BOO_KITCHEN]: 'https://i.postimg.cc/bNw01THX/cucina1692-(1).jpg',
    [AppView.BOO_LIVING_ROOM]: 'https://i.postimg.cc/J41wZGh9/salotto1689.jpg',
    [AppView.BOO_BEDROOM]: 'https://i.postimg.cc/sxwjLq6j/stanzalettoh44.jpg',
    [AppView.BOO_BATHROOM]: 'https://i.postimg.cc/448VtJVN/bagnitt.jpg',
    [AppView.BOO_GARDEN]: 'https://i.postimg.cc/sX3m3PK4/giardinogarden.jpg',
};

const ROOM_IMAGES_DESKTOP: Record<string, string> = {
    [AppView.BOO_KITCHEN]: 'https://i.postimg.cc/tTtyjxgs/cuxdfr.jpg', 
    [AppView.BOO_LIVING_ROOM]: 'https://i.postimg.cc/59BWYLb2/salotttreer.jpg', 
    [AppView.BOO_BEDROOM]: 'https://i.postimg.cc/6pVR2HTG/stanzadaletto.jpg',
    [AppView.BOO_BATHROOM]: 'https://i.postimg.cc/cCGKGMks/bgno169.jpg',
    [AppView.BOO_GARDEN]: 'https://i.postimg.cc/sX3m3PK4/giardinogarden.jpg',
};

const ROOM_NAVIGATION: Record<string, { left?: { view: AppView; label: string }; right?: { view: AppView; label: string } }> = {
    [AppView.BOO_KITCHEN]: { left: { view: AppView.BOO_LIVING_ROOM, label: "SALOTTO" }, right: { view: AppView.BOO_BEDROOM, label: "CAMERA" } },
    [AppView.BOO_BEDROOM]: { left: { view: AppView.BOO_LIVING_ROOM, label: "SALOTTO" }, right: { view: AppView.BOO_KITCHEN, label: "CUCINA" } },
    [AppView.BOO_LIVING_ROOM]: { left: { view: AppView.BOO_KITCHEN, label: "CUCINA" }, right: { view: AppView.BOO_BATHROOM, label: "BAGNO" } },
    [AppView.BOO_BATHROOM]: { left: { view: AppView.BOO_GARDEN, label: "GIARDINO" }, right: { view: AppView.BOO_LIVING_ROOM, label: "SALOTTO" } },
    [AppView.BOO_GARDEN]: { left: { view: AppView.BOO_HOUSE, label: "MAPPA" } }
};

interface RoomLayoutProps {
    roomType: AppView;
    setView: (view: AppView) => void;
    children: React.ReactNode;
    hintMessage?: string;
    disableHint?: boolean;
}

const RoomLayout: React.FC<RoomLayoutProps> = ({ roomType, setView, children, hintMessage, disableHint = false }) => {
    const [showHint, setShowHint] = useState(false);
    const room = HOUSE_ROOMS.find(r => r.id === roomType);
    const navigation = ROOM_NAVIGATION[roomType];

    useEffect(() => {
        window.scrollTo(0, 0);
        if (navigation) {
            preloadImages([
                navigation.left ? ROOM_IMAGES_MOBILE[navigation.left.view] : undefined,
                navigation.right ? ROOM_IMAGES_MOBILE[navigation.right.view] : undefined
            ]);
        }
        
        if (!disableHint) {
            const timer = setTimeout(() => setShowHint(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [roomType, disableHint]);

    if (!room) return null;

    const bgMobile = ROOM_IMAGES_MOBILE[roomType];
    const bgDesktop = ROOM_IMAGES_DESKTOP[roomType];

    const getNavImg = (side: 'left' | 'right') => {
        if (side === 'left') {
            if (roomType === AppView.BOO_KITCHEN) return NAV_KITCHEN_LEFT_IMG;
            if (roomType === AppView.BOO_LIVING_ROOM) return NAV_LIVING_LEFT_IMG;
            if (roomType === AppView.BOO_BATHROOM) return NAV_BATHROOM_LEFT_IMG;
            if (roomType === AppView.BOO_BEDROOM) return NAV_BEDROOM_LEFT_IMG;
            if (roomType === AppView.BOO_GARDEN) return RETURN_HOUSE_BTN_IMG;
        } else {
            if (roomType === AppView.BOO_KITCHEN) return NAV_KITCHEN_RIGHT_IMG;
            if (roomType === AppView.BOO_LIVING_ROOM) return NAV_LIVING_RIGHT_IMG;
            if (roomType === AppView.BOO_BATHROOM) return NAV_BATHROOM_RIGHT_IMG;
            if (roomType === AppView.BOO_BEDROOM) return NAV_BEDROOM_RIGHT_IMG;
        }
        return null;
    };

    return (
        <div className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-black overflow-hidden flex flex-col animate-in fade-in" onClick={() => setShowHint(false)}>
            
            {!disableHint && (
                <RobotHint show={showHint} message={hintMessage || "TOCCA GLI OGGETTI EVIDENZIATI PER SCOPRIRLI"} variant="GHOST" />
            )}

            {/* BACKGROUNDS */}
            <div className="absolute inset-0 z-0">
                <img src={bgMobile} alt="" className="block md:hidden w-full h-full object-cover select-none" style={{ objectPosition: roomType === AppView.BOO_BATHROOM ? '70% center' : 'center' }} />
                <img src={bgDesktop} alt="" className="hidden md:block w-full h-full object-cover object-center select-none" />
            </div>

            {/* INTERACTIVE CONTENT (STANZA SPECIFICA) */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>

            {/* NAVIGATION */}
            {navigation && (
                <>
                    {navigation.left && (
                        <button onClick={() => setView(navigation.left!.view)} className="absolute top-4 left-4 z-30 hover:scale-105 active:scale-95 transition-transform">
                            <img src={getNavImg('left') || ''} alt={navigation.left.label} className="h-32 md:h-44 w-auto drop-shadow-md" />
                        </button>
                    )}
                    {navigation.right && (
                        <button onClick={() => setView(navigation.right!.view)} className="absolute top-4 right-4 z-30 hover:scale-105 active:scale-95 transition-transform">
                            <img src={getNavImg('right') || ''} alt={navigation.right.label} className="h-32 md:h-44 w-auto drop-shadow-md" />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default RoomLayout;
