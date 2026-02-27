export interface HatItem {
    id: string;
    name: string;
    img: string;
}

export interface HatRecipe {
    name: string;
    img: string;
    desc: string;
}

// --- DATABASE OGGETTI INPUT ---
export const HAT_INPUT_ITEMS: HatItem[] = [
    { id: 'aereo', name: 'Aereo', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo.webp' },
    { id: 'auto', name: 'Automobile', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auoxx.webp' },
    { id: 'cane', name: 'Cagnolino', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/canexx.webp' },
    { id: 'coniglio', name: 'Coniglietto', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/conixx.webp' },
    { id: 'fantasma', name: 'Fantasma', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantaxx.webp' },
    { id: 'elefante', name: 'Elefante', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantexx.webp' },
    { id: 'frigorifero', name: 'Frigorifero', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo.webp' },
    { id: 'frullatore', name: 'Frullatore', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullaxx.webp' },
    { id: 'gatto', name: 'Gattino', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gattoxx.webp' },
    { id: 'giraffa', name: 'Giraffa', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giraffaxx.webp' },
    { id: 'gufo', name: 'Gufo', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gufoxx.webp' },
    { id: 'monopattino', name: 'Monopattino', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/monoxx.webp' },
    { id: 'orso', name: 'Orsetto', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/orsoxx.webp' },
    { id: 'poltrona', name: 'Poltrona', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/poltroxx.webp' },
    { id: 'ragno', name: 'Ragnetto', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ragnoxx.webp' },
    { id: 'ruota', name: 'Ruota', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ruota.webp' },
    { id: 'sedia', name: 'Sedia', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sedia.webp' },
    { id: 'tavolo', name: 'Tavolo', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tavolo.webp' },
    { id: 'topo', name: 'Topolino', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/topoxx.webp' },
    { id: 'tv', name: 'Televisore', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tvxxx.webp' }
];

// --- DATABASE RICETTE ---
// I percorsi ora puntano correttamente alla cartella public (mappata come /assets/...)
export const HAT_RECIPES: Record<string, HatRecipe> = {
    'aereo-auto': { 
        name: 'VolaVruum', 
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_auto.webp', 
        desc: 'Il sogno di ogni autista...' 
    },
    'aereo-cane': { 
        name: 'Super Dog Volante!', 
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_cane.webp', 
        desc: 'Un cucciolo che abbaia tra le nuvole!' 
    },
    'aereo-coniglio': {
        name: 'Coniglio Jet',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_coniglio.webp',
        desc: 'Salti altissimi e voli velocissimi!'
    },
    'aereo-poltrona': {
        name: 'Poltrona Volante',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_divano.webp',
        desc: 'Il massimo del relax ad alta quota.'
    },
    'aereo-elefante': {
        name: 'Elefante Alato',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_elefante.webp',
        desc: 'Un gigante che sfida la gravità.'
    },
    'aereo-fantasma': {
        name: 'Spettro del Cielo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_fantasma.webp',
        desc: 'Un volo misterioso e invisibile.'
    },
    'aereo-frigorifero': {
        name: 'Frigo-Jet',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_frigorifero.webp',
        desc: 'Snack freschi consegnati in un lampo!'
    },
    'aereo-frullatore': {
        name: 'Frulla-Elica',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_frullatore.webp',
        desc: 'Un mix esplosivo di velocità!'
    },
    'aereo-gatto': {
        name: 'Gatto-Aliante',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_gatto.webp',
        desc: 'Atterraggi sempre sulle quattro zampe.'
    },
    'aereo-giraffa': {
        name: 'Giraffa Pilota',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_giraffa.webp',
        desc: 'Vede oltre le nuvole con il suo collo lungo.'
    },
    'aereo-gufo': {
        name: 'Gufo Meccanico',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_gufo.webp',
        desc: 'Voli notturni silenziosi e precisi.'
    },
    'aereo-monopattino': {
        name: 'Aereo-Pattino',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_monopattino.webp',
        desc: 'Sfreccia tra le stelle!'
    },
    'aereo-orso': {
        name: 'Orso Aviazione',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_orso.webp',
        desc: 'Un abbraccio soffice che arriva dal cielo.'
    },
    'aereo-ragno': {
        name: 'Ragno-Jet',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_ragno.webp',
        desc: 'Tele di ragno tra le nuvole.'
    },
    'aereo-ruota': {
        name: 'Ruota Volante',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_ruota.webp',
        desc: 'Gira e vola senza sosta!'
    },
    'aereo-sedia': {
        name: 'Sedia a Reazione',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_sedia.webp',
        desc: 'Comodità supersonica.'
    },
    'aereo-tavolo': {
        name: 'Tavolo da Volo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_tavolo.webp',
        desc: 'Pranzo servito direttamente nel cielo.'
    },
    'aereo-tv': {
        name: 'Tele-Volo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_televisione.webp',
        desc: 'I tuoi programmi preferiti ovunque tu sia.'
    },
    'aereo-topo': {
        name: 'Topo-Pilota',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aereo_topo.webp',
        desc: 'Piccolo, veloce e coraggioso!'
    },
    'auto-cane': {
        name: 'Auto-Bau',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_cane.webp',
        desc: 'Una macchina che scodinzola ad ogni curva!'
    },
    'auto-coniglio': {
        name: 'Sprint-Coniglio',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_coniglio.webp',
        desc: 'Velocità a balzi, per non fermarsi mai.'
    },
    'auto-poltrona': {
        name: 'Auto-Relax',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_divano.webp',
        desc: 'Viaggiare comodamente come nel proprio salotto.'
    },
    'auto-elefante': {
        name: 'Auto-Elefante',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_elefante.webp',
        desc: 'Un veicolo potente e dalla memoria infinita.'
    },
    'auto-fantasma': {
        name: 'Auto-Spettro',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_fantasma.webp',
        desc: 'Passa attraverso i muri per evitare il traffico!'
    },
    'auto-frigorifero': {
        name: 'Auto-Frigo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_frigorifero.webp',
        desc: 'Consegne fresche garantite in ogni viaggio.'
    },
    'auto-frullatore': {
        name: 'Auto-Mixer',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_frullatore.webp',
        desc: 'Un motore che frulla ogni ostacolo!'
    },
    'auto-gatto': {
        name: 'Auto-Miao',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_gatto.webp',
        desc: 'Agile, silenziosa e fa le fusa quando accelera.'
    },
    'auto-giraffa': {
        name: 'Auto-Collo-Lungo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_giraffa.webp',
        desc: 'Per vedere sempre cosa succede dieci macchine più avanti.'
    },
    'auto-gufo': {
        name: 'Auto-Gufo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_gufo.webp',
        desc: 'Perfetta per i viaggi notturni con fari rotanti a 360 gradi.'
    },
    'auto-monopattino': {
        name: 'Auto-Pattino',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_monopattino.webp',
        desc: 'Ibrida, leggera e divertentissima da guidare.'
    },
    'auto-orso': {
        name: 'Auto-Orso',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_orso.webp',
        desc: 'Robusta e calda, ideale per le gite in montagna.'
    },
    'auto-ragno': {
        name: 'Auto-Ragno',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_ragno.webp',
        desc: 'Può parcheggiare anche sul soffitto del garage!'
    },
    'auto-ruota': {
        name: 'Auto-Ruota',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_ruota.webp',
        desc: 'Tutta ruote e niente scuse, sfreccia ovunque.'
    },
    'auto-sedia': {
        name: 'Auto-Sedia',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_sedia.webp',
        desc: 'La semplicità del sedersi unita alla velocità del motore.'
    },
    'auto-tavolo': {
        name: 'Auto-Tavolino',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_tavolino.webp',
        desc: 'Per un picnic veloce in movimento.'
    },
    'auto-tv': {
        name: 'Auto-TV',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_televisione.webp',
        desc: 'Cinema su ruote per viaggi che non annoiano mai.'
    },
    'auto-topo': {
        name: 'Auto-Topolino',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/auto_topo.webp',
        desc: 'Piccola, scattante e trova parcheggio ovunque!'
    },
};