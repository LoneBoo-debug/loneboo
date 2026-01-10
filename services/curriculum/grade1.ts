
import { GradeCurriculumData, SchoolSubject } from '../../types';

export const GRADE1_DATA: GradeCurriculumData = {
  grade: 1,
  subjects: {
    [SchoolSubject.ITALIANO]: [
      {
        id: 'it1_c1',
        title: 'Le Vocali',
        lessons: [
          {
            id: 'it1_c1_l1',
            title: 'Le amiche Vocali',
            text: 'Le vocali sono cinque: A, E, I, O, U. Senza di loro le parole non possono cantare! \n\nA come Ape 🐝\nE come Elefante 🐘\nI come Isola 🏝️\nO come Orso 🐻\nU come Uccellino 🐦',
            audioUrl: '',
            quiz: {
              question: 'Quali sono le vocali?',
              options: ['A, B, C', 'A, E, I, O, U', '1, 2, 3'],
              correctIndex: 1,
              feedback: 'Bravissimo! Sono proprio loro! ✨'
            }
          }
        ]
      },
      {
        id: 'it1_c2',
        title: 'Le Consonanti',
        lessons: [
          {
            id: 'it1_c2_l1',
            title: 'Le lettere forti',
            text: 'Le consonanti sono le lettere che hanno bisogno delle vocali per fare un suono dolce. \n\nB come Ballo 💃\nC come Cane 🐶\nD come Dado 🎲',
            audioUrl: '',
            quiz: {
              question: 'Quale di queste è una consonante?',
              options: ['A', 'E', 'B'],
              correctIndex: 2,
              feedback: 'Giusto! La B è una consonante! 🎈'
            }
          }
        ]
      },
      {
        id: 'it1_c3',
        title: 'Le Sillabe',
        lessons: [
          {
            id: 'it1_c3_l1',
            title: 'I mattoncini delle parole',
            text: 'Quando una consonante incontra una vocale, nasce una sillaba! \n\nM + A = MA\nM + E = ME\n\nProviamo insieme: MA-RE!',
            audioUrl: '',
            quiz: {
              question: 'Cosa formano M + O?',
              options: ['MO', 'MA', 'MU'],
              correctIndex: 0,
              feedback: 'M-O... MO! Come una Mucca! 🐮'
            }
          }
        ]
      },
      {
        id: 'it1_c4',
        title: 'Parole semplici',
        lessons: [
          {
            id: 'it1_c4_l1',
            title: 'Leggiamo insieme',
            text: 'Uniamo le sillabe per formare parole intere. \n\nCA + SA = CASA 🏠\nME + LA = MELA 🍎\nSO + LE = SOLE ☀️',
            audioUrl: '',
            quiz: {
              question: 'Quale parola è formata da SO + LE?',
              options: ['Sale', 'Sole', 'Sola'],
              correctIndex: 1,
              feedback: 'Splendido come il Sole! ☀️'
            }
          }
        ]
      },
      {
        id: 'it1_c5',
        title: 'Frasi minime',
        lessons: [
          {
            id: 'it1_c5_l1',
            title: 'Chi fa cosa?',
            text: 'Una frase minima è formata da qualcuno che fa un\'azione. \n\nIl cane corre. 🐕\nIl bimbo mangia. 👦\nLone Boo balla. 👻',
            audioUrl: '',
            quiz: {
              question: 'Quale di queste è una frase minima?',
              options: ['Il gatto dorme', 'La mela rossa', 'Un cane'],
              correctIndex: 0,
              feedback: 'Esatto! Il gatto fa l\'azione di dormire. 💤'
            }
          }
        ]
      },
      {
        id: 'it1_c6',
        title: 'Gli Articoli',
        lessons: [
          {
            id: 'it1_c6_l1',
            title: 'I piccoli aiutanti',
            text: 'Gli articoli stanno davanti ai nomi e ci dicono se sono maschi o femmine, uno o tanti! \n\nIL nonno, LA nonna.\nI fiori, LE stelle.',
            audioUrl: '',
            quiz: {
              question: 'Quale articolo metti davanti a "MELA"?',
              options: ['Il', 'La', 'Lo'],
              correctIndex: 1,
              feedback: 'Bravissimo! Si dice LA mela. 🍎'
            }
          }
        ]
      },
      {
        id: 'it1_c7',
        title: 'Nomi comuni',
        lessons: [
          {
            id: 'it1_c7_l1',
            title: 'Tutto ha un nome',
            text: 'I nomi comuni servono per chiamare tutte le cose, le persone e gli animali del mondo senza usare il loro nome proprio. \n\nbambino, gatto, tavolo, scuola, matita.',
            audioUrl: '',
            quiz: {
              question: 'Quale di questi è un nome comune di animale?',
              options: ['Maestra', 'Leone', 'Palla'],
              correctIndex: 1,
              feedback: 'Ruggi come un vero leone! 🦁'
            }
          }
        ]
      }
    ],
    [SchoolSubject.MATEMATICA]: [
      {
        id: 'mat1_c1',
        title: 'Numeri 0-10',
        lessons: [
          {
            id: 'mat1_c1_l1',
            title: 'I primi numeri',
            text: 'Impariamo a contare le dita delle mani! \n\n0: Niente...\n1: Un Boo! 👻\n2: Due occhi! 👀\n3: Tre stelle! 🌟\n...e così via fino a 10!',
            audioUrl: '',
            quiz: {
              question: 'Quante dita hai in una mano?',
              options: ['3', '5', '10'],
              correctIndex: 1,
              feedback: 'Esatto! Cinque dita tutte per te! 🖐️'
            }
          }
        ]
      },
      {
        id: 'mat1_c2',
        title: 'Numeri 0-20',
        lessons: [
          {
            id: 'mat1_c2_l1',
            title: 'Oltre il dieci',
            text: 'Dopo il 10 arrivano i numeri "teen"! \n\n11: Undici\n12: Dodici\n...e il 20 è formato da due decine!',
            audioUrl: '',
            quiz: {
              question: 'Quale numero viene subito dopo il 15?',
              options: ['14', '16', '20'],
              correctIndex: 1,
              feedback: 'Giusto! Il 16 è il fratello maggiore del 15! 🔢'
            }
          }
        ]
      },
      {
        id: 'mat1_c3',
        title: 'Confronti',
        lessons: [
          {
            id: 'mat1_c3_l1',
            title: 'Chi è più grande?',
            text: 'Usiamo i segni magici: \n\n> Maggiore (la bocca del coccodrillo mangia il più grande)\n< Minore\n= Uguale',
            audioUrl: '',
            quiz: {
              question: 'Tra 8 e 5, quale numero è MAGGIORE?',
              options: ['8', '5', 'Sono uguali'],
              correctIndex: 0,
              feedback: 'Bravissimo! 8 è più grande di 5! 🐊'
            }
          }
        ]
      },
      {
        id: 'mat1_c4',
        title: 'Addizioni',
        lessons: [
          {
            id: 'mat1_c4_l1',
            title: 'Mettiamo insieme',
            text: 'L\'addizione usa il segno PIÙ (+). \n\n2 mele + 3 mele = 5 mele! 🍎\n\nÈ come mettere tutto in un unico grande cesto.',
            audioUrl: '',
            quiz: {
              question: 'Quanto fa 4 + 2?',
              options: ['5', '6', '7'],
              correctIndex: 1,
              feedback: 'Ottimo! 4 e 2 fanno proprio 6! ➕'
            }
          }
        ]
      },
      {
        id: 'mat1_c5',
        title: 'Sottrazioni',
        lessons: [
          {
            id: 'mat1_c5_l1',
            title: 'Togliamo via',
            text: 'La sottrazione usa il segno MENO (-). \n\n5 biscotti - 2 mangiati = 3 rimasti! 🍪\n\nÈ come quando qualcosa sparisce o lo regaliamo.',
            audioUrl: '',
            quiz: {
              question: 'Quanto fa 10 - 3?',
              options: ['7', '8', '6'],
              correctIndex: 0,
              feedback: 'Corretto! Restano 7 elementi! ➖'
            }
          }
        ]
      },
      {
        id: 'mat1_c6',
        title: 'Problemi semplici',
        lessons: [
          {
            id: 'mat1_c6_l1',
            title: 'Piccole sfide',
            text: 'Un problema è una storia con una domanda. \n\nEsempio: Lone Boo ha 3 palloncini. Ne vola via 1. Quanti ne restano? \n\nRisposta: 3 - 1 = 2!',
            audioUrl: '',
            quiz: {
              question: 'Se hai 2 caramelle e la mamma te ne regala altre 2, quante ne hai in tutto?',
              options: ['2', '3', '4'],
              correctIndex: 2,
              feedback: 'Esatto! Che scorpacciata di caramelle! 🍬'
            }
          }
        ]
      }
    ],
    [SchoolSubject.STORIA]: [
      {
        id: 'st1_c1',
        title: 'Prima / Dopo',
        lessons: [
          {
            id: 'st1_c1_l1',
            title: 'La linea del tempo',
            text: 'Le cose accadono una dopo l\'altra. \n\nPRIMA metti i calzini, DOPO metti le scarpe. 👟\nPRIMA pianti un seme, DOPO nasce un fiore. 🌸',
            audioUrl: '',
            quiz: {
              question: 'Cosa fai DOPO esserti svegliato?',
              options: ['Vai a dormire', 'Fai colazione', 'Sogni'],
              correctIndex: 1,
              feedback: 'Gnam gnam! La colazione ti dà energia! 🥐'
            }
          }
        ]
      },
      {
        id: 'st1_c2',
        title: 'Giorno e Notte',
        lessons: [
          {
            id: 'st1_c2_l1',
            title: 'Il Sole e la Luna',
            text: 'Il tempo passa anche mentre dormi! \n\nDi GIORNO c\'è il Sole e andiamo a scuola. ☀️\nDi NOTTE c\'è la Luna e facciamo la nanna. 🌙',
            audioUrl: '',
            quiz: {
              question: 'Cosa vedi nel cielo di notte?',
              options: ['Il Sole', 'Le stelle', 'Le nuvole rosa'],
              correctIndex: 1,
              feedback: 'Splendido! Le stelle illuminano i tuoi sogni. ✨'
            }
          }
        ]
      },
      {
        id: 'st1_c3',
        title: 'Le Stagioni',
        lessons: [
          {
            id: 'st1_c3_l1',
            title: 'Il giro dell\'anno',
            text: 'Le stagioni sono quattro: \n\n🌸 PRIMAVERA: sbocciano i fiori.\n☀️ ESTATE: fa tanto caldo.\n🍂 AUTUNNO: cadono le foglie.\n❄️ INVERNO: arriva il freddo.',
            audioUrl: '',
            quiz: {
              question: 'In quale stagione fa molto freddo?',
              options: ['Estate', 'Primavera', 'Inverno'],
              correctIndex: 2,
              feedback: 'Brrr! Proprio in Inverno! ⛄'
            }
          }
        ]
      },
      {
        id: 'st1_c4',
        title: 'La mia giornata',
        lessons: [
          {
            id: 'st1_c4_l1',
            title: 'Tutto ha un ordine',
            text: 'La tua giornata è speciale! \n\nMattina: sveglia.\nPomeriggio: gioco.\nSera: cena.\nNotte: riposo.',
            audioUrl: '',
            quiz: {
              question: 'Quando vai a scuola solitamente?',
              options: ['Di notte', 'Di mattina', 'Di sera'],
              correctIndex: 1,
              feedback: 'Esatto! La mattina è il momento di imparare! 🎒'
            }
          }
        ]
      }
    ],
    [SchoolSubject.GEOGRAFIA]: [
      {
        id: 'geo1_c1',
        title: 'Spazio vicino/lontano',
        lessons: [
          {
            id: 'geo1_c1_l1',
            title: 'Dove si trova?',
            text: 'Gli oggetti possono essere vicini a noi (che possiamo toccarli) o lontani (come le nuvole o le montagne). \n\nEsempio: Il libro è VICINO, il sole è LONTANO. ☀️',
            audioUrl: '',
            quiz: {
              question: 'Se puoi toccare un oggetto, come si dice che è?',
              options: ['Lontano', 'Vicino', 'In alto'],
              correctIndex: 1,
              feedback: 'Esatto! Se lo tocchi, è proprio vicino! 🤝'
            }
          }
        ]
      },
      {
        id: 'geo1_c2',
        title: 'Sopra/Sotto/Destra/Sinistra',
        lessons: [
          {
            id: 'geo1_c2_l1',
            title: 'I segnali magici',
            text: 'Impariamo a orientarci! \n\nSOPRA la testa c\'è il cielo. ☁️\nSOTTO i piedi c\'è il prato. 🍀\nUsa le manine per scoprire la DESTRA e la SINISTRA!',
            audioUrl: '',
            quiz: {
              question: 'Dove si trovano le scarpe rispetto ai tuoi piedi?',
              options: ['Sopra', 'Sotto', 'Dentro'],
              correctIndex: 1,
              feedback: 'Giusto! Le scarpe proteggono i piedi da sotto. 👟'
            }
          }
        ]
      },
      {
        id: 'geo1_c3',
        title: 'Ambienti quotidiani',
        lessons: [
          {
            id: 'geo1_c3_l1',
            title: 'I posti che conosci',
            text: 'Ogni giorno visitiamo posti diversi: la camera da letto, la cucina, il parco, la nostra aula a scuola. Ogni posto ha le sue regole! 🏡',
            audioUrl: '',
            quiz: {
              question: 'In quale ambiente trovi i fornelli per cucinare?',
              options: ['Bagno', 'Camera', 'Cucina'],
              correctIndex: 2,
              feedback: 'Gnam gnam! Proprio in cucina! 🍕'
            }
          }
        ]
      },
      {
        id: 'geo1_c4',
        title: 'La casa',
        lessons: [
          {
            id: 'geo1_c4_l1',
            title: 'Il mio posto sicuro',
            text: 'La casa è divisa in stanze. In camera riposiamo, in bagno ci laviamo e in salotto giochiamo insieme. Qual è la tua stanza preferita? 🏠',
            audioUrl: '',
            quiz: {
              question: 'Cosa fai solitamente nella camera da letto?',
              options: ['Mangi', 'Dormi', 'Fai la doccia'],
              correctIndex: 1,
              feedback: 'Sogni d\'oro! Si dorme in camera. 💤'
            }
          }
        ]
      },
      {
        id: 'geo1_c5',
        title: 'La scuola',
        lessons: [
          {
            id: 'geo1_c5_l1',
            title: 'Dove si impara',
            text: 'A scuola ci sono tanti spazi: l\'aula con i banchi, la mensa, la palestra e il cortile per correre! È un posto magico per fare amicizia. 🏫',
            audioUrl: '',
            quiz: {
              question: 'Dove ti siedi per scrivere in classe?',
              options: ['Sulla cattedra', 'Al banco', 'Sull\'armadio'],
              correctIndex: 1,
              feedback: 'Bravissimo! Il banco è il tuo posto speciale! ✏️'
            }
          }
        ]
      }
    ],
    [SchoolSubject.SCIENZE]: [
      {
        id: 'sci1_c1',
        title: 'Vivente / Non vivente',
        lessons: [
          {
            id: 'sci1_c1_l1',
            title: 'Chi respira?',
            text: 'Le cose VIVENTI nascono, crescono, respirano e mangiano. \n\nEsempio: Una pianta, un gatto, tu! 🌿🐱\nLe cose NON VIVENTI non respirano.\nEsempio: Un sasso, una palla, un libro. 🪨⚽',
            audioUrl: '',
            quiz: {
              question: 'Quale di questi è un essere vivente?',
              options: ['Sasso', 'Gatto', 'Zaino'],
              correctIndex: 1,
              feedback: 'Miao! Esatto, il gatto è vivo e vegeto! 🐈'
            }
          }
        ]
      },
      {
        id: 'sci1_c2',
        title: 'I 5 Sensi',
        lessons: [
          {
            id: 'sci1_c2_l1',
            title: 'Scopriamo il mondo',
            text: 'Abbiamo 5 strumenti magici: \n\n👀 VISTA: per vedere i colori.\n👂 UDITO: per sentire la musica.\n👃 OLFATTO: per annusare i fiori.\n👅 GUSTO: per sentire i sapori.\n✋ TATTO: per toccare le cose morbide.',
            audioUrl: '',
            quiz: {
              question: 'Con cosa senti il sapore di un gelato?',
              options: ['Naso', 'Orecchie', 'Lingua'],
              correctIndex: 2,
              feedback: 'Bravo! La lingua ci fa sentire il dolce! 🍦'
            }
          }
        ]
      },
      {
        id: 'sci1_c3',
        title: 'Le piante',
        lessons: [
          {
            id: 'sci1_c3_l1',
            title: 'Le amiche verdi',
            text: 'Le piante hanno bisogno di acqua, terra e sole per crescere. \n\nRadici: stanno sotto terra.\nFusto: tiene in piedi la pianta.\nFoglie: servono per respirare.',
            audioUrl: '',
            quiz: {
              question: 'Di cosa ha bisogno una pianta per vivere?',
              options: ['Latte', 'Acqua e Sole', 'Giocattoli'],
              correctIndex: 1,
              feedback: 'Esatto! Senza acqua e sole le piante hanno sete! 💧☀️'
            }
          }
        ]
      },
      {
        id: 'sci1_c4',
        title: 'Gli animali',
        lessons: [
          {
            id: 'sci1_c4_l1',
            title: 'Tanti amici diversi',
            text: 'Esistono tanti tipi di animali! \n\nAlcuni volano nel cielo come gli uccelli. 🐦\nAlcuni nuotano nel mare come i pesci. 🐠\nAlcuni camminano sulla terra come i cani. 🐶',
            audioUrl: '',
            quiz: {
              question: 'Quale animale nuota sott\'acqua?',
              options: ['Pesce', 'Uccello', 'Farfalla'],
              correctIndex: 0,
              feedback: 'Giusto! I pesci sono campioni di nuoto! 🌊'
            }
          }
        ]
      }
    ]
  }
};
