import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppView, SchoolSubject } from './types';
import { OFFICIAL_LOGO } from './constants';
import { requestWakeLock, releaseWakeLock } from './services/wakeLockService';
import ServicePage from './components/ServicePage';
import { addTokens } from './services/tokens';
import { preloadImages, preloadComponent } from './services/imagePreloader';

const Header = lazy(() => import('./components/Header'));
const HomePage = lazy(() => import('./components/HomePage'));

// Importazioni Lazy
const TTSStudio = lazy(() => import('./components/TTSStudio'));
const InstallPWA = lazy(() => import('./components/InstallPWA')); 
const BedtimeOverlay = lazy(() => import('./components/BedtimeOverlay'));
const IntroPage = lazy(() => import('./components/IntroPage'));
const VideoGallery = lazy(() => import('./components/VideoGallery'));
const BookShelf = lazy(() => import('./components/BookShelf'));
const BooksListView = lazy(() => import('./components/BooksListView'));
const SocialHub = lazy(() => import('./components/SocialHub'));
const MagicEye = lazy(() => import('./components/MagicEye'));
const MagicTowerSub = lazy(() => import('./components/MagicTowerSub'));
const SubEnigmasPage = lazy(() => import('./components/SubEnigmasPage'));
const ExploreSubPage = lazy(() => import('./components/ExploreSubPage'));
const PlayZone = lazy(() => import('./components/PlayZone'));
const FanArtGallery = lazy(() => import('./components/FanArtGallery'));
const DisclaimerPage = lazy(() => import('./components/DisclaimerPage'));
const TechInfoPage = lazy(() => import('./components/TechInfoPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ChatWithBoo = lazy(() => import('./components/ChatWithBoo'));
const CommunityFeed = lazy(() => import('./components/CommunityFeed'));
const SoundZone = lazy(() => import('./components/SoundZone'));
const FairyTales = lazy(() => import('./components/FairyTales'));
const ColoringSection = lazy(() => import('./components/ColoringSection'));
const SchoolSection = lazy(() => import('./components/SchoolSection'));
const SchoolFirstFloor = lazy(() => import('./components/SchoolFirstFloor'));
const SchoolSecondFloor = lazy(() => import('./components/SchoolSecondFloor'));
const SchoolGym = lazy(() => import('./components/SchoolGym'));
const SchoolGymBasket = lazy(() => import('./components/SchoolGymBasket'));
const SchoolGymSoccer = lazy(() => import('./components/SchoolGymSoccer'));
const SchoolGymTennis = lazy(() => import('./components/SchoolGymTennis'));
const SchoolGymGymnastics = lazy(() => import('./components/SchoolGymGymnastics'));
const SchoolFirstGrade = lazy(() => import('./components/SchoolFirstGrade'));
const SchoolSecondGrade = lazy(() => import('./components/SchoolSecondGrade'));
const SchoolThirdGrade = lazy(() => import('./components/SchoolThirdGrade'));
const SchoolFourthGrade = lazy(() => import('./components/SchoolFourthGrade'));
const SchoolFifthGrade = lazy(() => import('./components/SchoolFifthGrade'));
const SchoolDiaryView = lazy(() => import('./components/SchoolDiaryView'));
const SchoolArchive = lazy(() => import('./components/SchoolArchive'));
const SchoolDictionary = lazy(() => import('./components/DictionaryView'));
const SchoolMathExercises = lazy(() => import('./components/SchoolMathExercisesView'));
const CharactersPage = lazy(() => import('./components/CharactersPage'));
const CityMap = lazy(() => import('./components/CityMap'));
const NewCityMap = lazy(() => import('./components/NewCityMap')); 
const RoomView = lazy(() => import('./components/RoomView')); 
const InfoMenu = lazy(() => import('./components/InfoMenu'));
const SvegliaBoo = lazy(() => import('./components/SvegliaBoo'));
const StopwatchGame = lazy(() => import('./components/StopwatchGame'));
const FAQPage = lazy(() => import('./components/FAQPage'));
const GuidePage = lazy(() => import('./components/GuidePage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const Newsstand = lazy(() => import('./components/Newsstand'));
const LibraryReadView = lazy(() => import('./components/LibraryReadView'));
const LibraryCardsView = lazy(() => import('./components/LibraryCardsView'));
const LibraryScopa = lazy(() => import('./components/LibraryScopa'));
const LibraryUno = lazy(() => import('./components/LibraryUno'));
const LibrarySolitario = lazy(() => import('./components/LibrarySolitario'));
const TrainJourneyPlaceholder = lazy(() => import('./components/TrainJourneyPlaceholder'));
const PremiumInfoPage = lazy(() => import('./components/PremiumInfoPage'));
const VocalFxPage = lazy(() => import('./components/VocalFxPage'));
const EmotionalGarden = lazy(() => import('./components/EmotionalGarden'));
const CalendarView = lazy(() => import('./components/CalendarView'));
const AtelierView = lazy(() => import('./components/AtelierView'));
const SubAtelierOscuro = lazy(() => import('./components/SubAtelierOscuro'));
const SubFiumeSotterraneo = lazy(() => import('./components/SubFiumeSotterraneo'));
const SubExploreDetail = lazy(() => import('./components/SubExploreDetail'));
const SubOscurita = lazy(() => import('./components/SubOscurita'));
const SubOscuritaSuperficie = lazy(() => import('./components/SubOscuritaSuperficie'));
const SubMonsterBattle = lazy(() => import('./components/SubMonsterBattle'));

const RainbowCity = lazy(() => import('./components/RainbowCity'));
const RainbowCityScuolaMedia = lazy(() => import('./components/RainbowCityScuolaMedia'));
const RainbowCityClassroom = lazy(() => import('./components/RainbowCityClassroom'));
const MedieSubjectPage = lazy(() => import('./components/MedieSubjectPage'));
const PromotionInfoPage = lazy(() => import('./components/PromotionInfoPage'));
const GrayCity = lazy(() => import('./components/GrayCity'));
const MountainCity = lazy(() => import('./components/MountainCity'));
const LakeCity = lazy(() => import('./components/LakeCity'));

const KitchenRoom = lazy(() => import('./components/rooms/KitchenRoom'));
const LivingRoom = lazy(() => import('./components/rooms/LivingRoom'));
const BedroomRoom = lazy(() => import('./components/rooms/BedroomRoom'));
const BathroomRoom = lazy(() => import('./components/rooms/BathroomRoom'));
const GardenRoom = lazy(() => import('./components/rooms/GardenRoom'));

const CityDetailView = lazy(() => import('./components/CityDetailView'));

// Asset per i sotterranei
const SUB_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sotterraneitorremoacighca.webp';

const PageLoader = () => (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-boo-purple/90 backdrop-blur-sm">
        <img src={OFFICIAL_LOGO} alt="Loading" className="w-32 h-32 animate-spin-horizontal mb-4" />
        <span className="text-white font-black text-lg tracking-widest animate-pulse">CARICAMENTO...</span>
    </div>
);

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.HOME);
  const [premiumReturnView, setPremiumReturnView] = useState<AppView>(AppView.SCHOOL);
  const [lastClassroomView, setLastClassroomView] = useState<AppView>(AppView.RAINBOW_CITY_SCUOLA_MEDIA_1);
  const [subOscuritaInitialPhase, setSubOscuritaInitialPhase] = useState<'BLACK' | 'STATIC'>('BLACK');

  useEffect(() => {
    // 1. Precaricamento Asset Critici (Backgrounds)
    const criticalAssets = [
        'https://loneboo-images.s3.eu-south-1.amazonaws.com/defnewsdesd.webp', // Mappa Mobile
        'https://loneboo-images.s3.eu-south-1.amazonaws.com/mapdewsdsktp99i.webp', // Mappa Desktop
        'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvoprcogiochi44r4e3w.webp', // Parco
        'https://loneboo-images.s3.eu-south-1.amazonaws.com/scoolentrancearaindows33wa.webp', // Scuola
        'https://loneboo-images.s3.eu-south-1.amazonaws.com/bgdfre554de32.webp', // Casa Map
        'https://loneboo-images.s3.eu-south-1.amazonaws.com/newplaceplazavoboo8us.webp' // Piazza
    ];
    preloadImages(criticalAssets, 'HIGH');

    // 2. Precaricamento Componenti Principali
    const mainComponents = [
        () => import('./components/NewCityMap'),
        () => import('./components/PlayZone'),
        () => import('./components/SchoolSection'),
        () => import('./components/CommunityFeed'),
        () => import('./components/RoomView')
    ];
    mainComponents.forEach(preloadComponent);

    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam && Object.values(AppView).includes(viewParam as AppView)) {
      setView(viewParam as AppView);
    }
  }, []);

  const handleSetView = (view: AppView, skipAnim?: boolean) => {
    if (view === AppView.SUB_OSCURITA) {
        setSubOscuritaInitialPhase(skipAnim ? 'STATIC' : 'BLACK');
    }
    if (view === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 || view === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 || view === AppView.RAINBOW_CITY_SCUOLA_MEDIA_3) {
        setLastClassroomView(view);
    }
    if (view === AppView.PREMIUM_INFO) {
        setPremiumReturnView(currentView);
    }
    setView(view);
  };

  useEffect(() => {
    requestWakeLock();
    const handleFirstInteraction = () => {
      requestWakeLock();
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('mousedown', handleFirstInteraction);
    };
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('mousedown', handleFirstInteraction);
    return () => {
      releaseWakeLock();
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('mousedown', handleFirstInteraction);
    };
  }, []);

  return (
    <div className="min-h-screen font-sans flex flex-col relative w-full h-full">
        <Suspense fallback={null}>
            <Header currentView={currentView} setView={handleSetView} />
        </Suspense>
        
        <Suspense fallback={null}>
            <InstallPWA />
            <BedtimeOverlay />
        </Suspense>

        <main className="flex-1 relative w-full h-full">
            {currentView === AppView.SERVICE_PAGE && <ServicePage setView={handleSetView} />}

            <Suspense fallback={<PageLoader />}>
                {currentView === AppView.HOME && <HomePage setView={handleSetView} />}
                {currentView === AppView.TTS_STUDIO && <TTSStudio setView={handleSetView} />}
                {currentView === AppView.CITY_MAP && <NewCityMap setView={handleSetView} />}
                {currentView === AppView.BOO_HOUSE && <RoomView setView={handleSetView} />}
                {currentView === AppView.INTRO && <IntroPage setView={handleSetView} />}
                {currentView === AppView.PLAY && <PlayZone setView={handleSetView} />}
                {currentView === AppView.VIDEOS && <VideoGallery setView={handleSetView} />}
                {currentView === AppView.BOOKS && <BookShelf setView={handleSetView} />}
                {currentView === AppView.BOOKS_LIST && <BooksListView setView={handleSetView} />}
                {currentView === AppView.LIBRARY_READ && <LibraryReadView setView={handleSetView} />}
                {currentView === AppView.LIBRARY_CARDS && <LibraryCardsView setView={handleSetView} />}
                {currentView === AppView.LIBRARY_SCOPA && <LibraryScopa setView={handleSetView} />}
                {currentView === AppView.LIBRARY_UNO && <LibraryUno setView={handleSetView} />}
                {currentView === AppView.LIBRARY_SOLITARIO && <LibrarySolitario setView={handleSetView} />}
                {currentView === AppView.TALES && <FairyTales setView={handleSetView} />}
                {currentView === AppView.COLORING && <ColoringSection setView={handleSetView} />}
                {currentView === AppView.SCHOOL && <SchoolSection setView={handleSetView} />}
                {currentView === AppView.SCHOOL_FIRST_FLOOR && <SchoolFirstFloor setView={handleSetView} />}
                {currentView === AppView.SCHOOL_SECOND_FLOOR && <SchoolSecondFloor setView={handleSetView} />}
                {currentView === AppView.SCHOOL_GYM && <SchoolGym setView={handleSetView} />}
                {currentView === AppView.SCHOOL_GYM_BASKET && <SchoolGymBasket setView={handleSetView} />}
                {currentView === AppView.SCHOOL_GYM_SOCCER && <SchoolGymSoccer setView={handleSetView} />}
                {currentView === AppView.SCHOOL_GYM_TENNIS && <SchoolGymTennis setView={handleSetView} />}
                {currentView === AppView.SCHOOL_GYM_GYMNASTICS && <SchoolGymGymnastics setView={handleSetView} />}
                {currentView === AppView.SCHOOL_FIRST_GRADE && <SchoolFirstGrade setView={handleSetView} />}
                {currentView === AppView.SCHOOL_SECOND_GRADE && <SchoolSecondGrade setView={handleSetView} />}
                {currentView === AppView.SCHOOL_THIRD_GRADE && <SchoolThirdGrade setView={handleSetView} />}
                {currentView === AppView.SCHOOL_FOURTH_GRADE && <SchoolFourthGrade setView={handleSetView} />}
                {currentView === AppView.SCHOOL_FIFTH_GRADE && <SchoolFifthGrade setView={handleSetView} />}
                {currentView === AppView.SCHOOL_DIARY && <SchoolDiaryView setView={handleSetView} />}
                {currentView === AppView.SCHOOL_ARCHIVE && <SchoolArchive setView={handleSetView} />}
                {currentView === AppView.SCHOOL_DICTIONARY && <SchoolDictionary setView={handleSetView} />}
                {currentView === AppView.SCHOOL_MATH_EXERCISES && <SchoolMathExercises setView={handleSetView} />}
                {currentView === AppView.CHAT && <ChatWithBoo setView={handleSetView} />}
                {currentView === AppView.AI_MAGIC && <MagicEye setView={handleSetView} />}
                {currentView === AppView.MAGIC_TOWER_SUB && <MagicTowerSub setView={handleSetView} />}
                {currentView === AppView.MAGIC_TOWER_SUB_EXPLORE && <ExploreSubPage setView={handleSetView} />}
                {currentView === AppView.MAGIC_TOWER_SUB_ENIGMAS && <SubEnigmasPage setView={handleSetView} />}
                {currentView === AppView.MAGIC_TOWER_SUB_GAMES && <CityDetailView title="Giochi dei Sotterranei" setView={() => handleSetView(AppView.MAGIC_TOWER_SUB)} bgImage={SUB_BG} />}
                {currentView === AppView.SOUNDS && <SoundZone setView={handleSetView} />}
                {currentView === AppView.COMMUNITY && <CommunityFeed setView={handleSetView} />}
                {currentView === AppView.FANART && <FanArtGallery setView={handleSetView} />}
                {currentView === AppView.ABOUT && <AboutPage setView={handleSetView} />}
                {currentView === AppView.FAQ && <FAQPage setView={handleSetView} />}
                {currentView === AppView.GUIDE && <GuidePage setView={handleSetView} />}
                {currentView === AppView.CONTACT && <ContactPage setView={handleSetView} />}
                {currentView === AppView.DISCLAIMER && <DisclaimerPage setView={handleSetView} />}
                {currentView === AppView.TECH_INFO && <TechInfoPage setView={handleSetView} />}
                {currentView === AppView.CHARACTERS && <CharactersPage setView={handleSetView} />}
                {currentView === AppView.INFO_MENU && <InfoMenu setView={handleSetView} />}
                {currentView === AppView.NEWSSTAND && <Newsstand setView={handleSetView} />}
                {currentView === AppView.SVEGLIA_BOO && <SvegliaBoo setView={handleSetView} />}
                {currentView === AppView.STOPWATCH_GAME && <StopwatchGame setView={handleSetView} />}
                {currentView === AppView.BOO_KITCHEN && <KitchenRoom setView={handleSetView} />}
                {currentView === AppView.BOO_LIVING_ROOM && <LivingRoom setView={handleSetView} />}
                {currentView === AppView.BOO_BEDROOM && <BedroomRoom setView={handleSetView} />}
                {currentView === AppView.BOO_BATHROOM && <BathroomRoom setView={handleSetView} />}
                {currentView === AppView.BOO_GARDEN && <GardenRoom setView={handleSetView} />}
                {currentView === AppView.SOCIALS && <SocialHub setView={handleSetView} />}
                {currentView === AppView.TRAIN_JOURNEY && <TrainJourneyPlaceholder setView={handleSetView} />}
                {currentView === AppView.PREMIUM_INFO && <PremiumInfoPage setView={handleSetView} returnView={premiumReturnView} />}
                {currentView === AppView.VOCAL_FX && <VocalFxPage setView={handleSetView} />}
                {currentView === AppView.EMOTIONAL_GARDEN && <EmotionalGarden setView={handleSetView} />}
                {currentView === AppView.RAINBOW_CITY && <RainbowCity setView={handleSetView} />}
                {currentView === AppView.RAINBOW_CITY_SCUOLA_MEDIA && <RainbowCityScuolaMedia setView={handleSetView} />}
                {currentView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 && <RainbowCityClassroom title="1 Media" setView={handleSetView} />}
                {currentView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 && <RainbowCityClassroom title="2 Media" setView={handleSetView} />}
                {currentView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_3 && <RainbowCityClassroom title="3 Media" setView={handleSetView} />}
                {currentView === AppView.PROMOTION_INFO && <PromotionInfoPage setView={handleSetView} />}
                
                {/* Middle School Subject Pages */}
                {currentView === AppView.MEDIE_ITALIANO && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/italianopagemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.ITALIANO} />}
                {currentView === AppView.MEDIE_INGLESE && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/inglesepagemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.INGLESE} />}
                {currentView === AppView.MEDIE_STORIA && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/storiapagemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.STORIA} />}
                {currentView === AppView.MEDIE_GEOGRAFIA && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/geografiapagemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.GEOGRAFIA} />}
                {currentView === AppView.MEDIE_ARTE && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/artepagemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.ARTE} />}
                {currentView === AppView.MEDIE_TECNOLOGIA && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/tecnologiapagemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.TECNOLOGIA} />}
                {currentView === AppView.MEDIE_MATEMATICA && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/matematicapagemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.MATEMATICA} />}
                {currentView === AppView.MEDIE_SCIENZE && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/scienzepagemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.SCIENZE} />}
                {currentView === AppView.MEDIE_ESPERIMENTI && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/esperimentipagemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.ESPERIMENTI} />}
                {currentView === AppView.MEDIE_INFORMATICA && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/informaticapgemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.INFORMATICA} />}
                {currentView === AppView.MEDIE_CIVICA && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/civicapagemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.CIVICA} />}
                {currentView === AppView.MEDIE_MOTORIA && <MedieSubjectPage bgUrl="https://loneboo-images.s3.eu-south-1.amazonaws.com/motoriapagemedie.webp" setView={handleSetView} backView={lastClassroomView} grade={lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_1 ? 6 : lastClassroomView === AppView.RAINBOW_CITY_SCUOLA_MEDIA_2 ? 7 : 8} subject={SchoolSubject.MOTORIA} />}

                {currentView === AppView.GRAY_CITY && <GrayCity setView={handleSetView} />}
                {currentView === AppView.MOUNTAIN_CITY && <MountainCity setView={handleSetView} />}
                {currentView === AppView.LAKE_CITY && <LakeCity setView={handleSetView} />}
                {currentView === AppView.CALENDAR && <CalendarView setView={handleSetView} />}
                {currentView === AppView.ATELIER && <AtelierView setView={handleSetView} />}
                {currentView === AppView.SUB_ATELIER_OSCURO && <SubAtelierOscuro setView={handleSetView} />}
                {currentView === AppView.SUB_FIUME_SOTTERRANEO && <SubFiumeSotterraneo setView={handleSetView} />}
                {currentView === AppView.SUB_ARTI_MAGICHE && <SubExploreDetail title="Arti Magiche" setView={handleSetView} />}
                {currentView === AppView.SUB_OSCURITA && <SubOscurita setView={handleSetView} initialPhase={subOscuritaInitialPhase} />}
                {currentView === AppView.SUB_OSCURITA_POTERE && <SubExploreDetail title="Potere Magico" setView={handleSetView} backView={AppView.SUB_OSCURITA} />}
                {currentView === AppView.SUB_OSCURITA_MOSTRO && <SubMonsterBattle setView={handleSetView} />}
                {currentView === AppView.SUB_OSCURITA_SUPERFICIE && <SubOscuritaSuperficie setView={handleSetView} />}
                
                {/* Rainbow City Locations */}
                {currentView === AppView.RAINBOW_CITY_ZOO && <SubExploreDetail title="Zoo Fantastico" setView={handleSetView} backView={AppView.RAINBOW_CITY} />}
                {currentView === AppView.RAINBOW_CITY_ARTE && <SubExploreDetail title="Arte e Disegno" setView={handleSetView} backView={AppView.RAINBOW_CITY} />}
                {currentView === AppView.RAINBOW_CITY_ALIMENTARI && <SubExploreDetail title="Alimentari Arcobaleno" setView={handleSetView} backView={AppView.RAINBOW_CITY} />}
                {currentView === AppView.RAINBOW_CITY_BURGER && <SubExploreDetail title="Burger" setView={handleSetView} backView={AppView.RAINBOW_CITY} />}
            </Suspense>
        </main>
    </div>
  );
};

export default App;