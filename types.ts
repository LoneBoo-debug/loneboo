
export enum SchoolSubject {
  ITALIANO = 'ITALIANO',
  MATEMATICA = 'MATEMATICA',
  STORIA = 'STORIA',
  GEOGRAFIA = 'GEOGRAFIA',
  SCIENZE = 'SCIENZE',
  INGLESE = 'INGLESE',
  ARTE = 'ARTE',
  TECNOLOGIA = 'TECNOLOGIA',
  ESPERIMENTI = 'ESPERIMENTI',
  INFORMATICA = 'INFORMATICA',
  CIVICA = 'CIVICA',
  MOTORIA = 'MOTORIA'
}

export interface SchoolQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  feedback?: string;
  image?: string; 
}

export interface SchoolLesson {
  id: string;
  title: string;
  text: string;
  audioUrl: string;
  videoUrl?: string;
  iconUrl?: string;     // Nuova colonna C
  quizzes: SchoolQuiz[];
  activities: SchoolQuiz[];
  isPremium?: boolean;
  grade?: number;      
  subject?: string;    
}

export interface SchoolChapter {
  id: string;
  title: string;
  lessons: SchoolLesson[];
}

export interface GradeCurriculumData {
  grade: number;
  subjects: Partial<Record<SchoolSubject, SchoolChapter[]>>;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  url: string;
  description: string;
  publishedAt?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  coverImage: string;
  amazonUrl: string;
}

export interface FairyTale {
  id: string;
  title: string;
  description: string;
  text?: string;
  duration: string;
  image: string;
  src: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  iconName: string;
  color: string;
  secondaryUrl?: string;
  isSecondary?: boolean;
  customIconUrl?: string;
}

export enum AppView {
  HOME = 'HOME',
  CITY_MAP = 'CITY_MAP',
  BOO_HOUSE = 'BOO_HOUSE',
  INFO_MENU = 'INFO_MENU',
  FAQ = 'FAQ',
  GUIDE = 'GUIDE',
  CONTACT = 'CONTACT',
  SERVICE_PAGE = 'SERVICE_PAGE',
  NEWSSTAND = 'NEWSSTAND',
  SCHOOL = 'SCHOOL',
  SCHOOL_FIRST_FLOOR = 'SCHOOL_FIRST_FLOOR',
  SCHOOL_SECOND_FLOOR = 'SCHOOL_SECOND_FLOOR',
  SCHOOL_GYM = 'SCHOOL_GYM',
  SCHOOL_GYM_BASKET = 'SCHOOL_GYM_BASKET',
  SCHOOL_GYM_SOCCER = 'SCHOOL_GYM_SOCCER',
  SCHOOL_GYM_TENNIS = 'SCHOOL_GYM_TENNIS',
  SCHOOL_GYM_GYMNASTICS = 'SCHOOL_GYM_GYMNASTICS',
  SCHOOL_FIRST_GRADE = 'SCHOOL_FIRST_GRADE',
  SCHOOL_SECOND_GRADE = 'SCHOOL_SECOND_GRADE',
  SCHOOL_THIRD_GRADE = 'SCHOOL_THIRD_GRADE',
  SCHOOL_FOURTH_GRADE = 'SCHOOL_FOURTH_GRADE',
  SCHOOL_FIFTH_GRADE = 'SCHOOL_FIFTH_GRADE',
  SCHOOL_DIARY = 'SCHOOL_DIARY',
  SCHOOL_ARCHIVE = 'SCHOOL_ARCHIVE',
  SCHOOL_DICTIONARY = 'SCHOOL_DICTIONARY',
  SCHOOL_MATH_EXERCISES = 'SCHOOL_MATH_EXERCISES',
  EXTRA_ARGUMENTS = 'EXTRA_ARGUMENTS',
  BOO_GARDEN = 'BOO_GARDEN',
  BOO_BEDROOM = 'BOO_BEDROOM',
  BOO_LIVING_ROOM = 'BOO_LIVING_ROOM',
  BOO_BATHROOM = 'BOO_BATHROOM',
  BOO_KITCHEN = 'BOO_KITCHEN',
  INTRO = 'INTRO', 
  VIDEOS = 'VIDEOS',
  BOOKS = 'BOOKS',
  BOOKS_LIST = 'BOOKS_LIST',
  AI_MAGIC = 'AI_MAGIC',
  MAGIC_TOWER_SUB = 'MAGIC_TOWER_SUB',
  MAGIC_TOWER_SUB_EXPLORE = 'MAGIC_TOWER_SUB_EXPLORE',
  MAGIC_TOWER_SUB_ENIGMAS = 'MAGIC_TOWER_SUB_ENIGMAS',
  MAGIC_TOWER_SUB_GAMES = 'MAGIC_TOWER_SUB_GAMES',
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
  SVEGLIA_BOO = 'SVEGLIA_BOO',
  STOPWATCH_GAME = 'STOPWATCH_GAME',
  TRAIN_JOURNEY = 'TRAIN_JOURNEY',
  RAINBOW_CITY = 'RAINBOW_CITY',
  GRAY_CITY = 'GRAY_CITY',
  MOUNTAIN_CITY = 'MOUNTAIN_CITY',
  LAKE_CITY = 'LAKE_CITY',
  LIBRARY_READ = 'LIBRARY_READ',
  LIBRARY_CARDS = 'LIBRARY_CARDS',
  LIBRARY_SCOPA = 'LIBRARY_SCOPA',
  LIBRARY_UNO = 'LIBRARY_UNO',
  LIBRARY_SOLITARIO = 'LIBRARY_SOLITARIO',
  PREMIUM_INFO = 'PREMIUM_INFO',
  VOCAL_FX = 'VOCAL_FX',
  EMOTIONAL_GARDEN = 'EMOTIONAL_GARDEN',
  TTS_STUDIO = 'TTS_STUDIO',
  CALENDAR = 'CALENDAR',
  ATELIER = 'ATELIER',
  SUB_ATELIER_OSCURO = 'SUB_ATELIER_OSCURO',
  SUB_FIUME_SOTTERRANEO = 'SUB_FIUME_SOTTERRANEO',
  SUB_ARTI_MAGICHE = 'SUB_ARTI_MAGICHE',
  SUB_OSCURITA = 'SUB_OSCURITA',
  SUB_OSCURITA_POTERE = 'SUB_OSCURITA_POTERE',
  SUB_OSCURITA_MOSTRO = 'SUB_OSCURITA_MOSTRO',
  SUB_OSCURITA_SUPERFICIE = 'SUB_OSCURITA_SUPERFICIE',
  MAGIC_HAT_ALBUM = 'MAGIC_HAT_ALBUM',
  RAINBOW_CITY_SCUOLA_MEDIA = 'RAINBOW_CITY_SCUOLA_MEDIA',
  RAINBOW_CITY_ZOO = 'RAINBOW_CITY_ZOO',
  RAINBOW_CITY_ARTE = 'RAINBOW_CITY_ARTE',
  RAINBOW_CITY_ALIMENTARI = 'RAINBOW_CITY_ALIMENTARI',
  RAINBOW_CITY_BURGER = 'RAINBOW_CITY_BURGER',
  RAINBOW_CITY_SCUOLA_MEDIA_1 = 'RAINBOW_CITY_SCUOLA_MEDIA_1',
  RAINBOW_CITY_SCUOLA_MEDIA_2 = 'RAINBOW_CITY_SCUOLA_MEDIA_2',
  RAINBOW_CITY_SCUOLA_MEDIA_3 = 'RAINBOW_CITY_SCUOLA_MEDIA_3',
  MEDIE_ITALIANO = 'MEDIE_ITALIANO',
  MEDIE_INGLESE = 'MEDIE_INGLESE',
  MEDIE_STORIA = 'MEDIE_STORIA',
  MEDIE_GEOGRAFIA = 'MEDIE_GEOGRAFIA',
  MEDIE_ARTE = 'MEDIE_ARTE',
  MEDIE_TECNOLOGIA = 'MEDIE_TECNOLOGIA',
  MEDIE_MATEMATICA = 'MEDIE_MATEMATICA',
  MEDIE_SCIENZE = 'MEDIE_SCIENZE',
  MEDIE_ESPERIMENTI = 'MEDIE_ESPERIMENTI',
  MEDIE_INFORMATICA = 'MEDIE_INFORMATICA',
  MEDIE_CIVICA = 'MEDIE_CIVICA',
  MEDIE_MOTORIA = 'MEDIE_MOTORIA'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface MemoryCard {
  id: number;
  iconName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface YouTubePlaylist {
  id: string;
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
  city?: string;
  province?: string;
}

export interface CommunityPost {
    id: string;
    type: 'TEXT' | 'IMAGE' | 'POLL';
    content: string;
    image?: string;
    date: string;
    likes: number;
    pollOptions?: { text: string; votes: number }[];
    totalVotes?: number;
}

export interface ColoringPage {
  id: string;
  title: string;
  thumbnail: string;
  pdfUrl: string;
}

export interface ColoringCategory {
  id: string;
  title: string;
  emoji: string;
  coverImage: string;
  color: string;
  items: ColoringPage[];
}

export interface AppNotification {
  id: string;
  message: string;
  link?: string;
  linkText?: string;
  active: boolean;
  image?: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  color: string;
}

export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Sticker {
    id: string;
    name: string;
    image: string;
    rarity: Rarity;
    description: string;
}

export interface AvatarConfig {
    charIndex: number;
    bgIndex: number;
}

export interface TokenTransaction {
    id: string;
    amount: number; // positive for gain, negative for spend
    description: string;
    date: string;
}

export enum LessonStatus {
  NON_LETTO = 'NON_LETTO',
  IN_LETTURA = 'IN_LETTURA',
  LETTO = 'LETTO'
}

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  scrollPercentage: number;
  lastUpdated: number;
  grade: number;
  subject: string;
  title: string;
}

export interface PlayerProgress {
    playerName?: string;
    avatar?: 'BOY' | 'GIRL';
    avatarConfig?: AvatarConfig;
    tokens: number;
    unlockedStickers: string[];
    hardModeUnlocked?: boolean;
    duplicates?: number;
    duplicateStickers?: string[];
    duplicatesVol2?: number;
    duplicateStickersVol2?: string[];
    currentAlbum?: number;
    completedQuizzes?: Record<string, boolean[]>;
    completedActivities?: Record<string, boolean[]>;
    // Nuovi campi Atelier
    equippedClothing: { tshirt?: string; hat?: string; glasses?: string; special?: string; special2?: string; special3?: string; special4?: string; special5?: string };
    purchasedClothing: string[];
    transactions?: TokenTransaction[];
    magicHatStickers?: string[];
    hasTrainPass?: boolean;
}

export interface SocialStats {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
}
