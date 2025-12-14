import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppView } from '../types';
import { CHARACTERS } from '../constants';

interface CharactersPageProps {
    setView: (view: AppView) => void;
}

const CharactersPage: React.FC<CharactersPageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black text-boo-orange mb-3" style={{ textShadow: "3px 3px 0px black" }}>
           I Miei Amici
        </h2>
        <p className="text-xl font-bold text-gray-600">
            Conosci tutti gli abitanti di Città Colorata!
        </p>
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CHARACTERS.map((char) => (
              <div 
                key={char.id} 
                className={`bg-white rounded-[30px] border-4 p-6 shadow-xl flex flex-col md:flex-row items-center gap-6 transform hover:scale-[1.02] transition-transform border-black`}
              >
                  {/* Image */}
                  <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative">
                      <div className={`absolute inset-0 rounded-full opacity-20 ${char.color.split(' ')[0]}`}></div>
                      <img 
                        src={char.image} 
                        alt={char.name} 
                        className="w-full h-full object-contain drop-shadow-md relative z-10"
                      />
                  </div>

                  {/* Info */}
                  <div className="text-center md:text-left">
                      <h3 className={`text-2xl md:text-3xl font-black mb-1 ${char.color.split(' ').find(c => c.startsWith('text-')) || 'text-gray-800'}`}>
                          {char.name}
                      </h3>
                      <span className="inline-block bg-black/5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                          {char.role}
                      </span>
                      <p className="text-gray-600 font-bold text-sm md:text-base leading-relaxed whitespace-pre-line">
                          {char.description}
                      </p>
                  </div>
              </div>
          ))}
      </div>

      {/* Footer Button - Points to BOO_LIVING_ROOM now */}
      <div className="flex justify-center mt-16">
          <button 
              onClick={() => { setView(AppView.BOO_LIVING_ROOM); window.scrollTo(0, 0); }}
              className="bg-red-500 text-white font-black py-4 px-10 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:shadow-none active:translate-y-1 transition-all flex items-center gap-3 text-xl"
          >
              <ArrowLeft size={28} strokeWidth={3} /> TORNA IN SALOTTO
          </button>
      </div>

    </div>
  );
};

export default CharactersPage;