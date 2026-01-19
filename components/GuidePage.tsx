
import React, { useEffect } from 'react';
import { 
  Ghost, Map, Home, TrainFront, Coins, ShieldCheck, Palette, 
  School, Gamepad2, Wand2, Tv, Music, Store, 
  Utensils, Bed, Library, Heart, Star, Accessibility, Moon,
  CheckCircle2, Info, QrCode, Lock
} from 'lucide-react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';

const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

interface GuidePageProps {
    setView: (view: AppView) => void;
}

const GuidePage: React.FC<GuidePageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-y-auto no-scrollbar">
      
      {/* SFONDO AZZURRO INTENSO E FISSO */}
      <div className="fixed inset-0 bg-[#bae6fd] z-0"></div>
      
      {/* STRATO EFFETTO SPECCHIO/VETRO */}
      <div className="fixed inset-0 bg-white/20 backdrop-blur-[45px] z-[1] pointer-events-none border-t-8 border-white/30"></div>
      
      {/* TASTO CHIUDI FISSO */}
      <button 
          onClick={() => setView(AppView.HOME)}
          className="fixed top-20 right-4 z-[100] hover:scale-110 active:scale-95 transition-all outline-none"
          aria-label="Chiudi"
      >
          <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" />
      </button>

      {/* CONTENUTO SCROLLABILE */}
      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-6 pt-32 md:pt-40 pb-32">
        
        {/* Intestazione Principale */}
        <div className="text-center mb-12">
            <h2 
                className="text-4xl md:text-6xl font-cartoon text-[#ef4444] tracking-tight leading-none"
                style={{ 
                    WebkitTextStroke: '1.5px white', 
                    textShadow: '6px 6px 0px rgba(0,0,0,0.1)',
                }}
            >
               Guida Ufficiale
            </h2>
            <div className="inline-block bg-white/80 border-4 border-white px-6 py-1 rounded-full shadow-md mt-3">
                <p className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-tighter flex items-center gap-2">
                    <Star className="animate-spin-slow" size={16} /> Scopri come giocare e imparare
                </p>
            </div>
        </div>

        <div className="space-y-6">
            
            {/* 1. COS'È LONE BOO WORLD */}
            <section className="bg-white/50 backdrop-blur-md p-6 rounded-[35px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-4 mb-4 border-b-2 border-white/50 pb-2">
                    <Ghost className="text-purple-600" size={32} />
                    <h3 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">👻 Cos'è Lone Boo World?</h3>
                </div>
                <p className="text-base md:text-xl font-bold text-slate-700 leading-relaxed">
                    Lone Boo World è un universo digitale sicuro e colorato dove i bambini dai 3 ai 10 anni possono imparare, giocare e creare. Il protagonista è Lone Boo, un fantasmino gentile che non spaventa, ma accompagna i piccoli in ogni avventura. L’app si basa su un sistema a "viste" interattive che ricordano i libri pop-up o i cartoni animati, dove ogni oggetto può nascondere un gioco o una lezione.
                </p>
            </section>

            {/* 2. CITTÀ COLORATA */}
            <section className="bg-white/50 backdrop-blur-md p-6 rounded-[35px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-4 mb-4 border-b-2 border-white/50 pb-2">
                    <Map className="text-blue-600" size={32} />
                    <h3 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">🗺️ Il Cuore dell'App: Città Colorata</h3>
                </div>
                <p className="text-base md:text-xl font-bold text-slate-700 mb-6">
                    La Mappa della Città è il punto di partenza. Da qui puoi toccare i vari edifici per accedere a mondi diversi:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { icon: School, title: "La Scuola Elementare Arcobaleno", desc: "Un vero percorso didattico diviso in 5 classi (1ª-5ª elementare). Ogni aula offre lezioni di Italiano, Matematica, Storia, Geografia e Scienze. Le lezioni sono lette a voce, hanno testi grandi e terminano con quiz per verificare l'apprendimento. C'è anche la Maestra Ornella (AI), a cui i bambini possono fare domande dirette." },
                        { icon: Gamepad2, title: "Il Parco Giochi", desc: "Una vasta sala giochi dove allenare la mente. Include classici come Memory, Tris, Forza 4, Scacchi, Dama, Simon e giochi moderni come Boo Runner o la Tombola contro gli amici del bosco." },
                        { icon: Wand2, title: "La Torre Magica (AI Magic)", desc: "Qui la tecnologia diventa magia. Puoi lanciare i Dadi delle Storie per inventare favole, partecipare a una Caccia al Tesoro reale (usando la fotocamera per trovare oggetti in casa) o creare nuovi oggetti nel Cappello Magico." },
                        { icon: Tv, title: "Il Cinema", desc: "Una galleria video sempre aggiornata con le canzoni originali, i balletti e le storie animate di Lone Boo dal canale ufficiale." },
                        { icon: Music, title: "La Discoteca (Sound Zone)", desc: "Un'area dedicata alla musica dove i bambini possono suonare il Pianoforte, la Batteria, lo Xilofono, i Bongo o diventare DJ mixando basi ed effetti sonori buffi." },
                        { icon: Store, title: "L'Edicola", desc: "Il centro dell'economia del gioco. Qui si usano i Gettoni d'Oro vinti nei giochi per comprare pacchetti di figurine e completare l'Album di Lone Boo." }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/40 p-4 rounded-2xl border border-white/50 shadow-sm flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <item.icon className="text-blue-600 shrink-0" size={24} />
                                <span className="font-black text-blue-900 uppercase text-sm md:text-base leading-tight">{item.title}</span>
                            </div>
                            <p className="text-xs md:text-sm font-bold text-slate-600 leading-snug">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. LA CASA DI LONE BOO */}
            <section className="bg-white/50 backdrop-blur-md p-6 rounded-[35px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-4 mb-4 border-b-2 border-white/50 pb-2">
                    <Home className="text-orange-600" size={32} />
                    <h3 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">🏠 La Casa di Lone Boo</h3>
                </div>
                <p className="text-base md:text-xl font-bold text-slate-700 mb-6">
                    Entrando nella casa, il gameplay diventa più intimo e quotidiano. Si esplorano varie stanze:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { icon: Utensils, title: "Cucina", desc: "Si impara l'ecologia con il Gioco del Riciclo, si raccoglie frutta con Fruit Catcher o si gioca al Frigo-Tetris." },
                        { icon: Bed, title: "Cameretta", desc: "Si guarda il cielo con il Telescopio (mappa stellare) o si apre il Baule dei Segreti per giocare a Tiro alla Fionda o al Gratta e Vinci." },
                        { icon: Library, title: "Libreria", desc: "Un angolo calmo dove leggere libri classici sfogliabili o sedersi al tavolo per giocare a Scopa, Uno o Solitario." },
                        { icon: Heart, title: "Giardino delle Emozioni", desc: "Uno spazio speciale dove i fiori rappresentano gli stati d'animo (Felicità, Rabbia, Tristezza, Paura). Toccandoli, il saggio Grufo il Gufo spiega ai bambini come gestire e comprendere ciò che provano." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-3 bg-orange-50/50 rounded-2xl border border-orange-100">
                            <item.icon className="text-orange-600 shrink-0" size={24} />
                            <div>
                                <span className="block font-black text-orange-900 uppercase text-sm mb-1">{item.title}</span>
                                <p className="text-xs md:text-sm font-bold text-slate-600 leading-snug">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. VIAGGI E NUOVE CITTÀ */}
            <section className="bg-white/50 backdrop-blur-md p-6 rounded-[35px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-4 mb-4 border-b-2 border-white/50 pb-2">
                    <TrainFront className="text-emerald-600" size={32} />
                    <h3 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">🚂 Viaggi e Nuove Città</h3>
                </div>
                <div className="space-y-3">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4 items-start">
                        <div className="bg-emerald-500 text-white p-2 rounded-lg font-black shrink-0">1</div>
                        <p className="text-sm md:text-lg font-bold text-slate-700">
                            <span className="font-black text-emerald-800 uppercase">Città Grigia:</span> Il regno dei motori e della meccanica, dove si progettano Gokart e si corre in pista.
                        </p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4 items-start">
                        <div className="bg-emerald-500 text-white p-2 rounded-lg font-black shrink-0">2</div>
                        <p className="text-sm md:text-lg font-bold text-slate-700">
                            <span className="font-black text-emerald-800 uppercase">Altre Destinazioni:</span> Città dei Laghi, delle Montagne e degli Arcobaleni, con panorami unici e segreti da scoprire.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. ECONOMIA E PROGRESSI */}
            <section className="bg-white/50 backdrop-blur-md p-6 rounded-[35px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-4 mb-4 border-b-2 border-white/50 pb-2">
                    <Coins className="text-yellow-600" size={32} />
                    <h3 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">🪙 Economia e Progressi: Il Passaporto QR</h3>
                </div>
                <p className="text-base md:text-xl font-bold text-slate-700 leading-relaxed mb-6">
                    L'app non richiede account o email. Il progresso è salvato nella Tessera Ufficiale (Ghost Passport).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200 flex items-center gap-3">
                        <CheckCircle2 className="text-yellow-600" />
                        <span className="text-sm md:text-base font-black text-yellow-900 uppercase">Guadagna Gettoni giocando</span>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200 flex items-center gap-3">
                        <CheckCircle2 className="text-yellow-600" />
                        <span className="text-sm md:text-base font-black text-yellow-900 uppercase">Compra Figurine all'Edicola</span>
                    </div>
                </div>
                <div className="mt-4 p-5 bg-blue-600 text-white rounded-3xl border-4 border-black shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <QrCode size={24} />
                        <span className="font-black uppercase tracking-tight">Recupero Dati Magico</span>
                    </div>
                    <p className="text-xs md:text-sm font-bold opacity-90 leading-tight">
                        Dall'Edicola è possibile scaricare la propria Tessera aggiornata come immagine QR. Se si cambia dispositivo, basta inquadrare la vecchia tessera per recuperare istantaneamente tutti i gettoni e l'album delle figurine.
                    </p>
                </div>
            </section>

            {/* 6. SICUREZZA E ACCESSIBILITÀ */}
            <section className="bg-white/50 backdrop-blur-md p-6 rounded-[35px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-4 mb-4 border-b-2 border-white/50 pb-2">
                    <ShieldCheck className="text-slate-700" size={32} />
                    <h3 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">🛡️ Sicurezza e Accessibilità</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                        <Lock className="text-slate-800 shrink-0" size={24} />
                        <div>
                            <span className="font-black text-slate-900 uppercase text-sm mb-1 block">Area Genitori</span>
                            <p className="text-xs md:text-sm font-bold text-slate-600">Protetta da un calcolo matematico, permette di bloccare i link esterni verso YouTube o disabilitare giochi che richiedono supervisione.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-pink-100 rounded-2xl border border-pink-200">
                        <Accessibility className="text-pink-600 shrink-0" size={24} />
                        <div>
                            <span className="font-black text-pink-900 uppercase text-sm mb-1 block">Magia per Tutti</span>
                            <p className="text-xs md:text-sm font-bold text-slate-600">Un menu di accessibilità che permette di attivare il Font per Dislessia, la modalità Alto Contrasto per ipovedenti o la Modo Calmo per ridurre le animazioni e lo stress sensoriale.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-indigo-100 rounded-2xl border border-indigo-200">
                        <Moon className="text-indigo-600 shrink-0" size={24} />
                        <div>
                            <span className="font-black text-indigo-900 uppercase text-sm mb-1 block">Timer Buonanotte</span>
                            <p className="text-xs md:text-sm font-bold text-slate-600">I genitori possono impostare uno spegnimento automatico: allo scadere del tempo, Lone Boo andrà a dormire e l'app si bloccherà fino al mattino dopo (o finché un genitore non la sblocca).</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. CREATIVITÀ */}
            <section className="bg-white/50 backdrop-blur-md p-6 rounded-[35px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-4 mb-4 border-b-2 border-white/50 pb-2">
                    <Palette className="text-pink-500" size={32} />
                    <h3 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">🎨 Creatività</h3>
                </div>
                <div className="space-y-4">
                    <p className="text-base md:text-xl font-bold text-slate-700 leading-relaxed">
                        Nell'Accademia, i bambini possono scaricare disegni originali da stampare e colorare. Nel Museo, possono vedere le opere degli altri bambini e inviare il proprio disegno (tramite la funzione "Invia Disegno") per vederlo pubblicato in galleria.
                    </p>
                    <div className="bg-yellow-400 p-4 rounded-2xl border-4 border-black shadow-md flex items-center gap-3">
                        <Info className="text-blue-900" />
                        <span className="font-black text-blue-900 uppercase text-xs md:text-sm">Invia la tua arte e diventa protagonista nel Museo!</span>
                    </div>
                </div>
            </section>

            {/* CONCLUSIONE */}
            <div className="pt-12 pb-8 text-center animate-in fade-in duration-1000">
                <div className="bg-blue-600 text-white p-8 rounded-[3rem] border-4 border-black shadow-2xl relative overflow-hidden">
                    <div className="absolute top-[-10px] left-[-10px] opacity-10"><Star size={60} /></div>
                    <div className="absolute bottom-[-10px] right-[-10px] opacity-10"><Star size={80} /></div>
                    
                    <p className="text-lg md:text-2xl font-bold leading-relaxed relative z-10 italic">
                        "In sintesi, Lone Boo World è un 'parco giochi educativo' dove ogni interazione è pensata per essere costruttiva, premiando l'impegno scolastico e ludico con collezionabili digitali, il tutto in un ambiente protetto e privo di pubblicità invasiva."
                    </p>
                    <div className="mt-6 flex justify-center items-center gap-2">
                        <Heart className="text-pink-400 fill-pink-400 animate-pulse" size={24} />
                        <span className="font-black uppercase tracking-widest text-sm">Buon divertimento!</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center pb-12 opacity-30">
                <img src={OFFICIAL_LOGO} alt="" className="w-16 h-16 mb-2 grayscale" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Lone Boo World • 2025</p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default GuidePage;
