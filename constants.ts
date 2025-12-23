import { Video, SocialLink, AppView } from './types';

export const APP_VERSION = '1.7.7';

// URLs Originali (Remoti)
export const OFFICIAL_LOGO = 'https://i.postimg.cc/tCZGcq9V/official.png';
export const HOME_ICON = 'https://i.postimg.cc/9M6v55V8/logsede.png';
export const HOME_HERO_IMAGE = 'https://i.postimg.cc/SKdgjcXW/ghhhhost.png';
export const CITY_MAP_IMAGE = 'https://i.postimg.cc/Hn1FHWYb/mappaa.png';
export const CITY_MAP_IMAGE_MOBILE = 'https://i.postimg.cc/bJtG5PNV/mappssa22.png';
export const HOME_BG_MOBILE = 'https://i.postimg.cc/vBmvH8Nw/dfggsh.jpg';
export const HOME_BG_DESKTOP = 'https://i.postimg.cc/j2RYjF7J/psfrdds.jpg';
export const CHANNEL_LOGO = 'https://lh3.googleusercontent.com/d/1jnecFUan677BId1slOSsP532hZ_DKWee';

// CSVs
export const FAN_ART_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSL1SLGxxN1zN0qEwN0QpuK8dPSRcVDIx1Dy-sryRlIAm5cIgQS3j9o1nN1kGbHH7VrRS0VBo7KvfSm/pub?gid=0&single=true&output=csv'; 
export const COMMUNITY_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQztpA2nvwkfSoJ4CArYQC-FlfRcvn6ngfstnyZEEGNsjkuGS0aOpheX3jsUBE95boEo_dLe8dfQXGT/pub?gid=0&single=true&output=csv'; 
export const NOTIFICATIONS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTuB_-wFGsDVWxL6Kk-K87B_URCHgEIB2ax1FCyXsUDuhhjHyWRQGE3e4nM-D6frI5cg2zpyn_CR_3b/pub?gid=0&single=true&output=csv'; 
export const SOCIAL_STATS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOn4nPnIbqs4jzAVQbpPYCXll7iX3lxLWIA5he7lqeEMXfxDRa2rJ62vyYZ0_8IYzpnTpJHo-nSUXy/pub?gid=0&single=true&output=csv'; 

// Config
export const YOUTUBE_CONFIG = {
  API_KEY: process.env.VITE_YOUTUBE_API_KEY || '',
  CHANNEL_ID: process.env.VITE_YOUTUBE_CHANNEL_ID || 'UC54EfsufATyB7s2XcRkt1Eg'
};

export const MAP_LOCATIONS = [
    { id: AppView.AI_MAGIC, label: 'Torre Magica', emoji: '🔮', top: '26.22%', left: '47.81%', mobileTop: '15%', mobileLeft: '50%', color: 'bg-purple-600', border: 'border-purple-800' },
    { id: AppView.TALES, label: 'Bosco Fiabe', emoji: '🌲', top: '41.96%', left: '77.19%', mobileTop: '36%', mobileLeft: '83%', color: 'bg-emerald-600', border: 'border-emerald-800' },
    { id: AppView.PLAY, label: 'Parco Giochi', emoji: '🎡', top: '25.22%', left: '28.57%', mobileTop: '25%', mobileLeft: '29%', color: 'bg-green-500', border: 'border-green-700' },
    { id: AppView.BOOKS, label: 'Biblioteca', emoji: '📚', top: '21.23%', left: '68.87%', mobileTop: '17%', mobileLeft: '81%', color: 'bg-blue-600', border: 'border-blue-800' },
    { id: AppView.SOUNDS, label: 'Disco', emoji: '🎧', top: '71.68%', left: '35.99%', mobileTop: '61%', mobileLeft: '33%', color: 'bg-pink-500', border: 'border-pink-700' },
    { id: AppView.COMMUNITY, label: 'Piazza', emoji: '📰', top: '94.16%', left: '40.1%', mobileTop: '87%', mobileLeft: '44%', color: 'bg-teal-500', border: 'border-teal-700' },
    { id: AppView.COLORING, label: 'Accademia', emoji: '🎨', top: '78.17%', left: '17.24%', mobileTop: '73%', mobileLeft: '16%', color: 'bg-orange-500', border: 'border-orange-700' },
    { id: AppView.FANART, label: 'Museo', emoji: '🖼️', top: '79.67%', left: '71.87%', mobileTop: '74%', mobileLeft: '77%', color: 'bg-yellow-400', border: 'border-yellow-600', textDark: true },
    { id: AppView.VIDEOS, label: 'Cinema', emoji: '🍿', top: '45.7%', left: '10.73%', mobileTop: '48%', mobileLeft: '14%', color: 'bg-red-500', border: 'border-red-700' },
    { id: AppView.SOCIALS, label: 'Stazione', emoji: '🚂', top: '74.93%', left: '85%', mobileTop: '60%', mobileLeft: '88%', color: 'bg-gray-700', border: 'border-gray-900' },
    { id: AppView.CHAT, label: 'Info Point', emoji: '💬', top: '63.19%', left: '58.54%', mobileTop: '59%', mobileLeft: '56%', color: 'bg-cyan-500', border: 'border-cyan-700' },
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
    { id: 'tom1', label: 'Tom 1', color: 'bg-green-500', src: 'https://tonejs.github.io/audio/drum-samples/acoustic-kit/tom1.mp3' },
    { id: 'tom2', label: 'Tom 2', color: 'bg-green-600', src: 'https://tonejs.github.io/audio/drum-samples/acoustic-kit/tom2.mp3' },
    { id: 'clap', label: 'Clap', color: 'bg-purple-500', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },
    { id: 'crash', label: 'Crash', color: 'bg-orange-500', src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' },
    { id: 'shaker', label: 'Shaker', color: 'bg-pink-500', src: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3' },
    { id: 'openhat', label: 'Open Hat', color: 'bg-yellow-600', src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' }
];

export const VIDEOS: Video[] = [
  { id: 'S7Q1CgO6ZQA', title: 'Lone Boo - Sigla Ufficiale', thumbnail: 'https://img.youtube.com/vi/S7Q1CgO6ZQA/maxresdefault.jpg', category: 'Musica', url: 'https://www.youtube.com/watch?v=S7Q1CgO6ZQA', description: 'La sigla ufficiale di Lone Boo!' }
];

export const CATEGORIES: string[] = ['Tutti', 'Musica', 'Storie', 'Giochi'];

export const SOCIALS: SocialLink[] = [
  { platform: 'YouTube', url: 'https://youtube.com/@ILoneBoo', iconName: 'youtube', color: 'bg-red-600', customIconUrl: 'https://i.postimg.cc/hGqNCx0c/Immagine-2025-11-29-021129.png' },
  { platform: 'Instagram', url: 'https://instagram.com/loneboo_official', iconName: 'instagram', color: 'bg-pink-600', customIconUrl: 'https://i.postimg.cc/QM2ggkgY/Immagine-2025-11-29-021230.png' },
  { platform: 'TikTok', url: 'https://tiktok.com/@lone_._boo', iconName: 'tiktok', color: 'bg-black', customIconUrl: 'https://i.postimg.cc/QCpfKYRh/Immagine-2025-11-29-021305.png' },
  { platform: 'Facebook', url: 'https://facebook.com/LoneBooFanPage', secondaryUrl: 'https://facebook.com/groups/2648776785470151', iconName: 'facebook', color: 'bg-blue-600', customIconUrl: 'https://i.postimg.cc/sgnwWh0Z/facebook.png' }
];

export const SUPPORT_LINKS: SocialLink[] = [
    { platform: 'Telegram', url: 'https://t.me/loneboo_official', iconName: 'telegram', color: 'bg-sky-500' },
    { platform: 'Patreon', url: 'https://patreon.com/cw/LoneBoo', iconName: 'patreon', color: 'bg-orange-500' }
];

export const MEMORY_ICONS = [
    'https://i.postimg.cc/sgbwfsYv/cart1.jpg',
    'https://i.postimg.cc/XJk8g5Tp/cart2.jpg',
    'https://i.postimg.cc/90xY6hXC/cart3.jpg',
    'https://i.postimg.cc/PfKypmbJ/cart4.jpg',
    'https://i.postimg.cc/28KxTrXM/cart5.jpg',
    'https://i.postimg.cc/Dw4PMH9S/cart6.jpg',
    'https://i.postimg.cc/SK0fFV4d/cart7.jpg',
    'https://i.postimg.cc/bvQHzbYW/cart8.jpg'
];