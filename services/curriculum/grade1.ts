
import { GradeCurriculumData, SchoolSubject } from '../../types';

/**
 * NOTA PER GLI SVILUPPATORI: 
 * Gli ID qui devono corrispondere al formato generato da fetchGradeCurriculum:
 * dyn_{grade}_{subject}_{title_sanitized}
 */

export const GRADE1_DATA: GradeCurriculumData = {
  grade: 1,
  subjects: {
    [SchoolSubject.ITALIANO]: [
      {
        id: 'it1_c1',
        title: 'Le Vocali',
        lessons: [
          {
            id: 'dyn_1_italiano_le_amiche_vocali',
            title: 'Le amiche Vocali',
            text: 'Le vocali sono cinque amiche speciali:\nA, E, I, O, U.\nSono importanti perché senza di loro le parole non possono nascere.\nOgni vocale ha un suono diverso e vive dentro tantissime parole che usiamo ogni giorno.\nPer esempio, la A vive in casa, la E in elefante, la I in isola, la O in orso e la U in uva.\nQuando impariamo le vocali, iniziamo a leggere e scrivere le nostre prime parole.',
            audioUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-10T20_36_23_Sami+-+Italian+female+_pvc_sp82_s40_sb49_se85_b_m2.mp3',
            videoUrl: 'https://www.youtube.com/watch?v=W12CrAsUK-w',
            quizzes: [{
              question: 'Quali sono le 5 vocali amiche?',
              options: ['A, E, I, O, U', 'A, B, C, D, E', '1, 2, 3, 4, 5'],
              correctIndex: 0,
              feedback: 'Bravissimo! Con queste 5 amiche puoi scrivere tantissime parole! ✨'
            }],
            activities: []
          }
        ]
      },
      {
        id: 'it1_c2',
        title: 'Le Consonanti',
        lessons: [
          {
            id: 'dyn_1_italiano_le_lettere_forti',
            title: 'Le lettere forti',
            text: 'Le consonanti sono tante e hanno bisogno delle vocali per parlare.\nDa sole fanno solo un piccolo rumore, ma insieme alle vocali diventano forti e chiare.\nLa M con la A diventa MA, la L con la U diventa LU.\nOgni parola è una squadra formata da consonanti e vocali che lavorano insieme.',
            audioUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-10T21_18_11_Sami+-+Italian+female+_pvc_sp82_s40_sb49_se85_b_m2.mp3',
            quizzes: [{
              question: 'Di cosa hanno bisogno le consonanti per parlare?',
              options: ['Delle vocali', 'Dei numeri', 'Di stare da sole'],
              correctIndex: 0,
              feedback: 'Giusto! Insieme alle vocali formano una squadra fortissima! 🎈'
            }],
            activities: []
          }
        ]
      },
      {
        id: 'it1_c3',
        title: 'Le Sillabe',
        lessons: [
          {
            id: 'dyn_1_italiano_i_mattoncini_delle_parole',
            title: 'I mattoncini delle parole',
            text: 'Le sillabe sono piccoli pezzetti di parole.\nQuando diciamo una parola lentamente, possiamo sentire le sillabe una alla volta.\nLa parola PA-PA ha due sillabe, mentre CA-SA ne ha due diverse.\nDividere le parole in sillabe ci aiuta a leggere meglio e senza paura.',
            audioUrl: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ElevenLabs_2026-01-10T21_27_01_Sami+-+Italian+female+_pvc_sp82_s40_sb49_se85_b_m2.mp3',
            quizzes: [{
              question: 'In quante sillabe si divide la parola CA-SA?',
              options: ['Due', 'Una', 'Quattro'],
              correctIndex: 0,
              feedback: 'Esatto! CA-SA sono due pezzetti di parola! 🏠'
            }],
            activities: []
          }
        ]
      }
    ],
    [SchoolSubject.MATEMATICA]: [],
    [SchoolSubject.STORIA]: [],
    [SchoolSubject.GEOGRAFIA]: [],
    [SchoolSubject.SCIENZE]: []
  }
};
