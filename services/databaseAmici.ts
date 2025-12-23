
import { Character } from '../types';
import { getAsset } from './LocalAssets';

export const CHARACTERS: Character[] = [
    { 
        id: 'boo', 
        name: 'Lone Boo', 
        role: 'Il Protagonista', 
        description: `Lone Boo è il cuore del gruppo, sempre pronto a vivere nuove avventure a Città Colorata. Anche se è un fantasmino, non fa paura a nessuno: preferisce regalare sorrisi e ballare a ritmo di musica! È curioso, gentile e un po' pasticcione quando si tratta di fare incantesimi.`, 
        image: getAsset('https://i.postimg.cc/YSXJ50x6/boo.png'), 
        color: 'bg-blue-100 border-blue-400 text-blue-800' 
    },
    { 
        id: 'pumpkin', 
        name: 'Zuccotto', 
        role: 'Il Pasticcione', 
        description: `Zuccotto è il pasticcione del gruppo, una zucca parlante che vede sempre il lato divertente delle cose. Ama mangiare biscotti e inventare scherzi innocenti. Nonostante la sua goffaggine, ha un cuore d'oro e sa sempre come far ridere i suoi amici.`, 
        image: getAsset('https://i.postimg.cc/mgHHtpD1/Zuccotto.png'), 
        color: 'bg-orange-100 border-orange-400 text-orange-800' 
    },
    { 
        id: 'gaia', 
        name: 'Gaia', 
        role: 'L\'Energica', 
        description: `Gaia è una bambina solare e piena di energia. Ama correre nel Parco Giochi e organizzare gare di velocità. È la più coraggiosa del gruppo e sprona sempre gli altri a superare le proprie paure con un grande sorriso.`, 
        image: getAsset('https://i.postimg.cc/yN63v1jj/Gaia.png'), 
        color: 'bg-yellow-100 border-yellow-400 text-yellow-800' 
    },
    { 
        id: 'andrea', 
        name: 'Andrea', 
        role: 'L\'Esploratore', 
        description: `Andrea è un bambino avventuriero che non si separa mai dalla sua mappa e dalla sua lente d'ingrandimento. Conosce ogni angolo segreto di Città Colorata e sogna di scoprire nuovi mondi inesplorati.`, 
        image: getAsset('https://i.postimg.cc/X7JVHZ63/Andrea.png'), 
        color: 'bg-red-100 border-red-400 text-red-800' 
    },
    { 
        id: 'grufo', 
        name: 'Grufo', 
        role: 'Il Saggio', 
        description: `Grufo è the saggio del gruppo, un gufetto che vive nella Biblioteca. Sa tutto di tutto e ama raccontare storie antiche e risolvere enigmi complicati. È calmo, riflessivo e dà sempre ottimi consigli.`, 
        image: getAsset('https://i.postimg.cc/k564G2gJ/Grufo-Parlerino.png'), 
        color: 'bg-teal-100 border-teal-400 text-teal-800' 
    },
    { 
        id: 'raffa', 
        name: 'Raffa', 
        role: 'La Melodica', 
        description: `Raffa la Melodica ama la musica più di ogni altra cosa. La trovi spesso nella Discoteca o nel Bosco delle Fiabe mentre canta dolci melodie con la sua voce armoniosa. È molto sensibile e sa ascoltare i problemi di tutti.`, 
        image: getAsset('https://i.postimg.cc/MZrFbX6H/Raffa-la-Melodica.png'), 
        color: 'bg-pink-100 border-pink-400 text-pink-800' 
    },
    { 
        id: 'batbeat', 
        name: 'BatBeat', 
        role: 'Il Musicista', 
        description: `BatBeat è il DJ del gruppo, un pipistrello che adora i ritmi moderni. Crea basi musicali incredibili e trasforma ogni giornata in una festa indimenticabile. Nonostante l'aspetto un po' "rocker", è dolcissimo.`, 
        image: getAsset('https://i.postimg.cc/YC7ZjZ2Q/Bat-Beat.png'), 
        color: 'bg-purple-100 border-purple-400 text-purple-800' 
    },
    { 
        id: 'maragno', 
        name: 'Maragno', 
        // Fix: added quotes to 'Lo Spiritoso' string value
        role: 'Lo Spiritoso', 
        description: `Il Maragno è il ragno sbruffone di Città Colorata. Ama fare battute veloci e tessere tele luccicanti. Anche se a volte sembra un po' troppo sicuro di sé, è un amico leale che corre sempre in aiuto quando serve.`, 
        image: getAsset('https://i.postimg.cc/hjKtrp0L/Maragno.png'), 
        color: 'bg-stone-100 border-stone-400 text-stone-800' 
    },
    { 
        id: 'flora', 
        name: 'Fata Flora', 
        role: 'La Creativa', 
        description: `Fata Flora è una piccola creativa che usa la magia per far fiorire i colori. Vive nel Bosco delle Fiabe e si occupa di proteggere la natura. Ama dipingere con i petali dei fiori e creare profumi magici.`, 
        image: getAsset('https://i.postimg.cc/XNGYgGfh/Fata-Flora.png'), 
        color: 'bg-emerald-100 border-emerald-400 text-emerald-800' 
    },
    { 
        id: 'marlo', 
        name: 'Marlo', 
        role: 'Il Robot Gentile', 
        description: `Marlo è un robot dal cuore tenero costruito con vecchi pezzi colorati. È incredibilmente forte ma si muove con delicatezza per non rompere nulla. Ama giocare a nascondino anche se non è molto bravo perché fa sempre "bip bip"!`, 
        image: getAsset('https://i.postimg.cc/gkY7VTLW/Marlo.png'), 
        color: 'bg-cyan-100 border-cyan-400 text-cyan-800' 
    }
];
