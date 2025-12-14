
import React, { useEffect } from 'react';
import { Mail, ArrowLeft, CircleAlert, ShieldCheck, Scale, Database, ServerOff } from 'lucide-react';
import { AppView } from '../types';

interface DisclaimerPageProps {
    setView: (view: AppView) => void;
}

const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ setView }) => {
  // Ensure the page starts at the top when opened
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 animate-fade-in pb-24">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-black text-boo-orange mb-2" style={{ textShadow: "3px 3px 0px black" }}>
           Disclaimer & Privacy
        </h2>
        <div className="inline-flex items-center gap-2 bg-black/20 text-white px-4 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
             <CircleAlert size={16} />
             <span>LoneBoo.online</span>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-[30px] border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] text-gray-800 leading-relaxed font-sans">
        
        <div className="mb-6 pb-4 border-b-2 border-gray-100">
             <h3 className="text-xl font-black text-boo-purple mb-1">✅ NOTE LEGALI E PRIVACY POLICY</h3>
             <p className="text-sm font-bold text-gray-500">Ultimo aggiornamento: 30-11-2025</p>
             <p className="text-sm font-bold text-gray-500">Dominio: http://loneboo.online</p>
             <p className="text-sm font-bold text-gray-500">Proprietario: Lone Boo – progetto creativo e di intrattenimento per bambini</p>
        </div>

        {/* --- NUOVA SEZIONE PRIVACY IMPORTANTE --- */}
        <section className="mb-10 bg-green-50 p-6 rounded-2xl border-l-8 border-green-500 shadow-sm">
            <h4 className="text-xl font-black text-green-800 mb-4 flex items-center gap-2">
                <ShieldCheck size={28} /> PRIVACY, SICUREZZA E DATI MINORI
            </h4>
            
            <p className="text-gray-700 font-bold mb-4 text-base">
                Lone Boo World è progettata secondo il principio di "Privacy by Design" e "Safety First". La sicurezza dei bambini è la nostra priorità assoluta.
            </p>

            <div className="space-y-6">
                
                {/* 1. ARCHITETTURA ZERO-DATA */}
                <div>
                    <h5 className="font-black text-green-700 text-lg mb-2 flex items-center gap-2">
                        <ServerOff size={20} /> Architettura "Zero-Data" (Nessun Dato Raccolto)
                    </h5>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        A differenza della maggior parte delle app, <strong>Lone Boo NON possiede un database centrale per gli utenti</strong>.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-gray-600 font-medium">
                        <li><strong>Nessuna Registrazione Richiesta:</strong> Non chiediamo email, numeri di telefono o password.</li>
                        <li><strong>Dati Locali:</strong> I progressi di gioco (gettoni, figurine, avatar) vengono salvati <em>esclusivamente</em> nella memoria locale del dispositivo dell'utente (LocalStorage). Noi non possiamo vederli, né accedervi.</li>
                        <li><strong>Foto e Immagini:</strong> Le funzionalità che usano la fotocamera (Caccia al Tesoro, Passaporto) elaborano le immagini istantaneamente sul dispositivo. <strong>Nessuna foto viene mai inviata o archiviata sui nostri server.</strong></li>
                        <li><strong>Recupero Dati:</strong> Il sistema di "Tessera" (QR Code) serve proprio a permettere il salvataggio senza cloud: i dati sono codificati nell'immagine che l'utente scarica sul proprio dispositivo.</li>
                    </ul>
                </div>

                {/* 2. INTEGRAZIONE AI SICURA */}
                <div>
                    <h5 className="font-black text-green-700 text-lg mb-2 flex items-center gap-2">
                        <Database size={20} /> Intelligenza Artificiale Protetta
                    </h5>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        L'app utilizza tecnologie avanzate (come Google Gemini) tramite un'integrazione proprietaria sicura.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-gray-600 font-medium">
                        <li><strong>Stateless Interactions:</strong> Le conversazioni con "Lone Boo" sono volatili. Non vengono create "memorie" a lungo termine dell'utente sui server dell'AI per scopi di profilazione pubblicitaria.</li>
                        <li><strong>Filtri di Sicurezza:</strong> Un sistema di filtraggio proprietario blocca input e output inappropriati prima che raggiungano il bambino.</li>
                    </ul>
                </div>

                {/* 3. NORMATIVE CITATE */}
                <div>
                    <h5 className="font-black text-green-700 text-lg mb-2 flex items-center gap-2">
                        <Scale size={20} /> Conformità Normativa Internazionale
                    </h5>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        Operiamo nel pieno rispetto delle più severe normative vigenti sulla tutela dei dati dei minori:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 font-medium">
                        <li>
                            <strong>GDPR (Regolamento UE 2016/679):</strong> In particolare Art. 8 relativo al trattamento dei dati dei minori. Non raccogliendo dati personali, l'app è intrinsecamente compliant (conforme).
                        </li>
                        <li>
                            <strong>D.Lgs 101/2018 (Italia):</strong> Adeguamento della normativa nazionale italiana alle disposizioni del Regolamento UE.
                        </li>
                        <li>
                            <strong>COPPA (Children’s Online Privacy Protection Act - USA):</strong> Adottiamo gli standard del COPPA come "Gold Standard" globale, evitando qualsiasi forma di tracciamento comportamentale o raccolta dati senza consenso genitoriale verificabile (che, nel nostro caso, è superfluo poiché non raccogliamo dati).
                        </li>
                        <li>
                            <strong>Convenzione ONU sui diritti dell'infanzia:</strong> Art. 16, diritto alla privacy e alla protezione dalla legge contro interferenze o attacchi.
                        </li>
                    </ul>
                </div>

            </div>
        </section>

        {/* --- ALTRE SEZIONI DEL DISCLAIMER (Standard) --- */}

        <section className="mb-8">
            <h4 className="text-lg font-black text-black mb-2 flex items-center gap-2">
                <span className="text-boo-orange">⭐</span> 1. Finalità del Sito e dell’App
            </h4>
            <p className="text-gray-600 font-medium text-sm">
                LoneBoo.online è un progetto pensato per offrire contenuti di intrattenimento, mini-giochi, illustrazioni, materiali educativi e collegamenti ai video del canale YouTube “Lone Boo”.
                Tutte le informazioni presenti sul sito e sull’app hanno scopo ludico, informativo e divulgativo, e non rappresentano in alcun modo consigli professionali, educativi o medici.
            </p>
        </section>

        <section className="mb-8">
            <h4 className="text-lg font-black text-black mb-2 flex items-center gap-2">
                <span className="text-boo-orange">⭐</span> 2. Link verso Terze Parti
            </h4>
            <p className="text-gray-600 font-medium text-sm">
                Il sito può contenere link o embed verso piattaforme esterne (ad esempio YouTube).
                Tali piattaforme non sono controllate da Lone Boo.
                L’utente riconosce che LoneBoo.online non può essere ritenuto responsabile per contenuti, politiche o malfunzionamenti di siti o servizi esterni.
            </p>
        </section>

        <section className="mb-8">
            <h4 className="text-lg font-black text-black mb-2 flex items-center gap-2">
                <span className="text-boo-orange">⭐</span> 3. Integrazione di Giochi Esterni
            </h4>
            <p className="text-gray-600 font-medium text-sm mb-2">
                Per arricchire l'esperienza ludica, l'applicazione integra selezionati mini-giochi provenienti da piattaforme terze qualificate (es. MadKidGames).
                Tali contenuti sono stati verificati per garantirne la sicurezza, ma essendo ospitati su server esterni, Lone Boo declina responsabilità per eventuali disservizi tecnici imputabili ai fornitori originali.
            </p>
        </section>

        <section className="mb-8">
            <h4 className="text-lg font-black text-black mb-2 flex items-center gap-2">
                <span className="text-boo-orange">⭐</span> 4. Proprietà Intellettuale
            </h4>
            <p className="text-gray-600 font-medium text-sm mb-2">
                Tutti i materiali presenti su LoneBoo.online — inclusi grafiche, animazioni, testi, loghi, personaggi, elementi visivi e contenuti multimediali — sono protetti da copyright.
                È vietata qualsiasi forma di copia, distribuzione, modifica o riutilizzo a scopo commerciale senza autorizzazione scritta del proprietario.
            </p>
        </section>

        <section className="mb-8 bg-gray-50 p-4 rounded-xl border-l-4 border-boo-blue">
            <h4 className="text-lg font-black text-black mb-2 flex items-center gap-2">
                <span className="text-boo-blue">⭐</span> Contatti
            </h4>
            <p className="text-gray-600 font-medium text-sm mb-2">
                Per richieste, chiarimenti o segnalazioni puoi contattare:
            </p>
            <div className="flex flex-col gap-2">
                <a href="mailto:support@loneboo.online" className="inline-flex items-center gap-2 font-bold text-boo-blue hover:underline">
                    <Mail size={16} /> support@loneboo.online
                </a>
                <a href="mailto:loneboo@libero.it" className="inline-flex items-center gap-2 font-bold text-boo-blue hover:underline">
                    <Mail size={16} /> loneboo@libero.it
                </a>
            </div>
        </section>

        <div className="flex justify-center mt-8">
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

export default DisclaimerPage;
