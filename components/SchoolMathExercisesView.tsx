import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { ArrowLeft, X, Plus, Minus, X as Multiply, Divide, HelpCircle, Star, ZoomIn, CheckCircle2, AlertCircle, Calculator, Shapes } from 'lucide-react';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/archivioarchivista5543.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

type MathTab = 'ADDITION' | 'SUBTRACTION' | 'MULTIPLICATION' | 'DIVISION' | 'PROBLEMS';
type ProblemCategory = 'MATH' | 'GEOM';

interface Problem {
    text: string;
    options: string[];
    correctIndex: number;
}

const MATH_PROBLEMS: Problem[] = [
    { text: "Gaia ha 12 figurine e Andrea ne ha 9. Quante figurine hanno in totale?", options: ["21", "19", "20"], correctIndex: 0 },
    { text: "Un negozio ha 23 palloni e ne vende 7. Quanti palloni rimangono?", options: ["15", "17", "16"], correctIndex: 2 },
    { text: "Una classe ha 24 libri da dividere tra 4 gruppi. Quanti libri riceve ogni gruppo?", options: ["5", "6", "8"], correctIndex: 1 },
    { text: "Luca compra 5 scatole di biscotti, ognuna con 10 biscotti. Quanti biscotti ha in tutto?", options: ["50", "15", "25"], correctIndex: 0 },
    { text: "Ci sono 18 mele e 6 bambini. Se vogliono dividere le mele, quante mele riceve ogni bambino?", options: ["2", "3", "4"], correctIndex: 1 },
    { text: "Maria ha 14 caramelle e ne mangia 6. Quante caramelle le restano?", options: ["6", "8", "9"], correctIndex: 1 },
    { text: "Un autobus ha 36 posti occupati. 18 bambini scendono. Quanti bambini rimangono sull’autobus?", options: ["9", "25", "18"], correctIndex: 2 },
    { text: "Una fattoria ha 7 mucche e ogni mucca produce 5 litri di latte. Quanti litri produce in totale?", options: ["25", "35", "30"], correctIndex: 1 },
    { text: "Paolo ha 20 figurine e ne regala 5 al fratello. Quante figurine gli restano?", options: ["15", "10", "12"], correctIndex: 0 },
    { text: "Una scatola contiene 6 pacchetti di biscotti, ogni pacchetto ha 4 biscotti. Quanti biscotti in totale?", options: ["19", "20", "24"], correctIndex: 2 },
    { text: "Una scuola ha 120 libri e vuole distribuirli equamente tra 8 classi. Quanti libri riceve ogni classe?", options: ["15", "20", "18"], correctIndex: 0 },
    { text: "Un negozio riceve 48 quaderni e ne vende 27. Quanti quaderni rimangono?", options: ["22", "23", "21"], correctIndex: 2 },
    { text: "Matteo raccoglie 36 sassi e li vuole dividere in 6 sacchetti. Quanti sassi ci vanno in ogni sacchetto?", options: ["6", "5", "7"], correctIndex: 0 },
    { text: "Una pasticceria fa 12 torte al giorno. Quante torte farà in 7 giorni?", options: ["84", "72", "90"], correctIndex: 0 },
    { text: "Una classe ha 28 matite e 4 alunni. Quante matite riceve ciascun alunno?", options: ["6", "7", "8"], correctIndex: 1 },
    { text: "Un fruttivendolo ha 15 cassette di arance, ciascuna con 12 arance. Quante arance ci sono in totale?", options: ["180", "150", "120"], correctIndex: 0 },
    { text: "Luca ha 72 caramelle e le divide in 8 sacchetti uguali. Quante caramelle vanno in ogni sacchetto?", options: ["8", "9", "10"], correctIndex: 1 },
    { text: "Un campo ha 24 alberi e ogni albero produce 15 frutti. Quanti frutti ci sono in tutto?", options: ["320", "340", "360"], correctIndex: 2 },
    { text: "Una scuola compra 450 quaderni e li deve distribuire tra 15 classi. Quanti quaderni riceve ogni classe?", options: ["20", "30", "40"], correctIndex: 1 },
    { text: "Un negozio ha 540 caramelle e le mette in confezioni da 12 caramelle. Quante confezioni può fare?", options: ["40", "50", "45"], correctIndex: 2 }
];

const GEOM_PROBLEMS: Problem[] = [
    { text: "Un rettangolo ha lunghezza 8 cm e larghezza 5 cm. Qual è il perimetro?", options: ["26 cm", "40 cm", "20 cm"], correctIndex: 0 },
    { text: "Un quadrato ha lato 6 cm. Qual è l’area del quadrato?", options: ["46 cm²", "36 cm²", "18 cm²"], correctIndex: 1 },
    { text: "Un triangolo ha base 10 cm e altezza 4 cm. Qual è la sua area?", options: ["10 cm²", "40 cm²", "20 cm²"], correctIndex: 2 },
    { text: "Un rettangolo ha lunghezza 7 m e larghezza 3 m. Qual è l’area?", options: ["22 m²", "21 m²", "24 m²"], correctIndex: 1 },
    { text: "Un quadrato ha lato 9 cm. Qual è il perimetro?", options: ["36 cm", "18 cm", "27 cm"], correctIndex: 0 },
    { text: "Un triangolo equilatero ha lato 5 cm. Qual è il perimetro?", options: ["25 cm", "10 cm", "15 cm"], correctIndex: 2 },
    { text: "Un rettangolo ha lunghezza 12 m e larghezza 4 m. Qual è il perimetro?", options: ["32 m", "24 m", "28 m"], correctIndex: 0 },
    { text: "Un triangolo ha base 6 cm e altezza 3 cm. Qual è l’area?", options: ["19 cm²", "18 cm²", "9 cm²"], correctIndex: 2 },
    { text: "Un quadrato ha lato 10 cm. Qual è l’area?", options: ["100 cm²", "40 cm²", "50 cm²"], correctIndex: 0 },
    { text: "Un rettangolo ha lunghezza 5 cm e larghezza 2 cm. Qual è il perimetro?", options: ["12 cm", "10 cm", "14 cm"], correctIndex: 2 },
    { text: "Un rettangolo ha lunghezza 15 m e larghezza 8 m. Qual è l’area?", options: ["120 m²", "100 m²", "110 m²"], correctIndex: 0 },
    { text: "Un triangolo ha base 12 cm e altezza 5 cm. Qual è l’area?", options: ["30 cm²", "60 cm²", "17 cm²"], correctIndex: 0 },
    { text: "Un quadrato ha lato 12 cm. Qual è il perimetro?", options: ["48 cm", "24 cm", "36 cm"], correctIndex: 0 },
    { text: "Un rettangolo ha lunghezza 20 cm e larghezza 6 cm. Qual è il perimetro?", options: ["54 cm", "52 cm", "60 cm"], correctIndex: 1 },
    { text: "Un triangolo rettangolo ha cateti 6 cm e 8 cm. Qual è l’area?", options: ["24 cm²", "28 cm²", "30 cm²"], correctIndex: 0 },
    { text: "Un parallelogramma ha base 10 cm e altezza 7 cm. Qual è l’area?", options: ["75 cm²", "17 cm²", "70 cm²"], correctIndex: 2 },
    { text: "Un trapezio ha base maggiore 10 cm, base minore 6 cm e altezza 4 cm. Qual è l’area?", options: ["32 cm²", "28 cm²", "40 cm²"], correctIndex: 0 },
    { text: "Un cubo ha lato 5 cm. Qual è il volume?", options: ["125 cm³", "25 cm³", "75 cm³"], correctIndex: 0 },
    { text: "Un cubo ha lato 6 cm. Qual è l’area totale delle facce?", options: ["226 cm²", "216 cm²", "72 cm²"], correctIndex: 1 },
    { text: "Un cilindro ha altezza 10 cm e raggio 3 cm. Qual è l’area della base?", options: ["28,26 cm²", "18 cm²", "20 cm²"], correctIndex: 0 }
];

const TABS: { id: MathTab; label: string; img: string }[] = [
    { id: 'ADDITION', label: 'Addizione', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/addisionicondsa.webp' },
    { id: 'SUBTRACTION', label: 'Sottrazione', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sottricond321qw.webp' },
    { id: 'MULTIPLICATION', label: 'Moltiplicazione', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/molti83ujw83.webp' },
    { id: 'DIVISION', label: 'Divisione', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/divi3d2ws.webp' },
    { id: 'PROBLEMS', label: 'Problemi', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/orblemi32w2.webp' }
];

const SchoolMathExercisesView: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [activeTab, setActiveTab] = useState<MathTab>('ADDITION');
    const activeTabData = TABS.find(t => t.id === activeTab);
    const [isLoaded, setIsLoaded] = useState(false);
    const [zoomedImg, setZoomedImg] = useState<string | null>(null);

    const [problemCat, setProblemCat] = useState<ProblemCategory>('MATH');
    const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = BG_URL;
        img.onload = () => setIsLoaded(true);
    }, []);

    const handleAnswer = (idx: number) => {
        if (feedback === 'CORRECT') return;
        
        setSelectedOption(idx);
        const currentProblems = problemCat === 'MATH' ? MATH_PROBLEMS : GEOM_PROBLEMS;
        const isCorrect = idx === currentProblems[currentProblemIdx].correctIndex;

        if (isCorrect) {
            setFeedback('CORRECT');
            setTimeout(() => {
                if (currentProblemIdx < currentProblems.length - 1) {
                    setCurrentProblemIdx(prev => prev + 1);
                } else {
                    setCurrentProblemIdx(0); 
                }
                setFeedback(null);
                setSelectedOption(null);
            }, 1500);
        } else {
            setFeedback('WRONG');
        }
    };

    const renderAdditionContent = () => (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/80 backdrop-blur-md rounded-[3rem] border-4 border-red-400 p-6 md:p-10 shadow-xl">
                <h3 className="font-luckiest text-3xl md:text-6xl text-red-600 uppercase mb-8 text-stroke-lucky tracking-tighter">ADDIZIONE IN COLONNA</h3>
                <div className="space-y-6 mb-12">
                    <div className="bg-red-50 p-4 rounded-2xl border-l-8 border-red-500">
                        <h4 className="font-black text-xl md:text-4xl text-slate-800 mb-2">Esempio: 12 + 9</h4>
                        <p className="text-slate-700 font-bold text-base md:text-3xl leading-relaxed">
                            Quando dobbiamo fare un’addizione in colonna, la prima cosa importante è mettere i numeri nel modo giusto.<br/>
                            Le unità devono stare sotto le unità e le decine sotto le decine. Questo ci aiuta a non sbagliare.<br/><br/>
                            Adesso iniziamo a sommare partendo sempre dalle unità, cioè dalla colonna di destra.<br/>
                            Nel numero 12 le unità sono 2, mentre nel numero 9 le unità sono 9. Facciamo quindi 2 + 9 e otteniamo 11.<br/><br/>
                            Il numero 11 è speciale perché ha due cifre. Allora scriviamo solo l’1 delle unità sotto la linea e l’altro 1 lo teniamo da parte. Questo 1 si chiama riporto e andrà aggiunto alle decine.<br/><br/>
                            Adesso passiamo alla colonna delle decine. Nel numero 12 c’è una decina, quindi 1. A questo 1 aggiungiamo anche il riporto che avevamo tenuto da parte. Facendo 1 + 1 otteniamo 2.<br/><br/>
                            Scriviamo il 2 sotto la linea, nella colonna delle decine. Ora possiamo leggere il numero completo che abbiamo scritto sotto la linea: 21.
                        </p>
                    </div>
                    <p className="text-2xl md:text-5xl font-luckiest text-red-600 text-center py-4">12 + 9 = 21</p>
                    <div className="relative group cursor-zoom-in max-w-lg mx-auto" onClick={() => setZoomedImg('https://loneboo-images.s3.eu-south-1.amazonaws.com/add129eso.webp')}>
                        <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/add129eso.webp" className="w-full h-auto rounded-[2rem] border-4 border-white shadow-2xl transition-transform group-hover:scale-[1.02]" alt="Addizione 12+9" />
                        <div className="absolute bottom-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn size={24} /></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSubtractionContent = () => (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/80 backdrop-blur-md rounded-[3rem] border-4 border-blue-400 p-6 md:p-10 shadow-xl">
                <h3 className="font-luckiest text-3xl md:text-6xl text-blue-600 uppercase mb-8 text-stroke-lucky tracking-tighter">SOTTRAZIONE IN COLONNA</h3>
                <div className="space-y-6 mb-12">
                    <div className="bg-blue-50 p-4 rounded-2xl border-l-8 border-blue-500">
                        <h4 className="font-black text-xl md:text-4xl text-slate-800 mb-2">Esempio: 12 - 9</h4>
                        <p className="text-slate-700 font-bold text-base md:text-3xl leading-relaxed">
                            Per risolvere una sottrazione in colonna, la prima cosa da fare è scrivere bene i numeri. Le unità devono stare sotto le unità e le decine sotto le decine. Questo ci aiuta a fare il calcolo con ordine e senza errori.<br/><br/>
                            Adesso iniziamo a sottrarre partendo dalle unità, cioè dalla colonna di destra. Nel numero 12 le unità sono 2, mentre nel numero 9 le unità sono 9. Proviamo a fare 2 − 9, ma ci accorgiamo che non si può, perché 2 è più piccolo di 9.<br/><br/>
                            Quando succede questo, chiediamo aiuto alle decine. Dal numero 12 prendiamo una decina, che vale 10 unità. La decina diventa quindi 0, mentre le unità diventano 12.<br/><br/>
                            Adesso possiamo rifare la sottrazione delle unità: 12 − 9 = 3. Scriviamo il 3 sotto la linea, nella colonna delle unità. Ora passiamo alla colonna delle decine. Dopo aver prestato una decina, nel numero 12 rimangono 0 decine. Sotto non ci sono decine da togliere, quindi il risultato resta 0.
                        </p>
                    </div>
                    <p className="text-2xl md:text-5xl font-luckiest text-blue-600 text-center py-4">12 − 9 = 3</p>
                    <div className="relative group cursor-zoom-in max-w-lg mx-auto" onClick={() => setZoomedImg('https://loneboo-images.s3.eu-south-1.amazonaws.com/sotteso129ers.webp')}>
                        <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/sotteso129ers.webp" className="w-full h-auto rounded-[2rem] border-4 border-white shadow-2xl transition-transform group-hover:scale-[1.02]" alt="Sottrazione 12-9" />
                        <div className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn size={24} /></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMultiplicationContent = () => (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/80 backdrop-blur-md rounded-[3rem] border-4 border-yellow-400 p-6 md:p-10 shadow-xl">
                <h3 className="font-luckiest text-3xl md:text-6xl text-yellow-600 uppercase mb-8 text-stroke-lucky tracking-tighter">MOLTIPLICAZIONE IN COLONNA</h3>
                <div className="space-y-6 mb-12">
                    <div className="bg-yellow-50 p-4 rounded-2xl border-l-8 border-yellow-500">
                        <h4 className="font-black text-xl md:text-4xl text-slate-800 mb-2">Esempio: 12 × 9</h4>
                        <p className="text-slate-700 font-bold text-base md:text-3xl leading-relaxed">
                            Per risolvere una moltiplicazione in colonna, la prima cosa da fare è scrivere bene i numeri.<br/>
                            Il numero più grande si scrive sopra e quello più piccolo sotto, tenendoli ben allineati. In questo caso scriviamo 12 sopra e 9 sotto.<br/><br/>
                            Nella moltiplicazione in colonna si inizia sempre a moltiplicare dalle unità, cioè dalla cifra di destra.<br/><br/>
                            Cominciamo quindi con le unità del numero 12.<br/>
                            Facciamo 9 × 2 e otteniamo 18.<br/><br/>
                            Il numero 18 ha due cifre, quindi:<br/>
                            - scriviamo 8 sotto la linea, nella colonna delle unità<br/>
                            - teniamo da parte 1, che si chiama riporto, e lo useremo subito dopo<br/><br/>
                            Adesso passiamo alla colonna delle decine.<br/>
                            Nel numero 12 la cifra delle decine è 1. Facciamo quindi 9 × 1 e otteniamo 9. A questo risultato dobbiamo aggiungere anche il riporto che avevamo tenuto da parte.<br/><br/>
                            Facendo 9 + 1 otteniamo 10. Scriviamo 10 davanti all’8 che avevamo già scritto sotto la linea.<br/><br/>
                            Ora possiamo leggere il numero completo che abbiamo ottenuto: 108.
                        </p>
                    </div>
                    <p className="text-2xl md:text-5xl font-luckiest text-yellow-600 text-center py-4">12 × 9 = 108</p>
                    <div className="relative group cursor-zoom-in max-w-lg mx-auto" onClick={() => setZoomedImg('https://loneboo-images.s3.eu-south-1.amazonaws.com/molti129eso.webp')}>
                        <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/molti129eso.webp" className="w-full h-auto rounded-[2rem] border-4 border-white shadow-2xl transition-transform group-hover:scale-[1.02]" alt="Moltiplicazione 12x9" />
                        <div className="absolute bottom-4 right-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn size={24} /></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDivisionContent = () => (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/80 backdrop-blur-md rounded-[3rem] border-4 border-green-400 p-6 md:p-10 shadow-xl">
                <h3 className="font-luckiest text-3xl md:text-6xl text-green-600 uppercase mb-8 text-stroke-lucky tracking-tighter">DIVISIONE IN COLONNA</h3>
                <div className="space-y-6 mb-12">
                    <div className="bg-green-50 p-4 rounded-2xl border-l-8 border-green-500">
                        <h4 className="font-black text-xl md:text-4xl text-slate-800 mb-2">Esempio 540 : 12</h4>
                        <p className="text-slate-700 font-bold text-base md:text-3xl leading-relaxed">
                            Per risolvere una divisione in colonna, la prima cosa da fare è scrivere bene i numeri: il numero più grande, che vogliamo dividere, si scrive sotto la “casetta” della divisione, il numero che divide si scrive fuori, a sinistra. In questo caso scriviamo 540 sotto e 12 fuori.<br/><br/>
                            <strong>Passaggio 1: guardiamo le prime cifre</strong><br/>
                            Cominciamo dalle prime cifre di 540 che ci permettono di dividere per 12. La prima cifra è 5, ma 5 è più piccolo di 12, quindi dobbiamo prendere anche la cifra successiva: 54.<br/>
                            Ora possiamo fare 54 ÷ 12. Quante volte 12 sta in 54 senza superarlo?<br/>
                            12 × 4 = 48, 12 × 5 = 60 (troppo grande).<br/>
                            Quindi scriviamo 4 sopra la linea, sopra la cifra 4 di 54. Moltiplichiamo 4 × 12 = 48 e scriviamo 48 sotto il 54. Poi facciamo la sottrazione: 54 − 48 = 6.<br/><br/>
                            <strong>Passaggio 2: scendiamo la cifra successiva</strong><br/>
                            Scendiamo ora la cifra successiva di 540, che è 0, accanto al 6. Otteniamo 60.<br/>
                            Adesso dobbiamo vedere quante volte 12 sta in 60. 12 × 5 = 60 esattamente.<br/>
                            Scriviamo quindi 5 sopra la linea, accanto al 4. Moltiplichiamo 5 × 12 = 60 e facciamo la sottrazione: 60 − 60 = 0.<br/><br/>
                            <strong>Passaggio 3: leggere il risultato</strong><br/>
                            Non ci sono più cifre da scendere e il resto è 0, quindi la divisione è finita. Il numero sopra la linea è 45, che è il risultato finale.
                        </p>
                    </div>
                    <p className="text-2xl md:text-5xl font-luckiest text-green-600 text-center py-4">540 ÷ 12 = 45</p>
                    <div className="relative group cursor-zoom-in max-w-lg mx-auto" onClick={() => setZoomedImg('https://loneboo-images.s3.eu-south-1.amazonaws.com/divi54012esop.webp')}>
                        <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/divi54012esop.webp" className="w-full h-auto rounded-[2rem] border-4 border-white shadow-2xl transition-transform group-hover:scale-[1.02]" alt="Divisione 540:12" />
                        <div className="absolute bottom-4 right-4 bg-green-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn size={24} /></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProblemsContent = () => {
        const currentProblems = problemCat === 'MATH' ? MATH_PROBLEMS : GEOM_PROBLEMS;
        const currentProblem = currentProblems[currentProblemIdx];

        return (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full max-h-full">
                <div className="flex justify-center gap-4 shrink-0">
                    <button 
                        onClick={() => { setProblemCat('MATH'); setCurrentProblemIdx(0); setFeedback(null); setSelectedOption(null); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-4 transition-all ${problemCat === 'MATH' ? 'bg-blue-600 border-blue-800 text-white shadow-lg scale-105' : 'bg-white/20 border-white/20 text-white hover:bg-white/30'}`}
                    >
                        <Calculator size={20} />
                        <span className="font-black uppercase text-xs md:text-lg">Matematica</span>
                    </button>
                    <button 
                        onClick={() => { setProblemCat('GEOM'); setCurrentProblemIdx(0); setFeedback(null); setSelectedOption(null); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-4 transition-all ${problemCat === 'GEOM' ? 'bg-purple-600 border-purple-800 text-white shadow-lg scale-105' : 'bg-white/20 border-white/20 text-white hover:bg-white/30'}`}
                    >
                        <Shapes size={20} />
                        <span className="font-black uppercase text-xs md:text-lg">Geometria</span>
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-[3rem] border-4 border-purple-400 p-5 md:p-8 shadow-xl relative overflow-hidden flex flex-col flex-1 min-h-0">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full font-black text-xs md:text-base uppercase tracking-widest border-2 border-purple-200 shadow-sm">
                            Problema {currentProblemIdx + 1} di {currentProblems.length}
                        </span>
                        {feedback === 'CORRECT' && (
                            <div className="text-green-600 flex items-center gap-1 animate-bounce">
                                <CheckCircle2 size={24} />
                                <span className="font-black uppercase text-xs">Esatto!</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-6 flex-1 flex items-center justify-center overflow-y-auto no-scrollbar">
                        <p className="text-slate-800 font-black text-lg md:text-4xl text-center leading-tight">
                            {currentProblem.text}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 shrink-0">
                        {currentProblem.options.map((option, idx) => {
                            let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-purple-400 hover:bg-purple-50";
                            
                            if (selectedOption === idx) {
                                if (idx === currentProblem.correctIndex) {
                                    btnStyle = "bg-green-500 border-green-700 text-white scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]";
                                } else {
                                    btnStyle = "bg-red-500 border-red-700 text-white animate-shake";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`
                                        py-2 md:py-3 px-4 rounded-2xl border-4 text-base md:text-xl font-black transition-all flex items-center justify-center gap-3
                                        ${btnStyle}
                                    `}
                                >
                                    <span className="opacity-50 text-xs md:text-lg">{String.fromCharCode(65 + idx)})</span>
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    <div className="h-10 mt-2 flex items-center justify-center shrink-0">
                        {feedback === 'WRONG' && (
                            <div className="flex items-center gap-2 text-red-600 animate-in slide-in-from-bottom-2">
                                <AlertCircle size={20} />
                                <span className="font-black uppercase text-sm md:text-xl tracking-tight">rifletti un po' di più...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderPlaceholder = () => (
        <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center animate-in zoom-in bg-white/10 backdrop-blur-md rounded-[3rem] border-4 border-white/20">
            <div className="w-24 h-24 md:w-40 md:h-40 bg-white/20 rounded-full flex items-center justify-center border-4 border-dashed border-white/40 mb-6 animate-pulse">
                <Star size={60} className="text-white/60" strokeWidth={3} />
            </div>
            <h3 className="text-white font-luckiest text-2xl md:text-6xl uppercase tracking-tighter mb-4" style={{ WebkitTextStroke: '1.5px black' }}>
                {activeTabData?.label} in preparazione
            </h3>
            <p className="text-white/60 font-bold text-sm md:text-2xl max-w-md leading-tight px-4 uppercase tracking-wide">
                Stiamo raccogliendo i migliori esercizi magici per te. Torna tra poco! 👻
            </p>
            <div className="mt-8 flex items-center gap-3 bg-yellow-400 text-black px-6 py-2 rounded-full border-2 border-black shadow-lg">
                <Star size={20} fill="currentColor" className="animate-spin-slow" />
                <span className="font-black text-xs md:text-lg uppercase">Contenuto in arrivo</span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[150] bg-slate-900 flex flex-col overflow-hidden animate-in fade-in pt-[64px] md:pt-[96px]">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .text-stroke-lucky { -webkit-text-stroke: 1.5px black; text-shadow: 2px 2px 0px rgba(0,0,0,0.5); }
                .custom-scroll::-webkit-scrollbar { width: 10px; }
                .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 10px; border: 2px solid #1e293b; }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
            `}</style>
            <img src={BG_URL} alt="" className="absolute inset-0 w-full h-full object-fill opacity-60 z-0" />
            {zoomedImg && (
                <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setZoomedImg(null)}>
                    <button className="absolute top-24 right-6 text-white bg-red-600 p-2 md:p-3 rounded-full border-4 border-white shadow-xl hover:scale-110 active:scale-95 transition-all">
                        <X size={24} strokeWidth={4} />
                    </button>
                    <img src={zoomedImg} className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-in zoom-in duration-500" alt="Zoom" />
                </div>
            )}
            <div className="relative z-20 w-full p-4 md:p-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => setView(AppView.SCHOOL_ARCHIVE)} className="bg-white/20 text-white p-2 rounded-full border-2 border-white/20 hover:bg-white/40 transition-all mr-2">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="bg-white/10 backdrop-blur-xl px-4 md:px-6 py-2 rounded-full border-2 border-white/20 shadow-xl">
                        <h2 className="text-white font-luckiest text-xl md:text-5xl uppercase tracking-widest leading-none" style={{ WebkitTextStroke: '1px black' }}>
                            Esercizi di Matematica
                        </h2>
                    </div>
                </div>
                <button onClick={() => setView(AppView.SCHOOL_ARCHIVE)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                    <img src={BTN_CLOSE_IMG} alt="Esci" className="w-12 h-12 md:w-20 h-auto drop-shadow-2xl" />
                </button>
            </div>
            <div className="relative z-20 px-4 md:px-8 mb-4 shrink-0 overflow-x-auto no-scrollbar">
                <div className="flex flex-row gap-2 md:gap-6 py-2 justify-center min-w-max">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                transition-all active:scale-95 outline-none w-[16vw] md:w-[12vw] max-w-[140px]
                                ${activeTab === tab.id ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'opacity-70 hover:opacity-100 grayscale-[0.5] hover:grayscale-0'}
                            `}
                        >
                            <img src={tab.img} alt={tab.label} className="w-full h-auto object-contain" />
                        </button>
                    ))}
                </div>
            </div>
            <div className={`relative z-10 flex-1 overflow-y-auto ${activeTab === 'PROBLEMS' ? 'no-scrollbar h-full' : 'custom-scroll'} p-4 md:p-8`}>
                <div className={`max-w-5xl mx-auto ${activeTab === 'PROBLEMS' ? 'h-full' : 'pb-32'}`}>
                    {activeTab === 'ADDITION' ? renderAdditionContent() : 
                     activeTab === 'SUBTRACTION' ? renderSubtractionContent() : 
                     activeTab === 'MULTIPLICATION' ? renderMultiplicationContent() :
                     activeTab === 'DIVISION' ? renderDivisionContent() :
                     activeTab === 'PROBLEMS' ? renderProblemsContent() :
                     renderPlaceholder()}
                </div>
            </div>
        </div>
    );
};

export default SchoolMathExercisesView;