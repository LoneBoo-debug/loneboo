
import { GradeCurriculumData, SchoolSubject } from '../../types';

export const GRADE4_DATA: GradeCurriculumData = {
  grade: 4,
  subjects: {
    [SchoolSubject.ITALIANO]: [
      {
        id: 'it4_c1',
        title: 'Analisi Grammaticale',
        lessons: [
          {
            id: 'it4_c1_l1',
            title: 'Le categorie delle parole',
            text: 'Fare l\'analisi grammaticale significa dire tutto quello che sappiamo su ogni parola di una frase. \n\nEsempio: "Il gatto corre"\nIL: articolo determinativo, maschile, singolare.\nGATTO: nome comune di animale, maschile, singolare.\nCORRE: voce del verbo secondo, 3ª pers. singolare.',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Cosa indica "mangiamo" nell\'analisi grammaticale?',
              options: ['Nome proprio', 'Voce del verbo mangiare', 'Aggettivo'],
              correctIndex: 1,
              feedback: 'Esatto! È un\'azione, quindi un verbo! 🍕'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'it4_c2',
        title: 'Verbi (Tempi)',
        lessons: [
          {
            id: 'it4_c2_l1',
            title: 'Passato, Presente e Futuro',
            text: 'I verbi cambiano forma per dirci QUANDO succede qualcosa. \n\nPASSATO: ieri ho giocato. 🕒\nPRESENTE: ora gioco. 🌟\nFUTURO: domani giocherò. 🚀',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: '"Io canterò" a che tempo appartiene?',
              options: ['Passato', 'Presente', 'Futuro'],
              correctIndex: 2,
              feedback: 'Giusto! È un\'azione che deve ancora accadere. 🎶'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'it4_c3',
        title: 'I Complementi',
        lessons: [
          {
            id: 'it4_c3_l1',
            title: 'Espandiamo la frase',
            text: 'I complementi servono per dare più informazioni. \n\nCOMPL. OGGETTO: risponde a "Chi? Che cosa?" (Mangio LA MELA).\nCOMPL. DI LUOGO: risponde a "Dove?" (Gioco IN GIARDINO).\nCOMPL. DI TEMPO: risponde a "Quando?" (Vado a scuola ALLE OTTO).',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'In "Il gatto beve il latte", che complemento è "il latte"?',
              options: ['Di luogo', 'Oggetto', 'Di tempo'],
              correctIndex: 1,
              feedback: 'Bravissimo! Risponde alla domanda "che cosa?". 🥛'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'it4_c4',
        title: 'Testi Narrativi',
        lessons: [
          {
            id: 'it4_c4_l1',
            title: 'Raccontare storie',
            text: 'Un testo narrativo racconta dei fatti. Ha sempre: \n1. INIZIO: chi sono i personaggi e dove sono.\n2. SVOLGIMENTO: cosa succede, i problemi da risolvere.\n3. CONCLUSIONE: come finisce la storia.',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'In quale parte della storia troviamo la soluzione ai problemi?',
              options: ['Inizio', 'Svolgimento', 'Conclusione'],
              correctIndex: 2,
              feedback: 'Perfetto! È il gran finale! 🎬'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'it4_c5',
        title: 'Il Riassunto',
        lessons: [
          {
            id: 'it4_c5_l1',
            title: 'Saper sintetizzare',
            text: 'Riassumere significa riscrivere una storia più corta, tenendo solo le cose più importanti. \n\nBisogna togliere le descrizioni troppo lunghe e usare parole semplici per far capire il succo del racconto. 🍊',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Cosa bisogna togliere nel riassunto?',
              options: ['I personaggi principali', 'I fatti più importanti', 'I dettagli non necessari'],
              correctIndex: 2,
              feedback: 'Esatto! Dobbiamo essere brevi ma chiari. ✍️'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      }
    ],
    [SchoolSubject.MATEMATICA]: [
      {
        id: 'mat4_c1',
        title: 'Numbers Grandi',
        lessons: [
          {
            id: 'mat4_c1_l1',
            title: 'Oltre il Mille',
            text: 'In quarta impariamo i numeri fino a 999.999! \n\nUsiamo le classi: \n- Classe delle UNITA semplici (u, da, h)\n- Classe delle MIGLIAIA (uk, dak, hk).\n\nEsempio: 125.400 si legge centoventicinquemilaquattrocento.',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Cosa rappresenta "dak" nei numeri grandi?',
              options: ['Decine di migliaia', 'Decine semplici', 'Dadi magici'],
              correctIndex: 0,
              feedback: 'Giusto! Dak sta per Decine di Migliaia. 🔢'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'mat4_c2',
        title: 'Operazioni Complesse',
        lessons: [
          {
            id: 'mat4_c2_l1',
            title: 'Calcoli difficili',
            text: 'Impariamo a fare le moltiplicazioni a due cifre (es: 25 x 14) e le divisioni più lunghe con il resto. \n\nRicorda di mettere bene in colonna e di non dimenticare mai i riporti! ➕✖️',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'In una divisione, come si chiama il numero che "avanza"?',
              options: ['Prodotto', 'Resto', 'Somma'],
              correctIndex: 1,
              feedback: 'Bravissimo! È il resto. ➗'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'mat4_c3',
        title: 'Le Frazioni',
        lessons: [
          {
            id: 'mat4_c3_l1',
            title: 'Frazioni complementari',
            text: 'Due frazioni sono complementari se messe insieme formano l\'intero (1). \n\nEsempio: Se mangi 3/4 di torta, ne resta 1/4. \n3/4 + 1/4 = 4/4 = 1 torta intera! 🎂',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Qual è la frazione complementare di 2/5?',
              options: ['3/5', '1/5', '5/5'],
              correctIndex: 0,
              feedback: 'Esatto! 2 + 3 fa 5! 🍰'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'mat4_c4',
        title: 'I Decimali',
        lessons: [
          {
            id: 'mat4_c4_l1',
            title: 'Numeri con la virgola',
            text: 'I numeri decimali servono per indicare parti più piccole dell\'unità. \n\nLa VIRGOLA separa la parte intera da quella decimale.\n0,1 = un decimo\n0,01 = un centesimo\n0,001 = un millesimo',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Quale numero è più grande?',
              options: ['0,5', '0,05', '0,005'],
              correctIndex: 0,
              feedback: 'Ottimo! 0,5 è mezzo, quindi il più grande! 🪙'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'mat4_c5',
        title: 'Problemi',
        lessons: [
          {
            id: 'mat4_c5_l1',
            title: 'Problemi a due tappe',
            text: 'A volte per trovare la risposta serve fare più di un calcolo! \n\nEsempio: Compri 2 libri da 10€ e paghi con 50€. Quanto ricevi di resto? \n1. Calcola il totale (2x10=20)\n2. Calcola il resto (50-20=30)',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Se hai 10€ e compri 3 figurine da 2€ l\'una, quanto ti resta?',
              options: ['8€', '4€', '6€'],
              correctIndex: 1,
              feedback: 'Giusto! 3x2=6, e 10-6=4. 🃏'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      }
    ],
    [SchoolSubject.STORIA]: [
      {
        id: 'st4_c1',
        title: 'Civiltà Antiche',
        lessons: [
          {
            id: 'st4_c1_l1',
            title: 'Sumeri, Babilonesi e Assiri',
            text: 'In Mesopotamia, tra i fiumi Tigri ed Eufrate, nacquero le prime grandi civiltà. I Sumeri inventarono la scrittura cuneiforme e la ruota! 🎡📝',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Quale popolo inventò la scrittura cuneiforme?',
              options: ['Romani', 'Sumeri', 'Greci'],
              correctIndex: 1,
              feedback: 'Ottimo! Erano dei veri geni del passato. ✨'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'st4_c2',
        title: 'Gli Egizi',
        lessons: [
          {
            id: 'st4_c2_l1',
            title: 'Il Dono del Nilo',
            text: 'L\'antico Egitto fiorì lungo le rive del fiume Nilo. Costruirono piramidi giganti per i loro re, i Faraoni, e usavano i geroglifici per scrivere. 🏺🐫',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Come si chiamavano i re dell\'Antico Egitto?',
              options: ['Imperatori', 'Faraoni', 'Presidenti'],
              correctIndex: 1,
              feedback: 'Bravissimo! I Faraoni erano considerati come dei. 👑'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'st4_c3',
        title: 'I Greci',
        lessons: [
          {
            id: 'st4_c3_l1',
            title: 'Le Poleis e i Miti',
            text: 'La Grecia era divisa in città-stato chiamate Poleis (come Atene e Sparta). Inventarono la democrazia, le Olimpiadi e amavano raccontare storie di dei ed eroi! 🏛️⚡',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'In quale città greca nacque la democrazia?',
              options: ['Atene', 'Sparta', 'Roma'],
              correctIndex: 0,
              feedback: 'Esatto! Atene è la culla della libertà. 🏛️'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'st4_c4',
        title: 'I Romani',
        lessons: [
          {
            id: 'st4_c4_l1',
            title: 'Dalle Origini all\'Impero',
            text: 'Roma iniziò come un piccolo villaggio sul Tevere e divenne padrona di tutto il Mediterraneo. Costruirono strade, acquedotti e anfiteatri come il Colosseo! 🛡️🏟️',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Quale famoso anfiteatro si trova a Roma?',
              options: ['Partenone', 'Colosseo', 'Piramide'],
              correctIndex: 1,
              feedback: 'Proprio così! È il simbolo di Roma antica. 🏟️'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      }
    ],
    [SchoolSubject.GEOGRAFIA]: [
      {
        id: 'geo4_c1',
        title: 'Regioni Italiane',
        lessons: [
          {
            id: 'geo4_c1_l1',
            title: 'Nord, Centro, Sud e Isole',
            text: 'L\'Italia è divisa in 20 regioni! Ogni regione ha le sue bellezze, le sue città e i suoi piatti tipici. Dalle Alpi innevate alla Sicilia soleggiata! 🗺️🍕',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Quante sono le regioni italiane?',
              options: ['10', '20', '50'],
              correctIndex: 1,
              feedback: 'Esatto! 20 regioni che formano il nostro stivale. 🇮🇹'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'geo4_c2',
        title: 'I Climi',
        lessons: [
          {
            id: 'geo4_c2_l1',
            title: 'Il tempo che fa',
            text: 'In Italia ci sono climi diversi: alpino (freddo), padano (umido), appenninico e mediterraneo (mite). Le montagne e il mare cambiano la temperatura! ❄️☀️',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Che tipo di clima c\'è solitamente vicino al mare in Italia?',
              options: ['Alpino', 'Mediterraneo', 'Desertico'],
              correctIndex: 1,
              feedback: 'Giusto! È un clima mite e piacevole. 🏖️'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'geo4_c3',
        title: 'Attività Umane',
        lessons: [
          {
            id: 'geo4_c3_l1',
            title: 'I tre settori',
            text: 'L\'uomo lavora in tre settori: \n1. PRIMARIO: agricoltura e pesca 🌾\n2. SECONDARIO: industrie e fabbriche 🏭\n3. TERZIARIO: servizi e turismo 🏨',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'A quale settore appartiene il lavoro del contadino?',
              options: ['Primario', 'Secondario', 'Terziario'],
              correctIndex: 0,
              feedback: 'Bravissimo! Tutto ciò che viene dalla natura è settore primario. 🚜'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      }
    ],
    [SchoolSubject.SCIENZE]: [
      {
        id: 'sci4_c1',
        title: 'Apparati del corpo',
        lessons: [
          {
            id: 'sci4_c1_l1',
            title: 'La nostra fabbrica interna',
            text: 'Il nostro corpo ha sistemi che lavorano insieme: \n- DIGERENTE: trasforma il cibo. 🍎\n- RESPIRATORIO: ci dà ossigeno. 🫁\n- CIRCOLATORIO: trasporta il sangue. ❤️',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Quale apparato ci serve per respirare?',
              options: ['Digerente', 'Respiratorio', 'Scheletrico'],
              correctIndex: 1,
              feedback: 'Ottimo! I polmoni sono i protagonisti. 🫁'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'sci4_c2',
        title: 'Stati della materia',
        lessons: [
          {
            id: 'sci4_c2_l1',
            title: 'Molecole in movimento',
            text: 'Tutto ciò che ci circonda è materia. Può cambiare stato:\n- FUSIONE: da solido a liquido (ghiaccio che si scioglie).\n- EVAPORAZIONE: da liquido a gas (acqua che bolle). 💧💨',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Come si chiama il passaggio da solido a liquido?',
              options: ['Fusione', 'Solidificazione', 'Condensazione'],
              correctIndex: 0,
              feedback: 'Esatto! Il calore fa "fondere" la materia. 🔥'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      },
      {
        id: 'sci4_c3',
        title: 'Energia e Forze',
        lessons: [
          {
            id: 'sci4_c3_l1',
            title: 'La forza di gravità',
            text: 'Le forze muovono gli oggetti. La gravità è la forza invisibile della Terra che ci tiene attaccati al suolo e fa cadere le mele dagli alberi! 🌍🍎',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array and added missing activities
            quizzes: [{
              question: 'Perché gli oggetti cadono verso il basso?',
              options: ['Per la forza di gravità', 'Per il vento', 'Perché sono pesanti'],
              correctIndex: 0,
              feedback: 'Splendido! Senza gravità voleremmo via! 🚀'
            }],
            // Added missing mandatory property
            activities: []
          }
        ]
      }
    ]
  }
};
