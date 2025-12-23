
import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles, Heart, MapPin, MessageCircle } from 'lucide-react';
import { AppView } from '../types';

const INTRO_BOO_IMAGE = 'https://i.postimg.cc/1tgY3Nh1/boofrack-(1).png';

interface IntroPageProps {
    setView: (view: AppView) => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 animate-in zoom-in duration-500">
      
      {/* Main Card */}
      <div className="bg-white max-w-4xl w-full rounded-[40px] border-4 border-black p-6 md:p-12 shadow-[8px_8px_0px_0px_#8B5CF6] text-center relative overflow-hidden">
          
          {/* Decorative Background Elements inside card */}
          <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-yellow-300 rounded-full opacity-50 blur-xl"></div>
          <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 bg-cyan-300 rounded-full opacity-50 blur-xl"></div>

          {/* Hero Image */}
          <div className="relative w-40 h-40 md:w-56 md:h-56 mx-auto mb-6 transform -rotate-3 transition-transform hover:rotate-0 duration-300">
              <img 
                src={INTRO_BOO_IMAGE} 
                alt="Lone Boo" 
                className="w-full h-full object-contain drop-shadow-xl"
              />
              <Sparkles className="absolute top-0 right-0 text-yellow-400 w-10 h-10 animate-spin-slow" />
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-black text-boo-purple mb-6 leading-tight drop-shadow-sm font-cartoon">
              Ciao! Sono <span className="text-boo-orange">Lone Boo</span> 👻
          </h2>

          {/* Story Text */}
          <div className="text-base md:text-xl text-gray-700 font-bold leading-relaxed mb-8 space-y-4">
              <p>
                  Benvenuto nel mio piccolo mondo! 
                  Sai, io sono un fantasmino un po' strano... 
                  invece di fare "BUUU" per spaventare, faccio "WOW" per la meraviglia! ✨
              </p>
              <p>
                  Vivo a <span className="text-blue-500 font-black">Città Colorata</span>, un posto magico dove le case ballano, 
                  le nuvole sanno di zucchero filato e la musica non finisce mai.
              </p>
              <p className="text-boo-green">
                  Qui non c'è spazio per la paura, solo per il divertimento, 
                  tanti giochi e nuovi amici come te! ❤️
              </p>
          </div>

          {/* Action Buttons Row - Optimized for 3 items side-by-side */}
          <div className="flex flex-row gap-2 md:gap-4 justify-center w-full mt-4 items-stretch">
              
              {/* Back to Living Room Button */}
              <button 
                  onClick={() => setView(AppView.BOO_LIVING_ROOM)}
                  className="flex-1 group bg-red-500 text-white font-black text-xs md:text-lg py-3 px-1 md:px-4 rounded-xl md:rounded-full border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_black] md:shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 leading-tight"
              >
                  <ArrowLeft className="group-hover:-translate-x-1 transition-transform w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                  <span>TORNA IN SALOTTO</span>
              </button>

              {/* Enter City Button */}
              <button 
                  onClick={() => setView(AppView.CITY_MAP)}
                  className="flex-1 group bg-green-500 text-white font-black text-xs md:text-lg py-3 px-1 md:px-4 rounded-xl md:rounded-full border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_black] md:shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 leading-tight"
              >
                  <MapPin className="group-hover:-translate-y-1 transition-transform w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                  <span>VAI IN CITTÀ</span>
              </button>

              {/* Chat AI Button */}
              <button 
                  onClick={() => setView(AppView.CHAT)}
                  className="flex-1 group bg-cyan-500 text-white font-black text-xs md:text-lg py-3 px-1 md:px-4 rounded-xl md:rounded-full border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_black] md:shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 leading-tight"
              >
                  <MessageCircle className="group-hover:rotate-12 transition-transform w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                  <span>PARLIAMO</span>
              </button>
          </div>

          <div className="mt-6 flex justify-center gap-2 text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">
              <span>Musica</span> • <span>Giochi</span> • <span>Magia</span>
          </div>

      </div>
    </div>
  );
};

export default IntroPage;
