
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
            { id: 'an-1', title: 'Animali nel Bosco', thumbnail: getAsset('https://i.postimg.cc/gjzztf4F/aniamli-(1).jpg'), pdfUrl: 'https://drive.google.com/file/d/1qVuDtjjVUOdLT4V0D1P-Rtx54wT6UFJB/view?usp=sharing' },
            { id: 'an-2', title: 'Cagnolino col Cappello', thumbnail: getAsset('https://i.postimg.cc/6QKC5QpL/cans.jpg'), pdfUrl: 'https://drive.google.com/file/d/1uAupX7JhJXSTS8E6Qkl4Iui5jFRwK-dT/view?usp=sharing' },
            { id: 'an-3', title: 'Elefanti Dolci', thumbnail: getAsset('https://i.postimg.cc/15ZFKtpZ/ele.jpg'), pdfUrl: 'https://drive.google.com/file/d/1giCZ8KJ9E_HfL_8xNgNrHbB_Wrk4r76H/view?usp=sharing' },
            { id: 'an-4', title: 'Giraffa al sole', thumbnail: getAsset('https://i.postimg.cc/V66gmNK7/gir.jpg'), pdfUrl: 'https://drive.google.com/file/d/1SQGZwx9CZwrqqgHYTEWlXvGYm-yPzFB2/view?usp=sharing' },
            { id: 'an-5', title: 'Gufi nel Bosco', thumbnail: getAsset('https://i.postimg.cc/NGxXptbT/guf.jpg'), pdfUrl: 'https://drive.google.com/file/d/1Pwe_0FR9jqDdwBrg1w9SEZo-waeCYNmt/view?usp=sharing' },
            { id: 'an-6', title: 'Mucca col Fiore', thumbnail: getAsset('https://i.postimg.cc/Kvw85sX1/muc.jpg'), pdfUrl: 'https://drive.google.com/file/d/1RC-VjohGZPDXn6yMnMmKmIZ0HH4h8OWC/view?usp=sharing' },
            { id: 'an-7', title: 'Renna Sorridente', thumbnail: getAsset('https://i.postimg.cc/vZXMNPk1/ren.jpg'), pdfUrl: 'https://drive.google.com/file/d/1-eOuP1eLtRy-J3OhvfSQapEN1xRh2GYA/view?usp=sharing' },
            { id: 'an-8', title: 'Sul Trenino', thumbnail: getAsset('https://i.postimg.cc/9QD160N1/trenn.jpg'), pdfUrl: 'https://drive.google.com/file/d/1nKSr90lnWlCmFrU81F5D4yLwrEeaJtqi/view?usp=sharing' },
            { id: 'an-9', title: 'Tartaruga Felice', thumbnail: getAsset('https://i.postimg.cc/bwfshF6N/tart.jpg'), pdfUrl: 'https://drive.google.com/file/d/1PHVuBsZrbXkTOE7zQQfFw-WuE1642gnK/view?usp=sharing' },
            { id: 'an-10', title: 'Rana Felice', thumbnail: getAsset('https://i.postimg.cc/g0JwSLSY/ran.jpg'), pdfUrl: 'https://drive.google.com/file/d/15SBm4rKTVc-Sw2jNLkdWRh-3yepLInX9/view?usp=sharing' },
        ]
    },
    {
        id: 'christmas',
        title: 'Natale',
        emoji: '🎄',
        coverImage: 'https://img.freepik.com/free-vector/hand-drawn-christmas-coloring-book-illustration_23-2149723821.jpg',
        color: 'bg-red-600',
        items: [
            { id: 'xm-1', title: 'Babbo Natale', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Babbo+Natale', pdfUrl: '#' },
            { id: 'xm-2', title: 'Albero', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Albero', pdfUrl: '#' },
            { id: 'xm-3', title: 'Renna', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Renna', pdfUrl: '#' },
            { id: 'xm-4', title: 'Regali', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Regali', pdfUrl: '#' },
            { id: 'xm-5', title: 'Pupazzo di Neve', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Pupazzo', pdfUrl: '#' },
            { id: 'xm-6', title: 'Calza', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Calza', pdfUrl: '#' },
            { id: 'xm-7', title: 'Elfo', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Elfo', pdfUrl: '#' },
            { id: 'xm-8', title: 'Stella', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Stella', pdfUrl: '#' },
            { id: 'xm-9', title: 'Presepe', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Presepe', pdfUrl: '#' },
            { id: 'xm-10', title: 'Befana', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Befana', pdfUrl: '#' },
        ]
    },
    {
        id: 'halloween',
        title: 'Halloween',
        emoji: '🎃',
        coverImage: 'https://img.freepik.com/free-vector/hand-drawn-halloween-coloring-book-illustration_23-2149658933.jpg',
        color: 'bg-orange-500',
        items: [
            { id: 'hl-1', title: 'Zucca', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Zucca', pdfUrl: '#' },
            { id: 'hl-2', title: 'Fantasma', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Fantasma', pdfUrl: '#' },
            { id: 'hl-3', title: 'Pipistrello', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Pipistrello', pdfUrl: '#' },
            { id: 'hl-4', title: 'Strega', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Strega', pdfUrl: '#' },
            { id: 'hl-5', title: 'Gatto Nero', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Gatto+Nero', pdfUrl: '#' },
            { id: 'hl-6', title: 'Ragno', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Ragno', pdfUrl: '#' },
            { id: 'hl-7', title: 'Scheletro', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Scheletro', pdfUrl: '#' },
            { id: 'hl-8', title: 'Vampiro', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Vampiro', pdfUrl: '#' },
            { id: 'hl-9', title: 'Mummia', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Mummia', pdfUrl: '#' },
            { id: 'hl-10', title: 'Castello', thumbnail: 'https://via.placeholder.com/300x400?text=Anteprima+Castello', pdfUrl: '#' },
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
        coverImage: '',
        color: 'bg-purple-500',
        items: []
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
