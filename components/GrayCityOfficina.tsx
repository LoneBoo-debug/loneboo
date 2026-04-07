
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView } from '../types';
import { X, Info, Wrench, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { getOwnedCars, getCarStats, getCarLaps, repairCar, getTokens, getInstalledComponents } from '../services/tokens';
import { CAR_DATA } from '../services/carData';
import { SHOP_DATA } from '../services/shopData';
import TokenIcon from './TokenIcon';

const STAT_LABELS: Record<string, string> = {
  speed: "Velocità",
  grip: "Tenuta",
  accel: "Accelerazione",
  braking: "Frenata",
  reliability: "Affidabilità",
  safety: "Sicurezza"
};

interface GrayCityOfficinaProps {
  setView: (view: AppView) => void;
}

const BACKGROUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/officinagrigia.webp';

const GrayCityOfficina: React.FC<GrayCityOfficinaProps> = ({ setView }) => {
  const [ownedCarNames, setOwnedCarNames] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [repairSuccess, setRepairSuccess] = useState(false);
  const [insufficientTokens, setInsufficientTokens] = useState(false);
  const [noRepairNeeded, setNoRepairNeeded] = useState(false);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    setOwnedCarNames(getOwnedCars());
    setTokens(getTokens());
    
    const handleUpdate = () => {
      setOwnedCarNames(getOwnedCars());
      setTokens(getTokens());
    };
    window.addEventListener('progressUpdated', handleUpdate);
    return () => window.removeEventListener('progressUpdated', handleUpdate);
  }, []);

  const currentCarName = ownedCarNames[currentIndex];
  const currentCarData = useMemo(() => CAR_DATA.find(c => c.name === currentCarName), [currentCarName]);
  const currentCarStats = useMemo(() => currentCarName ? getCarStats(currentCarName) : null, [currentCarName]);
  const currentCarLaps = useMemo(() => currentCarName ? getCarLaps(currentCarName) : 0, [currentCarName]);

  const repairCost = useMemo(() => {
    if (currentCarLaps === 0) return 0;
    return Math.ceil(currentCarLaps / 4) * 55;
  }, [currentCarLaps]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ownedCarNames.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ownedCarNames.length) % ownedCarNames.length);
  };

  const handleRepair = () => {
    if (!currentCarName || !currentCarData) return;
    
    if (currentCarLaps === 0) {
      setNoRepairNeeded(true);
      setTimeout(() => setNoRepairNeeded(false), 3000);
      return;
    }

    if (tokens < repairCost) {
      setInsufficientTokens(true);
      setTimeout(() => setInsufficientTokens(false), 3000);
      return;
    }

    // In tokens.ts, repairCar ripristina le stats a baseStats.
    // Passiamo le stats base di CAR_DATA.
    const success = repairCar(currentCarName, repairCost, currentCarData.stats);
    if (success) {
      setRepairSuccess(true);
      setTimeout(() => setRepairSuccess(false), 3000);
    }
  };

  if (ownedCarNames.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <img src={BACKGROUND_URL} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative z-10 text-center p-8 bg-black/60 backdrop-blur-md rounded-3xl border border-white/20">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white uppercase mb-2">Nessun'auto nel garage</h2>
          <p className="text-white/60 mb-6">Acquista la tua prima auto alla Scuola di Progettazione!</p>
          <button 
            onClick={() => setView(AppView.GRAY_CITY)}
            className="px-8 py-3 bg-white text-black rounded-full font-black uppercase"
          >
            Torna in Città
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Background */}
      <img 
        src={BACKGROUND_URL} 
        alt="Officina" 
        className="absolute inset-0 w-full h-full object-cover select-none"
        referrerPolicy="no-referrer"
      />

      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-[60] flex items-center gap-4">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
          <TokenIcon className="w-5 h-5" />
          <span className="text-xl font-black text-yellow-400">{tokens}</span>
        </div>
        <button 
          onClick={() => setView(AppView.GRAY_CITY)}
          className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all group"
        >
          <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Carousel */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-center px-4 mt-20">
        {ownedCarNames.length > 1 && (
          <button 
            onClick={handlePrev}
            className="absolute left-0 z-20 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
          >
            <ChevronLeft size={40} />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCarName}
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -100 }}
            className="flex flex-col items-center pt-8"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full group-hover:bg-blue-500/40 transition-all duration-700" />
              <img 
                src={currentCarData?.image} 
                alt={currentCarName} 
                className="relative w-[280px] md:w-[450px] h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="mt-6 text-xl md:text-2xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
              {currentCarName}
            </h2>
            <div className="mt-2 flex items-center gap-2 bg-black/40 px-4 py-1 rounded-full border border-white/10">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Stato Usura:</span>
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${currentCarLaps >= 4 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, (currentCarLaps / 4) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-white">{currentCarLaps}/4 Corse</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {ownedCarNames.length > 1 && (
          <button 
            onClick={handleNext}
            className="absolute right-0 z-20 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
          >
            <ChevronRight size={40} />
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 mt-8 flex flex-row gap-4">
        <button 
          onClick={() => setShowCheckModal(true)}
          className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-xl font-black text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
        >
          <Info size={20} />
          Check Auto
        </button>
        
        <button 
          onClick={handleRepair}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-xl ${
            repairCost > 0 ? 'bg-yellow-400 text-blue-900 shadow-yellow-400/10' : 'bg-gray-500/50 text-white/50 cursor-not-allowed'
          }`}
        >
          <Wrench size={20} />
          <div className="flex flex-col items-start leading-none">
            <span>Ripara</span>
            {repairCost > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <TokenIcon className="w-3 h-3" />
                <span className="text-[10px]">{repairCost}</span>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCheckModal && (
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
              className="w-full max-w-2xl max-h-[90vh] bg-stone-900 border-4 border-blue-500 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.3)] flex flex-col"
            >
              <div className="p-8 bg-blue-500 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Info className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Specifiche Auto</h3>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">{currentCarName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCheckModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar">
                {/* Stats List */}
                <div className="space-y-4">
                  {Object.entries(currentCarData?.stats || {}).map(([key, baseVal]) => {
                    const currentVal = currentCarStats?.[key] || baseVal;
                    const diff = currentVal - baseVal;
                    const isUsurata = currentVal < baseVal;
                    const isPotenziata = currentVal > baseVal;

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{STAT_LABELS[key] || key}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-white">{currentVal}</span>
                            {diff !== 0 && (
                              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${diff > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {diff > 0 ? `+${diff}` : diff}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${isUsurata ? 'bg-red-500' : isPotenziata ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(100, (currentVal / 100) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Info Box */}
                <div className="flex flex-col gap-6">
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                    <h4 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
                      <Check className="text-green-400" size={16} /> Componenti Installati
                    </h4>
                    <div className="space-y-3">
                      {Object.keys(getInstalledComponents(currentCarName)).length > 0 ? (
                        <div className="flex flex-wrap gap-3 p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                          {Object.entries(getInstalledComponents(currentCarName)).map(([category, itemId]) => {
                            const item = SHOP_DATA[category]?.find(i => i.id === itemId);
                            if (!item) return null;
                            return (
                              <div key={category} className="group relative">
                                <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/20 p-1 hover:border-blue-400 transition-colors">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-[8px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 border border-white/10">
                                  {item.name}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[11px] text-white/30 font-medium italic">Nessun componente aggiuntivo rilevato.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                    <h4 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
                      <AlertCircle className="text-yellow-400" size={16} /> Stato Manutenzione
                    </h4>
                    <p className="text-[11px] text-white/60 font-medium leading-tight">
                      L'auto ha effettuato <span className="text-white font-black">{currentCarLaps} corse</span>. 
                      Ogni 4 corse le prestazioni diminuiscono a causa dell'usura. 
                      Effettua una riparazione per ripristinare i valori massimi.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Feedback Modals */}
        <AnimatePresence>
          {repairSuccess && (
            <div className="fixed inset-x-0 bottom-12 z-[200] flex justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="w-[90%] max-w-md bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 justify-center pointer-events-auto"
              >
                <div className="bg-white/20 p-2 rounded-full shrink-0"><Check size={24} /></div>
                <span className="font-black uppercase tracking-wider text-sm text-center">Auto riparata con successo!</span>
              </motion.div>
            </div>
          )}

          {insufficientTokens && (
            <div className="fixed inset-x-0 bottom-12 z-[200] flex justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="w-[90%] max-w-md bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 justify-center pointer-events-auto"
              >
                <div className="bg-white/20 p-2 rounded-full shrink-0"><AlertCircle size={24} /></div>
                <span className="font-black uppercase tracking-wider text-sm text-center">Gettoni insufficienti per la riparazione!</span>
              </motion.div>
            </div>
          )}

          {noRepairNeeded && (
            <div className="fixed inset-x-0 bottom-12 z-[200] flex justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="w-[90%] max-w-md bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 justify-center pointer-events-auto"
              >
                <div className="bg-white/20 p-2 rounded-full shrink-0"><Info size={24} /></div>
                <span className="font-black uppercase tracking-wider text-sm text-center">Non è necessaria alcuna riparazione!</span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
};

export default GrayCityOfficina;
