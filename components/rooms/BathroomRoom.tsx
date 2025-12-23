
import React, { useState } from 'react';
import { AppView } from '../../types';
import RoomLayout from './RoomLayout';
import { Construction, X, Droplets } from 'lucide-react';

const ZONES_MOBILE = [
  { "id": "vasca", "label": "Vasca Magica", "points": [{"x":1.6,"y":62.5},{"x":4.53,"y":81.06},{"x":42.11,"y":74.25},{"x":39.18,"y":57.05}] },
  { "id": "lavandino", "label": "Lavandino Splendente", "points": [{"x":55.17,"y":52.11},{"x":61.57,"y":72.04},{"x":71.7,"y":75.27},{"x":79.16,"y":53.64}] },
  { "id": "cesto", "label": "Cesto dei Panni", "points": [{"x":98.61,"y":76.29},{"x":89.29,"y":80.89},{"x":89.55,"y":99.46},{"x":99.41,"y":99.46}] },
  { "id": "shampoo", "label": "Bolle di Sapone", "points": [{"x":47.97,"y":77.49},{"x":47.44,"y":90.09},{"x":55.17,"y":90.6},{"x":55.7,"y":78.17}] }
];

const ZONES_DESKTOP = [
  { "id": "vasca", "label": "Vasca Magica", "points": [{"x":30.87,"y":67.28},{"x":34.48,"y":91.81},{"x":47.61,"y":83.03},{"x":47.71,"y":60.98}] },
  { "id": "lavandino", "label": "Lavandino Splendente", "points": [{"x":52.93,"y":56.93},{"x":55.43,"y":86.41},{"x":59.54,"y":87.76},{"x":62.55,"y":56.03}] },
  { "id": "shampoo", "label": "Bolle di Sapone", "points": [{"x":50.12,"y":87.31},{"x":49.82,"y":99.01},{"x":53.23,"y":99.01},{"x":53.33,"y":84.83}] },
  { "id": "cesto", "label": "Cesto dei Panni", "points": [{"x":65.56,"y":85.28},{"x":65.76,"y":98.11},{"x":74.38,"y":98.11},{"x":74.68,"y":85.28}] }
];

const UnderConstructionPage: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <div className="w-full h-full bg-white flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header della sottopagina - Sotto l'header principale */}
        <div className="bg-cyan-500 p-4 md:p-6 flex items-center gap-4 border-b-4 border-cyan-700 shrink-0 shadow-md">
            <button 
                onClick={onBack} 
                className="bg-white w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-transform flex items-center justify-center text-black shadow-lg"
                title="Torna in Bagno"
            >
                <X size={24} strokeWidth={4} className="text-black" />
            </button>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white drop-shadow-sm">{title}</h2>
        </div>

        {/* Contenuto centrato */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-cyan-50 relative overflow-hidden">
            <div className="absolute top-10 right-10 text-6xl opacity-10 animate-float">🧼</div>
            <div className="absolute bottom-10 left-10 text-6xl opacity-10 animate-float delay-700">🛁</div>
            <div className="absolute top-1/2 left-20 text-6xl opacity-5 animate-pulse">🫧</div>

            <div className="w-40 h-40 md:w-64 md:h-64 mb-6 bg-white rounded-full flex items-center justify-center border-4 border-dashed border-cyan-400 animate-pulse shadow-inner">
                <Droplets size={70} className="text-cyan-500" />
            </div>
            
            <h3 className="text-3xl md:text-6xl font-black text-gray-800 mb-4 uppercase tracking-tighter">Splash! Lavori in corso 🚧</h3>
            
            <p className="text-lg md:text-2xl font-bold text-gray-500 max-w-md leading-relaxed px-4">
                Boo sta riempiendo la vasca di bolle magiche. <br/>
                <span className="text-boo-purple font-black">Torna a trovarci presto!</span> 👻
            </p>
            
            <button 
                onClick={onBack}
                className="mt-12 bg-cyan-600 text-white font-black px-12 py-5 rounded-full border-4 border-black shadow-[6px_6px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none transition-all text-xl md:text-2xl uppercase"
            >
                INDIETRO
            </button>
        </div>
    </div>
);

const BathroomRoom: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [activePage, setActivePage] = useState<{ id: string, label: string } | null>(null);

    const handleZoneClick = (id: string, label: string) => {
        setActivePage({ id, label });
    };

    const getClipPath = (points: {x: number, y: number}[]) => `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    if (activePage) {
        return <UnderConstructionPage title={activePage.label} onBack={() => setActivePage(null)} />;
    }

    return (
        <RoomLayout roomType={AppView.BOO_BATHROOM} setView={setView} disableHint={true}>
            {/* Zone Cliccabili Mobile */}
            <div className="absolute inset-0 z-10 md:hidden">
                {ZONES_MOBILE.map(z => (
                    <div 
                        key={z.id} 
                        onClick={() => handleZoneClick(z.id, z.label)} 
                        className="absolute inset-0 cursor-pointer" 
                        style={{ clipPath: getClipPath(z.points) }}
                    ></div>
                ))}
            </div>
            
            {/* Zone Cliccabili Desktop */}
            <div className="absolute inset-0 z-10 hidden md:block">
                {ZONES_DESKTOP.map(z => (
                    <div 
                        key={z.id} 
                        onClick={() => handleZoneClick(z.id, z.label)} 
                        className="absolute inset-0 cursor-pointer hover:bg-white/10" 
                        style={{ clipPath: getClipPath(z.points) }}
                    ></div>
                ))}
            </div>
        </RoomLayout>
    );
};

export default BathroomRoom;
