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

export const generateUserId = () => {
    return Math.random().toString(36).substring(2, 5).toUpperCase();
};

export const trackVisit = async (userId: string, lessonId: string) => {
    await fetch('/api/track/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, lessonId })
    });
};

export const trackIncorrectFormula = async (userId: string, lessonId: string, formula: string) => {
    await fetch('/api/track/incorrect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, lessonId, formula })
    });
};

export const trackSuccess = async (userId: string, lessonId: string) => {
    await fetch('/api/track/success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, lessonId })
    });
};

export const listenToAllSessions = (callback: (sessions: Record<string, UserSession>) => void) => {
    const eventSource = new EventSource('/api/admin/updates');
    
    eventSource.onmessage = (event) => {
        const sessions = JSON.parse(event.data);
        callback(sessions);
    };

    eventSource.onerror = (err) => {
        console.error("EventSource failed:", err);
        eventSource.close();
    };

    return () => eventSource.close();
};
