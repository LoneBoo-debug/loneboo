import React, { useState, useEffect } from 'react';
import { AppNotification, AppView, CommunityPost } from '../types';
import { fetchAppNotifications, markNotificationsAsRead } from '../services/notificationService';
import { getLatestVideos } from '../services/api';
import { getCommunityPosts } from '../services/data';
import { OFFICIAL_LOGO } from '../constants';
import { Bell, ExternalLink, Heart, MessageSquare, X, PlayCircle } from 'lucide-react';
import RobotHint from './RobotHint';

const PIAZZA_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/piazza-mobile.webp';
const PIAZZA_BG_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/piazza-desktop.webp';
const FACEBOOK_GROUP_URL = 'https://www.facebook.com/groups/2648776785470151/';
const NOTIF_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/notif-piazza.webp';
const NEWS_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/news-piazza.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const BOARD_BANNER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bannernoticeboohander.webp';
const NOTIF_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-notif.webp';

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

const ZONES_MOBILE: ZoneConfig[] = [
  { "id": "BOARD_FEED", "points": [ { "x": 38.38, "y": 10.77 }, { "x": 38.65, "y": 21.36 }, { "x": 60.77, "y": 21.54 }, { "x": 61.57, "y": 10.59 } ] },
  { "id": "FACEBOOK_LINK", "points": [ { "x": 3.73, "y": 54.2 }, { "x": 3.73, "y": 66.22 }, { "x": 9.86, "y": 68.92 }, { "x": 16.52, "y": 65.51 }, { "x": 13.33, "y": 51.87 } ] },
  { "id": "MUSEUM_LINK", "points": [ { "x": 82.36, "y": 56.53 }, { "x": 78.89, "y": 67.66 }, { "x": 91.68, "y": 70.71 }, { "x": 94.35, "y": 57.43 } ] },
  { "id": "BOO_MEGAPHONE", "points": [ { "x": 44.24, "y": 30.15 }, { "x": 41.58, "y": 44.33 }, { "x": 54.37, "y": 44.87 }, { "x": 54.9, "y": 30.69 } ] }
];

const ZONES_DESKTOP: ZoneConfig[] = [
  { "id": "BOARD_FEED", "points": [ { "x": 44.48, "y": 6.82 }, { "x": 44.59, "y": 17.84 }, { "x": 55.2, "y": 18.1 }, { "x": 55.65, "y": 6.29 } ] },
  { "id": "FACEBOOK_LINK", "points": [ { "x": 27.66, "y": 51.41 }, { "x": 27.77, "y": 65.83 }, { "x": 34.32, "y": 66.36 }, { "x": 33.98, "y": 50.36 } ] },
  { "id": "MUSEUM_LINK", "points": [ { "x": 64.91, "y": 55.08 }, { "x": 64.12, "y": 66.09 }, { "x": 69.54, "y": 68.45 }, { "x": 70.33, "y": 57.18 } ] },
  { "id": "BOO_MEGAPHONE", "points": [ { "x": 47.19, "y": 27.8 }, { "x": 46.96, "y": 42.49 }, { "x": 52.16, "y": 43.28 }, { "x": 52.95, "y": 28.59 } ] }
];

const CommunityFeed: React.FC<{ setView?: (view: AppView) => void }> = ({ setView }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isFullFeedOpen, setIsFullFeedOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  useEffect(() => {
      const imgMobile = new Image(); imgMobile.src = PIAZZA_BG_MOBILE;
      const imgDesktop = new Image(); imgDesktop.src = PIAZZA_BG_DESKTOP;
      let loadedCount = 0;
      const onLoad = () => { loadedCount++; if (loadedCount >= 1) setBgLoaded(true); };
      imgMobile.onload = onLoad; imgDesktop.onload = onLoad;
      setTimeout(() => setBgLoaded(true), 2000);

      const loadData = async () => {
          try {
              const [dynamicPosts, latestVideos, allNotifs] = await Promise.all([
                  getCommunityPosts(),
                  getLatestVideos(),
                  fetchAppNotifications()
              ]);
              
              const mappedVideos: CommunityPost[] = latestVideos.map(v => ({
                  id: v.id, type: 'IMAGE', content: v.title, image: v.thumbnail,
                  date: v.publishedAt ? new Date(v.publishedAt).toLocaleDateString('it-IT') : "Novità",
                  likes: 0
              }));
              setPosts([...dynamicPosts, ...mappedVideos]);
              setNotifications(allNotifs);
          } catch (err) { console.error(err); }
      };
      loadData();
      
      const hasDismissed = sessionStorage.getItem('piazza_hint_dismissed') === 'true';
      if (!hasDismissed) {
          const timer = setTimeout(() => setShowHint(true), 5000);
          return () => clearTimeout(timer);
      }
  }, []); 

  const handleExternalClick = (e: React.MouseEvent, url: string) => {
      const linksDisabled = localStorage.getItem('disable_external_links') === 'true';
      if (linksDisabled) {
          e.preventDefault();
          e.stopPropagation();
          alert("Navigazione esterna bloccata dai genitori! 🔒");
          return;
      }
      window.open(url, '_blank');
  };

  const handleBooClick = async () => {
      setShowHint(false);
      setIsNotifModalOpen(true);
      await markNotificationsAsRead();
  };

  const renderNotificationsModal = () => (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-[30px] border-4 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.5)] overflow-hidden h-[75vh] flex flex-col animate-in zoom-in duration-300">
              <div className="bg-purple-600 p-2 md:p-3 flex items-center justify-between border-b-4 border-purple-800 shrink-0">
                  <div className="flex-1 flex justify-start pl-2 md:pl-4"><img src={NOTIF_HEADER_IMG} alt="Avvisi" className="h-12 md:h-18 w-auto object-contain drop-shadow-lg" /></div>
                  <button onClick={() => setIsNotifModalOpen(false)} className="hover:scale-110 active:scale-95 transition-all outline-none"><img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-purple-50 custom-scrollbar">
                  {notifications.length > 0 ? (
                      notifications.map((notif) => (
                          <div key={notif.id} className="bg-white p-4 rounded-3xl shadow-md border-2 border-purple-100 mb-4 flex flex-col gap-3">
                              <div className="flex items-start gap-3">
                                  <img src={NOTIF_ICON_IMG} alt="" className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0 drop-shadow-sm" />
                                  <div className="flex-1"><p className="text-gray-800 font-black text-base md:text-xl leading-snug">{notif.message}</p></div>
                              </div>
                              
                              {notif.image && (
                                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-purple-200 shadow-inner group">
                                      <img src={notif.image} alt="Preview" className="w-full h-full object-cover" />
                                      {notif.link?.includes('youtube.com') || notif.link?.includes('youtu.be') ? (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                              <PlayCircle size={60} className="text-white drop-shadow-lg opacity-80 group-hover:scale-110 transition-transform" />
                                          </div>
                                      ) : null}
                                  </div>
                              )}

                              {notif.link && (
                                  <button 
                                    onClick={(e) => handleExternalClick(e, notif.link!)} 
                                    className="bg-blue-500 text-white font-black py-4 px-6 rounded-2xl border-b-6 border-blue-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg md:text-xl shadow-lg uppercase tracking-wider outline-none"
                                  >
                                    {notif.linkText || "VAI"} <ExternalLink size={20} />
                                  </button>
                              )}
                          </div>
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center"><Bell size={48} className="mb-2 opacity-50" /><p className="font-bold">Nessun avviso al momento.</p></div>
                  )}
              </div>
          </div>
      </div>
  );

  const getClipPath = (points: Point[]) => `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
  const getBoundingBoxStyle = (points: Point[]) => {
      const xs = points.map(p => p.x); const ys = points.map(p => p.y);
      return { top: `${Math.min(...ys)}%`, left: `${Math.min(...xs)}%`, width: `${Math.max(...xs) - Math.min(...xs)}%`, height: `${Math.max(...ys) - Math.min(...ys)}%` };
  };

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-indigo-900 overflow-hidden touch-none overscroll-none select-none">
        {isFullFeedOpen && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in">
                <div className="relative w-full max-w-2xl bg-white rounded-[30px] border-4 border-yellow-400 shadow-2xl overflow-hidden h-[75vh] flex flex-col animate-in zoom-in duration-300">
                    <div className="bg-yellow-400 p-2 md:p-3 flex items-center justify-between border-b-4 border-yellow-500 shrink-0">
                        <div className="flex-1 flex justify-start pl-2 md:pl-4"><img src={NEWS_HEADER_IMG} alt="News" className="h-12 md:h-18 w-auto object-contain drop-shadow-lg" /></div>
                        <button onClick={() => setIsFullFeedOpen(false)} className="hover:scale-110 active:scale-95 transition-all outline-none"><img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 custom-scrollbar space-y-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-[#fdfbf7] p-5 rounded-sm shadow-[2px_2px_10px_rgba(0,0,0,0.1)] border-t border-gray-200 border-l-4 border-gray-300 relative overflow-hidden group">
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200/50 relative z-10">
                                    <img src={OFFICIAL_LOGO} alt="Lone Boo" className="w-12 h-12 rounded-full border-2 border-gray-300 object-contain bg-white p-0.5" />
                                    <div className="flex flex-col">
                                        <span className="font-black text-gray-800 text-lg uppercase tracking-tight">Lone Boo News</span>
                                        <span className="text-[10px] md:text-xs text-gray-500 font-black uppercase tracking-widest">{post.date}</span>
                                    </div>
                                </div>
                                <p className="text-gray-800 font-bold text-base md:text-xl mb-4 leading-relaxed relative z-10 font-sans">
                                    {post.content}
                                </p>
                                {post.type === 'IMAGE' && post.image && (
                                    <div className="mb-2 rounded-lg overflow-hidden aspect-video bg-gray-200 border-2 border-gray-300 relative z-10">
                                        <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="mt-4 flex justify-between items-center opacity-40 pt-2 border-t border-dashed border-gray-300 relative z-10">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Città Colorata Press</span>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
        {isNotifModalOpen && renderNotificationsModal()}
        {!bgLoaded && <div className="fixed inset-0 flex flex-col items-center justify-center bg-sky-100 z-[150]"><img src={OFFICIAL_LOGO} alt="" className="w-32 h-32 object-contain animate-spin-horizontal mb-4" /><span className="text-sky-600 font-black text-2xl animate-pulse uppercase">Arrivo in Piazza...</span></div>}
        <RobotHint show={showHint && bgLoaded && !isFullFeedOpen && !isNotifModalOpen} message="Tocca gli oggetti o Boo per sapere le ultime..." />
        <div className="relative w-full h-full overflow-hidden select-none">
            <div className="block md:hidden absolute inset-0">
                <img src={PIAZZA_BG_MOBILE} alt="" className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`} />
                {bgLoaded && (
                    <>
                        <div className="absolute z-20 cursor-pointer flex items-center justify-center" style={getBoundingBoxStyle(ZONES_MOBILE[0].points)} onClick={() => setIsFullFeedOpen(true)}>
                            <img src={BOARD_BANNER_IMG} alt="Notizie di Boo" className="w-full h-full object-contain" />
                        </div>
                        <div 
                          onClick={(e) => handleExternalClick(e, FACEBOOK_GROUP_URL)} 
                          className="absolute z-30 cursor-pointer" 
                          style={{ clipPath: getClipPath(ZONES_MOBILE[1].points), inset: 0 }}
                        ></div>
                        <div onClick={() => setView && setView(AppView.FANART)} className="absolute z-30 cursor-pointer" style={{ clipPath: getClipPath(ZONES_MOBILE[2].points), inset: 0 }}></div>
                        <div onClick={handleBooClick} className="absolute z-30 cursor-pointer" style={{ clipPath: getClipPath(ZONES_MOBILE[3].points), inset: 0 }}></div>
                    </>
                )}
            </div>
            <div className="hidden md:block absolute inset-0">
                <img src={PIAZZA_BG_DESKTOP} alt="" className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`} />
                {bgLoaded && (
                    <>
                        <div className="absolute z-20 cursor-pointer flex items-center justify-center" style={getBoundingBoxStyle(ZONES_DESKTOP[0].points)} onClick={() => setIsFullFeedOpen(true)}>
                            <img src={BOARD_BANNER_IMG} alt="Notizie di Boo" className="w-full h-full object-contain" />
                        </div>
                        <div 
                          onClick={(e) => handleExternalClick(e, FACEBOOK_GROUP_URL)} 
                          className="absolute z-30 cursor-pointer" 
                          style={{ clipPath: getClipPath(ZONES_DESKTOP[1].points), inset: 0 }}
                        ></div>
                        <div onClick={() => setView && setView(AppView.FANART)} className="absolute z-30 cursor-pointer" style={{ clipPath: getClipPath(ZONES_DESKTOP[2].points), inset: 0 }}></div>
                        <div onClick={handleBooClick} className="absolute z-30 cursor-pointer" style={{ clipPath: getClipPath(ZONES_DESKTOP[3].points), inset: 0 }}></div>
                    </>
                )}
            </div>
        </div>
    </div>
  );
};

export default CommunityFeed;