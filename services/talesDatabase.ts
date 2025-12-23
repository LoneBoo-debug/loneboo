
import { FairyTale } from '../types';
import { getAsset } from './LocalAssets';

export const FAIRY_TALES: FairyTale[] = [
    { 
        id: 'story1', 
        title: "La Bella e la Bestia", 
        description: `Una giovane ragazza, chiamata Bella, vive con il padre, un mercante caduto in disgrazia. Un giorno l’uomo si perde in un castello misterioso e, cogliendo una rosa per la figlia, scatena l’ira del padrone del castello: una creatura mostruosa chiamata la Bestia. Per salvare il padre, Bella accetta di vivere nel castello al suo posto. La Bestia si rivela presto gentile e generosa, e Bella impara a guardare oltre il suo aspetto. Quando decide di tornare dalla sua famiglia, la Bestia, credendosi abbandonata, si lascia morire di tristezza. Bella corre da lei, confessa il suo affetto sincero e spezza l’incantesimo: la Bestia torna ad essere un principe, e i due iniziano una nuova vita insieme.`,
        duration: '44:54', 
        image: getAsset('https://i.postimg.cc/1t0Jdq4P/la-bella-e-la-bestia.png'), 
        src: 'https://archive.org/download/la-bella-e-la-bestia/la%20bella%20e%20la%20bestia.mp3' 
    },
    { 
        id: 'story2', 
        title: "Il Principe Amato", 
        description: `Il Principe Amato è un giovane coraggioso e dal cuore puro, destinato a diventare un grande sovrano. Un giorno, una misteriosa profezia lo spinge a mettersi in viaggio per liberare il suo regno da un terribile incantesimo. Durante l’avventura incontra creature magiche, affronta prove difficili e supera inganni e pericoli grazie alla sua bontà e alla sua intelligenza. Con l’aiuto di una fata benevola, Amato riesce infine a spezzare l’incantesimo, riportando pace e felicità nel regno. Il popolo, grato, lo riconosce come il principe che porta amore e armonia a tutti.`,
        duration: '38:52', 
        image: getAsset('https://i.postimg.cc/g2kFHGSY/il-principe-amato.png'), 
        src: 'https://archive.org/download/il-principe-amato_202512/il%20principe%20amato.mp3' 
    },
    { 
        id: 'story3', 
        title: "La Cervia nel Bosco", 
        description: `La storia racconta di una giovane fanciulla trasformata in una cervia da un potente incantesimo. Costretta a vivere nel bosco, la cervia mantiene però il suo cuore umano e la sua dolcezza. Un giorno un principe, durante una battuta di caccia, la incontra e rimane colpito dalla sua grazia e dal suo sguardo intelligente. Scoperto il suo segreto, decide di aiutarla. Con coraggio affronta la strega responsabile dell’incantesimo e, grazie alla sua determinazione, riesce a spezzare la magia. La cervia torna ad essere una ragazza e i due, finalmente liberi dal sortilegio, ritrovano pace e felicità insieme.`,
        duration: '1:57:12', 
        image: getAsset('https://i.postimg.cc/hPtpChBw/la-cervia-nel-bosco.png'), 
        src: 'https://archive.org/download/la-cervia-nel-bosco/la%20cervia%20nel%20bosco.mp3' 
    },
    { 
        id: 'story4', 
        title: "La Gatta Bianca", 
        description: `Un giovane principe, in viaggio per superare tre prove imposte dal re, si perde in una foresta e trova rifugio in un magnifico castello abitato da una misteriosa gatta bianca, capace di parlare e di vivere come una regina. La gatta accoglie il principe con gentilezza, lo aiuta nelle prove e gli offre consigli preziosi. Con il tempo, tra i due nasce un’amicizia sincera. Alla fine si scopre che la gatta è in realtà una principessa vittima di un incantesimo: solo un atto di fiducia e di affetto sincero può liberarla. Quando l’incantesimo si spezza, la gatta riacquista forma umana e il principe comprende di aver trovato il suo vero destino al suo fianco.`,
        duration: '2:01:33', 
        image: getAsset('https://i.postimg.cc/k4CyWgsb/la-gatta-bianca.png'), 
        src: 'https://archive.org/download/la-gatta-bianca/la%20gatta%20bianca.mp3' 
    },
    { 
        id: 'story5', 
        title: "L'Uccellino Turchino", 
        description: `Una giovane principessa viene separata dal suo amato principe, trasformato da una fata malvagia in un piccolo uccellino dal piumaggio turchese. L’incantesimo gli permette di avvicinarla solo di notte, per avvertirla dei pericoli e guidarla con la sua voce melodiosa. Determinata a liberarlo, la principessa affronta un lungo viaggio pieno di prove, palazzi incantati e inganni magici. Grazie al suo coraggio e alla sua fedeltà, riesce infine a sconfiggere la fata e a spezzare l’incantesimo. L’uccellino torna a essere un principe, e i due possono finalmente ricongiungersi.`,
        duration: '1:54:31', 
        image: getAsset('https://i.postimg.cc/FFWjHZMq/l-uccellino-turchino.png'), 
        src: 'https://archive.org/download/luccello-turchino/l%27uccello%20turchino.mp3' 
    },
    { 
        id: 'story6', 
        title: "La Bella dai Capelli d'Oro", 
        description: `Una giovane fanciulla possiede capelli d’oro che la rendono famosa in tutto il regno. Un re, affascinato dalla sua fama, invia il suo ambasciatore per chiederla in sposa. L’ambasciatore, un giovane gentile e intelligente, supera diverse prove difficili grazie all’aiuto di animali magici che aveva soccorso durante il viaggio. La Bella, colpita dalla bontà e dal valore del giovane, accetta di seguirlo. Tuttavia, dopo una serie di avventure e malintesi, è proprio l’ambasciatore a conquistar il cuore della Bella, e i due trovano insieme la felicità.`,
        duration: '43:21', 
        image: getAsset('https://i.postimg.cc/02kHLcp6/la-bella-dai-capelli-d-oro.png'), 
        src: 'https://archive.org/download/la-bella-dai-capelli-doro/la%20bella%20dai%20capelli%20d%27oro.mp3' 
    },
    { 
        id: 'story7', 
        title: "Cenerentola", 
        description: `Cenerentola è una fanciulla gentile costretta a fare da serva alla matrigna e alle sorellastre. Un giorno, grazie all'aiuto della sua Fata Madrina, riesce ad andare al ballo del Re con un abito meraviglioso e una carrozza magica. Lì danza con il Principe, ma deve fuggire a mezzanotte, perdendo una scarpetta di cristallo. Il Principe la cercherà in tutto il regno finché non la ritroverà.`,
        duration: '18:30', 
        image: getAsset('https://i.postimg.cc/yYRz8fJ8/cenerentola.png'), 
        src: 'https://archive.org/download/cenerentola_202512/cenerentola.mp3' 
    },
    { 
        id: 'story8', 
        title: "Enrichetto dal Ciuffo", 
        description: `Enrichetto è un principe nato molto brutto ma con una grandissima intelligenza. Una fata gli dona il potere di rendere intelligente la persona che amerà di più. Incontra una principessa bellissima ma un po' sciocca, a cui è stato donato il potere di rendere bello chi amerà. Insieme scopriranno che l'amore vero trasforma ogni difetto in pregio.`,
        duration: '20:40', 
        image: getAsset('https://i.postimg.cc/KckYtDK7/enrichetto-dal-ciuffo.png'), 
        src: 'https://archive.org/download/enrichetto-dal-ciuffo/enrichetto%20dal%20ciuffo.mp3' 
    },
    { 
        id: 'story9', 
        title: "Il Gatto con gli Stivali", 
        description: `Alla morte di un mugnaio, al figlio minore resta solo un gatto. Ma non è un gatto qualunque: con un paio di stivali e tanta astuzia, il felino riuscirà a far credere al Re che il suo padrone è il ricco Marchese di Carabas, sconfiggendo un orco e conquistando la mano della principessa per il suo giovane amico.`,
        duration: '13:25', 
        image: getAsset('https://i.postimg.cc/SNLkGTmV/il-gatto-con-gli-stivali.png'), 
        src: 'https://archive.org/download/il-gatto-con-gli-stivali/il%20gatto%20con%20gli%20stivali.mp3' 
    },
    { 
        id: 'story10', 
        title: "Cappuccetto Rosso", 
        description: `Una bambina con una mantellina rossa deve portare un cestino alla nonna malata attraversando il bosco. Un lupo furbo la inganna per arrivare prima alla casa della nonna. Ma grazie all'intervento di un coraggioso cacciatore, Cappuccetto Rosso e la nonna verranno salvate e il lupo sconfitto. Una fiaba classica sulla prudenza.`,
        duration: '6:11', 
        image: getAsset('https://i.postimg.cc/Qdps06sb/cappuccetto-rosso.png'), 
        src: 'https://archive.org/download/cappuccetto-rosso_20251201_1745/cappuccetto%20rosso.mp3' 
    },
    { 
        id: 'story11', 
        title: "Il Drago e la Bambina", 
        description: `In un regno lontano, un drago solitario incontra una bambina che non ha paura di lui. Invece di combattere, i due scoprono di avere molto in comune e stringono una magica amicizia che insegnerà a tutto il villaggio che non bisogna giudicare dalle apparenze e che la gentilezza è l'arma più potente.`,
        duration: '14:42', 
        image: getAsset('https://i.postimg.cc/1z79q8y5/il-drago-e-la-bambina.png'), 
        src: 'https://archive.org/download/il_drago_e_la_bambina/il_drago_e_la_bambina.mp3' 
    },
    { 
        id: 'story12', 
        title: "Il Pifferaio Magico", 
        description: `La città di Hamelin è invasa dai topi. Un misterioso suonatore di piffero promette di liberarla in cambio di una ricompensa. Con la sua musica incantata porta via i topi, ma quando i cittadini rifiutano di pagarlo, il Pifferaio suona una nuova melodia per dare loro una lezione sull'importanza di mantenere le promesse.`,
        duration: '6:51', 
        image: getAsset('https://i.postimg.cc/FRJQkGPS/il-pifferaio-magico.png'), 
        src: 'https://archive.org/download/il_pifferaio_magico/il_pifferaio_magico.mp3' 
    },
    { 
        id: 'story13', 
        title: "Le Fate", 
        description: `Una vedova ha due figlie: una gentile e l'altra superba. Un giorno la figlia gentile incontra una fata travestita da povera vecchia e le offre da bere. Per ricompensa, la fata le dona il dono di far uscire fiori e pietre preziose dalla bocca a ogni parola. La sorella invidiosa cerca lo stesso dono, ma la sua maleducazione le porterà una sorte ben diversa.`,
        duration: '8:30', 
        image: getAsset('https://i.postimg.cc/Z5yPgdDD/le-fate.png'), 
        src: 'https://archive.org/download/le-fate/le%20fate.mp3' 
    },
    { 
        id: 'story14', 
        title: "Pelle d'Asino", 
        description: `Una principessa è costretta a fuggire dal suo regno nascondendosi sotto una pelle d'asino per non essere riconosciuta. Lavora come sguattera in una fattoria, ma nelle feste indossa di nascosto i suoi abiti regali. Un principe la vede per caso e se ne innamora, riuscendo infine a ritrovarla grazie a un anello che solo a lei calza a pennello.`,
        duration: '37:38', 
        image: getAsset('https://i.postimg.cc/VvprB7w3/pelle-d-asino.png'), 
        src: 'https://archive.org/download/pelle-dasino/pelle%20d%27asino.mp3' 
    },
    { 
        id: 'story15', 
        title: "Puccettino", 
        description: `Puccettino è il più piccolo di sette fratelli, ma anche il più furbo. Quando lui e i suoi fratelli si perdono nel bosco e finiscono nella casa di un orco, sarà proprio l'ingegno di Puccettino a salvarli tutti, rubando gli stivali delle sette leghe all'orco e riportando fortuna e ricchezza alla sua famiglia.`,
        duration: '26:12', 
        image: getAsset('https://i.postimg.cc/6Qc816wM/puccettino.png'), 
        src: 'https://archive.org/download/puccettino/puccettino.mp3' 
    }
];
