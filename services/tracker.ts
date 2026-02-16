import { Lesson } from "./types";

export interface UserProgress {
    userId: string;
    lessonId: string;
    status: 'pending' | 'success';
    startTime: number;
    endTime?: number;
    incorrectFormulas: string[];
}

export interface UserSession {
    userId: string;
    progress: Record<string, UserProgress>;
}

const STORAGE_KEY = 'excel_master_tracking';

export const generateUserId = () => {
    return Math.random().toString(36).substring(2, 5).toUpperCase();
};

export const saveSession = (session: UserSession) => {
    const allSessions = getAllSessions();
    allSessions[session.userId] = session;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allSessions));
};

export const getAllSessions = (): Record<string, UserSession> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

export const getSession = (userId: string): UserSession | null => {
    return getAllSessions()[userId] || null;
};

export const trackVisit = (userId: string, lessonId: string) => {
    const session = getSession(userId) || { userId, progress: {} };
    
    // Reset timer on visit
    session.progress[lessonId] = {
        userId,
        lessonId,
        status: 'pending',
        startTime: Date.now(),
        incorrectFormulas: session.progress[lessonId]?.incorrectFormulas || []
    };
    
    saveSession(session);
};

export const trackIncorrectFormula = (userId: string, lessonId: string, formula: string) => {
    const session = getSession(userId);
    if (!session) return;

    const progress = session.progress[lessonId];
    if (progress && !progress.incorrectFormulas.includes(formula)) {
        progress.incorrectFormulas.push(formula);
        saveSession(session);
    }
};

export const trackSuccess = (userId: string, lessonId: string) => {
    const session = getSession(userId);
    if (!session) return;

    const progress = session.progress[lessonId];
    if (progress && progress.status !== 'success') {
        progress.status = 'success';
        progress.endTime = Date.now();
        saveSession(session);
    }
};
