
import React, { useState, useEffect, useRef } from 'react';
import { CHANNEL_LOGO } from '../constants';
import { CommunityPost, AppView, AppNotification } from '../types';
import { getCommunityPosts, getAllNotifications } from '../services/data';
import { Loader2, ExternalLink, Heart, X, MessageSquare, Newspaper, Bell, Megaphone } from 'lucide-react';
import RobotHint from './RobotHint';

const PIAZZA_BG_MOBILE = 'https://i.postimg.cc/28kfHpKB/piazzaxxx.jpg';
const PIAZZA_BG_DESKTOP = 'https://i.postimg.cc/8Psrn96x/piazza169.jpg';
const FACEBOOK_GROUP_URL = 'https://www.facebook.com/groups/2648776785470151/';

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

// ZONE MOBILE (INVARIATE)
const ZONES_MOBILE: ZoneConfig[] = [
  {
    "id": "BOARD_FEED",
    "points": [
      { "x": 38.38, "y": 10.77 },
      { "x": 38.65, "y": 21.36 },
      { "x": 60.77, "y": 21.54 },
      { "x": 61.57, "y": 10.59 }
    ]
  },
  {
    "id": "FACEBOOK_LINK",
    "points": [
      { "x": 3.73, "y": 54.2 },
      { "x": 3.73, "y": 66.22 },
      { "x": 9.86, "y": 68.92 },
      { "x": 16.52, "y": 65.51 },
      { "x": 13.33, "y": 51.87 }
    ]
  },
  {
    "id": "MUSEUM_LINK",
    "points": [
      { "x": 82.36, "y": 56.53 },
      { "x": 78.89, "y": 67.66 },
      { "x": 91.68, "y": 70.71 },
      { "x": 94.35, "y": 57.43 }
    ]
  },
  {
    "id": "BOO_MEGAPHONE",
    "points": [
      { "x": 44.24, "y": 30.15 },
      { "x": 41.58, "y": 44.33 },
      { "x": 54.37, "y": 44.87 },
      { "x": 54.9, "y": 30.69 }
    ]
  }
];

// ZONE DESKTOP (DEFINITIVE)
const ZONES_DESKTOP: ZoneConfig[] = [
  {
    "id": "BOARD_FEED",
    "points": [
      { "x": 44.48, "y": 6.82 },
      { "x": 44.59, "y": 17.84 },
      { "x": 55.2, "y": 18.1 },
      { "x": 55.65, "y": 6.29 }
    ]
  },
  {
    "id": "FACEBOOK_LINK",
    "points": [
      { "x": 27.66, "y": 51.41 },
      { "x": 27.77, "y": 65.83 },
      { "x": 34.32, "y": 66.36 },
      { "x": 33.98, "y": 50.36 }
    ]
  },
  {
    "id": "MUSEUM_LINK",
    "points": [
      { "x": 64.91, "y": 55.08 },
      { "x": 64.12, "y": 66.09 },
      { "x": 69.54, "y": 68.45 },
      { "x": 70.33, "y": 57.18 }
    ]
  },
  {
    "id": "BOO_MEGAPHONE",
    "points": [
      { "x": 47.19, "y": 27.8 },
      { "x": 46.96, "y": 42.49 },
      { "x": 52.16, "y": 43.28 },
      { "x": 52.95, "y": 28.59 }
    ]
  }
];

const MOCK_POSTS: CommunityPost[] = [
    {
        id: 'mock-1',
        type: 'POLL',
        content: "👻 Sondaggio Spettrale! Quale video volete vedere la prossima settimana?",
        date: "2 ore fa",
        likes: 124,
        totalVotes: 540,
        pollOptions: [
            { text: "Nuova Canzone sui Colori 🎨", votes: 65 },
            { text: "Gameplay Minecraft Horror 🧟", votes: 25 },
            { text: "Storia di Paura 📖", votes: 10 }
        ]
    },
    {
        id: 'mock-2',
        type: 'IMAGE',
        content: "Guardate chi è venuto a trovarmi in studio oggi! 🎁 Indovinate cos'è?",
        image: "https://images.unsplash.com/photo-1628260412297-a3377e45006f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", 
        date: "1 giorno fa",
        likes: 342
    },
    {
        id: 'mock-3',
        type: 'TEXT',
        content: "GRAZIE A TUTTI! 🎉 Siamo arrivati a 10.000 amici fantasmi!",
        date: "3 giorni fa",
        likes: 890
    }
];

const CommunityFeed: React.FC<{ setView?: (view: AppView) => void }> = ({ setView }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Modal States
  const [isFullFeedOpen, setIsFullFeedOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Refs for State in Timeout
  const stateRef = useRef({
      isFullFeedOpen,
      isNotifModalOpen
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Keep Refs Updated
  useEffect(() => {
      stateRef.current = { isFullFeedOpen, isNotifModalOpen };
  }, [isFullFeedOpen, isNotifModalOpen]);

  useEffect(() => {
      const imgMobile = new Image();
      imgMobile.src = PIAZZA_BG_MOBILE;
      const imgDesktop = new Image();
      imgDesktop.src = PIAZZA_BG_DESKTOP;

      let loadedCount = 0;
      const onLoad = () => {
          loadedCount++;
          if (loadedCount >= 1) setBgLoaded(true);
      };

      imgMobile.onload = onLoad;
      imgDesktop.onload = onLoad;
      
      // Fallback
      setTimeout(() => setBgLoaded(true), 2000);

      const loadData = async () => {
          setLoading(true);
          
          // 1. Load Posts
          const dynamicPosts = await getCommunityPosts();
          const MIN_POSTS = 3;
          let finalPosts = [...dynamicPosts];
          if (finalPosts.length < MIN_POSTS) {
              const needed = MIN_POSTS - finalPosts.length;
              const filler = MOCK_POSTS.slice(0, needed);
              finalPosts = [...finalPosts, ...filler];
          }
          setPosts(finalPosts);

          // 2. Load Notifications (all active ones)
          const allNotifs = await getAllNotifications();
          setNotifications(allNotifs.slice(0, 10)); // Keep only latest 10

          setLoading(false);
      };
      loadData();

      // ROBOT HINT LOGIC
      const hasDismissed = sessionStorage.getItem('piazza_hint_dismissed') === 'true';

      if (!hasDismissed) {
          const timer = setTimeout(() => {
              const current = stateRef.current;
              if (!current.isFullFeedOpen && !current.isNotifModalOpen) {
                  setShowHint(true);
              }
          }, 5000);
          return () => clearTimeout(timer);
      }
  }, []); 

  const getClipPath = (points: Point[]) => {
      if (!points || points.length < 3) return 'none';
      const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
      return `polygon(${poly})`;
  };

  const getBoundingBoxStyle = (points: Point[]) => {
      if (!points || points.length < 2) return { display: 'none' };
      const xs = points.map(p => p.x);
      const ys = points.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      return {
          top: `${minY}%`,
          left: `${minX}%`,
          width: `${maxX - minX}%`,
          height: `${maxY - minY}%`
      };
  };

  // --- INTERAZIONI UTENTE ---
  const dismissHint = () => {
      setShowHint(false);
      try {
          sessionStorage.setItem('piazza_hint_dismissed', 'true');
      } catch (e) {}
  };

  const handleInteraction = () => {
      dismissHint();
  };

  const handleBooClick = () => {
      dismissHint();
      setIsNotifModalOpen(true);
  };

  const handleMuseumClick = () => {
      dismissHint();
      if (setView) setView(AppView.FANART);
  };

  const handleBoardClick = () => {
      dismissHint();
      setIsFullFeedOpen(true);
  };

  // Helper per recuperare i punti corretti (Mobile vs Desktop)
  const getZonePoints = (id: string, isDesktop: boolean) => {
      const zones = isDesktop ? ZONES_DESKTOP : ZONES_MOBILE;
      return zones.find(z => z.id === id)?.points || [];
  };

  // --- RENDER MODALE FEED NOTIZIE ---
  const renderFullFeedModal = () => (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-[30px] border-4 border-yellow-400 shadow-2xl overflow-hidden h-[85vh] flex flex-col">
              
              {/* Header Modal */}
              <div className="bg-yellow-400 p-4 flex items-center justify-between border-b-4 border-yellow-500 shrink-0">
                  <div className="flex items-center gap-2">
                      <Newspaper size={28} className="text-black" />
                      <h2 className="text-2xl font-black text-black uppercase">Notizie di Boo</h2>
                  </div>
                  <button 
                      onClick={() => setIsFullFeedOpen(false)}
                      className="bg-red-500 text-white p-2 rounded-full border-2 border-black hover:scale-110 transition-transform shadow-md"
                  >
                      <X size={20} strokeWidth={3} />
                  </button>
              </div>

              {/* Feed List */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar">
                  {posts.map((post) => (
                      <div 
                          key={post.id} 
                          className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 mb-4 transform hover:scale-[1.01] transition-transform"
                      >
                          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-100">
                              <img src={CHANNEL_LOGO} alt="Lone Boo" className="w-10 h-10 rounded-full border-2 border-yellow-400" />
                              <div className="flex flex-col">
                                  <span className="font-black text-gray-800">Lone Boo</span>
                                  <span className="text-xs text-gray-400 font-bold">{post.date}</span>
                              </div>
                          </div>

                          <p className="text-gray-700 font-medium text-base mb-3 leading-relaxed">
                              {post.content}
                          </p>

                          {post.type === 'IMAGE' && post.image && (
                              <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                  <img src={post.image} alt="Post" className="w-full h-auto object-cover" />
                              </div>
                          )}

                          {post.type === 'POLL' && (
                              <div className="space-y-2 mb-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                  {post.pollOptions?.map((opt, i) => (
                                      <div key={i} className="bg-white rounded-lg p-2 border border-gray-200 text-sm font-bold text-gray-600 shadow-sm">
                                          {opt.text}
                                      </div>
                                  ))}
                                  <div className="text-center mt-2">
                                      <a 
                                          href="https://www.youtube.com/@ILoneBoo/community" 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-500 text-xs font-black underline"
                                      >
                                          VOTA SU YOUTUBE
                                      </a>
                                  </div>
                              </div>
                          )}

                          <div className="flex items-center gap-4 text-gray-400 text-sm font-bold pt-2">
                              <span className="flex items-center gap-1 hover:text-red-500 transition-colors"><Heart size={16}/> {post.likes}</span>
                              <span className="flex items-center gap-1 hover:text-blue-500 transition-colors"><MessageSquare size={16}/> Commenta</span>
                          </div>
                      </div>
                  ))}
                  
                  <div className="text-center py-6">
                      <a 
                          href="https://www.youtube.com/@ILoneBoo/community" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-red-600 text-white font-black px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
                      >
                          VAI AL CANALE UFFICIALE <ExternalLink size={18} />
                      </a>
                  </div>
              </div>
          </div>
      </div>
  );

  // --- RENDER MODALE NOTIFICHE (BOO MEGAPHONE) ---
  const renderNotificationsModal = () => (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-[30px] border-4 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.5)] overflow-hidden h-[80vh] flex flex-col">
              
              {/* Header Modal */}
              <div className="bg-purple-600 p-4 flex items-center justify-between border-b-4 border-purple-800 shrink-0">
                  <div className="flex items-center gap-2 text-white">
                      <Megaphone size={28} className="animate-wiggle" />
                      <h2 className="text-2xl font-black uppercase">Avvisi di Boo</h2>
                  </div>
                  <button 
                      onClick={() => setIsNotifModalOpen(false)}
                      className="bg-white text-purple-600 p-2 rounded-full border-2 border-black hover:scale-110 transition-transform shadow-md"
                  >
                      <X size={20} strokeWidth={3} />
                  </button>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto p-4 bg-purple-50 custom-scrollbar">
                  {notifications.length > 0 ? (
                      notifications.map((notif) => (
                          <div 
                              key={notif.id} 
                              className="bg-white p-4 rounded-2xl shadow-sm border-2 border-purple-100 mb-3 flex flex-col gap-2"
                          >
                              <div className="flex items-start gap-3">
                                  <div className="bg-yellow-400 p-2 rounded-full border-2 border-black shrink-0">
                                      <Bell size={16} />
                                  </div>
                                  <div className="flex-1">
                                      <p className="text-gray-800 font-bold text-sm leading-snug">
                                          {notif.message}
                                      </p>
                                  </div>
                              </div>
                              
                              {notif.image && (
                                  <div className="w-full mt-2 rounded-lg overflow-hidden border border-gray-200">
                                      <img src={notif.image} alt="Notifica" className="w-full h-auto object-cover" />
                                  </div>
                              )}

                              {notif.link && (
                                  <a 
                                      href={notif.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="mt-1 bg-purple-100 text-purple-700 text-xs font-black py-2 px-4 rounded-lg text-center hover:bg-purple-200 transition-colors uppercase tracking-wide flex items-center justify-center gap-1"
                                  >
                                      {notif.linkText || "Scopri di più"} <ExternalLink size={12} />
                                  </a>
                              )}
                          </div>
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                          <Bell size={48} className="mb-2 opacity-50" />
                          <p className="font-bold">Nessun avviso al momento.</p>
                          <p className="text-xs">Torna a trovarci presto!</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );

  const renderInteractives = (isDesktop: boolean) => {
      const feedPoints = getZonePoints('BOARD_FEED', isDesktop);
      const fbPoints = getZonePoints('FACEBOOK_LINK', isDesktop);
      const museumPoints = getZonePoints('MUSEUM_LINK', isDesktop);
      const booPoints = getZonePoints('BOO_MEGAPHONE', isDesktop);

      return (
      <>
        {/* 1. BACHECA YOUTUBE */}
        <div 
            className="absolute z-20 overflow-hidden cursor-pointer group"
            style={getBoundingBoxStyle(feedPoints)}
            onClick={handleBoardClick}
            title="Bacheca Notizie"
        >
            {/* Contenuto Miniatura: Solo l'ultimo post */}
            {posts.length > 0 && (
                <div className="w-full h-full flex flex-col p-1 md:p-2 bg-transparent">
                    <div className="flex items-center gap-1 mb-1">
                        <span className="bg-red-600 text-white text-[6px] md:text-[8px] font-black px-1 rounded uppercase">NUOVO</span>
                        <span className="text-[6px] md:text-[8px] text-gray-600 font-bold truncate">Lone Boo</span>
                    </div>
                    <div className="flex flex-1 gap-1 overflow-hidden">
                        {/* Se c'è immagine, mostrala piccola a sinistra */}
                        {posts[0].type === 'IMAGE' && posts[0].image && (
                            <img src={posts[0].image} className="h-full w-auto object-cover rounded border border-gray-300" alt="Preview" />
                        )}
                        {/* Testo troncato */}
                        <p className="text-[6px] md:text-[9px] font-bold text-gray-800 leading-tight line-clamp-3 md:line-clamp-4 flex-1">
                            {posts[0].content}
                        </p>
                    </div>
                </div>
            )}
        </div>

        {/* 2. FACEBOOK LINK (CASSETTA POSTA) */}
        <a
            href={FACEBOOK_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute z-30 group cursor-pointer"
            style={{ clipPath: getClipPath(fbPoints), inset: 0 }}
            onClick={(e) => { dismissHint(); }}
            title="Gruppo Facebook Genitori"
        >
        </a>

        {/* 3. MUSEUM LINK (CAVALLETTO) */}
        <div
            onClick={handleMuseumClick}
            className="absolute z-30 group cursor-pointer"
            style={{ clipPath: getClipPath(museumPoints), inset: 0 }}
            title="Vai al Museo"
        >
        </div>

        {/* 4. BOO (MEGAFONO) -> ORA APRE NOTIFICHE */}
        <div
            onClick={handleBooClick}
            className="absolute z-30 group cursor-pointer"
            style={{ clipPath: getClipPath(booPoints), inset: 0 }}
            title="Centro Notifiche"
        >
        </div>
      </>
      );
  };

  return (
    <div 
        className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-gradient-to-b from-[#b388f4] to-white overflow-hidden flex flex-col"
        onClick={handleInteraction}
    >
        {/* MODALI */}
        {isFullFeedOpen && renderFullFeedModal()}
        {isNotifModalOpen && renderNotificationsModal()}

        {/* LOADER */}
        {(!bgLoaded || loading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-sky-100 z-50">
                <span className="text-sky-600 font-black text-2xl animate-pulse flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Arrivo in Piazza...
                </span>
            </div>
        )}

        {/* ROBOT HINT (AGGIORNATO) */}
        <RobotHint 
            show={showHint && bgLoaded && !isFullFeedOpen && !isNotifModalOpen} 
            message="Tocca gli oggetti o Boo per sapere le ultime..."
        />

        {/* BACKGROUND LAYER */}
        <div 
            ref={containerRef}
            className="relative flex-1 w-full h-full overflow-hidden select-none"
        >
            {/* --- MOBILE (VERTICALE) --- */}
            <div className="block md:hidden w-full h-full relative">
                <img 
                    src={PIAZZA_BG_MOBILE} 
                    alt="Piazza Lone Boo Mobile" 
                    className={`w-full h-full object-fill object-center animate-in fade-in duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                {renderInteractives(false)}
            </div>

            {/* --- DESKTOP (ORIZZONTALE 16:9) --- */}
            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <img 
                    src={PIAZZA_BG_DESKTOP} 
                    alt="Piazza Lone Boo Desktop" 
                    className={`absolute inset-0 w-full h-full object-fill object-center animate-in fade-in duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                
                {/* RENDER INTERACTIVES */}
                {renderInteractives(true)}
            </div>

        </div>
    </div>
  );
};

export default CommunityFeed;
    