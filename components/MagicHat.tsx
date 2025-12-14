
import React, { useEffect } from 'react';

const MagicHat: React.FC = () => {
  // Abilita la rotazione su mobile per questo gioco specifico
  useEffect(() => {
    document.body.classList.add('allow-landscape');
    return () => document.body.classList.remove('allow-landscape');
  }, []);

  return (
    <div className="w-full h-[75vh] md:h-[80vh] bg-gray-900 rounded-[30px] overflow-hidden border-8 border-purple-600 shadow-[0_0_30px_rgba(147,51,234,0.5)] flex flex-col relative animate-in zoom-in duration-300">
        
        {/* Header del gioco */}
        <div className="bg-purple-700 p-3 text-center border-b-4 border-purple-900 shrink-0 z-10 relative">
            <h3 className="text-white font-black text-xl md:text-3xl uppercase tracking-widest drop-shadow-md flex items-center justify-center gap-2">
                🏰 Scala la Torre ⚔️
            </h3>
        </div>

        {/* Area di Gioco (Iframe) */}
        <div className="flex-1 relative bg-black w-full overflow-hidden">
            <iframe
                src="https://www.madkidgames.com/full/hero-tower-wars-merge-puzzle"
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; encrypted-media; fullscreen"
                title="Scala la Torre"
                scrolling="no"
            />
        </div>
        
        {/* Footer info */}
        <div className="bg-purple-900 p-2 text-center shrink-0">
            <p className="text-purple-200 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                Risolvi i puzzle per sconfiggere i mostri e salvare la principessa!
            </p>
        </div>
    </div>
  );
};

export default MagicHat;
