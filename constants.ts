
import { Video, Book, SocialLink, QuizQuestion, FanArt, AppView, FairyTale, ColoringCategory, Character, Sticker } from './types';

// =================================================================================================
// 🏷️ VERSIONE APP
// =================================================================================================
export const APP_VERSION = '1.6.0';

// LoneBoo Official Logo
export const CHANNEL_LOGO = 'https://lh3.googleusercontent.com/d/1jnecFUan677BId1slOSsP532hZ_DKWee'; 

// =================================================================================================
// 🏠 ICONA CASETTA (TASTO HOME)
// =================================================================================================
export const HOME_ICON = 'https://i.postimg.cc/9M6v55V8/logsede.png';

// =================================================================================================
// 🚨 IMMAGINE HERO (IL FANTASMINO CENTRALE)
// =================================================================================================
export const HOME_HERO_IMAGE = 'https://i.postimg.cc/SKdgjcXW/ghhhhost.png';

// =================================================================================================
// 🗺️ MAPPA DI CITTÀ COLORATA (DESKTOP - 16:9)
// =================================================================================================
export const CITY_MAP_IMAGE = 'https://i.postimg.cc/Hn1FHWYb/mappaa.png';

// =================================================================================================
// 📱 MAPPA DI CITTÀ COLORATA (MOBILE - VERTICALE)
// =================================================================================================
export const CITY_MAP_IMAGE_MOBILE = 'https://i.postimg.cc/bJtG5PNV/mappssa22.png';

// =================================================================================================
// ☁️ IMMAGINE NUVOLETTA (OPZIONALE)
// =================================================================================================
export const HOME_CLOUD_IMAGE: string = '';

// =================================================================================================
// 🖼️ SFONDO HOME PAGE
// =================================================================================================
export const HOME_BACKGROUND_IMAGE: string = '';
export const HOME_BG_MOBILE = 'https://i.postimg.cc/vBmvH8Nw/dfggsh.jpg';
export const HOME_BG_DESKTOP = 'https://i.postimg.cc/j2RYjF7J/psfrdds.jpg';

// =================================================================================================
// 🎨 FAN ART GOOGLE SHEET (CSV)
// =================================================================================================
export const FAN_ART_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSL1SLGxxN1zN0qEwN0QpuK8dPSRcVDIx1Dy-sryRlIAm5cIgQS3j9o1nN1kGbHH7VrRS0VBo7KvfSm/pub?gid=0&single=true&output=csv'; 

// =================================================================================================
// 📢 COMMUNITY POSTS GOOGLE SHEET (CSV)
// =================================================================================================
export const COMMUNITY_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQztpA2nvwkfSoJ4CArYQC-FlfRcvn6ngfstnyZEEGNsjkuGS0aOpheX3jsUBE95boEo_dLe8dfQXGT/pub?gid=0&single=true&output=csv'; 

// =================================================================================================
// 🔔 NOTIFICHE GOOGLE SHEET (CSV)
// =================================================================================================
export const NOTIFICATIONS_CSV_URL: string = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTuB_-wFGsDVWxL6Kk-K87B_URCHgEIB2ax1FCyXsUDuhhjHyWRQGE3e4nM-D6frI5cg2zpyn_CR_3b/pub?gid=0&single=true&output=csv'; 

// =================================================================================================
// 📊 STATISTICHE SOCIAL GOOGLE SHEET (CSV)
// =================================================================================================
export const SOCIAL_STATS_CSV_URL: string = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOn4nPnIbqs4jzAVQbpPYCXll7iX3lxLWIA5he7lqeEMXfxDRa2rJ62vyYZ0_8IYzpnTpJHo-nSUXy/pub?gid=0&single=true&output=csv'; 


// ==================================================================================
// 🔒 CONFIGURAZIONE API (SAFE ACCESS)
// ==================================================================================

const DEFAULT_CHANNEL_ID = 'UC54EfsufATyB7s2XcRkt1Eg'; 

// Safe process access to prevent crash
const getEnv = (key: string) => {
    try {
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env) {
            // @ts-ignore
            return process.env[key];
        }
    } catch (e) {}
    return '';
};

const envApiKey = getEnv('VITE_YOUTUBE_API_KEY');
const envChannelId = getEnv('VITE_YOUTUBE_CHANNEL_ID') || DEFAULT_CHANNEL_ID;

export const YOUTUBE_CONFIG = {
  API_KEY: envApiKey,
  CHANNEL_ID: envChannelId
};

// --- CITY MAP NAVIGATION CONFIGURATION (Coordinates in %) ---
// top/left = Desktop (16:9 Image) - Updated coordinates
// mobileTop/mobileLeft = Mobile (Vertical Image) - Distributed vertically
export const MAP_LOCATIONS = [
    // TORRE MAGICA
    { id: AppView.AI_MAGIC, label: 'Torre Magica', emoji: '🔮', top: '26.22%', left: '47.81%', mobileTop: '15%', mobileLeft: '50%', color: 'bg-purple-600', border: 'border-purple-800' },
    
    // BOSCO FIABE
    { id: AppView.TALES, label: 'Bosco Fiabe', emoji: '🌲', top: '41.96%', left: '77.19%', mobileTop: '36%', mobileLeft: '83%', color: 'bg-emerald-600', border: 'border-emerald-800' },
    
    // PARCO GIOCHI
    { id: AppView.PLAY, label: 'Parco Giochi', emoji: '🎡', top: '25.22%', left: '28.57%', mobileTop: '25%', mobileLeft: '29%', color: 'bg-green-500', border: 'border-green-700' },
    
    // BIBLIOTECA
    { id: AppView.BOOKS, label: 'Biblioteca', emoji: '📚', top: '21.23%', left: '68.87%', mobileTop: '17%', mobileLeft: '81%', color: 'bg-blue-600', border: 'border-blue-800' },
    
    // DISCOTECA
    { id: AppView.SOUNDS, label: 'Disco', emoji: '🎧', top: '71.68%', left: '35.99%', mobileTop: '61%', mobileLeft: '33%', color: 'bg-pink-500', border: 'border-pink-700' },
    
    // PIAZZA
    { id: AppView.COMMUNITY, label: 'Piazza', emoji: '📰', top: '94.16%', left: '40.1%', mobileTop: '87%', mobileLeft: '44%', color: 'bg-teal-500', border: 'border-teal-700' },
    
    // ACCADEMIA
    { id: AppView.COLORING, label: 'Accademia', emoji: '🎨', top: '78.17%', left: '17.24%', mobileTop: '73%', mobileLeft: '16%', color: 'bg-orange-500', border: 'border-orange-700' },
    
    // MUSEO
    { id: AppView.FANART, label: 'Museo', emoji: '🖼️', top: '79.67%', left: '71.87%', mobileTop: '74%', mobileLeft: '77%', color: 'bg-yellow-400', border: 'border-yellow-600', textDark: true },
    
    // CINEMA
    { id: AppView.VIDEOS, label: 'Cinema', emoji: '🍿', top: '45.7%', left: '10.73%', mobileTop: '48%', mobileLeft: '14%', color: 'bg-red-500', border: 'border-red-700' },
    
    // STAZIONE
    { id: AppView.SOCIALS, label: 'Stazione', emoji: '🚂', top: '74.93%', left: '85%', mobileTop: '60%', mobileLeft: '88%', color: 'bg-gray-700', border: 'border-gray-900' },
    
    // INFO POINT
    { id: AppView.CHAT, label: 'Info Point', emoji: '💬', top: '63.19%', left: '58.54%', mobileTop: '59%', mobileLeft: '56%', color: 'bg-cyan-500', border: 'border-cyan-700' },
];

// --- BOO HOUSE ROOMS CONFIGURATION ---
// Usa lo strumento "Calibra" nella pagina Casa per trovare i valori corretti di top/left
export const HOUSE_ROOMS = [
    { 
        id: AppView.BOO_GARDEN, 
        label: 'Giardino', 
        emoji: '🌳', 
        top: '85%', left: '18%', 
        color: 'bg-green-500', 
        border: 'border-green-700' 
    },
    { 
        id: AppView.BOO_BEDROOM, 
        label: 'Camera', 
        emoji: '🛌', 
        top: '58%', left: '21%', 
        color: 'bg-purple-500', 
        border: 'border-purple-700' 
    },
    { 
        id: AppView.BOO_LIVING_ROOM, 
        label: 'Salotto', 
        emoji: '🛋️', 
        top: '31%', left: '69%', 
        color: 'bg-orange-500', 
        border: 'border-orange-700' 
    },
    { 
        id: AppView.BOO_BATHROOM, 
        label: 'Bagno', 
        emoji: '🛁', 
        top: '61%', left: '77%', 
        color: 'bg-cyan-500', 
        border: 'border-cyan-700' 
    },
    { 
        id: AppView.BOO_KITCHEN, 
        label: 'Cucina', 
        emoji: '🍳', 
        top: '29%', left: '24%', 
        color: 'bg-yellow-400', 
        border: 'border-yellow-600',
        textDark: true
    }
];

// --- STICKER COLLECTION DATA (VOLUME 1) ---
export const STICKERS_COLLECTION: Sticker[] = [
    // --- COMMON (14) ---
    { id: 'stk-001', name: 'Alien Cat', image: 'https://i.postimg.cc/50VPD1Yk/alien-cat.jpg', rarity: 'COMMON', description: 'Miao spaziale!' },
    { id: 'stk-002', name: 'Anatra Vasino', image: 'https://i.postimg.cc/Nj2pMLRZ/anatra-vasino.jpg', rarity: 'COMMON', description: 'Pronta per il bagno.' },
    { id: 'stk-003', name: 'Banana Surf', image: 'https://i.postimg.cc/5tq5Yzy2/banana-surf.jpg', rarity: 'COMMON', description: 'Sulla cresta dell\'onda!' },
    { id: 'stk-004', name: 'Cane Cono', image: 'https://i.postimg.cc/FH038Sjg/cane-cono.jpg', rarity: 'COMMON', description: 'Gusto vaniglia.' },
    { id: 'stk-005', name: 'Carota Yea', image: 'https://i.postimg.cc/d1NyrjYd/carota-yea.jpg', rarity: 'COMMON', description: 'Vitamina C a ritmo.' },
    { id: 'stk-006', name: 'Dino Ballerino', image: 'https://i.postimg.cc/k4H2BMQS/dino-ballerino.jpg', rarity: 'COMMON', description: 'Il re della pista.' },
    { id: 'stk-007', name: 'Faccia Di Pane', image: 'https://i.postimg.cc/8kqbYN2D/faccia-di-pane.jpg', rarity: 'COMMON', description: 'Morbido e simpatico.' },
    { id: 'stk-008', name: 'Frulla Frulla', image: 'https://i.postimg.cc/cJ9RBS7n/frulla-frulla.jpg', rarity: 'COMMON', description: 'Gira tutto!' },
    { id: 'stk-009', name: 'Mangia Papere', image: 'https://i.postimg.cc/MKmjYwqS/mangia-papere.jpg', rarity: 'COMMON', description: 'Gnam gnam!' },
    { id: 'stk-010', name: 'Color Mucca', image: 'https://i.postimg.cc/6p1qH5Pz/mucca-arcobaleno.jpg', rarity: 'COMMON', description: 'Latte a colori.' },
    { id: 'stk-011', name: 'Pizza Lina', image: 'https://i.postimg.cc/Pr5dBn1L/pizza-lina.jpg', rarity: 'COMMON', description: 'Margherita felice.' },
    { id: 'stk-012', name: 'Rana Pop', image: 'https://i.postimg.cc/ydTzbLdW/rana-pop.jpg', rarity: 'COMMON', description: 'Salta e canta.' },
    { id: 'stk-013', name: 'Tazza Magna', image: 'https://i.postimg.cc/qR15KSqt/tazza-magna.jpg', rarity: 'COMMON', description: 'Colazione abbondante.' },
    { id: 'stk-014', name: 'Wow Dog', image: 'https://i.postimg.cc/brKLHhh0/wow-dog.jpg', rarity: 'COMMON', description: 'Sorpresa canina.' },

    // --- RARE (10) ---
    { id: 'stk-015', name: 'Alieno Spaghetto', image: 'https://i.postimg.cc/L5yNq1CF/alieno-spaghetto.jpg', rarity: 'RARE', description: 'Venuto per la pasta.' },
    { id: 'stk-016', name: 'Baloondog', image: 'https://i.postimg.cc/kMjcvWcz/baloondog.jpg', rarity: 'RARE', description: 'Leggero come l\'aria.' },
    { id: 'stk-017', name: 'Cacto Pazco', image: 'https://i.postimg.cc/qqg25ZLW/cacto-pazco.jpg', rarity: 'RARE', description: 'Punge ma è dolce.' },
    { id: 'stk-018', name: 'Cervello Bolla', image: 'https://i.postimg.cc/pLQ5qHH4/cervello-bolla.jpg', rarity: 'RARE', description: 'Idee galleggianti.' },
    { id: 'stk-019', name: 'Gatto Sotto', image: 'https://i.postimg.cc/MK2yDtBB/gatto-circo.jpg', rarity: 'RARE', description: 'Miao giocoliere.' },
    { id: 'stk-020', name: 'Hot Slime', image: 'https://i.postimg.cc/hvF72PXB/hot-slime.jpg', rarity: 'RARE', description: 'Appiccicoso e caldo.' },
    { id: 'stk-021', name: 'Ippo Patato', image: 'https://i.postimg.cc/pd49dXY8/patato-ippo.jpg', rarity: 'RARE', description: 'Pesante ma tenero.' },
    { id: 'stk-022', name: 'Piango Robo', image: 'https://i.postimg.cc/mkw27bM7/piango-robo.jpg', rarity: 'RARE', description: 'Lacrime di olio.' },
    { id: 'stk-023', name: 'Tostagatto', image: 'https://i.postimg.cc/h43YPkH7/tostagatto.jpg', rarity: 'RARE', description: 'Colazione felina.' },
    { id: 'stk-024', name: 'Trattopazzo', image: 'https://i.postimg.cc/6Q0jsgr6/trattopazzo.jpg', rarity: 'RARE', description: 'Guida spericolata.' },

    // --- EPIC (4) ---
    { id: 'stk-025', name: 'Astro Us', image: 'https://i.postimg.cc/fLCvFdhL/astro-us.jpg', rarity: 'EPIC', description: 'Esploratore galattico.' },
    { id: 'stk-026', name: 'Piovro Bubble', image: 'https://i.postimg.cc/RF1MzMP0/piovro-bubble.jpg', rarity: 'EPIC', description: 'Otto braccia di bolle.' },
    { id: 'stk-027', name: 'Roblospino', image: 'https://i.postimg.cc/NGpc8CZg/roblospino.jpg', rarity: 'EPIC', description: 'Tecnologia pungente.' },
    { id: 'stk-028', name: 'Rotocatto', image: 'https://i.postimg.cc/FK55FMkY/rotocatto.jpg', rarity: 'EPIC', description: 'Gatto a motore.' },

    // --- LEGENDARY (2) ---
    { id: 'stk-029', name: 'Scappa Drin', image: 'https://i.postimg.cc/HnLFPHR3/scappa-drin.jpg', rarity: 'LEGENDARY', description: 'La sveglia più veloce.' },
    { id: 'stk-030', name: 'Super Banano', image: 'https://i.postimg.cc/RZtyYgpx/super-banano.jpg', rarity: 'LEGENDARY', description: 'L\'eroe della frutta.' }
];

// --- STICKER COLLECTION VOLUME 2 (NUOVI PERSONAGGI) ---
export const STICKERS_COLLECTION_VOL2: Sticker[] = [
    // --- COMMON (14) ---
    { id: 'stk2-001', name: 'Albero Dei Coni', image: 'https://i.postimg.cc/6q38w0pv/albero-dei-coni.jpg', rarity: 'COMMON', description: 'Gelati che crescono sui rami!' },
    { id: 'stk2-002', name: 'Autoban', image: 'https://i.postimg.cc/GpC99rp3/autoban.jpg', rarity: 'COMMON', description: 'Non parcheggiare qui!' },
    { id: 'stk2-003', name: 'Baby Dino', image: 'https://i.postimg.cc/GtHm6mXC/baby-dino.jpg', rarity: 'COMMON', description: 'Piccolo ma ruggente.' },
    { id: 'stk2-004', name: 'Banaphone', image: 'https://i.postimg.cc/654Q0T7V/bana-phone.jpg', rarity: 'COMMON', description: 'Pronto? Chi parla?' },
    { id: 'stk2-005', name: 'Biscognam', image: 'https://i.postimg.cc/1zBRtqTH/biscognam.jpg', rarity: 'COMMON', description: 'Croccante e dolce.' },
    { id: 'stk2-006', name: 'Calzino Curioso', image: 'https://i.postimg.cc/yNLBBzgp/calzino-curioso.jpg', rarity: 'COMMON', description: 'Dove sarà il compagno?' },
    { id: 'stk2-007', name: 'Canta Wc', image: 'https://i.postimg.cc/0jwqpMtM/canta-wc.jpg', rarity: 'COMMON', description: 'Opera sotto la doccia.' },
    { id: 'stk2-008', name: 'Cuscino Sveglino', image: 'https://i.postimg.cc/VsxJ2jPZ/cuscino-sveglino.jpg', rarity: 'COMMON', description: 'Non ti fa mai dormire.' },
    { id: 'stk2-009', name: 'Zuppa Pazza', image: 'https://i.postimg.cc/zXYfx8ny/fagioli-pazzi.jpg', rarity: 'COMMON', description: 'Ingredienti segreti e matti.' },
    { id: 'stk2-010', name: 'Fizzy Pop', image: 'https://i.postimg.cc/TYT6ywVg/fizzy-pop.jpg', rarity: 'COMMON', description: 'Frizzante come non mai.' },
    { id: 'stk2-011', name: 'Galla Nonna', image: 'https://i.postimg.cc/6Q4JsGKX/galla-nonna.jpg', rarity: 'COMMON', description: 'Galleggia con stile.' },
    { id: 'stk2-012', name: 'Gommo Dino', image: 'https://i.postimg.cc/3xybW5c0/gommo-dino.jpg', rarity: 'COMMON', description: 'Rimbalza ovunque.' },
    { id: 'stk2-013', name: 'Mela Penso', image: 'https://i.postimg.cc/FHJDNbYG/mela-penso.jpg', rarity: 'COMMON', description: 'Un frutto filosofico.' },
    { id: 'stk2-014', name: 'Orsetto Confetto', image: 'https://i.postimg.cc/G2zjqqfT/orsetto-confetto.jpg', rarity: 'COMMON', description: 'Dolce da morire.' },

    // --- RARE (10) ---
    { id: 'stk2-015', name: 'Alien Ice', image: 'https://i.postimg.cc/7Yj58Svp/alien-ice.jpg', rarity: 'RARE', description: 'Ghiacciolo venuto dallo spazio.' },
    { id: 'stk2-016', name: 'Bimbo Boom', image: 'https://i.postimg.cc/L8z6c73t/bimbo-boom.jpg', rarity: 'RARE', description: 'Un\'esplosione di allegria.' },
    { id: 'stk2-017', name: 'Blocco Re', image: 'https://i.postimg.cc/fyGDFjtz/blocco-re.jpg', rarity: 'RARE', description: 'Il sovrano dei mattoncini.' },
    { id: 'stk2-018', name: 'Burger King', image: 'https://i.postimg.cc/0yq90n1C/burger-king.jpg', rarity: 'RARE', description: 'Il panino reale.' },
    { id: 'stk2-019', name: 'Fiorebot', image: 'https://i.postimg.cc/Nftg1bc5/fiorebot.jpg', rarity: 'RARE', description: 'Natura tecnologica.' },
    { id: 'stk2-020', name: 'Gnocchi Glitch', image: 'https://i.postimg.cc/FRX62WGf/gnocchi-glitch.jpg', rarity: 'RARE', description: 'Pasta digitale.' },
    { id: 'stk2-021', name: 'Lumaca Baleno', image: 'https://i.postimg.cc/sx6wDw9C/lumaca-baleno.jpg', rarity: 'RARE', description: 'Più veloce della luce.' },
    { id: 'stk2-022', name: 'Nuvola Ciambellosa', image: 'https://i.postimg.cc/PqWy8tzK/nuvola-ciambellosa.jpg', rarity: 'RARE', description: 'Soffice e zuccherosa.' },
    { id: 'stk2-023', name: 'Pastellante', image: 'https://i.postimg.cc/J76qXYJj/pastellante.jpg', rarity: 'RARE', description: 'Colora il mondo.' },
    { id: 'stk2-024', name: 'Pizza Express', image: 'https://i.postimg.cc/zGWS9JM5/pizza-express.jpg', rarity: 'RARE', description: 'Consegna in 3 secondi.' },

    // --- EPIC (4) ---
    { id: 'stk2-025', name: 'Discoiattolo', image: 'https://i.postimg.cc/sgc1BqGZ/discoiattolo.jpg', rarity: 'EPIC', description: 'Il re della pista da ballo.' },
    { id: 'stk2-026', name: 'Glitchy Boo', image: 'https://i.postimg.cc/mkR0FXHk/glitchy-boo.jpg', rarity: 'EPIC', description: 'Un errore nel sistema fantasma.' },
    { id: 'stk2-027', name: 'Lampo Di Genio', image: 'https://i.postimg.cc/QtD66Bx4/lampo-di-genio.jpg', rarity: 'EPIC', description: 'Un\'idea brillante!' },
    { id: 'stk2-028', name: 'Rocket Pio', image: 'https://i.postimg.cc/3RrX42xz/rocket-pio.jpg', rarity: 'EPIC', description: 'Pulcino spaziale.' },

    // --- LEGENDARY (2) ---
    { id: 'stk2-029', name: 'Pazzo Boo', image: 'https://i.postimg.cc/wTnQftwv/pazzo-boo.jpg', rarity: 'LEGENDARY', description: 'Il fantasma più matto di tutti!' },
    { id: 'stk2-030', name: 'Taco Gatto', image: 'https://i.postimg.cc/NF5RbYTb/taco-gatto.jpg', rarity: 'LEGENDARY', description: 'Miao! Salsa piccante inclusa.' }
];

export const CHARACTERS: Character[] = [
    {
        id: 'boo',
        name: 'Lone Boo',
        role: 'Il Protagonista',
        description: `Lone Boo è il cuore del gruppo, sempre pronto a vivere nuove avventure.
Ama giocare con gli amici e affrontare ogni sfida con curiosità e coraggio.
È gioioso, positivo e riesce a far sorridere chiunque lo incontri.
La sua fantasia e creatività lo rendono il leader naturale delle storie del network.`,
        image: 'https://i.postimg.cc/YSXJ50x6/boo.png',
        color: 'bg-blue-100 border-blue-400 text-blue-800'
    },
    {
        id: 'pumpkin',
        name: 'Zuccotto',
        role: 'Il Pasticcione',
        description: `Zuccotto è il pasticcione del gruppo: combina guai senza volerlo ma in modo buffo.
Ama provare cose nuove, anche se spesso finisce in situazioni divertenti.
Ha un cuore grande e adora far ridere gli amici con le sue goffaggini.
È curioso, allegro e pieno di energia, sempre pronto a mettersi in gioco.`,
        image: 'https://i.postimg.cc/mgHHtpD1/Zuccotto.png',
        color: 'bg-orange-100 border-orange-400 text-orange-800'
    },
    {
        id: 'gaia',
        name: 'Gaia',
        role: 'L\'Energica',
        description: `Gaia è una bambina solare, indipendente e piena di energia.
Ama le sfide e adora supportare gli amici nelle loro avventure.
È brillante, curiosa e sempre pronta a trovare soluzioni creative.
Il suo entusiasmo contagioso rende ogni esperienza con lei divertente e speciale.`,
        image: 'https://i.postimg.cc/yN63v1jj/Gaia.png',
        color: 'bg-yellow-100 border-yellow-400 text-yellow-800'
    },
    {
        id: 'andrea',
        name: 'Andrea',
        role: 'L\'Esploratore',
        description: `Andrea è un bambino avventuriero e genio della matematica.
Ama esplorare, risolvere enigmi e condividere le sue idee con gli amici.
È curioso, intelligente e sempre pronto a inventare nuovi giochi.
Con il suo spirito intraprendente incoraggia gli altri a mettersi alla prova.`,
        image: 'https://i.postimg.cc/X7JVHZ63/Andrea.png',
        color: 'bg-red-100 border-red-400 text-red-800'
    },
    {
        id: 'grufo',
        name: 'Grufo',
        role: 'Il Saggio',
        description: `Grufo è il saggio del gruppo, pronto a dare consigli preziosi.
Aiuta gli amici a risolvere problemi e affrontare le situazioni con calma.
È paziente, affidabile e sempre disposto a guidare con gentilezza.
La sua saggezza lo rende un punto di riferimento per tutti nel gruppo.`,
        image: 'https://i.postimg.cc/k564G2gJ/Grufo-Parlerino.png',
        color: 'bg-teal-100 border-teal-400 text-teal-800'
    },
    {
        id: 'raffa',
        name: 'Raffa',
        role: 'La Melodica',
        description: `Raffa la Melodica ama la musica e sa come far divertire chiunque.
Porta allegria con le sue melodie e condivide la gioia di suonare insieme.
È gioiosa, amichevole e sempre pronta a far sorridere gli amici.
La sua passione per la musica rende ogni giornata speciale e divertente.`,
        image: 'https://i.postimg.cc/MZrFbX6H/Raffa-la-Melodica.png',
        color: 'bg-pink-100 border-pink-400 text-pink-800'
    },
    {
        id: 'batbeat',
        name: 'BatBeat',
        role: 'Il Musicista',
        description: `BatBeat è il DJ del gruppo, sempre alle prese con musica e melodie.
Ama far ballare e divertire gli amici con ritmi allegri e contagiosi.
È spiritoso, socievole e adora condividere la sua passione musicale.
Anche se a volte è un po’ vanitoso, il suo cuore resta gentile e allegro.`,
        image: 'https://i.postimg.cc/YC7ZjZ2Q/Bat-Beat.png', 
        color: 'bg-purple-100 border-purple-400 text-purple-800'
    },
    {
        id: 'maragno',
        name: 'Maragno',
        role: 'Lo Spiritoso',
        description: `Il Maragno è il ragno sbruffone e spiritoso del gruppo.
Ama mettersi in mostra e far ridere gli amici con le sue buffe trovate.
È divertente, curioso e sempre pronto a vivere piccole avventure.
Nonostante il suo atteggiamento da “figo”, resta dolce e affettuoso con tutti.`,
        image: 'https://i.postimg.cc/hjKtrp0L/Maragno.png',
        color: 'bg-stone-100 border-stone-400 text-stone-800'
    },
    {
        id: 'flora',
        name: 'Fata Flora',
        role: 'La Creativa',
        description: `Fata Flora è una piccola creativa, sempre piena di idee e colori.
Ama disegnare, dipingere e inventare storie insieme agli amici.
È dolce, curiosa e sempre pronta a dare una mano a chi ne ha bisogno.
Porta allegria e fantasia ovunque vada, rendendo ogni momento speciale.`,
        image: 'https://i.postimg.cc/XNGYgGfh/Fata-Flora.png',
        color: 'bg-emerald-100 border-emerald-400 text-emerald-800'
    },
    {
        id: 'marlo',
        name: 'Marlo',
        role: 'Il Robot Gentile',
        description: `Marlo è un robot dal cuore tenero, sempre pronto a dare una mano a chiunque ne abbia bisogno.
Anche se ogni tanto si inceppa, mette sempre il sorriso grazie alla sua dolcezza naturale.
È curioso, sensibile e sorprendentemente emotivo, capace di capire gli altri meglio di molti umani.
Per tutto il gruppo è un amico leale, capace di trasformare ogni problema in un momento di calore e gentilezza.`,
        image: 'https://i.postimg.cc/gkY7VTLW/Marlo.png',
        color: 'bg-cyan-100 border-cyan-400 text-cyan-800'
    }
];

export const DJ_SOUNDS = [
    { id: 'fart', label: 'Pernacchia', emoji: '💨', src: 'https://www.myinstants.com/media/sounds/fart-with-reverb.mp3' },
    { id: 'boing', label: 'Boing', emoji: '🤪', src: 'https://www.myinstants.com/media/sounds/boing2.mp3' },
    { id: 'laugh', label: 'Risata', emoji: '😆', src: 'https://www.myinstants.com/media/sounds/baby-laughing.mp3' },
    { id: 'horn', label: 'Tromba', emoji: '📢', src: 'https://www.myinstants.com/media/sounds/air-horn-club-sample_1.mp3' },
    { id: 'clap', label: 'Bravo!', emoji: '👏', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },
    { id: 'pop', label: 'Pop', emoji: '🍾', src: 'https://www.myinstants.com/media/sounds/pop-sound-effect.mp3' },
    { id: 'whistle', label: 'Fischio', emoji: '😗', src: 'https://www.myinstants.com/media/sounds/whistle_1.mp3' },
    { id: 'burp', label: 'Rutto', emoji: '🤢', src: 'https://www.myinstants.com/media/sounds/burp.mp3' },
    { id: 'magic', label: 'Magia', emoji: '✨', src: 'https://www.myinstants.com/media/sounds/magic-wand.mp3' }
];

export const ANIMAL_SOUNDS = [
    { id: 'dog', label: 'Cane', emoji: '🐶', src: 'https://www.myinstants.com/media/sounds/dog-bark.mp3' },
    { id: 'rooster', label: 'Gallo', emoji: '🐓', src: 'https://www.myinstants.com/media/sounds/rooster.mp3' },
    { id: 'duck', label: 'Papera', emoji: '🦆', src: 'https://www.myinstants.com/media/sounds/quack.mp3' },
    { id: 'elephant', label: 'Elefante', emoji: '🐘', src: 'https://www.myinstants.com/media/sounds/elephant.mp3' },
    { id: 'pig', label: 'Maiale', emoji: '🐷', src: 'https://www.myinstants.com/media/sounds/pig.mp3' },
    { id: 'cat', label: 'Gatto', emoji: '🐱', src: 'https://www.google.com/logos/fnbx/animal_sounds/cat.mp3' },
    { id: 'cow', label: 'Mucca', emoji: '🐮', src: 'https://www.google.com/logos/fnbx/animal_sounds/cow.mp3' },
    { id: 'sheep', label: 'Pecora', emoji: '🐑', src: 'https://www.google.com/logos/fnbx/animal_sounds/sheep.mp3' },
    { id: 'lion', label: 'Leone', emoji: '🦁', src: 'https://www.google.com/logos/fnbx/animal_sounds/lion.mp3' },
    { id: 'horse', label: 'Cavallo', emoji: '🐴', src: 'https://www.google.com/logos/fnbx/animal_sounds/horse.mp3' },
    { id: 'owl', label: 'Gufo', emoji: '🦉', src: 'https://www.google.com/logos/fnbx/animal_sounds/owl.mp3' },
    { id: 'frog', label: 'Rana', emoji: '🐸', src: 'https://www.myinstants.com/media/sounds/frog-croak.mp3' }
];

export const DRUM_SOUNDS = [
    { id: 'kick', label: 'Kick', color: 'bg-red-500', src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3' },
    { id: 'snare', label: 'Snare', color: 'bg-blue-500', src: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3' },
    { id: 'hihat_c', label: 'Hat', color: 'bg-yellow-400', src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3' },
    { id: 'tom1', label: 'Tom 1', color: 'bg-green-500', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3' },
    { id: 'tom2', label: 'Tom 2', color: 'bg-green-600', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3' },
    { id: 'clap', label: 'Clap', color: 'bg-purple-500', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },
    { id: 'crash', label: 'Crash', color: 'bg-orange-500', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3' },
    { id: 'shaker', label: 'Shaker', color: 'bg-pink-500', src: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3' },
    { id: 'openhat', label: 'Open Hat', color: 'bg-yellow-600', src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' }
];

export const FAIRY_TALES: FairyTale[] = [
    { 
        id: 'story1', 
        title: "La Bella e la Bestia", 
        description: `Una giovane ragazza, chiamata Bella, vive con il padre, un mercante caduto in disgrazia. Un giorno l’uomo si perde in un castello misterioso e, cogliendo una rosa per la figlia, scatena l’ira del padrone del castello: una creatura mostruosa chiamata la Bestia.
Per salvare il padre, Bella accetta di vivere nel castello al suo posto.
La Bestia si rivela presto gentile e generosa, e Bella impara a guardare oltre il suo aspetto. Quando decide di tornare dalla sua famiglia, la Bestia, credendosi abbandonata, si lascia morire di tristezza. Bella corre da lei, confessa il suo affetto sincero e spezza l’incantesimo: la Bestia torna ad essere un principe, e i due iniziano una nuova vita insieme.`,
        duration: '44:54', 
        image: 'https://i.postimg.cc/1t0Jdq4P/la-bella-e-la-bestia.png',
        src: 'https://archive.org/download/la-bella-e-la-bestia/la%20bella%20e%20la%20bestia.mp3' 
    },
    { 
        id: 'story2', 
        title: "Il Principe Amato", 
        description: `Il Principe Amato è un giovane coraggioso e dal cuore puro, destinato a diventare un grande sovrano. Un giorno, una misteriosa profezia lo spinge a mettersi in viaggio per liberare il suo regno da un terribile incantesimo.
Durante l’avventura incontra creature magiche, affronta prove difficili e supera inganni e pericoli grazie alla sua bontà e alla sua intelligenza. Con l’aiuto di una fata benevola, Amato riesce infine a spezzare l’incantesimo, riportando pace e felicità nel regno. Il popolo, grato, lo riconosce come il principe che porta amore e armonia a tutti.`,
        duration: '38:52', 
        image: 'https://i.postimg.cc/g2kFHGSY/il-principe-amato.png',
        src: 'https://archive.org/download/il-principe-amato_202512/il%20principe%20amato.mp3' 
    },
    { 
        id: 'story3', 
        title: "La Cervia nel Bosco", 
        description: `La storia racconta di una giovane fanciulla trasformata in una cervia da un potente incantesimo. Costretta a vivere nel bosco, la cervia mantiene però il suo cuore umano e la sua dolcezza. Un giorno un principe, durante una battuta di caccia, la incontra e rimane colpito dalla sua grazia e dal suo sguardo intelligente.
Scoperto il suo segreto, decide di aiutarla. Con coraggio affronta la strega responsabile dell’incantesimo e, grazie alla sua determinazione, riesce a spezzare la magia. La cervia torna ad essere una ragazza e i due, finalmente liberi dal sortilegio, ritrovano pace e felicità insieme.`,
        duration: '1:57:12', 
        image: 'https://i.postimg.cc/hPtpChBw/la-cervia-nel-bosco.png',
        src: 'https://archive.org/download/la-cervia-nel-bosco/la%20cervia%20nel%20bosco.mp3'
    },
    { 
        id: 'story4', 
        title: "La Gatta Bianca", 
        description: `Un giovane principe, in viaggio per superare tre prove imposte dal re, si perde in una foresta e trova rifugio in un magnifico castello abitato da una misteriosa gatta bianca, capace di parlare e di vivere come una regina.
La gatta accoglie il principe con gentilezza, lo aiuta nelle prove e gli offre consigli preziosi. Con il tempo, tra i due nasce un’amicizia sincera. Alla fine si scopre che la gatta è in realtà una principessa vittima di un incantesimo: solo un atto di fiducia e di affetto sincero può liberarla.
Quando l’incantesimo si spezza, la gatta riacquista forma umana e il principe comprende di aver trovato il suo vero destino al suo fianco.`,
        duration: '2:01:33', 
        image: 'https://i.postimg.cc/k4CyWgsb/la-gatta-bianca.png',
        src: 'https://archive.org/download/la-gatta-bianca/la%20gatta%20bianca.mp3'
    },
    { 
        id: 'story5', 
        title: "L'Uccellino Turchino", 
        description: `Una giovane principessa viene separata dal suo amato principe, trasformato da una fata malvagia in un piccolo uccellino dal piumaggio turchese. L’incantesimo gli permette di avvicinarla solo di notte, per avvertirla dei pericoli e guidarla con la sua voce melodiosa.
Determinata a liberarlo, la principessa affronta un lungo viaggio pieno di prove, palazzi incantati e inganni magici. Grazie al suo coraggio e alla sua fedeltà, riesce infine a sconfiggere la fata e a spezzare l’incantesimo. L’uccellino torna a essere un principe, e i due possono finalmente ricongiungersi.`,
        duration: '1:54:31', 
        image: 'https://i.postimg.cc/FFWjHZMq/l-uccellino-turchino.png', 
        src: 'https://archive.org/download/luccello-turchino/l%27uccello%20turchino.mp3'
    },
    { 
        id: 'story6', 
        title: "La Bella dai Capelli d'Oro", 
        description: `Una giovane fanciulla possiede capelli d’oro che la rendono famosa in tutto il regno. Un re, affascinato dalla sua fama, invia il suo ambasciatore per chiederla in sposa.
L’ambasciatore, un giovane gentile e intelligente, supera diverse prove difficili grazie all’aiuto di animali magici che aveva soccorso durante il viaggio. La Bella, colpita dalla bontà e dal valore del giovane, accetta di seguirlo.
Tuttavia, dopo una serie di avventure e malintesi, è proprio l’ambasciatore a conquistare il cuore della Bella, e i due trovano insieme la felicità.`,
        duration: '43:21',
        image: 'https://i.postimg.cc/02kHLcp6/la-bella-dai-capelli-d-oro.png', 
        src: 'https://archive.org/download/la-bella-dai-capelli-doro/la%20bella%20dai%20capelli%20d%27oro.mp3'
    },
    { 
        id: 'story7', 
        title: "Cenerentola", 
        description: `Cenerentola è una fanciulla gentile costretta a fare da serva alla matrigna e alle sorellastre. Un giorno, grazie all'aiuto della sua Fata Madrina, riesce ad andare al ballo del Re con un abito meraviglioso e una carrozza magica. Lì danza con il Principe, ma deve fuggire a mezzanotte, perdendo una scarpetta di cristallo. Il Principe la cercherà in tutto il regno finché non la ritroverà.`,
        duration: '18:30', 
        image: 'https://i.postimg.cc/yYRz8fJ8/cenerentola.png', 
        src: 'https://archive.org/download/cenerentola_202512/cenerentola.mp3'
    },
    { 
        id: 'story8', 
        title: "Enrichetto dal Ciuffo", 
        description: `Enrichetto è un principe nato molto brutto ma con una grandissima intelligenza. Una fata gli dona il potere di rendere intelligente la persona che amerà di più. Incontra una principessa bellissima ma un po' sciocca, a cui è stato donato il potere di rendere bello chi amerà. Insieme scopriranno che l'amore vero trasforma ogni difetto in pregio.`,
        duration: '20:40', 
        image: 'https://i.postimg.cc/KckYtDK7/enrichetto-dal-ciuffo.png', 
        src: 'https://archive.org/download/enrichetto-dal-ciuffo/enrichetto%20dal%20ciuffo.mp3'
    },
    { 
        id: 'story9', 
        title: "Il Gatto con gli Stivali", 
        description: `Alla morte di un mugnaio, al figlio minore resta solo un gatto. Ma non è un gatto qualunque: con un paio di stivali e tanta astuzia, il felino riuscirà a far credere al Re che il suo padrone è il ricco Marchese di Carabas, sconfiggendo un orco e conquistando la mano della principessa per il suo giovane amico.`,
        duration: '13:25', 
        image: 'https://i.postimg.cc/SNLkGTmV/il-gatto-con-gli-stivali.png', 
        src: 'https://archive.org/download/il-gatto-con-gli-stivali/il%20gatto%20con%20gli%20stivali.mp3'
    },
    { 
        id: 'story10', 
        title: "Cappuccetto Rosso", 
        description: `Una bambina con una mantellina rossa deve portare un cestino alla nonna malata attraversando il bosco. Un lupo furbo la inganna per arrivare prima alla casa della nonna. Ma grazie all'intervento di un coraggioso cacciatore, Cappuccetto Rosso e la nonna verranno salvate e il lupo sconfitto. Una fiaba classica sulla prudenza.`,
        duration: '6:11', 
        image: 'https://i.postimg.cc/Qdps06sb/cappuccetto-rosso.png', 
        src: 'https://archive.org/download/cappuccetto-rosso_20251201_1745/cappuccetto%20rosso.mp3'
    },
    { 
        id: 'story11', 
        title: "Il Drago e la Bambina", 
        description: `In un regno lontano, un drago solitario incontra una bambina che non ha paura di lui. Invece di combattere, i due scoprono di avere molto in comune e stringono una magica amicizia che insegnerà a tutto il villaggio che non bisogna giudicare dalle apparenze e che la gentilezza è l'arma più potente.`,
        duration: '14:42', 
        image: 'https://i.postimg.cc/1z79q8y5/il-drago-e-la-bambina.png', 
        src: 'https://archive.org/download/il_drago_e_la_bambina/il_drago_e_la_bambina.mp3'
    },
    { 
        id: 'story12', 
        title: "Il Pifferaio Magico", 
        description: `La città di Hamelin è invasa dai topi. Un misterioso suonatore di piffero promette di liberarla in cambio di una ricompensa. Con la sua musica incantata porta via i topi, ma quando i cittadini rifiutano di pagarlo, il Pifferaio suona una nuova melodia per dare loro una lezione sull'importanza di mantenere le promesse.`,
        duration: '6:51', 
        image: 'https://i.postimg.cc/FRJQkGPS/il-pifferaio-magico.png', 
        src: 'https://archive.org/download/il_pifferaio_magico/il_pifferaio_magico.mp3'
    },
    { 
        id: 'story13', 
        title: "Le Fate", 
        description: `Una vedova ha due figlie: una gentile e l'altra superba. Un giorno la figlia gentile incontra una fata travestita da povera vecchia e le offre da bere. Per ricompensa, la fata le dona il dono di far uscire fiori e pietre preziose dalla bocca a ogni parola. La sorella invidiosa cerca lo stesso dono, ma la sua maleducazione le porterà una sorte ben diversa.`,
        duration: '8:30', 
        image: 'https://i.postimg.cc/Z5yPgdDD/le-fate.png', 
        src: 'https://archive.org/download/le-fate/le%20fate.mp3'
    },
    { 
        id: 'story14', 
        title: "Pelle d'Asino", 
        description: `Una principessa è costretta a fuggire dal suo regno nascondendosi sotto una pelle d'asino per non essere riconosciuta. Lavora come sguattera in una fattoria, ma nelle feste indossa di nascosto i suoi abiti regali. Un principe la vede per caso e se ne innamora, riuscendo infine a ritrovarla grazie a un anello che solo a lei calza a pennello.`,
        duration: '37:38', 
        image: 'https://i.postimg.cc/VvprB7w3/pelle-d-asino.png', 
        src: 'https://archive.org/download/pelle-dasino/pelle%20d%27asino.mp3'
    },
    { 
        id: 'story15', 
        title: "Puccettino", 
        description: `Puccettino è il più piccolo di sette fratelli, ma anche il più furbo. Quando lui e i suoi fratelli si perdono nel bosco e finiscono nella casa di un orco, sarà proprio l'ingegno di Puccettino a salvarli tutti, rubando gli stivali delle sette leghe all'orco e riportando fortuna e ricchezza alla sua famiglia.`,
        duration: '26:12', 
        image: 'https://i.postimg.cc/6Qc816wM/puccettino.png', 
        src: 'https://archive.org/download/puccettino/puccettino.mp3'
    }
];

export const VIDEOS: Video[] = [
  {
    id: 'S7Q1CgO6ZQA',
    title: 'Lone Boo - Sigla Ufficiale',
    thumbnail: 'https://img.youtube.com/vi/S7Q1CgO6ZQA/maxresdefault.jpg',
    category: 'Musica',
    url: 'https://www.youtube.com/watch?v=S7Q1CgO6ZQA',
    description: 'La sigla ufficiale di Lone Boo! Cantiamo insieme!'
  }
];

export const CATEGORIES: string[] = ['Tutti', 'Musica', 'Storie', 'Giochi'];

// =================================================================================================
// 📱 SOCIAL LINKS
// Incolla qui sotto i link delle tue icone personalizzate nel campo 'customIconUrl'
// =================================================================================================
export const SOCIALS: SocialLink[] = [
  { 
      platform: 'YouTube', 
      url: 'https://youtube.com/@ILoneBoo', 
      iconName: 'youtube', 
      color: 'bg-red-600',
      customIconUrl: 'https://i.postimg.cc/hGqNCx0c/Immagine-2025-11-29-021129.png' 
  },
  { 
      platform: 'Instagram', 
      url: 'https://instagram.com/loneboo_official', 
      iconName: 'instagram', 
      color: 'bg-pink-600',
      customIconUrl: 'https://i.postimg.cc/QM2ggkgY/Immagine-2025-11-29-021230.png'
  },
  { 
      platform: 'TikTok', 
      url: 'https://tiktok.com/@lone_._boo', 
      iconName: 'tiktok', 
      color: 'bg-black',
      customIconUrl: 'https://i.postimg.cc/QCpfKYRh/Immagine-2025-11-29-021305.png'
  },
  { 
      platform: 'Facebook', 
      url: 'https://facebook.com/LoneBooFanPage', 
      secondaryUrl: 'https://facebook.com/groups/2648776785470151', 
      iconName: 'facebook', 
      color: 'bg-blue-600',
      customIconUrl: 'https://i.postimg.cc/sgnwWh0Z/facebook.png'
  },
  { 
      platform: 'Spotify', 
      url: 'https://open.spotify.com/intl-it/artist/3RVol8TV5OleEGTcP5tdau', 
      iconName: 'spotify', 
      color: 'bg-green-600',
      customIconUrl: 'https://i.postimg.cc/VkNFzNLr/Immagine-2025-11-29-021534.png'
  },
  { 
      platform: 'Amazon Music', 
      url: 'https://www.amazon.it/music/player/artists/B0FY6VS1XC/lone-boo', 
      iconName: 'amazonmusic', 
      color: 'bg-cyan-600',
      customIconUrl: 'https://i.postimg.cc/pXsDctYV/Immagine-2025-11-29-020703.png'
  },
  { 
      platform: 'SoundCloud', 
      url: 'https://soundcloud.com/lone-boo', 
      iconName: 'soundcloud', 
      color: 'bg-orange-600',
      customIconUrl: 'https://i.postimg.cc/GmQhxckz/pngwing-com-(2).png'
  },
  { 
      platform: 'X', 
      url: 'https://x.com/IloneBoo', 
      iconName: 'twitter', 
      color: 'bg-black',
      customIconUrl: 'https://i.postimg.cc/QM8Z81K9/Immagine-2025-11-29-021002.png'
  }
];

export const SUPPORT_LINKS: SocialLink[] = [
    { 
        platform: 'Telegram', 
        url: 'https://t.me/loneboo_official', 
        iconName: 'telegram', 
        color: 'bg-sky-500'
    },
    { 
        platform: 'Patreon', 
        url: 'https://patreon.com/cw/LoneBoo', 
        iconName: 'patreon', 
        color: 'bg-orange-500'
    }
];

export const BOOKS: Book[] = [
    {
        id: 'book3', // Unique ID
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
        coverImage: 'https://i.postimg.cc/fLY8QxFq/Immagine-2025-12-05-001741.jpg',
        amazonUrl: 'https://amzn.eu/d/1PLVotd'
    },
    {
        id: 'book1',
        title: 'Il Concerto della Vita: La Favola di Lone Boo',
        subtitle: 'Creatività e Divertimento',
        description: `Lone Boo – Una piccola anima in un mondo troppo grande è un viaggio delicato attraverso emozioni che tutti, almeno una volta, hanno incontrato: la solitudine, la vulnerabilità, la ricerca di un posto sicuro e di una voce che ci assomigli.
Il libro raccoglie pensieri, brevi testi, riflessioni e immagini nate dal progetto artistico e musicale Lone Boo, un universo narrativo che unisce minimalismo, poesia e introspezione.

Lo scopo del libro è offrire al lettore un momento di respiro: una pausa silenziosa in cui trovare conforto, riconoscersi e magari scoprire che ciò che sentiamo non è mai davvero solo nostro. Lone Boo, con la sua semplicità, accompagna i piccoli lettori in un percorso fatto di piccole verità quotidiane, frammenti di luce e ombre che non fanno paura.

Tra le pagine si parla di emozioni, legami invisibili, battiti trattenuti e speranze che si riaccendono. Non è un romanzo né un diario: è uno spazio libero, un rifugio creativo in cui ogni lettore può ritrovare un pezzo di sé.`,
        coverImage: 'https://i.postimg.cc/mDXNKfCn/Immagine-2025-12-01-221132.jpg', 
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
        coverImage: 'https://i.postimg.cc/WbCjTdsM/Immagine-2025-12-01-221617.jpg',
        amazonUrl: 'https://amzn.eu/d/d04JGSx'
    }
];

export const QUIZ_QUESTIONS_EASY: QuizQuestion[] = [
    { id: 1, question: "Di che colore è il sole?", options: ["Verde", "Giallo", "Blu"], correctAnswer: 1 },
    { id: 2, question: "Come fa il cane?", options: ["Miao", "Bau", "Muu"], correctAnswer: 1 },
    { id: 3, question: "Quante zampe ha un ragno?", options: ["4", "6", "8"], correctAnswer: 2 },
    { id: 4, question: "Quale frutto è giallo e curvo?", options: ["Mela", "Banana", "Uva"], correctAnswer: 1 },
    { id: 5, question: "Chi spegne il fuoco?", options: ["Il postino", "Il pompiere", "Il dottore"], correctAnswer: 1 },
    { id: 6, question: "Dove vivono i pesci?", options: ["In cielo", "In mare", "Nel bosco"], correctAnswer: 1 },
    { id: 7, question: "Cosa mangia il coniglio?", options: ["Carote", "Sassi", "Caramelle"], correctAnswer: 0 },
    { id: 8, question: "Di che colore è l'erba?", options: ["Rossa", "Blu", "Verde"], correctAnswer: 2 },
    { id: 9, question: "Quante dita hai in una mano?", options: ["3", "5", "10"], correctAnswer: 1 },
    { id: 10, question: "Chi guida l'aereo?", options: ["Il pilota", "Il cuoco", "Il maestro"], correctAnswer: 0 }
];

export const QUIZ_QUESTIONS_HARD: QuizQuestion[] = [
    { id: 1, question: "Qual è la capitale d'Italia?", options: ["Milano", "Roma", "Napoli"], correctAnswer: 1 },
    { id: 2, question: "Quanto fa 7 x 8?", options: ["54", "56", "64"], correctAnswer: 1 },
    { id: 3, question: "Qual è il pianeta più vicino al Sole?", options: ["Venere", "Mercurio", "Marte"], correctAnswer: 1 },
    { id: 4, question: "Cosa rappresenta la formula H2O?", options: ["Aria", "Acqua", "Fuoco"], correctAnswer: 1 },
    { id: 5, question: "Quanti colori ha l'arcobaleno?", options: ["5", "6", "7"], correctAnswer: 2 },
    { id: 6, question: "Chi ha dipinto la Gioconda?", options: ["Michelangelo", "Leonardo da Vinci", "Raffaello"], correctAnswer: 1 },
    { id: 7, question: "Quanti lati ha un triangolo?", options: ["3", "4", "5"], correctAnswer: 0 },
    { id: 8, question: "Qual è l'animale terrestre più veloce?", options: ["Leone", "Ghepardo", "Cavallo"], correctAnswer: 1 },
    { id: 9, question: "Cosa serve alle piante per fare la fotosintesi?", options: ["Buio", "Luce del sole", "Vento"], correctAnswer: 1 },
    { id: 10, question: "In geometria, un quadrato 3D si chiama...", options: ["Sfera", "Cubo", "Piramide"], correctAnswer: 1 },
    { id: 11, question: "Qual è il fiume più lungo d'Italia?", options: ["Tevere", "Po", "Adige"], correctAnswer: 1 },
    { id: 12, question: "Come si dice 'Mela' in inglese?", options: ["Pear", "Apple", "Orange"], correctAnswer: 1 },
    { id: 13, question: "Quale animale fa il miele?", options: ["Ape", "Vespa", "Mosca"], correctAnswer: 0 },
    { id: 14, question: "Chi ha scritto Pinocchio?", options: ["Gianni Rodari", "Carlo Collodi", "Dante Alighieri"], correctAnswer: 1 },
    { id: 15, question: "Quanti giorni ci sono in un anno bisestile?", options: ["365", "366", "364"], correctAnswer: 1 }
];

export const MEMORY_ICONS = ['👻', '🎃', '🦇', '🕷️', '🕸️', '💀', '🧛', '🧟'];

export const FAN_ART_GALLERY: FanArt[] = [
    { id: 'static-1', author: 'Luca', age: '5 anni', image: 'https://via.placeholder.com/300?text=Disegno+Luca' },
    { id: 'static-2', author: 'Sofia', age: '6 anni', image: 'https://via.placeholder.com/300?text=Disegno+Sofia' },
    { id: 'static-3', author: 'Matteo', age: '4 anni', image: 'https://via.placeholder.com/300?text=Disegno+Matteo' },
    { id: 'static-4', author: 'Giulia', age: '7 anni', image: 'https://via.placeholder.com/300?text=Disegno+Giulia' }
];

// --- COLORING TYPES AND CATEGORIES ---
// ISTRUZIONI PER L'USO:
// 1. Per ogni "thumbnail", sostituisci il link tra virgolette con il link della tua immagine (JPG/PNG).
// 2. Per ogni "pdfUrl", sostituisci il link tra virgolette con il link del tuo PDF (Google Drive/Dropbox etc).

export const COLORING_CATEGORIES: ColoringCategory[] = [
    {
        id: 'animals',
        title: 'Animali',
        emoji: '🦁',
        coverImage: 'https://img.freepik.com/free-vector/hand-drawn-wild-animals-collection_23-2149022639.jpg',
        color: 'bg-green-500',
        items: [
            { id: 'an-1', title: 'Animali nel Bosco', thumbnail: 'https://i.postimg.cc/gjzztf4F/aniamli-(1).jpg', pdfUrl: 'https://drive.google.com/file/d/1qVuDtjjVUOdLT4V0D1P-Rtx54wT6UFJB/view?usp=sharing' },
            { id: 'an-2', title: 'Cagnolino col Cappello', thumbnail: 'https://i.postimg.cc/6QKC5QpL/cans.jpg', pdfUrl: 'https://drive.google.com/file/d/1uAupX7JhJXSTS8E6Qkl4Iui5jFRwK-dT/view?usp=sharing' },
            { id: 'an-3', title: 'Elefanti Dolci', thumbnail: 'https://i.postimg.cc/15ZFKtpZ/ele.jpg', pdfUrl: 'https://drive.google.com/file/d/1giCZ8KJ9E_HfL_8xNgNrHbB_Wrk4r76H/view?usp=sharing' },
            { id: 'an-4', title: 'Giraffa al sole', thumbnail: 'https://i.postimg.cc/V66gmNK7/gir.jpg', pdfUrl: 'https://drive.google.com/file/d/1SQGZwx9CZwrqqgHYTEWlXvGYm-yPzFB2/view?usp=sharing' },
            { id: 'an-5', title: 'Gufi nel Bosco', thumbnail: 'https://i.postimg.cc/NGxXptbT/guf.jpg', pdfUrl: 'https://drive.google.com/file/d/1Pwe_0FR9jqDdwBrg1w9SEZo-waeCYNmt/view?usp=sharing' },
            { id: 'an-6', title: 'Mucca col Fiore', thumbnail: 'https://i.postimg.cc/Kvw85sX1/muc.jpg', pdfUrl: 'https://drive.google.com/file/d/1RC-VjohGZPDXn6yMnMmKmIZ0HH4h8OWC/view?usp=sharing' },
            { id: 'an-7', title: 'Renna Sorridente', thumbnail: 'https://i.postimg.cc/vZXMNPk1/ren.jpg', pdfUrl: 'https://drive.google.com/file/d/1-eOuP1eLtRy-J3OhvfSQapEN1xRh2GYA/view?usp=sharing' },
            { id: 'an-8', title: 'Sul Trenino', thumbnail: 'https://i.postimg.cc/9QD160N1/trenn.jpg', pdfUrl: 'https://drive.google.com/file/d/1nKSr90lnWlCmFrU81F5D4yLwrEeaJtqi/view?usp=sharing' },
            { id: 'an-9', title: 'Tartaruga Felice', thumbnail: 'https://i.postimg.cc/bwfshF6N/tart.jpg', pdfUrl: 'https://drive.google.com/file/d/1PHVuBsZrbXkTOE7zQQfFw-WuE1642gnK/view?usp=sharing' },
            { id: 'an-10', title: 'Rana Felice', thumbnail: 'https://i.postimg.cc/g0JwSLSY/ran.jpg', pdfUrl: 'https://drive.google.com/file/d/15SBm4rKTVc-Sw2jNLkdWRh-3yepLInX9/view?usp=sharing' },
        ]
    },
    {
        id: 'christmas',
        title: 'Natale',
        emoji: '🎄',
        coverImage: 'https://img.freepik.com/free-vector/hand-drawn-christmas-coloring-book-illustration_23-2149723821.jpg',
        color: 'bg-red-600',
        items: [
            { id: 'xm-1', title: 'Babbo Natale', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Babbo+Natale', pdfUrl: '#' },
            { id: 'xm-2', title: 'Albero', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Albero', pdfUrl: '#' },
            { id: 'xm-3', title: 'Renna', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Renna', pdfUrl: '#' },
            { id: 'xm-4', title: 'Regali', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Regali', pdfUrl: '#' },
            { id: 'xm-5', title: 'Pupazzo di Neve', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Pupazzo', pdfUrl: '#' },
            { id: 'xm-6', title: 'Calza', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Calza', pdfUrl: '#' },
            { id: 'xm-7', title: 'Elfo', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Elfo', pdfUrl: '#' },
            { id: 'xm-8', title: 'Stella', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Stella', pdfUrl: '#' },
            { id: 'xm-9', title: 'Presepe', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Presepe', pdfUrl: '#' },
            { id: 'xm-10', title: 'Befana', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Befana', pdfUrl: '#' },
        ]
    },
    {
        id: 'halloween',
        title: 'Halloween',
        emoji: '🎃',
        coverImage: 'https://img.freepik.com/free-vector/hand-drawn-halloween-coloring-book-illustration_23-2149658933.jpg',
        color: 'bg-orange-500',
        items: [
            { id: 'hl-1', title: 'Zucca', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Zucca', pdfUrl: '#' },
            { id: 'hl-2', title: 'Fantasma', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Fantasma', pdfUrl: '#' },
            { id: 'hl-3', title: 'Pipistrello', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Pipistrello', pdfUrl: '#' },
            { id: 'hl-4', title: 'Strega', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Strega', pdfUrl: '#' },
            { id: 'hl-5', title: 'Gatto Nero', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Gatto+Nero', pdfUrl: '#' },
            { id: 'hl-6', title: 'Ragno', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Ragno', pdfUrl: '#' },
            { id: 'hl-7', title: 'Scheletro', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Scheletro', pdfUrl: '#' },
            { id: 'hl-8', title: 'Vampiro', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Vampiro', pdfUrl: '#' },
            { id: 'hl-9', title: 'Mummia', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Mummia', pdfUrl: '#' },
            { id: 'hl-10', title: 'Castello', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Castello', pdfUrl: '#' },
        ]
    },
    {
        id: 'flowers',
        title: 'Fiori e Natura',
        emoji: '🌸',
        coverImage: 'https://img.freepik.com/free-vector/hand-drawn-flowers-outline_23-2149023023.jpg',
        color: 'bg-pink-500',
        items: [
            { id: 'fl-1', title: 'Rosa', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Rosa', pdfUrl: '#' },
            { id: 'fl-2', title: 'Girasole', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Girasole', pdfUrl: '#' },
            { id: 'fl-3', title: 'Tulipano', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Tulipano', pdfUrl: '#' },
            { id: 'fl-4', title: 'Albero', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Albero', pdfUrl: '#' },
            { id: 'fl-5', title: 'Farfalla', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Farfalla', pdfUrl: '#' },
            { id: 'fl-6', title: 'Fungo', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Fungo', pdfUrl: '#' },
            { id: 'fl-7', title: 'Foglie', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Foglie', pdfUrl: '#' },
            { id: 'fl-8', title: 'Margherita', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Margherita', pdfUrl: '#' },
            { id: 'fl-9', title: 'Cactus', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Cactus', pdfUrl: '#' },
            { id: 'fl-10', title: 'Giardino', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Giardino', pdfUrl: '#' },
        ]
    },
    {
        id: 'sea',
        title: 'In fondo al mar',
        emoji: '🐠',
        coverImage: 'https://img.freepik.com/free-vector/underwater-world-coloring-page_23-2148560088.jpg',
        color: 'bg-blue-500',
        items: [
            { id: 'sea-1', title: 'Pesce', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Pesce', pdfUrl: '#' },
            { id: 'sea-2', title: 'Delfino', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Delfino', pdfUrl: '#' },
            { id: 'sea-3', title: 'Squalo', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Squalo', pdfUrl: '#' },
            { id: 'sea-4', title: 'Polpo', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Polpo', pdfUrl: '#' },
            { id: 'sea-5', title: 'Granchio', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Granchio', pdfUrl: '#' },
            { id: 'sea-6', title: 'Stella Marina', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Stella+Marina', pdfUrl: '#' },
            { id: 'sea-7', title: 'Cavalluccio', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Cavalluccio', pdfUrl: '#' },
            { id: 'sea-8', title: 'Balena', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Balena', pdfUrl: '#' },
            { id: 'sea-9', title: 'Tartaruga', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Tartaruga', pdfUrl: '#' },
            { id: 'sea-10', title: 'Conchiglie', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Conchiglie', pdfUrl: '#' },
        ]
    }
];
