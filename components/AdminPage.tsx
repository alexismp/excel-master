import React, { useState, useEffect } from 'react';
import { getAllSessions, generateUserId, UserSession } from '../services/tracker';
import { LESSONS } from '../constants';
import { ChevronRight, ChevronDown, User, Clock, CheckCircle, RefreshCcw, Copy, Check } from 'lucide-react';

const AdminPage: React.FC = () => {
    const [sessions, setSessions] = useState<Record<string, UserSession>>({});
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [newId, setNewId] = useState<string | null>(null);
    const [copied, setCopied] = useState<'id' | 'url' | null>(null);

    const loadSessions = () => {
        setSessions(getAllSessions());
    };

    useEffect(() => {
        loadSessions();
        const interval = setInterval(loadSessions, 5000); 
        return () => clearInterval(interval);
    }, []);

    const createNewId = () => {
        const id = generateUserId();
        setNewId(id);
        setCopied(null);
        loadSessions();
    };

    const copyToClipboard = (text: string, type: 'id' | 'url') => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ${seconds % 60}s`;
    };

    const fullUrl = newId ? `${window.location.origin}?id=${newId}` : '';

    return (
        <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Monitor sessions and generate access IDs</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button 
                        onClick={createNewId}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors"
                    >
                        Generate ID
                    </button>
                    
                    {newId && (
                        <div className="mt-4 p-4 bg-white border border-green-200 rounded-lg shadow-sm">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-semibold text-gray-600">Generated ID:</span>
                                    <div className="flex items-center gap-2">
                                        <code className="bg-gray-100 px-2 py-1 rounded font-mono font-bold text-green-700 text-lg">{newId}</code>
                                        <button 
                                            onClick={() => copyToClipboard(newId, 'id')}
                                            className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"
                                            title="Copy ID"
                                        >
                                            {copied === 'id' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-semibold text-gray-600">Full URL:</span>
                                    <div className="flex items-center gap-2 max-w-xs">
                                        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs text-gray-500 truncate">{fullUrl}</code>
                                        <button 
                                            onClick={() => copyToClipboard(fullUrl, 'url')}
                                            className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors flex-shrink-0"
                                            title="Copy URL"
                                        >
                                            {copied === 'url' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="font-bold text-gray-700">Active Sessions</h2>
                    <button onClick={loadSessions} className="text-gray-500 hover:text-green-600">
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {Object.values(sessions).length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No sessions found.</div>
                    ) : (
                        Object.values(sessions).map(session => (
                            <div key={session.userId} className="flex flex-col">
                                <div 
                                    className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                                    onClick={() => setExpandedUser(expandedUser === session.userId ? null : session.userId)}
                                >
                                    <div className="flex items-center gap-4">
                                        {expandedUser === session.userId ? <ChevronDown /> : <ChevronRight />}
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <User className="text-blue-600 w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="font-mono font-bold text-lg">{session.userId}</span>
                                            <div className="text-xs text-gray-400">
                                                {Object.keys(session.progress).length} exercises started
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {Object.values(session.progress).filter(p => p.status === 'success').length} / {LESSONS.length} Complete
                                    </div>
                                </div>

                                {expandedUser === session.userId && (
                                    <div className="bg-gray-50 p-4 border-t border-gray-100">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left text-gray-400 border-b border-gray-200">
                                                    <th className="pb-2 font-medium">Exercise</th>
                                                    <th className="pb-2 font-medium">Status</th>
                                                    <th className="pb-2 font-medium">Time Taken</th>
                                                    <th className="pb-2 font-medium">Incorrect Formulas</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {LESSONS.map(lesson => {
                                                    const prog = session.progress[lesson.id];
                                                    return (
                                                        <tr key={lesson.id} className="group">
                                                            <td className="py-3 font-medium text-gray-700">{lesson.title}</td>
                                                            <td className="py-3">
                                                                {prog?.status === 'success' ? (
                                                                    <span className="flex items-center gap-1 text-green-600 font-bold">
                                                                        <CheckCircle className="w-4 h-4" /> Success
                                                                    </span>
                                                                ) : prog ? (
                                                                    <span className="text-orange-500 font-medium">In Progress</span>
                                                                ) : (
                                                                    <span className="text-gray-300 italic">Not started</span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 text-gray-600">
                                                                {prog ? (
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" />
                                                                        {prog.endTime 
                                                                            ? formatTime(prog.endTime - prog.startTime)
                                                                            : formatTime(Date.now() - prog.startTime) + ' (live)'}
                                                                    </div>
                                                                ) : '-'}
                                                            </td>
                                                            <td className="py-3">
                                                                {prog?.incorrectFormulas.length ? (
                                                                    <div className="flex flex-col gap-1">
                                                                        {prog.incorrectFormulas.map((f, i) => (
                                                                            <span key={i} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100 font-mono">
                                                                                {f}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                ) : prog ? (
                                                                    <span className="text-gray-400 italic">None</span>
                                                                ) : '-'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;