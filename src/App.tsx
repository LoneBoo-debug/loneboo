
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage'; 
import InstallPWA from './components/InstallPWA'; 
import { AppView } from './types';
import { Smartphone, AlertTriangle, RefreshCw } from 'lucide-react'; 
import { OFFICIAL_LOGO } from './constants';

// --- LAZY LOADING COMPONENTS ---
const IntroPage = lazy(() => import('./components/IntroPage'));
const VideoGallery = lazy(() => import('./components/VideoGallery'));
const BookShelf = lazy(() => import('./components/BookShelf'));
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
const BooHouse = lazy(() => import('./components/BooHouse')); 
const RoomView = lazy(() => import('./components/RoomView')); 
const InfoMenu = lazy(() => import('./components/InfoMenu'));
const SvegliaBoo = lazy(() => import('./components/SvegliaBoo'));
const FAQPage = lazy(() => import('./components/FAQPage'));
const GuidePage = lazy(() => import('./components/GuidePage'));
const ServicePage = lazy(() => import('./components/ServicePage'));

// --- SEO METADATA ---
const SEO_METADATA: Record<AppView, { title: string; description: string }> = {
    [AppView.HOME]: { title: "Lone Boo World: Giochi, Favole e Musica 👻", description: "L'app ufficiale di Lone Boo! Un mondo sicuro di giochi educativi, video e magia." },
    [AppView.CITY_MAP]: { title: "Città Colorata 🗺️", description: "Esplora la città magica di Lone Boo." },
    [AppView.BOO_HOUSE]: { title: "Casa di Boo 🏠", description: "Entra nel rifugio segreto del fantasmino." },
    [AppView.BOO_GARDEN]: { title: "Giardino Magico 🌳", description: "Gioca all'aperto con Boo." },
    [AppView.BOO_BEDROOM]: { title: "Cameretta 🛌", description: "Scopri i segreti della stanza di Boo." },
    [AppView.BOO_LIVING_ROOM]: { title: "Salotto 🛋️", description: "Rilassati e guarda i cartoni." },
    [AppView.BOO_BATHROOM]: { title: "Bagno 🛁", description: "Lavarsi è divertente!" },
    [AppView.BOO_KITCHEN]: { title: "Cucina 🍳", description: "Cosa bolle in pentola?" },
    [AppView.INTRO]: { title: "Ciao da Lone Boo! 👋", description: "Piacere di conoscerti!" },
    [AppView.VIDEOS]: { title: "Cinema Boo 🎬", description: "Video, canzoni e cartoni animati." },
    [AppView.BOOKS]: { title: "Biblioteca 📚", description: "Libri e storie da leggere." },
    [AppView.AI_MAGIC]: { title: "Torre Magica 🔮", description: "Giochi magici con l'Intelligenza Artificiale." },
    [AppView.SOUNDS]: { title: "Discoteca 🎧", description: "Suona e balla con noi." },
    [AppView.TALES]: { title: "Bosco delle Fiabe 🌲", description: "Ascolta le favole della buonanotte." },
    [AppView.COLORING]: { title: "Accademia Arte 🎨", description: "Disegni da colorare e stampare." },
    [AppView.SOCIALS]: { title: "Stazione Social 🚂", description: "Seguici su tutti i canali." },
    [AppView.COMMUNITY]: { title: "La Piazza 📰", description: "Novità e sondaggi per i fan." },
    [AppView.CHAT]: { title: "Info Point 💬", description: "Chatta con Lone Boo!" },
    [AppView.PLAY]: { title: "Parco Giochi 🎡", description: "Minigiochi educativi e divertenti." },
    [AppView.FANART]: { title: "Museo Fan Art 🖼️", description: "I disegni dei bambini in mostra." },
    [AppView.DISCLAIMER]: { title: "Note Legali", description: "Privacy e sicurezza." },
    [AppView.TECH_INFO]: { title: "Info Tecniche", description: "Come funziona l'app." },
    [AppView.ABOUT]: { title: "Chi Siamo ❤️", description: "La storia di Lone Boo." },
    [AppView.CHARACTERS]: { title: "Amici 👥", description: "Conosci tutti i personaggi." },
    [AppView.INFO_MENU]: { title: "Centro Info ℹ️", description: "Aiuto e contatti." },
    [AppView.SVEGLIA_BOO]: { title: "Sveglia Boo ⏰", description: "Buongiorno con allegria!" },
    [AppView.FAQ]: { title: "FAQ", description: "Domande frequenti." },
    [AppView.GUIDE]: { title: "Guida App", description: "Come usare Lone Boo World." },
    [AppView.SERVICE_PAGE]: { title: "Service Tools 🔧", description: "Strumenti di Manutenzione e Migrazione Assets." }
};

const PageLoader = () => (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
        <img 
            src={OFFICIAL_LOGO} 
            alt="Caricamento..." 
            className="w-32 h-32 object-contain animate-spin-horizontal mb-4" 
        />
        <span className="text-gray-500 font-bold text-lg tracking-widest animate-pulse">
            STO CARICANDO...
        </span>
    </div>
);

// --- ERROR BOUNDARY ---
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any) { console.error("Crash:", error); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 p-6 text-center z-50">
            <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
            <h2 className="text-3xl font-black text-gray-800 mb-2">Ops!</h2>
            <button onClick={() => window.location.reload()} className="bg-boo-purple text-white px-8 py-3 rounded-full font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"><RefreshCw size={20} /> RICARICA APP</button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- SMART PRELOADING STRATEGY ---
  useEffect(() => {
      const requestIdleCallback = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 1));

      const preloadComponents = () => {
          setTimeout(() => {
              import('./components/CityMap');
              import('./components/BooHouse');
              
              setTimeout(() => {
                  import('./components/PlayZone');
                  import('./components/VideoGallery');
              }, 2000);

              setTimeout(() => {
                  import('./components/ChatWithBoo');
                  import('./components/SocialHub');
              }, 5000);
          }, 3500);
      };

      requestIdleCallback(preloadComponents);
  }, []);

  // --- NAVIGATION HANDLING ---
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

  // SEO Update
  useEffect(() => {
      window.scrollTo(0, 0);
      const metadata = SEO_METADATA[currentView] || SEO_METADATA[AppView.HOME];
      document.title = metadata.title;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', metadata.description);
      
      const metaRobots = document.querySelector('meta[name="robots"]');
      if (metaRobots) {
          metaRobots.setAttribute('content', (currentView === AppView.SVEGLIA_BOO || currentView === AppView.SERVICE_PAGE) ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
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

  const isFullScreenView = [AppView.CITY_MAP, AppView.BOO_HOUSE, AppView.FANART, AppView.SOCIALS, AppView.SOUNDS, AppView.BOOKS, AppView.TALES, AppView.COLORING, AppView.PLAY, AppView.COMMUNITY, AppView.CHAT, AppView.AI_MAGIC, AppView.SVEGLIA_BOO].includes(currentView);
  const isRoomView = [AppView.BOO_GARDEN, AppView.BOO_BEDROOM, AppView.BOO_LIVING_ROOM, AppView.BOO_BATHROOM, AppView.BOO_KITCHEN].includes(currentView);

  return (
    <ErrorBoundary>
        <div className="min-h-screen font-sans pb-0 overflow-x-hidden flex flex-col">
        
        {isTransitioning && <div className="fixed inset-0 z-[9999] cursor-wait bg-transparent"></div>}

        <div id="orientation-lock">
            <Smartphone size={64} className="animate-spin-slow mb-4" />
            <h2 className="text-2xl font-black mb-2 uppercase">Ruota il telefono!</h2>
            <p className="font-bold px-8">Lone Boo funziona meglio in verticale 📱</p>
        </div>

        {/* Hide Header on Service Page */}
        {currentView !== AppView.SERVICE_PAGE && <Header currentView={currentView} setView={setView} />}
        
        <InstallPWA />

        <main className={`flex-1 ${isFullScreenView || isRoomView ? 'pt-[68px] md:pt-[106px] h-screen overflow-hidden' : (currentView === AppView.SERVICE_PAGE ? 'pt-0' : 'pt-[74px] md:pt-[116px]')}`}>
            {currentView === AppView.HOME && <HomePage setView={setView} />}

            <Suspense fallback={<PageLoader />}>
                {currentView === AppView.CITY_MAP && <CityMap setView={setView} />}
                {currentView === AppView.BOO_HOUSE && <BooHouse setView={setView} />}
                {currentView === AppView.INTRO && <IntroPage setView={setView} />}
                {isRoomView && <RoomView roomType={currentView} setView={setView} />}
                {currentView === AppView.VIDEOS && <VideoGallery />}
                {currentView === AppView.BOOKS && <BookShelf />}
                {currentView === AppView.SOUNDS && <SoundZone />}
                {currentView === AppView.TALES && <FairyTales />}
                {currentView === AppView.COLORING && <ColoringSection />}
                {currentView === AppView.SOCIALS && <SocialHub setView={setView} />}
                {currentView === AppView.COMMUNITY && <CommunityFeed setView={setView} />}
                {currentView === AppView.CHAT && <ChatWithBoo setView={setView} />}
                {currentView === AppView.AI_MAGIC && <MagicEye />}
                {currentView === AppView.PLAY && <PlayZone />}
                {currentView === AppView.FANART && <FanArtGallery />}
                {currentView === AppView.INFO_MENU && <InfoMenu setView={setView} />}
                {currentView === AppView.DISCLAIMER && <DisclaimerPage setView={setView} />}
                {currentView === AppView.TECH_INFO && <TechInfoPage setView={setView} />}
                {currentView === AppView.ABOUT && <AboutPage setView={setView} />}
                {currentView === AppView.CHARACTERS && <CharactersPage setView={setView} />}
                {currentView === AppView.SVEGLIA_BOO && <SvegliaBoo setView={setView} />}
                {currentView === AppView.FAQ && <FAQPage setView={setView} />}
                {currentView === AppView.GUIDE && <GuidePage setView={setView} />}
                {currentView === AppView.SERVICE_PAGE && <ServicePage setView={setView} />}
            </Suspense>
        </main>

        {!isFullScreenView && !isRoomView && currentView !== AppView.INFO_MENU && currentView !== AppView.GUIDE && currentView !== AppView.SERVICE_PAGE && (
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
