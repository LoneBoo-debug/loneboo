
import { Book } from '../types';
import { getAsset } from './LocalAssets';

export const BOOKS_DATABASE: Book[] = [
    { 
        id: 'book1', 
        title: 'Il Concerto della Vita: La Favola di Lone Boo', 
        subtitle: 'Creatività e Divertimento', 
        description: `Lone Boo – Una piccola anima in un mondo troppo grande è un viaggio delicato attraverso emozioni che tutti, almeno una volta, hanno incontrato: la solitudine, la vulnerabilità, la ricerca di un posto sicuro e di una voce che ci assomigli.
Il libro raccoglie pensieri, brevi testi, riflessioni e immagini nate dal progetto artistico e musicale Lone Boo, un universo narrativo che unisce minimalismo, poesia e introspezione.

Lo scopo del libro è offrire al lettore un momento di respiro: una pausa silenziosa in cui trovare conforto, riconoscersi e magari scoprire che ciò che sentiamo non è mai davvero solo nostro. Lone Boo, con la sua semplicità, accompagna i piccoli lettori in un percorso fatto di piccole verità quotidiane, frammenti di luce e ombre che non fanno paura.

Tra le pagine si parla di emozioni, legami invisibili, battiti trattenuti e speranze che si riaccendono. Non è un romanzo né un diario: è uno spazio libero, un rifugio creativo in cui ogni lettore può ritrovare un pezzo di sé.`, 
        coverImage: getAsset('https://i.postimg.cc/mDXNKfCn/Immagine-2025-12-01-221132.jpg'), 
        amazonUrl: 'https://amzn.eu/d/fcAwaA4' 
    },
    { 
        id: 'book2', 
        title: 'Il Grande Libro degli Enigmi di Lone Boo – Enigma', 
        subtitle: 'Impara Giocando', 
        description: `Benvenuti nel nuovo e sorprendente libro di enigmi e rompicapi di Lone Boo, un mondo colorato dove curiosità e divertimento camminano insieme!
In queste pagine i bambini troveranno sfide coinvolgenti, giochi intelligenti, indovinelli buffi, labirinti, oggetti nascosti e mini-misteri che stimolano creatività, logica e capacità di osservazione.

Ogni attività è progettata per offrire un’esperienza divertente e allo stesso tempo educativa, trasformando il gioco in un’occasione per imparare, esplorare e immaginare.
Con il suo stile vivace e unico, Lone Boo accompagna i piccoli lettori in un viaggio pieno di colori, sorrisi e scoperte, rendendo ogni pagina una piccola avventura da vivere.

Prendi una matita, apri il libro… e lascia che la magia degli enigmi inizi!`, 
        coverImage: getAsset('https://i.postimg.cc/WbCjTdsM/Immagine-2025-12-01-221617.jpg'), 
        amazonUrl: 'https://amzn.eu/d/d04JGSx' 
    },
    { 
        id: 'book3', 
        title: 'Le Avventure di Lone Boo', 
        subtitle: 'Un viaggio nelle emozioni', 
        description: `Un viaggio dolce e rassicurante nel mondo dei sentimenti, pensato per accompagnare i bambini e ragazzi nella scoperta di se stessi.
Questo libro illustrato racconta con delicatezza tutte le volte in cui ci sentiamo piccoli, feriti, intimiditi o timorosi… e mostra come, passo dopo passo, ogni emozione possa trasformarsi in forza, consapevolezza e coraggio.

Attraverso testi semplici e immagini calde, i piccoli lettori imparano che:
essere vulnerabili è normale,
ogni emozione ha un significato,
chiedere aiuto non è debolezza,
crescere significa accettarsi con gentilezza.

È un libro ideale per la lettura della buonanotte, ma anche uno strumento prezioso per genitori, educatori e insegnanti che desiderano introdurre l’educazione emotiva nella vita quotidiana dei bambini.
Perfetto dai 4 ai 10 anni, aiuta a sviluppare empatia, sicurezza interiore e capacità di esprimere ciò che si prova. Una piccola guida poetica per diventare grandi… un passo alla volta.
Regalo ideale per compleanni, ricorrenze, feste scolastiche e per tutti i bambini che amano le storie che fanno bene al cuore.`, 
        coverImage: getAsset('https://i.postimg.cc/fLY8QxFq/Immagine-2025-12-05-001741.jpg'), 
        amazonUrl: 'https://amzn.eu/d/1PLVotd' 
    }
];
