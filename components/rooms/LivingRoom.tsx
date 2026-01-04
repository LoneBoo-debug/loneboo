
import React from 'react';
import { AppView } from '../../types';
import RoomLayout from './RoomLayout';

const ZONES_MOBILE = [
  { "id": "tv", "points": [ { "x": 21.06, "y": 41.21 }, { "x": 20.52, "y": 57.05 }, { "x": 40.51, "y": 54.33 }, { "x": 39.98, "y": 41.04 } ] },
  { "id": "radio", "points": [ { "x": 0.8, "y": 19.41 }, { "x": 0.27, "y": 29.12 }, { "x": 16.52, "y": 29.12 }, { "x": 16.52, "y": 20.78 } ] },
  { "id": "chi_sono", "points": [ { "x": 0.27, "y": 36.61 }, { "x": 0, "y": 46.66 }, { "x": 6.93, "y": 45.98 }, { "x": 6.13, "y": 36.44 } ] },
  { "id": "amici", "points": [ { "x": 40.78, "y": 70.33 }, { "x": 50.91, "y": 73.74 }, { "x": 59.97, "y": 71.36 }, { "x": 50.91, "y": 67.1 } ] },
  { "id": "libri", "points": [ { "x": 61.57, "y": 62.16 }, { "x": 57.04, "y": 66.59 }, { "x": 66.36, "y": 68.8 }, { "x": 71.43, "y": 63.86 } ] }
];

const ZONES_DESKTOP = [
  { "id": "radio", "points": [{"x":31.17,"y":10.8},{"x":30.77,"y":24.98},{"x":38.09,"y":26.1},{"x":37.89,"y":12.83}] },
  { "id": "tv", "points": [{"x":38.29,"y":39.6},{"x":37.99,"y":59.63},{"x":46.51,"y":56.26},{"x":46.91,"y":39.15}] },
  { "id": "chi_sono", "points": [{"x":29.87,"y":33.98},{"x":33.58,"y":33.53},{"x":34.28,"y":46.13},{"x":30.47,"y":47.7}] },
  { "id": "amici", "points": [{"x":46.81,"y":76.06},{"x":50.12,"y":81.01},{"x":54.13,"y":76.73},{"x":50.32,"y":72.46}] },
  { "id": "libri", "points": [{"x":53.83,"y":65.71},{"x":53.23,"y":72.23},{"x":56.54,"y":74.26},{"x":58.14,"y":67.73}] }
];

const LivingRoom: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const handleZoneClick = (id: string) => {
        if (id === 'tv') setView(AppView.VIDEOS);
        else if (id === 'radio') window.open('https://open.spotify.com/intl-it/artist/3RVol8TV5OleEGTcP5tdau', '_blank');
        else if (id === 'chi_sono') setView(AppView.INTRO);
        else if (id === 'amici') setView(AppView.CHARACTERS);
        else if (id === 'libri') setView(AppView.BOOKS_LIST);
    };

    const getClipPath = (points: {x: number, y: number}[]) => `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    return (
        <RoomLayout roomType={AppView.BOO_LIVING_ROOM} setView={setView} disableHint={true}>
            <div className="absolute inset-0 z-10 md:hidden">
                {ZONES_MOBILE.map(z => (
                    <div 
                        key={z.id} 
                        onClick={() => handleZoneClick(z.id)} 
                        className="absolute inset-0 cursor-pointer active:bg-white/10" 
                        style={{ clipPath: getClipPath(z.points) }}
                    ></div>
                ))}
            </div>
            <div className="absolute inset-0 z-10 hidden md:block">
                {ZONES_DESKTOP.map(z => (
                    <div 
                        key={z.id} 
                        onClick={() => handleZoneClick(z.id)} 
                        className="absolute inset-0 cursor-pointer hover:bg-white/10 transition-colors" 
                        style={{ clipPath: getClipPath(z.points) }}
                    ></div>
                ))}
            </div>
        </RoomLayout>
    );
};

export default LivingRoom;
