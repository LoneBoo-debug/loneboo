
import { SCHOOL_DATA_CSV_URL } from '../constants';
import { GradeCurriculumData, SchoolSubject, SchoolChapter, SchoolLesson, SchoolQuiz } from '../types';

const parseCSV = (text: string): string[][] => {
    const results: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;

    const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];
        const nextChar = cleanText[i + 1];

        if (inQuotes) {
            if (char === '"') {
                if (nextChar === '"') {
                    cell += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                cell += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                row.push(cell.trim());
                cell = '';
            } else if (char === '\n') {
                row.push(cell.trim());
                if (row.length > 0) results.push(row);
                row = [];
                cell = '';
            } else {
                cell += char;
            }
        }
    }
    
    if (cell || row.length > 0) {
        row.push(cell.trim());
        results.push(row);
    }

    return results;
};

export const fetchGradeCurriculum = async (grade: number): Promise<GradeCurriculumData | null> => {
    if (!SCHOOL_DATA_CSV_URL) return null;

    try {
        const separator = SCHOOL_DATA_CSV_URL.includes('?') ? '&' : '?';
        const response = await fetch(`${SCHOOL_DATA_CSV_URL}${separator}t=${Date.now()}`);
        if (!response.ok) return null;

        const text = await response.text();
        const allRows = parseCSV(text);
        if (allRows.length < 2) return null;

        const dataRows = allRows.slice(1);
        const curriculum: GradeCurriculumData = {
            grade,
            subjects: {
                [SchoolSubject.ITALIANO]: [],
                [SchoolSubject.MATEMATICA]: [],
                [SchoolSubject.STORIA]: [],
                [SchoolSubject.GEOGRAFIA]: [],
                [SchoolSubject.SCIENZE]: []
            }
        };

        dataRows.forEach((parts) => {
            if (parts.length < 5) return;

            const rowGrade = parseInt(parts[0]);
            if (rowGrade !== grade) return;

            const subjectKey = parts[1].toUpperCase() as SchoolSubject;
            if (!curriculum.subjects[subjectKey]) return;

            const chapterTitle = parts[2];
            const lessonTitle = parts[3];
            const lessonText = parts[4];
            const audioUrl = parts[5] || "";
            
            const videoUrl = (parts[6] && parts[6] !== "" && parts[6] !== "-") ? parts[6].trim() : undefined;
            const accessType = parts[7]?.toLowerCase() || 'gratis';
            const isPremium = accessType === 'abbonamento';

            // Generazione ID deterministico basato sui dati della lezione per stabilità del progresso
            const lessonId = `dyn_${grade}_${subjectKey}_${lessonTitle}`.replace(/[^a-z0-9]/gi, '_').toLowerCase();

            const quizzes: SchoolQuiz[] = [];
            if (parts[8]) {
                quizzes.push({
                    question: parts[8],
                    options: parts[9] ? parts[9].split('|').map(o => o.trim()) : ["A", "B", "C"],
                    correctIndex: parseInt(parts[10]) || 0,
                    feedback: parts[11] || "Bravissimo! ✨"
                });
            }
            if (parts[12]) {
                quizzes.push({
                    question: parts[12],
                    options: parts[13] ? parts[13].split('|').map(o => o.trim()) : ["A", "B", "C"],
                    correctIndex: parseInt(parts[14]) || 0,
                    feedback: parts[15] || "Ottimo lavoro! 🎈"
                });
            }
            if (parts[16]) {
                quizzes.push({
                    question: parts[16],
                    options: parts[17] ? parts[17].split('|').map(o => o.trim()) : ["A", "B", "C"],
                    correctIndex: parseInt(parts[18]) || 0,
                    feedback: parts[19] || "Fenomenale! 🌟"
                });
            }

            const activities: SchoolQuiz[] = [];
            if (parts[20] && parts[20] !== "-") {
                activities.push({
                    image: parts[20],
                    question: parts[21] || "Guarda l'immagine e rispondi:",
                    options: parts[22] ? parts[22].split('|').map(o => o.trim()) : ["A", "B", "C"],
                    correctIndex: parseInt(parts[23]) || 0,
                    feedback: "Corretto! Sei un ottimo osservatore! 🧐"
                });
            }
            if (parts[24] && parts[24] !== "-") {
                activities.push({
                    image: parts[24],
                    question: parts[25] || "E ora guarda questa:",
                    options: parts[26] ? parts[26].split('|').map(o => o.trim()) : ["A", "B", "C"],
                    correctIndex: parseInt(parts[27]) || 0,
                    feedback: "Fantastico! Hai completato le attività! 🌟"
                });
            }

            const lesson: SchoolLesson = {
                id: lessonId,
                title: lessonTitle,
                text: lessonText,
                audioUrl: audioUrl,
                videoUrl: videoUrl,
                quizzes: quizzes,
                activities: activities,
                isPremium: isPremium
            };

            let chapter = curriculum.subjects[subjectKey].find(c => c.title === chapterTitle);
            if (!chapter) {
                chapter = { id: `ch_${chapterTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`, title: chapterTitle, lessons: [] };
                curriculum.subjects[subjectKey].push(chapter);
            }
            chapter.lessons.push(lesson);
        });

        const totalLessons = Object.values(curriculum.subjects).reduce((acc, chapters) => acc + chapters.length, 0);
        return totalLessons > 0 ? curriculum : null;

    } catch (error) {
        console.warn("Curriculum fetch error:", error);
        return null;
    }
};
