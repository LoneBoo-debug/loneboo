
import React, { useState, useEffect } from 'react';

// Default config types
export interface AvatarPartConfig {
    top: number;
    left: number;
    scale: number;
    rotate?: number;
}

export interface AvatarConfig {
    mouth: AvatarPartConfig;
    eyes: AvatarPartConfig;       // Occhi Aperti
    eyesClosed: AvatarPartConfig; // Occhi Chiusi
    eyesThinking: AvatarPartConfig; // Occhi Pensa (Nuovo)
    armDx: AvatarPartConfig;
    armSx: AvatarPartConfig;
}

interface AvatarBooProps {
    isTalking: boolean;
    config: AvatarConfig;
    isStatic?: boolean; // Freeze animations
    forceBlink?: boolean; // Force closed eyes state (for calibration)
    forceOpenMouth?: boolean; // Force open mouth state (for calibration)
    overrideEyes?: string; // Custom image URL for eyes (e.g. looking up)
}

export const AVATAR_IMAGES = {
    body: 'https://i.postimg.cc/LskSSMJR/body.png',
    eyesOpen: 'https://i.postimg.cc/d1vqZVzN/Hailuo-Image-fffdi-questo-fantasmino-creami-du-4549ddd4646ddd7164590080.png',
    eyesClosed: 'https://i.postimg.cc/MZd9BW38/Hailuo-Image-di-questo-fantasmino-creami-du-45494dddddd6467164590080.png',
    mouthOpen: 'https://i.postimg.cc/KcHwmhWR/Immagine-2025-12-10-2ss00842-(1).png',
    mouthClosed: 'https://i.postimg.cc/1360vPBq/close.png',
    armSx: 'https://i.postimg.cc/tTrFsgRQ/dx-hand.png',
    armDx: 'https://i.postimg.cc/4xztzP4m/sx-hand.png'
};

const AvatarBoo: React.FC<AvatarBooProps> = ({ isTalking, config, isStatic = false, forceBlink = false, forceOpenMouth = false, overrideEyes }) => {
    const [blink, setBlink] = useState(false);
    const [mouthState, setMouthState] = useState<'OPEN' | 'CLOSED'>('CLOSED');
    
    // --- NATURAL ANIMATION STATES ---
    // Body Movement: Mix of Scaling (Proximity) and Floating (Vertical)
    const [bodyAnim, setBodyAnim] = useState({ scale: true, float: true });
    
    // Arm Movement: SYNC (Parallel) vs ASYNC (Alternating)
    const [armSync, setArmSync] = useState<'SYNC' | 'ASYNC'>('SYNC');

    // --- BLINKING LOOP ---
    useEffect(() => {
        if (isStatic || forceBlink || overrideEyes) {
            setBlink(false);
            return;
        }
        const blinkLoop = () => {
            setBlink(true);
            setTimeout(() => {
                setBlink(false);
                const nextBlink = Math.random() * 3000 + 3000;
                timeoutId = setTimeout(blinkLoop, nextBlink);
            }, 200);
        };

        let timeoutId = setTimeout(blinkLoop, 3000);
        return () => clearTimeout(timeoutId);
    }, [isStatic, forceBlink, overrideEyes]);

    // --- TALKING LOOP ---
    useEffect(() => {
        if (forceOpenMouth) {
            setMouthState('OPEN');
            return;
        }
        if (isStatic) {
            setMouthState('CLOSED');
            return;
        }
        if (isTalking) {
            const talkLoop = setInterval(() => {
                const randomState = Math.random() > 0.3 ? 'OPEN' : 'CLOSED';
                setMouthState(prev => prev === 'OPEN' ? 'CLOSED' : 'OPEN');
            }, 120);
            return () => clearInterval(talkLoop);
        } else {
            setMouthState('CLOSED');
        }
    }, [isTalking, isStatic, forceOpenMouth]);

    // --- BODY RANDOM MOVEMENT LOOP ---
    useEffect(() => {
        if (isStatic) return;

        const cycleBody = () => {
            const rand = Math.random();
            // 40% Both, 25% Just Float, 25% Just Scale, 10% Still
            if (rand < 0.40) setBodyAnim({ scale: true, float: true });
            else if (rand < 0.65) setBodyAnim({ scale: false, float: true });
            else if (rand < 0.90) setBodyAnim({ scale: true, float: false });
            else setBodyAnim({ scale: false, float: false }); // Brief pause

            const nextDuration = Math.random() * 5000 + 4000; // Change every 4-9 seconds
            timeoutId = setTimeout(cycleBody, nextDuration);
        };

        let timeoutId = setTimeout(cycleBody, 2000);
        return () => clearTimeout(timeoutId);
    }, [isStatic]);

    // --- ARM SYNC RANDOM LOOP ---
    useEffect(() => {
        if (isStatic) return;

        const cycleArms = () => {
            // Switch between moving together or moving opposite
            setArmSync(prev => prev === 'SYNC' ? 'ASYNC' : 'SYNC');
            
            const nextDuration = Math.random() * 4000 + 3000; // Change every 3-7 seconds
            timeoutId = setTimeout(cycleArms, nextDuration);
        };

        let timeoutId = setTimeout(cycleArms, 3000);
        return () => clearTimeout(timeoutId);
    }, [isStatic]);

    // Determine which eye config and image to use
    const showClosedEyes = forceBlink || blink;
    
    let currentEyeConfig = config.eyes;
    let currentEyeImage = AVATAR_IMAGES.eyesOpen;

    if (overrideEyes) {
        currentEyeImage = overrideEyes;
        if (overrideEyes === AVATAR_IMAGES.eyesOpen) {
            currentEyeConfig = config.eyes;
        } else {
            currentEyeConfig = config.eyesThinking;
        }
    } else if (showClosedEyes) {
        currentEyeConfig = config.eyesClosed;
        currentEyeImage = AVATAR_IMAGES.eyesClosed;
    }

    // Arm Animation Logic
    // If Async, we offset the delay of the right arm to make it opposite to the left
    const armLeftDelay = '0s';
    const armRightDelay = armSync === 'ASYNC' ? '-0.5s' : '0s'; // -0.5s starts the animation halfway through (assuming 1s duration)

    return (
        // OUTER WRAPPER: Handles Scaling (Coming Closer/Away)
        // Corrected Logic: If scale animation is OFF, fallback to static scale-[1.8] to prevent shrinking.
        <div className={`relative w-40 h-40 md:w-56 md:h-56 select-none pointer-events-none z-50 transition-transform duration-[2000ms] ease-in-out ${bodyAnim.scale && !isStatic ? 'animate-breathing-scale' : 'scale-[1.8]'}`}>
            
            {/* INNER WRAPPER: Handles Floating (Up/Down) - Separated to allow mix & match */}
            <div className={`w-full h-full relative transition-transform duration-[2000ms] ease-in-out ${bodyAnim.float && !isStatic ? 'animate-float' : ''}`}>

                {/* ARMS (Behind Body) */}
                {/* Arm SX (Visual Left) */}
                <div 
                    className="absolute origin-top-right"
                    style={{
                        top: `${config.armSx.top}%`,
                        left: `${config.armSx.left}%`,
                        width: '50%',
                        transform: `scale(${config.armSx.scale}) rotate(${config.armSx.rotate || 0}deg)`,
                        pointerEvents: 'none'
                    }}
                >
                    <img 
                        src={AVATAR_IMAGES.armSx} 
                        alt=""
                        className={`w-full h-auto origin-top-right ${!isStatic ? 'animate-wiggle' : ''}`}
                        style={{ animationDelay: armLeftDelay }}
                    />
                </div>

                {/* Arm DX (Visual Right) */}
                <div 
                    className="absolute origin-top-left"
                    style={{
                        top: `${config.armDx.top}%`,
                        left: `${config.armDx.left}%`,
                        width: '50%',
                        transform: `scale(${config.armDx.scale}) rotate(${config.armDx.rotate || 0}deg)`,
                        pointerEvents: 'none'
                    }}
                >
                    <img 
                        src={AVATAR_IMAGES.armDx} 
                        alt=""
                        className={`w-full h-auto origin-top-left ${!isStatic ? 'animate-wiggle' : ''}`}
                        style={{ animationDelay: armRightDelay }}
                    />
                </div>

                {/* MAIN BODY */}
                <img 
                    src={AVATAR_IMAGES.body} 
                    alt="Lone Boo"
                    className="absolute top-0 left-0 w-full h-full object-contain z-10"
                />

                {/* EYES */}
                <img 
                    src={currentEyeImage} 
                    alt=""
                    className="absolute z-20 object-contain"
                    style={{
                        top: `${currentEyeConfig.top}%`,
                        left: `${currentEyeConfig.left}%`,
                        transform: `scale(${currentEyeConfig.scale})`,
                        width: '100%'
                    }}
                />

                {/* MOUTH */}
                <img 
                    src={mouthState === 'OPEN' ? AVATAR_IMAGES.mouthOpen : AVATAR_IMAGES.mouthClosed} 
                    alt=""
                    className="absolute z-20 object-contain transition-opacity duration-75"
                    style={{
                        top: `${config.mouth.top}%`,
                        left: `${config.mouth.left}%`,
                        transform: `scale(${config.mouth.scale})`,
                        width: '20%' 
                    }}
                />
            </div>
        </div>
    );
};

export default AvatarBoo;
