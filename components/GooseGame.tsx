import React, { useState } from 'react';

const BG_GAME_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/game-goose.webp';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

interface GooseGameProps {
    onBack: () => void;
}

const Dice3D: React.FC<{ value: number; isRolling: boolean; color: string }> = ({ value, isRolling, color }) => {
    // Rotazioni statiche per i risultati
    const rotations: Record<number, string> = {
        1: 'rotateX(0deg) rotateY(0deg)',
        2: 'rotateX(0deg) rotateY(-90deg)',
        3: 'rotateX(-90deg) rotateY(0deg)',
        4: 'rotateX(90deg) rotateY(0deg)',
        5: 'rotateX(0deg) rotateY(90deg)',
        6: 'rotateX(180deg) rotateY(0deg)',
    };

    return (
        <div className="dice-container">
            <div 
                className={`dice ${isRolling ? 'animate-rolling' : ''}`} 
                style={{ transform: !isRolling ? rotations[value] : undefined }}
            >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} className={`face face-${num} ${color}`}>
                        {Array.from({ length: num }).map((_, i) => (
                            <span key={i} className="dot"></span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

const GooseGame: React.FC<GooseGameProps> = ({ onBack }) => {
    const [dice1, setDice1] = useState(1);
    const [dice2, setDice2] = useState(6);
    const [isRolling, setIsRolling] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const rollDice = () => {
        if (isRolling) return;

        setIsRolling(true);
        setShowResult(false);

        // Simuliamo il tempo di lancio
        setTimeout(() => {
            const res1 = Math.floor(Math.random() * 6) + 1;
            const res2 = Math.floor(Math.random() * 6) + 1;
            
            setDice1(res1);
            setDice2(res2);
            setIsRolling(false);
            setShowResult(true);

            // Nascondi risultato dopo 3 secondi per permettere nuovo lancio
            setTimeout(() => {
                setShowResult(false);
            }, 3000);
        }, 1500);
    };

    return (
        <div 
            className="fixed inset-0 z-[95] bg-cover bg-center bg-no-repeat flex flex-col items-center overflow-hidden animate-in fade-in"
            style={{ backgroundImage: `url(${BG_GAME_URL})` }}
        >
            <style>{`
                @keyframes rolling {
                    0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
                    100% { transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg); }
                }
                .animate-rolling {
                    animation: rolling 0.5s linear infinite;
                }
                .scene {
                    perspective: 1000px;
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    justify-content: center;
                    height: 180px; /* Ridotta altezza per avvicinare il numero */
                }
                .dice-container {
                    width: 60px;
                    height: 60px;
                    position: relative;
                    transform-style: preserve-3d;
                }
                @media (min-width: 768px) {
                    .dice-container { width: 80px; height: 80px; }
                    .scene { gap: 40px; height: 220px; }
                }
                .dice {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    transform-style: preserve-3d;
                    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: white;
                    border: 2px solid rgba(0,0,0,0.1);
                    border-radius: 10px;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(3, 1fr);
                    padding: 10%;
                    backface-visibility: hidden;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
                }
                .face.red { background-color: #ef4444; border-color: #991b1b; }
                .face.blue { background-color: #3b82f6; border-color: #1e3a8a; }
                .dot {
                    width: 80%;
                    height: 80%;
                    background: white;
                    border-radius: 50%;
                    justify-self: center;
                    align-self: center;
                    box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
                }
                .face-1 { transform: translateZ(30px); }
                .face-2 { transform: rotateY(90deg) translateZ(30px); }
                .face-3 { transform: rotateX(90deg) translateZ(30px); }
                .face-4 { transform: rotateX(-90deg) translateZ(30px); }
                .face-5 { transform: rotateY(-90deg) translateZ(30px); }
                .face-6 { transform: rotateY(180deg) translateZ(30px); }
                @media (min-width: 768px) {
                    .face-1 { transform: translateZ(40px); }
                    .face-2 { transform: rotateY(90deg) translateZ(40px); }
                    .face-3 { transform: rotateX(90deg) translateZ(40px); }
                    .face-4 { transform: rotateX(-90deg) translateZ(40px); }
                    .face-5 { transform: rotateY(-90deg) translateZ(40px); }
                    .face-6 { transform: rotateY(180deg) translateZ(40px); }
                }
                .face-1 .dot { grid-area: 2 / 2; }
                .face-2 .dot:nth-child(1) { grid-area: 1 / 1; }
                .face-2 .dot:nth-child(2) { grid-area: 3 / 3; }
                .face-3 .dot:nth-child(1) { grid-area: 1 / 1; }
                .face-3 .dot:nth-child(2) { grid-area: 2 / 2; }
                .face-3 .dot:nth-child(3) { grid-area: 3 / 3; }
                .face-4 .dot:nth-child(1) { grid-area: 1 / 1; }
                .face-4 .dot:nth-child(2) { grid-area: 1 / 3; }
                .face-4 .dot:nth-child(3) { grid-area: 3 / 1; }
                .face-4 .dot:nth-child(4) { grid-area: 3 / 3; }
                .face-5 .dot:nth-child(1) { grid-area: 1 / 1; }
                .face-5 .dot:nth-child(2) { grid-area: 1 / 3; }
                .face-5 .dot:nth-child(3) { grid-area: 2 / 2; }
                .face-5 .dot:nth-child(4) { grid-area: 3 / 1; }
                .face-5 .dot:nth-child(5) { grid-area: 3 / 3; }
                .face-6 .dot:nth-child(1) { grid-area: 1 / 1; }
                .face-6 .dot:nth-child(2) { grid-area: 1 / 3; }
                .face-6 .dot:nth-child(3) { grid-area: 2 / 1; }
                .face-6 .dot:nth-child(4) { grid-area: 2 / 3; }
                .face-6 .dot:nth-child(5) { grid-area: 3 / 1; }
                .face-6 .dot:nth-child(6) { grid-area: 3 / 3; }
            `}</style>

            {/* TASTI SUPERIORI */}
            <div className="absolute top-28 left-0 right-0 px-4 flex justify-between items-start z-[100]">
                {/* COLONNA SINISTRA: SOLO LANCIO */}
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={rollDice}
                        disabled={isRolling}
                        className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-yellow-400 border-4 border-black shadow-[0_4px_0_0_#000] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center disabled:opacity-50 disabled:grayscale group"
                    >
                        <span className="font-luckiest text-black text-[9px] md:text-sm leading-tight uppercase text-center px-1 group-hover:scale-110 transition-transform">
                            Tira i <br/> dadi
                        </span>
                    </button>
                </div>

                {/* TASTO CHIUDI (DESTRA) */}
                <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none">
                    <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-24 h-auto drop-shadow-2xl" />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4">
                {(isRolling || showResult) && (
                    <div className="flex flex-col items-center animate-in zoom-in duration-300">
                        <div className="scene mb-2 md:mb-4"> {/* Margine ridotto per avvicinare il numero */}
                            <Dice3D value={dice1} isRolling={isRolling} color="red" />
                            <Dice3D value={dice2} isRolling={isRolling} color="blue" />
                        </div>

                        {/* RISULTATO SOLO NUMERO */}
                        {showResult && !isRolling && (
                            <div className="animate-in slide-in-from-top-4 duration-500">
                                <span 
                                    className="text-8xl md:text-[12rem] font-luckiest text-white uppercase drop-shadow-[0_10px_0_#000]"
                                    style={{ 
                                        WebkitTextStroke: '4px black',
                                        textShadow: '8px 8px 0px #000'
                                    }}
                                >
                                    {dice1 + dice2}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {!isRolling && !showResult && (
                    <div className="text-center animate-in fade-in">
                        <p className="font-luckiest text-3xl md:text-5xl text-white uppercase drop-shadow-lg" style={{ WebkitTextStroke: '2px black' }}>
                            Pronto a lanciare?
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GooseGame;