
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
  // getAsset(src) restituisce già l'URL con il parametro ?v=...
  const [currentSrc, setCurrentSrc] = useState<string>(getAsset(src));
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {
    setCurrentSrc(getAsset(src));
    setRetryAttempt(0);
  }, [src]);

  const handleError = () => {
    // Se l'immagine fallisce (molto probabile cache sporca o CORS transitorio)
    // riproviamo una sola volta aggiungendo un timestamp unico
    if (retryAttempt < 1) {
      console.warn(`Tentativo di ripristino per: ${src}`);
      const separator = src.includes('?') ? '&' : '?';
      setCurrentSrc(`${src}${separator}retry=${Date.now()}`);
      setRetryAttempt(1);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="eager" // Cambiato da lazy a eager per velocizzare la visualizzazione critica
      decoding="async"
      {...props}
    />
  );
};

export default OptimizedImage;
