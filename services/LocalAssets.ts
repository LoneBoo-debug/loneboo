
/**
 * Servizio Asset V14 - Produzione
 * Restituisce l'URL dell'asset garantendo la compatibilità con AWS S3.
 */
export const LOCAL_ASSET_MAP: Record<string, string> = {
  // Mappa svuotata per dare priorità assoluta ai link remoti originali
};

export const getAsset = (url: string): string => {
  if (!url) return "";
  
  // Se è già un percorso locale relativo, lo manteniamo
  if (url.startsWith('assets/') || url.startsWith('/assets/')) return url;

  // RITORNO DIRETTO: 
  // Non aggiungiamo ?v= o altri parametri che potrebbero causare 403 Forbidden su S3
  return url;
};
