
import { LessonStatus, LessonProgress } from '../types';

const PROGRESS_KEY = 'loneboo_medie_progress';

export const getMedieProgress = (): Record<string, LessonProgress> => {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (!data) return {};
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error("Error parsing progress data", e);
        return {};
    }
};

export const updateMedieProgress = (
    lessonId: string, 
    grade: number, 
    subject: string, 
    title: string,
    scrollPercentage: number
) => {
    const progress = getMedieProgress();
    const current = progress[lessonId];
    
    let status = LessonStatus.IN_LETTURA;
    if (scrollPercentage >= 95) {
        status = LessonStatus.LETTO;
    } else if (scrollPercentage < 5 && (!current || current.status === LessonStatus.NON_LETTO)) {
        status = LessonStatus.NON_LETTO;
    }

    // Don't downgrade status from LETTO to IN_LETTURA unless explicitly needed (usually we don't)
    if (current && current.status === LessonStatus.LETTO && status === LessonStatus.IN_LETTURA) {
        status = LessonStatus.LETTO;
    }

    progress[lessonId] = {
        lessonId,
        grade,
        subject,
        title,
        status,
        scrollPercentage: Math.max(current?.scrollPercentage || 0, scrollPercentage),
        lastUpdated: Date.now()
    };

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    window.dispatchEvent(new CustomEvent('medieProgressUpdated', { detail: progress[lessonId] }));
};

export const getSubjectProgress = (grade: number, subject: string, totalLessons: number): number => {
    const progress = getMedieProgress();
    const subjectLessons = Object.values(progress).filter(p => p.grade === grade && p.subject === subject && p.status === LessonStatus.LETTO);
    if (totalLessons === 0) return 0;
    return Math.round((subjectLessons.length / totalLessons) * 100);
};

export const getInReadingLessons = (): LessonProgress[] => {
    const progress = getMedieProgress();
    return Object.values(progress)
        .filter(p => p.status === LessonStatus.IN_LETTURA)
        .sort((a, b) => b.lastUpdated - a.lastUpdated);
};
