
export interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
  statBoost: string;
  description: string;
}

export const SHOP_DATA: Record<string, ShopItem[]> = {
  "Freni": [
    { id: "f1", name: "Freno 1", price: 50, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/frno1+(1).webp", statBoost: "Frenata +1", description: "Pastiglie base per una frenata sicura in città." },
    { id: "f2", name: "Freno 2", price: 80, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/freno2+(1).webp", statBoost: "Frenata +2", description: "Dischi migliorati per una risposta più pronta." },
    { id: "f3", name: "Freno 3", price: 110, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/freno3+(1).webp", statBoost: "Frenata +3", description: "Kit frenante sportivo per una maggiore potenza." },
    { id: "f4", name: "Freno 4", price: 140, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/freno4+(1).webp", statBoost: "Frenata +4", description: "Sistema frenante avanzato per staccate decise." },
    { id: "f5", name: "Freno 5", price: 170, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/freno5+(1)+(1).webp", statBoost: "Frenata +5", description: "Il top della gamma per prestazioni da pista." }
  ],
  "Motori": [
    { id: "m1", name: "Carburatore Maggiorato", price: 250, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/motore1.webp", statBoost: "Velocità +2, Accel +2", description: "Ottimizza la miscela aria-carburante per un primo boost di potenza." },
    { id: "m2", name: "Centralina Elettronica", price: 350, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/motore2.webp", statBoost: "Velocità +3, Accel +3", description: "Gestione digitale avanzata per massimizzare l'efficienza del motore." },
    { id: "m3", name: "Turbocompressore", price: 450, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/motore3.webp", statBoost: "Velocità +4, Accel +4", description: "Sovralimentazione forzata per un'accelerazione e velocità incredibili." },
    { id: "m4", name: "Motore V6 Racing", price: 550, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/motore4.webp", statBoost: "Velocità +5, Accel +5", description: "Un propulsore da competizione progettato per dominare la pista." }
  ],
  "Pneumatici": [
    { id: "p1", name: "Pneumatico 1", price: 75, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/penu1.webp", statBoost: "Tenuta +1, Sicurezza +1", description: "Pneumatico base per la guida in città." },
    { id: "p2", name: "Pneumatico 2", price: 100, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/penu2.webp", statBoost: "Tenuta +2, Sicurezza +2", description: "Pneumatico intermedio con migliore aderenza." },
    { id: "p3", name: "Pneumatico 3", price: 125, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/pneu3.webp", statBoost: "Tenuta +3, Sicurezza +3", description: "Pneumatico avanzato per prestazioni superiori." },
    { id: "p4", name: "Pneumatico 4", price: 150, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/pneu4.webp", statBoost: "Tenuta +4, Sicurezza +4", description: "Pneumatico sportivo per curve veloci." },
    { id: "p5", name: "Pneumatico 5", price: 175, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/pneu5.webp", statBoost: "Tenuta +5, Sicurezza +5", description: "Il top della gamma per la massima sicurezza e grip." }
  ],
  "Sospensioni": [
    { id: "s1", name: "Molle Ribassate", price: 100, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/sospensione1.webp", statBoost: "Tenuta +1, Sicurezza +1", description: "Abbassa il baricentro per una maggiore stabilità nelle curve strette." },
    { id: "s2", name: "Ammortizzatori a Gas", price: 150, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/sospensione2.webp", statBoost: "Tenuta +2, Sicurezza +2", description: "Smorzamento reattivo per una guida più fluida e sicura." },
    { id: "s3", name: "Barre Antirollio", price: 200, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/sospensione3.webp", statBoost: "Tenuta +3, Sicurezza +3", description: "Riduce l'inclinazione laterale per una tenuta di strada superiore." },
    { id: "s4", name: "Assetto Regolabile", price: 250, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/sospensione4.webp", statBoost: "Tenuta +4, Sicurezza +4", description: "Sospensioni personalizzabili per adattarsi a ogni stile di guida." },
    { id: "s5", name: "Sospensioni Attive", price: 300, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/sospensione5.webp", statBoost: "Tenuta +6, Sicurezza +6", description: "Controllo elettronico istantaneo per la massima sicurezza e grip." }
  ],
  "Scarichi": [
    { id: "e1", name: "Terminale Eco-Flow", price: 50, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/scarico1.webp", statBoost: "Affidabilità +3, Velocità +3", description: "Migliora il deflusso dei gas per un motore più fluido." },
    { id: "e2", name: "Scarico Sportivo V-Core", price: 100, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/scarico2.webp", statBoost: "Affidabilità +4, Velocità +4", description: "Sound aggressivo e incremento di potenza ai medi regimi." },
    { id: "e3", name: "Sistema Pro-Racing X", price: 150, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/scarico3.webp", statBoost: "Affidabilità +5, Velocità +5", description: "Progettato per le massime prestazioni in pista." },
    { id: "e4", name: "Scarico Titanio Ultra", price: 200, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/scarico4.webp", statBoost: "Affidabilità +6, Velocità +6", description: "Leggerezza estrema e resistenza alle alte temperature." },
    { id: "e5", name: "Sistema Master-Flow GT", price: 250, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/scarico5.webp", statBoost: "Affidabilità +7, Velocità +7", description: "L'apice della tecnologia degli scarichi sportivi." }
  ],
  "Olii": [
    { id: "o1", name: "Olio 1", price: 30, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/oil1.webp", statBoost: "Affidabilità +1", description: "Olio base per una lubrificazione standard del motore." },
    { id: "o2", name: "Olio 2", price: 45, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/oil2.webp", statBoost: "Affidabilità +2", description: "Migliore protezione contro l'usura quotidiana." },
    { id: "o3", name: "Olio 3", price: 60, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/oil3.webp", statBoost: "Affidabilità +3", description: "Formula avanzata per ridurre gli attriti interni." },
    { id: "o4", name: "Olio 4", price: 70, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/oil4.webp", statBoost: "Affidabilità +4", description: "Lubrificazione ad alte prestazioni per motori sportivi." },
    { id: "o5", name: "Olio 5", price: 90, image: "https://loneboo-images.s3.eu-south-1.amazonaws.com/oil5.webp", statBoost: "Affidabilità +5", description: "Il massimo della protezione e affidabilità per la tua auto." }
  ]
};
