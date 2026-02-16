export interface CellData {
  value: string;
  formula: string;
  computed?: string | number | boolean | null;
  style?: {
    bold?: boolean;
    align?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    color?: string;
  };
}

export interface SheetData {
  [key: string]: CellData; // Key is "A1", "B2", etc.
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'functions' | 'practice';
  content: string; // Markdown or text
  initialSheet?: SheetData;
  goal?: string; // Description of what to achieve
  expectedFormula?: string; // Regex or specific string check
  expectedValue?: string | number | boolean; // Check specific cell value
  targetCell?: string; // The cell to check
  solutionFormula?: string; // The secret solution
}

export type ViewState = 'learn' | 'practice';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}