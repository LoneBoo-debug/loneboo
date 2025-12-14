
import React, { useEffect } from 'react';
import { ArrowLeft, Map, Home, Gamepad2, ShoppingBag, BookOpen, Music, Palette, MessageCircle, Star, Save, QrCode, Sparkles, AlarmClock } from 'lucide-react';
import { AppView } from '../types';

interface GuidePageProps {
    setView: (view: AppView) => void;
}

const GuidePage: React.FC<GuidePageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black text-boo-orange mb-3" style={{ textShadow: "3px 3px 0px black" }}>
           Guida all'Avventura
        </h2>
        <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-5 py-2 rounded-full text-base font-black border-2 border-black shadow-sm uppercase tracking-wide">
             <BookOpen size={20} />
             <span>Come Usare l'App</span>
        </div>
      </div>

      <div className="space-y-8">

        {/* 1. MAPPA CITTÀ */}
        <div className="bg-white rounded-[30px] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#60A5FA] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Map size={120} /></div>
            
            <h3 className="text-2xl font-black text-blue-600 mb-4 flex items-center gap-2">
                <Map className="fill-blue-100" /> 1. Città Colorata (La Mappa)
            </h3>
            <p className="text-gray-700 font-medium mb-4 leading-relaxed">
                Questa è la schermata principale per esplorare il mondo esterno. Clicca sui vari edifici per entrare nelle sezioni:
            </p>
            <ul className="grid md:grid-cols-2 gap-3 text-sm font-bold text-gray-600">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full"></span> Torre Magica: Giochi con l'Intelligenza Artificiale (Dadi, Caccia al Tesoro).</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Cinema: Guarda tutti i video e cartoni di Lone Boo.</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Parco Giochi: Minigiochi per guadagnare gettoni!</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-pink-500 rounded-full"></span> Discoteca: Suona strumenti musicali e crea ritmi.</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Accademia: Scarica e stampa disegni da colorare.</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Museo: Guarda i disegni inviati dagli altri bambini.</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span> Info Point: Chatta con Lone Boo!</li>
            </ul>
        </div>

        {/* 2. ECONOMIA DI GIOCO */}
        <div className="bg-white rounded-[30px] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#10B981] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Gamepad2 size={120} /></div>

            <h3 className="text-2xl font-black text-green-600 mb-4 flex items-center gap-2">
                <Gamepad2 className="fill-green-100" /> 2. Parco Giochi & Edicola
            </h3>
            <div className="space-y-4 text-gray-700 font-medium">
                <p>
                    Nel <strong>Parco Giochi</strong> trovi tanti minigiochi educativi (Quiz, Memory, Matematica, ecc.). 
                    Giocando, puoi vincere dei <strong>Gettoni d'Oro 🪙</strong>.
                </p>
                <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
                    <p className="text-sm font-bold uppercase text-green-800 mb-2">Cosa fare all'Edicola:</p>
                    <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li>Compra <strong>Pacchetti di Figurine</strong> con i tuoi gettoni.</li>
                        <li>Completa l'<strong>Album</strong> per sbloccare livelli segreti!</li>
                        <li>Se trovi <strong>5 doppioni</strong>, puoi scambiarli per un pacchetto gratis.</li>
                        <li>Completa il <strong>Volume 1</strong> per sbloccare il Volume 2 (Gold)!</li>
                    </ol>
                </div>
            </div>
        </div>

        {/* 3. SALVATAGGI (IMPORTANTE) */}
        <div className="bg-white rounded-[30px] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#A855F7] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Save size={120} /></div>

            <h3 className="text-2xl font-black text-purple-600 mb-4 flex items-center gap-2">
                <Save className="fill-purple-100" /> 3. Come Salvare (La Tessera)
            </h3>
            <p className="text-gray-700 font-medium mb-4">
                <strong>ATTENZIONE:</strong> I tuoi progressi (gettoni, figurine) sono salvati solo sul tuo telefono. Se cambi dispositivo o cancelli la cronologia, rischi di perderli!
            </p>
            <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                <p className="text-sm font-black text-purple-800 mb-2 uppercase flex items-center gap-2">
                    <QrCode size={16}/> Ecco come mettere i dati al sicuro:
                </p>
                <ol className="list-decimal pl-5 space-y-3 text-sm font-bold text-gray-600">
                    <li>Vai all'<strong>Edicola</strong> e tocca <strong>TESSERA</strong>.</li>
                    <li>Crea il tuo <strong>Avatar</strong> personalizzato.</li>
                    <li>Tocca <strong>SCARICA TESSERA</strong> per salvare l'immagine del tuo passaporto (contiene un QR Code segreto).</li>
                    <li>
                        Per recuperare i dati (o passarli su un altro telefono), vai all'Edicola e premi <strong>SCANSIONA</strong> o <strong>CARICA</strong> usando la tessera salvata.
                    </li>
                </ol>
            </div>
        </div>

        {/* 4. CASA DI BOO */}
        <div className="bg-white rounded-[30px] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#F97316] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Home size={120} /></div>

            <h3 className="text-2xl font-black text-orange-600 mb-4 flex items-center gap-2">
                <Home className="fill-orange-100" /> 4. La Casa di Boo
            </h3>
            <p className="text-gray-700 font-medium mb-4">
                Entra nella casa per esplorare le 4 stanze principali. Toccando gli oggetti (frigo, lavandino, baule...) attiverai minigiochi segreti!
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                    <strong className="block text-orange-800 mb-1">Salotto 🛋️</strong>
                    <span className="text-sm text-gray-600">Guarda la TV, ascolta la radio e incontra gli amici di Boo.</span>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                    <strong className="block text-orange-800 mb-1">Camera da Letto 🛌</strong>
                    <span className="text-sm text-gray-600">Apri il baule dei travestimenti, usa il telescopio e leggi le fiabe.</span>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                    <strong className="block text-orange-800 mb-1">Cucina 🍳</strong>
                    <span className="text-sm text-gray-600">Cucina nel microonde, impara il riciclo e scopri i cibi sani.</span>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                    <strong className="block text-orange-800 mb-1">Bagno 🛁</strong>
                    <span className="text-sm text-gray-600">Lavati i denti con lo specchio magico, fai il bucato e gioca nella vasca.</span>
                </div>
            </div>
        </div>

        {/* 5. ALTRE SEZIONI */}
        <div className="bg-white rounded-[30px] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#FACC15] relative overflow-hidden">
            <h3 className="text-2xl font-black text-yellow-600 mb-4 flex items-center gap-2">
                <Star className="fill-yellow-100" /> 5. Altre Funzioni
            </h3>
            <ul className="space-y-3 text-gray-700 font-medium text-sm">
                <li className="flex items-start gap-2">
                    <span className="bg-cyan-100 p-1 rounded text-cyan-600 shrink-0"><MessageCircle size={16}/></span>
                    <span><strong>Chat con Boo:</strong> Parla con l'Intelligenza Artificiale di Boo! Risponde alle tue domande e racconta storie.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="bg-cyan-100 p-1 rounded text-cyan-600 shrink-0"><Palette size={16}/></span>
                    <span><strong>Fan Art:</strong> Vuoi inviarci un disegno? Usa il pulsante "Invia" nel Museo per scattare una foto al tuo capolavoro.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="bg-cyan-100 p-1 rounded text-cyan-600 shrink-0"><Sparkles size={16}/></span>
                    <span><strong>Torre Magica:</strong> Un luogo speciale con giochi basati sull'AI! Caccia al Tesoro fotografica, Dadi racconta-storie e Passaporto Fantasma.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="bg-cyan-100 p-1 rounded text-cyan-600 shrink-0"><AlarmClock size={16}/></span>
                    <span><strong>Sveglia Boo:</strong> Una modalità interattiva per dare il buongiorno, ballare con Boo e prepararsi con allegria!</span>
                </li>
            </ul>
        </div>

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

export default GuidePage;
