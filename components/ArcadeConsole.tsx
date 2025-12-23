import React, { useState, Suspense, lazy } from 'react';
import { Rocket, Zap, Gamepad2, Book, Eye, Activity, Brain, Play, Star, Loader2, ArrowLeft } from 'lucide-react';
import WebGamePlayer from './WebGamePlayer';

// Lazy load dei giochi interni
const GuessWhoGame = lazy(() => import('./GuessWhoGame'));

const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const TITLE_IMG = 'https://i.postimg.cc/FsWZhj8P/salaghi-(1).png';
const ARCADE_BG = 'https://i.postimg.cc/prq8fzLQ/sfondoarcade.jpg';

interface ArcadeConsoleProps {
    onBack: () => void;
    onEarnTokens: (amount: number) => void;
}

interface GameInfo {
    id: string;
    title: string;
    desc: string;
    icon: string;
    image: string;
    color: string;
    borderColor: string;
    TagIcon: any;
    tagText: string;
    isInternal?: boolean;
    embedUrl?: string;
}

const GAMES_EDUCATIONAL: GameInfo[] = [
    {
        id: 'GAME_GUESS_WHO',
        title: 'Indovina Chi',
        desc: 'Gioca con Gaia al gioco dei personaggi',
        isInternal: true,
        icon: '',
        image: 'https://i.postimg.cc/J0xNNBnW/bandhe.jpg',
        color: 'bg-blue-50',
        borderColor: 'border-blue-700',
        TagIcon: null,
        tagText: ''
    },
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

const GAMES_ARCADE: GameInfo[] = [
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
    }
];

const ArcadeConsole: React.FC<ArcadeConsoleProps> = ({ onBack, onEarnTokens }) => {
    const [activeGameId, setActiveGameId] = useState<string | null>(null);

    if (activeGameId) {
        const game = [...GAMES_EDUCATIONAL, ...GAMES_ARCADE].find(g => g.id === activeGameId);
        
        if (game) {
            if (game.isInternal) {
                // Se è Indovina Chi, non mostriamo l'header scuro per lasciare spazio all'header globale
                const isGuessWho = game.id === 'GAME_GUESS_WHO';
                return (
                    <div className="fixed inset-0 z-[70] bg-slate-900 flex flex-col animate-in fade-in duration-300">
                        {!isGuessWho && (
                            <div className="flex items-center justify-between p-3 bg-slate-800 border-b-4 border-blue-500 shadow-lg shrink-0 z-20">
                                <button 
                                    onClick={() => setActiveGameId(null)}
                                    className="bg-red-500 text-white p-2 rounded-full border-2 border-white hover:scale-110 active:scale-95 transition-transform"
                                >
                                    <ArrowLeft size={24} strokeWidth={3} />
                                </button>
                                <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-widest truncate px-4">
                                    {game.title}
                                </h2>
                                <div className="w-10"></div>
                            </div>
                        )}
                        <div className="flex-1 overflow-hidden relative bg-white">
                            <Suspense fallback={
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Loader2 className="animate-spin text-blue-500 mb-2" size={48} />
                                    <span className="font-bold text-gray-500">Sto preparando il gioco...</span>
                                </div>
                            }>
                                {game.id === 'GAME_GUESS_WHO' && <GuessWhoGame onBack={() => setActiveGameId(null)} onEarnTokens={onEarnTokens} />}
                            </Suspense>
                        </div>
                    </div>
                );
            }

            const isArcade = GAMES_ARCADE.some(g => g.id === activeGameId);
            return (
                <WebGamePlayer 
                    src={game.embedUrl || ''} 
                    title={game.title} 
                    onBack={() => setActiveGameId(null)}
                    isFullScreen={isArcade}
                />
            );
        }
    }

    const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-hidden bg-cover bg-center z-[60]";

    const renderGameCard = (game: GameInfo) => (
        <div 
            key={game.id}
            onClick={() => setActiveGameId(game.id)}
            className={`
                relative bg-slate-800 rounded-3xl overflow-hidden border-4 ${game.borderColor} shadow-2xl 
                transform transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer group flex flex-col
            `}
        >
            <div className="relative h-32 md:h-40 overflow-hidden bg-black border-b-4 border-black/20">
                <img src={game.image} alt={game.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
                {game.tagText && (
                    <div className={`absolute top-2 right-2 ${game.color} text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-md uppercase tracking-wide flex items-center gap-1`}>
                        {game.TagIcon && <game.TagIcon size={12} />} {game.tagText}
                    </div>
                )}
            </div>
            <div className="p-3 relative bg-slate-900 flex-1 flex flex-col justify-center">
                {game.icon && (
                    <div className={`absolute -top-8 left-4 w-12 h-12 rounded-xl ${game.color} border-4 border-slate-900 flex items-center justify-center text-2xl shadow-lg z-10 group-hover:rotate-12 transition-transform`}>
                        {game.icon}
                    </div>
                )}
                <h3 className={`text-white font-black text-sm md:text-lg leading-tight mb-1 ${game.icon ? 'mt-3' : 'mt-0'}`}>{game.title}</h3>
                <p className="text-slate-400 text-[10px] md:text-xs font-bold line-clamp-2">{game.desc}</p>
            </div>
        </div>
    );

    return (
        <div className={wrapperStyle} style={{ backgroundImage: `url(${ARCADE_BG})` }}>
            <div className="absolute top-4 left-4 z-50">
                <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform">
                    <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-12 w-auto drop-shadow-md" />
                </button>
            </div>

            <div className="w-full h-full overflow-y-auto custom-scrollbar">
                <div className="w-full min-h-full flex flex-col items-center max-w-5xl mx-auto p-4 pb-24">
                    <div className="w-full flex flex-col items-center mb-6 relative z-10 pt-16">
                        <img 
                            src={TITLE_IMG} 
                            alt="Sala Giochi" 
                            className="w-72 md:w-96 h-auto hover:scale-105 transition-transform duration-300"
                            style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)' }}
                        />
                    </div>
                    <div className="w-full mb-8">
                        <div className="flex items-center gap-3 mb-4 pl-2">
                            <div className="bg-green-500 p-2 rounded-xl border-2 border-black shadow-md rotate-[-3deg]">
                                < Book size={24} className="text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white uppercase drop-shadow-[2px_2px_0_black]" style={{ textShadow: "2px 2px 0px black" }}>IMPARA</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {GAMES_EDUCATIONAL.map(game => renderGameCard(game))}
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex items-center gap-3 mb-4 pl-2">
                            <div className="bg-purple-500 p-2 rounded-xl border-2 border-black shadow-md rotate-[3deg]">
                                <Rocket size={24} className="text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white uppercase drop-shadow-[2px_2px_0_black]" style={{ textShadow: "2px 2px 0px black" }}>DIVERTITI</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {GAMES_ARCADE.map(game => renderGameCard(game))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArcadeConsole;