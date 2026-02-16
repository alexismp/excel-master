import React from 'react';
import { BookOpen, Table, CheckSquare, BarChart } from 'lucide-react';
import { Lesson } from '../types';

interface SidebarProps {
  lessons: Lesson[];
  activeLessonId: string;
  onSelectLesson: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ lessons, activeLessonId, onSelectLesson }) => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full border-r border-gray-800">
      <div className="p-4 border-b border-gray-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center font-bold text-lg">X</div>
        <h1 className="text-xl font-bold tracking-tight">ExcelMaster AI</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Learn</div>
        {lessons.filter(l => l.category !== 'practice').map(lesson => (
            <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors
                    ${activeLessonId === lesson.id ? 'bg-gray-800 text-green-400 border-r-4 border-green-500' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                `}
            >
                {lesson.category === 'basics' ? <Table className="w-4 h-4" /> : <BarChart className="w-4 h-4" />}
                <span className="text-sm font-medium">{lesson.title}</span>
            </button>
        ))}

        <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">Practice</div>
         {lessons.filter(l => l.category === 'practice').map(lesson => (
            <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors
                    ${activeLessonId === lesson.id ? 'bg-gray-800 text-green-400 border-r-4 border-green-500' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                `}
            >
                <CheckSquare className="w-4 h-4" />
                <span className="text-sm font-medium">{lesson.title}</span>
            </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
        v1.0.0 &bull; Powered by Gemini
      </div>
    </div>
  );
};

export default Sidebar;
