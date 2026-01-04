import React, { useState, Suspense, lazy } from 'react';
import { Rocket, Zap, Gamepad2, Book, Eye, Activity, Brain, Play, Star, Loader2, ArrowLeft, Hash } from 'lucide-react';
import WebGamePlayer from './WebGamePlayer';

// Lazy load dei giochi interni
const GuessWhoGame = lazy(() => import('./GuessWhoGame'));
const BingoGame = lazy(() => import('./BingoGame'));

const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const ARCADE_BG = 'https://i.postimg.cc/pLsrXpqT/dssala.jpg';

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
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/guesswho.webp',
        color: 'bg-blue-50',
        borderColor: 'border-blue-700',
        TagIcon: null,
        tagText: ''
    },
    {
        id: 'GAME_BINGO',
        title: 'Tombola',
        desc: 'Sfida Andrea e gli altri amici e fai Tombola!',
        isInternal: true,
        icon: '',
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/thumstmblnew.webp',
        color: 'bg-orange-50',
        borderColor: 'border-orange-600',
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
    }
];

const ArcadeConsole: React.FC<ArcadeConsoleProps> = ({ onBack, onEarnTokens }) => {
    const [activeGameId, setActiveGameId] = useState<string | null>(null);

    if (activeGameId) {
        const game = [...GAMES_EDUCATIONAL, ...GAMES_ARCADE].find(g => g.id === activeGameId);
        
        if (game) {
            if (game.isInternal) {
                const isGuessWho = game.id === 'GAME_GUESS_WHO';
                const isBingo = game.id === 'GAME_BINGO';
                return (
                    <div className="fixed inset-0 z-[70] bg-slate-900 flex flex-col animate-in fade-in duration-300">
                        {(!isGuessWho && !isBingo) && (
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
                                {game.id === 'GAME_BINGO' && <BingoGame onBack={() => setActiveGameId(null)} onEarnTokens={onEarnTokens} />}
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

    const wrapperStyle = "fixed inset-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

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
        <div className={wrapperStyle}>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            
            <img 
                src={ARCADE_BG} 
                alt="" 
                className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0" 
                draggable={false}
            />

            <div className="absolute top-20 md:top-28 left-4 z-50">
                <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform">
                    <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-12 w-auto drop-shadow-md" />
                </button>
            </div>

            <div className="w-full h-full overflow-y-auto no-scrollbar relative z-10">
                <div className="w-full min-h-full flex flex-col items-center max-w-5xl mx-auto p-4 pb-24 pt-48 md:pt-60">
                    <div className="w-full mb-8">
                        <div className="flex items-center gap-3 mb-4 pl-2">
                            <div className="bg-green-500 p-2 rounded-xl border-2 border-black shadow-md rotate-[-3deg]">
                                < Book size={24} className="text-white" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase drop-shadow-[2px_2px_0_black]" style={{ textShadow: "2px 2px 0px black" }}>SVILUPPATI PER TE</h2>
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
                            <h2 className="text-3xl md:text-4xl font-black text-white uppercase drop-shadow-[2px_2px_0_black]" style={{ textShadow: "2px 2px 0px black" }}>ESTERNI</h2>
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