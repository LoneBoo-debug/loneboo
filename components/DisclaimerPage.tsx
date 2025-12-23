
import React, { useEffect } from 'react';
import { Mail, CircleAlert, ShieldCheck, Scale, Database, ServerOff, X, FileText, Lock, Globe } from 'lucide-react';
import { AppView } from '../types';

const INFO_BG = 'https://i.postimg.cc/brjgmCV4/sfondoinfo.jpg';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const ICON_PRIVACY = 'https://i.postimg.cc/7hLmjsyy/prvcuccu-(1).png';

interface DisclaimerPageProps {
    setView: (view: AppView) => void;
}

const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExit = () => setView(AppView.INFO_MENU);

  return (
    <div 
        className="min-h-screen bg-cover bg-center bg-fixed pb-24"
        style={{ backgroundImage: `url(${INFO_BG})` }}
    >
      
      {/* FIXED EXIT BUTTON - Slightly reduced size */}
      <button 
          onClick={handleExit}
          className="fixed top-20 right-4 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
          aria-label="Indietro"
      >
          <img 
            src={BTN_CLOSE_IMG} 
            alt="Chiudi" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" 
          />
      </button>

      <div className="max-w-4xl mx-auto p-4 md:p-8 pt-32 animate-fade-in">

          <div className="text-center mb-12">
            <h2 
                className="text-4xl md:text-7xl font-cartoon text-white tracking-tight leading-none mb-3"
                style={{ WebkitTextStroke: '2px #ef4444', textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}
            >
               Note Legali & Privacy
            </h2>
            <div className="inline-flex items-center gap-2 bg-red-600/80 text-white px-6 py-2 rounded-full text-sm font-bold backdrop-blur-md border border-white/20 shadow-lg">
                 <img src={ICON_PRIVACY} alt="" className="w-8 h-8 object-contain" />
                 <span>Informativa Estesa</span>
            </div>
          </div>
        
          {/* 1. SEZIONE PRIVACY (CRITICA) - Translucent */}
          <div className="bg-white/70 backdrop-blur-md rounded-[30px] border-l-[8px] border-green-600 p-6 md:p-8 shadow-xl mb-8 border-y border-r border-white/30">
              <h3 className="text-2xl font-black text-green-900 mb-6 flex items-center gap-3">
                  <ShieldCheck className="text-green-600" size={32} /> 
                  Privacy Policy & Dati Minori
              </h3>
              
              <div className="space-y-6">
                  <div>
                      <h4 className="text-lg font-black text-green-700 mb-2 flex items-center gap-2"><ServerOff size={20}/> Architettura "Zero-Data"</h4>
                      <p className="text-gray-700 text-sm leading-relaxed font-bold">
                          Lone Boo opera secondo il principio di <strong>Minimizzazione dei Dati</strong>. Non possediamo un database utenti. L'app non richiede registrazione (email, telefono, password). 
                          Tutti i dati generati (progressi di gioco, disegni, avatar) vengono salvati <strong>esclusivamente nella memoria locale</strong> (LocalStorage) del dispositivo dell'utente.
                      </p>
                  </div>

                  <div>
                      <h4 className="text-lg font-black text-green-700 mb-2 flex items-center gap-2"><Globe size={20}/> Conformità GDPR & COPPA</h4>
                      <p className="text-gray-700 text-sm leading-relaxed font-bold mb-2">
                          L'applicazione è progettata per essere conforme alle normative internazionali sulla tutela dei minori online:
                      </p>
                      <ul className="list-disc pl-5 text-gray-600 text-xs space-y-1 font-black">
                          <li><strong>GDPR (UE):</strong> Nessun dato personale identificativo viene raccolto o processato sui nostri server senza consenso esplicito (che non richiediamo, non essendoci registrazione).</li>
                          <li><strong>COPPA (USA):</strong> Non raccogliamo dati comportamentali per scopi pubblicitari (behavioral targeting) verso minori di 13 anni.</li>
                          <li><strong>Cookie Policy:</strong> Non utilizziamo cookie di tracciamento di terze parti per profilazione pubblicitaria. Usiamo solo storage tecnico essenziale per il funzionamento del gioco.</li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="text-lg font-black text-green-700 mb-2 flex items-center gap-2"><Database size={20}/> Dati AI & Voce</h4>
                      <p className="text-gray-700 text-sm leading-relaxed font-bold">
                          Le interazioni con l'assistente "Lone Boo" (chat e voce) sono <strong>Stateless</strong> (senza memoria a lungo termine lato server). 
                          I messaggi vengono inviati alle API di Google Gemini per la generazione della risposta e immediatamente scartati. Non vengono utilizzati per addestrare modelli pubblici che potrebbero riesporre dati personali.
                      </p>
                  </div>
              </div>
          </div>

          {/* 2. TERMINI DI UTILIZZO - Translucent */}
          <div className="bg-white/70 backdrop-blur-md rounded-[30px] border-l-[8px] border-blue-500 p-6 md:p-8 shadow-xl mb-8 border-y border-r border-white/30">
              <h3 className="text-2xl font-black text-blue-900 mb-4 flex items-center gap-3">
                  <FileText className="text-blue-600" size={32} /> 
                  Termini di Utilizzo
              </h3>
              
              <div className="space-y-4">
                  <div>
                      <h5 className="font-black text-blue-800 text-sm uppercase mb-1">Finalità Educativa e Ludica</h5>
                      <p className="text-gray-600 text-sm font-bold">
                          Lone Boo è un progetto di intrattenimento. Sebbene contenga elementi educativi (giochi di matematica, logica), non sostituisce in alcun modo l'istruzione formale o il parere di professionisti dell'età evolutiva.
                      </p>
                  </div>

                  <div>
                      <h5 className="font-black text-blue-800 text-sm uppercase mb-1">Contenuti di Terze Parti</h5>
                      <p className="text-gray-600 text-sm font-bold">
                          L'app può visualizzare video tramite embed di YouTube. Tali contenuti sono soggetti ai termini di servizio di YouTube. L'app filtra i contenuti per mostrare solo video appropriati, ma non ha controllo diretto sulla piattaforma ospitante.
                      </p>
                  </div>

                  <div>
                      <h5 className="font-black text-blue-800 text-sm uppercase mb-1">Proprietà Intellettuale</h5>
                      <p className="text-gray-600 text-sm font-bold">
                          Tutti i personaggi, le grafiche, i loghi e le storie originali di "Lone Boo" sono proprietà intellettuale protetta. È vietato l'uso commerciale non autorizzato di tali asset.
                      </p>
                  </div>
              </div>
          </div>

          {/* 3. INFO PROPRIETARIO - Translucent */}
          <div className="bg-white/70 backdrop-blur-md rounded-[30px] border-l-[8px] border-gray-500 p-6 md:p-8 shadow-xl border-y border-r border-white/30">
              <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-3">
                  <CircleAlert className="text-gray-600" size={28} /> 
                  Informazioni Legali
              </h3>
              <div className="text-sm font-black text-gray-600 space-y-1">
                  <p><strong>Proprietario del servizio:</strong> Progetto Lone Boo</p>
                  <p><strong>Contatto Legale:</strong> <a href="mailto:privacy@loneboo.online" className="text-blue-600 underline">privacy@loneboo.online</a></p>
                  <p><strong>Hosting:</strong> Vercel Inc. (Serverless Infrastructure)</p>
                  <p><strong>Ultimo aggiornamento:</strong> 01 Gennaio 2025</p>
              </div>
          </div>

      </div>
    </div>
  );
};

export default DisclaimerPage;
