import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { askExcelTutor } from '../services/geminiService';

interface ChatInterfaceProps {
    currentContext: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentContext }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Hi! I\'m your Excel AI Tutor. Stuck on a formula? Ask me anything about XLOOKUP or Excel basics!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const newMsg: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsLoading(true);

        const response = await askExcelTutor(input, currentContext, messages);

        setMessages(prev => [...prev, { role: 'model', text: response }]);
        setIsLoading(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all z-50 flex items-center gap-2"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="font-medium">AI Tutor</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 z-50 animate-in fade-in slide-in-from-bottom-10">
            {/* Header */}
            <div className="bg-green-600 text-white p-4 rounded-t-xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <h3 className="font-bold">Excel AI Tutor</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-green-700 p-1 rounded">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map((m, i) => (
                    <div key={i} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            m.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm flex items-center gap-2 text-gray-500 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl flex gap-2">
                <input
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ask about XLOOKUP..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
