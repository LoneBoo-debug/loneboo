
import React from 'react';
import { AppView } from '../../types';
import RoomLayout from './RoomLayout';

const BTN_CITY_GO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boocitygo88+(1).webp';

const GardenRoom: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    return (
        <RoomLayout roomType={AppView.BOO_GARDEN} setView={setView} disableHint={true}>
            <div className="w-full h-full relative">
                {/* Tasto Vai in Città in basso a sinistra - Dimensioni ridotte */}
                <div className="absolute bottom-6 left-6 z-40">
                    <button 
                        onClick={() => setView(AppView.CITY_MAP)}
                        className="hover:scale-110 active:scale-95 transition-all outline-none"
                        title="Vai alla Mappa della Città"
                    >
                        <img 
                            src={BTN_CITY_GO} 
                            alt="Vai in Città" 
                            className="w-32 md:w-56 h-auto drop-shadow-2xl" 
                        />
                    </button>
                </div>
            </div>
        </RoomLayout>
    );
};

export default GardenRoom;
