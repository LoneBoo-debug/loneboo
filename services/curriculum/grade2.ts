
import { GradeCurriculumData, SchoolSubject } from '../../types';

export const GRADE2_DATA: GradeCurriculumData = {
  grade: 2,
  subjects: {
    [SchoolSubject.ITALIANO]: [
      {
        id: 'it2_c1',
        title: 'Digrammi e Trigrammi',
        lessons: [
          {
            id: 'it2_c1_l1',
            title: 'Suoni Difficili',
            text: 'Alcune lettere, quando stanno insieme, fanno un suono speciale! \n\nGN come Gnomo 🍄\nGL come Foglia 🍃\nSC come Pesce 🐟\nCH come Chiave 🔑',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quale di queste parole contiene "GN"?',
              options: ['Gatto', 'Montagna', 'Cane'],
              correctIndex: 1,
              feedback: 'Giusto! Mon-ta-gna! 🏔️'
            }]
          }
        ]
      },
      {
        id: 'it2_c2',
        title: 'Articoli',
        lessons: [
          {
            id: 'it2_c2_l1',
            title: 'Determinativi e Indeterminativi',
            text: 'Gli articoli determinativi indicano qualcuno di preciso: IL, LO, LA, I, GLI, LE.\nGli articoli indeterminativi indicano qualcuno di generico: UN, UNO, UNA.',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quale tra questi è un articolo indeterminativo?',
              options: ['La', 'Uno', 'Gli'],
              correctIndex: 1,
              feedback: 'Bravo! UNO è un articolo indeterminativo. 🎲'
            }]
          }
        ]
      },
      {
        id: 'it2_c3',
        title: 'Nomi Comuni e Propri',
        lessons: [
          {
            id: 'it2_c3_l1',
            title: 'Persone, Cose e Animali',
            text: 'I nomi COMUNI indicano chiunque (bambino, gatto).\nI nomi PROPRI indicano proprio quello lì e si scrivono con la MAIUSCOLA (Lone Boo, Gaia).',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: '"Roma" è un nome proprio o comune?',
              options: ['Proprio', 'Comune', 'Nessuno dei due'],
              correctIndex: 0,
              feedback: 'Esatto! Roma è il nome di una città speciale. 🏛️'
            }]
          }
        ]
      },
      {
        id: 'it2_c4',
        title: 'Aggettivi',
        lessons: [
          {
            id: 'it2_c4_l1',
            title: 'Com\'è?',
            text: 'Gli aggettivi spiegano com\'è una cosa, una persona o un animale.\n\nIl prato è VERDE. 🌳\nLa pizza è BUONA. 🍕\nLone Boo è SIMPATICO. 👻',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Nella frase "La mela è rossa", qual è l\'aggettivo?',
              options: ['Mela', 'Rossa', 'La'],
              correctIndex: 1,
              feedback: 'Super! "Rossa" ci dice il colore della mela. 🍎'
            }]
          }
        ]
      },
      {
        id: 'it2_c5',
        title: 'Frasi Complete',
        lessons: [
          {
            id: 'it2_c5_l1',
            title: 'Costruiamo la frase',
            text: 'Una frase ha bisogno di un Soggetto (chi fa l\'azione) e di un Verbo (cosa fa).\n\nSoggetto: Andrea\nVerbo: corre\nFrase: Andrea corre. 🏃‍♂️',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Cosa manca in questa frase: "Il sole ___"?',
              options: ['Alto', 'Splende', 'Giallo'],
              correctIndex: 1,
              feedback: 'Giusto! "Splende" è l\'azione del sole. ☀️'
            }]
          }
        ]
      },
      {
        id: 'it2_c6',
        title: 'Brevi Testi',
        lessons: [
          {
            id: 'it2_c6_l1',
            title: 'Piccole Storie',
            text: 'Un testo è un insieme di frasi che raccontano qualcosa.\n\n"Lone Boo va al parco. Vede Gaia e iniziano a giocare insieme. Che bella giornata!"',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Chi vede Lone Boo al parco?',
              options: ['Zuccotto', 'Grufo', 'Gaia'],
              correctIndex: 2,
              feedback: 'Bravissimo! Gaia è la sua grande amica. 👧'
            }]
          }
        ]
      }
    ],
    [SchoolSubject.MATEMATICA]: [
      {
        id: 'mat2_c1',
        title: 'Numeri fino a 100',
        lessons: [
          {
            id: 'mat2_c1_l1',
            title: 'Il Centinaio',
            text: 'Dieci decine formano un CENTINAIO! (100)\n\n10, 20, 30, 40, 50, 60, 70, 80, 90... 100! 💯',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quante unità ci sono in un centinaio?',
              options: ['10', '50', '100'],
              correctIndex: 2,
              feedback: 'Esatto! 100 unità formano 1 centinaio. 🔢'
            }]
          }
        ]
      },
      {
        id: 'mat2_c2',
        title: 'Addizioni in colonna',
        lessons: [
          {
            id: 'mat2_c2_l1',
            title: 'Sommiamo i pezzi',
            text: 'Mettiamo i numeri uno sopra l\'altro. \nDecine con Decine, Unità con Unità!\nRicorda il RIPORTO se la somma supera il 9!',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quanto fa 15 + 15?',
              options: ['20', '30', '40'],
              correctIndex: 1,
              feedback: 'Ottimo! 5+5=10 (scrivo 0, riporto 1). 1+1+1=3. Risultato: 30! ➕'
            }]
          }
        ]
      },
      {
        id: 'mat2_c3',
        title: 'Sottrazioni in colonna',
        lessons: [
          {
            id: 'mat2_c3_l1',
            title: 'Togliamo via',
            text: 'Togliamo le unità dalle unità e le decine dalle decine.\nSe l\'unità sopra è piccola, chiediamo un PRESTITO alla decina!',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quanto fa 40 - 10?',
              options: ['20', '30', '50'],
              correctIndex: 1,
              feedback: 'Bravissimo! 30 è il risultato corretto. ➖'
            }]
          }
        ]
      },
      {
        id: 'mat2_c4',
        title: 'Moltiplicazione Base',
        lessons: [
          {
            id: 'mat2_c4_l1',
            title: 'L\'addizione ripetuta',
            text: 'Moltiplicare significa aggiungere lo stesso numero tante volte.\n\n2 x 3 = 2 + 2 + 2 = 6!',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quanto fa 5 x 2?',
              options: ['7', '10', '15'],
              correctIndex: 1,
              feedback: 'Proprio così! 5 + 5 fa 10! ✖️'
            }]
          }
        ]
      },
      {
        id: 'mat2_c5',
        title: 'Problemi',
        lessons: [
          {
            id: 'mat2_c5_l1',
            title: 'Investigatori di numeri',
            text: 'Leggi bene il testo e cerca la parola magica:\n"In tutto" -> Addizione ➕\n"Restano" -> Sottrazione ➖',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Ho 10 figurine, ne regalo 3. Quante ne restano?',
              options: ['7', '13', '10'],
              correctIndex: 0,
              feedback: 'Giusto! 10 - 3 = 7. 🃏'
            }]
          }
        ]
      }
    ],
    [SchoolSubject.STORIA]: [
      {
        id: 'st2_c1',
        title: 'Successione Temporale',
        lessons: [
          {
            id: 'st2_c1_l1',
            title: 'Ieri, Oggi, Domani',
            text: 'Il tempo non si ferma mai!\nIERI è passato 🕒\nOGGI è adesso 🌟\nDOMANI deve ancora arrivare 🚀',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Cosa viene dopo OGGI?',
              options: ['Ieri', 'Lunedì', 'Domani'],
              correctIndex: 2,
              feedback: 'Corretto! Domani è il giorno che verrà. 🌅'
            }]
          }
        ]
      },
      {
        id: 'st2_c2',
        title: 'Linea del Tempo',
        lessons: [
          {
            id: 'st2_c2_l1',
            title: 'Disegniamo il tempo',
            text: 'La linea del tempo è una freccia che ci aiuta a mettere in ordine i fatti, dal più vecchio al più nuovo.',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'In che direzione va la freccia del tempo?',
              options: ['Verso il passato', 'Verso il futuro', 'Non si muove'],
              correctIndex: 1,
              feedback: 'Esatto! Si va sempre in avanti. ➡️'
            }]
          }
        ]
      },
      {
        id: 'st2_c3',
        title: 'Cambiamenti nel tempo',
        lessons: [
          {
            id: 'st2_c3_l1',
            title: 'Come cambiano le cose',
            text: 'Tutto cambia col passare del tempo: le persone crescono, le città si trasformano e gli oggetti diventano vecchi.',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Cosa succede a un bambino dopo molti anni?',
              options: ['Resta piccolo', 'Diventa un adulto', 'Scompare'],
              correctIndex: 1,
              feedback: 'Giusto! Tutti cresciamo. 🧑'
            }]
          }
        ]
      },
      {
        id: 'st2_c4',
        title: 'Storia Personale',
        lessons: [
          {
            id: 'st2_c4_l1',
            title: 'La mia avventura',
            text: 'La tua storia inizia con la tua nascita! Ogni anno aggiungi un pezzetto: i primi passi, il primo giorno di scuola...',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Qual è il primo fatto della tua storia?',
              options: ['La nascita', 'La scuola', 'Il gioco'],
              correctIndex: 0,
              feedback: 'Esatto! Tutto comincia da lì. 🍼'
            }]
          }
        ]
      }
    ],
    [SchoolSubject.GEOGRAFIA]: [
      {
        id: 'geo2_c1',
        title: 'Spazi e Percorsi',
        lessons: [
          {
            id: 'geo2_c1_l1',
            title: 'Muoversi nello spazio',
            text: 'Seguiamo le istruzioni: avanti, indietro, gira a destra! \nI percorsi ci dicono come arrivare da un punto all\'altro.',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Se vai dritto e poi giri a destra, hai fatto un...?',
              options: ['Salto', 'Percorso', 'Cerchio'],
              correctIndex: 1,
              feedback: 'Bravo! Hai seguito un percorso. 🗺️'
            }]
          }
        ]
      },
      {
        id: 'geo2_c2',
        title: 'Mappe semplici',
        lessons: [
          {
            id: 'geo2_c2_l1',
            title: 'Visto dall\'alto',
            text: 'Una mappa è un disegno di un posto visto dall\'alto. \nPossiamo mappare la nostra cameretta o la nostra aula!',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Come sembra un tavolo visto dall\'alto?',
              options: ['Un rettangolo o cerchio', 'Molto alto', 'Un triangolo'],
              correctIndex: 0,
              feedback: 'Esatto! Vediamo solo la parte piatta del piano. 📐'
            }]
          }
        ]
      },
      {
        id: 'geo2_c3',
        title: 'Ambienti Naturali',
        lessons: [
          {
            id: 'geo2_c3_l1',
            title: 'La forza della natura',
            text: 'Gli ambienti naturali sono quelli dove non ci sono costruzioni dell\'uomo: boschi, fiumi, deserti.',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quale di questi è un ambiente naturale?',
              options: ['Il centro commerciale', 'La foresta', 'Il parcheggio'],
              correctIndex: 1,
              feedback: 'Giusto! La foresta è piena di alberi naturali. 🌲'
            }]
          }
        ]
      },
      {
        id: 'geo2_c4',
        title: 'Paesaggi',
        lessons: [
          {
            id: 'geo2_c4_l1',
            title: 'Montagna e Mare',
            text: 'Esistono paesaggi diversi: \n⛰️ MONTAGNA: cime alte e neve.\n🏖️ MARE: acqua salata e sabbia.\n🏙️ CITTÀ: case e strade.',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Dove trovi le conchiglie?',
              options: ['Sulla cima della montagna', 'Sulla spiaggia al mare', 'In un bosco'],
              correctIndex: 1,
              feedback: 'Perfetto! Al mare ci sono tante conchiglie. 🐚'
            }]
          }
        ]
      }
    ],
    [SchoolSubject.SCIENZE]: [
      {
        id: 'sci2_c1',
        title: 'Vertebrati e Invertebrati',
        lessons: [
          {
            id: 'sci2_c1_l1',
            title: 'Ossa o no?',
            text: 'VERTEBRATI: hanno lo scheletro (cane, uccello, uomo).\nINVERTEBRATI: non hanno ossa (verme, polpo, farfalla).',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'La farfalla ha le ossa?',
              options: ['Sì', 'No', 'Solo un pochino'],
              correctIndex: 1,
              feedback: 'Giusto! È un invertebrato senza scheletro. 🦋'
            }]
          }
        ]
      },
      {
        id: 'sci2_c2',
        title: 'Piante e parti',
        lessons: [
          {
            id: 'sci2_c2_l1',
            title: 'Com\'è fatta una pianta',
            text: 'RADICI: bevono l\'acqua.\nFUSTO: sostiene la pianta.\nFOGLIE: producono cibo con il sole.\nFIORI E FRUTTI: servono per i semi.',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Quale parte sta sotto terra?',
              options: ['I fiori', 'Il fusto', 'Le radici'],
              correctIndex: 2,
              feedback: 'Ottimo! Le radici tengono la pianta ben salda. 🌳'
            }]
          }
        ]
      },
      {
        id: 'sci2_c3',
        title: 'Materia',
        lessons: [
          {
            id: 'sci2_c3_l1',
            title: 'Solido, Liquido, Gassoso',
            text: 'Tutto è fatto di materia!\nSOLIDO: ha una forma (un sasso).\nLIQUIDO: scorre (l\'acqua).\nGASSOSO: è invisibile (l\'aria).',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Il latte in un bicchiere è...?',
              options: ['Solido', 'Liquido', 'Gassoso'],
              correctIndex: 1,
              feedback: 'Bravissimo! Il latte scorre ed è liquido. 🥛'
            }]
          }
        ]
      },
      {
        id: 'sci2_c4',
        title: 'Acqua',
        lessons: [
          {
            id: 'sci2_c4_l1',
            title: 'Il ciclo dell\'acqua',
            text: 'L\'acqua viaggia sempre! Sale nel cielo come vapore, forma le nuvole e scende come pioggia per tornare nel mare. 💧',
            audioUrl: '',
            // FIX: Changed quiz to quizzes array
            quizzes: [{
              question: 'Come si chiama l\'acqua che cade dalle nuvole?',
              options: ['Vento', 'Pioggia', 'Sole'],
              correctIndex: 1,
              feedback: 'Splendido! È proprio la pioggia! 🌧️'
            }]
          }
        ]
      }
    ]
  }
};
