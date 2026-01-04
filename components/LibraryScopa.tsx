import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppView } from '../types';
import { CARDS_DATABASE, CardAsset } from '../services/cardsDatabase';
import { Trophy, RefreshCcw, Play, Layers, Star, Check, ArrowRight, X } from 'lucide-react';

const BTN_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const TABLE_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sflibretre.webp';
const OPPONENT_ICON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dvfzfd.webp';

const MODAL_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scopaminiatu.webp';
const BTN_START_GAME_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giocafread.webp';

const WINNING_SCORE = 11;

type GamePhase = 'MODAL' | 'SHUFFLING' | 'DEALING' | 'PLAYING' | 'ROUND_OVER' | 'GAME_OVER';

interface AnimState {
    card: CardAsset;
    targets: CardAsset[];
    isPlayer: boolean;
    step: 'FLYING_TO_CENTER' | 'HIGHLIGHT_TARGETS' | 'COLLECTING' | 'IDLE';
    handIndex: number;
}

interface LibraryScopaProps {
    setView: (view: AppView) => void;
}

const LibraryScopa: React.FC<LibraryScopaProps> = ({ setView }) => {
    const [phase, setPhase] = useState<GamePhase>('MODAL');
    const [dealtCount, setDealtCount] = useState(0);

    const [deck, setDeck] = useState<CardAsset[]>([]);
    const [playerHand, setPlayerHand] = useState<(CardAsset | null)[]>([null, null, null]);
    const [opponentHand, setOpponentHand] = useState<(CardAsset | null)[]>([null, null, null]);
    const [table, setTable] = useState<CardAsset[]>([]);
    const [playerCaptured, setPlayerCaptured] = useState<CardAsset[]>([]);
    const [opponentCaptured, setOpponentCaptured] = useState<CardAsset[]>([]);
    const [turn, setTurn] = useState<'player' | 'opponent'>('player');
    const [firstTurnOfRound, setFirstTurnOfRound] = useState<'player' | 'opponent'>('player');
    const [lastCapturer, setLastCapturer] = useState<'player' | 'opponent' | null>(null);
    
    // Punteggi
    const [totalPoints, setTotalPoints] = useState({ player: 0, opponent: 0 });
    const [roundScopaCount, setRoundScopaCount] = useState({ player: 0, opponent: 0 });
    const [lastRoundPoints, setLastRoundPoints] = useState({ player: 0, opponent: 0 });
    
    // UI Nuovi Stati
    const [scopaNotice, setScopaNotice] = useState<string | null>(null);
    const [pendingSelection, setPendingSelection] = useState<{ card: CardAsset, handIndex: number, options: CardAsset[][] } | null>(null);

    const [anim, setAnim] = useState<AnimState | null>(null);
    const [isBlocked, setIsBlocked] = useState(false);

    const shuffleDeck = () => {
        const fullDeck = [...CARDS_DATABASE.SCOPA.deck];
        for (let i = fullDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
        }
        return fullDeck;
    };

    const prepareNewRound = useCallback((isFullReset: boolean = false) => {
        let nextStarter: 'player' | 'opponent';

        if (isFullReset) {
            setTotalPoints({ player: 0, opponent: 0 });
            nextStarter = 'player';
            setFirstTurnOfRound('player');
        } else {
            // Alterna chi inizia rispetto al round precedente
            nextStarter = firstTurnOfRound === 'player' ? 'opponent' : 'player';
            setFirstTurnOfRound(nextStarter);
        }

        const newDeck = shuffleDeck();
        const initialTable = newDeck.splice(0, 4);
        const pHand = newDeck.splice(0, 3);
        const oHand = newDeck.splice(0, 3);

        setDeck(newDeck);
        setTable(initialTable);
        setPlayerHand(pHand);
        setOpponentHand(oHand);
        setPlayerCaptured([]);
        setOpponentCaptured([]);
        setTurn(nextStarter);
        setRoundScopaCount({ player: 0, opponent: 0 });
        setLastCapturer(null);
        setScopaNotice(null);
        setPendingSelection(null);
        setAnim(null);
        setIsBlocked(false);
        setDealtCount(0);
    }, [firstTurnOfRound]);

    const startDealingSequence = async () => {
        setPhase('SHUFFLING');
        await new Promise(r => setTimeout(r, 1500));
        setPhase('DEALING');
        for (let i = 1; i <= 10; i++) {
            setDealtCount(i);
            await new Promise(r => setTimeout(r, 200));
        }
        await new Promise(r => setTimeout(r, 400));
        setPhase('PLAYING');
    };

    const findAllCaptureOptions = (card: CardAsset, currentTable: CardAsset[]): CardAsset[][] => {
        const singles = currentTable.filter(c => c.value === card.value);
        if (singles.length > 0) {
            return singles.map(c => [c]);
        }
        const results: CardAsset[][] = [];
        const findSums = (target: number, available: CardAsset[], currentCombo: CardAsset[]) => {
            const currentSum = currentCombo.reduce((acc, c) => acc + c.value, 0);
            if (currentSum === target) {
                results.push([...currentCombo]);
                return;
            }
            if (currentSum > target) return;
            for (let i = 0; i < available.length; i++) {
                const remaining = available.slice(i + 1);
                findSums(target, remaining, [...currentCombo, available[i]]);
            }
        };
        findSums(card.value, currentTable, []);
        return results;
    };

    const executePlayAction = async (card: CardAsset, captures: CardAsset[], isPlayer: boolean, handIndex: number) => {
        setIsBlocked(true);
        const hasCapture = captures && captures.length > 0;
        setAnim({ card, targets: captures, isPlayer, handIndex, step: 'FLYING_TO_CENTER' });
        
        setTimeout(() => {
            if (isPlayer) setPlayerHand(prev => prev.map((c, i) => i === handIndex ? null : c));
            else setOpponentHand(prev => prev.map((c, i) => i === handIndex ? null : c));
        }, 100);

        await new Promise(r => setTimeout(r, 600));

        if (hasCapture) {
            setAnim(prev => prev ? { ...prev, step: 'HIGHLIGHT_TARGETS' } : null);
            await new Promise(r => setTimeout(r, 500));
            setAnim(prev => prev ? { ...prev, step: 'COLLECTING' } : null);
            await new Promise(r => setTimeout(r, 700));

            const capturedIds = captures.map(c => c.id);
            const newTable = table.filter(c => !capturedIds.includes(c.id));
            const fullCapture = [card, ...captures];

            if (isPlayer) {
                setPlayerCaptured(prev => [...prev, ...fullCapture]);
                setLastCapturer('player');
                if (newTable.length === 0 && (deck.length > 0 || opponentHand.some(c => c !== null))) {
                    setRoundScopaCount(s => ({ ...s, player: s.player + 1 }));
                    setScopaNotice("HAI FATTO SCOPA!");
                    setTimeout(() => setScopaNotice(null), 2500);
                }
            } else {
                setOpponentCaptured(prev => [...prev, ...fullCapture]);
                setLastCapturer('opponent');
                if (newTable.length === 0 && (deck.length > 0 || playerHand.some(c => c !== null))) {
                    setRoundScopaCount(s => ({ ...s, opponent: s.opponent + 1 }));
                    setScopaNotice("BOO HA FATTO SCOPA!");
                    setTimeout(() => setScopaNotice(null), 2500);
                }
            }
            setTable(newTable);
        } else {
            await new Promise(r => setTimeout(r, 200));
            setTable(prev => [...prev, card]);
        }

        setAnim(null);
        setTurn(isPlayer ? 'opponent' : 'player');
        setIsBlocked(false);
    };

    const handlePlayerMove = (card: CardAsset, index: number) => {
        if (phase !== 'PLAYING' || isBlocked || turn !== 'player') return;
        const options = findAllCaptureOptions(card, table);
        if (options.length > 1) {
            setPendingSelection({ card, handIndex: index, options });
        } else {
            executePlayAction(card, options[0] || [], true, index);
        }
    };

    useEffect(() => {
        if (phase === 'PLAYING' && !isBlocked) {
            const pEmpty = playerHand.every(c => c === null);
            const oEmpty = opponentHand.every(c => c === null);

            if (pEmpty && oEmpty) {
                if (deck.length === 0) {
                    setIsBlocked(true);
                    setTimeout(() => {
                        // Raccolta ultime carte
                        const remainingTable = [...table];
                        let finalP = [...playerCaptured];
                        let finalO = [...opponentCaptured];
                        
                        if (lastCapturer === 'player') finalP = [...finalP, ...remainingTable];
                        else if (lastCapturer === 'opponent') finalO = [...finalO, ...remainingTable];
                        
                        const roundResults = calculateRoundPoints(finalP, finalO, roundScopaCount);
                        setLastRoundPoints(roundResults);
                        
                        const newTotalP = totalPoints.player + roundResults.player;
                        const newTotalO = totalPoints.opponent + roundResults.opponent;
                        
                        setTotalPoints({ player: newTotalP, opponent: newTotalO });
                        setTable([]);
                        setIsBlocked(false);

                        if (newTotalP >= WINNING_SCORE || newTotalO >= WINNING_SCORE) {
                            setPhase('GAME_OVER');
                        } else {
                            setPhase('ROUND_OVER');
                        }
                    }, 1000);
                } else {
                    setTimeout(() => {
                        const nextDeck = [...deck];
                        const nextP = nextDeck.splice(0, 3);
                        const nextO = nextDeck.splice(0, 3);
                        setPlayerHand(nextP);
                        setOpponentHand(nextO);
                        setDeck(nextDeck);
                    }, 800);
                }
            }
        }
    }, [playerHand, opponentHand, deck, phase, isBlocked]);

    useEffect(() => {
        const currentOpponentHand = opponentHand.map((c, i) => ({c, i})).filter(item => item.c !== null);
        if (turn === 'opponent' && phase === 'PLAYING' && !isBlocked && currentOpponentHand.length > 0) {
            const timer = setTimeout(() => {
                let bestOption: { card: CardAsset, combo: CardAsset[], score: number, handIndex: number } | null = null;
                currentOpponentHand.forEach(item => {
                    const options = findAllCaptureOptions(item.c!, table);
                    options.forEach(combo => {
                        let score = combo.length;
                        if (combo.some(c => c.suit === 'denari')) score += 2;
                        if (combo.some(c => c.id === 'denari_7')) score += 5;
                        if (item.c!.value === 7) score += 1;
                        if (!bestOption || score > bestOption.score) {
                            bestOption = { card: item.c!, combo, score, handIndex: item.i };
                        }
                    });
                });
                if (bestOption) {
                    executePlayAction(bestOption.card, bestOption.combo, false, bestOption.handIndex);
                } else {
                    const first = currentOpponentHand[0];
                    executePlayAction(first.c!, [], false, first.i);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [turn, phase, isBlocked, opponentHand, table]);

    const CapturedStatsBox = ({ cards, scopas }: { cards: CardAsset[], scopas: number }) => {
        const totalCards = cards.length;
        const denari = cards.filter(c => c.suit === 'denari').length;
        const sevens = cards.filter(c => c.value === 7).length;
        const setteBello = cards.some(c => c.id === 'denari_7');

        return (
            <div className="w-20 md:w-32 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 p-2 md:p-3 flex flex-col gap-1 md:gap-2 shadow-lg">
                <div className="flex items-center justify-between">
                    <span className="w-6 flex justify-center text-sm md:text-xl">🃏</span>
                    <span className="font-black text-xs md:text-lg text-white">{totalCards}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="w-6 flex justify-center text-sm md:text-xl">🟡</span>
                    <span className="font-black text-xs md:text-lg text-yellow-400">{denari}</span>
                </div>
                {/* SETTE TOTALI */}
                <div className="flex items-center justify-between">
                    <div className="w-5 h-5 md:w-7 md:h-7 rounded-lg bg-blue-600 flex items-center justify-center border border-black/10 shadow-sm shrink-0">
                        <span className="font-black text-[10px] md:text-base text-white leading-none">7</span>
                    </div>
                    <span className="font-black text-xs md:text-lg text-white">{sevens}</span>
                </div>
                {/* SETTE BELLO */}
                <div className="flex items-center justify-between">
                    <div className="w-5 h-5 md:w-7 md:h-7 rounded-lg bg-yellow-400 flex items-center justify-center border border-black/10 shadow-sm shrink-0">
                        <span className="font-black text-[10px] md:text-base text-black leading-none">7</span>
                    </div>
                    <span className={`font-black text-[10px] md:text-sm uppercase ${setteBello ? 'text-yellow-300' : 'text-white/20'}`}>
                        {setteBello ? 'SI' : 'NO'}
                    </span>
                </div>
                {scopas > 0 && (
                    <div className="flex items-center justify-between border-t border-white/20 pt-1">
                        <span className="w-6 flex justify-center text-sm md:text-xl">🌟</span>
                        <span className="font-black text-xs md:text-lg text-green-400">{scopas}</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#1a472a] overflow-hidden touch-none overscroll-none select-none">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes shuffle-shake {
                    0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
                    25% { transform: translate(-55%, -52%) rotate(-5deg); }
                    50% { transform: translate(-45%, -48%) rotate(5deg); }
                    75% { transform: translate(-52%, -55%) rotate(-3deg); }
                }
                .animate-shuffle { animation: shuffle-shake 0.3s infinite; }
                .card-flying { transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
                .highlight-capture { animation: pulse-capture 0.5s infinite; border-color: gold !important; box-shadow: 0 0 20px gold !important; }
                @keyframes pulse-capture { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                @keyframes scopa-pop {
                    0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
                    50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                .animate-scopa { animation: scopa-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            `}</style>

            <div className="absolute inset-0 z-0 opacity-40">
                <img src={TABLE_BG} alt="" className="w-full h-full object-fill" />
            </div>

            {/* BANNER SCOPA CARTOON */}
            {scopaNotice && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center pointer-events-none px-4">
                    <div className="animate-scopa bg-white border-8 border-yellow-400 p-6 md:p-12 rounded-[3rem] shadow-[0_0_50px_rgba(250,204,21,0.8)] transform rotate-[-2deg]">
                        <h2 className={`text-4xl md:text-8xl font-black uppercase tracking-tighter text-center ${scopaNotice.includes('BOO') ? 'text-red-600' : 'text-blue-600'}`} style={{ WebkitTextStroke: '2px black', textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}>
                            {scopaNotice}
                        </h2>
                        <div className="flex justify-center gap-4 mt-4">
                            <Star className="text-yellow-400 animate-bounce fill-yellow-400" size={40} />
                            <Star className="text-yellow-400 animate-bounce fill-yellow-400 delay-100" size={40} />
                            <Star className="text-yellow-400 animate-bounce fill-yellow-400 delay-200" size={40} />
                        </div>
                    </div>
                </div>
            )}

            {/* SELETTORE COMBINAZIONE - COMPATTO E TRASLUCIDO */}
            {pendingSelection && (
                <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white/10 backdrop-blur-2xl rounded-[3rem] border-4 border-white/20 p-6 w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 relative">
                        <h3 className="text-xl md:text-3xl font-black text-white text-center uppercase mb-6 leading-tight drop-shadow-md">Cosa prendiamo? 🧐</h3>
                        
                        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto no-scrollbar pr-2">
                            {pendingSelection.options.map((option, oIdx) => (
                                <div key={oIdx} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 rounded-2xl p-3 flex items-center justify-between gap-4 transition-colors">
                                    <div className="flex flex-wrap gap-1.5 flex-1 items-center justify-start">
                                        {option.map((c) => (
                                            <div key={c.id} className="w-10 h-14 md:w-14 md:h-20 rounded-lg border border-white/20 shadow-sm overflow-hidden bg-white">
                                                <img src={c.image} className="w-full h-full object-fill scale-x-[0.92]" alt="" />
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => { const { card, handIndex } = pendingSelection; setPendingSelection(null); executePlayAction(card, option, true, handIndex); }} 
                                        className="bg-green-500 hover:bg-green-400 text-white px-4 md:px-6 py-2 rounded-xl font-black text-xs md:text-sm uppercase shadow-lg active:translate-y-1 transition-all flex items-center gap-2 border-b-4 border-green-700 active:border-b-0 shrink-0"
                                    >
                                        PRENDI
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* OVERLAY ANIMAZIONE CARTE */}
            {anim && (
                <div className="fixed inset-0 z-[150] pointer-events-none">
                    <div className={`absolute w-20 h-32 md:w-36 md:h-56 rounded-xl border-4 border-white shadow-2xl overflow-hidden bg-white card-flying ${anim.step === 'FLYING_TO_CENTER' || anim.step === 'HIGHLIGHT_TARGETS' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110' : ''} ${anim.step === 'COLLECTING' ? (anim.isPlayer ? 'top-[90%] left-[80%] scale-0' : 'top-[10%] left-[80%] scale-0') : ''}`} style={{ top: anim.step === 'IDLE' ? (anim.isPlayer ? '85%' : '15%') : undefined, left: anim.step === 'IDLE' ? `${30 + anim.handIndex * 20}%` : undefined }}>
                        <img src={anim.card.image} className="w-[92%] h-full mx-auto object-fill" alt="" />
                    </div>
                    {anim.step === 'COLLECTING' && anim.targets.map((t, idx) => (
                        <div key={`anim-t-${t.id}`} className={`absolute w-16 h-24 md:w-32 md:h-48 rounded-lg border-2 md:border-4 border-white shadow-xl overflow-hidden bg-white card-flying ${anim.isPlayer ? 'top-[90%] left-[80%] scale-0' : 'top-[10%] left-[80%] scale-0'}`} style={{ top: '50%', left: '50%', transitionDelay: `${idx * 100}ms` }}>
                            <img src={t.image} className="w-[92%] h-full mx-auto object-fill" alt="" />
                        </div>
                    ))}
                </div>
            )}

            {/* TASTO CHIUDI GIOCO - SPOSTATO IN ALTO A SINISTRA */}
            <div className="absolute top-24 md:top-32 left-4 z-50">
                <button onClick={() => setView(AppView.LIBRARY_CARDS)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                    <img src={BTN_BACK_IMG} alt="Esci" className="w-12 h-12 md:w-20 h-auto drop-shadow-2xl" />
                </button>
            </div>

            {/* MODALE INIZIO GIOCO */}
            {phase === 'MODAL' && (
                <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 animate-in zoom-in duration-300">
                    <div className="bg-white rounded-[3rem] border-8 border-orange-500 p-8 w-full max-sm text-center shadow-2xl flex flex-col items-center">
                        <div className="w-56 h-56 md:w-64 md:h-64 mb-4 flex items-center justify-center overflow-hidden">
                            <img src={MODAL_HEADER_IMG} alt="Scopa" className="w-full h-full object-contain drop-shadow-xl" />
                        </div>
                        <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tighter mb-4 font-luckiest">SCOPA!</h2>
                        <p className="text-gray-600 font-bold mb-8 text-lg leading-snug">Sfida Boo in una partita tradizionale a 11 punti!</p>
                        <button 
                            onClick={() => { prepareNewRound(true); startDealingSequence(); }} 
                            className="hover:scale-105 active:scale-95 transition-transform outline-none"
                        >
                            <img src={BTN_START_GAME_IMG} alt="Inizia" className="w-48 md:w-56 h-auto drop-shadow-xl" />
                        </button>
                    </div>
                </div>
            )}

            {/* SHUFFLING */}
            {phase === 'SHUFFLING' && (
                <div className="absolute top-1/2 left-1/2 z-[100] animate-shuffle">
                    <div className="relative w-28 h-44 md:w-44 md:h-64">
                         {[...Array(4)].map((_, i) => (
                             <div key={i} className="absolute inset-0 bg-white rounded-xl border-4 border-white shadow-xl overflow-hidden" style={{ transform: `translate(${i*3}px, ${-i*3}px)` }}>
                                <img src={CARDS_DATABASE.SCOPA.back} className="w-[92%] h-full mx-auto object-fill" alt="" />
                             </div>
                         ))}
                    </div>
                </div>
            )}

            <div className={`relative z-10 w-full h-full flex flex-col items-center justify-between py-6 md:py-10 px-4 transition-opacity duration-500 ${phase === 'MODAL' || phase === 'SHUFFLING' ? 'opacity-0' : 'opacity-100'}`}>
                
                {/* AREA AVVERSARIO */}
                <div className="w-full max-w-6xl flex flex-col items-center gap-2 mt-28 md:mt-36 shrink-0">
                    <div className="flex items-center justify-center gap-4 md:gap-12 w-full px-4">
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <div className="w-24 h-24 md:w-44 md:h-44 flex items-center justify-center">
                                <img src={OPPONENT_ICON} alt="Avversario" className="w-full h-full object-contain drop-shadow-xl" />
                            </div>
                            <div className="bg-red-600 text-white px-5 py-1 rounded-full border-4 border-white shadow-xl font-black text-xs md:text-lg uppercase">
                                {totalPoints.opponent}/{WINNING_SCORE}
                            </div>
                        </div>
                        <div className="flex justify-center gap-1 md:gap-3 flex-1 max-w-md">
                            {opponentHand.map((card, i) => (
                                <div key={`opp-slot-${i}`} className="w-16 h-24 md:w-28 md:h-44 shrink-0 relative">
                                    {card && (phase === 'PLAYING' || (phase === 'DEALING' && dealtCount > i + 3)) && (
                                        <div className="w-full h-full rounded-lg border-2 border-white/40 shadow-lg overflow-hidden bg-white">
                                            <img src={CARDS_DATABASE.SCOPA.back} className="w-[92%] h-full mx-auto object-fill" alt="Dorso" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <CapturedStatsBox cards={opponentCaptured} scopas={roundScopaCount.opponent} />
                    </div>
                </div>

                {/* TAVOLO CENTRALE */}
                <div className="w-full max-w-4xl flex-1 flex items-center justify-center min-h-0 py-4 overflow-visible">
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 md:gap-6 items-center justify-center">
                        {table.map((card) => {
                            const isBeingCaptured = anim && (anim.step === 'HIGHLIGHT_TARGETS' || anim.step === 'COLLECTING') && anim.targets.some(t => t.id === card.id);
                            const isHidden = anim && anim.step === 'COLLECTING' && anim.targets.some(t => t.id === card.id);
                            return (
                                <div key={card.id} className={`bg-white rounded-lg border-2 md:border-4 border-white shadow-xl overflow-hidden shrink-0 w-16 h-24 md:w-32 md:h-48 transition-all duration-300 ${isBeingCaptured ? 'highlight-capture' : ''} ${isHidden ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                                    <img src={card.image} alt={card.id} className="w-[92%] h-full mx-auto object-fill" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* AREA GIOCATORE */}
                <div className="w-full max-w-6xl flex flex-row items-center justify-center gap-4 md:gap-12 shrink-0 mb-12 md:mb-20 px-4">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex justify-center gap-3 md:gap-6 min-w-[240px] md:min-w-[450px]">
                            {playerHand.map((card, i) => (
                                <div key={`player-slot-${i}`} className="w-24 h-36 md:w-40 md:h-56 shrink-0 relative">
                                    {card && (phase === 'PLAYING' || (phase === 'DEALING' && dealtCount > i)) && (
                                        <button 
                                            onClick={() => handlePlayerMove(card, i)}
                                            disabled={turn !== 'player' || phase !== 'PLAYING' || isBlocked}
                                            className={`w-full h-full bg-white rounded-xl shadow-2xl transition-all hover:-translate-y-6 active:scale-95 overflow-hidden ${turn === 'player' && !isBlocked ? '' : 'opacity-60 grayscale'}`}
                                        >
                                            <img src={card.image} alt={card.id} className="w-[92%] h-full mx-auto object-fill" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 text-white px-5 py-1 rounded-full border-4 border-white shadow-xl font-black text-xs md:text-lg uppercase">
                                PUNTEGGIO: {totalPoints.player}/{WINNING_SCORE}
                            </div>
                        </div>
                    </div>
                    <CapturedStatsBox cards={playerCaptured} scopas={roundScopaCount.player} />
                </div>
            </div>

            {/* MODALE FINE ROUND O FINE PARTITA */}
            {(phase === 'ROUND_OVER' || phase === 'GAME_OVER') && (
                <div className="fixed inset-0 z-[400] bg-black/90 flex items-center justify-center p-4 animate-in zoom-in duration-300">
                    <div className="bg-white rounded-[3rem] border-8 border-yellow-400 p-8 w-full max-md text-center shadow-2xl flex flex-col items-center">
                        <Trophy size={64} className="text-yellow-500 mb-4 animate-bounce" />
                        <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tighter mb-2">
                            {phase === 'GAME_OVER' ? (totalPoints.player >= WINNING_SCORE ? 'HAI VINTO LA PARTITA!' : 'HA VINTO BOO!') : 'FINE ROUND!'}
                        </h2>
                        
                        <div className="bg-slate-100 rounded-3xl p-6 border-4 border-slate-200 w-full mb-8">
                             <div className="flex justify-between items-center mb-4">
                                <div className="flex flex-col items-start">
                                    <span className="font-black text-blue-600 text-sm md:text-lg uppercase leading-none">TU</span>
                                    <span className="text-[10px] text-gray-400 font-bold">+{lastRoundPoints.player} in questo round</span>
                                </div>
                                <span className="font-black text-4xl text-blue-900">{totalPoints.player}/{WINNING_SCORE}</span>
                             </div>
                             <div className="h-1 bg-slate-300 rounded-full mb-4"></div>
                             <div className="flex justify-between items-center">
                                <div className="flex flex-col items-start">
                                    <span className="font-black text-red-600 text-sm md:text-lg uppercase leading-none">BOO</span>
                                    <span className="text-[10px] text-gray-400 font-bold">+{lastRoundPoints.opponent} in questo round</span>
                                </div>
                                <span className="font-black text-4xl text-red-900">{totalPoints.opponent}/{WINNING_SCORE}</span>
                             </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            {phase === 'GAME_OVER' ? (
                                <button onClick={() => { prepareNewRound(true); startDealingSequence(); }} className="flex-1 bg-green-500 text-white font-black py-4 rounded-2xl border-b-8 border-green-700 active:translate-y-2 active:border-b-0 transition-all flex items-center justify-center gap-2 uppercase text-lg">
                                    <RefreshCcw size={24} /> RIGIOCA
                                </button>
                            ) : (
                                <button onClick={() => { prepareNewRound(false); startDealingSequence(); }} className="flex-1 bg-green-500 text-white font-black py-4 rounded-2xl border-b-8 border-green-700 active:translate-y-2 active:border-b-0 transition-all flex items-center justify-center gap-2 uppercase text-lg">
                                    <ArrowRight size={24} /> CONTINUA
                                </button>
                            )}
                            <button onClick={() => setView(AppView.LIBRARY_CARDS)} className="flex-1 bg-red-500 text-white font-black py-4 rounded-2xl border-b-8 border-red-700 active:translate-y-2 active:border-b-0 transition-all uppercase text-lg">
                                ESCI
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    function calculateRoundPoints(pCap: CardAsset[], oCap: CardAsset[], scopas: {player: number, opponent: number}) {
        let pPoints = scopas.player;
        let oPoints = scopas.opponent;

        // Carte (21+)
        if (pCap.length > 20) pPoints++;
        else if (oCap.length > 20) oPoints++;

        // Denari (6+)
        const pDenari = pCap.filter(c => c.suit === 'denari').length;
        const oDenari = oCap.filter(c => c.suit === 'denari').length;
        if (pDenari > 5) pPoints++;
        else if (oDenari > 5) oPoints++;

        // Sette Bello
        if (pCap.find(c => c.id === 'denari_7')) pPoints++;
        if (oCap.find(c => c.id === 'denari_7')) oPoints++;

        // Primiera
        const getPrimieraValue = (captured: CardAsset[]) => {
            const values: Record<number, number> = { 7: 21, 6: 18, 1: 16, 5: 15, 4: 14, 3: 13, 2: 12, 10: 10, 9: 10, 8: 10 };
            const bestPerSuit: Record<string, number> = { bastoni: 0, denari: 0, spade: 0, coppe: 0 };
            captured.forEach(c => {
                const val = values[c.value] || 0;
                if (val > bestPerSuit[c.suit]) bestPerSuit[c.suit] = val;
            });
            return Object.values(bestPerSuit).reduce((a, b) => a + b, 0);
        };
        const pPrim = getPrimieraValue(pCap);
        const oPrim = getPrimieraValue(oCap);
        if (pPrim > oPrim) pPoints++;
        else if (oPrim > pPrim) oPoints++;

        return { player: pPoints, opponent: oPoints };
    }
};

export default LibraryScopa;