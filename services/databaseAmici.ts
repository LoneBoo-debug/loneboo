import { Character } from '../types';
import { getAsset } from './LocalAssets';

export const CHARACTERS: Character[] = [
    { 
        id: 'boo', 
        name: 'Lone Boo', 
        role: 'Il Protagonista', 
        description: `Lone Boo è il cuore del gruppo, sempre pronto a vivere nuove avventure a Città Colorata. Anche se è un fantasmino, non fa paura a nessuno: preferisce regalare sorrisi e ballare a ritmo di musica! È curioso, gentile e un po' pasticcione quando si tratta di fare incantesimi.`, 
        image: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/boo.webp'), 
        color: 'bg-blue-100 border-blue-400 text-blue-800' 
    },
    { 
        id: 'pumpkin', 
        name: 'Zuccotto', 
        role: 'Il Pasticcione', 
        description: `Zuccotto è il pasticcione del gruppo, una zucca parlante che vede sempre il lato divertente delle cose. Ama mangiare biscotti e inventare scherzi innocenti. Nonostante la sua goffaggine, ha un cuore d'oro e sa sempre come far ridere i suoi amici.`, 
        image: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/pumpkin.webp'), 
        color: 'bg-orange-100 border-orange-400 text-orange-800' 
    },
    { 
        id: 'gaia', 
        name: 'Gaia', 
        role: 'L\'Energica', 
        description: `Gaia è una bambina solare e piena di energia. Ama correre nel Parco Giochi e organizzare gare di velocità. È la più coraggiosa del gruppo e sprona sempre gli altri a superare le proprie paure con un grande sorriso.`, 
        image: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/gaia.webp'), 
        color: 'bg-yellow-100 border-yellow-400 text-yellow-800' 
    },
    { 
        id: 'andrea', 
        name: 'Andrea', 
        role: 'L\'Esploratore', 
        description: `Andrea è un bambino avventuriero che non si separa mai dalla sua mappa e dalla sua lente d'ingrandimento. Conosce ogni angolo segreto di Città Colorata e sogna di scoprire nuovi mondi inesplorati.`, 
        image: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/andrea.webp'), 
        color: 'bg-red-100 border-red-400 text-red-800' 
    },
    { 
        id: 'grufo', 
        name: 'Grufo', 
        role: 'Il Saggio', 
        description: `Grufo è the saggio del gruppo, un gufetto che vive nella Biblioteca. Sa tutto di tutto e ama raccontare storie antiche e risolvere enigmi complicati. È calmo, riflessivo e dà sempre ottimi consigli.`, 
        image: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/grufo.webp'), 
        color: 'bg-teal-100 border-teal-400 text-teal-800' 
    },
    { 
        id: 'raffa', 
        name: 'Raffa', 
        role: 'La Melodica', 
        description: `Raffa la Melodica ama la musica più di ogni altra cosa. La trovi spesso nella Discoteca o nel Bosco delle Fiabe mentre canta dolci melodie con la sua voce armoniosa. È molto sensibile e sa ascoltare i problemi di tutti.`, 
        image: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/raffa.webp'), 
        color: 'bg-pink-100 border-pink-400 text-pink-800' 
    },
    { 
        id: 'batbeat', 
        name: 'BatBeat', 
        role: 'Il Musicista', 
        description: `BatBeat è il DJ del gruppo, un pipistrello che adora i ritmi moderni. Crea basi musicali incredibili e trasforma ogni giornata in una festa indimenticabile. Nonostante l'aspetto un po' "rocker", è dolcissimo.`, 
        image: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/batbeat.webp'), 
        color: 'bg-purple-100 border-purple-400 text-purple-800' 
    },
    { 
        id: 'maragno', 
        name: 'Maragno', 
        role: 'Lo Spiritoso', 
        description: `Il Maragno è il ragno sbruffone di Città Colorata. Ama fare battute veloci e tessere tele luccicanti. Anche se a volte sembra un po' troppo sicuro di sé, è un amico leale che corre sempre in aiuto quando serve.`, 
        image: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/maragno.webp'), 
        color: 'bg-stone-100 border-stone-400 text-stone-800' 
    },
    { 
        id: 'flora', 
        name: 'Fata Flora', 
        role: 'La Creativa', 
        description: `Fata Flora è una piccola creativa che usa la magia per far fiorire i colori. Vive nel Bosco delle Fiabe e si occupa di proteggere la natura. Ama dipingere con i petali dei fiori e creare profumi magici.`, 
        image: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/flora.webp'), 
        color: 'bg-emerald-100 border-emerald-400 text-emerald-800' 
    },
    { 
        id: 'marlo', 
        name: 'Marlo', 
        role: 'Il Robot Gentile', 
        description: `Marlo è un robot dal cuore tenero costruito con vecchi pezzi colorati. È incredibilmente forte ma si muove con delicatezza per non rompere nulla. Ama giocare a nascondino anche se non è molto bravo perché fa sempre "bip bip"!`, 
        image: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/marlo.webp'), 
        color: 'bg-cyan-100 border-cyan-400 text-cyan-800' 
    }
];