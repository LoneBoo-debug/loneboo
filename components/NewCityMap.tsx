
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppView } from '../types';

const NewCityMapMobile = lazy(() => import('./NewCityMapMobile'));
const NewCityMapDesktop = lazy(() => import('./NewCityMapDesktop'));

interface NewCityMapProps {
    setView: (view: AppView) => void;
}

const NewCityMap: React.FC<NewCityMapProps> = ({ setView }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden select-none touch-none overscroll-none bg-black">
            <Suspense fallback={null}>
                {isMobile ? (
                    <NewCityMapMobile setView={setView} />
                ) : (
                    <NewCityMapDesktop setView={setView} />
                )}
            </Suspense>
        </div>
    );
};

export default NewCityMap;
