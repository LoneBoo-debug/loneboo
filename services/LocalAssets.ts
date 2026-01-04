
export const LOCAL_ASSET_MAP: Record<string, string> = {
  "https://loneboo-images.s3.eu-south-1.amazonaws.com/logo-main.webp": "assets/images/ui/logo-main.webp",
  "https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-city.webp": "assets/images/ui/btn-city.webp",
  "https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-house.webp": "assets/images/ui/btn-house.webp",
  "https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-concorso.webp": "assets/images/ui/btn-contest.webp",
  "https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp": "assets/images/ui/btn-close.webp",
  "https://loneboo-images.s3.eu-south-1.amazonaws.com/header-title.webp": "assets/images/ui/header-title.webp"
};

/**
 * Restituisce l'URL dell'asset. 
 * Se siamo in produzione o se non abbiamo specificato di usare asset locali,
 * restituisce sempre il link originale S3.
 */
export const getAsset = (url: string): string => {
  if (!url) return "";
  
  // Se è già un percorso relativo locale, non toccarlo
  if (url.startsWith('assets/') || url.startsWith('/assets/')) return url;

  // Usa asset locali solo se esplicitamente richiesto (modalità debug/offline)
  try {
      const forceLocal = localStorage.getItem('force_local_assets') === 'true';
      if (forceLocal && LOCAL_ASSET_MAP[url]) {
          return LOCAL_ASSET_MAP[url];
      }
  } catch (e) {}

  // DEFAULT: Sempre URL S3 (Garantisce visibilità)
  return url;
};
