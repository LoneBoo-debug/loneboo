
import { GradeCurriculumData, SchoolSubject } from '../../types';

export const GRADE5_DATA: GradeCurriculumData = {
  grade: 5,
  subjects: {
    [SchoolSubject.ITALIANO]: [
      {
        id: 'it5_c1',
        title: 'Analisi Logica',
        lessons: [
          {
            id: 'it5_c1_l1',
            title: 'Soggetto, Predicato e Complementi',
            text: 'L\'analisi logica serve a capire il legame tra i pezzi della frase. \n\nSOGGETTO: Chi fa l\'azione.\nPREDICATO: L\'azione (Verbale) o un modo di essere (Nominale).\nCOMPLEMENTO OGGETTO: Chi/Che cosa riceve l\'azione.\nALTRI COMPLEMENTI: Specificano dove, quando, come, con chi.',
            audioUrl: '',
            quiz: {
              question: 'In "Lone Boo mangia una mela", cos\'è "una mela"?',
              options: ['Soggetto', 'Complemento Oggetto', 'Predicato Nominale'],
              correctIndex: 1,
              feedback: 'Esatto! Risponde alla domanda "Che cosa?". 🍎'
            }
          }
        ]
      },
      {
        id: 'it5_c2',
        title: 'Il Periodo',
        lessons: [
          {
            id: 'it5_c2_l1',
            title: 'Frasi che si uniscono',
            text: 'Il periodo è un insieme di frasi semplici collegate tra loro. \n\nC\'è sempre una frase PRINCIPALE che sta in piedi da sola. \nLe altre sono COORDINATE (sullo stesso piano) o SUBORDINATE (dipendono dalla principale).',
            audioUrl: '',
            quiz: {
              question: 'Quale di queste frasi può essere una Principale?',
              options: ['Mentre correva', 'Il sole splende', 'Perché aveva fame'],
              correctIndex: 1,
              feedback: 'Giusto! "Il sole splende" ha un senso compiuto da sola. ☀️'
            }
          }
        ]
      },
      {
        id: 'it5_c3',
        title: 'Testi Informativi',
        lessons: [
          {
            id: 'it5_c3_l1',
            title: 'Spiegare il mondo',
            text: 'Un testo informativo serve per dare notizie o spiegare argomenti in modo chiaro. \n\nUsa un linguaggio preciso e risponde alle famose 5W: \nWho? (Chi), What? (Cosa), When? (Quando), Where? (Dove), Why? (Perché). 📰',
            audioUrl: '',
            quiz: {
              question: 'Qual è lo scopo principale di un testo informativo?',
              options: ['Far ridere', 'Spiegare dei fatti', 'Raccontare una fiaba'],
              correctIndex: 1,
              feedback: 'Bravissimo! Serve per imparare cose nuove. 📚'
            }
          }
        ]
      },
      {
        id: 'it5_c4',
        title: 'L\'Argomentazione',
        lessons: [
          {
            id: 'it5_c4_l1',
            title: 'Sostenere un\'idea',
            text: 'Argomentare significa spiegare la propria opinione cercando di convincere gli altri con dei ragionamenti (gli argomenti). \n\nTESI: La mia idea.\nARGOMENTI: Le prove che portano a favore della tesi.\nCONCLUSIONE: Riassunto del pensiero.',
            audioUrl: '',
            quiz: {
              question: 'Come si chiama l\'idea principale in un testo argomentativo?',
              options: ['Fiaba', 'Tesi', 'Poesia'],
              correctIndex: 1,
              feedback: 'Ottimo! La tesi è il cuore del tuo ragionamento! 💡'
            }
          }
        ]
      }
    ],
    [SchoolSubject.MATEMATICA]: [
      {
        id: 'mat5_c1',
        title: 'Frazioni Avanzate',
        lessons: [
          {
            id: 'mat5_c1_l1',
            title: 'Proprie, Improprie e Apparenti',
            text: 'PROPRIE: Il numeratore è minore del denominatore (1/2). \nIMPROPRIE: Il numeratore è maggiore (3/2, valgono più di 1).\nAPPARENTI: Rappresentano interi (4/4 = 1, 8/4 = 2). 🍕',
            audioUrl: '',
            quiz: {
              question: 'Che tipo di frazione è 5/4?',
              options: ['Propria', 'Apparente', 'Impropria'],
              correctIndex: 2,
              feedback: 'Corretto! 5 è più grande di 4, quindi è impropria! 📈'
            }
          }
        ]
      },
      {
        id: 'mat5_c2',
        title: 'Percentuali',
        lessons: [
          {
            id: 'mat5_c2_l1',
            title: 'Il simbolo %',
            text: 'La percentuale è una frazione con denominatore 100. \n\n25% significa 25 su 100. \nÈ utilissima per calcolare gli sconti nei negozi o per capire i risultati dei sondaggi! 🏷️',
            audioUrl: '',
            quiz: {
              question: 'Quanto vale il 50% di 100?',
              options: ['25', '50', '10'],
              correctIndex: 1,
              feedback: 'Esatto! Il 50% è la metà esatta! 🌓'
            }
          }
        ]
      },
      {
        id: 'mat5_c3',
        title: 'Geometria',
        lessons: [
          {
            id: 'mat5_c3_l1',
            title: 'Perimetro e Area',
            text: 'Il PERIMETRO è il contorno di una figura (somma dei lati). \nL\'AREA è lo spazio occupato dentro (misurato in quadretti o m²). \n\nQuadrato: Area = Lato x Lato\nRettangolo: Area = Base x Altezza 📐',
            audioUrl: '',
            quiz: {
              question: 'Se un quadrato ha il lato di 5cm, quanto misura la sua AREA?',
              options: ['20 cm²', '25 cm²', '10 cm²'],
              correctIndex: 1,
              feedback: 'Bravissimo! 5 x 5 fa proprio 25! 🟦'
            }
          }
        ]
      },
      {
        id: 'mat5_c4',
        title: 'Problemi Complessi',
        lessons: [
          {
            id: 'mat5_c4_l1',
            title: 'Sfide a più passaggi',
            text: 'In quinta i problemi hanno tante domande nascoste! \n\nEsempio: Compri 5 scatole di colori da 4€ e 3 album da 2€. Paghi con 50€. \n1. Totale colori (5x4=20)\n2. Totale album (3x2=6)\n3. Spesa totale (20+6=26)\n4. Resto (50-26=24)',
            audioUrl: '',
            quiz: {
              question: 'Qual è il primo passo per risolvere un problema lungo?',
              options: ['Tirare a indovinare', 'Leggere bene e trovare i dati', 'Sommare tutti i numeri che vedi'],
              correctIndex: 1,
              feedback: 'Giusto! Capire i dati è la chiave per la soluzione! 🗝️'
            }
          }
        ]
      }
    ],
    [SchoolSubject.STORIA]: [
      {
        id: 'st5_c1',
        title: 'Il Medioevo',
        lessons: [
          {
            id: 'st5_c1_l1',
            title: 'Castelli e Cavalieri',
            text: 'Il Medioevo inizia dopo la caduta dell\'Impero Romano. È un tempo di re, dame e coraggiosi cavalieri che vivevano in grandi castelli di pietra! 🏰⚔️',
            audioUrl: '',
            quiz: {
              question: 'Cosa segna l\'inizio del Medioevo?',
              options: ['L\'invenzione della TV', 'La caduta dell\'Impero Romano', 'La scoperta dell\'oro'],
              correctIndex: 1,
              feedback: 'Esatto! Un lungo periodo di quasi mille anni! 🛡️'
            }
          }
        ]
      },
      {
        id: 'st5_c2',
        title: 'L\'Età Moderna',
        lessons: [
          {
            id: 'st5_c2_l1',
            title: 'Grandi Scoperte',
            text: 'In questo periodo gli uomini iniziarono a esplorare il mondo intero. Cristoforo Colombo arrivò in America nel 1492 e nacque la stampa per diffondere i libri! 🚢🌍',
            audioUrl: '',
            quiz: {
              question: 'Chi scoprì l\'America nel 1492?',
              options: ['Marco Polo', 'Cristoforo Colombo', 'Lone Boo'],
              correctIndex: 1,
              feedback: 'Bravissimo! Ha cambiato la mappa del mondo per sempre. 🗺️'
            }
          }
        ]
      },
      {
        id: 'st5_c3',
        title: 'L\'Età Contemporanea',
        lessons: [
          {
            id: 'st5_c3_l1',
            title: 'La nostra Storia',
            text: 'È il periodo che arriva fino ai giorni nostri. Include le grandi rivoluzioni industriali, le guerre mondiali e la nascita della democrazia moderna e della tecnologia. 🛰️📱',
            audioUrl: '',
            quiz: {
              question: 'In quale periodo storico viviamo oggi?',
              options: ['Preistoria', 'Età Contemporanea', 'Medioevo'],
              correctIndex: 1,
              feedback: 'Proprio così! Siamo noi i protagonisti della storia oggi! ✨'
            }
          }
        ]
      }
    ],
    [SchoolSubject.GEOGRAFIA]: [
      {
        id: 'geo5_c1',
        title: 'L\'Italia',
        lessons: [
          {
            id: 'geo5_c1_l1',
            title: 'Uno stivale speciale',
            text: 'L\'Italia è una penisola a forma di stivale. È ricca di fiumi (il Po è il più lungo), laghi e alte montagne come le Alpi e gli Appennini. 🇮🇹⛰️',
            audioUrl: '',
            quiz: {
              question: 'Qual è il fiume più lungo d\'Italia?',
              options: ['Tevere', 'Po', 'Arno'],
              correctIndex: 1,
              feedback: 'Giusto! Scorre in tutto il Nord Italia. 🌊'
            }
          }
        ]
      },
      {
        id: 'geo5_c2',
        title: 'L\'Europa',
        lessons: [
          {
            id: 'geo5_c2_l1',
            title: 'Un continente di culture',
            text: 'L\'Europa è un piccolo continente ma con tantissimi stati e lingue diverse. Molti di questi stati fanno parte dell\'Unione Europea e usano l\'Euro. 🇪🇺💶',
            audioUrl: '',
            quiz: {
              question: 'Qual è il simbolo dell\'Unione Europea?',
              options: ['Una bandiera blu con 12 stelle', 'Un leone alato', 'Una mela rossa'],
              correctIndex: 0,
              feedback: 'Esatto! Rappresenta l\'unione e l\'armonia. 🌟'
            }
          }
        ]
      },
      {
        id: 'geo5_c3',
        title: 'I Continenti',
        lessons: [
          {
            id: 'geo5_c3_l1',
            title: 'In giro per il mondo',
            text: 'La Terra è divisa in grandi terre chiamate continenti: Europa, Asia, Africa, America, Oceania e Antartide. Ognuno ha climi e popolazioni uniche! 🌎✈️',
            audioUrl: '',
            quiz: {
              question: 'Quale continente è coperto quasi interamente dai ghiacci?',
              options: ['Africa', 'Oceania', 'Antartide'],
              correctIndex: 2,
              feedback: 'Ottimo! È il posto più freddo della Terra! ❄️'
            }
          }
        ]
      }
    ],
    [SchoolSubject.SCIENZE]: [
      {
        id: 'sci5_c1',
        title: 'L\'Ambiente',
        lessons: [
          {
            id: 'sci5_c1_l1',
            title: 'Proteggiamo la natura',
            text: 'L\'ambiente è tutto ciò che ci circonda. Dobbiamo proteggere i boschi, i mari e l\'aria per far vivere bene tutti gli animali e le piante del pianeta. 🌳🐢',
            audioUrl: '',
            quiz: {
              question: 'Cosa possiamo fare per l\'ambiente?',
              options: ['Buttare i rifiuti a terra', 'Rispettare la natura', 'Sprecare l\'acqua'],
              correctIndex: 1,
              feedback: 'Bravissimo! Piccoli gesti fanno grandi differenze. 🌱'
            }
          }
        ]
      },
      {
        id: 'sci5_c2',
        title: 'Sostenibilità',
        lessons: [
          {
            id: 'sci5_c2_l1',
            title: 'Vivere Green',
            text: 'Sostenibilità significa usare le risorse (acqua, luce, cibo) senza finirle, pensando ai bambini del futuro. Riciclare e usare energie pulite è fondamentale! ♻️☀️',
            audioUrl: '',
            quiz: {
              question: 'Cosa significa riciclare?',
              options: ['Buttare tutto nel cestino nero', 'Trasformare i rifiuti in nuovi oggetti', 'Comprare cose inutili'],
              correctIndex: 1,
              feedback: 'Perfetto! Proprio come il gioco del riciclo in cucina! 🗑️✨'
            }
          }
        ]
      },
      {
        id: 'sci5_c3',
        title: 'La Tecnologia',
        lessons: [
          {
            id: 'sci5_c3_l1',
            title: 'Invenzioni Magiche',
            text: 'La tecnologia usa le scoperte della scienza per creare strumenti utili: dal computer allo smartphone, fino ai robot che ci aiutano nel lavoro. 🤖💻',
            audioUrl: '',
            quiz: {
              question: 'A cosa serve la tecnologia?',
              options: ['A rendere la vita più difficile', 'A risolvere problemi e aiutarci', 'Solo a giocare'],
              correctIndex: 1,
              feedback: 'Esatto! Se usata bene, la tecnologia è una grande alleata! 🚀'
            }
          }
        ]
      }
    ]
  }
};
