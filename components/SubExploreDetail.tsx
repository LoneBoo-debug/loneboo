
import React from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';

interface SubExploreDetailProps {
    title: string;
    setView: (view: AppView) => void;
    backView?: AppView;
    bgImage?: string;
    hideBanner?: boolean;
}

const SubExploreDetail: React.FC<SubExploreDetailProps> = ({ title, setView, backView = AppView.MAGIC_TOWER_SUB_EXPLORE, bgImage, hideBanner }) => {
    const BTN_BACK_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esicenigmi.webp';

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {bgImage && (
                <img 
                    src={bgImage} 
                    alt={title} 
                    className={`absolute inset-0 w-full h-full object-cover ${hideBanner ? 'opacity-100' : 'opacity-60'}`}
                />
            )}
            
            {!hideBanner ? (
                <div className="relative z-10 max-w-md w-full bg-slate-900/80 backdrop-blur-xl border-4 border-purple-900/50 rounded-[3rem] p-8 flex flex-col items-center gap-6 shadow-2xl">
                    <img src={OFFICIAL_LOGO} alt="Boo" className="w-32 h-32 animate-bounce" />
                    <h1 className="font-luckiest text-purple-400 text-4xl uppercase tracking-widest">{title}</h1>
                    <p className="text-purple-200/70 font-medium text-lg italic">
                        Questa area dei sotterranei è ancora avvolta nel mistero... torna presto per scoprire i suoi segreti!
                    </p>
                    <button 
                        onClick={() => setView(backView)}
                        className="mt-4 bg-purple-600 hover:bg-purple-500 text-white font-black px-8 py-3 rounded-full transition-all active:scale-95 shadow-lg uppercase tracking-widest"
                    >
                        Torna Indietro
                    </button>
                </div>
            ) : (
                <div className="absolute top-6 left-6 z-50">
                    <button 
                        onClick={() => setView(backView)}
                        className="hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <img src={BTN_BACK_URL} alt="Indietro" className="w-20 h-20 md:w-32 h-auto drop-shadow-2xl" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SubExploreDetail;
