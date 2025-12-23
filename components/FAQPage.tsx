
import React, { useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { AppView } from '../types';

const INFO_BG = 'https://i.postimg.cc/brjgmCV4/sfondoinfo.jpg';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const ICON_FAQ = 'https://i.postimg.cc/hvFt5wmp/faqw-(1).png';

interface FAQPageProps {
    setView: (view: AppView) => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExit = () => setView(AppView.INFO_MENU);

  const faqs = [
    {
        q: "1. Cos’è Lone Boo?",
        a: "Lone Boo è un progetto creativo dedicato ai bambini e ragazzi dai 3 ai 13 anni. Produciamo video, storie animate, canzoni originali e contenuti educativi pensati per stimolare immaginazione, apprendimento e creatività."
    },
    {
        q: "2. Per quale fascia d’età sono pensati i contenuti?",
        a: "I contenuti di Lone Boo sono progettati per una fascia più ampia: dai primi anni della scuola dell’infanzia fino ai ragazzi della scuola media.\n\nDividiamo i contenuti in:\n\n• 3–6 anni: storie semplici, canzoni, filastrocche, video educativi dolci.\n• 7–10 anni: mini avventure, curiosità, prime sfide creative.\n• 11–13 anni: contenuti più dinamici, personaggi, storytelling evoluto e attività stimolanti."
    },
    {
        q: "3. Dove posso guardare i video di Lone Boo?",
        a: "I video sono disponibili sul canale YouTube ufficiale Lone Boo, aggiornato regolarmente con nuove storie, canzoni, miniserie e contenuti speciali."
    },
    {
        q: "4. Lone Boo è sicuro per i bambini e i ragazzi?",
        a: "Sì. Tutti i contenuti sono pensati per essere sicuri, positivi e adatti ai minori, senza temi violenti o linguaggi inappropriati. Le musiche, le immagini e le storie sono create per rispettare le sensibilità di ogni fascia d’età."
    },
    {
        q: "5. Pubblicate nuovi episodi ogni quanto?",
        a: "Il canale viene aggiornato regolarmente con nuove storie, filastrocche, serie animate, contenuti creativi e video speciali."
    },
    {
        q: "6. Si possono usare i video di Lone Boo in scuole o eventi?",
        a: "Sì, i contenuti possono essere mostrati liberamente in scuole, laboratori, centri educativi o eventi non commerciali. Per utilizzi commerciali è possibile contattarci tramite l’apposita sezione del sito."
    },
    {
        q: "7. Lone Boo offre prodotti o merchandising?",
        a: "Stiamo sviluppando prodotti dedicati (come mini-peluche e gadget ufficiali). Tutte le novità saranno annunciate sul sito e sui social ufficiali."
    },
    {
        q: "8. Come posso collaborare con Lone Boo?",
        a: "Per collaborazioni creative, animazione, doppiaggio, educazione o idee di progetto è possibile inviare una richiesta tramite la pagina Contatti."
    },
    {
        q: "9. Posso proporre una storia, un personaggio o un’idea?",
        a: "Certo! Accettiamo volentieri suggerimenti da bambini, genitori, educatori e ragazzi appassionati. È possibile inviare le proposte tramite la sezione contatti del sito."
    },
    {
        q: "10. Come posso sostenere Lone Boo?",
        a: "Puoi aiutarci iscrivendoti al canale YouTube, condividendo i video e seguendoci sui social. A breve sarà disponibile anche uno shop ufficiale con prodotti dedicati."
    }
  ];

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
          
          {/* Header - Unified Style */}
          <div className="text-center mb-10">
            <h2 
                className="text-4xl md:text-7xl font-cartoon text-white tracking-tight leading-none mb-2"
                style={{ WebkitTextStroke: '2px #ef4444', textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}
            >
               FAQ
            </h2>
            <div className="inline-flex items-center gap-2 bg-cyan-600/80 text-white px-6 py-2 rounded-full text-lg font-bold backdrop-blur-md border border-white/20 shadow-lg">
                 <img src={ICON_FAQ} alt="" className="w-8 h-8 object-contain" />
                 <span>Domande Frequenti</span>
            </div>
          </div>

          <div className="space-y-6">
              {faqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="border-l-[8px] border-cyan-500 bg-white/70 backdrop-blur-md pl-6 py-6 pr-6 rounded-r-2xl shadow-xl border-y border-r border-white/30"
                  >
                      <h3 className="text-xl md:text-2xl font-black text-cyan-800 mb-2 leading-tight tracking-tight">{faq.q}</h3>
                      <p className="text-gray-700 font-bold whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                          {faq.a}
                      </p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default FAQPage;
