export type Trait = 
    | 'CAPPELLO' | 'OCCHIALI' | 'CAPELLI_LUNGHI' | 'ORECCHINI' 
    | 'SORRISO' | 'UOMO' | 'DONNA' | 'BAMBINO' | 'ANZIANO' 
    | 'BARBA' | 'BAFFI' | 'SENZA_CAPELLI'
    | 'BIONDO' | 'MORO' | 'CAPELLI_ROSSI' | 'TRECCE' | 'CODA' 
    | 'SALOPETTE' | 'GIUBBOTTO' | 'MAGLIA_ROSSA' | 'MAGLIA_BLU' 
    | 'MAGLIA_VERDE' | 'MAGLIA_GIALLA';

export interface GuessWhoCharacter {
    id: string;
    name: string;
    image: string;
    traits: Partial<Record<Trait, boolean>>;
}

export const GW_DATABASE: GuessWhoCharacter[] = [
    { id: 'agata', name: 'Agata', image: 'https://i.postimg.cc/t4WmQsZK/agata.png', traits: { DONNA: true, CAPELLI_LUNGHI: true, SORRISO: true, MORO: true, CODA: true, MAGLIA_ROSSA: true } },
    { id: 'alessandro', name: 'Alessandro', image: 'https://i.postimg.cc/FRRZRzzH/alessandro.jpg', traits: { UOMO: true, CAPPELLO: true, ORECCHINI: true, BARBA: true, MORO: true, GIUBBOTTO: true } },
    { id: 'anna', name: 'Anna', image: 'https://i.postimg.cc/t4vdcy29/anna.jpg', traits: { DONNA: true, OCCHIALI: true, CAPPELLO: true, BIONDO: true, MAGLIA_BLU: true } },
    { id: 'bea', name: 'Bea', image: 'https://i.postimg.cc/brq2JF3N/bea.png', traits: { DONNA: true, CAPELLI_LUNGHI: true, OCCHIALI: true, CAPPELLO: true, MORO: true, TRECCE: true, SALOPETTE: true } },
    { id: 'chiara', name: 'Chiara', image: 'https://i.postimg.cc/NjK25Xkw/chiara.jpg', traits: { DONNA: true, CAPELLI_LUNGHI: true, OCCHIALI: true, SORRISO: true, CAPPELLO: true, BIONDO: true, MAGLIA_GIALLA: true } },
    { id: 'clara', name: 'Clara', image: 'https://i.postimg.cc/hvChG4JS/clara.png', traits: { DONNA: true, SORRISO: true, ORECCHINI: true, CAPPELLO: true, OCCHIALI: true, MORO: true, CODA: true } },
    { id: 'corinna', name: 'Corinna', image: 'https://i.postimg.cc/PxTqzvYs/corinna.png', traits: { DONNA: true, OCCHIALI: true, ORECCHINI: true, SORRISO: true, CAPELLI_ROSSI: true, MAGLIA_VERDE: true } },
    { id: 'davide', name: 'Davide', image: 'https://i.postimg.cc/gcM08JJW/davide.jpg', traits: { UOMO: true, CAPPELLO: true, BAFFI: true, MORO: true, GIUBBOTTO: true } },
    { id: 'diletta', name: 'Diletta', image: 'https://i.postimg.cc/YSfr92ZB/diletta.png', traits: { DONNA: true, ORECCHINI: true, CAPPELLO: true, SORRISO: true, BIONDO: true, CODA: true, SALOPETTE: true } },
    { id: 'elena', name: 'Elena', image: 'https://i.postimg.cc/gjrmNVJP/elena.jpg', traits: { DONNA: true, SORRISO: true, ORECCHINI: true, CAPPELLO: true, CAPELLI_LUNGHI: true, MORO: true, TRECCE: true } },
    { id: 'fausto', name: 'Fausto', image: 'https://i.postimg.cc/x1LYxT0z/fausto.jpg', traits: { UOMO: true, CAPPELLO: true, BAFFI: true, SORRISO: true, MORO: true, MAGLIA_ROSSA: true } },
    { id: 'federico', name: 'Federico', image: 'https://i.postimg.cc/T1ZM0BFG/federico.png', traits: { UOMO: true, BAFFI: true, OCCHIALI: true, SENZA_CAPELLI: true, GIUBBOTTO: true } },
    { id: 'felice', name: 'Felice', image: 'https://i.postimg.cc/W1cckLMP/felice.png', traits: { UOMO: true, ANZIANO: true, BARBA: true, BAFFI: true, OCCHIALI: true, CAPPELLO: true, MORO: true } },
    { id: 'francesco', name: 'Francesco', image: 'https://i.postimg.cc/NF2ZKpF0/francesco.jpg', traits: { UOMO: true, BAFFI: true, CAPPELLO: true, MORO: true, MAGLIA_BLU: true } },
    { id: 'gabriella', name: 'Gabriella', image: 'https://i.postimg.cc/s2DjMCrj/gabriella.png', traits: { BAMBINO: true, DONNA: true, OCCHIALI: true, SORRISO: true, CAPELLI_LUNGHI: true, BIONDO: true, TRECCE: true } },
    { id: 'geppo', name: 'Geppo', image: 'https://i.postimg.cc/wBvz65X9/geppo.png', traits: { UOMO: true, ANZIANO: true, BARBA: true, BAFFI: true, SENZA_CAPELLI: true, MAGLIA_VERDE: true } },
    { id: 'gianni', name: 'Gianni', image: 'https://i.postimg.cc/qBnTMv38/gianni.jpg', traits: { UOMO: true, OCCHIALI: true, BARBA: true, BAFFI: true, SENZA_CAPELLI: true, GIUBBOTTO: true } },
    { id: 'gina', name: 'Gina', image: 'https://i.postimg.cc/jS8VkWpq/gina.jpg', traits: { DONNA: true, CAPPELLO: true, CAPELLI_LUNGHI: true, MORO: true, SALOPETTE: true } },
    { id: 'gino', name: 'Gino', image: 'https://i.postimg.cc/kMW0PY0x/gino.png', traits: { UOMO: true, SENZA_CAPELLI: true, BARBA: true, BAFFI: true, SORRISO: true, MAGLIA_GIALLA: true } },
    { id: 'giulia', name: 'Giulia', image: 'https://i.postimg.cc/cJKz9F7n/giulia.jpg', traits: { DONNA: true, CAPELLI_LUNGHI: true, ORECCHINI: true, SORRISO: true, CAPELLI_ROSSI: true, CODA: true } },
    { id: 'igor', name: 'Igor', image: 'https://i.postimg.cc/52r7CwcM/igor.png', traits: { UOMO: true, BAFFI: true, SORRISO: true, MORO: true, MAGLIA_ROSSA: true } },
    { id: 'ivan', name: 'Ivan', image: 'https://i.postimg.cc/cCdXSh3V/ivan.png', traits: { UOMO: true, BARBA: true, BAFFI: true, OCCHIALI: true, CAPELLI_LUNGHI: true, MORO: true } },
    { id: 'laura_r', name: 'Laura', image: 'https://i.postimg.cc/4xjPdstb/laura.jpg', traits: { DONNA: true, CAPELLI_LUNGHI: true, SORRISO: true, BIONDO: true, MAGLIA_BLU: true } },
    { id: 'laura_b', name: 'Laura', image: 'https://i.postimg.cc/59pmzwLX/laura.png', traits: { BAMBINO: true, DONNA: true, CAPELLI_LUNGHI: true, SORRISO: true, MORO: true, TRECCE: true, SALOPETTE: true } },
    { id: 'leo', name: 'Leo', image: 'https://i.postimg.cc/yYk0S27f/leo.png', traits: { BAMBINO: true, UOMO: true, OCCHIALI: true, SORRISO: true, BIONDO: true, MAGLIA_VERDE: true } },
    { id: 'luca', name: 'Luca', image: 'https://i.postimg.cc/C5tBNLwN/luca.jpg', traits: { UOMO: true, OCCHIALI: true, BARBA: true, BAFFI: true, CAPPELLO: true, MORO: true, GIUBBOTTO: true } },
    { id: 'luigi', name: 'Luigi', image: 'https://i.postimg.cc/1t7fm5Vm/luigi.jpg', traits: { UOMO: true, BARBA: true, BAFFI: true, OCCHIALI: true, SORRISO: true, CAPELLI_ROSSI: true } },
    { id: 'marco', name: 'Marco', image: 'https://i.postimg.cc/zBvGcZtT/marco.jpg', traits: { UOMO: true, OCCHIALI: true, BAFFI: true, SORRISO: true, MORO: true, MAGLIA_GIALLA: true } },
    { id: 'martina', name: 'Martina', image: 'https://i.postimg.cc/3rygkP8n/martina.jpg', traits: { DONNA: true, OCCHIALI: true, ORECCHINI: true, BIONDO: true, CODA: true } },
    { id: 'matteo', name: 'Matteo', image: 'https://i.postimg.cc/3wSvRZzm/matteo.jpg', traits: { BAMBINO: true, UOMO: true, SORRISO: true, SENZA_CAPELLI: true, SALOPETTE: true } },
    { id: 'paolo', name: 'Paolo', image: 'https://i.postimg.cc/FHhdVqv5/paolo.jpg', traits: { UOMO: true, CAPPELLO: true, ORECCHINI: true, SORRISO: true, BARBA: true, MORO: true, GIUBBOTTO: true } },
    { id: 'peppe', name: 'Peppe', image: 'https://i.postimg.cc/vTdHHg80/peppe.png', traits: { UOMO: true, ANZIANO: true, BARBA: true, BAFFI: true, SORRISO: true, MORO: true, MAGLIA_ROSSA: true } },
    { id: 'roberto', name: 'Roberto', image: 'https://i.postimg.cc/L5TR9xbj/roberto.jpg', traits: { UOMO: true, CAPPELLO: true, SORRISO: true, BARBA: true, MORO: true, MAGLIA_BLU: true } },
    { id: 'rosa', name: 'Rosa', image: 'https://i.postimg.cc/x1krhjn3/rosa.jpg', traits: { DONNA: true, ANZIANO: true, SORRISO: true, ORECCHINI: true, CAPELLI_ROSSI: true, CODA: true } },
    { id: 'sara', name: 'Sara', image: 'https://i.postimg.cc/ZRHD0X4G/sara.jpg', traits: { DONNA: true, ORECCHINI: true, CAPPELLO: true, CAPELLI_LUNGHI: true, SORRISO: true, BIONDO: true, TRECCE: true, SALOPETTE: true } },
    { id: 'sergio', name: 'Sergio', image: 'https://i.postimg.cc/GmD7v4b6/sergio.png', traits: { BAMBINO: true, UOMO: true, CAPPELLO: true, SORRISO: true, MORO: true, MAGLIA_VERDE: true } },
    { id: 'sofia', name: 'Sofia', image: 'https://i.postimg.cc/fRYCJ1v7/sofia.jpg', traits: { DONNA: true, CAPPELLO: true, CAPELLI_LUNGHI: true, ORECCHINI: true, SORRISO: true, BIONDO: true, MAGLIA_GIALLA: true } },
    { id: 'ugo', name: 'Ugo', image: 'https://i.postimg.cc/YCBfKbwQ/ugo.png', traits: { UOMO: true, OCCHIALI: true, ORECCHINI: true, SORRISO: true, BARBA: true, MORO: true, GIUBBOTTO: true } },
    { id: 'vicky', name: 'Vicky', image: 'https://i.postimg.cc/vT69C62F/vicky.png', traits: { DONNA: true, SORRISO: true, ORECCHINI: true, CAPELLI_LUNGHI: true, CAPELLI_ROSSI: true, TRECCE: true } },
    { id: 'zoe', name: 'Zoe', image: 'https://i.postimg.cc/wj92R04C/zoe.jpg', traits: { BAMBINO: true, DONNA: true, CAPPELLO: true, CAPELLI_LUNGHI: true, SORRISO: true, ORECCHINI: true, BIONDO: true, CODA: true, SALOPETTE: true } },
];