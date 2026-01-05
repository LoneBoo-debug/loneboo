export interface BookReading {
    id: string;
    title: string;
    thumbnail: string;
    pages: string[];
    description?: string;
}

export const READING_DATABASE: BookReading[] = [
    {
        id: 'omino-pan-di-zenzero',
        title: "L'Omino di Pan di Zenzero",
        thumbnail: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ominopandizenzerominau.webp',
        description: 'Una dolce e croccante avventura per tutta la famiglia!',
        pages: [
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/LOmino-di-Pan-di-Zenzero-_compressed-images-1.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/LOmino-di-Pan-di-Zenzero-_compressed-images-2.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/LOmino-di-Pan-di-Zenzero-_compressed-images-3.webp'
        ]
    },
    {
        id: 'peter-rabbit',
        title: "La Storia di Peter Rabbit",
        thumbnail: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/peterabbitminiaute.webp',
        description: 'Segui le avventure del coniglietto più birichino del mondo nel giardino di Mr. McGregor!',
        pages: [
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/1paggpeterrabb.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/2paggpeterabb.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/3paggpeterrabb.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/4paggpeterabbet.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/5paggpeterabbert.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/6paggpeterabbert.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/7pagepeterabberte.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/8paggefpeterabberre.webp'
        ]
    },
    {
        id: 'i-tre-porcellini',
        title: "I Tre Porcellini",
        thumbnail: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trporcminiat.webp',
        description: 'La classica storia dei tre fratellini e del lupo cattivo, tutta da leggere!',
        pages: [
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/1paggerporc.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/2paggetorporc.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/3%C3%A8paggertrporcde.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/4paggertreporcsdser.webp'
        ]
    },
    {
        id: 'cappuccetto-rosso',
        title: "Cappuccetto Rosso",
        thumbnail: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mincapprfde.webp',
        description: 'Attraversa il bosco con la bambina dal mantello rosso e fai attenzione al lupo cattivo!',
        pages: [
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/1paggredcappux.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/2paggredcapuxsa.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/3paggredcappusder.webp',
            'https://loneboo-images.s3.eu-south-1.amazonaws.com/4paggredcapuser.webp'
        ]
    }
];