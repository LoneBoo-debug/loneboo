
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Rocket, Zap, Play, Trophy, Ghost, Brain, Gamepad2, Book, Eye, Activity, GraduationCap, Joystick, Star, Shield } from 'lucide-react';
import WebGamePlayer from './WebGamePlayer';

// We define the games available in this specific "Console"
type ArcadeGameId = string;
type Category = 'EDUCATIONAL' | 'ARCADE';

interface ArcadeConsoleProps {
    onBack: () => void;
    onEarnTokens: (amount: number) => void;
}

// CONFIGURAZIONE GIOCHI EDUCATIONAL
const GAMES_EDUCATIONAL = [
    {
        id: 'GAME_WHEEL',
        title: 'IL/GLI',
        desc: 'Scegli l\'articolo giusto!',
        embedUrl: 'https://wordwall.net/it/embed/5f2ef73269604ad0af0e9539ad5cebb9?themeId=46&templateId=30&fontStackId=0', 
        icon: '🅰️',
        image: 'https://i.postimg.cc/Y0ntHPq5/il-gli.jpg',
        color: 'bg-green-500',
        borderColor: 'border-green-700',
        TagIcon: Book,
        tagText: 'Grammatica'
    },
    {
        id: 'GAME_3',
        title: 'Logica Boo', 
        desc: 'Allena la mente!',
        embedUrl: 'https://wordwall.net/it/embed/58a6973134fb41f3876b1a4a6db40468?themeId=59&templateId=5&fontStackId=0',
        icon: '🧠',
        image: 'https://i.postimg.cc/2SBrs2pG/quiz-spettrale.jpg',
        color: 'bg-pink-500',
        borderColor: 'border-pink-700',
        TagIcon: Brain,
        tagText: 'Logica'
    },
    {
        id: 'GAME_SENSES',
        title: 'I 5 Sensi',
        desc: 'Scopri come percepisci il mondo!',
        embedUrl: 'https://wordwall.net/it/embed/02a784c9f0444416a82f84f36310a2e0?themeId=23&templateId=5&fontStackId=0',
        icon: '👀',
        image: 'https://i.postimg.cc/QMQstCdM/i-5-sensi.jpg',
        color: 'bg-orange-500',
        borderColor: 'border-orange-700',
        TagIcon: Eye,
        tagText: 'Scienza'
    },
    {
        id: 'GAME_BRAIN_IQ',
        title: 'Quiz per il cervello',
        desc: 'Sfida il tuo IQ!',
        embedUrl: 'https://www.madkidgames.com/full/brain-crazy-iq-challenge-puzzle',
        icon: '🤯',
        image: 'https://i.postimg.cc/mDVsYnMT/quiz-per-il-cervello.jpg',
        color: 'bg-yellow-500',
        borderColor: 'border-yellow-700',
        TagIcon: Brain,
        tagText: 'Logica'
    }
];

// CONFIGURAZIONE GIOCHI ARCADE
const GAMES_ARCADE = [
    {
        id: 'GAME_BUBBLE_SHOOTER',
        title: 'Scoppia le bolle',
        desc: 'Salva i procioni!',
        embedUrl: 'https://www.madkidgames.com/full/bubble-shooter-raccoon-rescue',
        icon: '🫧',
        image: 'https://i.postimg.cc/WbTZbqp0/scoppia-le-bolle.jpg',
        color: 'bg-sky-500',
        borderColor: 'border-sky-700',
        TagIcon: Gamepad2,
        tagText: 'Arcade'
    },
    {
        id: 'GAME_INFINITE_SPEED',
        title: 'Corsa Pazza',
        desc: 'Velocità senza limiti!',
        embedUrl: 'https://www.madkidgames.com/full/infinite-speed-no-limit-racer',
        icon: '🏎️',
        image: 'https://i.postimg.cc/v8hjFFZb/corsa-pazza.jpg',
        color: 'bg-rose-600',
        borderColor: 'border-rose-800',
        TagIcon: Rocket,
        tagText: 'Corse'
    },
    {
        id: 'GAME_EPIC_RUN',
        title: 'Corsa Epica',
        desc: 'Soldati in azione!',
        embedUrl: 'https://www.madkidgames.com/full/epic-runner-soldiers-shooting',
        icon: '🏃',
        image: 'https://i.postimg.cc/Kc09pP0Y/corsa-epica.jpg',
        color: 'bg-cyan-600',
        borderColor: 'border-cyan-800',
        TagIcon: Rocket,
        tagText: 'Runner'
    },
    {
        id: 'GAME_HOT_WHEELS',
        title: 'Macchinine Volanti',
        desc: 'Salti e acrobazie!',
        embedUrl: 'https://www.madkidgames.com/full/hot-wheels-race-off',
        icon: '🏎️',
        image: 'https://i.postimg.cc/RFXT8mQj/macchinine-volanti.jpg',
        color: 'bg-orange-600',
        borderColor: 'border-orange-800',
        TagIcon: Rocket,
        tagText: 'Corse'
    },
    {
        id: 'GAME_PUZZLE_COMBAT',
        title: 'Puzzle Combat',
        desc: 'Combatti unendo le gemme!',
        embedUrl: 'https://www.madkidgames.com/full/mystic-quest-match-3-rpg',
        icon: '⚔️',
        image: 'https://i.postimg.cc/tg9WHfg8/puzzle-combat.jpg',
        color: 'bg-violet-600',
        borderColor: 'border-violet-800',
        TagIcon: Zap,
        tagText: 'RPG'
    },
    {
        id: 'GAME_RALLY',
        title: 'Corsa Rally',
        desc: 'Nitro al massimo!',
        embedUrl: 'https://www.madkidgames.com/full/nitro-racing-3d-car-racing-games',
        icon: '🏁',
        image: 'https://i.postimg.cc/xjXs7kh6/corsa-rally.jpg',
        color: 'bg-lime-600',
        borderColor: 'border-lime-800',
        TagIcon: Rocket,
        tagText: 'Corse'
    },
    {
        id: 'GAME_MOTO',
        title: 'Gara di Moto',
        desc: 'Sfreccia in pista!',
        embedUrl: 'https://www.madkidgames.com/full/bike-race-racing-game',
        icon: '🏍️',
        image: 'https://i.postimg.cc/9frZH3X5/gara-di-moto.jpg',
        color: 'bg-red-500',
        borderColor: 'border-red-700',
        TagIcon: Rocket,
        tagText: 'Corse'
    },
    {
        id: 'GAME_TILES',
        title: 'Trova i 3 uguali',
        desc: 'Unisci le tessere!',
        embedUrl: 'https://www.madkidgames.com/full/tiles-match-3-zoo-tiles',
        icon: '🧩',
        image: 'https://i.postimg.cc/N0HFxQGS/trova-i-3-uguali.jpg',
        color: 'bg-indigo-500',
        borderColor: 'border-indigo-700',
        TagIcon: Gamepad2,
        tagText: 'Puzzle'
    },
    {
        id: 'GAME_PUZZLE_COLOR',
        title: 'Puzzle Colore',
        desc: 'Abbina gli animali!',
        embedUrl: 'https://www.madkidgames.com/full/wildlife-match-3-puzzle',
        icon: '🐼',
        image: 'https://i.postimg.cc/MH8QBv7p/puzzle-colore.jpg',
        color: 'bg-teal-500',
        borderColor: 'border-teal-700',
        TagIcon: Gamepad2,
        tagText: 'Puzzle'
    },
    {
        id: 'GAME_CHASE',
        title: 'Inseguimento',
        desc: 'Acchiappa i cattivi!',
        embedUrl: 'https://www.madkidgames.com/full/police-car-chase',
        icon: '🚓',
        image: 'https://i.postimg.cc/BbGKFXx7/inseguimento.jpg',
        color: 'bg-blue-800',
        borderColor: 'border-blue-950',
        TagIcon: Zap,
        tagText: 'Azione'
    },
    {
        id: 'GAME_POOL',
        title: 'Biliardo',
        desc: 'Manda le palle in buca!',
        embedUrl: 'https://www.madkidgames.com/full/real-pool-3d',
        icon: '🎱',
        image: 'https://i.postimg.cc/kg7vZhtg/biliardo.jpg',
        color: 'bg-emerald-700',
        borderColor: 'border-emerald-950',
        TagIcon: Activity,
        tagText: 'Sport'
    },
    {
        id: 'GAME_SNAKE',
        title: 'Snake',
        desc: 'Mangia e cresci!',
        embedUrl: 'https://www.madkidgames.com/full/snake-warz-io-games-snake-game',
        icon: '🐍',
        image: 'https://i.postimg.cc/RZbJRP7P/snake.jpg',
        color: 'bg-lime-500',
        borderColor: 'border-lime-700',
        TagIcon: Zap,
        tagText: 'Azione'
    },
    {
        id: 'GAME_WARRIORS',
        title: 'Difendi il Castello',
        desc: 'Proteggi le mura!',
        embedUrl: 'https://www.madkidgames.com/full/game-of-warriors',
        icon: '🏰',
        image: 'https://i.postimg.cc/y860ngwZ/difendi-il-castello.jpg',
        color: 'bg-stone-600',
        borderColor: 'border-stone-800',
        TagIcon: Zap,
        tagText: 'Azione'
    },
    {
        id: 'GAME_BUS_JAM',
        title: 'Riempi il bus',
        desc: 'Tutti a bordo!',
        embedUrl: 'https://www.madkidgames.com/full/bus-away-traffic-jam',
        icon: '🚌',
        image: 'https://i.postimg.cc/KcnL2Db8/riempi-il-bus.jpg',
        color: 'bg-yellow-500',
        borderColor: 'border-yellow-700',
        TagIcon: Brain,
        tagText: 'Puzzle'
    },
    {
        id: 'GAME_DUNE',
        title: 'Supera le dune',
        desc: 'Vola oltre le colline!',
        embedUrl: 'https://www.madkidgames.com/full/dune-tiny-wings',
        icon: '🏜️',
        image: 'https://i.postimg.cc/bvDDFQLJ/supera-le-dune.jpg',
        color: 'bg-amber-500',
        borderColor: 'border-amber-700',
        TagIcon: Rocket,
        tagText: 'Abilità'
    }
];

const ArcadeConsole: React.FC<ArcadeConsoleProps> = ({ onBack, onEarnTokens }) => {
    const [activeGameId, setActiveGameId] = useState<ArcadeGameId | null>(null);
    const [activeCategory, setActiveCategory] = useState<Category>('EDUCATIONAL');

    const handleBackToMenu = () => {
        setActiveGameId(null);
    };

    // --- HANDLE ORIENTATION PERMISSION ---
    useEffect(() => {
        // Unlock rotation if ANY game is active in this console
        if (activeGameId) {
            document.body.classList.add('allow-landscape');
        } else {
            document.body.classList.remove('allow-landscape');
        }
        
        return () => {
            document.body.classList.remove('allow-landscape');
        };
    }, [activeGameId]);

    // Get current list based on category
    const currentGames = activeCategory === 'EDUCATIONAL' ? GAMES_EDUCATIONAL : GAMES_ARCADE;

    // RENDER ACTIVE GAME
    const activeGameConfig = [...GAMES_EDUCATIONAL, ...GAMES_ARCADE].find(g => g.id === activeGameId);
    
    if (activeGameConfig) {
        // Determine if we should allow fullscreen mode (remove bezel) -> ONLY FOR ARCADE
        const isArcade = GAMES_ARCADE.some(g => g.id === activeGameId);

        return (
            <WebGamePlayer 
                src={activeGameConfig.embedUrl} 
                title={activeGameConfig.title} 
                onBack={handleBackToMenu}
                isFullScreen={isArcade} // Arcade games get full screen treatment
            />
        );
    }

    // RENDER MENU (GRID VIEW)
    return (
        <div className="w-full h-full flex flex-col bg-gray-900 text-white relative overflow-hidden">
            
            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
            }}></div>

            {/* Header */}
            <div className="w-full p-3 flex items-center justify-between z-20 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 shrink-0">
                <button onClick={onBack} className="bg-red-600 p-2 rounded-full hover:bg-red-500 transition-colors shadow-lg border-2 border-white">
                    <ArrowLeft size={20} strokeWidth={3} />
                </button>
                <h2 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase tracking-widest drop-shadow-md">
                    Sala Giochi
                </h2>
                <div className="w-9"></div>
            </div>

            {/* CATEGORY TABS */}
            <div className="w-full p-2 flex gap-2 z-20 shrink-0">
                <button 
                    onClick={() => setActiveCategory('EDUCATIONAL')}
                    className={`flex-1 py-3 rounded-xl font-black text-sm md:text-lg flex items-center justify-center gap-2 transition-all border-b-4 active:border-b-0 active:translate-y-1 ${activeCategory === 'EDUCATIONAL' ? 'bg-green-500 border-green-700 text-white shadow-lg' : 'bg-gray-800 border-gray-900 text-gray-400'}`}
                >
                    <GraduationCap size={20} /> EDUCATIONAL
                </button>
                <button 
                    onClick={() => setActiveCategory('ARCADE')}
                    className={`flex-1 py-3 rounded-xl font-black text-sm md:text-lg flex items-center justify-center gap-2 transition-all border-b-4 active:border-b-0 active:translate-y-1 ${activeCategory === 'ARCADE' ? 'bg-purple-600 border-purple-800 text-white shadow-lg' : 'bg-gray-800 border-gray-900 text-gray-400'}`}
                >
                    <Joystick size={20} /> ARCADE
                </button>
            </div>

            {/* GRID LAYOUT LIST */}
            <div className="flex-1 overflow-y-auto w-full custom-scrollbar p-3">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto pb-20">
                    {currentGames.map((game) => (
                        <button
                            key={game.id}
                            onClick={() => setActiveGameId(game.id as ArcadeGameId)}
                            className={`
                                relative aspect-square rounded-2xl border-4 ${game.borderColor} shadow-lg overflow-hidden group hover:scale-[1.03] active:scale-95 transition-all flex flex-col
                                ${game.color}
                            `}
                        >
                            {/* Game Icon/Decor */}
                            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                                {(game as any).image ? (
                                    <img 
                                        src={(game as any).image} 
                                        alt={game.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <span className="text-6xl md:text-8xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        {game.icon}
                                    </span>
                                )}
                                
                                {/* Tag Badge */}
                                <div className="absolute top-2 right-2 bg-black/40 px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm border border-white/20 flex items-center gap-1">
                                    <game.TagIcon size={10} /> {game.tagText}
                                </div>
                            </div>

                            {/* Title Bar */}
                            <div className="bg-black/80 backdrop-blur-md p-2 border-t-2 border-white/10 w-full">
                                <h3 className="text-sm md:text-base font-black text-white uppercase tracking-wide leading-tight truncate">
                                    {game.title}
                                </h3>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-gray-400 text-[9px] md:text-[10px] font-bold truncate flex-1">
                                        {game.desc}
                                    </p>
                                    <Play size={12} className="text-white fill-white ml-1" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Rotation Hint Footer */}
            <div className="bg-gray-800 p-2 text-center border-t border-gray-700 shrink-0 z-20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2">
                    <Activity size={12} /> Ruota il telefono per giocare a schermo intero!
                </p>
            </div>
        </div>
    );
};

export default ArcadeConsole;
