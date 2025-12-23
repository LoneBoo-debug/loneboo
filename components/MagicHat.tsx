
import React from 'react';
import { Construction, Sparkles } from 'lucide-react';

const TITLE_IMG = 'https://i.postimg.cc/1z388Hd8/cappellomgico-(1)-(1).png';
const CONSTRUCTION_IMG = 'https://i.postimg.cc/13NBmSgd/vidu-image-3059119613071461-(1).png';

const MagicHat: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in py-4">
        
        {/* Intestazione del Gioco */}
        <div className="text-center mb-8 flex flex-col items-center">
            <img 
                src={TITLE_IMG} 
                alt="Cappello Magico" 
                className="w-72 md:w-[450px] h-auto mb-4 drop-shadow-md" 
            />
            <p className="text-gray-600 font-bold text-lg">
                Quale sorpresa uscirà dal cappello?
            </p>
        </div>

        {/* Schermata segnaposto "Lavori in Corso" */}
        <div className="bg-white p-8 md:p-12 rounded-[40px] border-8 border-purple-300 shadow-[0_0_40px_rgba(168,85,247,0.3)] flex flex-col items-center text-center max-w-2xl relative overflow-hidden animate-in zoom-in duration-500">
            
            {/* Decorazione Sfondo */}
            <div className="absolute top-0 left-0 w-full h-4 bg-purple-100"></div>
            <div className="absolute bottom-0 left-0 w-full h-4 bg-purple-100"></div>
            
            <Sparkles className="absolute top-8 left-8 text-purple-200 animate-pulse" size={32} />
            <Sparkles className="absolute bottom-8 right-8 text-purple-200 animate-pulse delay-300" size={32} />

            <div className="w-48 h-48 md:w-64 md:h-64 mb-6 relative hover:scale-105 transition-transform duration-500">
                 <img 
                    src={CONSTRUCTION_IMG} 
                    alt="Lavori in corso" 
                    className="w-full h-full object-contain drop-shadow-xl" 
                 />
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-purple-600 mb-4 tracking-tight drop-shadow-sm">
                Magia in Corso! 🪄
            </h2>
            
            <p className="text-xl md:text-2xl font-bold text-gray-500 leading-relaxed max-w-md">
                Stiamo preparando un nuovo incantesimo per questo gioco.
            </p>
            
            <div className="mt-8 flex items-center gap-2 bg-purple-100 text-purple-700 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest border-2 border-purple-200">
                <Construction size={20} />
                <span>Torna Presto</span>
            </div>

        </div>
    </div>
  );
};

export default MagicHat;
