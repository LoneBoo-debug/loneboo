
/**
 * WakeLockService v1.0
 * Gestisce la Screen Wake Lock API per prevenire lo spegnimento dello schermo.
 */

let wakeLock: any = null;

export const requestWakeLock = async () => {
  if ('wakeLock' in navigator) {
    try {
      // @ts-ignore - API sperimentale/moderna
      wakeLock = await navigator.wakeLock.request('screen');
      
      // Listener per il rilascio automatico da parte del sistema (es. batteria scarica)
      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock rilasciato dal sistema');
        wakeLock = null;
      });
      
      console.log('Wake Lock attivo: lo schermo resterà acceso ✨');
    } catch (err: any) {
      console.warn(`Impossibile attivare il Wake Lock: ${err.name}, ${err.message}`);
    }
  } else {
    console.warn('La Screen Wake Lock API non è supportata da questo browser.');
  }
};

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
