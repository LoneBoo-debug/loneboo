
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage'; 
import { AppView } from './types';
import { OFFICIAL_LOGO } from './constants';

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
const CharactersPage = lazy(() => import('./components/CharactersPage'));
const CityMap = lazy(() => import('./components/CityMap'));
const RoomView = lazy(() => import('./components/RoomView')); 
const InfoMenu = lazy(() => import('./components/InfoMenu'));
const SvegliaBoo = lazy(() => import('./components/SvegliaBoo'));
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

const KitchenRoom = lazy(() => import('./components/rooms/KitchenRoom'));
const LivingRoom = lazy(() => import('./components/rooms/LivingRoom'));
const BedroomRoom = lazy(() => import('./components/rooms/BedroomRoom'));
const BathroomRoom = lazy(() => import('./components/rooms/BathroomRoom'));
const GardenRoom = lazy(() => import('./components/rooms/GardenRoom'));

const SEO_DATA: Record<string, { title: string, desc: string }> = {
  [AppView.HOME]: { title: "Lone Boo World - Home", desc: "Benvenuti nel mondo magico di Lone Boo." },
  [AppView.PLAY]: { title: "Giochi per Bambini - Lone Boo", desc: "Minigiochi divertenti e sicuri per allenare la mente." },
  [AppView.COLORING]: { title: "Disegni da Colorare - Lone Boo", desc: "Scarica e stampa i disegni gratuiti di Lone Boo." },
  [AppView.VIDEOS]: { title: "Cinema Lone Boo - Video e Cartoni", desc: "Guarda i video musicali e i cartoni animati di Lone Boo." },
  [AppView.CHAT]: { title: "Info Point - Chatta con Lone Boo", desc: "Parla con l'assistente magico di Città Colorata." },
  [AppView.TALES]: { title: "Favole della Buonanotte - Lone Boo", desc: "Ascolta le storie audio narrate da Fata Flora." },
};

const PageLoader = () => (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-boo-purple/90 backdrop-blur-sm">
        <img src={OFFICIAL_LOGO} alt="Loading" className="w-32 h-32 animate-spin-horizontal mb-4" />
        <span className="text-white font-black text-lg tracking-widest animate-pulse">CARICAMENTO...</span>
    </div>
);

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.HOME);

  useEffect(() => {
    const meta = SEO_DATA[currentView] || SEO_DATA[AppView.HOME];
    document.title = meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.desc);
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="min-h-screen font-sans flex flex-col relative overflow-x-hidden">
        <Header currentView={currentView} setView={setView} />
        
        <Suspense fallback={null}>
            <InstallPWA />
            <BedtimeOverlay />
        </Suspense>

        <main className="flex-1 relative">
            <Suspense fallback={<PageLoader />}>
                {currentView === AppView.HOME && <HomePage setView={setView} />}
                {currentView === AppView.CITY_MAP && <CityMap setView={setView} />}
                {currentView === AppView.BOO_HOUSE && <RoomView setView={setView} />}
                {currentView === AppView.INTRO && <IntroPage setView={setView} />}
                {currentView === AppView.PLAY && <PlayZone setView={setView} />}
                {currentView === AppView.VIDEOS && <VideoGallery />}
                {currentView === AppView.BOOKS && <BookShelf setView={setView} />}
                {currentView === AppView.BOOKS_LIST && <BooksListView setView={setView} />}
                {currentView === AppView.LIBRARY_READ && <LibraryReadView setView={setView} />}
                {currentView === AppView.LIBRARY_CARDS && <LibraryCardsView setView={setView} />}
                {currentView === AppView.LIBRARY_SCOPA && <LibraryScopa setView={setView} />}
                {currentView === AppView.LIBRARY_UNO && <LibraryUno setView={setView} />}
                {currentView === AppView.LIBRARY_SOLITARIO && <LibrarySolitario setView={setView} />}
                {currentView === AppView.TALES && <FairyTales setView={setView} />}
                {currentView === AppView.COLORING && <ColoringSection setView={setView} />}
                {currentView === AppView.CHAT && <ChatWithBoo setView={setView} />}
                {currentView === AppView.AI_MAGIC && <MagicEye />}
                {currentView === AppView.SOUNDS && <SoundZone />}
                {currentView === AppView.COMMUNITY && <CommunityFeed setView={setView} />}
                {currentView === AppView.FANART && <FanArtGallery setView={setView} />}
                {currentView === AppView.ABOUT && <AboutPage setView={setView} />}
                {currentView === AppView.FAQ && <FAQPage setView={setView} />}
                {currentView === AppView.GUIDE && <GuidePage setView={setView} />}
                {currentView === AppView.CONTACT && <ContactPage setView={setView} />}
                {currentView === AppView.DISCLAIMER && <DisclaimerPage setView={setView} />}
                {currentView === AppView.TECH_INFO && <TechInfoPage setView={setView} />}
                {currentView === AppView.CHARACTERS && <CharactersPage setView={setView} />}
                {currentView === AppView.INFO_MENU && <InfoMenu setView={setView} />}
                {currentView === AppView.NEWSSTAND && <Newsstand setView={setView} />}
                {currentView === AppView.SVEGLIA_BOO && <SvegliaBoo setView={setView} />}
                {currentView === AppView.BOO_KITCHEN && <KitchenRoom setView={setView} />}
                {currentView === AppView.BOO_LIVING_ROOM && <LivingRoom setView={setView} />}
                {currentView === AppView.BOO_BEDROOM && <BedroomRoom setView={setView} />}
                {currentView === AppView.BOO_BATHROOM && <BathroomRoom setView={setView} />}
                {currentView === AppView.BOO_GARDEN && <GardenRoom setView={setView} />}
                {currentView === AppView.SOCIALS && <SocialHub setView={setView} />}
                {currentView === AppView.TRAIN_JOURNEY && <TrainJourneyPlaceholder setView={setView} />}
            </Suspense>
        </main>

        {(currentView === AppView.HOME || currentView === AppView.ABOUT) && (
            <footer className="text-center p-8 text-white/60 font-bold bg-black/10 shrink-0">
                <p className="text-sm">© 2025 Lone Boo World - Progetto Educativo Sicuro</p>
                <button onClick={() => setView(AppView.DISCLAIMER)} className="underline text-xs mt-2 block mx-auto">Privacy & Note Legali</button>
            </footer>
        )}
    </div>
  );
};

export default App;
