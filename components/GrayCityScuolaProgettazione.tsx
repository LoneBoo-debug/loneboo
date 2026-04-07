
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { AppView } from '../types';
import { TOKEN_ICON_URL } from '../constants';
import { getTokens, purchaseCar, getOwnedCars, getSelectedCar, setSelectedCar, getCarStats } from '../services/tokens';
import { CAR_DATA } from '../services/carData';

const BACKGROUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sculolaprogettazionesfondo.webp';
const GARAGE_BUTTON_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/garagefeede.webp';
const BACK_BUTTON_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/toiunbytrew.webp';

const StatBar = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col gap-0.5">
    <div className="flex justify-between items-center">
      <span className="text-[8px] uppercase font-luckiest tracking-wider text-white/60">{label}</span>
    </div>
    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className="h-full"
        style={{
          background: 'linear-gradient(to right, #22c55e, #f97316, #ef4444)',
        }}
      />
    </div>
  </div>
);

interface GrayCityScuolaProgettazioneProps {
  setView: (view: AppView) => void;
}

const STAT_LABELS: Record<string, string> = {
  speed: "Velocità",
  grip: "Tenuta",
  accel: "Accelerazione",
  braking: "Frenata",
  reliability: "Affidabilità",
  safety: "Sicurezza"
};

const GrayCityScuolaProgettazione: React.FC<GrayCityScuolaProgettazioneProps> = ({ setView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [ownedCars, setOwnedCars] = useState<string[]>([]);
  const [selectedCar, setSelectedCarState] = useState<string | undefined>(undefined);
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [isInsufficientFundsModalOpen, setIsInsufficientFundsModalOpen] = useState(false);
  const [selectedCarForModal, setSelectedCarForModal] = useState<typeof CAR_DATA[0] | null>(null);
  const [userTokens, setUserTokens] = useState(0);

  useEffect(() => {
    setOwnedCars(getOwnedCars());
    setSelectedCarState(getSelectedCar());
    setUserTokens(getTokens());

    const handleUpdate = () => {
      setOwnedCars(getOwnedCars());
      setSelectedCarState(getSelectedCar());
      setUserTokens(getTokens());
    };

    window.addEventListener('progressUpdated', handleUpdate);
    return () => window.removeEventListener('progressUpdated', handleUpdate);
  }, []);

  const handlePurchase = (car: typeof CAR_DATA[0]) => {
    if (ownedCars.includes(car.name)) return;

    const success = purchaseCar(car.name, car.price, car.stats);
    if (success) {
      setOwnedCars(getOwnedCars());
      setUserTokens(getTokens());
    } else {
      setSelectedCarForModal(car);
      setIsInsufficientFundsModalOpen(true);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
      rotateY: direction < 0 ? 45 : -45
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = CAR_DATA.length - 1;
      if (nextIndex >= CAR_DATA.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const baseCar = CAR_DATA[currentIndex];
  const upgradedStats = getCarStats(baseCar.name);
  const currentCar = {
    ...baseCar,
    stats: upgradedStats ? { ...baseCar.stats, ...upgradedStats } : baseCar.stats
  };

  return (
    <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-stone-900">
      {/* Background */}
      <img 
        src={BACKGROUND_URL} 
        alt="Scuola di Progettazione Sfondo" 
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* Overlay for better visibility */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Navigation Buttons */}
      <div className="absolute top-8 left-8 right-8 z-50 flex justify-between items-center">
        {/* Back Button */}
        <button 
          onClick={() => setView(AppView.GRAY_CITY)}
          className="w-20 h-20 md:w-24 md:h-24 hover:scale-110 transition-transform active:scale-95"
        >
          <img src={BACK_BUTTON_URL} alt="Torna in Città" className="w-full h-full object-contain drop-shadow-xl" />
        </button>

        {/* Garage Button */}
        <button 
          onClick={() => setIsGarageOpen(true)}
          className="w-20 h-20 md:w-24 md:h-24 hover:scale-110 transition-transform active:scale-95"
        >
          <img src={GARAGE_BUTTON_URL} alt="Garage" className="w-full h-full object-contain drop-shadow-xl" />
        </button>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl h-full flex items-center justify-center px-4">
        
        {/* Navigation Arrows */}
        <button
          className="absolute left-4 md:left-8 z-40 bg-yellow-400 hover:bg-yellow-300 text-blue-900 p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft size={40} strokeWidth={3} />
        </button>

        <button
          className="absolute right-4 md:right-8 z-40 bg-yellow-400 hover:bg-yellow-300 text-blue-900 p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
          onClick={() => paginate(1)}
        >
          <ChevronRight size={40} strokeWidth={3} />
        </button>

        {/* Image Display */}
        <div className="relative w-full h-full flex items-center justify-center perspective-1000">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.4 },
                rotateY: { duration: 0.4 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full h-full flex flex-col items-center pt-32"
            >
              <div className="relative group flex-1 flex flex-col items-center justify-center w-full mt-12">
                {/* Glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-400/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <img
                  src={currentCar.image}
                  alt={currentCar.name}
                  className="max-w-full max-h-[35vh] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Car Info Box - Fixed at bottom */}
              <div className="w-full flex justify-center pb-12 px-4">
                <div className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-left">
                      <h3 className="text-xl md:text-2xl font-luckiest text-yellow-400 uppercase tracking-wider leading-none">
                        {currentCar.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <img src={TOKEN_ICON_URL} alt="Gettone" className="w-4 h-4 object-contain" />
                        <span className="text-sm font-luckiest text-green-400">{currentCar.price} GETTONI</span>
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={() => handlePurchase(currentCar)}
                      disabled={ownedCars.includes(currentCar.name)}
                      className={`px-6 py-2 rounded-full font-luckiest text-lg uppercase tracking-wider transition-all shadow-lg ${
                        ownedCars.includes(currentCar.name)
                          ? 'bg-green-500/50 text-white cursor-default'
                          : 'bg-yellow-400 hover:bg-yellow-300 text-blue-900 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {ownedCars.includes(currentCar.name) ? (
                        <div className="flex items-center gap-2">
                          <Check size={20} />
                          <span>Posseduta</span>
                        </div>
                      ) : (
                        'Acquista'
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <StatBar label="Velocità" value={currentCar.stats.speed} />
                    <StatBar label="Tenuta" value={currentCar.stats.grip} />
                    <StatBar label="Accelerazione" value={currentCar.stats.accel} />
                    <StatBar label="Frenata" value={currentCar.stats.braking} />
                    <StatBar label="Affidabilità" value={currentCar.stats.reliability} />
                    <StatBar label="Sicurezza" value={currentCar.stats.safety} />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Modals */}
      <AnimatePresence>
        {/* Garage Modal */}
        {isGarageOpen && (
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
              className="relative w-full max-w-4xl bg-stone-900 border-4 border-yellow-400 rounded-[3rem] overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-yellow-400">
                <h2 className="text-4xl font-luckiest text-blue-900 uppercase tracking-widest">Il Mio Garage</h2>
                <button 
                  onClick={() => setIsGarageOpen(false)}
                  className="p-2 bg-blue-900 text-white rounded-full hover:scale-110 transition-transform"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {ownedCars.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-white/40 gap-4">
                    <div className="w-24 h-24 border-4 border-dashed border-white/20 rounded-full flex items-center justify-center">
                      <X size={48} />
                    </div>
                    <p className="font-luckiest text-2xl uppercase">Garage Vuoto</p>
                    <p className="text-sm">Acquista la tua prima auto nella scuola di progettazione!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CAR_DATA.filter(car => ownedCars.includes(car.name)).map((car) => {
                      const stats = getCarStats(car.name) || car.stats;
                      return (
                        <motion.div
                          key={car.name}
                          whileHover={{ scale: 1.05 }}
                          className={`bg-white/5 border-2 rounded-3xl p-4 flex flex-col items-center gap-4 transition-colors cursor-pointer ${
                            selectedCar === car.name ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/10 hover:border-yellow-400/50'
                          }`}
                          onClick={() => {
                            setSelectedCar(car.name);
                            setSelectedCarState(car.name);
                          }}
                        >
                          <div className="w-full aspect-video bg-black/40 rounded-2xl flex items-center justify-center p-4">
                            <img src={car.image} alt={car.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <h4 className="font-luckiest text-xl text-white uppercase tracking-wider">{car.name}</h4>
                          
                          {/* Mini Stats Grid */}
                          <div className="grid grid-cols-2 gap-2 w-full">
                            {Object.entries(stats).map(([key, val]) => (
                              <div key={key} className="flex justify-between items-center bg-black/20 px-2 py-1 rounded text-[8px] uppercase font-bold text-white/60">
                                <span>{STAT_LABELS[key] || key}</span>
                                <span className="text-yellow-400">{val}</span>
                              </div>
                            ))}
                          </div>

                          <div className={`w-full py-2 rounded-xl text-center font-luckiest uppercase text-sm ${
                            selectedCar === car.name ? 'bg-green-500 text-white' : 'bg-yellow-400 text-blue-900'
                          }`}>
                            {selectedCar === car.name ? 'Selezionata' : 'Seleziona'}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Insufficient Funds Modal */}
        {isInsufficientFundsModalOpen && selectedCarForModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 5 }}
              className="w-full max-w-md bg-red-600 border-8 border-white rounded-[3rem] p-8 flex flex-col items-center text-center gap-6 shadow-[0_0_50px_rgba(239,68,68,0.5)]"
            >
              <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center p-6">
                <img src={selectedCarForModal.image} alt="Auto" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-4xl font-luckiest text-white uppercase tracking-tighter leading-none">Gettoni Insufficienti!</h2>
                <p className="text-white/80 font-medium">Ti servono {selectedCarForModal.price} gettoni per acquistare {selectedCarForModal.name}.</p>
              </div>

              <div className="flex items-center gap-3 bg-black/20 px-6 py-3 rounded-2xl">
                <span className="text-white/60 uppercase text-xs font-bold">Il tuo saldo:</span>
                <img src={TOKEN_ICON_URL} alt="Gettone" className="w-6 h-6" />
                <span className="text-2xl font-luckiest text-yellow-400">{userTokens}</span>
              </div>

              <button
                onClick={() => setIsInsufficientFundsModalOpen(false)}
                className="w-full bg-white text-red-600 py-4 rounded-2xl font-luckiest text-2xl uppercase hover:scale-105 transition-transform active:scale-95 shadow-xl"
              >
                Ho Capito
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GrayCityScuolaProgettazione;
