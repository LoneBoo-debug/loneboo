
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Send, Check, X, Loader2, MessageCircle, Trophy, User, HelpCircle, Search, Sparkles, ZoomIn, RotateCcw, Gamepad2, LogOut } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { GW_DATABASE, GuessWhoCharacter, Trait } from '../services/dbCardChi';

const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bksalagii+(1).webp';
const BTN_BACK_ARCADE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bksalagii+(1).webp';
const BTN_PLAY_AGAIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-play-again.webp';
const GAME_BG = encodeURI('https://i.postimg.cc/zX3FSsXL/sfchi-(1).jpg');

const GAIA_BOX_ICON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gaiagag+(1).webp';
const IMG_SI = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gaia-yes.webp';
const IMG_NO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gaia-no.webp';
const IMG_THINKING = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gaia-thinking.webp';
const IMG_UNKNOWN = 'https://i.postimg.cc/Hk7BwqWR/nohoda-(1)-(1).png';
const IMG_CORRECT_GUESS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gaia-correct.webp';
const IMG_WRONG_GUESS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gaia-wrong.webp';
const IMG_GAIA_WINS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/givinc-(1).webp';
const IMG_VICTORY_REWARD = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giouty-(1)-(1).webp';

// NUOVI PULSANTI INTERAZIONE
const BTN_YES_ACTION = 'https://i.postimg.cc/K8czzwjv/sipuls-(1).png';
const BTN_NO_ACTION = 'https://i.postimg.cc/nLypvPFx/noopuls-(1).png';

const ALL_TRAITS: Trait[] = [
    'CAPPELLO', 'OCCHIALI', 'CAPELLI_LUNGHI', 'ORECCHINI', 'SORRISO', 
    'UOMO', 'DONNA', 'BAMBINO', 'ANZIANO', 'BARBA', 'BAFFI', 'SENZA_CAPELLI',
    'BIONDO', 'MORO', 'CAPELLI_ROSSI', 'TRECCE', 'CODA', 
    'SALOPETTE', 'GIUBBOTTO', 'MAGLIA_ROSSA', 'MAGLIA_BLU', 'MAGLIA_VERDE', 'MAGLIA_GIALLA'
];

const ConfettiExplosion = () => {
    const particles = useMemo(() => Array.from({ length: 80 }).map((_, i) => {
        const angle = Math.random() * 360;
        const velocity = 200 + Math.random() * 300;
        const size = 8 + Math.random() * 12;
        const color = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#ec4899', '#ffffff'][Math.floor(Math.random() * 7)];
        const delay = Math.random() * 0.1;
        const tx = Math.cos(angle * Math.PI / 180) * velocity;
        const ty = Math.sin(angle * Math.PI / 180) * velocity;
        return { i, size, color, tx, ty, delay };
    }), []);

    return (
        <div className="absolute inset-0 z-[110] pointer-events-none overflow-visible">
            {particles.map(p => (
                <div 
                    key={p.i}
                    className="absolute top-1/2 left-1/2 rounded-sm"
                    style={{
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        // @ts-ignore
                        '--tx': `${p.tx}px`,
                        // @ts-ignore
                        '--ty': `${p.ty}px`,
                        animation: `confetti-blow 2s cubic-bezier(0.25, 1, 0.5, 1) forwards ${p.delay}s`
                    }}
                />
            ))}
        </div>
    );
};

const GuessWhoGame: React.FC<{ onBack: () => void, onEarnTokens: (n: number) => void }> = ({ onBack, onEarnTokens }) => {
    const [gameCharacters, setGameCharacters] = useState<GuessWhoCharacter[]>([]);
    const [playerTarget, setPlayerTarget] = useState<GuessWhoCharacter | null>(null);
    const [aiTarget, setAiTarget] = useState<GuessWhoCharacter | null>(null);
    const [winningChar, setWinningChar] = useState<GuessWhoCharacter | null>(null);
    const [isFlipped, setIsFlipped] = useState<Record<string, boolean>>({});
    const [gameState, setGameState] = useState<'SELECTING' | 'PLAYING' | 'REVEALING' | 'WON' | 'LOST' | 'STUCK'>('SELECTING');
    const [turn, setTurn] = useState<'PLAYER' | 'AI'>('PLAYER');
    
    // IA LOGIC STATES
    const [gaiaCandidates, setGaiaCandidates] = useState<GuessWhoCharacter[]>([]);
    const [gaiaLastAskedTrait, setGaiaLastAskedTrait] = useState<Trait | null>(null);
    const [gaiaLastAskedName, setGaiaLastAskedName] = useState<string | null>(null);

    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
    const [zoomedChar, setZoomedChar] = useState<GuessWhoCharacter | null>(null);

    const initGame = () => {
        const shuffled = [...GW_DATABASE].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 20); 
        setGameCharacters(selected);
        setGaiaCandidates(selected);
        const randomAi = selected[Math.floor(Math.random() * selected.length)];
        setAiTarget(randomAi);
        setIsFlipped({});
        setGameState('SELECTING');
        setTurn('PLAYER');
        setCurrentMessage("");
        setWinningChar(null);
        setGaiaLastAskedTrait(null);
        setGaiaLastAskedName(null);
    };

    useEffect(() => {
        initGame();
    }, []);

    const handleSelectPlayerChar = (char: GuessWhoCharacter) => {
        setPlayerTarget(char);
        setGameState('PLAYING');
    };

    const showTemporaryResponse = (msg: string) => {
        setCurrentMessage(msg);
        setTimeout(() => {
            setCurrentMessage("");
        }, 2000);
    };

    const triggerWinSequence = (char: GuessWhoCharacter) => {
        setWinningChar(char);
        setGameState('REVEALING');
        setTimeout(() => {
            setGameState('WON');
            onEarnTokens(10);
        }, 4000);
    };

    const triggerLossSequence = (char: GuessWhoCharacter) => {
        setWinningChar(char);
        setGameState('REVEALING');
        setTimeout(() => {
            setGameState('LOST');
        }, 4000);
    };

    const analyzeQuestion = async (question: string) => {
        setIsThinking(true);
        setCurrentMessage(""); 
        try {
            // FIX: Use named parameter for apiKey initialization
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Sei l'arbitro di 'Indovina Chi'. 
            Tratti disponibili: 
            - CAPPELLO, OCCHIALI, CAPELLI_LUNGHI, ORECCHINI, SORRISO, BARBA, BAFFI, SENZA_CAPELLI
            - UOMO, DONNA, BAMBINO, ANZIANO
            - BIONDO (capelli biondi), MORO (castani/neri), CAPELLI_ROSSI
            - TRECCE (capelli a treccia), CODA (ponytail/capelli legati)
            - SALOPETTE, GIUBBOTTO (abbigliamento)
            - MAGLIA_ROSSA, MAGLIA_BLU, MAGLIA_VERDE, MAGLIA_GIALLA
            
            Analizza la domanda del bambino: "${question}". 
            REGOLE CRITICHE:
            1. Se il bambino chiede di dettagli specifici come CODA, TRECCE, OCCHIALI o colori, scegli SEMPRE quel tratto specifico.
            2. NON scegliere 'DONNA' se il bambino chiede della 'CODA' o delle 'TRECCE'.
            3. Rispondi SOLO con il nome del tratto corrispondente in maiuscolo (es: 'CODA') o 'UNKNOWN' se non capisci.`;
            
            // FIX: Pass direct string as contents for basic text generation
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });
            // FIX: result.text is a property, not a method
            processPlayerMove(response.text?.trim() as Trait | 'UNKNOWN', question);
        } catch (e) {
            setIsThinking(false);
            showTemporaryResponse("UNKNOWN");
        }
    };

    const processPlayerMove = (trait: Trait | 'UNKNOWN', originalText: string) => {
        setIsThinking(false);
        if (trait === 'UNKNOWN') {
            showTemporaryResponse("UNKNOWN");
            return;
        }

        const hasTrait = aiTarget ? !!aiTarget.traits[trait] : false;
        showTemporaryResponse(hasTrait ? "SÌ!" : "NO.");

        const newFlipped = { ...isFlipped };
        gameCharacters.forEach(char => {
            // Se Gaia dice SÌ, scarta chi NON ha il tratto. Se dice NO, scarta chi CE L'HA.
            if (hasTrait ? !char.traits[trait] : char.traits[trait]) newFlipped[char.id] = true;
        });
        setIsFlipped(newFlipped);

        const remaining = gameCharacters.filter(c => !newFlipped[c.id]);
        if (remaining.length === 1 && aiTarget && remaining[0].id === aiTarget.id) {
            setTimeout(() => triggerWinSequence(aiTarget), 1000);
            return;
        }
        
        setTimeout(() => startAiTurn(), 2500);
    };

    const startAiTurn = () => {
        setTurn('AI');
        
        // --- FIX BUG: CONTROLLO COERENZA RISPOSTE ---
        if (gaiaCandidates.length === 0) {
            setGameState('STUCK');
            setCurrentMessage("Scusami ma avrò sbagliato ad abbassare qualche casella, possiamo ricominciare?");
            return;
        }

        if (gaiaCandidates.length <= 2) {
            const guessChar = gaiaCandidates[Math.floor(Math.random() * gaiaCandidates.length)];
            setGaiaLastAskedName(guessChar.name);
            setGaiaLastAskedTrait(null);
            setCurrentMessage(`Penso di sapere chi è... è per caso ${guessChar.name}?`);
            return;
        }

        const traitStats = ALL_TRAITS.map(t => {
            const count = gaiaCandidates.filter(c => !!c.traits[t]).length;
            return { trait: t, count };
        }).filter(s => s.count > 0 && s.count < gaiaCandidates.length);

        if (traitStats.length === 0) {
            const randomGuess = gaiaCandidates[0];
            setGaiaLastAskedName(randomGuess.name);
            setCurrentMessage(`Sei tu ${randomGuess.name}?`);
            return;
        }

        const target = gaiaCandidates.length / 2;
        traitStats.sort((a, b) => Math.abs(a.count - target) - Math.abs(b.count - target));
        
        const bestTrait = traitStats[0].trait;
        setGaiaLastAskedTrait(bestTrait);
        setGaiaLastAskedName(null);

        const labels: Record<Trait, string> = {
            CAPPELLO: "ha un cappello?", OCCHIALI: "porta gli occhiali?",
            CAPELLI_LUNGHI: "ha i capelli lunghi?", ORECCHINI: "ha gli orecchini?",
            BARBA: "ha la barba?", BAFFI: "ha i baffi?",
            BAMBINO: "è un bambino o una bambina?", SORRISO: "sta sorridendo?",
            UOMO: "è un uomo?", DONNA: "è una donna?",
            ANZIANO: "è una persona anziana?", SENZA_CAPELLI: "è senza capelli?",
            BIONDO: "ha i capelli biondi?", MORO: "ha i capelli scuri?",
            CAPELLI_ROSSI: "ha i capelli rossi?", TRECCE: "ha le trecce?",
            CODA: "ha la coda ai capelli?", SALOPETTE: "indossa una salopette?",
            GIUBBOTTO: "ha un giubbotto?", MAGLIA_ROSSA: "ha la maglietta rossa?",
            MAGLIA_BLU: "ha la maglietta blu?", MAGLIA_VERDE: "ha la maglietta verde?",
            MAGLIA_GIALLA: "ha la maglietta gialla?"
        };
        
        setCurrentMessage(`Tocca a me! Il tuo personaggio ${labels[bestTrait]}`);
    };

    const handlePlayerResponse = (answer: boolean) => {
        if (gaiaLastAskedName) {
            if (answer && playerTarget && gaiaLastAskedName === playerTarget.name) {
                showTemporaryResponse("INDOVINATO");
                setTimeout(() => triggerLossSequence(playerTarget), 1500);
                return;
            } else {
                setGaiaCandidates(prev => prev.filter(c => c.name !== gaiaLastAskedName));
                showTemporaryResponse("SBAGLIATO");
            }
        } else if (gaiaLastAskedTrait) {
            setGaiaCandidates(prev => prev.filter(c => 
                answer ? !!c.traits[gaiaLastAskedTrait] : !c.traits[gaiaLastAskedTrait]
            ));
        }

        setTurn('PLAYER');
        setCurrentMessage("");
    };

    const handleSendMessage = () => {
        if (!inputText.trim() || isThinking) return;
        analyzeQuestion(inputText);
        setInputText('');
    };

    const handleGuessCharacter = (char: GuessWhoCharacter) => {
        setIsGuessModalOpen(false);
        if (aiTarget && char.id === aiTarget.id) {
            triggerWinSequence(aiTarget);
        } else {
            showTemporaryResponse("SBAGLIATO");
            setIsFlipped(prev => ({ ...prev, [char.id]: true }));
            setTimeout(() => startAiTurn(), 2200);
        }
    };

    const BackgroundLayer = () => (
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url("${GAME_BG}")` }}
        />
    );

    if (gameState === 'SELECTING') {
        return (
            <div className="w-full h-full relative flex flex-col items-center overflow-hidden bg-black">
                <BackgroundLayer />
                {/* INTESTAZIONE SELEZIONE - RESTRUTTURATA */}
                <div className="relative z-10 w-full pt-[70px] md:pt-[105px] px-4 md:px-10 flex flex-row items-center justify-between shrink-0">
                    <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none">
                        <img src={BTN_BACK_ARCADE_IMG} alt="Torna in Sala Giochi" className="h-16 md:h-32 w-auto drop-shadow-2xl" />
                    </button>
                    <div className="text-right flex-1 pl-4">
                        <h2 className="text-2xl md:text-5xl font-cartoon text-red-600 uppercase tracking-tighter leading-none" style={{ WebkitTextStroke: '1.5px black', textShadow: '3px 3px 0px black' }}>Scegli il tuo personaggio!</h2>
                        <p className="text-white font-black text-[10px] md:text-lg mt-1 drop-shadow-md" style={{ WebkitTextStroke: '0.5px black' }}>Tocca chi vuoi far indovinare a Gaia</p>
                    </div>
                </div>

                {/* GRIGLIA PERSONAGGI */}
                <div className="relative z-10 flex-1 w-full max-w-5xl px-2 py-2 flex items-center justify-center min-h-0">
                    <div className="grid grid-cols-5 grid-rows-4 gap-1.5 md:gap-3 w-full h-full max-h-full">
                        {gameCharacters.map(char => (
                            <button key={char.id} onClick={() => handleSelectPlayerChar(char)} className="bg-white rounded-lg border-2 md:border-4 border-yellow-400 overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-lg flex flex-col min-h-0">
                                <div className="flex-1 w-full flex items-center justify-center overflow-hidden bg-white">
                                    <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="bg-yellow-400 py-0.5 md:py-1 text-center shrink-0 border-t-2 border-black/10">
                                    <span className="font-black text-[7px] md:text-10px text-blue-900 uppercase truncate px-0.5 block">{char.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative flex flex-col overflow-hidden select-none bg-black">
            <BackgroundLayer />
            
            <style>{`
                @keyframes confetti-blow {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(720deg); opacity: 0; }
                }
                .preserve-3d { transform-style: preserve-3d; }
                .rotate-down { transform: rotateX(-105deg) translateY(10px); }
                .rotate-x-0 { transform: rotateX(0deg); }
            `}</style>

            {/* FASE REVEALING: IL PERSONAGGIO SI INGRANDISCE AL CENTRO CON CORIANDOLI */}
            {gameState === 'REVEALING' && winningChar && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
                    <ConfettiExplosion />
                    
                    {/* TESTO DI VITTORIA / SCONFITTA CENTRATO NELLO SCHERMO */}
                    <div className="absolute inset-0 flex items-center justify-center z-[130] pointer-events-none px-4">
                        <h3 className="text-4xl md:text-8xl font-cartoon text-white uppercase tracking-tighter text-center animate-in zoom-in duration-700 ease-out" style={{ WebkitTextStroke: '3px black', textShadow: '8px 8px 0px black' }}>
                            {winningChar.id === aiTarget?.id ? 'COMPLIMENTI, HAI VINTO!' : 'UPS! HA VINTO GAIA!'}
                        </h3>
                    </div>

                    <div className="relative flex flex-col items-center animate-in zoom-in duration-1000 ease-out opacity-40">
                        <div className="w-64 h-80 md:w-96 md:h-[480px] bg-white rounded-[40px] border-[12px] border-yellow-400 shadow-[0_0_80px_rgba(251,191,36,0.6)] flex flex-col overflow-hidden transform rotate-2">
                             <div className="flex-1 p-4 flex items-center justify-center bg-slate-50 overflow-hidden">
                                <img src={winningChar.image} alt={winningChar.name} className="w-full h-full object-contain drop-shadow-2xl" />
                             </div>
                             <div className="bg-yellow-400 py-4 text-center border-t-4 border-black/10">
                                <span className="font-black text-3xl md:text-5xl text-blue-900 uppercase">{winningChar.name}</span>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TABELLONE DI GIOCO - SPAZIO VERTICALE MASSIMIZZATO E SPOSTATO PIÙ IN BASSO */}
            <div className="relative z-10 flex-1 p-2 md:p-3 pt-[80px] md:pt-[110px] overflow-hidden flex flex-col items-center justify-center min-h-0">
                <div className="w-full h-auto max-h-full max-w-5xl mx-auto flex items-center justify-center min-h-0 relative bg-black/30 backdrop-blur-sm rounded-[40px] p-2 md:p-4 border-4 border-white/10 shadow-2xl">
                    <div className="grid grid-cols-5 gap-x-1.5 gap-y-2 md:gap-x-4 md:gap-y-4 w-full">
                        {gameCharacters.map((char) => {
                            const isDown = isFlipped[char.id];
                            return (
                                <div key={char.id} onClick={() => setZoomedChar(char)} className={`relative transition-all duration-700 preserve-3d cursor-zoom-in aspect-[3/4.2] ${isDown ? 'rotate-down desaturate' : 'rotate-x-0'}`} style={{ perspective: '1200px' }}>
                                    <div className={`w-full h-full bg-white rounded-lg border-2 md:border-4 shadow-xl flex flex-col overflow-hidden transition-all duration-500 ${isDown ? 'border-gray-500 opacity-50 grayscale brightness-50' : 'border-yellow-400'}`}>
                                        <div className="flex-1 flex items-center justify-center overflow-hidden bg-white">
                                            <img src={char.image} alt={char.name} className={`w-full h-full object-cover transition-all`} />
                                        </div>
                                        <div className={`p-0.5 md:p-1 text-center shrink-0 leading-none ${isDown ? 'bg-gray-300' : 'bg-yellow-400'}`}>
                                            <span className={`text-[7px] md:text-[10px] font-black uppercase block truncate tracking-tighter ${isDown ? 'text-gray-500' : 'text-blue-900'}`}>{char.name}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* AREA RISPOSTA GRAFICA - ANCORATA SOPRA IL BOX CHAT */}
            <div className="relative z-30 w-full h-20 md:h-28 flex justify-end px-12 md:px-24 shrink-0 -mb-1 md:-mb-2 pointer-events-none overflow-visible">
                <div className="h-full w-auto flex items-end">
                    {isThinking ? (
                        <img src={IMG_THINKING} alt="Sto pensando" className="h-full w-auto drop-shadow-2xl scale-[4.0] md:scale-[5.0] transform origin-bottom-right" />
                    ) : currentMessage === 'SÌ!' ? (
                        <img src={IMG_SI} alt="Sì!" className="h-full w-auto drop-shadow-2xl animate-in zoom-in scale-[4.0] md:scale-[5.0] transform origin-bottom-right" />
                    ) : currentMessage === 'NO.' ? (
                        <img src={IMG_NO} alt="No." className="h-full w-auto drop-shadow-2xl animate-in zoom-in scale-[4.0] md:scale-[5.0] transform origin-bottom-right" />
                    ) : currentMessage === 'UNKNOWN' ? (
                        <img src={IMG_UNKNOWN} alt="Non ho capito" className="h-full w-auto drop-shadow-2xl animate-in zoom-in scale-[4.0] md:scale-[5.0] transform origin-bottom-right" />
                    ) : currentMessage === 'INDOVINATO' ? (
                        <img src={IMG_CORRECT_GUESS} alt="Indovinato!" className="h-full w-auto drop-shadow-2xl animate-in zoom-in scale-[4.0] md:scale-[5.0] transform origin-bottom-right" />
                    ) : currentMessage === 'SBAGLIATO' ? (
                        <img src={IMG_WRONG_GUESS} alt="Sbagliato" className="h-full w-auto drop-shadow-2xl animate-in zoom-in scale-[4.0] md:scale-[5.0] transform origin-bottom-right" />
                    ) : (turn === 'AI' || gameState === 'STUCK') && currentMessage ? (
                        <div className="bg-white/90 backdrop-blur-sm border-4 border-blue-500 rounded-3xl p-3 md:p-4 shadow-xl animate-in slide-in-from-bottom-4 flex items-center gap-3 pointer-events-auto mb-4">
                            <img src={GAIA_BOX_ICON} alt="Gaia" className="w-12 h-12 md:w-20 md:h-20 object-contain" />
                            <p className="text-blue-900 font-black uppercase text-sm md:text-2xl leading-tight">{currentMessage}</p>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* CONSOLE COMANDI - ALTEZZA FISSA */}
            <div className="relative z-20 flex-shrink-0 bg-white/95 border-t-4 md:border-t-8 border-yellow-400 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.3)] w-full overflow-hidden h-40 md:h-48">
                <div className="flex flex-row w-full h-full">
                    {/* PARTE SINISTRA: TARGET PERSONAGGIO */}
                    <div className="w-20 md:w-48 bg-blue-50/80 border-r-2 md:border-r-4 border-blue-100 p-1 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[6px] md:text-[10px] font-black text-blue-400 uppercase mb-1 tracking-tighter">IL MIO PERSONAGGIO</span>
                        <div onClick={() => playerTarget && setZoomedChar(playerTarget)} className="w-full max-w-[50px] md:max-w-[100px] aspect-square bg-slate-50 rounded-lg border-2 border-blue-500 shadow-md overflow-hidden p-0 cursor-zoom-in active:scale-95 transition-transform">
                            <img src={playerTarget?.image} className="w-full h-full object-cover" alt="Target" />
                        </div>
                        <span className="text-[7px] md:text-[12px] font-black text-blue-900 mt-1 uppercase truncate w-full text-center px-0.5">{playerTarget?.name}</span>
                    </div>

                    {/* PARTE DESTRA: INTERAZIONE */}
                    <div className="flex-1 flex flex-col bg-white relative overflow-hidden h-full">
                        {/* Area testo Gaia o Input (se turno giocatore) */}
                        {turn === 'PLAYER' && gameState === 'PLAYING' && (
                            <div className="flex-1 flex items-center justify-center p-1">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setIsGuessModalOpen(true)}
                                        className="bg-red-600 hover:bg-red-500 text-white font-black w-24 h-14 md:w-40 md:h-20 rounded-xl border-2 md:border-4 border-black shadow-lg flex flex-col items-center justify-center text-center animate-pulse transition-transform hover:scale-105 active:scale-95 shrink-0 px-2"
                                    >
                                        <span className="text-[8px] md:text-xs uppercase leading-none">PROVO A</span>
                                        <span className="text-[10px] md:text-base uppercase leading-tight font-black">INDOVINARE</span>
                                    </button>

                                    <img src={GAIA_BOX_ICON} alt="Gaia" className="w-10 h-10 md:w-16 md:h-16 object-contain" />
                                    <div className="bg-blue-50 px-3 py-1.5 rounded-full border-2 border-blue-200">
                                        <p className="text-[9px] md:text-base font-bold text-blue-900 uppercase">
                                            {isThinking ? "Fammi pensare..." : (currentMessage && !['SÌ!', 'NO.', 'UNKNOWN', 'INDOVINATO', 'SBAGLIATO'].includes(currentMessage) ? currentMessage : "Chiedimi qualcosa!")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Area Pulsanti (centrata nel campo bianco quando è turno AI) */}
                        <div className={`flex-1 w-full flex items-center justify-center transition-all bg-gray-50 border-t border-blue-100 ${turn === 'AI' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            {gameState === 'STUCK' ? (
                                <div className="w-full flex items-center justify-center gap-2 md:gap-6 h-full px-2">
                                    <button 
                                        onClick={initGame} 
                                        className="bg-green-500 text-white font-black px-4 md:px-8 py-2 rounded-xl border-b-4 border-green-700 shadow-md flex items-center justify-center gap-2 active:translate-y-0.5 active:border-b-0 transition-all text-xs md:text-xl uppercase"
                                    >
                                        <RotateCcw size={20} /> RICOMINCIA
                                    </button>
                                    <button 
                                        onClick={onBack} 
                                        className="bg-red-500 text-white font-black px-4 md:px-8 py-2 rounded-xl border-b-4 border-red-700 shadow-md flex items-center justify-center gap-2 active:translate-y-0.5 active:border-b-0 transition-all text-xs md:text-xl uppercase"
                                    >
                                        <LogOut size={20} /> CHIUDI
                                    </button>
                                </div>
                            ) : turn === 'AI' && (
                                <div className="w-full flex items-center justify-center h-full px-4">
                                    <div className="flex gap-4 md:gap-16 w-full h-full items-center justify-center">
                                        <button 
                                            onClick={() => handlePlayerResponse(true)} 
                                            className="hover:scale-105 active:scale-95 transition-transform outline-none h-full flex items-center justify-center"
                                        >
                                            <img src={BTN_YES_ACTION} alt="Sì" className="h-28 md:h-40 w-auto drop-shadow-xl" />
                                        </button>
                                        <button 
                                            onClick={() => handlePlayerResponse(false)} 
                                            className="hover:scale-105 active:scale-95 transition-transform outline-none h-full flex items-center justify-center"
                                        >
                                            <img src={BTN_NO_ACTION} alt="No" className="h-28 md:h-40 w-auto drop-shadow-xl" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input (se turno giocatore) */}
                        {turn === 'PLAYER' && !gameState.includes('STUCK') && (
                            <div className="h-12 md:h-16 bg-gray-50 border-t border-blue-100 p-1 md:p-2 flex items-center gap-2 shrink-0">
                                <div className="flex w-full items-center gap-1 md:gap-3 h-full">
                                    <div className="flex-1 flex gap-1 h-full items-center">
                                        <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !isThinking && handleSendMessage()} placeholder="Chiedi a Gaia..." className="flex-1 min-w-0 bg-white border-2 border-blue-200 rounded-xl px-3 h-full font-bold text-blue-900 focus:outline-none focus:border-blue-500 text-[11px] md:text-lg" />
                                        <button onClick={handleSendMessage} disabled={!inputText.trim() || isThinking} className="bg-blue-600 text-white px-3 md:px-8 h-full rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center shrink-0"><Send size={22} /></button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer Indietro - Svuotato per rimuovere il tasto durante il gioco attivo */}
                <div className="bg-gray-100 flex justify-start p-1 pl-4 border-t border-slate-200 shrink-0 h-12 md:h-16 items-center">
                </div>
            </div>

            {/* MODALE INDOVINA PERSONAGGIO */}
            {isGuessModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-4xl rounded-[30px] border-4 border-8 border-yellow-400 p-4 flex flex-col max-h-[90vh] shadow-2xl relative">
                        <button onClick={() => setIsGuessModalOpen(false)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full border-2 border-black hover:scale-110 active:scale-90 transition-transform z-10"><X size={22} strokeWidth={4} /></button>
                        <div className="text-left mb-4 pr-12"><h2 className="text-xl md:text-4xl font-black text-blue-600 uppercase tracking-tighter">Chi è il personaggio di Gaia?</h2></div>
                        <div className="flex-1 grid grid-cols-5 gap-1.5 md:gap-3 p-1 content-start overflow-hidden">
                            {gameCharacters.map(char => {
                                const scartato = isFlipped[char.id];
                                return (
                                    <button key={char.id} onClick={() => !scartato && handleGuessCharacter(char)} disabled={scartato} className={`bg-white rounded-lg border-2 md:border-4 p-0 transition-all flex flex-col h-24 md:h-40 justify-center shadow-md overflow-hidden ${scartato ? 'border-gray-200 opacity-20 grayscale cursor-not-allowed' : 'border-blue-400 hover:border-yellow-400'}`}>
                                        <div className="flex-1 w-full flex items-center justify-center overflow-hidden bg-white">
                                            <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="bg-white py-1">
                                            <span className={`font-black text-[7px] md:text-xs uppercase truncate w-full text-center block ${scartato ? 'text-gray-300' : 'text-blue-900'}`}>{char.name}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* POPUP ZOOM PERSONAGGIO */}
            {zoomedChar && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setZoomedChar(null)}>
                    <div className="bg-white rounded-[40px] border-8 border-yellow-400 p-0 md:p-0 shadow-2xl relative max-w-sm w-full animate-in zoom-in duration-300 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <button onClick={setZoomedChar.bind(null, null)} className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full border-4 border-white shadow-lg hover:scale-110 active:scale-90 transition-transform z-10"><X size={24} strokeWidth={4} /></button>
                        <div className="aspect-square w-full bg-slate-50 overflow-hidden">
                            <img src={zoomedChar.image} alt={zoomedChar.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="bg-yellow-400 py-6 text-center border-t-4 border-black/10">
                            <h3 className="text-3xl md:text-5xl font-cartoon text-blue-900 uppercase tracking-tighter drop-shadow-sm">{zoomedChar.name}</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* VITTORIA / SCONFITTA OVERLAY */}
            {(gameState === 'WON' || gameState === 'LOST') && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-blue-600/90 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
                    <div className="bg-white p-8 rounded-[40px] border-8 border-yellow-400 text-center shadow-2xl flex flex-col items-center max-w-sm w-full mx-auto relative overflow-hidden">
                        {gameState === 'WON' ? (
                            <>
                                <img src={IMG_VICTORY_REWARD} alt="Vittoria" className="w-48 h-auto mb-4 drop-shadow-xl" />
                                <div className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black text-2xl border-2 border-black mb-8 shadow-lg">+10 🪙</div>
                            </>
                        ) : (
                            <>
                                <img src={IMG_GAIA_WINS} alt="Gaia Vince" className="w-48 h-auto mb-4 drop-shadow-xl" />
                                <h2 className="text-3xl md:text-5xl font-black text-red-600 mb-2 uppercase text-center leading-none">GAIA VINCE!</h2>
                                <p className="text-gray-600 font-bold mb-8 text-center">Gaia ha indovinato che il tuo personaggio era {playerTarget?.name}!</p>
                            </>
                        )}
                        
                        <div className="flex flex-row gap-4 w-full justify-center">
                            <button 
                                onClick={onBack} 
                                className="hover:scale-105 active:scale-95 transition-all outline-none flex-1 max-w-[160px]"
                            >
                                <img src={EXIT_BTN_IMG} alt="Sala Giochi" className="w-full h-auto drop-shadow-lg" />
                            </button>
                            <button 
                                onClick={initGame} 
                                className="hover:scale-105 active:scale-95 transition-all outline-none flex-1 max-w-[160px]"
                            >
                                <img src={BTN_PLAY_AGAIN_IMG} alt="Rigioca" className="w-full h-auto drop-shadow-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuessWhoGame;
