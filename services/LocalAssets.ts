
/**
 * Servizio Asset V15 - Produzione Play Store
 * Gestisce la risoluzione degli asset garantendo compatibilità con TWA e Service Worker.
 */
export const LOCAL_ASSET_MAP: Record<string, string> = {
  // Mappa gestita dinamicamente dal Service Worker
};

export const getAsset = (url: string): string => {
  if (!url) return "";
  
  // Se è già un percorso locale relativo, lo manteniamo
  if (url.startsWith('assets/') || url.startsWith('/assets/')) return url;

  // Garantiamo che l'URL sia pulito per evitare problemi di encoding in Android WebView
  return url.trim().replace(/ /g, '%20');
};
