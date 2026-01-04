
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
 * In produzione aggiungiamo un parametro di versione (?v=...) per forzare S3 
 * a servire l'immagine fresca ed evitare errori di cache/CORS del passato.
 */
export const getAsset = (url: string): string => {
  if (!url) return "";
  
  // Se è un percorso locale relativo, lo teniamo così com'è
  if (url.startsWith('assets/') || url.startsWith('/assets/')) return url;

  // Se è un URL di AWS S3, aggiungiamo il cache-buster
  if (url.includes('amazonaws.com')) {
      const separator = url.includes('?') ? '&' : '?';
      // Cambiando questo numero (es. 1.1) forziamo il refresh totale di tutte le immagini
      return `${url}${separator}v=1.0.1`;
  }

  try {
      const forceLocal = localStorage.getItem('force_local_assets') === 'true';
      if (forceLocal && LOCAL_ASSET_MAP[url]) {
          return LOCAL_ASSET_MAP[url];
      }
  } catch (e) {}

  return url;
};
