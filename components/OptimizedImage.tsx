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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(getAsset(src));
    setHasError(false);
  }, [src]);

  const handleError = () => {
    // Se il percorso locale fallisce, proviamo l'URL remoto originale
    if (!hasError && currentSrc !== src) {
      console.log("Asset locale mancante, uso fallback remoto per:", alt);
      setCurrentSrc(src);
      setHasError(true);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default OptimizedImage;