import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppView } from '../types';
import { CARDS_DATABASE, CardAsset } from '../services/cardsDatabase';
import { X, Trophy, RotateCcw } from 'lucide-react';
import { addTokens } from '../services/tokens';

const BTN_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const TABLE_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sflibretre.webp';
const MODAL_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/solitaminiau.webp';
const BTN_START_GAME_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giocafread.webp';
const BTN_RULES_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/regolessxcsdse.webp';
const BTN_REFRESH_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ricominciaaa+(1).webp';
const HINT_LAMP_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lamphelpsolit.webp';

type GameState = 'START' | 'PLAYING' | 'WON';

const LibrarySolitario: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [gameState, setGameState] = useState<GameState>('START');
    const [deck, setDeck] = useState<CardAsset[]>([]);
    const [waste, setWaste] = useState<CardAsset[]>([]);
    const [foundations, setFoundations] = useState<Record<string, CardAsset[]>>({
        bastoni: [], denari: [], spade: [], coppe: []
    });
    const [tableau, setTableau] = useState<CardAsset[][]>([[], [], [], []]);
    const [showRules, setShowRules] = useState(false);
    const [isInitialDeal, setIsInitialDeal] = useState(true);
    const [showHintBox, setShowHintBox] = useState(false);

    const initGame = useCallback(() => {
        const fullDeck = [...CARDS_DATABASE.SCOPA.deck].sort(() => Math.random() - 0.5);
        
        const initialTableau: CardAsset[][] = [
            [fullDeck.pop()!],
            [fullDeck.pop()!],
            [fullDeck.pop()!],
            [fullDeck.pop()!]
        ];

        setDeck(fullDeck);
        setWaste([]);
        setFoundations({ bastoni: [], denari: [], spade: [], coppe: [] });
        setTableau(initialTableau);
        setGameState('PLAYING');
        setIsInitialDeal(true);
        setShowHintBox(false);
        setTimeout(() => setIsInitialDeal(false), 1000);
    }, []);

    // Chiudi il box suggerimenti ad ogni cambiamento di stato (mossa effettuata)
    useEffect(() => {
        setShowHintBox(false);
    }, [tableau, waste, foundations, deck]);

    const handleCardClick = (card: CardAsset, source: 'waste' | 'tableau' | 'foundation', colIdx?: number) => {
        if (gameState !== 'PLAYING') return;

        const suitBase = foundations[card.suit];
        if (card.value === suitBase.length + 1) {
            moveToFoundation(card, source, colIdx);
            return;
        }

        for (let i = 0; i < 4; i++) {
            if (i === colIdx && source === 'tableau') continue;
            const targetCol = tableau[i];
            if (targetCol.length > 0) {
                const topCard = targetCol[targetCol.length - 1];
                if (topCard.value === card.value + 1) {
                    moveToTableau(card, source, i, colIdx);
                    return;
                }
            }
        }

        for (let i = 0; i < 4; i++) {
            if (i === colIdx && source === 'tableau') continue;
            const targetCol = tableau[i];
            if (targetCol.length === 0) {
                moveToTableau(card, source, i, colIdx);
                return;
            }
        }
    };

    const moveToFoundation = (card: CardAsset, source: 'waste' | 'tableau' | 'foundation', colIdx?: number) => {
        setFoundations(prev => ({
            ...prev,
            [card.suit]: [...prev[card.suit], card]
        }));
        removeFromSource(source, colIdx);
        checkWin();
    };

    const moveToTableau = (card: CardAsset, source: 'waste' | 'tableau' | 'foundation', targetColIdx: number, sourceColIdx?: number) => {
        setTableau(prev => {
            const next = [...prev];
            next[targetColIdx] = [...next[targetColIdx], card];
            return next;
        });
        removeFromSource(source, sourceColIdx);
    };

    const removeFromSource = (source: 'waste' | 'tableau' | 'foundation', colIdx?: number) => {
        if (source === 'waste') {
            setWaste(prev => prev.slice(0, -1));
        } else if (source === 'tableau' && colIdx !== undefined) {
            setTableau(prev => {
                const next = [...prev];
                next[colIdx] = next[colIdx].slice(0, -1);
                return next;
            });
        }
    };

    const drawCard = () => {
        if (deck.length === 0) {
            if (waste.length === 0) return;
            setDeck([...waste].reverse());
            setWaste([]);
        } else {
            const next = [...deck];
            const drawn = next.pop()!;
            setDeck(next);
            setWaste(prev => [...prev, drawn]);
        }
    };

    const checkWin = () => {
        setFoundations(current => {
            const allComplete = Object.values(current).every((f: CardAsset[]) => f.length === 10);
            if (allComplete) {
                setTimeout(() => {
                    setGameState('WON');
                    addTokens(10);
                }, 500);
            }
            return current;
        });
    };

    // --- LOGICA SUGGERIMENTI OTTIMIZZATA ---
    const hint = useMemo(() => {
        if (gameState !== 'PLAYING') return null;

        const formatCardName = (card: CardAsset) => {
            const art = (card.value === 1 || card.value === 8) ? "l'" : "il ";
            const name = card.value === 1 ? "Asso" : card.value.toString();
            return `${art}${name} di ${card.suit}`;
        };

        // 1. Controlla se una carta può andare nelle basi
        const candidates = [
            ...(waste.length > 0 ? [{ card: waste[waste.length - 1], from: 'mazzo' }] : []),
            ...tableau.map((col, idx) => col.length > 0 ? { card: col[col.length - 1], from: `colonna ${idx + 1}`, colIdx: idx } : null).filter(Boolean)
        ];

        // @ts-ignore
        const toFoundation = candidates.find(c => c.card.value === foundations[c.card.suit].length + 1);
        if (toFoundation) {
            // @ts-ignore
            return `Metti ${formatCardName(toFoundation.card)} in alto! ✨`;
        }

        // 2. Controlla mosse nel tableau
        for (let i = 0; i < candidates.length; i++) {
            const c = candidates[i];
            if (!c) continue;

            // Se la carta è già in una colonna ed è già posizionata correttamente sotto la carta sopra di lei, non suggerire di spostarla in un'altra colonna
            // @ts-ignore
            if (c.from.includes('colonna')) {
                // @ts-ignore
                const col = tableau[c.colIdx];
                if (col.length > 1) {
                    const parent = col[col.length - 2];
                    // @ts-ignore
                    if (parent.value === c.card.value + 1) continue; 
                }
            }

            for (let j = 0; j < 4; j++) {
                // @ts-ignore
                if (c.from.includes('colonna') && c.colIdx === j) continue;
                const targetCol = tableau[j];
                if (targetCol.length > 0) {
                    const top = targetCol[targetCol.length - 1];
                    // @ts-ignore
                    if (top.value === c.card.value + 1) {
                        // @ts-ignore
                        return `Metti ${formatCardName(c.card)} sotto ${formatCardName(top)}!`;
                    }
                } else {
                    // Suggerisci colonna libera solo se la carta spostata libera qualcosa o se viene dal mazzo
                    // @ts-ignore
                    if (c.from === 'mazzo' || (c.from.includes('colonna') && tableau[c.colIdx].length > 1)) {
                         // @ts-ignore
                         return `Sposta ${formatCardName(c.card)} nella colonna libera!`;
                    }
                }
            }
        }

        // 3. Suggerisci di pescare
        if (deck.length > 0 || waste.length > 0) {
            return "Tocca il mazzo per cercare nuove carte! 🃏";
        }

        return "Non vedo più mosse... riprova con un nuovo gioco! 🔄";
    }, [gameState, deck, waste, foundations, tableau]);

    const rulesModal = (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowRules(false)}>
            <div className="bg-white rounded-[3rem] border-8 border-amber-600 p-8 w-full max-w-md shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowRules(false)} className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-90 transition-transform">
                    <X size={24} strokeWidth={4} />
                </button>
                <h3 className="text-3xl font-black text-amber-800 uppercase text-center mb-6 font-luckiest">Regole del Solitario</h3>
                <div className="space-y-4 text-gray-700 font-bold text-sm md:text-lg leading-snug">
                    <div className="flex gap-3"><span className="text-2xl">🏆</span><p>Metti le carte nelle <span className="text-blue-600">4 Basi</span> in alto, dall'Asso (1) al Re (10).</p></div>
                    <div className="flex gap-3"><span className="text-2xl">👇</span><p>Sul tavolo puoi impilare le carte in ordine decrescente (es. il 4 sul 5).</p></div>
                    <div className="flex gap-3"><span className="text-2xl">🃏</span><p>Tocca il mazzo se non hai più mosse!</p></div>
                </div>
                <button onClick={() => setShowRules(false)} className="mt-8 w-full bg-amber-600 text-white font-black py-4 rounded-2xl border-b-8 border-amber-800 active:translate-y-1 active:border-b-0 transition-all uppercase text-xl">HO CAPITO!</button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#1a472a] overflow-hidden touch-none overscroll-none select-none flex flex-col">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes card-deal { 0% { transform: translate(-200px, -200px) rotate(-20deg); opacity: 0; } 100% { transform: translate(0, 0) rotate(0); opacity: 1; } }
                .card-anim { animation: card-deal 0.3s ease-out forwards; }
                .text-cartoon-outline {
                    -webkit-text-stroke: 1.5px black;
                    text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
                }
                @keyframes slide-right {
                    0% { transform: translateX(-20px) scaleX(0); opacity: 0; }
                    100% { transform: translateX(0) scaleX(1); opacity: 1; }
                }
                .animate-slide-right {
                    animation: slide-right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    transform-origin: left center;
                }
            `}</style>

            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <img src={TABLE_BG} alt="" className="w-full h-full object-fill" />
            </div>

            {/* HEADER CONTROLS */}
            <div className="relative z-50 w-full p-2 h-[15vh] flex justify-between items-center shrink-0 pt-20 md:pt-28 pointer-events-none">
                <div className="pointer-events-auto">
                    <button onClick={() => setView(AppView.LIBRARY_CARDS)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                        <img src={BTN_BACK_IMG} alt="Chiudi" className="w-10 h-10 md:w-16 h-auto drop-shadow-2xl" />
                    </button>
                </div>
                <div className="flex gap-2 pointer-events-auto">
                    <button onClick={() => setShowRules(true)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                        <img src={BTN_RULES_IMG} alt="Regole" className="w-10 h-10 md:w-16 h-auto drop-shadow-xl" />
                    </button>
                    <button onClick={initGame} className="hover:scale-110 active:scale-95 transition-all outline-none">
                        <img src={BTN_REFRESH_IMG} alt="Ricomincia" className="w-10 h-10 md:w-16 h-auto drop-shadow-xl" />
                    </button>
                </div>
            </div>

            {/* MAIN GAME FIELD */}
            <div className="flex-1 flex flex-col items-center justify-start px-2 relative z-10 overflow-hidden pb-4">
                
                {/* 1. BASI IN ALTO */}
                <div className="w-full flex justify-center shrink-0 mb-4 mt-2">
                    <div className="flex gap-2 md:gap-4 px-2">
                        {['bastoni', 'denari', 'spade', 'coppe'].map(suit => {
                            const suitCards = foundations[suit];
                            const topCard = suitCards.length > 0 ? suitCards[suitCards.length-1] : null;
                            return (
                                <div key={suit} className="w-16 h-24 md:w-28 md:h-44 relative">
                                    {topCard && (
                                        <div className="absolute inset-0 z-10 shadow-lg rounded-lg overflow-hidden bg-white border border-gray-200 animate-in zoom-in duration-200">
                                            <img src={topCard.image} className="w-full h-full object-fill scale-x-[0.92]" alt="" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. MAZZO E SCARTO AL CENTRO */}
                <div className="w-full flex justify-center shrink-0 mb-6">
                    <div className="flex gap-4 md:gap-12 items-center">
                        <button onClick={drawCard} className={`w-16 h-24 md:w-28 md:h-44 rounded-xl shadow-2xl overflow-hidden transition-all ${deck.length > 0 ? 'hover:scale-105 active:scale-95' : 'opacity-0 pointer-events-none'}`}>
                            {deck.length > 0 && (
                                <img src={CARDS_DATABASE.SCOPA.back} className="w-full h-full object-fill scale-x-[0.92]" alt="Deck" />
                            )}
                        </button>
                        <div className="w-16 h-24 md:w-28 md:h-44 relative">
                            {waste.length > 0 && (
                                <div 
                                    key={waste[waste.length-1].id}
                                    onClick={() => handleCardClick(waste[waste.length-1], 'waste')}
                                    className="absolute inset-0 cursor-pointer hover:scale-105 transition-transform"
                                >
                                    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-xl border border-gray-200 animate-in zoom-in duration-150">
                                        <img src={waste[waste.length-1].image} className="w-full h-full object-fill scale-x-[0.92]" alt="" />
                                    </div>
                                </div>
                            )}
                        </div>
                        {deck.length === 0 && waste.length > 0 && (
                             <button onClick={drawCard} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95">
                                <RotateCcw size={20} />
                             </button>
                        )}
                    </div>
                </div>

                {/* 3. TAVOLO (4 COLONNE) */}
                <div className="w-full max-w-4xl mx-auto flex justify-center gap-4 md:gap-10 px-2 items-start mt-2 overflow-visible flex-1">
                    {tableau.map((col, colIdx) => (
                        <div key={colIdx} className="w-16 md:w-28 flex flex-col items-center relative overflow-visible">
                            {col.map((card, cardIdx) => {
                                const isLast = cardIdx === col.length - 1;
                                const overlapMargin = cardIdx === 0 ? '0px' : '-110%';
                                
                                return (
                                    <div 
                                        key={card.id}
                                        onClick={() => isLast && handleCardClick(card, 'tableau', colIdx)}
                                        className={`
                                            relative w-full aspect-[3/4.2] shrink-0 transition-all duration-300
                                            ${isLast ? 'cursor-pointer hover:translate-y-[-10px] z-40' : 'z-10'}
                                        `}
                                        style={{ 
                                            marginTop: overlapMargin,
                                            animation: isInitialDeal ? `card-deal 0.3s ease-out forwards ${colIdx * 0.1 + cardIdx * 0.05}s` : 'none'
                                        }}
                                    >
                                        <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-xl border-2 border-white">
                                            <img src={card.image} className="w-full h-full object-fill scale-x-[0.92]" alt="" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- NUOVO SISTEMA SUGGERIMENTI INTERATTIVO --- */}
            {gameState === 'PLAYING' && hint && (
                <div className="fixed bottom-10 left-6 right-6 z-[100] flex items-center gap-4 pointer-events-none">
                    {/* LAMPADINA CLICCABILE */}
                    <button 
                        onClick={() => setShowHintBox(!showHintBox)}
                        className="pointer-events-auto shrink-0 transition-transform active:scale-90 hover:scale-110"
                    >
                        <img 
                            src={HINT_LAMP_IMG} 
                            alt="Suggerimento" 
                            className="w-16 h-16 md:w-24 md:h-24 drop-shadow-xl" 
                        />
                    </button>

                    {/* BOX TESTO TRASLUCIDO CON ANIMAZIONE SLIDE */}
                    {showHintBox && (
                        <div className="bg-black/40 backdrop-blur-xl rounded-[2.5rem] border-4 border-white/30 p-4 md:p-6 shadow-2xl flex-1 max-w-lg animate-slide-right">
                            <p className="font-luckiest text-cyan-400 text-lg md:text-3xl uppercase leading-tight tracking-wide text-cartoon-outline">
                                {hint}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* MODALI START/WIN */}
            {gameState === 'START' && (
                <div className="fixed inset-0 z-[400] bg-black/80 flex items-center justify-center p-4 animate-in zoom-in duration-300">
                    <div className="bg-white rounded-[3rem] border-8 border-orange-500 p-8 w-full max-sm text-center shadow-2xl flex flex-col items-center">
                        <div className="w-56 h-56 md:w-64 h-auto mb-4">
                            <img src={MODAL_HEADER_IMG} alt="Solitario" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tighter mb-4 font-luckiest">SOLITARIO!</h2>
                        <p className="text-gray-600 font-bold mb-8 text-lg leading-snug">Sposta le carte sulle basi in alto seguendo l'ordine dall'1 al 10!</p>
                        <button onClick={initGame} className="hover:scale-105 active:scale-95 transition-transform outline-none">
                            <img src={BTN_START_GAME_IMG} alt="Inizia" className="w-48 md:w-56 h-auto drop-shadow-xl" />
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'WON' && (
                <div className="fixed inset-0 z-[400] bg-black/90 flex items-center justify-center p-4 animate-in zoom-in">
                    <div className="bg-white rounded-[3rem] border-8 border-yellow-400 p-8 w-full max-md text-center shadow-2xl flex flex-col items-center">
                        <Trophy size={100} className="text-yellow-400 mb-6 animate-bounce" />
                        <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tighter mb-2">VITTORIA! 🎉</h2>
                        <p className="text-gray-600 font-bold mb-6 text-xl">Sei stato un vero campione!</p>
                        <div className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black text-2xl border-4 border-black mb-8 shadow-lg">+10 🪙</div>
                        <div className="flex gap-4 w-full">
                            <button onClick={initGame} className="flex-1 bg-green-500 text-white font-black py-4 rounded-2xl border-b-8 border-green-700 active:translate-y-1 active:border-b-0 transition-all uppercase text-lg">RIGIOCA</button>
                            <button onClick={() => setView(AppView.LIBRARY_CARDS)} className="flex-1 bg-red-500 text-white font-black py-4 rounded-2xl border-b-8 border-red-700 active:translate-y-1 active:border-b-0 transition-all uppercase text-lg">ESCI</button>
                        </div>
                    </div>
                </div>
            )}

            {showRules && rulesModal}
        </div>
    );
};

export default LibrarySolitario;