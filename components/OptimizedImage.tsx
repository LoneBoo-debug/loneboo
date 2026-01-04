
import React, { useState, useEffect } from 'react';
import { getAsset } from '../services/LocalAssets';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(getAsset(src));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const newSrc = getAsset(src);
    if (newSrc !== currentSrc) {
      setCurrentSrc(newSrc);
      setIsLoaded(false);
    }
  }, [src, currentSrc]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        className={`
          w-full h-full transition-all duration-700 ease-out
          ${isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'}
        `}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          console.error("ERRORE CARICAMENTO IMMAGINE S3:", src);
          if (currentSrc !== src) {
            setCurrentSrc(src);
          }
          setIsLoaded(true);
        }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
