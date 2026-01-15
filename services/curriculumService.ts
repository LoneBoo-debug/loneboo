
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
        const response = await fetch(`${SCHOOL_DATA_CSV_URL}&t=${Date.now()}`);
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
            
            // Colonna H (indice 7) per il tipo di accesso
            const accessType = parts[7]?.toLowerCase() || 'gratis';
            const isPremium = accessType === 'abbonamento';

            const quizzes: SchoolQuiz[] = [];
            
            // Quiz 1 (I-L: 8-11) - Uso del separatore '|'
            if (parts[8]) {
                quizzes.push({
                    question: parts[8],
                    options: parts[9] ? parts[9].split('|').map(o => o.trim()) : ["A", "B", "C"],
                    correctIndex: parseInt(parts[10]) || 0,
                    feedback: parts[11] || "Bravissimo! ✨"
                });
            }

            // Quiz 2 (M-P: 12-15) - Uso del separatore '|'
            if (parts[12]) {
                quizzes.push({
                    question: parts[12],
                    options: parts[13] ? parts[13].split('|').map(o => o.trim()) : ["A", "B", "C"],
                    correctIndex: parseInt(parts[14]) || 0,
                    feedback: parts[15] || "Ottimo lavoro! 🎈"
                });
            }

            // Quiz 3 (Q-T: 16-19) - Uso del separatore '|'
            if (parts[16]) {
                quizzes.push({
                    question: parts[16],
                    options: parts[17] ? parts[17].split('|').map(o => o.trim()) : ["A", "B", "C"],
                    correctIndex: parseInt(parts[18]) || 0,
                    feedback: parts[19] || "Fenomenale! 🌟"
                });
            }

            const lesson: SchoolLesson = {
                id: `dyn_${grade}_${Math.random().toString(36).substr(2, 5)}`,
                title: lessonTitle,
                text: lessonText,
                audioUrl: audioUrl,
                quizzes: quizzes,
                isPremium: isPremium
            };

            let chapter = curriculum.subjects[subjectKey].find(c => c.title === chapterTitle);
            if (!chapter) {
                chapter = { id: `ch_${chapterTitle.replace(/\s+/g, '_')}`, title: chapterTitle, lessons: [] };
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
