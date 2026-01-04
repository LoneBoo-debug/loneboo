
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

  useEffect(() => {
    setCurrentSrc(getAsset(src));
  }, [src]);

  const handleError = () => {
    console.error(`Errore caricamento asset: ${src}`);
    // In caso di errore, assicuriamoci di riprovare l'URL originale senza modifiche
    if (currentSrc !== src) {
      setCurrentSrc(src);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="eager"
      decoding="async"
      {...props}
    />
  );
};

export default OptimizedImage;
