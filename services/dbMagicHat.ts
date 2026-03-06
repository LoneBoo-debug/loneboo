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
    'cane-coniglio': {
        name: 'Cane-Coniglio',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_coniglio.webp',
        desc: 'Un cucciolo che salta come una molla!'
    },
    'cane-poltrona': {
        name: 'Cane-Poltrona',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_poltrona.webp',
        desc: 'Il posto più morbido dove schiacciare un pisolino.'
    },
    'cane-elefante': {
        name: 'Cane-Elefante',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_elefante.webp',
        desc: 'Un cucciolo gigante con una memoria di ferro!'
    },
    'cane-fantasma': {
        name: 'Cane-Fantasma',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_fantasma.webp',
        desc: 'Un cucciolo invisibile che fa "Bau" nel buio!'
    },
    'cane-frigorifero': {
        name: 'Cane-Frigo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_frigorifero.webp',
        desc: 'Il miglior amico del cibo fresco!'
    },
    'cane-frullatore': {
        name: 'Cane-Frullatore',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_frullatore.webp',
        desc: 'Un mix di energia e allegria!'
    },
    'cane-gatto': {
        name: 'Cane-Gatto',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_gatto.webp',
        desc: 'L\'amicizia impossibile finalmente realtà!'
    },
    'cane-giraffa': {
        name: 'Cane-Giraffa',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_giraffa.webp',
        desc: 'Un cucciolo che vede tutto dall\'alto!'
    },
    'cane-gufo': {
        name: 'Cane-Gufo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_gufo.webp',
        desc: 'Un guardiano notturno molto affettuoso.'
    },
    'cane-monopattino': {
        name: 'Cane-Pattino',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_monopattino.webp',
        desc: 'Sfreccia al parco con quattro zampe e due ruote!'
    },
    'cane-orso': {
        name: 'Cane-Orso',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_orso.webp',
        desc: 'Un concentrato di coccole e pelo soffice.'
    },
    'cane-ragno': {
        name: 'Cane-Ragno',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_ragno.webp',
        desc: 'Un cucciolo che può camminare sui muri!'
    },
    'cane-ruota': {
        name: 'Cane-Ruota',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_ruota.webp',
        desc: 'Non smette mai di correre e rotolare!'
    },
    'cane-sedia': {
        name: 'Cane-Sedia',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_sedia.webp',
        desc: 'Una seduta che ti scodinzola sempre.'
    },
    'cane-tavolo': {
        name: 'Cane-Tavolo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_tavolo.webp',
        desc: 'Perfetto per le merende in compagnia.'
    },
    'cane-tv': {
        name: 'Cane-TV',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_televisore.webp',
        desc: 'I tuoi cartoni preferiti presentati da un cucciolo!'
    },
    'cane-topo': {
        name: 'Cane-Topo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cane_topo.webp',
        desc: 'Piccolo, scattante e molto curioso.'
    },
    'coniglio-poltrona': {
        name: 'Coniglio Relax',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_poltrona.webp',
        desc: 'Un posto morbido per saltare e riposare.'
    },
    'coniglio-elefante': {
        name: 'Coniglio-Fante',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_elefante.webp',
        desc: 'Un salto gigante con una memoria d\'elefante!'
    },
    'coniglio-fantasma': {
        name: 'Coniglio Spettrale',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_fantasma.webp',
        desc: 'Appare e scompare come un soffio di vento.'
    },
    'coniglio-frigorifero': {
        name: 'Coniglio Fresco',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_frigorifero.webp',
        desc: 'Carote sempre croccanti e gelate!'
    },
    'coniglio-frullatore': {
        name: 'Coniglio Mix',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_frullatore.webp',
        desc: 'Un frullato di energia e velocità.'
    },
    'coniglio-gatto': {
        name: 'Coniglio-Miao',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_gatto.webp',
        desc: 'L\'agilità del gatto e i balzi del coniglio.'
    },
    'coniglio-giraffa': {
        name: 'Coniglio-Collo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_giraffa.webp',
        desc: 'Per vedere le carote più alte del giardino.'
    },
    'coniglio-gufo': {
        name: 'Coniglio Notturno',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_gufo.webp',
        desc: 'Grandi occhi per vedere nel buio della tana.'
    },
    'coniglio-monopattino': {
        name: 'Coniglio Sprint',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_monoattino.webp',
        desc: 'Sfreccia più veloce di un balzo!'
    },
    'coniglio-orso': {
        name: 'Coniglio-Abbraccio',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_orso.webp',
        desc: 'Soffice, grande e molto affettuoso.'
    },
    'coniglio-ragno': {
        name: 'Coniglio-Ragno',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_ragno.webp',
        desc: 'Salti che ti lasciano appeso al soffitto!'
    },
    'coniglio-ruota': {
        name: 'Coniglio-Rotolante',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_ruota.webp',
        desc: 'Gira e salta senza mai fermarsi.'
    },
    'coniglio-sedia': {
        name: 'Coniglio-Sedia',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_sedia.webp',
        desc: 'Una seduta che ti fa fare balzi di gioia.'
    },
    'coniglio-tavolo': {
        name: 'Coniglio-Tavolo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_tavolo.webp',
        desc: 'Perfetto per una merenda a base di carote.'
    },
    'coniglio-tv': {
        name: 'Coniglio-TV',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_televisore.webp',
        desc: 'I tuoi cartoni preferiti presentati da un coniglietto!'
    },
    'coniglio-topo': {
        name: 'Coniglio-Topo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/coniglio_topo.webp',
        desc: 'Piccolo, scattante e molto curioso.'
    },
    'elefante-fantasma': {
        name: 'Elefante Spettrale',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_elefante.webp',
        desc: 'Un gigante invisibile che non dimentica mai di spaventare!'
    },
    'fantasma-frigorifero': {
        name: 'Spettro del Gelo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_frigorifero.webp',
        desc: 'Brividi di freddo e di paura ad ogni apertura.'
    },
    'fantasma-frullatore': {
        name: 'Frulla-Spettro',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_frullatore.webp',
        desc: 'Un mix turbinante di ectoplasma e velocità.'
    },
    'fantasma-gatto': {
        name: 'Gatto Fantasma',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_gatto.webp',
        desc: 'Sette vite e un\'eternità per fare scherzi.'
    },
    'fantasma-giraffa': {
        name: 'Giraffa Spettrale',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_giraffa.webp',
        desc: 'Un collo lungo che spunta dalle nuvole di nebbia.'
    },
    'fantasma-gufo': {
        name: 'Gufo del Mistero',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_gufo.webp',
        desc: 'Vola silenzioso nella notte più buia.'
    },
    'fantasma-monopattino': {
        name: 'Pattino Fantasma',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_monopattino.webp',
        desc: 'Sfreccia invisibile tra le strade della città.'
    },
    'fantasma-orso': {
        name: 'Orso Spettrale',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_orso.webp',
        desc: 'Un abbraccio gelido ma stranamente rassicurante.'
    },
    'fantasma-poltrona': {
        name: 'Poltrona degli Spiriti',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_poltrona.webp',
        desc: 'Attento a chi si siede accanto a te!'
    },
    'fantasma-ragno': {
        name: 'Ragno Spettrale',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_ragno.webp',
        desc: 'Tele invisibili per catturare sogni e segreti.'
    },
    'fantasma-ruota': {
        name: 'Ruota del Destino',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_ruota.webp',
        desc: 'Gira senza sosta tra il mondo dei vivi e dei morti.'
    },
    'fantasma-sedia': {
        name: 'Sedia Oscillante',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_sedia.webp',
        desc: 'Si muove da sola nel cuore della notte.'
    },
    'fantasma-tavolo': {
        name: 'Tavolo delle Sedute',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_tavolo.webp',
        desc: 'Pronto per evocare nuovi amici magici.'
    },
    'fantasma-tv': {
        name: 'Tele-Spettro',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_televisore.webp',
        desc: 'Programmi che arrivano direttamente dall\'aldilà.'
    },
    'fantasma-topo': {
        name: 'Topo Fantasma',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fantasma_topo.webp',
        desc: 'Piccoli passi invisibili e squittii misteriosi.'
    },
    'elefante-frigorifero': {
        name: 'Elefante Polare',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_frigorifero.webp',
        desc: 'Un gigante che ama il freddo e gli snack ghiacciati.'
    },
    'elefante-frullatore': {
        name: 'Elefante-Mixer',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_frullatore.webp',
        desc: 'Una proboscide che frulla tutto in un lampo!'
    },
    'elefante-gatto': {
        name: 'Elefante-Miao',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_gatto.webp',
        desc: 'La forza dell\'elefante con l\'agilità di un gattino.'
    },
    'elefante-giraffa': {
        name: 'Elefante-Collo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_giraffa.webp',
        desc: 'Un gigante altissimo che arriva alle foglie più tenere.'
    },
    'elefante-gufo': {
        name: 'Elefante Saggio',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_gufo.webp',
        desc: 'Vede tutto e ricorda tutto, anche di notte.'
    },
    'elefante-monopattino': {
        name: 'Elefante Sprint',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_monopattino.webp',
        desc: 'Un gigante su due ruote, attenzione al traffico!'
    },
    'elefante-orso': {
        name: 'Elefante-Abbraccio',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_orso.webp',
        desc: 'Un concentrato di forza e morbidezza.'
    },
    'elefante-poltrona': {
        name: 'Elefante Relax',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_poltrona.webp',
        desc: 'Il trono più grande e comodo del mondo.'
    },
    'elefante-ragno': {
        name: 'Elefante-Ragno',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_ragno.webp',
        desc: 'Un gigante che può camminare su tele d\'acciaio.'
    },
    'elefante-ruota': {
        name: 'Elefante-Rotolante',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_ruota.webp',
        desc: 'Niente lo ferma quando inizia a rotolare!'
    },
    'elefante-sedia': {
        name: 'Elefante-Sedia',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_sedia.webp',
        desc: 'Una seduta robusta per chi ha grandi idee.'
    },
    'elefante-tavolo': {
        name: 'Elefante-Tavolo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_tavolo.webp',
        desc: 'Perfetto per un banchetto regale nella giungla.'
    },
    'elefante-tv': {
        name: 'Elefante-TV',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_televisore.webp',
        desc: 'I tuoi programmi preferiti su uno schermo gigante.'
    },
    'elefante-topo': {
        name: 'Elefante-Topo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elefante_topo.webp',
        desc: 'L\'amicizia più strana del mondo in un solo essere!'
    },
    'frigorifero-frullatore': {
        name: 'Frigo-Mixer',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_frullatore.webp',
        desc: 'Frullati gelati in un batter d\'occhio!'
    },
    'frigorifero-gatto': {
        name: 'Gatto delle Nevi',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_gatto.webp',
        desc: 'Un micio che adora il freddo e le fusa ghiacciate.'
    },
    'frigorifero-giraffa': {
        name: 'Giraffa Polare',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_giraffa.webp',
        desc: 'Un collo lungo per raggiungere i ghiaccioli più alti.'
    },
    'frigorifero-gufo': {
        name: 'Gufo del Gelo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_gufo.webp',
        desc: 'Vede tutto nel buio del freezer.'
    },
    'frigorifero-monopattino': {
        name: 'Frigo-Sprint',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_monopattino.webp',
        desc: 'Consegne fresche a tutta velocità!'
    },
    'frigorifero-orso': {
        name: 'Orso del Freezer',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_orso.webp',
        desc: 'Un abbraccio fresco e molto soffice.'
    },
    'frigorifero-poltrona': {
        name: 'Poltrona Ghiacciata',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_poltrona.webp',
        desc: 'Il massimo del relax per le giornate più calde.'
    },
    'frigorifero-ragno': {
        name: 'Ragno del Gelo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_ragno.webp',
        desc: 'Tele di ghiaccio per catturare snack freschi.'
    },
    'frigorifero-ruota': {
        name: 'Ruota Polare',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_ruota.webp',
        desc: 'Rotola tra i ghiacci senza mai fermarsi.'
    },
    'frigorifero-sedia': {
        name: 'Sedia del Freddo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_sedia.webp',
        desc: 'Una seduta rinfrescante per grandi idee.'
    },
    'frigorifero-tavolo': {
        name: 'Tavolo del Ghiaccio',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_tavolo.webp',
        desc: 'Perfetto per un banchetto sotto zero.'
    },
    'frigorifero-tv': {
        name: 'Tele-Gelo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_televisore.webp',
        desc: 'I tuoi programmi preferiti... in fresco!'
    },
    'frigorifero-topo': {
        name: 'Topo del Freezer',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigo_topo.webp',
        desc: 'Piccolo, scattante e ama il formaggio gelato.'
    },
    'frullatore-gatto': {
        name: 'Gatto-Mixer',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_gatto.webp',
        desc: 'Un micio che frulla di energia e agilità.'
    },
    'frullatore-giraffa': {
        name: 'Giraffa-Frullatore',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_giraffa.webp',
        desc: 'Un collo lungo per mescolare i sapori più alti.'
    },
    'frullatore-gufo': {
        name: 'Gufo-Turbina',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_gufo.webp',
        desc: 'Vede tutto mentre frulla nel buio della cucina.'
    },
    'frullatore-monopattino': {
        name: 'Frulla-Sprint',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_monopattino.webp',
        desc: 'Velocità frullata per sfrecciare ovunque!'
    },
    'frullatore-orso': {
        name: 'Orso-Mix',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_orso.webp',
        desc: 'Un abbraccio energico e molto mescolato.'
    },
    'frullatore-poltrona': {
        name: 'Poltrona-Vortice',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_poltrona.webp',
        desc: 'Il massimo del relax... in movimento!'
    },
    'frullatore-ragno': {
        name: 'Ragno-Mixer',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_ragno.webp',
        desc: 'Tele intrecciate a tutta velocità.'
    },
    'frullatore-ruota': {
        name: 'Ruota-Turbine',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_ruota.webp',
        desc: 'Gira e frulla senza mai fermarsi.'
    },
    'frullatore-sedia': {
        name: 'Sedia-Vorticosa',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_sedia.webp',
        desc: 'Una seduta che ti fa girare la testa di gioia.'
    },
    'frullatore-tavolo': {
        name: 'Tavolo-Mixer',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_tavolo.webp',
        desc: 'Perfetto per preparare banchetti magici in un lampo.'
    },
    'frullatore-tv': {
        name: 'Tele-Mix',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_televisore.webp',
        desc: 'I tuoi programmi preferiti mescolati con fantasia.'
    },
    'frullatore-topo': {
        name: 'Topo-Vortice',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frullatore_topo.webp',
        desc: 'Piccolo, scattante e pieno di energia centrifuga.'
    },
    'gatto-poltrona': {
        name: 'Gatto-Relax',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gatto_poltrona.webp',
        desc: 'Il posto preferito per un pisolino regale.'
    },
    'gatto-giraffa': {
        name: 'Gatto-Giraffa',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Gatto_giraffa.webp',
        desc: 'Un micio che vede tutto dall\'alto.'
    },
    'gatto-gufo': {
        name: 'Gatto-Gufo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gatto_gufo.webp',
        desc: 'Un predatore notturno molto silenzioso.'
    },
    'gatto-monopattino': {
        name: 'Gatto-Sprint',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gatto_monopattino.webp',
        desc: 'Sfreccia sui tetti con stile!'
    },
    'gatto-orso': {
        name: 'Gatto-Orso',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gatto_orso.webp',
        desc: 'Un concentrato di fusa e morbidezza.'
    },
    'gatto-ragno': {
        name: 'Gatto-Ragno',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gatto_ragno.webp',
        desc: 'Può camminare sui muri senza fare rumore.'
    },
    'gatto-ruota': {
        name: 'Gatto-Rotolante',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gatto_ruota.webp',
        desc: 'Insegue la sua coda a tutta velocità!'
    },
    'gatto-sedia': {
        name: 'Gatto-Sedia',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gatto_sedia.webp',
        desc: 'Una seduta che fa le fusa.'
    },
    'gatto-tavolo': {
        name: 'Gatto-Tavolo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gatto_tavolo.webp',
        desc: 'Perfetto per una cena a base di croccantini.'
    },
    'gatto-tv': {
        name: 'Gatto-TV',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gatto_televisore.webp',
        desc: 'I tuoi programmi preferiti presentati da un micio.'
    },
    'gatto-topo': {
        name: 'Gatto-Topo',
        img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gatto_topo.webp',
        desc: 'L\'eterna sfida finalmente unita!'
    },
};
