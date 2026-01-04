
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage'; 
import { AppView } from './types';
import { AlertTriangle, RefreshCw, Construction, ArrowLeft } from 'lucide-react'; 
import { OFFICIAL_LOGO } from './constants';

// --- LAZY LOADING COMPONENTS ---
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
const ServicePage = lazy(() => import('./components/ServicePage'));
const TrainJourneyPlaceholder = lazy(() => import('./components/TrainJourneyPlaceholder'));
const Newsstand = lazy(() => import('./components/Newsstand'));
const LibraryCardsView = lazy(() => import('./components/LibraryCardsView'));
const LibraryGamePlaceholder = lazy(() => import('./components/LibraryGamePlaceholder'));
const LibraryReadView = lazy(() => import('./components/LibraryReadView'));

// NUOVI COMPONENTI GIOCO CARTE
const LibraryScopa = lazy(() => import('./components/LibraryScopa'));
const LibraryUno = lazy(() => import('./components/LibraryUno'));
const LibrarySolitario = lazy(() => import('./components/LibrarySolitario'));

// STANZE INDIVIDUALI
const KitchenRoom = lazy(() => import('./components/rooms/KitchenRoom'));
const LivingRoom = lazy(() => import('./components/rooms/LivingRoom'));
const BedroomRoom = lazy(() => import('./components/rooms/BedroomRoom'));
const BathroomRoom = lazy(() => import('./components/rooms/BathroomRoom'));
const GardenRoom = lazy(() => import('./components/rooms/GardenRoom'));

// --- SEO METADATA POTENZIATA ---
const SEO_METADATA: Record<string, { title: string; description: string }> = {
    [AppView.HOME]: { 
        title: "Lone Boo World: Giochi e Video per Bambini 👻", 
        description: "Benvenuti nel mondo di Lone Boo! Il simpatico fantasmino guida i bambini tra canzoni, giochi educativi e favole in un ambiente sicuro." 
    },
    [AppView.CITY_MAP]: { 
        title: "Esplora Città Colorata di Lone Boo 🗺️", 
        description: "Scopri la mappa magica di Lone Boo. Entra nel cinema, nel parco giochi o nella torre magica per tante avventure educative." 
    },
    [AppView.PLAY]: { 
        title: "Giochi Educativi per Bambini: Parco Giochi Lone Boo 🎡", 
        description: "Divertiti con i minigiochi di Lone Boo! Quiz, memory, matematica e arcade sicuri per allenare la mente dei più piccoli." 
    },
    [AppView.VIDEOS]: { 
        title: "Cartoni Animati e Video per Bambini: Cinema Lone Boo 🍿", 
        description: "Guarda i cartoni animati originali e balla con i video musicali di Lone Boo direttamente nell'app." 
    },
    [AppView.COLORING]: { 
        title: "Disegni da Colorare per Bambini da Stampare 🎨", 
        description: "Scarica e stampa i disegni gratuiti di Lone Boo e dei suoi amici. Attività creativa per bambini di tutte le età." 
    },
    [AppView.TALES]: { 
        title: "Favole Audio e Storie della Buonanotte per Bambini 🌲", 
        description: "Ascolta le favole narrate nel Bosco delle Fiabe. Storie rilassanti e magiche ideali per il momento della nanna." 
    },
    [AppView.CHAT]: { 
        title: "Chatta con Lone Boo: Info Point Assistente 💬", 
        description: "Hai domande su Città Colorata? Chiedi a Maragno o a Lone Boo nell'assistente interattivo sicuro per bambini." 
    },
    [AppView.SOUNDS]: { 
        title: "Strumenti Musicali e Suoni per Bambini: Discoteca Boo 🎧", 
        description: "Suona il piano, la batteria e crea musica con gli abitanti di Città Colorata nella sezione audio interattiva." 
    },
    [AppView.ABOUT]: { 
        title: "Chi è Lone Boo? Scopri il Brand Educativo 👻", 
        description: "Scopri la missione di Lone Boo: offrire un ecosistema digitale sicuro con video, libri e giochi per la crescita dei bambini." 
    }
};

const PageLoader = () => (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
        <img 
            src={OFFICIAL_LOGO} 
            alt="Caricamento..." 
            className="w-32 h-32 object-contain animate-spin-horizontal mb-4" 
        />
        <span className="text-gray-500 font-bold text-lg tracking-widest animate-pulse uppercase">
            STO CARICANDO...
        </span>
    </div>
);

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any) { console.error("Crash App:", error); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white p-6 text-center z-[9999]">
            <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
            <h2 className="text-3xl font-black text-gray-800 mb-2 uppercase">Ops! C'è un problema</h2>
            <p className="text-gray-500 font-bold mb-8 text-lg">L'app ha avuto un piccolo singhiozzo magico...</p>
            <button onClick={() => window.location.reload()} className="bg-boo-purple text-white px-8 py-4 rounded-full font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"><RefreshCw size={20} /> RICARICA PAGINA</button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam && Object.values(AppView).includes(viewParam as AppView)) {
      setCurrentView(viewParam as AppView);
    }

    const handlePopState = () => {
        const currentParams = new URLSearchParams(window.location.search);
        const currentViewParam = currentParams.get('view');
        setCurrentView(currentViewParam && Object.values(AppView).includes(currentViewParam as AppView) ? currentViewParam as AppView : AppView.HOME);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      const metadata = SEO_METADATA[currentView] || SEO_METADATA[AppView.HOME];
      if (metadata) {
          document.title = metadata.title;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', metadata.description);
          
          // Aggiorna URL canonico
          const canonical = document.getElementById('canonical-link');
          if (canonical) {
              const url = currentView === AppView.HOME ? 'https://loneboo.online/' : `https://loneboo.online/?view=${currentView}`;
              canonical.setAttribute('href', url);
          }
      }
  }, [currentView]);

  const setView = (view: AppView) => {
      if (view === currentView || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 50); 
      setCurrentView(view);
      const url = view === AppView.HOME ? window.location.pathname : `${window.location.pathname}?view=${view}`;
      window.history.pushState({}, '', url);
  };

  return (
    <ErrorBoundary>
        <div className="min-h-screen font-sans pb-0 overflow-x-hidden flex flex-col">
        
        {isTransitioning && <div className="fixed inset-0 z-[9999] cursor-wait bg-transparent"></div>}

        {currentView !== AppView.SERVICE_PAGE && <Header currentView={currentView} setView={setView} />}
        
        <Suspense fallback={null}>
            <InstallPWA />
            <BedtimeOverlay />
        </Suspense>

        <main className="flex-1 relative">
            <Suspense fallback={<PageLoader />}>
                {currentView === AppView.HOME && <HomePage setView={setView} />}
                {currentView === AppView.CITY_MAP && <CityMap setView={setView} />}
                {currentView === AppView.TALES && <FairyTales setView={setView} />}
                {currentView === AppView.BOO_HOUSE && <RoomView setView={setView} />}
                {currentView === AppView.INTRO && (
                    <div className="pt-[64px] md:pt-[96px]">
                        <IntroPage setView={setView} />
                    </div>
                )}
                {currentView === AppView.BOO_KITCHEN && <KitchenRoom setView={setView} />}
                {currentView === AppView.BOO_LIVING_ROOM && <LivingRoom setView={setView} />}
                {currentView === AppView.BOO_BEDROOM && <BedroomRoom setView={setView} />}
                {currentView === AppView.BOO_BATHROOM && <BathroomRoom setView={setView} />}
                {currentView === AppView.BOO_GARDEN && <GardenRoom setView={setView} />}
                {currentView === AppView.VIDEOS && <VideoGallery />}
                {currentView === AppView.BOOKS && <BookShelf setView={setView} />}
                {currentView === AppView.BOOKS_LIST && <BooksListView setView={setView} />}
                {currentView === AppView.SOUNDS && <SoundZone />}
                {currentView === AppView.COLORING && <ColoringSection setView={setView} />}
                {currentView === AppView.SOCIALS && <SocialHub setView={setView} />}
                {currentView === AppView.COMMUNITY && <CommunityFeed setView={setView} />}
                {currentView === AppView.CHAT && <ChatWithBoo setView={setView} />}
                {currentView === AppView.AI_MAGIC && <MagicEye />}
                {currentView === AppView.PLAY && <PlayZone setView={setView} />}
                {currentView === AppView.FANART && <FanArtGallery setView={setView} />}
                {currentView === AppView.INFO_MENU && <InfoMenu setView={setView} />}
                {currentView === AppView.DISCLAIMER && <DisclaimerPage setView={setView} />}
                {currentView === AppView.TECH_INFO && <TechInfoPage setView={setView} />}
                {currentView === AppView.ABOUT && <AboutPage setView={setView} />}
                {currentView === AppView.CHARACTERS && <CharactersPage setView={setView} />}
                {currentView === AppView.SVEGLIA_BOO && <SvegliaBoo setView={setView} />}
                {currentView === AppView.FAQ && <FAQPage setView={setView} />}
                {currentView === AppView.GUIDE && <GuidePage setView={setView} />}
                {currentView === AppView.CONTACT && <ContactPage setView={setView} />}
                {currentView === AppView.SERVICE_PAGE && <ServicePage setView={setView} />}
                {currentView === AppView.TRAIN_JOURNEY && <TrainJourneyPlaceholder setView={setView} />}
                {currentView === AppView.NEWSSTAND && <Newsstand setView={setView} />}
                {currentView === AppView.LIBRARY_READ && <LibraryReadView setView={setView} />}
                {currentView === AppView.LIBRARY_CARDS && <LibraryCardsView setView={setView} />}
                {currentView === AppView.LIBRARY_SCOPA && <LibraryScopa setView={setView} />}
                {currentView === AppView.LIBRARY_UNO && <LibraryUno setView={setView} />}
                {currentView === AppView.LIBRARY_SOLITARIO && <LibrarySolitario setView={setView} />}
            </Suspense>
        </main>

        {(currentView === AppView.HOME || currentView === AppView.INTRO || currentView === AppView.ABOUT) && (
            <footer className="text-center p-8 mt-12 text-white/80 font-bold">
                <div className="flex flex-col items-center gap-1">
                    <p className="whitespace-nowrap text-sm">© 2025 LoneBoo.online.</p>
                    <button onClick={() => setView(AppView.INFO_MENU)} className="underline hover:text-white bg-transparent border-none cursor-pointer text-sm">
                        Info & Contatti
                    </button>
                </div>
            </footer>
        )}
        </div>
    </ErrorBoundary>
  );
};

export default App;
