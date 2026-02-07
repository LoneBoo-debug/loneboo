
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage'; 
import { AppView } from './types';
import { OFFICIAL_LOGO } from './constants';
import { requestWakeLock, releaseWakeLock } from './services/wakeLockService';
import ServicePage from './components/ServicePage';
import { addTokens } from './services/tokens';

const TTSStudio = lazy(() => import('./components/TTSStudio'));
const InstallPWA = lazy(() => import('./components/InstallPWA')); 
const BedtimeOverlay = lazy(() => import('./components/BedtimeOverlay'));
const IntroPage = lazy(() => import('./components/IntroPage'));
const VideoGallery = lazy(() => import('./components/VideoGallery'));
const BookShelf = lazy(() => import('./components/BookShelf'));
const BooksListView = lazy(() => import('./components/BooksListView'));
const SocialHub = lazy(() => import('./components/SocialHub'));
const MagicEye = lazy(() => import('./components/MagicEye'));
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

const RainbowCity = lazy(() => import('./components/RainbowCity'));
const GrayCity = lazy(() => import('./components/GrayCity'));
const MountainCity = lazy(() => import('./components/MountainCity'));
const LakeCity = lazy(() => import('./components/LakeCity'));

const KitchenRoom = lazy(() => import('./components/rooms/KitchenRoom'));
const LivingRoom = lazy(() => import('./components/rooms/LivingRoom'));
const BedroomRoom = lazy(() => import('./components/rooms/BedroomRoom'));
const BathroomRoom = lazy(() => import('./components/rooms/BathroomRoom'));
const GardenRoom = lazy(() => import('./components/rooms/GardenRoom'));

const PageLoader = () => (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-boo-purple/90 backdrop-blur-sm">
        <img src={OFFICIAL_LOGO} alt="Loading" className="w-32 h-32 animate-spin-horizontal mb-4" />
        <span className="text-white font-black text-lg tracking-widest animate-pulse">CARICAMENTO...</span>
    </div>
);

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.HOME);
  const [premiumReturnView, setPremiumReturnView] = useState<AppView>(AppView.SCHOOL);

  useEffect(() => {
    // Bonus gettoni per i test dell'Atelier
    const bonusKey = 'loneboo_test_bonus_300_v1';
    if (localStorage.getItem(bonusKey) !== 'true') {
        addTokens(300);
        localStorage.setItem(bonusKey, 'true');
    }

    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam && Object.values(AppView).includes(viewParam as AppView)) {
      setView(viewParam as AppView);
    }
  }, []);

  const handleSetView = (view: AppView) => {
    setView(view);
  };

  useEffect(() => {
    // Richiesta Wake Lock iniziale
    requestWakeLock();

    // I browser spesso bloccano il Wake Lock se non c'è stata un'interazione.
    // Lo richiediamo nuovamente al primo tocco o click dell'utente.
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
        <Header currentView={currentView} setView={handleSetView} />
        
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
                {currentView === AppView.CHAT && <ChatWithBoo setView={handleSetView} />}
                {currentView === AppView.AI_MAGIC && <MagicEye setView={handleSetView} />}
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
                {currentView === AppView.GRAY_CITY && <GrayCity setView={handleSetView} />}
                {currentView === AppView.MOUNTAIN_CITY && <MountainCity setView={handleSetView} />}
                {currentView === AppView.LAKE_CITY && <LakeCity setView={handleSetView} />}
                {currentView === AppView.CALENDAR && <CalendarView setView={handleSetView} />}
                {currentView === AppView.ATELIER && <AtelierView setView={handleSetView} />}
            </Suspense>
        </main>
    </div>
  );
};

export default App;
