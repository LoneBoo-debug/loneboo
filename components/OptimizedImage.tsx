
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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setCurrentSrc(getAsset(src));
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    // Se l'immagine fallisce, proviamo l'URL originale senza filtri
    if (retryCount < 1) {
      console.warn(`Asset fallito: ${currentSrc}. Tento ripristino sorgente diretta.`);
      setCurrentSrc(src);
      setRetryCount(1);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      // crossOrigin rimosso per evitare blocchi del browser su normali immagini UI
      {...props}
    />
  );
};

export default OptimizedImage;
