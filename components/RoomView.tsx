
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, X, Play, Recycle, Trash2, GlassWater, Zap, Loader2, Snowflake, Utensils, Search, Clock, AlarmClock, Sun, Moon, CloudRain, Wind, Shirt, ChevronLeft, ChevronRight, Copy, PenTool, Settings, Move, Anchor, Waves, ArrowDown, ArrowUp, Sparkles, CheckCircle, Camera, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { AppView } from '../types';
import { HOUSE_ROOMS, HOME_HERO_IMAGE } from '../constants';
import RobotHint from './RobotHint';
import StarMap from './StarMap'; 

// =================================================================================================
// 🚧 IMMAGINE LAVORI IN CORSO
// =================================================================================================
const CONSTRUCTION_IMG = 'https://i.postimg.cc/13NBmSgd/vidu-image-3059119613071461-(1).png';

// =================================================================================================
// 🛋️ DECORAZIONE LATERALE (ARREDATORE)
// =================================================================================================
const ROOM_DECOR_IMG = 'https://i.postimg.cc/Y9wfF76h/arreddder.png';

// =================================================================================================
// 🪞 CONFIGURAZIONE SPECCHIO MAGICO (VIDEO LAVANDINO)
// =================================================================================================
const MIRROR_FRAME_IMG = 'https://i.postimg.cc/mDrXNTZ0/playerbagno.jpg';
const TOOTHBRUSH_VIDEO_ID = 'URlVBAj1AOE'; 

// --- CONFIGURAZIONE 1: MIRROR MOBILE ---
const MIRROR_CONFIG_MOBILE = {
    top: '31.4%',    
    left: '6.7%',    
    width: '87.4%',  
    height: '32%'    
};

// --- CONFIGURAZIONE 2: MIRROR DESKTOP ---
const MIRROR_CONFIG_DESKTOP = {
    top: '31.4%',
    left: '6.7%',
    width: '87.4%',
    height: '32%'
};

// =================================================================================================
// 🧭 CONFIGURAZIONE NAVIGAZIONE STANZE (ROOM LINKS)
// =================================================================================================
type NavLink = { view: AppView; label: string };
type RoomNavConfig = { left?: NavLink; right?: NavLink };

const ROOM_NAVIGATION: Record<string, RoomNavConfig> = {
    // CUCINA: Sx -> Salotto, Dx -> Camera
    [AppView.BOO_KITCHEN]: {
        left: { view: AppView.BOO_LIVING_ROOM, label: "SALOTTO" },
        right: { view: AppView.BOO_BEDROOM, label: "CAMERA" }
    },
    // CAMERA: Sx -> Salotto, Dx -> Cucina
    [AppView.BOO_BEDROOM]: {
        left: { view: AppView.BOO_LIVING_ROOM, label: "SALOTTO" },
        right: { view: AppView.BOO_KITCHEN, label: "CUCINA" }
    },
    // SALOTTO: Sx -> Cucina, Dx -> Bagno
    [AppView.BOO_LIVING_ROOM]: {
        left: { view: AppView.BOO_KITCHEN, label: "CUCINA" },
        right: { view: AppView.BOO_BATHROOM, label: "BAGNO" }
    },
    // BAGNO: Sx -> Giardino, Dx -> Salotto
    [AppView.BOO_BATHROOM]: {
        left: { view: AppView.BOO_GARDEN, label: "GIARDINO" },
        right: { view: AppView.BOO_LIVING_ROOM, label: "SALOTTO" }
    },
    // GIARDINO: Solo Sx -> Rientra in Casa (Mappa)
    [AppView.BOO_GARDEN]: {
        left: { view: AppView.BOO_HOUSE, label: "RIENTRA IN CASA" }
    }
};

// =================================================================================================
// 🖼️ MAPPA IMMAGINI STANZE
// =================================================================================================
const ROOM_IMAGES_MOBILE: Record<string, string> = {
    [AppView.BOO_KITCHEN]: 'https://i.postimg.cc/bNw01THX/cucina1692-(1).jpg',
    [AppView.BOO_LIVING_ROOM]: 'https://i.postimg.cc/J41wZGh9/salotto1689.jpg',
    [AppView.BOO_BEDROOM]: 'https://i.postimg.cc/sxwjLq6j/stanzalettoh44.jpg',
    [AppView.BOO_BATHROOM]: 'https://i.postimg.cc/448VtJVN/bagnitt.jpg',
    [AppView.BOO_GARDEN]: 'https://i.postimg.cc/sX3m3PK4/giardinogarden.jpg',
};

const ROOM_IMAGES_DESKTOP: Record<string, string> = {
    [AppView.BOO_KITCHEN]: 'https://i.postimg.cc/tTtyjxgs/cuxdfr.jpg', 
    [AppView.BOO_LIVING_ROOM]: 'https://i.postimg.cc/59BWYLb2/salotttreer.jpg', 
    [AppView.BOO_BEDROOM]: 'https://i.postimg.cc/6pVR2HTG/stanzadaletto.jpg',
    [AppView.BOO_BATHROOM]: 'https://i.postimg.cc/cCGKGMks/bgno169.jpg',
    [AppView.BOO_GARDEN]: 'https://i.postimg.cc/sX3m3PK4/giardinogarden.jpg',
};

// =================================================================================================
// 🎮 DATA & TYPES FOR MINI-GAMES
// =================================================================================================

interface FruitItem {
    id: string;
    emoji: string;
    color: string;
}

const FRUIT_ITEMS: FruitItem[] = [
    { id: 'apple', emoji: '🍎', color: 'bg-red-500' },
    { id: 'banana', emoji: '🍌', color: 'bg-yellow-400' },
    { id: 'blueberry', emoji: '🫐', color: 'bg-blue-600' },
    { id: 'cherry', emoji: '🍒', color: 'bg-red-700' },
    { id: 'grapes', emoji: '🍇', color: 'bg-purple-600' },
    { id: 'kiwi', emoji: '🥝', color: 'bg-green-500' },
    { id: 'lemon', emoji: '🍋', color: 'bg-yellow-300' },
    { id: 'orange', emoji: '🍊', color: 'bg-orange-500' },
    { id: 'peach', emoji: '🍑', color: 'bg-orange-300' },
    { id: 'pear', emoji: '🍐', color: 'bg-green-300' },
    { id: 'pineapple', emoji: '🍍', color: 'bg-yellow-500' },
    { id: 'strawberry', emoji: '🍓', color: 'bg-pink-500' },
    { id: 'watermelon', emoji: '🍉', color: 'bg-red-400' },
];

type TrashType = 'PAPER' | 'PLASTIC' | 'GLASS' | 'ORGANIC';

interface TrashItem {
    id: string;
    emoji: string;
    label: string;
    type: TrashType;
}

const TRASH_ITEMS: TrashItem[] = [
    { id: 'newspaper', emoji: '📰', label: 'Giornale', type: 'PAPER' },
    { id: 'box', emoji: '📦', label: 'Scatola', type: 'PAPER' },
    { id: 'paper', emoji: '📄', label: 'Foglio', type: 'PAPER' },
    { id: 'bottle', emoji: '🥤', label: 'Bottiglia', type: 'PLASTIC' },
    { id: 'bag', emoji: '🛍️', label: 'Busta', type: 'PLASTIC' },
    { id: 'toy', emoji: '🧸', label: 'Giocattolo Rotto', type: 'PLASTIC' },
    { id: 'jar', emoji: '🫙', label: 'Barattolo', type: 'GLASS' },
    { id: 'wine', emoji: '🍷', label: 'Bicchiere', type: 'GLASS' },
    { id: 'applecore', emoji: '🍎', label: 'Torsolo', type: 'ORGANIC' },
    { id: 'bananapeel', emoji: '🍌', label: 'Buccia', type: 'ORGANIC' },
    { id: 'fishbone', emoji: '🐟', label: 'Lisca', type: 'ORGANIC' },
    { id: 'egg', emoji: '🥚', label: 'Guscio', type: 'ORGANIC' },
];

const BINS = [
    { type: 'PAPER' as TrashType, label: 'CARTA', color: 'bg-blue-500', border: 'border-blue-700' },
    { type: 'PLASTIC' as TrashType, label: 'PLASTICA', color: 'bg-yellow-400', border: 'border-yellow-600' },
    { type: 'GLASS' as TrashType, label: 'VETRO', color: 'bg-green-500', border: 'border-green-700' },
    { type: 'ORGANIC' as TrashType, label: 'ORGANICO', color: 'bg-amber-700', border: 'border-amber-900' },
];

// --- LAUNDRY ITEMS (Whites vs Colors) ---
interface LaundryItem {
    id: string;
    emoji: string;
    type: 'WHITE' | 'COLOR';
    name: string;
}

const LAUNDRY_ITEMS: LaundryItem[] = [
    // --- BIANCHI (12 Items) ---
    { id: 'kimono', emoji: '🥋', type: 'WHITE', name: 'Kimono' },
    { id: 'labcoat', emoji: '🥼', type: 'WHITE', name: 'Camice' },
    { id: 'ghost', emoji: '👻', type: 'WHITE', name: 'Costume Fantasma' },
    { id: 'shirt_w', emoji: '🏐', type: 'WHITE', name: 'Maglia Sport' },
    { id: 'sock_w', emoji: '🧦', type: 'WHITE', name: 'Calzino Bianco' },
    { id: 'cloud', emoji: '☁️', type: 'WHITE', name: 'Cuscino Nuvola' },
    { id: 'swan', emoji: '🦢', type: 'WHITE', name: 'Peluche Cigno' },
    { id: 'sheep', emoji: '🐑', type: 'WHITE', name: 'Peluche Pecora' },
    { id: 'bone', emoji: '🦴', type: 'WHITE', name: 'Osso Finto' },
    { id: 'tooth', emoji: '🦷', type: 'WHITE', name: 'Costume Dente' },
    { id: 'rice', emoji: '🍙', type: 'WHITE', name: 'Pupazzo Riso' },
    { id: 'egg', emoji: '🥚', type: 'WHITE', name: 'Costume Uovo' },

    // --- COLORATI (18 Items) ---
    { id: 'shirt_b', emoji: '👕', type: 'COLOR', name: 'T-Shirt Blu' },
    { id: 'jeans', emoji: '👖', type: 'COLOR', name: 'Jeans' },
    { id: 'dress', emoji: '👗', type: 'COLOR', name: 'Vestito' },
    { id: 'scarf', emoji: '🧣', type: 'COLOR', name: 'Sciarpa' },
    { id: 'shorts', emoji: '🩳', type: 'COLOR', name: 'Pantaloncini' },
    { id: 'bikini', emoji: '👙', type: 'COLOR', name: 'Costume' },
    { id: 'kimono_c', emoji: '👘', type: 'COLOR', name: 'Vestaglia' },
    { id: 'cap', emoji: '🧢', type: 'COLOR', name: 'Cappello Blu' },
    { id: 'hat_g', emoji: '👒', type: 'COLOR', name: 'Cappello Verde' },
    { id: 'gloves', emoji: '🧤', type: 'COLOR', name: 'Guanti' },
    { id: 'tie', emoji: '👔', type: 'COLOR', name: 'Cravatta' },
    { id: 'backpack', emoji: '🎒', type: 'COLOR', name: 'Zainetto' },
    { id: 'teddy', emoji: '🧸', type: 'COLOR', name: 'Orsacchiotto' },
    { id: 'ribbon', emoji: '🎀', type: 'COLOR', name: 'Fiocco' },
    { id: 'coat', emoji: '🧥', type: 'COLOR', name: 'Cappotto' },
    { id: 'purse', emoji: '👛', type: 'COLOR', name: 'Borsetta' },
    { id: 'shoe', emoji: '👟', type: 'COLOR', name: 'Scarpa' },
    { id: 'boot', emoji: '🥾', type: 'COLOR', name: 'Scarpone' },
    { id: 'hero', emoji: '🦸', type: 'COLOR', name: 'Mantello Eroe' },
    { id: 'pumpkin', emoji: '🎃', type: 'COLOR', name: 'Costume Zucca' }
];

// --- SINK OR FLOAT ITEMS ---
interface BuoyancyItem {
    id: string;
    emoji: string;
    name: string;
    floats: boolean;
}

const SINK_FLOAT_ITEMS: BuoyancyItem[] = [
    { id: 'duck', emoji: '🦆', name: 'Paperella', floats: true },
    { id: 'rock', emoji: '🪨', name: 'Sasso', floats: false },
    { id: 'boat', emoji: '⛵', name: 'Barchetta', floats: true },
    { id: 'key', emoji: '🗝️', name: 'Chiave', floats: false },
    { id: 'sponge', emoji: '🧽', name: 'Spugna', floats: true },
    { id: 'coin', emoji: '🪙', name: 'Moneta', floats: false },
    { id: 'apple', emoji: '🍎', name: 'Mela', floats: true },
    { id: 'spoon', emoji: '🥄', name: 'Cucchiaio', floats: false },
    { id: 'ball', emoji: '⚽', name: 'Pallone', floats: true },
    { id: 'anchor', emoji: '⚓', name: 'Ancora', floats: false },
    { id: 'feather', emoji: '🪶', name: 'Piuma', floats: true },
    { id: 'hammer', emoji: '🔨', name: 'Martello', floats: false },
    { id: 'leaf', emoji: '🍃', name: 'Foglia', floats: true },
    { id: 'pencil', emoji: '✏️', name: 'Matita', floats: true },
    { id: 'scissors', emoji: '✂️', name: 'Forbici', floats: false },
    { id: 'balloon', emoji: '🎈', name: 'Palloncino', floats: true },
    { id: 'cup', emoji: '☕', name: 'Tazza', floats: false },
    { id: 'cork', emoji: '🍾', name: 'Tappo', floats: true },
    { id: 'ring', emoji: '💍', name: 'Anello', floats: false },
    { id: 'bottle_empty', emoji: '🍼', name: 'Bottiglia Vuota', floats: true },
    { id: 'brick', emoji: '🧱', name: 'Mattone', floats: false },
    { id: 'ice', emoji: '🧊', name: 'Ghiaccio', floats: true },
    { id: 'clip', emoji: '📎', name: 'Graffetta', floats: false },
    { id: 'pingpong', emoji: '🏓', name: 'Pallina', floats: true },
    { id: 'marble', emoji: '🔮', name: 'Biglia', floats: false },
    { id: 'candle', emoji: '🕯️', name: 'Candela', floats: true },
    { id: 'lock', emoji: '🔒', name: 'Lucchetto', floats: false },
    { id: 'banana', emoji: '🍌', name: 'Banana', floats: true },
    { id: 'egg', emoji: '🥚', name: 'Uovo', floats: false },
    { id: 'flower', emoji: '🌸', name: 'Fiore', floats: true },
    { id: 'phone', emoji: '📱', name: 'Telefono', floats: false },
    { id: 'glasses', emoji: '👓', name: 'Occhiali', floats: false },
    { id: 'watermelon', emoji: '🍉', name: 'Anguria', floats: true },
    { id: 'bolt', emoji: '🔩', name: 'Bullone', floats: false }
];

// =================================================================================================
// 🛌 ZONE CAMERA DA LETTO (Bedroom)
// =================================================================================================
const BEDROOM_ZONES_MOBILE = [
  { "id": "libri", "points": [ { "x": 73.56, "y": 72.55 }, { "x": 85.29, "y": 72.21 }, { "x": 80.76, "y": 81.57 }, { "x": 73.03, "y": 78.85 } ] },
  { "id": "sveglia", "points": [ { "x": 86.35, "y": 78.68 }, { "x": 98.88, "y": 79.53 }, { "x": 99.15, "y": 86.51 }, { "x": 85.02, "y": 84.81 } ] },
  { "id": "baule", "points": [ { "x": 24.25, "y": 65.91 }, { "x": 55.7, "y": 70.5 }, { "x": 56.77, "y": 84.81 }, { "x": 21.32, "y": 81.4 } ] },
  { "id": "telescopio", "points": [ { "x": 37.85, "y": 40.7 }, { "x": 58.64, "y": 47.51 }, { "x": 50.91, "y": 59.78 }, { "x": 41.04, "y": 58.41 } ] },
  { "id": "sveglia_boo", "points": [ { "x": 79.69, "y": 53.64 }, { "x": 73.56, "y": 59.09 }, { "x": 91.15, "y": 62.33 }, { "x": 98.08, "y": 55.35 } ] }
];

const BEDROOM_ZONES_DESKTOP = [
  { "id": "libri", "points": [ { "x": 59.74, "y": 78.31 }, { "x": 59.54, "y": 87.53 }, { "x": 61.85, "y": 90.46 }, { "x": 65.66, "y": 80.33 } ] },
  { "id": "sveglia", "points": [ { "x": 64.86, "y": 86.63 }, { "x": 64.55, "y": 94.28 }, { "x": 71.37, "y": 97.43 }, { "x": 71.77, "y": 87.98 } ] },
  { "id": "baule", "points": [ { "x": 45.31, "y": 68.86 }, { "x": 39.29, "y": 87.31 }, { "x": 46.81, "y": 99.23 }, { "x": 53.83, "y": 87.53 } ] },
  { "id": "telescopio", "points": [ { "x": 46.41, "y": 39.15 }, { "x": 47.71, "y": 63.68 }, { "x": 52.23, "y": 63.91 }, { "x": 54.63, "y": 45.9 } ] },
  { "id": "sveglia_boo", "points": [ { "x": 62.35, "y": 55.58 }, { "x": 60.95, "y": 60.98 }, { "x": 69.57, "y": 65.03 }, { "x": 71.47, "y": 57.83 } ] }
];

// =================================================================================================
// 🛋️ ZONE SALOTTO (Living Room)
// =================================================================================================
const LIVING_ROOM_ZONES_MOBILE = [
  {
    "id": "tv",
    "points": [
      { "x": 21.06, "y": 41.21 },
      { "x": 20.52, "y": 57.05 },
      { "x": 40.51, "y": 54.33 },
      { "x": 39.98, "y": 41.04 }
    ]
  },
  {
    "id": "radio",
    "points": [
      { "x": 0.8, "y": 19.41 },
      { "x": 0.27, "y": 29.12 },
      { "x": 16.52, "y": 29.12 },
      { "x": 16.52, "y": 20.78 }
    ]
  },
  {
    "id": "chi_sono",
    "points": [
      { "x": 0.27, "y": 36.61 },
      { "x": 0, "y": 46.66 },
      { "x": 6.93, "y": 45.98 },
      { "x": 6.13, "y": 36.44 }
    ]
  },
  {
    "id": "amici",
    "points": [
      { "x": 40.78, "y": 70.33 },
      { "x": 50.91, "y": 73.74 },
      { "x": 59.97, "y": 71.36 },
      { "x": 50.91, "y": 67.1 }
    ]
  },
  {
    "id": "libri",
    "points": [
      { "x": 61.57, "y": 62.16 },
      { "x": 57.04, "y": 66.59 },
      { "x": 66.36, "y": 68.8 },
      { "x": 71.43, "y": 63.86 }
    ]
  }
];

const LIVING_ROOM_ZONES_DESKTOP = [
  {
    "id": "radio",
    "points": [{"x":31.17,"y":10.8},{"x":30.77,"y":24.98},{"x":38.09,"y":26.1},{"x":37.89,"y":12.83}]
  },
  {
    "id": "tv",
    "points": [{"x":38.29,"y":39.6},{"x":37.99,"y":59.63},{"x":46.51,"y":56.26},{"x":46.91,"y":39.15}]
  },
  {
    "id": "chi_sono",
    "points": [{"x":29.87,"y":33.98},{"x":33.58,"y":33.53},{"x":34.28,"y":46.13},{"x":30.47,"y":47.7}]
  },
  {
    "id": "amici",
    "points": [{"x":46.81,"y":76.06},{"x":50.12,"y":81.01},{"x":54.13,"y":76.73},{"x":50.32,"y":72.46}]
  },
  {
    "id": "libri",
    "points": [{"x":53.83,"y":65.71},{"x":53.23,"y":72.23},{"x":56.54,"y":74.26},{"x":58.14,"y":67.73}]
  }
];

// =================================================================================================
// 🛁 ZONE BAGNO
// =================================================================================================
const BATHROOM_ZONES_MOBILE = [
  { "id": "vasca", "label": "Vasca", "message": "Splash! Un bel bagno caldo! 🛀", "points": [{"x":1.6,"y":62.5},{"x":4.53,"y":81.06},{"x":42.11,"y":74.25},{"x":39.18,"y":57.05}] },
  { "id": "lavandino", "label": "Lavandino", "message": "", "points": [{"x":55.17,"y":52.11},{"x":61.57,"y":72.04},{"x":71.7,"y":75.27},{"x":79.16,"y":53.64}] },
  { "id": "cesto", "label": "Cesto Panni", "message": "Mettiamo a lavare i vestiti! 🧺", "points": [{"x":98.61,"y":76.29},{"x":89.29,"y":80.89},{"x":89.55,"y":99.46},{"x":99.41,"y":99.46}] },
  { "id": "shampoo", "label": "Shampoo", "message": "Tante bolle di sapone! 🫧", "points": [{"x":47.97,"y":77.49},{"x":47.44,"y":90.09},{"x":55.17,"y":90.6},{"x":55.7,"y":78.17}] }
];

const BATHROOM_ZONES_DESKTOP = [
  { "id": "vasca", "label": "Vasca", "message": "Splash! Un bel bagno caldo! 🛀", "points": [{"x":30.87,"y":67.28},{"x":34.48,"y":91.81},{"x":47.61,"y":83.03},{"x":47.71,"y":60.98}] },
  { "id": "lavandino", "label": "Lavandino", "message": "", "points": [{"x":52.93,"y":56.93},{"x":55.43,"y":86.41},{"x":59.54,"y":87.76},{"x":62.55,"y":56.03}] },
  { "id": "shampoo", "label": "Shampoo", "message": "Tante bolle di sapone! 🫧", "points": [{"x":50.12,"y":87.31},{"x":49.82,"y":99.01},{"x":53.23,"y":99.01},{"x":53.33,"y":84.83}] },
  { "id": "cesto", "label": "Cesto Panni", "message": "Mettiamo a lavare i vestiti! 🧺", "points": [{"x":65.56,"y":85.28},{"x":65.76,"y":98.11},{"x":74.38,"y":98.11},{"x":74.68,"y":85.28}] }
];

// =================================================================================================
// 🍳 ZONE CUCINA
// =================================================================================================
const KITCHEN_ZONES_MOBILE = [
  {
    "id": "spazzatura",
    label: "La Spazzatura",
    message: "Ricordati di fare la differenziata! ♻️",
    points: [
      { x: 11.46, y: 54.16 },
      { x: 19.19, y: 65.22 },
      { x: 1.87, y: 79.36 },
      { x: 0, y: 60.29 }
    ]
  },
  {
    id: "microonde",
    label: "Il Microonde",
    message: "Cucina Cinese! 🍜",
    points: [
      { x: 16.26, y: 43.43 },
      { x: 15.72, y: 49.22 },
      { x: 29.85, y: 49.39 },
      { x: 30.92, y: 42.75 }
    ]
  },
  {
    "id": "frutta",
    "label": "La Frutta",
    "message": "Gnam! La frutta fa bene! 🍎🍌",
    "points": [
      { x: 41.58, y: 49.39 },
      { x: 42.64, y: 59.78 },
      { x: 58.37, y: 60.29 },
      { x: 60.5, y: 49.39 }
    ]
  },
  {
    "id": "frigorifero",
    "label": "Il Frigorifero",
    "message": "È pieno di cose buone! ❄️",
    "points": [
      { x: 87.69, y: 36.96 },
      { x: 86.09, y: 76.12 },
      { x: 98.61, y: 84.13 },
      { x: 98.08, y: 36.61 }
    ]
  }
];

const KITCHEN_ZONES_DESKTOP = [
  {
    id: "spazzatura",
    label: "La Spazzatura",
    message: "Ricordati di fare la differenziata! ♻️",
    points: [
      { "x": 25.66, "y": 66.38 },
      { "x": 25.86, "y": 89.33 },
      { "x": 37.49, "y": 71.11 },
      { "x": 35.08, "y": 56.26 }
    ]
  },
  {
    id: "microonde",
    label: "Il Microonde",
    message: "Cucina Cinese! 🍜",
    points: [
      { "x": 36.09, "y": 42.75 },
      { "x": 36.19, "y": 49.73 },
      { "x": 42.5, "y": 49.95 },
      { "x": 42.5, "y": 42.08 }
    ]
  },
  {
    "id": "frutta",
    "label": "La Frutta",
    "message": "Gnam! La frutta fa bene! 🍎🍌",
    "points": [
      { "x": 46.81, "y": 51.53 },
      { "x": 47.41, "y": 64.36 },
      { "x": 53.13, "y": 64.81 },
      { "x": 54.13, "y": 51.31 }
    ]
  },
  {
    "id": "frigorifero",
    "label": "Il Frigorifero",
    "message": "È pieno di cose buone! ❄️",
    "points": [
      { "x": 66.16, "y": 34.2 },
      { "x": 65.36, "y": 84.16 },
      { "x": 74.18, "y": 95.63 },
      { "x": 81.8, "y": 35.1 }
    ]
  }
];

// =================================================================================================
// 🪞 SPECCHIO MAGICO PLAYER (Component)
// =================================================================================================
const MagicMirrorPlayer = ({ onClose }: { onClose: () => void }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [config, setConfig] = useState(isMobile ? MIRROR_CONFIG_MOBILE : MIRROR_CONFIG_DESKTOP);
    
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setConfig(mobile ? MIRROR_CONFIG_MOBILE : MIRROR_CONFIG_DESKTOP);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in" onClick={onClose}>
            <div className="relative w-full max-w-lg flex flex-col items-center" onClick={e => e.stopPropagation()}>
                
                {/* HEADER BUTTONS */}
                <div className="absolute -top-12 right-0 flex gap-2 z-50">
                    <button 
                        onClick={onClose}
                        className="bg-red-500 text-white p-2 rounded-full border-2 border-white hover:scale-110 shadow-lg"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* THE FRAME CONTAINER */}
                <div className="relative w-full aspect-[3/4] max-h-[80vh]">
                    {/* The Frame Image */}
                    <img 
                        src={MIRROR_FRAME_IMG} 
                        alt="Specchio" 
                        className="w-full h-full object-contain drop-shadow-2xl select-none"
                    />

                    {/* The Video Area */}
                    <div 
                        className="absolute bg-black overflow-hidden rounded-lg shadow-inner transition-all duration-100"
                        style={{
                            top: config.top,
                            left: config.left,
                            width: config.width,
                            height: config.height,
                        }}
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${TOOTHBRUSH_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&controls=0`}
                            className="w-full h-full"
                            title="Specchio Magico"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>

                <p className="text-white font-bold mt-4 animate-pulse">Laviamoci i denti insieme! 🪥</p>
            </div>
        </div>
    );
};

// =================================================================================================
// 🧺 GIOCO CESTO BIANCHERIA (Component)
// =================================================================================================
const LaundrySortGame = ({ onClose }: { onClose: () => void }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
    const [gameOver, setGameOver] = useState(false);
    
    // Shuffle items on start
    const [shuffledItems, setShuffledItems] = useState<any[]>([]);

    useEffect(() => {
        setShuffledItems([...LAUNDRY_ITEMS].sort(() => 0.5 - Math.random()));
    }, []);

    const currentItem = shuffledItems[currentIdx];

    const handleSort = (targetType: 'WHITE' | 'COLOR') => {
        if (!currentItem || isAnimating) return;

        setIsAnimating(true);
        const isCorrect = currentItem.type === targetType;

        if (isCorrect) {
            setFeedback('CORRECT');
            setScore(s => s + 1);
        } else {
            setFeedback('WRONG');
        }

        setTimeout(() => {
            setFeedback(null);
            setIsAnimating(false);
            if (currentIdx < shuffledItems.length - 1) {
                setCurrentIdx(prev => prev + 1);
            } else {
                setGameOver(true);
            }
        }, 1000);
    };

    const restart = () => {
        setShuffledItems([...LAUNDRY_ITEMS].sort(() => 0.5 - Math.random()));
        setCurrentIdx(0);
        setScore(0);
        setGameOver(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-lg rounded-[40px] border-8 border-indigo-500 p-6 relative shadow-2xl overflow-hidden flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex justify-between items-center mb-4 z-20">
                    <div className="bg-indigo-100 px-4 py-1 rounded-full border-2 border-indigo-300 font-bold text-indigo-800 flex items-center gap-2">
                        <Shirt size={18} /> {score}/{LAUNDRY_ITEMS.length}
                    </div>
                    <button onClick={onClose} className="bg-red-100 p-2 rounded-full border-2 border-red-400 text-red-500">
                        <X size={24} />
                    </button>
                </div>

                <h3 className="text-center text-2xl font-black text-indigo-600 mb-2">Bianchi o Colorati?</h3>

                {/* Game Area */}
                <div className="flex-1 relative rounded-3xl border-4 border-indigo-200 overflow-hidden bg-blue-50 mb-6 flex flex-col items-center justify-center">
                    
                    {gameOver ? (
                        <div className="text-center animate-in zoom-in">
                            <div className="text-6xl mb-4 animate-spin-slow">🧼</div>
                            <h2 className="text-3xl font-black text-indigo-600 mb-2">BUCATO FATTO!</h2>
                            <p className="text-xl font-bold text-gray-600 mb-6">Hai separato {score} capi correttamente!</p>
                            <button 
                                onClick={restart}
                                className="bg-yellow-400 text-black font-black text-xl px-8 py-3 rounded-full border-4 border-black hover:scale-105 transition-transform"
                            >
                                ALTRO GIRO
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Current Item */}
                            <div className={`
                                text-9xl transition-all duration-500 drop-shadow-xl
                                ${feedback === 'CORRECT' ? 'scale-0 opacity-0 translate-y-20' : ''}
                                ${feedback === 'WRONG' ? 'animate-shake' : 'animate-bounce'}
                            `}>
                                {currentItem?.emoji}
                            </div>
                            <p className="font-bold text-gray-500 mt-4 text-xl uppercase tracking-widest">{currentItem?.name}</p>

                            {/* Feedback Overlay */}
                            {feedback && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10 animate-in zoom-in">
                                    {feedback === 'CORRECT' ? (
                                        <div className="text-green-500 text-6xl font-black drop-shadow-sm flex flex-col items-center">
                                            <CheckCircle size={80} />
                                            GIUSTO!
                                        </div>
                                    ) : (
                                        <div className="text-red-500 text-6xl font-black drop-shadow-sm flex flex-col items-center">
                                            <X size={80} />
                                            OPS!
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Controls (Baskets) */}
                {!gameOver && (
                    <div className="grid grid-cols-2 gap-4 h-32">
                        <button 
                            onClick={() => handleSort('WHITE')}
                            className="bg-white text-gray-700 font-black rounded-2xl border-4 border-gray-300 hover:bg-gray-100 active:scale-95 transition-all flex flex-col items-center justify-center relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gray-100 opacity-50 group-hover:opacity-20 transition-opacity"></div>
                            <div className="w-16 h-16 border-4 border-gray-400 rounded-full mb-1 bg-white shadow-inner flex items-center justify-center">
                                <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full animate-spin-slow"></div>
                            </div>
                            BIANCHI
                        </button>
                        
                        <button 
                            onClick={() => handleSort('COLOR')}
                            className="bg-purple-100 text-purple-700 font-black rounded-2xl border-4 border-purple-400 hover:bg-purple-200 active:scale-95 transition-all flex flex-col items-center justify-center relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                            <div className="w-16 h-16 border-4 border-purple-500 rounded-full mb-1 bg-white/80 shadow-inner flex items-center justify-center relative z-10">
                                <div className="w-12 h-12 border-2 border-dashed border-purple-400 rounded-full animate-spin-slow bg-gradient-to-tr from-red-400 via-yellow-400 to-blue-400 opacity-50"></div>
                            </div>
                            <span className="relative z-10">COLORATI</span>
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

const SinkFloatGame = ({ onClose }: { onClose: () => void }) => {
    const [currentItem, setCurrentItem] = useState<BuoyancyItem | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        startNewRound();
    }, []);

    const startNewRound = () => {
        const randomItem = SINK_FLOAT_ITEMS[Math.floor(Math.random() * SINK_FLOAT_ITEMS.length)];
        setCurrentItem(randomItem);
        setIsAnimating(false);
        setShowResult(false);
        setFeedback(null);
    };

    const handleGuess = (guessFloats: boolean) => {
        if (!currentItem || isAnimating) return;

        setIsAnimating(true);
        const isCorrect = guessFloats === currentItem.floats;
        
        setTimeout(() => {
            setShowResult(true);
            setFeedback(isCorrect ? 'CORRECT' : 'WRONG');
            if (isCorrect) setScore(s => s + 1);
        }, 1000); 
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-lg rounded-[40px] border-8 border-blue-500 p-6 relative shadow-2xl overflow-hidden flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 z-20">
                    <div className="bg-blue-100 px-4 py-1 rounded-full border-2 border-blue-300 font-bold text-blue-800 flex items-center gap-2">
                        <Waves size={18} /> {score} Punti
                    </div>
                    <button onClick={onClose} className="bg-red-100 p-2 rounded-full border-2 border-red-400 text-red-500">
                        <X size={24} />
                    </button>
                </div>
                <h3 className="text-center text-2xl font-black text-blue-600 mb-2">Galleggia o Affonda?</h3>
                <div className="flex-1 relative rounded-3xl border-4 border-blue-300 overflow-hidden bg-sky-100 mb-6">
                    <div className="absolute bottom-0 w-full h-[60%] bg-blue-500/80 backdrop-blur-sm border-t-4 border-blue-400/50 flex items-start justify-center pt-2">
                        <div className="w-full h-2 bg-white/20 animate-pulse"></div>
                    </div>
                    {currentItem && (
                        <div 
                            className={`absolute left-1/2 -translate-x-1/2 text-7xl transition-all duration-1000 ease-in-out z-10
                                ${!isAnimating ? 'top-[10%]' : (currentItem.floats ? 'top-[40%]' : 'top-[85%]')}
                            `}
                        >
                            {currentItem.emoji}
                        </div>
                    )}
                    {showResult && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/60 backdrop-blur-sm animate-in zoom-in">
                            <div className="text-6xl mb-2">
                                {feedback === 'CORRECT' ? '🎉' : '💦'}
                            </div>
                            <h2 className={`text-3xl font-black mb-1 ${feedback === 'CORRECT' ? 'text-green-600' : 'text-blue-700'}`}>
                                {feedback === 'CORRECT' ? 'BRAVISSIMO!' : (currentItem?.floats ? 'GALLEGGIA!' : 'AFFONDA!')}
                            </h2>
                            <button 
                                onClick={startNewRound}
                                className="mt-4 bg-yellow-400 text-black font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                            >
                                <RefreshCw size={20} /> PROSSIMO
                            </button>
                        </div>
                    )}
                </div>
                {!showResult && (
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleGuess(true)}
                            className="bg-green-100 text-green-700 font-black py-4 rounded-2xl border-4 border-green-500 hover:bg-green-200 active:scale-95 transition-all flex flex-col items-center"
                        >
                            <ArrowUp size={32} />
                            GALLEGGIA
                        </button>
                        <button 
                            onClick={() => handleGuess(false)}
                            className="bg-blue-100 text-blue-700 font-black py-4 rounded-2xl border-4 border-blue-500 hover:bg-blue-200 active:scale-95 transition-all flex flex-col items-center"
                        >
                            <ArrowDown size={32} />
                            AFFONDA
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const BlobLineGame = ({ onClose }: { onClose: () => void }) => {
    useEffect(() => {
        document.body.classList.add('allow-landscape');
        return () => document.body.classList.remove('allow-landscape');
    }, []);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full h-full md:max-w-5xl md:h-[85vh] md:rounded-[40px] border-none md:border-8 border-cyan-400 p-0 md:p-4 relative shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="w-full flex justify-between items-center p-2 bg-cyan-50 md:bg-transparent z-20">
                    <h3 className="text-xl md:text-2xl font-black text-cyan-600 flex items-center gap-2">
                        🫧 Blob Line
                    </h3>
                    <button onClick={onClose} className="bg-red-100 p-2 rounded-full border-2 border-red-400 text-red-500 hover:scale-110 transition-transform">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 w-full relative overflow-hidden bg-gray-50 md:rounded-3xl md:border-4 md:border-cyan-200">
                    <iframe 
                        src="https://www.madkidgames.com/full/blob-line-colorful-puzzle-game"
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media; fullscreen"
                        title="Blob Line"
                        loading="lazy"
                        scrolling="no"
                    />
                </div>
            </div>
        </div>
    );
};

const MicrowaveGame = ({ onClose }: { onClose: () => void }) => {
    useEffect(() => {
        document.body.classList.add('allow-landscape');
        return () => document.body.classList.remove('allow-landscape');
    }, []);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full h-full md:max-w-5xl md:h-[85vh] md:rounded-[40px] border-none md:border-8 border-red-500 p-0 md:p-4 relative shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="w-full flex justify-between items-center p-2 bg-red-50 md:bg-transparent z-20">
                    <h3 className="text-xl md:text-2xl font-black text-red-600 flex items-center gap-2">
                        🍜 Cucina Cinese
                    </h3>
                    <button onClick={onClose} className="bg-red-100 p-2 rounded-full border-2 border-red-400 text-red-500 hover:scale-110 transition-transform">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 w-full relative overflow-hidden bg-gray-50 md:rounded-3xl md:border-4 md:border-red-200">
                    <iframe 
                        src="https://www.madkidgames.com/full/ranmen-master-ramen-cooking-game"
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media; fullscreen"
                        title="Cucina Cinese"
                        loading="lazy"
                        scrolling="no"
                    />
                </div>
            </div>
        </div>
    );
};

const PiggyGame = ({ onClose }: { onClose: () => void }) => {
    useEffect(() => {
        document.body.classList.add('allow-landscape');
        return () => document.body.classList.remove('allow-landscape');
    }, []);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full h-full md:max-w-5xl md:h-[85vh] md:rounded-[40px] border-none md:border-8 border-pink-400 p-0 md:p-4 relative shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="w-full flex justify-between items-center p-2 bg-pink-50 md:bg-transparent z-20">
                    <h3 className="text-xl md:text-2xl font-black text-pink-600 flex items-center gap-2">
                        🐷 Il Porcellino Mangione
                    </h3>
                    <button onClick={onClose} className="bg-red-100 p-2 rounded-full border-2 border-red-400 text-red-500 hover:scale-110 transition-transform">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 w-full relative overflow-hidden bg-gray-50 md:rounded-3xl md:border-4 md:border-pink-200">
                    <iframe 
                        src="https://www.madkidgames.com/full/piggy-wiggy-physics-puzzle"
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media; fullscreen"
                        title="Piggy Wiggy"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    );
};

const RestaurantGame = ({ onClose }: { onClose: () => void }) => {
    useEffect(() => {
        document.body.classList.add('allow-landscape');
        return () => document.body.classList.remove('allow-landscape');
    }, []);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full h-full md:max-w-5xl md:h-[85vh] md:rounded-[40px] border-none md:border-8 border-orange-400 p-0 md:p-4 relative shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="w-full flex justify-between items-center p-2 bg-orange-50 md:bg-transparent z-20">
                    <h3 className="text-xl md:text-2xl font-black text-orange-600 flex items-center gap-2">
                        👨‍🍳 Cucina al Ristorante
                    </h3>
                    <button onClick={onClose} className="bg-red-100 p-2 rounded-full border-2 border-red-400 text-red-500 hover:scale-110 transition-transform">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 w-full relative overflow-hidden bg-gray-50 md:rounded-3xl md:border-4 md:border-orange-200">
                    <iframe 
                        src="https://www.madkidgames.com/full/cooking-love-chef-restaurant"
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media; fullscreen"
                        title="Cucina al Ristorante"
                        loading="lazy"
                        scrolling="no"
                    />
                </div>
            </div>
        </div>
    );
};

const RecyclingGame = ({ onClose }: { onClose: () => void }) => {
    const [roundItems, setRoundItems] = useState<TrashItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'NONE' | 'CORRECT' | 'WRONG'>('NONE');
    const [gameOver, setGameOver] = useState(false);
    useEffect(() => { startNewRound(); }, []);
    const startNewRound = () => { const shuffled = [...TRASH_ITEMS].sort(() => 0.5 - Math.random()); const selected = shuffled.slice(0, 5); setRoundItems(selected); setCurrentIndex(0); setScore(0); setGameOver(false); setFeedback('NONE'); };
    const currentItem = roundItems[currentIndex];
    const handleBinClick = (binType: TrashType) => { if (!currentItem || feedback !== 'NONE') return; if (binType === currentItem.type) { setFeedback('CORRECT'); setScore(prev => prev + 1); setTimeout(() => { if (currentIndex < 4) { setCurrentIndex(prev => prev + 1); setFeedback('NONE'); } else { setGameOver(true); } }, 1000); } else { setFeedback('WRONG'); setTimeout(() => setFeedback('NONE'), 1000); } };
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-2xl rounded-[40px] border-8 border-green-600 p-6 relative shadow-2xl overflow-hidden flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <div className="w-full flex justify-between items-center mb-6"><div className="bg-green-100 px-4 py-1 rounded-full border-2 border-green-500 font-bold text-green-800 flex items-center gap-2"><Recycle size={20}/> {score}/5</div><button onClick={onClose} className="bg-red-100 p-2 rounded-full border-2 border-red-400 text-red-500"><X size={24} /></button></div>
                {gameOver ? (<div className="flex flex-col items-center justify-center py-10 animate-in zoom-in"><div className="text-8xl mb-4 animate-bounce">🌍</div><h2 className="text-4xl font-black text-green-600 mb-2 text-center">BRAVISSIMO!</h2><p className="text-gray-600 font-bold text-center mb-8">Hai riciclato 5 oggetti!</p><div className="flex gap-3"><button onClick={startNewRound} className="bg-blue-500 text-white font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 transition-transform">ANCORA!</button><button onClick={onClose} className="bg-red-500 text-white font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 transition-transform">ESCI</button></div></div>) : (<><h3 className="text-2xl font-black text-gray-800 mb-4 text-center">Dove lo butti?</h3><div className={`w-40 h-40 bg-gray-100 rounded-3xl border-4 border-dashed border-gray-400 flex flex-col items-center justify-center mb-8 relative ${feedback === 'CORRECT' ? 'bg-green-100 border-green-500 scale-110 rotate-12 transition-transform' : ''} ${feedback === 'WRONG' ? 'bg-red-100 border-red-500 animate-shake' : ''}`}>{currentItem && (<><span className="text-7xl drop-shadow-md filter">{currentItem.emoji}</span><span className="text-sm font-bold text-gray-500 mt-2 uppercase">{currentItem.label}</span></>)}{feedback === 'CORRECT' && <div className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-lg">✅</div>}{feedback === 'WRONG' && <div className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-lg">❌</div>}</div><div className="flex gap-2 w-full justify-center">{BINS.map((bin) => (<button key={bin.type} onClick={() => handleBinClick(bin.type)} className={`flex-1 flex flex-col items-center justify-end h-32 rounded-t-2xl rounded-b-lg border-x-4 border-t-4 border-b-8 transition-transform active:scale-95 hover:-translate-y-1 ${bin.color} ${bin.border}`}><div className="mb-2 bg-black/10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl border-2 border-black/10"><Recycle className="text-white opacity-80" size={20} /></div><span className="bg-black/20 text-white w-full text-center py-1 font-black text-[9px] md:text-xs uppercase tracking-wide truncate px-1">{bin.label}</span></button>))}</div></>)}
            </div>
        </div>
    );
};

// =================================================================================================
// ⏰ GIOCO SVEGLIA: ACCHIAPPA LA SVEGLIA
// =================================================================================================
const ClockGame = ({ onClose }: { onClose: () => void }) => {
    const [position, setPosition] = useState({ top: '50%', left: '50%' });
    const [taps, setTaps] = useState(0);
    const [isCaught, setIsCaught] = useState(false);
    
    // Function to move alarm to random position
    const moveAlarm = () => {
        if (isCaught) return;
        const top = Math.floor(Math.random() * 80) + 10 + '%';
        const left = Math.floor(Math.random() * 80) + 10 + '%';
        setPosition({ top, left });
    };

    // Auto move interval
    useEffect(() => {
        if (isCaught) return;
        const interval = setInterval(moveAlarm, 800); // Jumps every 800ms
        return () => clearInterval(interval);
    }, [isCaught]);

    const handleTap = () => {
        if (taps >= 4) {
            setIsCaught(true);
        } else {
            setTaps(t => t + 1);
            moveAlarm(); // Move immediately on tap too
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
            <div className="relative w-full max-w-lg h-[80vh] bg-white rounded-[40px] border-8 border-red-500 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-500 z-50">
                    <X size={24} />
                </button>

                {/* GAME AREA */}
                {isCaught ? (
                    <div className="flex flex-col items-center justify-center h-full animate-in zoom-in text-center p-6">
                        <div className="text-8xl mb-4 animate-bounce">🌞</div>
                        <h2 className="text-4xl font-black text-red-600 mb-2">BUONGIORNO!</h2>
                        <p className="text-gray-600 font-bold text-xl mb-8">Hai spento la sveglia!</p>
                        <button onClick={() => { setTaps(0); setIsCaught(false); }} className="bg-yellow-400 text-black font-black text-lg px-8 py-3 rounded-full border-4 border-black hover:scale-105 transition-transform">
                            DORMI ANCORA 😴
                        </button>
                    </div>
                ) : (
                    <div className="relative w-full h-full bg-red-50">
                        <div className="absolute top-8 left-0 right-0 text-center pointer-events-none">
                            <h3 className="text-3xl font-black text-red-600 animate-pulse">DRIIIN! ⏰</h3>
                            <p className="text-red-400 font-bold">Acchiappa la sveglia! ({5 - taps})</p>
                        </div>

                        {/* JUMPING ALARM CLOCK */}
                        <button 
                            onClick={handleTap}
                            className="absolute transition-all duration-200 ease-in-out transform -translate-x-1/2 -translate-y-1/2 active:scale-90"
                            style={{ top: position.top, left: position.left }}
                        >
                            <div className="text-8xl filter drop-shadow-xl animate-wiggle cursor-pointer">
                                ⏰
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// =================================================================================================
// 👾 GIOCO VESTI IL TUO MOSTRO
// =================================================================================================
const MonsterMakeoverGame = ({ onClose }: { onClose: () => void }) => {
    useEffect(() => {
        document.body.classList.add('allow-landscape');
        return () => document.body.classList.remove('allow-landscape');
    }, []);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full h-full md:max-w-5xl md:h-[85vh] md:rounded-[40px] border-none md:border-8 border-purple-500 p-0 md:p-4 relative shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="w-full flex justify-between items-center p-2 bg-purple-50 md:bg-transparent z-20">
                    <h3 className="text-xl md:text-2xl font-black text-purple-600 flex items-center gap-2">
                        👾 Vesti il tuo Mostro
                    </h3>
                    <button onClick={onClose} className="bg-red-100 p-2 rounded-full border-2 border-red-400 text-red-500 hover:scale-110 transition-transform">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 w-full relative overflow-hidden bg-gray-50 md:rounded-3xl md:border-4 md:border-purple-200">
                    <iframe 
                        src="https://www.madkidgames.com/full/monster-makeover-3d-mix-monsters"
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media; fullscreen"
                        title="Vesti il tuo Mostro"
                        loading="lazy"
                        scrolling="no"
                    />
                </div>
            </div>
        </div>
    );
};

interface RoomViewProps {
    roomType: AppView;
    setView: (view: AppView) => void;
}

const RoomView: React.FC<RoomViewProps> = ({ roomType, setView }) => {
    const [showHint, setShowHint] = useState(false);
    const [customMessage, setCustomMessage] = useState<string | null>(null);
    const [activeGame, setActiveGame] = useState<string | null>(null);
    const [showTelescope, setShowTelescope] = useState(false); 
    
    const room = HOUSE_ROOMS.find(r => r.id === roomType);
    const navigation = ROOM_NAVIGATION[roomType];
    
    const isKitchen = roomType === AppView.BOO_KITCHEN;
    const isLivingRoom = roomType === AppView.BOO_LIVING_ROOM;
    const isBedroom = roomType === AppView.BOO_BEDROOM;
    const isBathroom = roomType === AppView.BOO_BATHROOM;
    
    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => {
            setShowHint(true);
        }, 1000); 
        return () => clearTimeout(timer);
    }, []);

    const handleInteraction = () => {
        if (showHint && !customMessage) setShowHint(false); 
    };

    const handleZoneClick = (id: string, message: string) => {
        // --- CUCINA ---
        if (id === 'microonde') { setActiveGame('microonde'); setShowHint(false); return; }
        if (id === 'spazzatura') { setActiveGame('spazzatura'); setShowHint(false); return; }
        if (id === 'frutta') { setActiveGame('frutta'); setShowHint(false); return; }
        if (id === 'frigorifero') { setActiveGame('frigorifero'); setShowHint(false); return; }

        // --- SALOTTO ---
        if (id === 'tv') { setView(AppView.VIDEOS); return; }
        if (id === 'radio') { window.open('https://open.spotify.com/intl-it/artist/3RVol8TV5OleEGTcP5tdau', '_blank'); return; }
        if (id === 'chi_sono') { setView(AppView.INTRO); return; }
        if (id === 'amici') { setView(AppView.CHARACTERS); return; }
        
        if (id === 'libri') { 
            if (isBedroom) setView(AppView.TALES); 
            else setView(AppView.BOOKS); 
            return; 
        }

        // --- CAMERA DA LETTO ---
        if (id === 'baule') { setActiveGame('baule'); setShowHint(false); return; }
        if (id === 'telescopio') { setShowTelescope(true); setShowHint(false); return; }
        if (id === 'sveglia') { setActiveGame('sveglia'); setShowHint(false); return; }
        if (id === 'sveglia_boo') { setView(AppView.SVEGLIA_BOO); return; } 

        // --- BAGNO ---
        if (id === 'lavandino') { setActiveGame('mirror_video'); setShowHint(false); return; }
        if (id === 'vasca') { setActiveGame('vasca'); setShowHint(false); return; }
        if (id === 'shampoo') { setActiveGame('shampoo'); setShowHint(false); return; }
        if (id === 'cesto') { setActiveGame('cesto'); setShowHint(false); return; }

        setCustomMessage(message);
        setShowHint(true);
        setTimeout(() => {
            setCustomMessage(null);
            setShowHint(false);
        }, 3000);
    };

    if (!room) return null;

    const roomImageMobile = ROOM_IMAGES_MOBILE[roomType];
    const roomImageDesktop = ROOM_IMAGES_DESKTOP[roomType];
    const hasImage = !!roomImageMobile; 

    const getClipPath = (points: {x: number, y: number}[]) => {
        if (!points || points.length < 3) return 'polygon(0 0, 0 0, 0 0)';
        const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
        return `polygon(${poly})`;
    };

    return (
        <div 
            className={`relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] overflow-hidden flex flex-col animate-in fade-in duration-500 ${hasImage ? 'bg-black' : 'bg-gradient-to-b from-[#b388f4] to-white'}`}
            onClick={handleInteraction}
        >
            {activeGame === 'microonde' && <MicrowaveGame onClose={() => setActiveGame(null)} />}
            {activeGame === 'spazzatura' && <RecyclingGame onClose={() => setActiveGame(null)} />}
            {activeGame === 'frutta' && <RestaurantGame onClose={() => setActiveGame(null)} />}
            {activeGame === 'frigorifero' && <PiggyGame onClose={() => setActiveGame(null)} />}
            
            {/* UPDATED GAMES */}
            {activeGame === 'sveglia' && <ClockGame onClose={() => setActiveGame(null)} />}
            {activeGame === 'baule' && <MonsterMakeoverGame onClose={() => setActiveGame(null)} />}
            
            {activeGame === 'mirror_video' && <MagicMirrorPlayer onClose={() => setActiveGame(null)} />}
            {activeGame === 'vasca' && <SinkFloatGame onClose={() => setActiveGame(null)} />}
            {activeGame === 'shampoo' && <BlobLineGame onClose={() => setActiveGame(null)} />}
            {activeGame === 'cesto' && <LaundrySortGame onClose={() => setActiveGame(null)} />}
            {showTelescope && <StarMap onClose={() => setShowTelescope(false)} />}

            <RobotHint 
                show={showHint && !activeGame && !showTelescope} 
                message={customMessage || "TOCCA GLI OGGETTI EVIDENZIATI PER SCOPRIRLI"}
                variant="GHOST"
            />

            <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
                {hasImage ? (
                    <>
                        {/* --- MOBILE VIEW --- */}
                        <div className="block md:hidden w-full h-full relative">
                            <img 
                                src={roomImageMobile} 
                                alt={`${room.label} Mobile`} 
                                className="w-full h-full object-cover select-none" 
                                style={{ objectPosition: isBathroom ? '70% center' : 'center' }}
                                draggable={false}
                            />
                            
                            {isKitchen && KITCHEN_ZONES_MOBILE.map((zone, i) => (
                                <div key={`mob-k-${i}`} onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id, zone.message); }} className="absolute inset-0 cursor-pointer active:bg-white/20 transition-colors" style={{ clipPath: getClipPath(zone.points) }} title={zone.label}></div>
                            ))}
                            {isLivingRoom && LIVING_ROOM_ZONES_MOBILE.map((zone, i) => (
                                <div key={`mob-l-${i}`} onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id, ""); }} className="absolute inset-0 cursor-pointer active:bg-white/20 transition-colors" style={{ clipPath: getClipPath(zone.points) }} title={zone.id}></div>
                            ))}
                            {isBedroom && BEDROOM_ZONES_MOBILE.map((zone, i) => {
                                if (zone.points.length < 3) return null;
                                return (
                                    <div key={`mob-b-${i}`} onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id, ""); }} className="absolute inset-0 cursor-pointer active:bg-white/20 transition-colors" style={{ clipPath: getClipPath(zone.points) }} title={zone.id}></div>
                                )
                            })}
                            {isBathroom && BATHROOM_ZONES_MOBILE.map((zone, i) => (
                                <div key={`mob-bath-${i}`} onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id, zone.message || ""); }} className="absolute inset-0 cursor-pointer active:bg-white/20 transition-colors" style={{ clipPath: getClipPath(zone.points) }} title={zone.label}></div>
                            ))}
                        </div>

                        {/* --- DESKTOP VIEW --- */}
                        <div className="hidden md:block w-full h-full relative">
                            <img 
                                src={roomImageDesktop} 
                                alt={`${room.label} Desktop`} 
                                className="w-full h-full object-cover object-center select-none" 
                                draggable={false}
                            />

                            {isKitchen && KITCHEN_ZONES_DESKTOP.map((zone, i) => (
                                <div key={`desk-k-${i}`} onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id, zone.message); }} className="absolute inset-0 cursor-pointer active:bg-white/20 transition-colors" style={{ clipPath: getClipPath(zone.points) }} title={zone.label}></div>
                            ))}
                            {isLivingRoom && LIVING_ROOM_ZONES_DESKTOP.map((zone, i) => (
                                <div key={`desk-l-${i}`} onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id, ""); }} className="absolute inset-0 cursor-pointer active:bg-white/20 transition-colors" style={{ clipPath: getClipPath(zone.points) }} title={zone.id}></div>
                            ))}
                            {isBedroom && BEDROOM_ZONES_DESKTOP.map((zone, i) => {
                                if (zone.points.length < 3) return null;
                                return (
                                    <div key={`desk-b-${i}`} onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id, ""); }} className="absolute inset-0 cursor-pointer active:bg-white/20 transition-colors" style={{ clipPath: getClipPath(zone.points) }} title={zone.id}></div>
                                )
                            })}
                            {isBathroom && BATHROOM_ZONES_DESKTOP.map((zone, i) => (
                                <div key={`desk-bath-${i}`} onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id, zone.message || ""); }} className="absolute inset-0 cursor-pointer active:bg-white/20 transition-colors" style={{ clipPath: getClipPath(zone.points) }} title={zone.label}></div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center p-6 flex flex-col items-center">
                        <div className="w-64 h-64 md:w-80 md:h-80 mb-6 relative">
                             <img src={CONSTRUCTION_IMG} alt="Lavori in corso" className="w-full h-full object-contain drop-shadow-xl" />
                        </div>
                        <h2 className={`text-4xl font-black mb-2 ${room.textDark ? 'text-black' : 'text-gray-800'}`}>
                            {room.label}
                        </h2>
                        <p className="text-xl font-bold text-gray-600 max-w-md">
                            Stiamo arredando questa stanza! <br/> Torna presto a trovarci.
                        </p>
                    </div>
                )}
            </div>

            {/* --- NAVIGATION ARROWS (BOTTOM) --- */}
            {!activeGame && !showTelescope && navigation && (
                <>
                    {/* LEFT ARROW (Previous Room / Exit) */}
                    {navigation.left && (
                        <button 
                            onClick={() => setView(navigation.left!.view)}
                            className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-yellow-400 text-black font-black py-2 px-4 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all"
                        >
                            {navigation.left.view === AppView.BOO_HOUSE ? (
                                <Home size={24} strokeWidth={4} />
                            ) : (
                                <ArrowLeft size={24} strokeWidth={4} />
                            )}
                            <span className="text-sm md:text-base uppercase">{navigation.left.label}</span>
                        </button>
                    )}

                    {/* RIGHT ARROW (Next Room) */}
                    {navigation.right && (
                        <button 
                            onClick={() => setView(navigation.right!.view)}
                            className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-yellow-400 text-black font-black py-2 px-4 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all"
                        >
                            <span className="text-sm md:text-base uppercase">{navigation.right.label}</span>
                            <ArrowRight size={24} strokeWidth={4} />
                        </button>
                    )}
                </>
            )}

            {!hasImage && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none translate-x-[10%]">
                    <img 
                        src={ROOM_DECOR_IMG} 
                        alt="Arredatore Boo" 
                        className="w-72 md:w-[600px] object-contain drop-shadow-2xl opacity-100 hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}
        </div>
    );
};

export default RoomView;
