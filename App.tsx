import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Spreadsheet, { evaluateFormula } from './components/Spreadsheet';
import XLookupVisualizer from './components/XLookupVisualizer';
import AdminPage from './components/AdminPage';
import { LESSONS } from './constants';
import { SheetData } from './types';
import { PlayCircle, CheckCircle, Info, Wand2 } from 'lucide-react';
import { trackVisit, trackSuccess, trackIncorrectFormula } from './services/tracker';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === '/admin');
  const [userId, setUserId] = useState<string | null>(new URLSearchParams(window.location.search).get('id'));
  
  const [activeLessonId, setActiveLessonId] = useState<string>(LESSONS[0].id);
  const [sheetData, setSheetData] = useState<SheetData>(LESSONS[0].initialSheet || {});
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<'pending' | 'success' | 'fail'>('pending');

  useEffect(() => {
    const handlePopState = () => {
      setIsAdmin(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (userId) {
      trackVisit(userId, activeLessonId);
    }
  }, [activeLessonId, userId]);

  const activeLesson = LESSONS.find(l => l.id === activeLessonId) || LESSONS[0];

  useEffect(() => {
    // Reset sheet when lesson changes
    setSheetData(activeLesson.initialSheet || {});
    setTaskStatus('pending');
    setActiveCell(null); // Reset selection
  }, [activeLessonId]);

  // Check success condition
  useEffect(() => {
    if (!activeLesson.targetCell || !activeLesson.expectedValue) return;

    const cell = sheetData[activeLesson.targetCell];
    if (!cell) return;

    // Check value - either computed by Spreadsheet (if updated) or evaluate it here manually for checking formulas
    let valueToCheck: string | number | boolean | null | undefined = cell.computed;

    // If it's a formula and computed isn't set (because it's just been set in state), verify it using the helper
    if ((valueToCheck === undefined || valueToCheck === null) && cell.formula && cell.formula.startsWith('=')) {
        valueToCheck = evaluateFormula(cell.formula, sheetData);
    } else if (valueToCheck === undefined || valueToCheck === null) {
        valueToCheck = cell.value;
    }

    if (valueToCheck !== undefined && valueToCheck !== null) {
        // Loose equality for string/number comparison (e.g. "2.50" == 2.5)
        // eslint-disable-next-line eqeqeq
        if (valueToCheck == activeLesson.expectedValue) {
            if (activeLesson.expectedFormula && !cell.formula.toUpperCase().includes(activeLesson.expectedFormula)) {
                 // Correct value but wrong method - keep pending
                 if (cell.formula.startsWith('=') && userId) {
                    trackIncorrectFormula(userId, activeLesson.id, cell.formula);
                 }
            } else {
                 setTaskStatus('success');
                 if (userId) {
                    trackSuccess(userId, activeLesson.id);
                 }
            }
        } else if (cell.formula.startsWith('=') && userId) {
             trackIncorrectFormula(userId, activeLesson.id, cell.formula);
        }
    }
  }, [sheetData, activeLesson, userId]);

  const handleLessonChange = (id: string) => {
    setActiveLessonId(id);
  };

  const handleAutoSolve = () => {
      if (!activeLesson.targetCell || !activeLesson.solutionFormula) return;
      const newData = { ...sheetData };
      const target = activeLesson.targetCell;

      newData[target] = {
          ...newData[target],
          value: activeLesson.solutionFormula,
          formula: activeLesson.solutionFormula,
          computed: null // Will be evaluated by effect or Spreadsheet
      };
      setSheetData(newData);
      setActiveCell(target); // Force focus on the target cell
  };

  if (isAdmin) {
    return <AdminPage />;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <Sidebar
        lessons={LESSONS}
        activeLessonId={activeLessonId}
        onSelectLesson={handleLessonChange}
      />

      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
          <div>
             <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span className="uppercase tracking-wider font-semibold">{activeLesson.category}</span>
             </div>
             <h2 className="text-2xl font-bold text-gray-800">{activeLesson.title}</h2>
          </div>
          
          <div className="flex items-center gap-4">
              {activeLesson.solutionFormula && taskStatus !== 'success' && (
                  <button 
                    onClick={handleAutoSolve}
                    className="p-2 opacity-0 cursor-default focus:outline-none"
                    tabIndex={-1}
                  >
                      <Wand2 className="w-5 h-5" />
                  </button>
              )}
              
              {taskStatus === 'success' && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold animate-pulse">
                      <CheckCircle className="w-5 h-5" />
                      Task Completed!
                  </div>
              )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Instructions & Visuals */}
          <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto p-6">
            <div className="prose prose-sm prose-green max-w-none">
              {/* Parse simplified markdown-like structure for bold and headers */}
              {activeLesson.content.split('\n').map((line, i) => {
                  const renderFormulaSyntax = (syntax: string) => {
                      if (!syntax.startsWith('=')) {
                          return <code className="bg-gray-100 px-1 rounded font-mono text-xs text-blue-600">{syntax}</code>;
                      }

                      const match = syntax.match(/^(=[A-Z]+)\((.*)\)$/);
                      if (!match) return <code className="bg-gray-100 px-1 rounded font-mono text-sm">{syntax}</code>;

                      const funcName = match[1];
                      const argsStr = match[2];
                      
                      // Simple split for syntax parameters (not full formula parsing)
                      const args = argsStr.split(/,\s*/);
                      
                      const colors = [
                          'text-orange-600',
                          'text-emerald-600',
                          'text-pink-600',
                          'text-cyan-600',
                          'text-indigo-600',
                          'text-amber-600'
                      ];

                      return (
                          <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-sm font-bold shadow-sm inline-block my-1 border border-gray-200">
                              <span className="text-purple-700">{funcName}</span>
                              <span className="text-gray-400">(</span>
                              {args.map((arg, idx) => (
                                  <React.Fragment key={idx}>
                                      <span className={colors[idx % colors.length]}>{arg}</span>
                                      {idx < args.length - 1 && <span className="text-gray-400">, </span>}
                                  </React.Fragment>
                              ))}
                              <span className="text-gray-400">)</span>
                          </code>
                      );
                  };

                  const renderLine = (text: string) => {
                      const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
                      return parts.map((part, index) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
                          }
                          if (part.startsWith('`') && part.endsWith('`')) {
                              return <React.Fragment key={index}>{renderFormulaSyntax(part.slice(1, -1))}</React.Fragment>;
                          }
                          return part;
                      });
                  };

                  if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mb-4 text-gray-900">{renderLine(line.replace('# ', ''))}</h1>;
                  if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-6 mb-2 text-gray-800">{renderLine(line.replace('### ', ''))}</h3>;
                  if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-gray-700 my-1">{renderLine(line.replace('* ', ''))}</li>;
                  if (line.startsWith('1. ')) return <div key={i} className="ml-4 text-gray-700 my-1 font-medium">{renderLine(line)}</div>;
                  if (line.trim() === '') return <br key={i}/>;
                  return <p key={i} className="text-gray-600 my-2 leading-relaxed">{renderLine(line)}</p>;
              })}
            </div>

            {(activeLesson.id === 'xlookup-concept' || activeLesson.id === 'xlookup-1-basic') && (
                <div className="mt-8">
                    <XLookupVisualizer />
                </div>
            )}

            {activeLesson.goal && (
                <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                        <PlayCircle className="w-5 h-5" />
                        Your Task
                    </h4>
                    <p className="text-blue-900 text-sm">{activeLesson.goal}</p>
                </div>
            )}
             <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 flex gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <p>Type your formula in the selected cell or the formula bar above the grid. Press Enter to apply.</p>
            </div>
          </div>

          {/* Right Panel: Spreadsheet */}
          <div className="flex-1 bg-gray-100 p-4 overflow-hidden flex flex-col">
            <Spreadsheet
                key={activeLessonId}
                data={sheetData}
                selectedCell={activeCell}
                onChange={setSheetData}
                onCellSelect={setActiveCell}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;