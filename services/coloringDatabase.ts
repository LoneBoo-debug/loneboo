import { ColoringCategory } from '../types';
import { getAsset } from './LocalAssets';

export const COLORING_DATABASE: ColoringCategory[] = [
    {
        id: 'animals',
        title: 'Animali',
        emoji: '🦁',
        coverImage: 'https://img.freepik.com/free-vector/hand-drawn-wild-animals-collection_23-2149022639.jpg',
        color: 'bg-green-500',
        items: [
            { id: 'an-1', title: 'Il Dolce Cerbiatto', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/bambicerb.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bambicerb.jpg' },
            { id: 'an-2', title: 'Il Simpatico Orsetto', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/Il+SimpaticoOrsetto.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Il+SimpaticoOrsetto.jpg' },
            { id: 'an-3', title: 'Scoiattolo Goloso', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/ScoiattoloGoloso.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ScoiattoloGoloso.jpg' },
            { id: 'an-4', title: 'Dolce Coniglio', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/DolceConiglio.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/DolceConiglio.jpg' },
            { id: 'an-5', title: 'Gattino nel Bosco', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/GattinonelBosco.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/GattinonelBosco.jpg' },
            { id: 'an-6', title: 'Giraffa Africana', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/GiraffaAfricana.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/GiraffaAfricana.jpg' },
            { id: 'an-7', title: 'Elefantino Curioso', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/ElefantinoCurioso.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElefantinoCurioso.jpg' },
            { id: 'an-8', title: 'Dolce Pinguino', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/DolcePinguino.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/DolcePinguino.jpg' },
            { id: 'an-9', title: 'Orso Polare', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/OrsoPolare.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/OrsoPolare.jpg' },
        ]
    },
    {
        id: 'christmas',
        title: 'Natale',
        emoji: '🎄',
        coverImage: 'https://img.freepik.com/free-vector/hand-drawn-christmas-coloring-book-illustration_23-2149723821.jpg',
        color: 'bg-red-600',
        items: [
            { id: 'xm-1', title: 'Il Grinch', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/Ilgrinch.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Ilgrinch.jpg' },
            { id: 'xm-2', title: 'I Minions a Natale', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/IMinionsaNatale.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/IMinionsaNatale.jpg' },
            { id: 'xm-3', title: 'Natale Disney', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/NataleDisney.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/NataleDisney.jpg' },
            { id: 'xm-4', title: 'Kitty e i suoi Regali', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/HellokittyeisuoiRegali.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/HellokittyeisuoiRegali.jpg' },
            { id: 'xm-5', title: 'Olaf a Natale', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/OlafaNatale.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/OlafaNatale.jpg' },
            { id: 'xm-6', title: 'Natale a Arendelle', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/NataleaArendelle.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/NataleaArendelle.jpg' },
        ]
    },
    {
        id: 'halloween',
        title: 'Halloween',
        emoji: '🎃',
        coverImage: 'https://img.freepik.com/free-vector/hand-drawn-halloween-coloring-book-illustration_23-2149658933.jpg',
        color: 'bg-orange-500',
        items: [
            { id: 'hl-1', title: 'Il Gatto Nero', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/ilgattonero.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ilgattonero.jpg' },
            { id: 'hl-2', title: 'La Simpatica Streghetta', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/stregasimpatica.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stregasimpatica.jpg' },
            { id: 'hl-3', title: 'La Casa Stregata', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/casastregata.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/casastregata.jpg' },
            { id: 'hl-4', title: 'Halloween Party', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/halloweenparty.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/halloweenparty.jpg' },
        ]
    },
    {
        id: 'flowers',
        title: 'Fiori e Natura',
        emoji: '🌸',
        coverImage: 'https://img.freepik.com/free-vector/hand-drawn-flowers-outline_23-2149023023.jpg',
        color: 'bg-pink-500',
        items: [
            { id: 'fl-1', title: 'Rosa', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Rosa', pdfUrl: '#' },
            { id: 'fl-2', title: 'Girasole', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Girasole', pdfUrl: '#' },
            { id: 'fl-3', title: 'Tulipano', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Tulipano', pdfUrl: '#' },
            { id: 'fl-4', title: 'Albero', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Albero', pdfUrl: '#' },
            { id: 'fl-5', title: 'Farffalla', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Farfalla', pdfUrl: '#' },
            { id: 'fl-6', title: 'Fungo', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Fungo', pdfUrl: '#' },
            { id: 'fl-7', title: 'Foglie', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Foglie', pdfUrl: '#' },
            { id: 'fl-8', title: 'Margherita', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Margherita', pdfUrl: '#' },
            { id: 'fl-9', title: 'Cactus', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Cactus', pdfUrl: '#' },
            { id: 'fl-10', title: 'Giardino', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Giardino', pdfUrl: '#' },
        ]
    },
    {
        id: 'sea',
        title: 'In fondo al mar',
        emoji: '🐠',
        coverImage: 'https://img.freepik.com/free-vector/underwater-world-coloring-page_23-2148560088.jpg',
        color: 'bg-blue-500',
        items: [
            { id: 'sea-1', title: 'Pesce', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Pesce', pdfUrl: '#' },
            { id: 'sea-2', title: 'Delfino', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Delfino', pdfUrl: '#' },
            { id: 'sea-3', title: 'Squalo', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Squalo', pdfUrl: '#' },
            { id: 'sea-4', title: 'Polpo', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Polpo', pdfUrl: '#' },
            { id: 'sea-5', title: 'Granchio', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Granchio', pdfUrl: '#' },
            { id: 'sea-6', title: 'Stella Marina', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Stella+Marina', pdfUrl: '#' },
            { id: 'sea-7', title: 'Cavalluccio', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Cavalluccio', pdfUrl: '#' },
            { id: 'sea-8', title: 'Balena', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Balena', pdfUrl: '#' },
            { id: 'sea-9', title: 'Tartaruga', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Tartaruga', pdfUrl: '#' },
            { id: 'sea-10', title: 'Conchiglie', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Conchiglie', pdfUrl: '#' },
        ]
    },
    {
        id: 'characters',
        title: 'Personaggi',
        emoji: '👻',
        coverImage: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/algrancompleto.jpg',
        color: 'bg-purple-500',
        items: [
            { id: 'ch-1', title: 'Pooh e i suoi amici', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/Pooheisuoiamici.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Pooheisuoiamici.jpg' },
            { id: 'ch-2', title: 'Al Gran Completo', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/algrancompleto.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/algrancompleto.jpg' },
            { id: 'ch-3', title: 'Lone Boo e i suoi amici', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/Lonebooeisuoiamici.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Lonebooeisuoiamici.jpg' },
            { id: 'ch-4', title: 'Video Games', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/Videogames.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Videogames.jpg' },
            { id: 'ch-5', title: 'Le Favole', thumbnail: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/Lefavole.jpg'), pdfUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Lefavole.jpg' },
        ]
    },
    {
        id: 'food',
        title: 'Cibo Gnam',
        emoji: '🍕',
        coverImage: '',
        color: 'bg-yellow-400',
        items: []
    }
];