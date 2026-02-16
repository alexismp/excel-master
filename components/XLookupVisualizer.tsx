import React, { useEffect, useState } from 'react';
import { ArrowRight, Search, CheckCircle } from 'lucide-react';

const XLookupVisualizer: React.FC = () => {
  const [step, setStep] = useState(0);

  // Animation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const data = [
    { id: '101', name: 'Apple', match: false },
    { id: '102', name: 'Banana', match: false },
    { id: '103', name: 'Cherry', match: true },
    { id: '104', name: 'Date', match: false },
  ];

  const renderStepDescription = () => {
    switch(step) {
      case 0: return "1. Identify the Lookup Value (103).";
      case 1: return "2. Scan the Lookup Array (IDs) top to bottom.";
      case 2: return "3. Continue scanning...";
      case 3: return "4. Match found at row 3!";
      case 4: return "5. Return the value from the Return Array (Name) at the same row.";
      default: return "";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 my-4">
      <h3 className="text-lg font-bold mb-4 text-green-700 flex items-center gap-2">
        <Search className="w-5 h-5" />
        XLOOKUP Visualization
      </h3>

      <div className="flex gap-8 justify-center items-start mb-6 font-mono text-sm">
        {/* Lookup Value */}
        <div className="flex flex-col items-center">
          <div className="text-gray-500 mb-1">Lookup Value</div>
          <div className={`p-3 border-2 rounded ${step >= 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
            103
          </div>
        </div>

        <ArrowRight className="mt-8 text-gray-400" />

        {/* Arrays */}
        <div className="flex gap-1">
            {/* Lookup Array */}
            <div className="flex flex-col">
                <div className="text-gray-500 mb-1 text-center">Lookup Array</div>
                {data.map((row, idx) => (
                    <div
                        key={`id-${idx}`}
                        className={`p-2 border border-gray-200 w-16 text-center transition-colors duration-300
                            ${step === 1 && idx === 0 ? 'bg-yellow-100 border-yellow-400' : ''}
                            ${step === 2 && idx === 1 ? 'bg-yellow-100 border-yellow-400' : ''}
                            ${step >= 3 && row.match ? 'bg-green-100 border-green-500 font-bold' : ''}
                        `}
                    >
                        {row.id}
                    </div>
                ))}
            </div>

            {/* Return Array */}
             <div className="flex flex-col">
                <div className="text-gray-500 mb-1 text-center">Return Array</div>
                {data.map((row, idx) => (
                    <div
                        key={`name-${idx}`}
                        className={`p-2 border border-gray-200 w-24 text-center transition-colors duration-300
                             ${step === 4 && row.match ? 'bg-purple-100 border-purple-500 font-bold text-purple-700' : ''}
                        `}
                    >
                        {row.name}
                        {step === 4 && row.match && <CheckCircle className="inline-block w-4 h-4 ml-1 text-purple-600" />}
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded text-center text-gray-700 font-medium h-12 flex items-center justify-center">
        {renderStepDescription()}
      </div>
    </div>
  );
};

export default XLookupVisualizer;
