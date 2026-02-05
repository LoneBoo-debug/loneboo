
/**
 * WakeLockService v2.0 - Produzione Lone Boo
 * Gestisce la Screen Wake Lock API per prevenire lo spegnimento dello schermo.
 */

let wakeLock: any = null;

/**
 * Richiede il blocco dello spegnimento dello schermo.
 */
export const requestWakeLock = async () => {
  if ('wakeLock' in navigator) {
    try {
      // @ts-ignore - API moderna non ancora presente in tutti i tipi TS standard
      wakeLock = await navigator.wakeLock.request('screen');
      
      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock rilasciato dal sistema');
        wakeLock = null;
      });
      
      console.log('Screen Wake Lock attivo: lo schermo resterà acceso! ✨');
    } catch (err: any) {
      // Spesso fallisce se il dispositivo è in modalità risparmio energetico
      console.warn(`Impossibile attivare il Wake Lock: ${err.name}, ${err.message}`);
    }
  } else {
    console.warn('La Screen Wake Lock API non è supportata da questo browser.');
  }
};

/**
 * Rilascia manualmente il blocco.
 */
export const releaseWakeLock = async () => {
  if (wakeLock !== null) {
    try {
      await wakeLock.release();
      wakeLock = null;
      console.log('Wake Lock rilasciato manualmente');
    } catch (err) {
      console.error('Errore nel rilascio del Wake Lock', err);
    }
  }
};

/**
 * Gestore per il cambio di visibilità della pagina.
 * Il browser rilascia il lock se cambiamo tab o app, quindi dobbiamo richiederlo di nuovo.
 */
const handleVisibilityChange = async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
};

// Aggiungiamo l'ascoltatore per il cambio di visibilità
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', handleVisibilityChange);
}
