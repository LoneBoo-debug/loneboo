
export enum SchoolSubject {
  ITALIANO = 'ITALIANO',
  MATEMATICA = 'MATEMATICA',
  STORIA = 'STORIA',
  GEOGRAFIA = 'GEOGRAFIA',
  SCIENZE = 'SCIENZE'
}

export interface SchoolQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  feedback?: string;
}

export interface SchoolLesson {
  id: string;
  title: string;
  text: string;
  audioUrl: string; // URL del file MP3 fornito dall'utente
  quizzes: SchoolQuiz[]; // Lista di quiz caricati dal foglio
  isPremium?: boolean; // NEW: Se vero, richiede abbonamento
}

export interface SchoolChapter {
  id: string;
  title: string;
  lessons: SchoolLesson[];
}

export interface GradeCurriculumData {
  grade: number;
  subjects: Record<SchoolSubject, SchoolChapter[]>;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  url: string; // YouTube URL
  description: string;
  publishedAt?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string; // Added optional subtitle
  description: string;
  coverImage: string;
  amazonUrl: string;
}

export interface FairyTale {
  id: string;
  title: string;
  description: string;
  text?: string; // Full text of the story for read-along
  duration: string;
  image: string;
  src: string; // Audio source URL (MP3)
}

export interface SocialLink {
  platform: string;
  url: string;
  iconName: string; // Lucide icon name reference
  color: string;
  secondaryUrl?: string; // For Facebook Group
  isSecondary?: boolean;
  customIconUrl?: string; // NEW: Direct link to custom image icon
}

export enum AppView {
  HOME = 'HOME',
  CITY_MAP = 'CITY_MAP', // NEW: Dedicated Full Screen Map
  BOO_HOUSE = 'BOO_HOUSE', // NEW: Boo's House View
  INFO_MENU = 'INFO_MENU', // NEW: Help/Info Center
  FAQ = 'FAQ', // NEW: FAQ Page
  GUIDE = 'GUIDE', // NEW: User Guide Page
  CONTACT = 'CONTACT', // NEW: Contacts Page
  SERVICE_PAGE = 'SERVICE_PAGE', // NEW: Internal Tool for Migration
  NEWSSTAND = 'NEWSSTAND', // NEW: Newsstand as a full page
  SCHOOL = 'SCHOOL', // NEW: School Section
  SCHOOL_FIRST_FLOOR = 'SCHOOL_FIRST_FLOOR', // NEW: School First Floor
  SCHOOL_SECOND_FLOOR = 'SCHOOL_SECOND_FLOOR', // NEW: School Second Floor
  SCHOOL_GYM = 'SCHOOL_GYM', // NEW: School Gym

  // SPORT GYM
  SCHOOL_GYM_BASKET = 'SCHOOL_GYM_BASKET',
  SCHOOL_GYM_SOCCER = 'SCHOOL_GYM_SOCCER',
  SCHOOL_GYM_TENNIS = 'SCHOOL_GYM_TENNIS',
  SCHOOL_GYM_GYMNASTICS = 'SCHOOL_GYM_GYMNASTICS',
  
  // VISTE CLASSI
  SCHOOL_FIRST_GRADE = 'SCHOOL_FIRST_GRADE',
  SCHOOL_SECOND_GRADE = 'SCHOOL_SECOND_GRADE',
  SCHOOL_THIRD_GRADE = 'SCHOOL_THIRD_GRADE',
  SCHOOL_FOURTH_GRADE = 'SCHOOL_FOURTH_GRADE',
  SCHOOL_FIFTH_GRADE = 'SCHOOL_FIFTH_GRADE',
  
  // BOO HOUSE ROOMS
  BOO_GARDEN = 'BOO_GARDEN',
  BOO_BEDROOM = 'BOO_BEDROOM',
  BOO_LIVING_ROOM = 'BOO_LIVING_ROOM',
  BOO_BATHROOM = 'BOO_BATHROOM',
  BOO_KITCHEN = 'BOO_KITCHEN',

  INTRO = 'INTRO', 
  VIDEOS = 'VIDEOS',
  BOOKS = 'BOOKS',
  BOOKS_LIST = 'BOOKS_LIST', // NEW: Collection of books
  AI_MAGIC = 'AI_MAGIC',
  SOUNDS = 'SOUNDS',
  TALES = 'TALES',
  COLORING = 'COLORING', 
  SOCIALS = 'SOCIALS',
  COMMUNITY = 'COMMUNITY', 
  CHAT = 'CHAT', 
  PLAY = 'PLAY',
  FANART = 'FANART',
  CHARACTERS = 'CHARACTERS', 
  DISCLAIMER = 'DISCLAIMER',
  TECH_INFO = 'TECH_INFO',
  ABOUT = 'ABOUT',
  
  // NEW PAGE
  SVEGLIA_BOO = 'SVEGLIA_BOO',
  STOPWATCH_GAME = 'STOPWATCH_GAME', // NEW: Game logic requested
  TRAIN_JOURNEY = 'TRAIN_JOURNEY',
  
  // NEW LIBRARY PAGES
  LIBRARY_READ = 'LIBRARY_READ',
  LIBRARY_CARDS = 'LIBRARY_CARDS',
  LIBRARY_SCOPA = 'LIBRARY_SCOPA',
  LIBRARY_UNO = 'LIBRARY_UNO',
  LIBRARY_SOLITARIO = 'LIBRARY_SOLITARIO',

  // PREMIUM INFO
  PREMIUM_INFO = 'PREMIUM_INFO',

  // NUOVA VISTA VOCAL FX
  VOCAL_FX = 'VOCAL_FX'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface MemoryCard {
  id: number;
  iconName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// YouTube API Types
export interface YouTubePlaylist {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  playlistId: string;
}

export interface YouTubePlaylistItem {
  id: string; // Video ID
  title: string;
  thumbnail: string;
  description: string;
  playlistId: string;
}

export interface FanArt {
  id: string;
  author: string;
  age: string;
  image: string;
  city?: string;     // NEW
  province?: string; // NEW
}

export interface CommunityPost {
    id: string;
    type: 'TEXT' | 'IMAGE' | 'POLL';
    content: string;
    image?: string;
    date: string;
    likes: number;
    pollOptions?: { text: string; votes: number }[]; // Only used for MOCK polls currently
    totalVotes?: number;
}

// --- COLORING TYPES ---
export interface ColoringPage {
  id: string;
  title: string;
  thumbnail: string; // Preview image of the PDF (JPG/PNG)
  pdfUrl: string;    // Actual PDF link to download/print
}

export interface ColoringCategory {
  id: string;
  title: string;
  emoji: string;
  coverImage: string;
  color: string; // Tailwind class e.g., 'bg-red-500'
  items: ColoringPage[];
}

export interface AppNotification {
  id: string;       // Unique ID (e.g., 'notif-001') - Changing this triggers the red dot
  message: string;  // The text to show
  link?: string;    // Optional link button
  linkText?: string; // Text for the button
  active: boolean;  // If false, it won't show
  image?: string;   // Optional Image URL
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string; // Emoji or URL
  color: string;
}

// --- STICKER ALBUM TYPES ---
export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Sticker {
    id: string;
    name: string;
    image: string; // Emoji or URL
    rarity: Rarity;
    description: string;
}

// --- AVATAR CONFIGURATION (V2: Emoji Based) ---
export interface AvatarConfig {
    charIndex: number; // 0-X Index of the emoji
    bgIndex: number;   // 0-X Index of the background color
}

export interface PlayerProgress {
    playerName?: string; // Identity Name
    avatar?: 'BOY' | 'GIRL'; // Legacy field, kept for backward compat or simplistic checks
    avatarConfig?: AvatarConfig; // Detailed Avatar Configuration
    tokens: number;
    unlockedStickers: string[]; // List of sticker IDs (Global)
    hardModeUnlocked?: boolean; // Flag for Hard Mode Unlock
    duplicates?: number; // Count of duplicates
    duplicateStickers?: string[]; // Array of duplicate sticker IDs
    currentAlbum?: number; // 1 = Standard, 2 = Gold/Vol2
}

// --- SOCIAL STATS ---
export interface SocialStats {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
}
