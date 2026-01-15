
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
            text: 'Le vocali sono cinque amiche speciali:\nA, E, I, O, U.\nSono importanti perché senza di loro le parole non possono nascere.\nOgni vocale ha un suono diverso e vive dentro tantissime parole che usiamo ogni giorno.\nPer esempio, la A vive in casa, la E in elefante, la I in isola, la O in orso e la U in uva.\nQuando impariamo le vocali, iniziamo a leggere e scrivere le nostre prime parole.',
            audioUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-10T20_36_23_Sami+-+Italian+female+_pvc_sp82_s40_sb49_se85_b_m2.mp3',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quali sono le 5 vocali amiche?',
              options: ['A, E, I, O, U', 'A, B, C, D, E', '1, 2, 3, 4, 5'],
              correctIndex: 0,
              feedback: 'Bravissimo! Con queste 5 amiche puoi scrivere tantissime parole! ✨'
            }]
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
            text: 'Le consonanti sono tante e hanno bisogno delle vocali per parlare.\nDa sole fanno solo un piccolo rumore, ma insieme alle vocali diventano forti e chiare.\nLa M con la A diventa MA, la L con la U diventa LU.\nOgni parola è una squadra formata da consonanti e vocali che lavorano insieme.',
            audioUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-10T21_18_11_Sami+-+Italian+female+_pvc_sp82_s40_sb49_se85_b_m2.mp3',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Di cosa hanno bisogno le consonanti per parlare?',
              options: ['Delle vocali', 'Dei numeri', 'Di stare da sole'],
              correctIndex: 0,
              feedback: 'Giusto! Insieme alle vocali formano una squadra fortissima! 🎈'
            }]
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
            text: 'Le sillabe sono piccoli pezzetti di parole.\nQuando diciamo una parola lentamente, possiamo sentire le sillabe una alla volta.\nLa parola PA-PA ha due sillabe, mentre CA-SA ne ha due diverse.\nDividere le parole in sillabe ci aiuta a leggere meglio e senza paura.',
            audioUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-10T21_27_01_Sami+-+Italian+female+_pvc_sp82_s40_sb49_se85_b_m2.mp3',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'In quante sillabe si divide la parola CA-SA?',
              options: ['Due', 'Una', 'Quattro'],
              correctIndex: 0,
              feedback: 'Esatto! CA-SA sono due pezzetti di parola! 🏠'
            }]
          }
        ]
      },
      {
        id: 'it1_c4',
        title: 'Le Parole',
        lessons: [
          {
            id: 'it1_c4_l1',
            title: 'Le Parole',
            text: 'Le parole servono per dire cosa vediamo, cosa pensiamo e cosa proviamo.\nOgni parola ha un significato e racconta qualcosa.\nCon le parole possiamo salutare, chiedere aiuto, giocare e raccontare storie bellissime.',
            audioUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-10T22_27_11_Sami+-+Italian+female+_pvc_sp82_s40_sb49_se85_b_m2.mp3',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'A cosa servono le parole?',
              options: ['Solo per cantare', 'Per dire cosa vediamo e proviamo', 'Per fare i disegni'],
              correctIndex: 1,
              feedback: 'Esatto! Le parole ci aiutano a condividere tutto ciò che abbiamo nel cuore! ✨'
            }]
          }
        ]
      },
      {
        id: 'it1_c5',
        title: 'Le frasi',
        lessons: [
          {
            id: 'it1_c5_l1',
            title: 'Le frasi',
            text: 'Una frase è una piccola idea completa.\nInizia con una lettera grande e finisce con un punto.\nCon una frase possiamo dire qualcosa che ha senso, come Il gatto dorme.\nLe frasi ci aiutano a raccontare quello che succede.',
            audioUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-10T22_31_46_Sami+-+Italian+female+_pvc_sp82_s40_sb49_se85_b_m2.mp3',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Con cosa finisce sempre una frase?',
              options: ['Con un numero', 'Con un punto', 'Con una virgola'],
              correctIndex: 1,
              feedback: 'Bravissimo! Il punto chiude la tua idea magica! ✍️'
            }]
          }
        ]
      },
      {
        id: 'it1_c6',
        title: 'Gli Articoli',
        lessons: [
          {
            id: 'it1_c6_l1',
            title: 'Gli Articoli',
            text: 'Gli articoli sono piccole parole che stanno davanti ai nomi.\nServono per dire meglio di cosa stiamo parlando.\nQuando diciamo il gatto oppure una mela, stiamo usando un articolo.\nGli articoli aiutano le parole a farsi capire e rendono le frasi più complete.',
            audioUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-10T22_38_42_Sami+-+Italian+female+_pvc_sp82_s40_sb49_se85_b_m2.mp3',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quale articolo metti davanti a "MELA"?',
              options: ['Il', 'La', 'Lo'],
              correctIndex: 1,
              feedback: 'Bravissimo! Si dice LA mela. 🍎'
            }]
          }
        ]
      },
      {
        id: 'it1_c7',
        title: 'I nomi',
        lessons: [
          {
            id: 'it1_c7_l1',
            title: 'I nomi',
            text: 'I nomi sono parole che servono per dare un nome alle cose.\nCon i nomi possiamo dire come si chiama una persona, un animale o un oggetto.\nOgni cosa intorno a noi ha un nome.\nI nomi ci aiutano a parlare e a raccontare ciò che vediamo.',
            audioUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-10T22_42_15_Sami+-+Italian+female+_pvc_sp82_s40_sb49_se85_b_m2.mp3',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'A cosa servono i nomi?',
              options: ['Per dare un nome alle cose', 'Per fare i salti', 'Solo per dormire'],
              correctIndex: 0,
              feedback: 'Bravissimo! Tutto nel mondo ha un nome speciale! 🏷️'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quante dita hai in una mano?',
              options: ['3', '5', '10'],
              correctIndex: 1,
              feedback: 'Esatto! Cinque dita tutte per te! 🖐️'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quale numero viene subito dopo il 15?',
              options: ['14', '16', '20'],
              correctIndex: 1,
              feedback: 'Giusto! Il 16 è il fratello maggiore del 15! 🔢'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Tra 8 e 5, quale numero è MAGGORE?',
              options: ['8', '5', 'Sono uguali'],
              correctIndex: 0,
              feedback: 'Bravissimo! 8 è più grande di 5! 🐊'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quanto fa 4 + 2?',
              options: ['5', '6', '7'],
              correctIndex: 1,
              feedback: 'Ottimo! 4 e 2 fanno proprio 6! ➕'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quanto fa 10 - 3?',
              options: ['7', '8', '6'],
              correctIndex: 0,
              feedback: 'Corretto! Restano 7 elementi! ➖'
            }]
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
            text: 'Un problema è una story con una domanda. \n\nEsempio: Lone Boo ha 3 palloncini. Ne vola via 1. Quanti ne restano? \n\nRisposta: 3 - 1 = 2!',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Se hai 2 caramelle e la mamma te ne regala altre 2, quante ne hai in tutto?',
              options: ['2', '3', '4'],
              correctIndex: 2,
              feedback: 'Esatto! Che scorpacciata di caramelle! 🍬'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Cosa fai DOPO esserti svegliato?',
              options: ['Vai a dormire', 'Fai colazione', 'Sogni'],
              correctIndex: 1,
              feedback: 'Gnam gnam! La colazione ti dà energia! 🥐'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Cosa vedi nel cielo di notte?',
              options: ['Il Sole', 'Le stelle', 'Le nuvole rosa'],
              correctIndex: 1,
              feedback: 'Splendido! Le stelle illuminano i tuoi sogni. ✨'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'In quale stagione fa molto freddo?',
              options: ['Estate', 'Primavera', 'Inverno'],
              correctIndex: 2,
              feedback: 'Brrr! Proprio in Inverno! ⛄'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quando vai a scuola solitamente?',
              options: ['Di notte', 'Di mattina', 'Di sera'],
              correctIndex: 1,
              feedback: 'Esatto! La mattina è il momento di imparare! 🎒'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Se puoi toccare un oggetto, come si dice che è?',
              options: ['Lontano', 'Vicino', 'In alto'],
              correctIndex: 1,
              feedback: 'Esatto! Se lo tocchi, è proprio vicino! 🤝'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Dove si trovano le scarpe rispetto ai tuoi piedi?',
              options: ['Sopra', 'Sotto', 'Dentro'],
              correctIndex: 1,
              feedback: 'Giusto! Le scarpe proteggono i piedi da sotto. 👟'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'In quale ambiente trovi i fornelli per cucinare?',
              options: ['Bagno', 'Camera', 'Cucina'],
              correctIndex: 2,
              feedback: 'Gnam gnam! Proprio in cucina! 🍕'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Cosa fai solitamente nella camera da letto?',
              options: ['Mangi', 'Dormi', 'Fai la doccia'],
              correctIndex: 1,
              feedback: 'Sogni d\'oro! Si dorme in camera. 💤'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Dove ti siedi per scrivere in classe?',
              options: ['Sulla cattedra', 'Al banco', 'Sull\'armadio'],
              correctIndex: 1,
              feedback: 'Bravissimo! Il banco è il tuo posto speciale! ✏️'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quale di questi è un essere vivente?',
              options: ['Sasso', 'Gatto', 'Zaino'],
              correctIndex: 1,
              feedback: 'Miao! Esatto, il gatto è vivo e vegeto! 🐈'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Con cosa senti il sapore di un gelato?',
              options: ['Naso', 'Orecchie', 'Lingua'],
              correctIndex: 2,
              feedback: 'Bravo! La lingua ci fa sentire il dolce! 🍦'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Di cosa ha bisogno una pianta per vivere?',
              options: ['Latte', 'Acqua e Sole', 'Giocattoli'],
              correctIndex: 1,
              feedback: 'Esatto! Senza acqua e sole le piante hanno sete! 💧☀️'
            }]
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
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quale animale nuota sott\'acqua?',
              options: ['Pesce', 'Uccello', 'Farfalla'],
              correctIndex: 0,
              feedback: 'Giusto! I pesci sono campioni di nuoto! 🌊'
            }]
          }
        ]
      }
    ]
  }
};
