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
    { id: 'agata', name: 'Agata', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/agata.webp', traits: { DONNA: true, CAPELLI_LUNGHI: true, SORRISO: true, MORO: true, CODA: true, MAGLIA_ROSSA: true } },
    { id: 'alessandro', name: 'Alessandro', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/alessandro.webp', traits: { UOMO: true, CAPPELLO: true, ORECCHINI: true, BARBA: true, MORO: true, GIUBBOTTO: true } },
    { id: 'anna', name: 'Anna', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/anna.webp', traits: { DONNA: true, OCCHIALI: true, CAPPELLO: true, BIONDO: true, MAGLIA_BLU: true } },
    { id: 'bea', name: 'Bea', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bea.webp', traits: { DONNA: true, CAPELLI_LUNGHI: true, OCCHIALI: true, CAPPELLO: true, MORO: true, TRECCE: true, SALOPETTE: true } },
    { id: 'chiara', name: 'Chiara', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/chiara.webp', traits: { DONNA: true, CAPELLI_LUNGHI: true, OCCHIALI: true, SORRISO: true, CAPPELLO: true, BIONDO: true, MAGLIA_GIALLA: true } },
    { id: 'clara', name: 'Clara', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/clara.webp', traits: { DONNA: true, SORRISO: true, ORECCHINI: true, CAPPELLO: true, OCCHIALI: true, MORO: true, CODA: true } },
    { id: 'corinna', name: 'Corinna', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/corinna.webp', traits: { DONNA: true, OCCHIALI: true, ORECCHINI: true, SORRISO: true, CAPELLI_ROSSI: true, MAGLIA_VERDE: true } },
    { id: 'davide', name: 'Davide', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/davide.webp', traits: { UOMO: true, CAPPELLO: true, BAFFI: true, MORO: true, GIUBBOTTO: true } },
    { id: 'diletta', name: 'Diletta', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diletta.webp', traits: { DONNA: true, ORECCHINI: true, CAPPELLO: true, SORRISO: true, BIONDO: true, CODA: true, SALOPETTE: true } },
    { id: 'elena', name: 'Elena', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elena.webp', traits: { DONNA: true, SORRISO: true, ORECCHINI: true, CAPPELLO: true, CAPELLI_LUNGHI: true, MORO: true, TRECCE: true } },
    { id: 'fausto', name: 'Fausto', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fausto.webp', traits: { UOMO: true, CAPPELLO: true, BAFFI: true, SORRISO: true, MORO: true, MAGLIA_ROSSA: true } },
    { id: 'federico', name: 'Federico', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/federico.webp', traits: { UOMO: true, BAFFI: true, OCCHIALI: true, SENZA_CAPELLI: true, GIUBBOTTO: true } },
    { id: 'felice', name: 'Felice', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/felice.webp', traits: { UOMO: true, ANZIANO: true, BARBA: true, BAFFI: true, OCCHIALI: true, CAPPELLO: true, MORO: true } },
    { id: 'francesco', name: 'Francesco', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/francesco.webp', traits: { UOMO: true, BAFFI: true, CAPPELLO: true, MORO: true, MAGLIA_BLU: true } },
    { id: 'gabriella', name: 'Gabriella', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gabriella.webp', traits: { BAMBINO: true, DONNA: true, OCCHIALI: true, SORRISO: true, CAPELLI_LUNGHI: true, BIONDO: true, TRECCE: true } },
    { id: 'geppo', name: 'Geppo', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/geppo.webp', traits: { UOMO: true, ANZIANO: true, BARBA: true, BAFFI: true, SENZA_CAPELLI: true, MAGLIA_VERDE: true } },
    { id: 'gianni', name: 'Gianni', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gianni.webp', traits: { UOMO: true, OCCHIALI: true, BARBA: true, BAFFI: true, SENZA_CAPELLI: true, GIUBBOTTO: true } },
    { id: 'gina', name: 'Gina', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gina.webp', traits: { DONNA: true, CAPPELLO: true, CAPELLI_LUNGHI: true, MORO: true, SALOPETTE: true } },
    { id: 'gino', name: 'Gino', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gino.webp', traits: { UOMO: true, SENZA_CAPELLI: true, BARBA: true, BAFFI: true, SORRISO: true, MAGLIA_GIALLA: true } },
    { id: 'giulia', name: 'Giulia', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giulia.webp', traits: { DONNA: true, CAPELLI_LUNGHI: true, ORECCHINI: true, SORRISO: true, CAPELLI_ROSSI: true, CODA: true } },
    { id: 'igor', name: 'Igor', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/igor.webp', traits: { UOMO: true, BAFFI: true, SORRISO: true, MORO: true, MAGLIA_ROSSA: true } },
    { id: 'ivan', name: 'Ivan', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ivan.webp', traits: { UOMO: true, BARBA: true, BAFFI: true, OCCHIALI: true, CAPELLI_LUNGHI: true, MORO: true } },
    { id: 'liza', name: 'Liza', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/liza.webp', traits: { DONNA: true, CAPELLI_LUNGHI: true, SORRISO: true, BIONDO: true, MAGLIA_BLU: true } },
    { id: 'laura_b', name: 'Laura', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/laura_b.webp', traits: { BAMBINO: true, DONNA: true, CAPELLI_LUNGHI: true, SORRISO: true, MORO: true, TRECCE: true, SALOPETTE: true } },
    { id: 'leo', name: 'Leo', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/leo.webp', traits: { BAMBINO: true, UOMO: true, OCCHIALI: true, SORRISO: true, BIONDO: true, MAGLIA_VERDE: true } },
    { id: 'luca', name: 'Luca', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/luca.webp', traits: { UOMO: true, OCCHIALI: true, BARBA: true, BAFFI: true, CAPPELLO: true, MORO: true, GIUBBOTTO: true } },
    { id: 'luigi', name: 'Luigi', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/luigi.webp', traits: { UOMO: true, BARBA: true, BAFFI: true, OCCHIALI: true, SORRISO: true, CAPELLI_ROSSI: true } },
    { id: 'marco', name: 'Marco', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/marco.webp', traits: { UOMO: true, OCCHIALI: true, BAFFI: true, SORRISO: true, MORO: true, MAGLIA_GIALLA: true } },
    { id: 'martina', name: 'Martina', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/martina.webp', traits: { DONNA: true, OCCHIALI: true, ORECCHINI: true, BIONDO: true, CODA: true } },
    { id: 'matteo', name: 'Matteo', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/matteo.webp', traits: { BAMBINO: true, UOMO: true, SORRISO: true, SENZA_CAPELLI: true, SALOPETTE: true } },
    { id: 'paolo', name: 'Paolo', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/paolo.webp', traits: { UOMO: true, CAPPELLO: true, ORECCHINI: true, SORRISO: true, BARBA: true, MORO: true, GIUBBOTTO: true } },
    { id: 'peppe', name: 'Peppe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/peppe.webp', traits: { UOMO: true, ANZIANO: true, BARBA: true, BAFFI: true, SORRISO: true, MORO: true, MAGLIA_ROSSA: true } },
    { id: 'roberto', name: 'Roberto', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/roberto.webp', traits: { UOMO: true, CAPPELLO: true, SORRISO: true, BARBA: true, MORO: true, MAGLIA_BLU: true } },
    { id: 'rosa', name: 'Rosa', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rosa.webp', traits: { DONNA: true, ANZIANO: true, SORRISO: true, ORECCHINI: true, CAPELLI_ROSSI: true, CODA: true } },
    { id: 'sara', name: 'Sara', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sara.webp', traits: { DONNA: true, ORECCHINI: true, CAPPELLO: true, CAPELLI_LUNGHI: true, SORRISO: true, BIONDO: true, TRECCE: true, SALOPETTE: true } },
    { id: 'sergio', name: 'Sergio', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sergio.webp', traits: { BAMBINO: true, UOMO: true, CAPPELLO: true, SORRISO: true, MORO: true, MAGLIA_VERDE: true } },
    { id: 'sofia', name: 'Sofia', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sofia.webp', traits: { DONNA: true, CAPPELLO: true, CAPELLI_LUNGHI: true, ORECCHINI: true, SORRISO: true, BIONDO: true, MAGLIA_GIALLA: true } },
    { id: 'ugo', name: 'Ugo', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ugo.webp', traits: { UOMO: true, OCCHIALI: true, ORECCHINI: true, SORRISO: true, BARBA: true, MORO: true, GIUBBOTTO: true } },
    { id: 'vicky', name: 'Vicky', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vicky.webp', traits: { DONNA: true, SORRISO: true, ORECCHINI: true, CAPELLI_LUNGHI: true, CAPELLI_ROSSI: true, TRECCE: true } },
    { id: 'zoe', name: 'Zoe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zoe.webp', traits: { BAMBINO: true, DONNA: true, CAPPELLO: true, CAPELLI_LUNGHI: true, SORRISO: true, ORECCHINI: true, BIONDO: true, CODA: true, SALOPETTE: true } },
];