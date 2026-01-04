import { Video, SocialLink, AppView } from './types';

export const APP_VERSION = '1.8.4';

// URLs Originali (Remoti)
export const OFFICIAL_LOGO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/logo-main.webp';
export const HOME_ICON = 'https://i.postimg.cc/9M6v55V8/logsede.png';
export const HOME_HERO_IMAGE = 'https://i.postimg.cc/SKdgjcXW/ghhhhost.png';
export const CITY_MAP_IMAGE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/city-map-desktop.webp';
export const CITY_MAP_IMAGE_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/city-map-mobile.webp';
export const HOME_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/home-mobile.webp';
export const HOME_BG_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/home-desktop.webp';
export const CHANNEL_LOGO = 'https://lh3.googleusercontent.com/d/1jnecFUan677BId1slOSsP532hZ_DKWee';

// CSVs
export const FAN_ART_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSL1SLGxxN1zN0qEwN0QpuK8dPSRcVDIx1Dy-sryRlIAm5cIgQS3j9o1nN1kGbHH7VrRS0VBo7KvfSm/pub?gid=0&single=true&output=csv'; 
export const COMMUNITY_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQztpA2nvwkfSoJ4CArYQC-FlfRcvn6ngfstnyZEEGNsjkuGS0aOpheX3jsUBE95boEo_dLe8dfQXGT/pub?gid=0&single=true&output=csv'; 

// Link Notifiche Corretto (Pubblicato sul Web)
export const NOTIFICATIONS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTuB_-wFGsDVWxL6Kk-K87B_URCHgEIB2ax1FCyXsUDuhhjHyWRQGE3e4nM-D6frI5cg2zpyn_CR_3b/pub?gid=0&single=true&output=csv'; 

export const SOCIAL_STATS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOn4nPnIbqs4jzAVQbpPYCXll7iX3lxLWIA5he7lqeEMXfxDRa2rJ62vyYZ0_8IYzpnTpJHo-nSUXy/pub?gid=0&single=true&output=csv'; 

// Config
export const YOUTUBE_CONFIG = {
  API_KEY: process.env.API_KEY || '',
  CHANNEL_ID: process.env.VITE_YOUTUBE_CHANNEL_ID || 'UC54EfsufATyB7s2XcRkt1Eg'
};

export const MAP_LOCATIONS = [
    { id: AppView.AI_MAGIC, label: 'Torre Magica', emoji: '🔮', top: '32%', left: '47.81%', mobileTop: '22%', mobileLeft: '50%', color: 'bg-purple-600', border: 'border-purple-800', bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvoletorremagic.webp' },
    { id: AppView.TALES, label: 'Bosco Fiabe', emoji: '🌲', top: '50%', left: '77.19%', mobileTop: '44%', mobileLeft: '83%', color: 'bg-emerald-600', border: 'border-emerald-800', bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvolabosco.webp' },
    { id: AppView.PLAY, label: 'Parco Giochi', emoji: '🎡', top: '29%', left: '24%', mobileTop: '27%', mobileLeft: '25%', color: 'bg-green-500', border: 'border-green-700', bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvoleparco.webp' },
    { id: AppView.BOOKS, label: 'Biblioteca', emoji: '📚', top: '26%', left: '68.87%', mobileTop: '22%', mobileLeft: '81%', color: 'bg-blue-600', border: 'border-blue-800', bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvolabiblio.webp' },
    { id: AppView.BOOKS_LIST, label: 'Libreria', emoji: '📖', top: '42%', left: '60%', mobileTop: '34%', mobileLeft: '75%', color: 'bg-orange-600', border: 'border-orange-800', bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvolelibre.webp' },
    { id: AppView.SOUNDS, label: 'Disco', emoji: '🎧', top: '66%', left: '35.99%', mobileTop: '56%', mobileLeft: '33%', color: 'bg-pink-500', border: 'border-pink-700', bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvladisco.webp' },
    { id: AppView.COMMUNITY, label: 'Piazza', emoji: '📰', top: '91%', left: '40.1%', mobileTop: '84%', mobileLeft: '44%', color: 'bg-teal-500', border: 'border-teal-700', bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvolapiazza.webp' },
    { id: AppView.COLORING, label: 'Accademia', emoji: '🎨', top: '78.17%', left: '17.24%', mobileTop: '73%', mobileLeft: '16%', color: 'bg-orange-500', border: 'border-orange-700', bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvoleaccade.webp' },
    { id: AppView.FANART, label: 'Museo', emoji: '🖼️', top: '79.67%', left: '71.87%', mobileTop: '74%', mobileLeft: '77%', color: 'bg-yellow-400', border: 'border-yellow-600', textDark: true, bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvolamuseo.webp' },
    { id: AppView.VIDEOS, label: 'Cinema', emoji: '🍿', top: '45.7%', left: '10.73%', mobileTop: '48%', mobileLeft: '14%', color: 'bg-red-500', border: 'border-red-700', bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvolecinema.webp' },
    { id: AppView.SOCIALS, label: 'Stazione', emoji: '🚂', top: '74.93%', left: '85%', mobileTop: '60%', mobileLeft: '88%', color: 'bg-gray-700', border: 'border-gray-900', bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stazz+(1).webp' },
    { id: AppView.CHAT, label: 'Info Point', emoji: '💬', top: '63.19%', left: '58.54%', mobileTop: '59%', mobileLeft: '56%', color: 'bg-cyan-500', border: 'border-cyan-700', bubbleImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvolapont.webp' },
];

export const HOUSE_ROOMS = [
    { id: AppView.BOO_GARDEN, label: 'Giardino', emoji: '🌳', top: '85%', left: '18%', color: 'bg-green-500', border: 'border-green-700' },
    { id: AppView.BOO_BEDROOM, label: 'Camera', emoji: '🛌', top: '58%', left: '21%', color: 'bg-purple-500', border: 'border-purple-700' },
    { id: AppView.BOO_LIVING_ROOM, label: 'Salotto', emoji: '🛋️', top: '31%', left: '69%', color: 'bg-orange-500', border: 'border-orange-700' },
    { id: AppView.BOO_BATHROOM, label: 'Bagno', emoji: '🛁', top: '61%', left: '77%', color: 'bg-cyan-500', border: 'border-cyan-700' },
    { id: AppView.BOO_KITCHEN, label: 'Cucina', emoji: '🍳', top: '29%', left: '24%', color: 'bg-yellow-400', border: 'border-yellow-600', textDark: true }
];

export const DJ_SOUNDS = [
    { id: 'fart', label: 'Pernacchia', emoji: '💨', src: 'https://www.myinstants.com/media/sounds/fart-with-reverb.mp3' },
    { id: 'boing', label: 'Boing', emoji: '🤪', src: 'https://www.myinstants.com/media/sounds/boing2.mp3' },
    { id: 'laugh', label: 'Risata', emoji: '😆', src: 'https://www.myinstants.com/media/sounds/cartoon-laugh.mp3' }
];

export const VIDEOS: Video[] = [
    {
        id: 'S7Q1CgO6ZQA',
        title: 'Lone Boo - Sigla Ufficiale',
        description: 'La sigla del mondo di Lone Boo.',
        thumbnail: 'https://img.youtube.com/vi/S7Q1CgO6ZQA/hqdefault.jpg',
        category: 'Sigle',
        url: 'https://www.youtube.com/watch?v=S7Q1CgO6ZQA'
    }
];

export const CATEGORIES = ['Tutti', 'Sigle', 'Canzoni', 'Storie'];

export const MEMORY_ICONS = [
  'https://loneboo-images.s3.eu-south-1.amazonaws.com/card-0.webp',
  'https://loneboo-images.s3.eu-south-1.amazonaws.com/card-1.webp',
  'https://loneboo-images.s3.eu-south-1.amazonaws.com/card-2.webp',
  'https://loneboo-images.s3.eu-south-1.amazonaws.com/card-3.webp',
  'https://loneboo-images.s3.eu-south-1.amazonaws.com/card-4.webp',
  'https://loneboo-images.s3.eu-south-1.amazonaws.com/card-5.webp',
  'https://loneboo-images.s3.eu-south-1.amazonaws.com/card-6.webp',
  'https://loneboo-images.s3.eu-south-1.amazonaws.com/card-7.webp'
];

export const SOCIALS: SocialLink[] = [
    { platform: 'YouTube', url: 'https://www.youtube.com/@ILoneBoo', iconName: 'Youtube', color: 'bg-red-600' },
    { platform: 'Instagram', url: 'https://www.instagram.com/loneboo_official', iconName: 'Instagram', color: 'bg-pink-600' },
    { platform: 'TikTok', url: 'https://www.tiktok.com/@lone_._boo', iconName: 'Music', color: 'bg-slate-900' },
    { platform: 'Facebook', url: 'https://www.facebook.com/LoneBooFanPage', iconName: 'Facebook', color: 'bg-blue-600' }
];

export const SUPPORT_LINKS: SocialLink[] = [
    { platform: 'Spotify', url: 'https://open.spotify.com/intl-it/artist/3RVol8TV5OleEGTcP5tdau', iconName: 'Music', color: 'bg-green-600' }
];

export const DRUM_SOUNDS = [
    { id: 'kick', label: 'Grancassa', emoji: '🥁', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/kick-drum-acoustic-sample-455285.mp3' },
    { id: 'snare', label: 'Rullante', emoji: '🥁', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/simple-snare-447488ggf.mp3' },
    { id: 'hihat_c', label: 'Charleston', emoji: '🥁', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/080161_hi-hat-open-2mp3-40691.mp3' },
    { id: 'openhat', label: 'Piatti', emoji: '🥁', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/hi-hat-open-acoustic-sample-455284.mp3' },
    { id: 'shaker', label: 'Rullante 2', emoji: '🥁', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/snare-3-243039.mp3' },
    { id: 'clap', label: 'Clap', emoji: '👏', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tr808-clap-241405.mp3' },
    { id: 'tom1', label: 'Tom 1', emoji: '🥁', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/snare-drum-acoustic-sample-3-455289.mp3' },
    { id: 'tom2', label: 'Tom 2', emoji: '🥁', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/snare-drum-acoustic-sample-455287.mp3' }
];

export const ANIMAL_SOUNDS = [
    { id: 'cow', label: 'Mucca', emoji: '🐮', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cow-mooing-type-04-293297.mp3' },
    { id: 'cat', label: 'Gatto', emoji: '🐱', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cute-cat-352656.mp3' },
    { id: 'dog', label: 'Cane', emoji: '🐶', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/free-dog-bark-419014.mp3' },
    { id: 'sheep', label: 'Pecora', emoji: '🐑', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sheep-122256.mp3' },
    { id: 'pig', label: 'Maiale', emoji: '🐷', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/oink-40664.mp3' },
    { id: 'duck', label: 'Anatra', emoji: '🦆', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/075176_duck-quack-40345.mp3' },
    { id: 'lion', label: 'Leone', emoji: '🦁', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/roar-1-352871.mp3' },
    { id: 'elephant', label: 'Elefante', emoji: '🐘', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elephant-trumpets-growls-6047.mp3' },
    { id: 'rooster', label: 'Gallo', emoji: '🐓', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rooster-crowing-364473.mp3' },
    { id: 'owl', label: 'Gufo', emoji: '🦉', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/owl-hooting-223549+(1).mp3' },
    { id: 'monkey', label: 'Scimmia', emoji: '🐒', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/monkey-128368.mp3' },
    { id: 'frog', label: 'Rana', emoji: '🐸', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frog-1-352709.mp3' }
];