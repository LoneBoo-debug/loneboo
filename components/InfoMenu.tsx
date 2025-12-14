
import React, { useEffect } from 'react';
import { ArrowLeft, Info, Mail, ShieldAlert, Cpu, Tag, ExternalLink } from 'lucide-react';
import { AppView } from '../types';
import { APP_VERSION, CHANNEL_LOGO } from '../constants';

interface InfoMenuProps {
    setView: (view: AppView) => void;
}

const InfoMenu: React.FC<InfoMenuProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-6xl font-black text-boo-orange mb-3" style={{ textShadow: "3px 3px 0px black" }}>
           Centro Info
        </h2>
        <p className="text-xl font-bold text-gray-600">
            Tutto quello che c'è da sapere su Lone Boo!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* CHI SIAMO */}
          <button 
            onClick={() => setView(AppView.ABOUT)}
            className="group bg-yellow-400 p-6 rounded-[30px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:shadow-none active:translate-y-1 transition-all text-left flex items-start gap-4"
          >
              <div className="bg-white p-3 rounded-2xl border-2 border-black shrink-0">
                  <Info size={32} className="text-yellow-600" />
              </div>
              <div>
                  <h3 className="text-2xl font-black text-black uppercase mb-1 group-hover:underline decoration-4 decoration-white">Chi Siamo</h3>
                  <p className="font-bold text-black/70 leading-tight text-sm">
                      La storia del progetto, la missione educativa e il mondo di Città Colorata.
                  </p>
              </div>
          </button>

          {/* CONTATTI */}
          <a 
            href="mailto:support@loneboo.online"
            className="group bg-blue-500 p-6 rounded-[30px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:shadow-none active:translate-y-1 transition-all text-left flex items-start gap-4"
          >
              <div className="bg-white p-3 rounded-2xl border-2 border-black shrink-0">
                  <Mail size={32} className="text-blue-600" />
              </div>
              <div>
                  <h3 className="text-2xl font-black text-white uppercase mb-1 group-hover:underline decoration-4 decoration-white">Contatti</h3>
                  <p className="font-bold text-white/80 leading-tight text-sm">
                      Hai bisogno di aiuto o vuoi collaborare? Scrivici una mail!
                  </p>
              </div>
          </a>

          {/* DISCLAIMER */}
          <button 
            onClick={() => setView(AppView.DISCLAIMER)}
            className="group bg-red-500 p-6 rounded-[30px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:shadow-none active:translate-y-1 transition-all text-left flex items-start gap-4"
          >
              <div className="bg-white p-3 rounded-2xl border-2 border-black shrink-0">
                  <ShieldAlert size={32} className="text-red-600" />
              </div>
              <div>
                  <h3 className="text-2xl font-black text-white uppercase mb-1 group-hover:underline decoration-4 decoration-white">Disclaimer</h3>
                  <p className="font-bold text-white/80 leading-tight text-sm">
                      Informazioni legali, privacy policy e termini di utilizzo dell'app.
                  </p>
              </div>
          </button>

          {/* INFO TECNICHE */}
          <button 
            onClick={() => setView(AppView.TECH_INFO)}
            className="group bg-purple-600 p-6 rounded-[30px] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:shadow-none active:translate-y-1 transition-all text-left flex items-start gap-4"
          >
              <div className="bg-white p-3 rounded-2xl border-2 border-black shrink-0">
                  <Cpu size={32} className="text-purple-600" />
              </div>
              <div>
                  <h3 className="text-2xl font-black text-white uppercase mb-1 group-hover:underline decoration-4 decoration-white">Tecnologia</h3>
                  <p className="font-bold text-white/80 leading-tight text-sm">
                      Come è stata costruita l'app? Dettagli tecnici per i più curiosi.
                  </p>
              </div>
          </button>

      </div>

      {/* VERSION BADGE & COPYRIGHT */}
      <div className="flex flex-col items-center justify-center gap-4 opacity-100">
          <div className="bg-white px-6 py-2 rounded-full border-2 border-gray-300 flex items-center gap-2 shadow-sm">
              <Tag size={16} className="text-gray-400" />
              <span className="font-mono font-bold text-gray-500">Versione App: <span className="text-black">{APP_VERSION}</span></span>
          </div>
          <p className="text-white text-xs font-bold text-center drop-shadow-md">
              © 2025 LoneBoo.online. Tutti i diritti riservati.<br/>
              Fatto con ❤️ e 👻 per tutti i bambini del mondo.
          </p>
      </div>

      {/* Footer Back Button */}
      <div className="flex justify-center mt-12">
          <button 
              onClick={() => { setView(AppView.HOME); window.scrollTo(0, 0); }}
              className="bg-gray-800 text-white font-black py-4 px-10 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:scale-105 active:shadow-none active:translate-y-1 transition-all flex items-center gap-2 text-xl"
          >
              <ArrowLeft size={28} strokeWidth={3} /> TORNA ALLA HOME
          </button>
      </div>

    </div>
  );
};

export default InfoMenu;
