export interface CardAsset {
  id: string;
  value: number;
  suit: 'bastoni' | 'denari' | 'spade' | 'coppe';
  image: string;
}

export const CARDS_DATABASE = {
  // --- CARTE SCOPA (40 CARTE: 1-10 per 4 semi) ---
  SCOPA: {
    back: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dorso+crrdsscope.webp',
    deck: [
      // BASTONI (MAZZE)
      { id: 'bastoni_1', value: 1, suit: 'bastoni', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/asso+mazze.webp' },
      { id: 'bastoni_2', value: 2, suit: 'bastoni', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/due+mazze.webp' },
      { id: 'bastoni_3', value: 3, suit: 'bastoni', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tre+mazze.webp' },
      { id: 'bastoni_4', value: 4, suit: 'bastoni', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/quatro+mazze.webp' },
      { id: 'bastoni_5', value: 5, suit: 'bastoni', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cinque+mazze.webp' },
      { id: 'bastoni_6', value: 6, suit: 'bastoni', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sei+mazze.webp' },
      { id: 'bastoni_7', value: 7, suit: 'bastoni', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sette+mazze.webp' },
      { id: 'bastoni_8', value: 8, suit: 'bastoni', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ott+mazze.webp' },
      { id: 'bastoni_9', value: 9, suit: 'bastoni', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nove+mazze.webp' },
      { id: 'bastoni_10', value: 10, suit: 'bastoni', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dieci+azze.webp' },
      
      // DENARI (ORO)
      { id: 'denari_1', value: 1, suit: 'denari', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/1+denari.webp' },
      { id: 'denari_2', value: 2, suit: 'denari', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/2+denari.webp' },
      { id: 'denari_3', value: 3, suit: 'denari', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/3+denari.webp' },
      { id: 'denari_4', value: 4, suit: 'denari', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/4+denari.webp' },
      { id: 'denari_5', value: 5, suit: 'denari', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/5+denari.webp' },
      { id: 'denari_6', value: 6, suit: 'denari', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/6+denari.webp' },
      { id: 'denari_7', value: 7, suit: 'denari', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/7+denari.webp' },
      { id: 'denari_8', value: 8, suit: 'denari', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/8+denari.webp' },
      { id: 'denari_9', value: 9, suit: 'denari', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/9+denari.webp' },
      { id: 'denari_10', value: 10, suit: 'denari', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/10+denari.webp' },

      // SPADE
      { id: 'spade_1', value: 1, suit: 'spade', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/asso+spade.webp' },
      { id: 'spade_2', value: 2, suit: 'spade', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/2+spade.webp' },
      { id: 'spade_3', value: 3, suit: 'spade', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/e+spade.webp' },
      { id: 'spade_4', value: 4, suit: 'spade', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/4+spade.webp' },
      { id: 'spade_5', value: 5, suit: 'spade', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/5+spade.webp' },
      { id: 'spade_6', value: 6, suit: 'spade', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/6+spade.webp' },
      { id: 'spade_7', value: 7, suit: 'spade', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/7+spade.webp' },
      { id: 'spade_8', value: 8, suit: 'spade', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/8+spade.webp' },
      { id: 'spade_9', value: 9, suit: 'spade', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/9+spade.webp' },
      { id: 'spade_10', value: 10, suit: 'spade', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/10+spade.webp' },
      
      // COPPE
      { id: 'coppe_1', value: 1, suit: 'coppe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/asso+coppe.webp' },
      { id: 'coppe_2', value: 2, suit: 'coppe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/2+coppe.webp' },
      { id: 'coppe_3', value: 3, suit: 'coppe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/3+coppe.webp' },
      { id: 'coppe_4', value: 4, suit: 'coppe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/4+coppe.webp' },
      { id: 'coppe_5', value: 5, suit: 'coppe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/5+coppe.webp' },
      { id: 'coppe_6', value: 6, suit: 'coppe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/6+coppe.webp' },
      { id: 'coppe_7', value: 7, suit: 'coppe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/7+coppe.webp' },
      { id: 'coppe_8', value: 8, suit: 'coppe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/8+coppe.webp' },
      { id: 'coppe_9', value: 9, suit: 'coppe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/9+coppe.webp' },
      { id: 'coppe_10', value: 10, suit: 'coppe', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/10+coppe.webp' }
    ] as CardAsset[]
  },

  // --- CARTE UNO (108 CARTE) ---
  UNO: {
    back: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cards/uno_back.webp',
    deck: [] as any[]
  },

  // --- CARTE SOLITARIO (52 CARTE POKER) ---
  SOLITARIO: {
    back: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cards/poker_back.webp',
    deck: [] as any[]
  }
};