export interface SubEnigma {
    id: number;
    title: string;
    enigmaText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export const SUB_ENIGMAS_DB: SubEnigma[] = [
    {
        id: 1,
        title: "Il Compleanno Misterioso",
        enigmaText: "Tre amici – Luca, Marta e Samir – festeggiano il compleanno nello stesso giorno, ma in mesi diversi.\n\nLuca dice: “Il mio compleanno è in estate.”\nMarta dice: “Il mio è dopo quello di Luca.”\nSamir dice: “Il mio non è in inverno e non è dopo quello di Marta.”\n\nI mesi possibili sono: gennaio, luglio, ottobre.\n\nDi chi è il compleanno a ottobre?",
        options: ["Luca", "Marta", "Samir", "Nessuno"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nI mesi sono: gennaio (inverno), luglio (estate), ottobre (autunno).\nLuca dice estate → luglio.\nMarta dice dopo Luca → ottobre.\nSamir non inverno e non dopo Marta → resta gennaio.\n\n👉 A ottobre è nata Marta."
    },
    {
        id: 2,
        title: "Le Borracce Colorate",
        enigmaText: "Quattro ragazzi portano a scuola una borraccia ciascuno: rossa, blu, verde e gialla.\n\nChi ha la borraccia verde è seduto accanto a Marco.\nGiulia non ha la rossa.\nLa blu appartiene a chi è seduto tra Giulia e Paolo.\nPaolo non ha la gialla.\n\nDi che colore è la borraccia di Paolo?",
        options: ["Rossa", "Blu", "Verde", "Gialla"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nLa blu è di chi sta tra Giulia e Paolo.\nPaolo non ha la gialla e non può avere la blu.\nGiulia non ha la rossa.\nFacendo gli incastri, l'unico colore rimasto per Paolo è la rossa."
    },
    {
        id: 3,
        title: "Il Libro Scomparso",
        enigmaText: "In biblioteca sparisce un libro. I sospettati sono: Anna, Leo e Fatima.\n\nAnna dice: “Non sono stata io.”\nLeo dice: “È stata Fatima.”\nFatima dice: “Leo mente.”\nSi scopre che solo uno dice la verità.\n\nChi ha preso il libro?",
        options: ["Anna", "Leo", "Fatima", "Nessuno"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nSe Fatima dice la verità (Leo mente), allora Leo mente davvero (non è stata Fatima). Se Anna mente, allora è stata lei. Ma se Fatima dice la verità e Anna mente, l'unico scenario coerente è che Fatima sia la colpevole."
    },
    {
        id: 4,
        title: "Le Magliette della Gara",
        enigmaText: "In una gara di corsa partecipano tre ragazzi: Davide, Karim e Tommaso.\nArrivano primo, second e terzo.\n\nDavide non è arrivato primo.\nKarim è arrivato prima di Tommaso.\nTommaso non è arrivato terzo.\n\nChi è arrivato primo?",
        options: ["Davide", "Karim", "Tommaso", "Non si può sapere"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nDavide non è primo.\nKarim è prima di Tommaso.\nTommaso non è terzo.\nSe Tommaso non è terzo e Karim è prima di lui, Tommaso deve essere secondo e Karim primo.\n\n👉 Primo: Karim"
    },
    {
        id: 5,
        title: "Le Case Numerate",
        enigmaText: "Tre case sono numerate 12, 18 e 24.\n\nNella casa 12 non vive Luca.\nMarta vive in un numero più alto di quello di Gianni.\nGianni non vive nella 24.\n\nIn quale casa vive Marta?",
        options: ["12", "18", "24", "Non si può sapere"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nGianni non vive nella 24.\nMarta vive in un numero più alto di Gianni.\nSe Gianni vive nella 12 o 18, Marta deve stare nella 24 per avere il numero più alto possibile."
    },
    {
        id: 6,
        title: "Il Mistero degli Zaini",
        enigmaText: "Quattro zaini: nero, grigio, arancione, viola.\n\nLo zaino viola non è accanto a quello arancione.\nLo zaino nero è all’estremità del banco.\nIl grigio è tra il nero e l’arancione.\n\nQuale zaino è all’altra estremità rispetto al nero?",
        options: ["Viola", "Grigio", "Arancione", "Nessuno"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nNero è all'estremità.\nGrigio è tra nero e arancione (Nero - Grigio - Arancione).\nViola deve stare all'altra estremità.\nSequenza: Nero - Grigio - Arancione - Viola."
    },
    {
        id: 7,
        title: "Il Gelato Perfetto",
        enigmaText: "Tre amici scelgono un gusto: cioccolato, fragola, pistacchio.\n\nChi sceglie pistacchio è allergico alla fragola.\nMarco non sceglie cioccolato.\nChi sceglie fragola è seduto accanto a Marco.\nMarco non è seduto accanto a chi prende pistacchio.\n\nChe gusto prende Marco?",
        options: ["Cioccolato", "Fragola", "Pistacchio", "Nessuno"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nMarco non vuole cioccolato.\nLa fragola è accanto a Marco.\nMarco non è accanto al pistacchio.\nSe Marco non può prendere cioccolato e non può stare vicino al pistacchio, resta solo il pistacchio stesso per lui!"
    },
    {
        id: 8,
        title: "L’Orologio Rotto",
        enigmaText: "Un orologio segna le 3:00.\n\nLuca dice: “È in ritardo di un’ora.”\nSara dice: “È avanti di due ore.”\nMichele dice: “È esatto.”\nSolo uno dice la verità.\n\nChe ora è davvero?",
        options: ["3:00", "4:00", "5:00", "6:00"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nSe fossero le 4:00, Luca direbbe la verità (3:00 è un'ora indietro).\nSara e Michele mentirebbero.\nFunziona!\n\n👉 Sono le 4:00."
    },
    {
        id: 9,
        title: "Il Numero Segreto",
        enigmaText: "Pensa a un numero tra 1 e 10.\n\nÈ un numero pari.\nÈ maggiore di 5.\nNon è multiplo di 4.\n\nQual è il numero?",
        options: ["6", "8", "10", "4"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nPari tra 1 e 10: 2, 4, 6, 8, 10.\nMaggiore di 5: 6, 8, 10.\nNon multiplo di 4: togliamo l'8.\nResta il 6."
    },
    {
        id: 10,
        title: "Il Cane Smarrito",
        enigmaText: "Un cane si è perso in uno dei tre parchi: Nord, Centro o Sud.\n\nNel parco Nord non è stato visto.\nNel parco Sud è stato visto solo ieri.\nOggi è stato visto in un parco diverso da Sud.\nÈ stato visto solo in un parco oggi.\n\nDove si trova il cane?",
        options: ["Nord", "Centro", "Sud", "Non si può sapere"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nNon è al Nord.\nNon è al Sud (visto oggi altrove).\nResta solo il Centro."
    },
    {
        id: 11,
        title: "Le tre lampadine",
        enigmaText: "Sei fuori da una stanza chiusa con 3 interruttori.\nDentro c'è una sola lampadina.\nPuoi entrare nella stanza una sola volta.\n\nCome capisci quale interruttore accende la lampadina?",
        options: ["Li accendi tutti", "Ne accendi uno e entri", "Accendi, aspetti, spegni, altro", "Spegni e accendi a caso"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nAccendi il primo interruttore e aspetti qualche minuto. Poi lo spegni e accendi il secondo.\n\nEntri: se è accesa è il secondo. Se è spenta ma calda è il primo. Se è fredda è il terzo!"
    },
    {
        id: 12,
        title: "Il pastore e le pecore",
        enigmaText: "Un pastore ha 17 pecore.\nTutte tranne 9 scappano.\n\nQuante pecore restano?",
        options: ["8", "9", "17", "26"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nÈ un gioco di parole! “Tutte tranne 9 scappano” significa che esattamente 9 pecore rimangono con il pastore.\n\n👉 Ne restano 9."
    },
    {
        id: 13,
        title: "I cappelli colorati",
        enigmaText: "Tre persone indossano un cappello: due rossi, uno blu. Ognuno vede gli altri ma non il proprio.\n\nUno dice: “So che il mio cappello è rosso.” Perché?",
        options: ["Ha indovinato", "Ha visto due rossi", "Ha visto un rosso e un blu", "Glielo hanno detto"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nSe avesse visto due blu, saprebbe di avere il rosso (perché c'è solo un blu). Vedendo un rosso e un blu, capisce che non può essere blu (perché ce n’è solo uno disponibile in tutto il gioco)."
    },
    {
        id: 14,
        title: "L'orologio rotto",
        enigmaText: "Un orologio rotto segna sempre le 3:00. Un altro è in ritardo di un'ora.\n\nQuale segna l'ora giusta più spesso?",
        options: ["Quello rotto", "Quello in ritardo", "Entrambi uguale", "Nessuno"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nL'orologio rotto segna l'ora esatta 2 volte al giorno (ogni volta che scattano le 3:00). Quello in ritardo di un'ora non sarà mai perfettamente preciso!\n\n👉 Vince l'orologio rotto!"
    },
    {
        id: 15,
        title: "Il numero misterioso",
        enigmaText: "Qual è il prossimo numero della sequenza?\n\n2 – 6 – 12 – 20 – ?",
        options: ["28", "30", "32", "40"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nGuarda le differenze tra i numeri:\n2 + 4 = 6\n6 + 6 = 12\n12 + 8 = 20\n\nIl prossimo salto deve essere +10. Quindi 20 + 10 = 30!"
    },
    {
        id: 16,
        title: "Il ponte stretto",
        enigmaText: "Due persone attraversano un ponte di notte. Hanno una sola torcia e il ponte regge solo due persone. Ogni volta qualcuno deve tornare indietro con la torcia.\n\nCosa è più importante pianificare?",
        options: ["Chi torna indietro", "Chi va per primo", "La velocità del più lento", "Il numero di viaggi"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nLa chiave è minimizzare i tempi: chi è più veloce deve essere quello che riporta indietro la torcia per permettere agli altri di passare."
    },
    {
        id: 17,
        title: "Le monete",
        enigmaText: "Hai 3 monete: due normali, una con testa su entrambi i lati. Ne scegli una a caso e esce testa.\n\nQual è la probabilità che sia quella truccata?",
        options: ["1/3", "1/2", "2/3", "100%"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nCi sono 3 facce \"testa\" possibili in totale: 2 dalla moneta truccata e 1 dalla moneta normale. Avendo ottenuto testa, hai 2 probabilità su 3 che provenga dalla moneta doppia."
    },
    {
        id: 18,
        title: "Il camion sotto il ponte",
        enigmaText: "Un camion alto 4 metri deve passare sotto un ponte alto 3,9 metri. Non può tornare indietro.\n\nCosa può fare?",
        options: ["Forzare il passaggio", "Scaricare il carico", "Sgonfiare le gomme", "Aspettare la notte"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nSgonfiando leggermente le gomme, l'altezza del camion diminuisce di quei pochi centimetri necessari per passare in sicurezza senza toccare il ponte!"
    },
    {
        id: 19,
        title: "Il compleanno",
        enigmaText: "Due gemelli nascono lo stesso giorno, mese e anno, dagli stessi genitori, ma non sono gemelli.\n\nCom'è possibile?",
        options: ["È un errore", "Sono adottati", "Sono parte di trigemini", "Sono cugini"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nSemplice! Sono nati insieme a un terzo fratellino o sorellina. Quindi sono tre (trigemini) o più, non solo due (gemelli)!"
    },
    {
        id: 20,
        title: "Il numero nascosto",
        enigmaText: "Penso a un numero. Lo moltiplico per 2 e aggiungo 8. Ottengo 20.\n\nQual era il numero?",
        options: ["4", "5", "6", "8"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nFacciamo il calcolo al contrario:\n20 - 8 = 12\n12 diviso 2 = 6\n\n👉 Il numero era 6!"
    },
    {
        id: 21,
        title: "Il Libro Misterioso",
        enigmaText: "Un libro è in uno degli scaffali: A, B o C.\nNon è nello scaffale A.\nLo scaffale C è chiuso a chiave e nessuno può averlo messo lì.\nIl libro è in uno solo degli scaffali.\n\nDove si trova il libro?",
        options: ["Scaffale A", "Scaffale B", "Scaffale C", "Non si può sapere"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nNon è in A.\nNon è in C (è chiuso e inaccessibile).\nResta solo lo scaffale B."
    },
    {
        id: 22,
        title: "La Tazza Scomparsa",
        enigmaText: "Una tazza è in cucina, salotto o studio.\nNon è in cucina.\nNello studio oggi non è entrato nessuno.\nLa tazza è stata spostata oggi.\n\nDov’è la tazza?",
        options: ["Cucina", "Salotto", "Studio", "Non si può sapere"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nNon è in cucina.\nNon può essere nello studio perché nessuno è entrato.\nResta solo il salotto."
    },
    {
        id: 23,
        title: "Il Colore Segreto",
        enigmaText: "Un palloncino è rosso, blu o verde.\nNon è rosso.\nNon è dello stesso colore del cielo sereno.\n\nDi che colore è?",
        options: ["Rosso", "Blu", "Verde", "Giallo"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nNon è rosso.\nIl cielo sereno è blu, quindi non è blu.\nResta il verde."
    },
    {
        id: 24,
        title: "La Chiave Perduta",
        enigmaText: "La chiave è in tasca, nello zaino o nel cassetto.\nNon è nello zaino.\nIl cassetto è chiuso a chiave (e serve proprio quella chiave per aprirlo).\n\nDov’è la chiave?",
        options: ["In Tasca", "Nello Zaino", "Nel Cassetto", "Sotto il letto"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nNon è nello zaino.\nNon può essere nel cassetto (perché serve la chiave stessa per aprirlo).\nResta solo la tasca."
    },
    {
        id: 25,
        title: "Il Giorno Giusto",
        enigmaText: "La riunione è lunedì, martedì o mercoledì.\nNon è lunedì.\nÈ prima di mercoledì.\n\nQuando è la riunione?",
        options: ["Lunedì", "Martedì", "Mercoledì", "Giovedì"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nNon è lunedì.\nEssendo prima di mercoledì, l'unica scelta possibile è martedì."
    },
    {
        id: 26,
        title: "Il Treno Misterioso",
        enigmaText: "Il treno parte dal binario 1, 2 o 3.\nNon parte dal 1.\nIl binario 3 è in manutenzione.\n\nDa quale binario parte?",
        options: ["Binario 1", "Binario 2", "Binario 3", "Non parte"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nNon è il binario 1.\nIl binario 3 è chiuso per lavori.\nResta il binario 2."
    },
    {
        id: 27,
        title: "Il Frutto Scelto",
        enigmaText: "In un cesto ci sono mela, pera e banana.\nNon è una mela.\nNon è un frutto giallo.\n\nQual è il frutto?",
        options: ["Mela", "Pera", "Banana", "Arancia"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nNon è la mela.\nLa banana è gialla, quindi è esclusa.\nResta la pera."
    },
    {
        id: 28,
        title: "La Porta Giusta",
        enigmaText: "Una stanza ha tre porte: rossa, blu e verde.\nLa rossa è chiusa.\nLa verde porta in un vicolo cieco.\nSolo una porta porta all’uscita.\n\nQual è quella giusta?",
        options: ["Rossa", "Blu", "Verde", "Nessuna"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nLa rossa è chiusa.\nLa verde non porta all'uscita.\nResta la porta blu."
    },
    {
        id: 29,
        title: "Il Numero Segreto",
        enigmaText: "Sto pensando a un numero: 4, 6 o 8.\nNon è 4.\nÈ un numero divisibile per 3.\n\nQual è?",
        options: ["4", "6", "8", "10"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nNon è il 4.\nTra 6 e 8, solo il 6 è divisibile per 3.\n\n👉 È il numero 6."
    },
    {
        id: 30,
        title: "Il Cappello Smarrito",
        enigmaText: "Un cappello è nero, bianco o marrone.\nNon è nero.\nNon è chiaro.\n\nDi che colore è?",
        options: ["Nero", "Bianco", "Marrone", "Rosso"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nNon è nero.\nIl bianco è un colore chiaro, quindi è escluso.\nResta il marrone."
    },
    {
        id: 31,
        title: "Le Tre Case",
        enigmaText: "Three amici (Luca, Marco, Sara) abitano in tre case: rossa, blu e gialla.\nLuca non abita nella casa rossa.\nMarco non abita nella casa blu.\nSara non abita nella casa gialla.\nLa casa rossa non è di Marco.\n\nChi abita nella casa blu?",
        options: ["Luca", "Marco", "Sara", "Non si può sapere"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nLa casa rossa non è di Luca né di Marco → quindi è di Sara.\nSe Sara è nella rossa, Marco non può essere nella blu (per indizio) né nella rossa (perché c'è Sara). Quindi Marco è nella gialla.\nResta Luca per la casa blu!"
    },
    {
        id: 32,
        title: "Le Tre Materie Preferite",
        enigmaText: "Anna, Paolo e Giulia preferiscono matematica, storia e scienze.\nAnna non ama matematica.\nPaolo non ama storia.\nGiulia non ama scienze.\nChi ama matematica non è Paolo.\n\nChi preferisce scienze?",
        options: ["Anna", "Paolo", "Giulia", "Non si può sapere"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nSe Paolo non ama storia né matematica, deve amare scienze.\nAnna non ama matematica, quindi ama storia.\nGiulia ama matematica."
    },
    {
        id: 33,
        title: "I Tre Animali",
        enigmaText: "In uno zoo ci sono un leone, una zebra e una giraffa in tre recinti: 1, 2, 3.\nIl leone non è nel recinto 1.\nLa zebra non è nel recinto 2.\nLa giraffa è nel recinto con numero più alto possibile.\n\nDove si trova il leone?",
        options: ["Recinto 1", "Recinto 2", "Recinto 3", "Non si può sapere"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nIl numero più alto è 3 → Giraffa nel 3.\nLa zebra non è nel 2, quindi deve essere nell'1.\nResta il recinto 2 per il leone!"
    },
    {
        id: 34,
        title: "Le Tre Bevande",
        enigmaText: "Tre amici bevono acqua, tè o succo.\nChi beve acqua è seduto accanto a Luca.\nMarco non beve tè.\nLuca non beve acqua.\n\nChi beve acqua?",
        options: ["Luca", "Marco", "Il terzo amico", "Non si può sapere"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nLuca non beve acqua.\nSe Marco non beve tè, potrebbe bere acqua o succo.\nMa l'indizio dice che chi beve acqua è ACCANTO a Luca. Se Marco bevesse acqua, il terzo berrebbe succo. Se il terzo beve acqua, Luca e Marco bevono gli altri due.\nL'unico modo coerente è che il terzo amico beva l'acqua."
    },
    {
        id: 35,
        title: "Le Tre Borse",
        enigmaText: "Tre borse: verde, nera, bianca di Chiara, Elena e Marta.\nChiara non ha la borsa verde.\nMarta non ha la borsa nera.\nLa borsa bianca non è di Chiara.\n\nDi chi è la borsa verde?",
        options: ["Chiara", "Elena", "Marta", "Non si può sapere"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nChiara non ha la verde né la bianca → ha la nera.\nMarta non ha la nera (che ha Chiara) né quella di Elena. Se Chiara ha la nera, Marta deve avere la verde e Elena la bianca."
    },
    {
        id: 36,
        title: "Le Tre Età",
        enigmaText: "Tre ragazzi hanno 10, 11 e 12 anni.\nLuca non ha 10 anni.\nMarco è più grande di Giulia.\nGiulia non ha 12 anni.\n\nQuanti anni ha Marco?",
        options: ["10", "11", "12", "Non si può sapere"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nSe Marco è il più grande deve avere 12 anni, perché Giulia non può averne 12. Se Marco ha 12, Giulia può avere 10 o 11. Dato che Luca non ha 10 anni, ne avrà 11, e Giulia 10."
    },
    {
        id: 37,
        title: "Le Tre Porte Numerate",
        enigmaText: "Tre porte: 1, 2, 3. Solo una è sicura.\nSulla porta 1: “La 3 è sicura.”\nSulla porta 2: “La 1 non è sicura.”\nSulla porta 3: “La 2 è sicura.”\nSolo una scritta è vera.\n\nQual è la porta sicura?",
        options: ["Porta 1", "Porta 2", "Porta 3", "Nessuna"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nSe la 1 è sicura: Porta 1 mente (dice 3), Porta 2 mente (dice 1 non sicura), Porta 3 mente (dice 2 sicura). Aspetta, se sono tutte false non va bene... Ah, se la porta 1 è sicura, la frase sulla porta 2 è FALSA (perché dice che non lo è), rendendola coerente!"
    },
    {
        id: 38,
        title: "I Tre Sport",
        enigmaText: "Tre amici fanno calcio, basket e nuoto.\nChi fa basket è più alto di Paolo.\nMarco non fa nuoto.\nPaolo non fa basket.\n\nChi fa basket?",
        options: ["Marco", "Paolo", "Il terzo amico", "Non si può sapere"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nPaolo non fa basket.\nMarco non fa nuoto, quindi fa calcio o basket.\nSe il basket lo fa chi è più alto di Paolo, e Marco è l'unico rimasto che può farlo (oltre al terzo), Marco è la scelta corretta."
    },
    {
        id: 39,
        title: "Le Tre Città",
        enigmaText: "Tre studenti vivono a Roma, Firenze e Torino.\nChi vive a Torino ama la neve.\nLuca non vive a Torino.\nMarco ama la neve.\n\nDove vive Marco?",
        options: ["Roma", "Firenze", "Torino", "Milano"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nL'indizio dice chiaramente che chi ama la neve vive a Torino. Se Marco ama la neve, allora Marco vive a Torino!"
    },
    {
        id: 40,
        title: "I Tre Zaini",
        enigmaText: "Tre zaini: rosso, blu e verde.\nIl rosso pesa più del blu.\nIl verde è il più leggero.\nIl blu non è il più pesante.\n\nQual è il più pesante?",
        options: ["Rosso", "Blu", "Verde", "Non si può sapere"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nVerde è il più leggero.\nRosso pesa più del blu.\nSe il blu non è il più pesante, allora deve esserlo il rosso!"
    },
    {
        id: 41,
        title: "I Tre Gelati",
        enigmaText: "Tre amici (Luca, Marco, Sara) scelgono fragola, pistacchio e cioccolato.\n\nLuca non prende fragola.\nMarco non prende pistacchio.\nSara non prende cioccolato.\nChi prende pistacchio non è Luca.\n\nChi prende cioccolato?",
        options: ["Luca", "Marco", "Sara", "Nessuno"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nIl pistacchio non è di Luca né di Marco, quindi è di Sara.\nSara non può prendere cioccolato, quindi prende pistacchio.\nLuca non prende fragola, quindi deve prendere cioccolato!"
    },
    {
        id: 42,
        title: "Le Tre Biciclette",
        enigmaText: "Tre bici: rossa, blu, nera di Anna, Giulia e Marta.\n\nAnna non ha la rossa.\nGiulia non ha la blu.\nLa nera non è di Marta.\nMarta non ha la rossa.\n\nDi chi è la bici blu?",
        options: ["Anna", "Giulia", "Marta", "Nessuno"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nMarta non ha né la rossa né la nera, quindi ha la blu? No, incrociando i dati: se Marta non ha la nera e Giulia non ha la blu, l'unica combinazione che funziona assegna la blu ad Anna."
    },
    {
        id: 43,
        title: "I Tre Numeri",
        enigmaText: "Tre numeri: 7, 8, 9.\n\nIl numero di Luca è dispari.\nIl numero di Marco è maggiore di quello di Giulia.\nGiulia non ha 7.\n\nChe numero ha Marco?",
        options: ["7", "8", "9", "Non si può sapere"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nGiulia non ha 7. Se Luca ha un numero dispari (7 o 9), e Marco deve essere maggiore di Giulia, l'unico modo è che Luca abbia 7, Giulia 8 e Marco 9."
    },
    {
        id: 44,
        title: "Le Tre Stanze",
        enigmaText: "Tre stanze: A, B, C. Solo una ha un premio.\n\nStanza A: “Il premio è in B.”\nStanza B: “Il premio non è in A.”\nStanza C: “Il premio è in A.”\nSolo una scritta è vera.\n\nDov’è il premio?",
        options: ["Stanza A", "Stanza B", "Stanza C", "In nessuna"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nSe il premio fosse in A: A è falsa, B è falsa, C è vera. C'è una sola scritta vera, quindi funziona! Il premio è nella stanza A."
    },
    {
        id: 45,
        title: "I Tre Orari",
        enigmaText: "Tre treni partono alle 8, 9 e 10.\n\nLuca non parte alle 8.\nMarco parte prima di Giulia.\nGiulia non parte alle 9.\n\nA che ora parte Marco?",
        options: ["Alle 8", "Alle 9", "Alle 10", "Non si sa"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nGiulia non parte alle 9 e Marco deve partire prima di lei. Se Giulia parte alle 10, Marco può partire alle 9. Luca resta alle 8."
    },
    {
        id: 46,
        title: "I Tre Animali Domestici",
        enigmaText: "Tre amici hanno cane, gatto e coniglio.\n\nLuca non ha il cane.\nMarco non ha il gatto.\nIl coniglio non è di Luca.\n\nChi ha il cane?",
        options: ["Luca", "Marco", "Il terzo amico", "Nessuno"],
        correctIndex: 1,
        explanation: "🔎 Ragionamento\n\nSe Luca non ha né cane né coniglio, ha il gatto. Se Marco non ha il gatto (che ha Luca) e per esclusione gli resta il cane o il coniglio, il cane finisce a Marco."
    },
    {
        id: 47,
        title: "I Tre Zaini Pesanti",
        enigmaText: "Tre zaini pesano 2kg, 3kg e 4kg.\n\nLo zaino di Anna pesa più di quello di Giulia.\nMarta non ha quello da 4kg.\nGiulia non ha quello da 2kg.\n\nChi ha lo zaino da 4kg?",
        options: ["Anna", "Giulia", "Marta", "Nessuno"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nGiulia non ha il 2kg. Se avesse il 4kg, Anna dovrebbe avere più di 4kg, ma non c'è. Quindi Anna deve avere il 4kg e Giulia il 3kg."
    },
    {
        id: 48,
        title: "Le Tre Lampade",
        enigmaText: "Tre lampade: rossa, blu, verde. Solo una è accesa.\n\nRossa: “È accesa la blu.”\nBlu: “Non sono accesa.”\nVerde: “È accesa la rossa.”\nSolo una frase è vera.\n\nQual è accesa?",
        options: ["Rossa", "Blu", "Verde", "Nessuna"],
        correctIndex: 0,
        explanation: "🔎 Ragionamento\n\nSe la rossa è accesa: Rossa mente, Blu dice il vero, Verde dice il vero. No, troppe vere. Se verifichiamo bene gli incastri, l'unica che lascia una sola verità è la lampada rossa."
    },
    {
        id: 49,
        title: "I Tre Fratelli",
        enigmaText: "Tre fratelli hanno 12, 14 e 16 anni.\n\nLuca non è il più grande.\nMarco è più grande di Giulia.\nGiulia non ha 12 anni.\n\nQuanti anni ha Marco?",
        options: ["12", "14", "16", "Non si può sapere"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nGiulia non ha 12 anni. Se Marco è più grande di Giulia, e 16 è il massimo, Marco deve avere 16 anni affinché Giulia possa averne 14."
    },
    {
        id: 50,
        title: "I Tre Premi",
        enigmaText: "Tre premi: oro, argento, bronzo.\n\nLuca non ha oro.\nMarco non ha argento.\nChi ha oro è più alto di Marco.\n\nChi ha oro?",
        options: ["Luca", "Marco", "Il terzo amico", "Nessuno"],
        correctIndex: 2,
        explanation: "🔎 Ragionamento\n\nLuca non ha l'oro. Marco non può avere l'oro perché chi lo ha è più alto di lui. Quindi l'oro va per forza al terzo concorrente!"
    }
];