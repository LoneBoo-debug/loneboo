
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { X, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTokens, spendTokens, getOwnedCars, getCarStats, updateCarStats, installComponent } from '../services/tokens';
import TokenIcon from './TokenIcon';
import { CAR_DATA } from '../services/carData';
import { SHOP_DATA, ShopItem } from '../services/shopData';

interface GrayCityNegozioRicambiProps {
  setView: (view: AppView) => void;
}

const CLICKABLE_AREAS: Record<string, string> = {
  "Freni": "74.36,39.27 73.56,47.06 97.81,45.26 98.08,36.42",
  "Motori": "73.03,27.13 73.03,36.12 97.55,31.62 98.35,20.38",
  "Pneumatici": "42.11,23.83 42.11,31.32 67.43,26.08 67.7,15.44",
  "Sospensioni": "72.76,49.61 72.23,56.8 98.08,57.4 98.08,47.81",
  "Scarichi": "42.38,43.02 41.84,49.61 69.03,48.41 68.23,38.67",
  "Olii": "71.96,58.75 71.7,66.7 98.08,70.59 98.61,59.5"
};

const STAT_MAP: Record<string, string> = {
  "Velocità": "speed",
  "Accel": "accel",
  "Tenuta": "grip",
  "Sicurezza": "safety",
  "Affidabilità": "reliability",
  "Frenata": "braking"
};

const GrayCityNegozioRicambi: React.FC<GrayCityNegozioRicambiProps> = ({ setView }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userTokens, setUserTokens] = useState(0);
  const [ownedCars, setOwnedCars] = useState<string[]>([]);
  const [confirmItem, setConfirmItem] = useState<ShopItem | null>(null);
  const [targetCar, setTargetCar] = useState<string | null>(null);
  const [carSelectionItem, setCarSelectionItem] = useState<ShopItem | null>(null);
  const [insufficientFundsItem, setInsufficientFundsItem] = useState<ShopItem | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  useEffect(() => {
    setUserTokens(getTokens());
    setOwnedCars(getOwnedCars());

    const handleUpdate = () => {
      setUserTokens(getTokens());
      setOwnedCars(getOwnedCars());
    };
    window.addEventListener('progressUpdated', handleUpdate);
    return () => window.removeEventListener('progressUpdated', handleUpdate);
  }, []);

  const parseStatBoost = (boostStr: string) => {
    return boostStr.split(',').map(s => {
      const parts = s.trim().split(' ');
      return { label: parts[0], value: parts[1] };
    });
  };

  const handlePurchaseClick = (item: ShopItem) => {
    if (userTokens < item.price) {
      setInsufficientFundsItem(item);
      return;
    }

    if (ownedCars.length === 0) {
      // No cars owned? This shouldn't happen if they are in the shop, but let's handle it
      alert("Devi possedere almeno un'auto nel garage per acquistare componenti!");
      return;
    }

    if (ownedCars.length > 1) {
      setCarSelectionItem(item);
    } else {
      setTargetCar(ownedCars[0]);
      setConfirmItem(item);
    }
  };

  const executePurchase = (item: ShopItem, carName: string) => {
    const success = spendTokens(item.price, `Acquisto Componente: ${item.name} per ${carName}`);
    if (success) {
      const currentStats = getCarStats(carName) || {};
      const boosts = parseStatBoost(item.statBoost);
      
      const newStats = { ...currentStats };
      boosts.forEach(b => {
        const key = STAT_MAP[b.label];
        if (key) {
          const val = parseInt(b.value.replace('+', ''));
          newStats[key] = (newStats[key] || 0) + val;
        }
      });

      updateCarStats(carName, newStats);
      installComponent(carName, selectedCategory!, item.id);
      setPurchaseSuccess(`${item.name} installato con successo su ${carName}!`);
      setTimeout(() => setPurchaseSuccess(null), 3000);
      setConfirmItem(null);
      setCarSelectionItem(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Background Image */}
      <img 
        src="https://loneboo-images.s3.eu-south-1.amazonaws.com/sfautoricambi.webp" 
        alt="Negozio di Ricambi" 
        className="absolute inset-0 w-full h-full object-cover select-none"
        referrerPolicy="no-referrer"
      />

      {/* SVG Clickable Areas */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {Object.entries(CLICKABLE_AREAS).map(([name, pointsStr]) => (
          <polygon
            key={name}
            points={pointsStr}
            className="fill-transparent hover:fill-white/10 stroke-white/10 hover:stroke-white/30 stroke-[0.1] pointer-events-auto cursor-pointer transition-all duration-300"
            onClick={() => setSelectedCategory(name)}
          >
            <title>{name}</title>
          </polygon>
        ))}
      </svg>

      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
          <TokenIcon className="w-5 h-5" />
          <span className="text-xl font-black text-yellow-400">{userTokens}</span>
        </div>
        <button 
          onClick={() => setView(AppView.GRAY_CITY)}
          className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all duration-300 group"
        >
          <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Side Shop Panel */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-[65%] z-[70] bg-white/5 backdrop-blur-2xl border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.3)] flex flex-col"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{selectedCategory}</h2>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">Catalogo Ricambi</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
              {SHOP_DATA[selectedCategory]?.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex flex-col items-center text-center max-w-2xl mx-auto"
                >
                  <div className={`w-full ${selectedCategory === 'Scarichi' ? 'max-w-[130px]' : 'max-w-[180px]'} aspect-square mb-4 relative`}>
                    <div className="absolute inset-0 bg-white/5 rounded-3xl blur-2xl group-hover:bg-white/10 transition-colors duration-500" />
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="relative w-full h-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  
                  <div className="space-y-2 w-full">
                    <h4 className="text-white font-black text-lg uppercase tracking-tight">{item.name}</h4>
                    <p className="text-white/60 text-[11px] font-medium leading-tight max-w-md mx-auto">{item.description}</p>
                    
                    <div className="flex flex-col items-center gap-3 mt-4">
                      {/* LED Stats Box */}
                      <div className="flex items-center gap-2 bg-black/40 border border-white/10 p-1.5 rounded-lg">
                        {parseStatBoost(item.statBoost).map((boost, idx) => (
                          <div key={idx} className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded">
                            <span className="text-[9px] font-black text-green-400 uppercase">{boost.label}</span>
                            <span className="text-[9px] font-black text-white">{boost.value}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => handlePurchaseClick(item)}
                        className="flex items-center gap-3 px-8 py-2.5 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.15em] hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5 active:scale-95"
                      >
                        <span>Acquista Componente</span>
                        <div className="flex items-center gap-1 pl-3 border-l border-black/10 group-hover:border-white/20">
                          <TokenIcon className="w-4 h-4" />
                          <span className="text-sm">{item.price}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {/* Car Selection Modal */}
        {carSelectionItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-stone-900 border-4 border-yellow-400 rounded-[2.5rem] overflow-hidden"
            >
              <div className="p-6 bg-yellow-400 flex justify-between items-center">
                <h3 className="text-2xl font-black text-blue-900 uppercase">Seleziona Auto</h3>
                <button onClick={() => setCarSelectionItem(null)}><X className="text-blue-900" /></button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-white/60 text-sm font-bold uppercase text-center">Su quale auto vuoi installare {carSelectionItem.name}?</p>
                <div className="grid grid-cols-1 gap-3">
                  {ownedCars.map(carName => (
                    <button
                      key={carName}
                      onClick={() => {
                        setTargetCar(carName);
                        setConfirmItem(carSelectionItem);
                        setCarSelectionItem(null);
                      }}
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black uppercase tracking-wider transition-all"
                    >
                      {carName}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Confirmation Modal */}
        {confirmItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full max-w-md bg-stone-900 border-4 border-green-500 rounded-[3rem] p-8 flex flex-col items-center text-center gap-6"
            >
              <div className="flex items-center justify-center gap-8 w-full">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center p-3">
                    <img src={confirmItem.image} alt={confirmItem.name} className="w-full h-full object-contain drop-shadow-xl" />
                  </div>
                  <span className="text-[8px] font-black text-white/40 uppercase">Componente</span>
                </div>
                
                <div className="text-green-500 animate-pulse">
                  <Check size={32} />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center p-3">
                    <img 
                      src={CAR_DATA.find(c => c.name === targetCar)?.image} 
                      alt={targetCar || ''} 
                      className="w-full h-full object-contain drop-shadow-xl" 
                    />
                  </div>
                  <span className="text-[8px] font-black text-white/40 uppercase">Auto</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase">{confirmItem.name}</h3>
                <div className="flex items-center justify-center gap-2">
                  {parseStatBoost(confirmItem.statBoost).map((b, i) => (
                    <span key={i} className="text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-1 rounded">{b.label} {b.value}</span>
                  ))}
                </div>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-4">
                  Installazione su: <span className="text-white">{targetCar}</span>
                </p>
              </div>
              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={() => executePurchase(confirmItem, targetCar || ownedCars[0])}
                  className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-lg uppercase hover:scale-105 transition-transform"
                >
                  Conferma Acquisto
                </button>
                <button
                  onClick={() => setConfirmItem(null)}
                  className="w-full bg-white/5 text-white/40 py-3 rounded-2xl font-black text-sm uppercase hover:text-white transition-colors"
                >
                  Annulla
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Insufficient Funds Modal */}
        {insufficientFundsItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 5 }}
              className="w-full max-w-sm bg-red-600 border-8 border-white rounded-[3rem] p-8 flex flex-col items-center text-center gap-6"
            >
              <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center p-4">
                <img src={insufficientFundsItem.image} alt="Item" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase leading-none">Gettoni Insufficienti!</h2>
                <p className="text-white/80 text-sm font-medium">Ti servono {insufficientFundsItem.price} gettoni per questo componente.</p>
              </div>
              <div className="flex items-center gap-3 bg-black/20 px-6 py-3 rounded-2xl">
                <span className="text-white/60 uppercase text-[10px] font-bold">Il tuo saldo:</span>
                <TokenIcon className="w-5 h-5" />
                <span className="text-2xl font-black text-yellow-400">{userTokens}</span>
              </div>
              <button
                onClick={() => setInsufficientFundsItem(null)}
                className="w-full bg-white text-red-600 py-4 rounded-2xl font-black text-xl uppercase hover:scale-105 transition-transform"
              >
                Ho Capito
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Success Message */}
        {purchaseSuccess && (
          <div className="fixed bottom-12 left-0 right-0 z-[150] flex justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto"
            >
              <div className="bg-white/20 p-2 rounded-full"><Check size={24} /></div>
              <span className="font-black uppercase tracking-wider">{purchaseSuccess}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Overlay when shop is open */}
      {selectedCategory && (
        <div 
          className="absolute inset-0 z-[65] bg-black/20 backdrop-blur-[2px]"
          onClick={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
};

export default GrayCityNegozioRicambi;
