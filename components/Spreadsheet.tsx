import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SheetData, CellData } from '../types';
import { INITIAL_SHEET_ROWS, INITIAL_SHEET_COLS } from '../constants';

interface SpreadsheetProps {
  data: SheetData;
  onChange: (newData: SheetData) => void;
  selectedCell: string | null;
  onCellSelect: (cellId: string | null) => void;
  readOnly?: boolean;
}

// --- Helper Functions ---

const parseRange = (rangeStr: string, sheet: SheetData): (string | number | boolean | null)[] => {
  if (rangeStr.includes(':')) {
    const [start, end] = rangeStr.split(':');
    if (!start || !end) return [];

    const startCol = start.charCodeAt(0);
    const startRow = parseInt(start.substring(1));
    const endCol = end.charCodeAt(0);
    const endRow = parseInt(end.substring(1));

    const values = [];
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const key = `${String.fromCharCode(c)}${r}`;
        const cell = sheet[key];
        values.push(cell ? (cell.computed ?? cell.value) : null);
      }
    }
    return values;
  } else {
    // Single cell reference
    const cell = sheet[rangeStr];
    return [cell ? (cell.computed ?? cell.value) : null];
  }
};

const getCellValue = (ref: string, sheet: SheetData): string | number | boolean | null => {
    // Remove quotes
    if (ref.startsWith('"') && ref.endsWith('"')) return ref.slice(1, -1);
    // Number
    if (!isNaN(parseFloat(ref))) return parseFloat(ref);
    // Boolean
    if (ref.toUpperCase() === 'TRUE') return true;
    if (ref.toUpperCase() === 'FALSE') return false;
    // Cell Reference
    if (/^[A-Z][0-9]+$/.test(ref)) {
        const cell = sheet[ref];
        return cell ? (cell.computed ?? cell.value) : null;
    }
    return ref; // Fallback string
};

const splitArgs = (str: string): string[] => {
  const args: string[] = [];
  let current = '';
  let inQuotes = false;
  let parenLevel = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === '(') parenLevel++;
    else if (char === ')') parenLevel--;

    if (char === ',' && !inQuotes && parenLevel === 0) {
      args.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current) args.push(current.trim());
  return args;
};

// Recursive argument evaluator
const evaluateArg = (arg: string, sheet: SheetData): string | number | boolean | null => {
  const cleanArg = arg.trim();
  
  // 1. Is it a function call? (Starts with letters followed by open paren)
  // e.g. "SUM(A1:A5)" or "XLOOKUP(...)"
  if (/^[A-Z]+\s*\(/.test(cleanArg)) {
      return evaluateFormula('=' + cleanArg, sheet);
  }

  // 2. Is it an arithmetic expression containing operators?
  // We need to be careful not to trigger on negative numbers like "-5" if that's all it is, 
  // but "A1*5" or "-5+A1" should trigger.
  // Also exclude simple quoted strings.
  const isQuoted = /^"[^"]*"$/.test(cleanArg);
  const hasMathOps = /[\+\-\*\/\&]/.test(cleanArg); // Added & for string concat
  
  if (!isQuoted && hasMathOps) {
       // Check if it's just a simple number with sign
       if (/^-?\d+(\.\d+)?$/.test(cleanArg)) {
           return parseFloat(cleanArg);
       }
       return evaluateFormula('=' + cleanArg, sheet);
  }

  // 3. Fallback to simple value lookup
  return getCellValue(cleanArg, sheet);
};


// --- Formula Evaluators ---

const evaluateSum = (args: string[], sheet: SheetData) => {
    let sum = 0;
    args.forEach(arg => {
        const values = parseRange(arg, sheet);
        values.forEach(v => {
            const num = parseFloat(String(v));
            if (!isNaN(num)) sum += num;
        });
    });
    return sum;
};

const evaluateAverage = (args: string[], sheet: SheetData) => {
    let sum = 0;
    let count = 0;
    args.forEach(arg => {
        const values = parseRange(arg, sheet);
        values.forEach(v => {
            const num = parseFloat(String(v));
            if (!isNaN(num)) {
                sum += num;
                count++;
            }
        });
    });
    return count === 0 ? "#DIV/0!" : sum / count;
};

const evaluateMax = (args: string[], sheet: SheetData) => {
    let max = -Infinity;
    args.forEach(arg => {
        const values = parseRange(arg, sheet);
        values.forEach(v => {
            const num = parseFloat(String(v));
            if (!isNaN(num)) max = Math.max(max, num);
        });
    });
    return max === -Infinity ? 0 : max;
};

const evaluateMin = (args: string[], sheet: SheetData) => {
    let min = Infinity;
    args.forEach(arg => {
        const values = parseRange(arg, sheet);
        values.forEach(v => {
            const num = parseFloat(String(v));
            if (!isNaN(num)) min = Math.min(min, num);
        });
    });
    return min === Infinity ? 0 : min;
};

const evaluateConcat = (args: string[], sheet: SheetData) => {
    // Use evaluateArg to allow nested functions in CONCAT
    return args.map(arg => {
        const val = evaluateArg(arg, sheet);
        return val === null ? '' : String(val);
    }).join('');
};

const evaluateIf = (args: string[], sheet: SheetData) => {
    if (args.length < 2) return "#ERROR";
    const condition = args[0];
    const trueVal = args[1];
    const falseVal = args[2] || "FALSE";

    // Condition needs to be evaluated if it contains math/functions, 
    // but the simple parser below handles basic comparisons. 
    // Complex conditions like IF(SUM(A1:A5)>10, ...) might need pre-eval of sides.
    // For now, let's keep the comparison parser but improve operand retrieval.

    // Supports >, <, =, >=, <=, <>
    const operators = ['>=', '<=', '<>', '>', '<', '='];
    let operator = '';
    for (const op of operators) {
        if (condition.includes(op)) {
            operator = op;
            break;
        }
    }

    let result = false;

    if (operator) {
        const [leftStr, rightStr] = condition.split(operator);
        // Recursively evaluate operands
        const left = evaluateArg(leftStr.trim(), sheet);
        const right = evaluateArg(rightStr.trim(), sheet);
        
        // Strict type check removal for loose comparison
        // eslint-disable-next-line eqeqeq
        switch(operator) {
            case '>': result = (left as any) > (right as any); break;
            case '<': result = (left as any) < (right as any); break;
            case '=': result = (left as any) == (right as any); break;
            case '>=': result = (left as any) >= (right as any); break;
            case '<=': result = (left as any) <= (right as any); break;
            case '<>': result = (left as any) != (right as any); break;
        }
    } else {
        // If no operator, maybe it's just a boolean value or reference?
        const val = evaluateArg(condition, sheet);
        result = !!val;
    }

    // Recursively evaluate the result branch
    return result ? evaluateArg(trueVal, sheet) : evaluateArg(falseVal, sheet);
};

const evaluateCountIf = (args: string[], sheet: SheetData) => {
    if (args.length < 2) return "#ERROR";
    const range = parseRange(args[0], sheet);
    const criteriaVal = getCellValue(args[1], sheet);
    const criteriaStr = String(criteriaVal);

    // Parse operator from criteria string (e.g. ">2.00", "<=10", "apple")
    const operators = ['>=', '<=', '<>', '>', '<', '='];
    let operator = '=';
    let target = criteriaStr;

    for (const op of operators) {
        if (criteriaStr.startsWith(op)) {
            operator = op;
            target = criteriaStr.substring(op.length);
            break;
        }
    }

    const targetNum = parseFloat(target);
    const isTargetNum = !isNaN(targetNum);

    return range.filter(v => {
        if (v === null || v === undefined) return false;
        
        const vNum = parseFloat(String(v));
        const isVNum = !isNaN(vNum);

        // Numeric comparison
        if (isTargetNum && isVNum) {
            // eslint-disable-next-line eqeqeq
            switch(operator) {
                case '>': return vNum > targetNum;
                case '<': return vNum < targetNum;
                case '>=': return vNum >= targetNum;
                case '<=': return vNum <= targetNum;
                case '=': return vNum == targetNum;
                case '<>': return vNum != targetNum;
            }
        }
        
        // String comparison
        const vStr = String(v).toLowerCase();
        const tStr = target.toLowerCase();
         // eslint-disable-next-line eqeqeq
        switch(operator) {
            case '>': return vStr > tStr;
            case '<': return vStr < tStr;
            case '>=': return vStr >= tStr;
            case '<=': return vStr <= tStr;
            case '=': return vStr == tStr;
            case '<>': return vStr != tStr;
        }
        return false;
    }).length;
};

// Text Functions
const evaluateLen = (args: string[], sheet: SheetData) => {
    if (args.length < 1) return "#ERROR";
    const val = String(evaluateArg(args[0], sheet) || '');
    return val.length;
};

const evaluateUpper = (args: string[], sheet: SheetData) => {
    if (args.length < 1) return "#ERROR";
    const val = String(evaluateArg(args[0], sheet) || '');
    return val.toUpperCase();
};

const evaluateLower = (args: string[], sheet: SheetData) => {
    if (args.length < 1) return "#ERROR";
    const val = String(evaluateArg(args[0], sheet) || '');
    return val.toLowerCase();
};

const evaluateProper = (args: string[], sheet: SheetData) => {
    if (args.length < 1) return "#ERROR";
    const val = String(evaluateArg(args[0], sheet) || '');
    return val.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
};

const evaluateLeft = (args: string[], sheet: SheetData) => {
    if (args.length < 2) return "#ERROR";
    const val = String(evaluateArg(args[0], sheet) || '');
    const num = parseInt(String(evaluateArg(args[1], sheet)));
    return val.substring(0, num);
};

const evaluateRight = (args: string[], sheet: SheetData) => {
    if (args.length < 2) return "#ERROR";
    const val = String(evaluateArg(args[0], sheet) || '');
    const num = parseInt(String(evaluateArg(args[1], sheet)));
    return val.slice(-num);
};

const evaluateXLookup = (args: string[], sheet: SheetData): string | number | boolean | null => {
  if (args.length < 3) return "#N/A";

  // Use evaluateArg for the lookup value so we can search for derived values
  const lookupVal = evaluateArg(args[0], sheet);
  const lookupArr = parseRange(args[1], sheet);
  const returnArr = parseRange(args[2], sheet);
  const ifNotFound = args.length > 3 ? evaluateArg(args[3], sheet) : "#N/A"; // Evaluate 'if not found' too
  const matchMode = args.length > 4 ? parseInt(String(getCellValue(args[4], sheet))) : 0;
  // 0 = Exact, -1 = Exact or next smaller, 1 = Exact or next larger, 2 = Wildcard

  if (lookupArr.length === 0 || returnArr.length === 0) return "#REF!";

  let index = -1;

  if (matchMode === 0) {
      // Exact match
      index = lookupArr.findIndex(v => String(v).toLowerCase() === String(lookupVal).toLowerCase());
  } else if (matchMode === -1) {
      // Exact or next smaller
      let bestDiff = Infinity;
      const target = parseFloat(String(lookupVal));
      if (isNaN(target)) return "#VALUE!"; 

      for(let i=0; i<lookupArr.length; i++) {
          const current = parseFloat(String(lookupArr[i]));
          if (isNaN(current)) continue;
          if (current === target) {
              index = i;
              break;
          }
          if (current < target) {
              const diff = target - current;
              if (diff < bestDiff) {
                  bestDiff = diff;
                  index = i;
              }
          }
      }
  }

  if (index !== -1 && index < returnArr.length) {
      return returnArr[index];
  }

  return ifNotFound;
};

// Simple arithmetic evaluator: =A1*B1+10
const evaluateArithmetic = (formula: string, sheet: SheetData): string | number | boolean | null => {
    try {
        // 1. Replace Cell References with values
        let parsedFormula = formula.toUpperCase().replace(/[A-Z][0-9]+/g, (match) => {
            const val = getCellValue(match, sheet);
            if (val === null || val === undefined) return '0';
            if (typeof val === 'string') return `"${val}"`; 
            return String(val);
        });

        // 2. Handle Ampersand (&) for string concatenation (Excel style)
        // convert "A" & "B" to "A" + "B" for JS eval
        parsedFormula = parsedFormula.replace(/&/g, '+');

        // 3. Evaluate safely (relatively)
        // Only allow digits, operators, parens, quotes
        if (!/^[\d\.\+\-\*\/\(\)\s"<>!=]+$/.test(parsedFormula)) { // Added comparison ops for safety check just in case
             // If it contains things other than math chars, it might be invalid or complex
             return "#ERROR";
        }

        // eslint-disable-next-line no-new-func
        return new Function(`return ${parsedFormula}`)();
    } catch (e) {
        return "#VALUE!";
    }
}

// Main formula evaluator
export const evaluateFormula = (formula: string, sheet: SheetData): string | number | boolean | null => {
  if (!formula.startsWith('=')) return formula;

  const contentStr = formula.substring(1); // Remove =
  const parenStart = contentStr.indexOf('(');

  // If there are no parens, it might be a direct ref (=A1) or arithmetic (=A1*B1)
  // If there are parens, check if it looks like a function call `FUNC(...)`
  // Simple check: does it start with a known function keyword?
  const knownFunctions = ['XLOOKUP', 'SUM', 'AVERAGE', 'IF', 'COUNTIF', 'CONCAT', 'MAX', 'MIN', 'LEN', 'UPPER', 'LOWER', 'PROPER', 'LEFT', 'RIGHT'];
  const potentialFunc = parenStart > -1 ? contentStr.substring(0, parenStart).toUpperCase() : '';

  if (knownFunctions.includes(potentialFunc)) {
      const argsStr = contentStr.substring(parenStart + 1, contentStr.lastIndexOf(')'));
      const args = splitArgs(argsStr);
      try {
          switch(potentialFunc) {
              case 'XLOOKUP': return evaluateXLookup(args, sheet);
              case 'SUM': return evaluateSum(args, sheet);
              case 'AVERAGE': return evaluateAverage(args, sheet);
              case 'MAX': return evaluateMax(args, sheet);
              case 'MIN': return evaluateMin(args, sheet);
              case 'IF': return evaluateIf(args, sheet);
              case 'COUNTIF': return evaluateCountIf(args, sheet);
              case 'CONCAT': return evaluateConcat(args, sheet);
              case 'LEN': return evaluateLen(args, sheet);
              case 'UPPER': return evaluateUpper(args, sheet);
              case 'LOWER': return evaluateLower(args, sheet);
              case 'PROPER': return evaluateProper(args, sheet);
              case 'LEFT': return evaluateLeft(args, sheet);
              case 'RIGHT': return evaluateRight(args, sheet);
              default: return "#NAME?";
          }
      } catch (e) {
          console.error(e);
          return "#ERROR";
      }
  }

  // Fallback to arithmetic/reference
  return evaluateArithmetic(contentStr, sheet);
};

const Spreadsheet: React.FC<SpreadsheetProps> = ({ data, onChange, selectedCell, onCellSelect, readOnly }) => {
  const [editValue, setEditValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync editValue when selection changes or data updates externally
  useEffect(() => {
    if (selectedCell) {
        setEditValue(data[selectedCell]?.formula || data[selectedCell]?.value || '');
        setIsEditing(false);
    } else {
        setEditValue('');
    }
  }, [selectedCell, data]);

  const computedData = useCallback(() => {
    const newData = { ...data };
    // Single pass calculation.
    // For a real app, a dependency graph is needed.
    // Here we assume simple independent formulas or top-down flow is sufficient for the exercises.
    Object.keys(newData).forEach(key => {
        const cell = newData[key];
        if (cell.formula.startsWith('=')) {
            const result = evaluateFormula(cell.formula, newData);
            if (cell.computed !== result) {
                cell.computed = result;
            }
        } else {
            const num = parseFloat(cell.value);
            cell.computed = isNaN(num) ? cell.value : cell.value;
        }
    });
    return newData;
  }, [data]);

  const handleCellClick = (key: string) => {
    onCellSelect(key);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const commitEdit = () => {
    if (selectedCell && !readOnly) {
      const newData = { ...data };
      const val = editValue;
      newData[selectedCell] = {
        ...newData[selectedCell],
        value: val.startsWith('=') ? val : val,
        formula: val,
        computed: val.startsWith('=') ? null : val
      };
      onChange(newData);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitEdit();
      if (selectedCell) {
          const col = selectedCell.charAt(0);
          const row = parseInt(selectedCell.substring(1));
          const nextKey = `${col}${row + 1}`;
          handleCellClick(nextKey);
      }
    }
  };

  const cols = Array.from({ length: INITIAL_SHEET_COLS }, (_, i) => String.fromCharCode(65 + i));
  const rows = Array.from({ length: INITIAL_SHEET_ROWS }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full border border-gray-300 bg-white rounded-lg overflow-hidden text-sm">
      <div className="flex items-center p-2 border-b border-gray-300 bg-gray-50">
        <div className="w-10 text-center font-bold text-gray-500">{selectedCell || ''}</div>
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        <div className="font-serif italic text-gray-500 mr-2">fx</div>
        <input
          className="flex-1 p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
          value={selectedCell ? editValue : ''}
          onChange={(e) => {
              setEditValue(e.target.value);
              setIsEditing(true);
          }}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          disabled={readOnly}
          placeholder="Select a cell to edit..."
        />
      </div>

      <div className="flex-1 overflow-auto relative">
        <div className="inline-block min-w-full">
            <div className="flex sticky top-0 z-10">
                <div className="w-10 h-8 bg-gray-100 border-r border-b border-gray-300"></div>
                {cols.map(c => (
                    <div key={c} className="w-24 h-8 flex items-center justify-center bg-gray-100 border-r border-b border-gray-300 font-semibold text-gray-600 select-none">
                        {c}
                    </div>
                ))}
            </div>

            {rows.map(r => (
                <div key={r} className="flex">
                    <div className="w-10 h-8 flex items-center justify-center bg-gray-100 border-r border-b border-gray-300 font-semibold text-gray-600 select-none sticky left-0 z-10">
                        {r}
                    </div>
                    {cols.map(c => {
                        const key = `${c}${r}`;
                        const computed = computedData();
                        const cell = computed[key];
                        const isSelected = selectedCell === key;
                        const displayVal = cell?.computed ?? cell?.value ?? '';

                        return (
                            <div
                                key={key}
                                onClick={() => handleCellClick(key)}
                                onDoubleClick={handleDoubleClick}
                                className={`w-24 h-8 border-r border-b border-gray-200 px-1 flex items-center overflow-hidden cursor-cell
                                    ${isSelected ? 'outline outline-2 outline-green-500 z-0' : ''}
                                    ${cell?.style?.backgroundColor ? '' : 'bg-white'}
                                    ${cell?.style?.bold ? 'font-bold' : ''}
                                `}
                                style={{
                                    backgroundColor: cell?.style?.backgroundColor,
                                    justifyContent: cell?.style?.align === 'center' ? 'center' : cell?.style?.align === 'right' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                {isSelected && isEditing ? (
                                    <input
                                        ref={inputRef}
                                        className="w-full h-full outline-none bg-transparent"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onBlur={commitEdit}
                                    />
                                ) : (
                                    <span className="truncate w-full">{displayVal}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;