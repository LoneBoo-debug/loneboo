
import React, { useEffect } from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { AppView } from '../types';

interface FAQPageProps {
    setView: (view: AppView) => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black text-boo-orange mb-2" style={{ textShadow: "3px 3px 0px black" }}>
           FAQ & Notice
        </h2>
        <div className="inline-flex items-center gap-2 bg-black/20 text-white px-4 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
             <HelpCircle size={16} />
             <span>Domande Frequenti</span>
        </div>
      </div>

      <div className="bg-white rounded-[30px] border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] text-gray-800 leading-relaxed font-sans">
        <div className="space-y-8">
            {faqs.map((faq, idx) => (
                <div key={idx}>
                    <h3 className="text-lg md:text-xl font-black text-boo-purple mb-2">{faq.q}</h3>
                    <p className="text-gray-600 font-medium whitespace-pre-wrap leading-relaxed">{faq.a}</p>
                </div>
            ))}
        </div>

        <div className="flex justify-center mt-12">
            <button 
                onClick={() => { setView(AppView.HOME); window.scrollTo(0, 0); }}
                className="bg-red-500 text-white font-black py-3 px-8 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
            >
                <ArrowLeft size={24} strokeWidth={3} /> TORNA ALLA HOME
            </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
