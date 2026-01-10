
import { GradeCurriculumData, SchoolSubject } from '../../types';

export const GRADE3_DATA: GradeCurriculumData = {
  grade: 3,
  subjects: {
    [SchoolSubject.ITALIANO]: [
      {
        id: 'it3_c1',
        title: 'Parti del Discorso',
        lessons: [
          {
            id: 'it3_c1_l1',
            title: 'I vestiti delle parole',
            text: 'Ogni parola ha un compito preciso! \n\nI NOMI: indicano persone, animali o cose (mela, gatto).\nGLI ARTICOLI: accompagnano i nomi (il, la, un).\nGLI AGGETTIVI: ci dicono come sono le cose (grande, rosso).\nI VERBI: indicano le azioni (corre, mangia).',
            audioUrl: '',
            quiz: {
              question: 'Nella frase "Il gatto nero dorme", che parola è "nero"?',
              options: ['Nome', 'Aggettivo', 'Verbo'],
              correctIndex: 1,
              feedback: 'Esatto! Ci dice il colore del gatto! 🐈‍⬛'
            }
          }
        ]
      },
      {
        id: 'it3_c2',
        title: 'Verbi (Presente)',
        lessons: [
          {
            id: 'it3_c2_l1',
            title: 'Azioni nel presente',
            text: 'Il tempo presente indica qualcosa che accade proprio ORA. \n\nIo gioco 🎮\nTu mangi 🍎\nLui/Lei corre 🏃\nNoi cantiamo 🎶\nVoi saltate 🦘\nEssi ridono 😂',
            audioUrl: '',
            quiz: {
              question: 'Quale di questi verbi è al tempo presente?',
              options: ['Io giocavo', 'Io gioco', 'Io giocherò'],
              correctIndex: 1,
              feedback: 'Giusto! Sta succedendo proprio adesso! 🌟'
            }
          }
        ]
      },
      {
        id: 'it3_c3',
        title: 'Soggetto e Predicato',
        lessons: [
          {
            id: 'it3_c3_l1',
            title: 'Chi fa cosa?',
            text: 'Il SOGGETTO è chi compie l\'azione.\nIl PREDICATO è l\'azione stessa (il verbo).\n\nEsempio: "Lone Boo vola".\nLone Boo = Soggetto\nVola = Predicato',
            audioUrl: '',
            quiz: {
              question: 'Nella frase "La maestra spiega", chi è il sull\'oggetto?',
              options: ['Spiega', 'La maestra', 'Nessuno'],
              correctIndex: 1,
              feedback: 'Bravissimo! È la maestra che compie l\'azione. 👩‍🏫'
            }
          }
        ]
      },
      {
        id: 'it3_c4',
        title: 'Frasi Semplici',
        lessons: [
          {
            id: 'it3_c4_l1',
            title: 'Costruiamo la frase',
            text: 'Una frase semplice ha bisogno di pochi pezzi per farsi capire, ma devono essere in ordine! \n\nEsempio: "Il cane abbaia in giardino".\n\nPossiamo aggiungere espansioni per dire DOVE, QUANDO o COME avviene l\'azione.',
            audioUrl: '',
            quiz: {
              question: 'Quale frase è scritta correttamente?',
              options: ['Il mangia mela bambino', 'Il bambino mangia la mela', 'Mela bambino il mangia'],
              correctIndex: 1,
              feedback: 'Perfetto! L\'ordine delle parole è fondamentale. 🍎'
            }
          }
        ]
      },
      {
        id: 'it3_c5',
        title: 'Comprensione del Testo',
        lessons: [
          {
            id: 'it3_c5_l1',
            title: 'Investigatori di storie',
            text: 'Leggere bene significa capire cosa succede! \n\n"Zuccotto ha perso il suo cappello arancione nel bosco. Grufo lo ha trovato vicino al ruscello e glielo ha riportato." \n\nChi ha trovato il cappello?',
            audioUrl: '',
            quiz: {
              question: 'Chi ha trovato il cappello di Zuccotto?',
              options: ['Lone Boo', 'Grufo', 'Gaia'],
              correctIndex: 1,
              feedback: 'Ottimo spirito di osservazione! Era proprio Grufo. 🦉'
            }
          }
        ]
      }
    ],
    [SchoolSubject.MATEMATICA]: [
      {
        id: 'mat3_c1',
        title: 'Numeri fino a 1000',
        lessons: [
          {
            id: 'mat3_c1_l1',
            title: 'Il Migliaio',
            text: 'Dopo il 999 arriva il 1000! \n\n10 centinaia formano 1 MIGLIAIO (1k).\nPossiamo scrivere i numeri scomponendoli:\n452 = 4 centinaia, 5 decine, 2 unità.',
            audioUrl: '',
            quiz: {
              question: 'Quanto fa 900 + 100?',
              options: ['500', '1000', '100'],
              correctIndex: 1,
              feedback: 'Esatto! Siamo arrivati al mille! 💯'
            }
          }
        ]
      },
      {
        id: 'mat3_c2',
        title: 'Moltiplicazioni',
        lessons: [
          {
            id: 'mat3_c2_l1',
            title: 'In colonna con il riporto',
            text: 'Per le moltiplicazioni più grandi usiamo la colonna. \n\nSi moltiplica prima l\'unità, poi la decina.\nRicorda di sommare il riporto se c\'è!',
            audioUrl: '',
            quiz: {
              question: 'Quanto fa 12 x 3?',
              options: ['30', '36', '42'],
              correctIndex: 1,
              feedback: 'Corretto! 3x2=6, 3x1=3... 36! ✖️'
            }
          }
        ]
      },
      {
        id: 'mat3_c3',
        title: 'Divisioni',
        lessons: [
          {
            id: 'mat3_c3_l1',
            title: 'Dividere in parti uguali',
            text: 'La divisione serve per distribuire o raggruppare. \n\n15 caramelle divise tra 3 amici = 5 caramelle a testa! 🍬\nIl segno è il diviso (:).',
            audioUrl: '',
            quiz: {
              question: 'Quanto fa 20 : 4?',
              options: ['4', '5', '10'],
              correctIndex: 1,
              feedback: 'Giusto! Perché 5 x 4 fa 20. ➗'
            }
          }
        ]
      },
      {
        id: 'mat3_c4',
        title: 'Frazioni',
        lessons: [
          {
            id: 'mat3_c4_l1',
            title: 'Pezzi di un intero',
            text: 'Frazionare significa dividere un intero in parti UGUALI. \n\nSe dividi una pizza in 4 fette e ne mangi una, hai mangiato 1/4 (un quarto) della pizza! 🍕',
            audioUrl: '',
            quiz: {
              question: 'Come si chiama il numero sopra la linea nella frazione?',
              options: ['Denominatore', 'Numeratore', 'Risultato'],
              correctIndex: 1,
              feedback: 'Esatto! Il numeratore ci dice quante parti prendiamo. 🍕'
            }
          }
        ]
      },
      {
        id: 'mat3_c5',
        title: 'Misure',
        lessons: [
          {
            id: 'mat3_c5_l1',
            title: 'Lunghezza, Peso e Capacità',
            text: 'Per misurare usiamo le marche: \n\nMETRO (m) per quanto è lungo.\nGRAMMO (g) per quanto pesa.\nLITRO (l) per quanto liquido c\'è dentro.',
            audioUrl: '',
            quiz: {
              question: 'Quale misura usi per sapere quanto latte c\'è in una bottiglia?',
              options: ['Metri', 'Litri', 'Chilogrammi'],
              correctIndex: 1,
              feedback: 'Bravo! Il litro misura i liquidi. 🥛'
            }
          }
        ]
      }
    ],
    [SchoolSubject.STORIA]: [
      {
        id: 'st3_c1',
        title: 'Preistoria',
        lessons: [
          {
            id: 'st3_c1_l1',
            title: 'Prima della Storia',
            text: 'La Preistoria è il lunghissimo tempo prima dell\'invenzione della scrittura. \n\nSi divide in due grandi periodi: l\'Età della Pietra Antica (Paleolitico) e l\'Età della Pietra Nuova (Neolitico). 🦴',
            audioUrl: '',
            quiz: {
              question: 'Quale invenzione segna la fine della Preistoria?',
              options: ['La ruota', 'La scrittura', 'Il fuoco'],
              correctIndex: 1,
              feedback: 'Esatto! Con la scrittura gli uomini hanno iniziato a raccontare i fatti. 📝'
            }
          }
        ]
      },
      {
        id: 'st3_c2',
        title: 'Paleolitico',
        lessons: [
          {
            id: 'st3_c2_l1',
            title: 'L\'Età dei Nomadi',
            text: 'Nel Paleolitico gli uomini erano nomadi: si spostavano per cacciare e raccogliere frutti. \n\nScoprirono il FUOCO 🔥, che serviva per scaldarsi, illuminare e cuocere i cibi.',
            audioUrl: '',
            quiz: {
              question: 'Dove vivevano gli uomini del Paleolitico?',
              options: ['Nelle grotte', 'In grandi castelli', 'In città'],
              correctIndex: 0,
              feedback: 'Giusto! Le grotte erano il loro rifugio sicuro. 🦇'
            }
          }
        ]
      },
      {
        id: 'st3_c3',
        title: 'Neolitico',
        lessons: [
          {
            id: 'st3_c3_l1',
            title: 'L\'Età degli Agricoltori',
            text: 'Nel Neolitico l\'uomo imparò a coltivare la terra e ad allevare animali. \n\nDiventò sedentario: costruì i primi villaggi e imparò a tessere e a lavorare la ceramica. 🌾🏺',
            audioUrl: '',
            quiz: {
              question: 'Cosa significa essere "sedentari"?',
              options: ['Muoversi sempre', 'Vivere in un posto fisso', 'Saper correre'],
              correctIndex: 1,
              feedback: 'Bravissimo! Gli uomini smisero di viaggiare sempre. 🏡'
            }
          }
        ]
      },
      {
        id: 'st3_c4',
        title: 'Prime Civiltà',
        lessons: [
          {
            id: 'st3_c4_l1',
            title: 'Le Civiltà dei Fiumi',
            text: 'Le prime grandi città nacquero vicino ai grandi fiumi, perché l\'acqua era fondamentale per la vita e l\'agricoltura. \n\nPensa agli Egizi lungo il Nilo o ai Sumeri tra il Tigri e l\'Eufrate! 🌊🐪',
            audioUrl: '',
            quiz: {
              question: 'Perché le civiltà nacquero vicino ai fiumi?',
              options: ['Per fare il bagno', 'Per avere acqua e terre fertili', 'Perché c\'era la sabbia'],
              correctIndex: 1,
              feedback: 'Proprio così! I fiumi sono sorgenti di vita. 🌱'
            }
          }
        ]
      }
    ],
    [SchoolSubject.GEOGRAFIA]: [
      {
        id: 'geo3_c1',
        title: 'Orientamento',
        lessons: [
          {
            id: 'geo3_c1_l1',
            title: 'Troviamo la strada',
            text: 'Orientarsi significa sapere dove ci si trova rispetto a dei punti di riferimento. \n\nPossiamo usare il Sole al mattino o la Stella Polare di notte per capire la direzione! 🔭',
            audioUrl: '',
            quiz: {
              question: 'Cosa serve per orientarsi in un posto nuovo?',
              options: ['Chiudere gli occhi', 'Dei punti di riferimento', 'Correre veloce'],
              correctIndex: 1,
              feedback: 'Giusto! Alberi, montagne o palazzi ci aiutano. 🗺️'
            }
          }
        ]
      },
      {
        id: 'geo3_c2',
        title: 'Punti Cardinali',
        lessons: [
          {
            id: 'geo3_c2_l1',
            title: 'La bussola magica',
            text: 'Esistono 4 direzioni fondamentali: \n\n🌅 EST: dove sorge il sole.\n🌇 OVEST: dove tramonta il sole.\n❄️ NORD: verso il freddo.\n☀️ SUD: verso il caldo.',
            audioUrl: '',
            quiz: {
              question: 'Da che parte sorge sempre il Sole?',
              options: ['Nord', 'Ovest', 'Est'],
              correctIndex: 2,
              feedback: 'Splendido! L\'Est è la porta del mattino. 🌅'
            }
          }
        ]
      },
      {
        id: 'geo3_c3',
        title: 'Mappe',
        lessons: [
          {
            id: 'geo3_c3_l1',
            title: 'Il mondo in piccolo',
            text: 'Le mappe sono disegni della Terra vista dall\'alto, rimpicciolita usando una SCALA. \n\nI SIMBOLI servono per capire cosa c\'è: un triangolo per la montagna, un cerchio per la città! 🗺️',
            audioUrl: '',
            quiz: {
              question: 'Cosa serve per rimpicciolire un territorio su carta?',
              options: ['La scala di riduzione', 'Una gomma', 'Le forbici'],
              correctIndex: 0,
              feedback: 'Esatto! La scala ci dice quanto è diventato piccolo il disegno. 📏'
            }
          }
        ]
      },
      {
        id: 'geo3_c4',
        title: 'Territorio',
        lessons: [
          {
            id: 'geo3_c4_l1',
            title: 'Ambienti diversi',
            text: 'Il territorio italiano è molto vario: \n\n⛰️ MONTAGNA (oltre i 600 metri)\n🌳 COLLINA (rilievi dolci)\n🌾 PIANURA (terreni piatti)\n🏖️ MARE (dove la terra finisce)',
            audioUrl: '',
            quiz: {
              question: 'Quale territorio è perfetto per le fattorie perché è piatto?',
              options: ['La montagna', 'La pianura', 'Il vulcano'],
              correctIndex: 1,
              feedback: 'Bravissimo! In pianura è facile coltivare! 🚜'
            }
          }
        ]
      }
    ],
    [SchoolSubject.SCIENZE]: [
      {
        id: 'sci3_c1',
        title: 'Ciclo Vitale',
        lessons: [
          {
            id: 'sci3_c1_l1',
            title: 'Il giro della vita',
            text: 'Tutti gli esseri viventi compiono un ciclo: \n\n1. NASCONO 🐣\n2. CRESCONO 🌱\n3. SI RIPRODUCONO (fanno figli o semi)\n4. MUOIONO 🍂',
            audioUrl: '',
            quiz: {
              question: 'Qual è la prima fase del ciclo vitale?',
              options: ['Crescere', 'Nascere', 'Giocare'],
              correctIndex: 1,
              feedback: 'Esatto! Tutto inizia con la nascita! ✨'
            }
          }
        ]
      },
      {
        id: 'sci3_c2',
        title: 'Corpo Umano',
        lessons: [
          {
            id: 'sci3_c2_l1',
            title: 'Una macchina perfetta',
            text: 'Il nostro corpo è fatto di tante parti: \n\n💀 SCHELETRO: ci tiene in piedi.\n💪 MUSCOLI: ci fanno muovere.\n🧠 CERVELLO: comanda tutto!\n❤️ CUORE: pompa il sangue.',
            audioUrl: '',
            quiz: {
              question: 'Quale organo manda il sangue in tutto il corpo?',
              options: ['Lo stomaco', 'Il cuore', 'Le orecchie'],
              correctIndex: 1,
              feedback: 'Bum-bum! Il cuore non si ferma mai! ❤️'
            }
          }
        ]
      },
      {
        id: 'sci3_c3',
        title: 'Ecosistemi',
        lessons: [
          {
            id: 'sci3_c3_l1',
            title: 'Tutti collegati',
            text: 'Un ecosistema è l\'insieme di esseri viventi (piante, animali) e non viventi (aria, acqua, sassi) che vivono insieme e si aiutano. \n\nPensa allo stagno o al bosco! 🌳🦆',
            audioUrl: '',
            quiz: {
              question: 'Cosa fa parte di un ecosistema?',
              options: ['Solo gli animali', 'Solo le piante', 'Viventi e non viventi insieme'],
              correctIndex: 2,
              feedback: 'Giusto! Tutti hanno bisogno degli altri per vivere. 🤝'
            }
          }
        ]
      },
      {
        id: 'sci3_c4',
        title: 'Energia',
        lessons: [
          {
            id: 'sci3_c4_l1',
            title: 'La forza del mondo',
            text: 'L\'energia è ciò che permette di fare le cose! \n\nC\'è l\'energia del SOLE ☀️, del VENTO 🌬️, e quella che mangiamo noi per correre e saltare! 🍏',
            audioUrl: '',
            quiz: {
              question: 'Da dove prendono i bambini l\'energia per giocare?',
              options: ['Dalla televisione', 'Dal cibo', 'Dalle scarpe'],
              correctIndex: 1,
              feedback: 'Gnam! Il cibo è la nostra benzina magica! 🍎💪'
            }
          }
        ]
      }
    ]
  }
};
