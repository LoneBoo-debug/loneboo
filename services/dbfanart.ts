
import { FanArt } from '../types';

/**
 * DATABASE STATICO FAN ART
 * Questi disegni vengono mostrati come base nel museo.
 * Se il Google Sheet è vuoto o ha pochi elementi, l'app pesca da qui
 * per riempire i quadri della galleria.
 */
export const FAN_ART_DATABASE: FanArt[] = [
    { 
        id: 'db-art-1', 
        author: 'Sofia', 
        age: '6 anni', 
        image: 'https://i.postimg.cc/9f0YmZ7n/disegno1.jpg',
        city: 'Milano',
        province: 'MI'
    },
    { 
        id: 'db-art-2', 
        author: 'Matteo', 
        age: '8 anni', 
        image: 'https://i.postimg.cc/L58mYx4S/disegno2.jpg',
        city: 'Roma',
        province: 'RM'
    },
    { 
        id: 'db-art-3', 
        author: 'Giulia', 
        age: '5 anni', 
        image: 'https://i.postimg.cc/vH2XfV1G/disegno3.jpg',
        city: 'Napoli',
        province: 'NA'
    },
    { 
        id: 'db-art-4', 
        author: 'Leonardo', 
        age: '7 anni', 
        image: 'https://i.postimg.cc/XvjW0T8y/disegno4.jpg',
        city: 'Torino',
        province: 'TO'
    },
    { 
        id: 'db-art-5', 
        author: 'Elena', 
        age: '9 anni', 
        image: 'https://i.postimg.cc/BZP5B1Yf/disegno5.jpg',
        city: 'Bologna',
        province: 'BO'
    },
    { 
        id: 'db-art-6', 
        author: 'Riccardo', 
        age: '4 anni', 
        image: 'https://i.postimg.cc/qM6N8L7z/disegno6.jpg',
        city: 'Firenze',
        province: 'FI'
    }
];
