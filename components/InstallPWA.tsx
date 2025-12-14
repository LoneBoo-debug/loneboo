import React, { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';

const InstallPWA: React.FC = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1. Check if already installed (Standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;
    
    if (isStandalone) return; 

    // 2. Check for iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);

    if (isIosDevice) {
        setIsIOS(true);
        setSupportsPWA(true);
    }

    // 3. Check for Android/Desktop (beforeinstallprompt)
    const handler = (e: any) => {
      e.preventDefault();
      setPromptInstall(e);
      setSupportsPWA(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
        setShowIOSHint(true);
    } else if (promptInstall) {
        promptInstall.prompt();
    }
  };

  if (!supportsPWA || !isVisible) return null;

  return (
    <>
        {/* BANNER INSTALLAZIONE FISSO IN BASSO */}
        <div className="fixed bottom-4 left-4 right-4 z-[100] animate-in slide-in-from-bottom duration-700">
            <div className="bg-white rounded-2xl border-4 border-black shadow-[0_4px_15px_rgba(0,0,0,0.3)] p-3 flex items-center justify-between max-w-md mx-auto relative overflow-hidden">
                
                {/* Background Decor */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-transparent pointer-events-none"></div>

                <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-boo-purple p-2 rounded-xl border-2 border-black text-white">
                        <Download size={24} className="animate-bounce" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-gray-800 text-sm md:text-base leading-tight">SCARICA L'APP!</span>
                        <span className="text-[10px] md:text-xs font-bold text-gray-500">Gioca senza internet 🚀</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                    <button 
                        onClick={handleInstallClick}
                        className="bg-green-500 hover:bg-green-600 text-white font-black text-xs md:text-sm py-2 px-4 rounded-xl border-2 border-black shadow-[2px_2px_0_black] active:translate-y-1 active:shadow-none transition-all"
                    >
                        INSTALLA
                    </button>
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="p-1 text-gray-400 hover:text-red-500"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>

        {/* MODALE ISTRUZIONI IOS */}
        {showIOSHint && (
            <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-in fade-in" onClick={() => setShowIOSHint(false)}>
                <div className="bg-white w-full max-w-sm rounded-[30px] border-4 border-black p-6 relative animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => setShowIOSHint(false)}
                        className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-500 transition-colors"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>

                    <h3 className="text-2xl font-black text-center mb-4 text-blue-600">Installazione su iOS 🍎</h3>
                    
                    <div className="flex flex-col gap-4 text-gray-700 font-bold">
                        <div className="flex items-center gap-3">
                            <span className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</span>
                            <p>Tocca il tasto <span className="inline-flex align-middle"><Share size={16} /></span> (Condividi) nella barra del browser.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</span>
                            <p>Scorri e seleziona <span className="bg-gray-100 px-2 py-1 rounded border border-gray-300 text-sm">Aggiungi alla schermata Home</span>.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</span>
                            <p>Tocca <strong>Aggiungi</strong> in alto a destra.</p>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-400 font-bold">
                        Fallo ora per giocare offline!
                    </div>
                    
                    {/* Arrow pointing down for mobile */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce md:hidden">
                        ⬇️
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default InstallPWA;