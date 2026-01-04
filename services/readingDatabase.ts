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
    }
];