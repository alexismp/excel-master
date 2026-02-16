import { Lesson, SheetData } from './types';

export const INITIAL_SHEET_ROWS = 20;
export const INITIAL_SHEET_COLS = 10; // A-J

// Helper to generate empty grid
export const generateEmptySheet = (): SheetData => {
  const data: SheetData = {};
  for (let r = 0; r < INITIAL_SHEET_ROWS; r++) {
    for (let c = 0; c < INITIAL_SHEET_COLS; c++) {
      const colLabel = String.fromCharCode(65 + c);
      const rowLabel = r + 1;
      data[`${colLabel}${rowLabel}`] = { value: '', formula: '' };
    }
  }
  return data;
};

// Base Data for XLOOKUP Exercises
const BASIC_SALES_DATA: SheetData = {
  ...generateEmptySheet(),
  'A1': { value: 'Product ID', formula: '', style: { bold: true, backgroundColor: '#f3f4f6' } },
  'B1': { value: 'Product Name', formula: '', style: { bold: true, backgroundColor: '#f3f4f6' } },
  'C1': { value: 'Price', formula: '', style: { bold: true, backgroundColor: '#f3f4f6' } },
  'A2': { value: '101', formula: '' }, 'B2': { value: 'Apple', formula: '' }, 'C2': { value: '1.20', formula: '' },
  'A3': { value: '102', formula: '' }, 'B3': { value: 'Banana', formula: '' }, 'C3': { value: '0.80', formula: '' },
  'A4': { value: '103', formula: '' }, 'B4': { value: 'Cherry', formula: '' }, 'C4': { value: '2.50', formula: '' },
  'A5': { value: '104', formula: '' }, 'B5': { value: 'Date', formula: '' }, 'C5': { value: '3.00', formula: '' },
};

const EMPLOYEE_DATA: SheetData = {
  ...generateEmptySheet(),
  'A1': { value: 'First Name', formula: '', style: { bold: true, backgroundColor: '#f3f4f6' } },
  'B1': { value: 'Last Name', formula: '', style: { bold: true, backgroundColor: '#f3f4f6' } },
  'C1': { value: 'Emp ID', formula: '', style: { bold: true, backgroundColor: '#f3f4f6' } },
  'A2': { value: 'John', formula: '' }, 'B2': { value: 'Doe', formula: '' }, 'C2': { value: 'E01', formula: '' },
  'A3': { value: 'Jane', formula: '' }, 'B3': { value: 'Smith', formula: '' }, 'C3': { value: 'E02', formula: '' },
  'A4': { value: 'Alice', formula: '' }, 'B4': { value: 'Brown', formula: '' }, 'C4': { value: 'E03', formula: '' },
};

const TAX_RATE_DATA: SheetData = {
    ...generateEmptySheet(),
    'A1': { value: 'Income Threshold', formula: '', style: { bold: true, backgroundColor: '#e5e7eb' } },
    'B1': { value: 'Tax Rate', formula: '', style: { bold: true, backgroundColor: '#e5e7eb' } },
    'A2': { value: '0', formula: '' }, 'B2': { value: '0%', formula: '' },
    'A3': { value: '10000', formula: '' }, 'B3': { value: '10%', formula: '' },
    'A4': { value: '20000', formula: '' }, 'B4': { value: '20%', formula: '' },
    'A5': { value: '50000', formula: '' }, 'B5': { value: '30%', formula: '' },
    'D1': { value: 'Salary', formula: '', style: { bold: true } },
    'E1': { value: 'Rate', formula: '', style: { bold: true } },
    'D2': { value: '15000', formula: '', style: { backgroundColor: '#fff7ed' } },
};

const GRADES_DATA: SheetData = {
    ...generateEmptySheet(),
    'A1': { value: 'Student', formula: '', style: { bold: true } },
    'B1': { value: 'Score', formula: '', style: { bold: true } },
    'C1': { value: 'Result', formula: '', style: { bold: true } },
    'A2': { value: 'Tom', formula: '' }, 'B2': { value: '85', formula: '' },
    'A3': { value: 'Jerry', formula: '' }, 'B3': { value: '42', formula: '' },
    'A4': { value: 'Spike', formula: '' }, 'B4': { value: '60', formula: '' },
    'A5': { value: 'Tyke', formula: '' }, 'B5': { value: '92', formula: '' },
};

const INVENTORY_DATA: SheetData = {
    ...generateEmptySheet(),
    'A1': { value: 'Item', formula: '', style: { bold: true } },
    'B1': { value: 'Quantity', formula: '', style: { bold: true } },
    'C1': { value: 'Cost', formula: '', style: { bold: true } },
    'D1': { value: 'Total Value', formula: '', style: { bold: true } },
    'A2': { value: 'Widget', formula: '' }, 'B2': { value: '10', formula: '' }, 'C2': { value: '5.50', formula: '' },
    'A3': { value: 'Gadget', formula: '' }, 'B3': { value: '5', formula: '' }, 'C3': { value: '12.00', formula: '' },
};

const PROFIT_DATA: SheetData = {
    ...generateEmptySheet(),
    'A1': { value: 'Item', formula: '', style: { bold: true } },
    'B1': { value: 'Price', formula: '', style: { bold: true } },
    'C1': { value: 'Cost', formula: '', style: { bold: true } },
    'D1': { value: 'Sold', formula: '', style: { bold: true } },
    'E1': { value: 'Profit', formula: '', style: { bold: true } },
    'A2': { value: 'Lemonade', formula: '' }, 'B2': { value: '2.00', formula: '' }, 'C2': { value: '0.50', formula: '' }, 'D2': { value: '100', formula: '' },
};

const TEXT_DATA: SheetData = {
    ...generateEmptySheet(),
    'A1': { value: 'Raw Input', formula: '', style: { bold: true } },
    'B1': { value: 'Result', formula: '', style: { bold: true } },
    'A2': { value: 'john doe', formula: '' },
    'A3': { value: 'REPORT_FINAL', formula: '' },
    'A4': { value: 'ID-12345-X', formula: '' },
};

const COMMISSION_DATA: SheetData = {
    ...generateEmptySheet(),
    'A1': { value: 'Sales Rep', formula: '', style: { bold: true } },
    'B1': { value: 'Sales', formula: '', style: { bold: true } },
    'C1': { value: 'Commission', formula: '', style: { bold: true } },
    'A2': { value: 'Alex', formula: '' }, 'B2': { value: '1200', formula: '' },
    'A3': { value: 'Sam', formula: '' }, 'B3': { value: '800', formula: '' },
};

const DISCOUNT_DATA: SheetData = {
    ...generateEmptySheet(),
    'A1': { value: 'Item', formula: '', style: { bold: true } },
    'B1': { value: 'Qty', formula: '', style: { bold: true } },
    'C1': { value: 'Unit Price', formula: '', style: { bold: true } },
    'D1': { value: 'Final Price', formula: '', style: { bold: true } },
    'A2': { value: 'Pen', formula: '' }, 'B2': { value: '50', formula: '' }, 'C2': { value: '2.00', formula: '' },
};

const DRIVER_DATA: SheetData = {
    ...generateEmptySheet(),
    'A1': { value: 'Name', formula: '', style: { bold: true } },
    'B1': { value: 'Age', formula: '', style: { bold: true } },
    'C1': { value: 'Licence', formula: '', style: { bold: true } },
    'D1': { value: 'Status', formula: '', style: { bold: true } },
    'A2': { value: 'Kid', formula: '' }, 'B2': { value: '16', formula: '' }, 'C2': { value: 'No', formula: '' },
    'A3': { value: 'Teen', formula: '' }, 'B3': { value: '19', formula: '' }, 'C3': { value: 'No', formula: '' },
    'A4': { value: 'Adult', formula: '' }, 'B4': { value: '25', formula: '' }, 'C4': { value: 'Yes', formula: '' },
};


export const LESSONS: Lesson[] = [
  // --- BASICS ---
  {
    id: 'intro-excel',
    title: 'Excel Interface Basics',
    description: 'Learn the layout: Rows, Columns, Cells, and the Formula Bar.',
    category: 'basics',
    content: `
# Welcome to Excel Essentials

Excel is a powerful tool for organizing and analyzing data.

### Key Concepts:
* **Grid**: The main area made of rows (numbers) and columns (letters).
* **Cell**: The intersection of a row and column (e.g., A1).
* **Formula Bar**: The area above the grid where you can type values or formulas.

### Try it out:
Click on any cell in the spreadsheet on the right. Type a value and press Enter.
    `,
    initialSheet: generateEmptySheet(),
  },
  {
    id: 'xlookup-concept',
    title: 'Understanding XLOOKUP',
    description: 'Deep dive into XLOOKUP with visualizations.',
    category: 'functions',
    content: `
# XLOOKUP: The Modern Search

**XLOOKUP** allows you to search for a value in one array and return a value from another.

### Syntax
\`=XLOOKUP(lookup_value, lookup_array, return_array)\`

1. **lookup_value**: What you are looking for.
2. **lookup_array**: Where to look for it.
3. **return_array**: What to return.

### How it works
Imagine scanning down a list of IDs to find "103". Once found, you look directly across to the "Name" column to get "Cherry".
    `,
    initialSheet: {
        ...BASIC_SALES_DATA,
        'E1': { value: 'Lookup ID', formula: '', style: { bold: true } },
        'F1': { value: 'Result Name', formula: '', style: { bold: true } },
        'E2': { value: '103', formula: '', style: { backgroundColor: '#fef3c7' } },
    },
    goal: 'Use XLOOKUP to find the Product Name for ID 103.',
    targetCell: 'F2',
    expectedValue: 'Cherry',
    expectedFormula: 'XLOOKUP',
    solutionFormula: '=XLOOKUP(E2, A2:A5, B2:B5)'
  },

  // --- XLOOKUP PRACTICE ---
  {
    id: 'xlookup-1-basic',
    title: 'Ex 1: Basic Lookup',
    description: 'Find the Price of a product based on its ID.',
    category: 'practice',
    content: `
# Exercise 1: Basic XLOOKUP

You have a list of products with their IDs and Prices. You need to find the price for a specific product ID.

**Task**:
Find the **Price** for the Product ID listed in cell **E2**.

**Hint**:
* \`lookup_value\`: The specific ID you are searching for.
* \`lookup_array\`: The entire column containing the IDs.
* \`return_array\`: The entire column containing the Prices.
    `,
    initialSheet: {
        ...BASIC_SALES_DATA,
        'E1': { value: 'Lookup ID', formula: '', style: { bold: true } },
        'F1': { value: 'Price', formula: '', style: { bold: true } },
        'E2': { value: '102', formula: '', style: { backgroundColor: '#fef3c7' } },
    },
    goal: 'Calculate the Price for ID 102 in cell F2.',
    targetCell: 'F2',
    expectedValue: '0.8',
    expectedFormula: 'XLOOKUP',
    solutionFormula: '=XLOOKUP(E2, A2:A5, C2:C5)'
  },
  {
    id: 'xlookup-2-left',
    title: 'Ex 2: Left Lookup',
    description: 'Look to the left! Find a Name based on Employee ID.',
    category: 'practice',
    content: `
# Exercise 2: Looking Left

Unlike VLOOKUP, XLOOKUP can return values from columns to the *left* of your search column.

**Task**:
Find the **Last Name** (Col B) for the Employee ID specified in cell **E2**.

**Hint**:
Your \`lookup_array\` should be the Employee ID column, and your \`return_array\` should be the Last Name column.
    `,
    initialSheet: {
        ...EMPLOYEE_DATA,
        'E1': { value: 'Search ID', formula: '', style: { bold: true } },
        'F1': { value: 'Last Name', formula: '', style: { bold: true } },
        'E2': { value: 'E03', formula: '', style: { backgroundColor: '#fef3c7' } },
    },
    goal: 'Find the Last Name for ID E03 in cell F2.',
    targetCell: 'F2',
    expectedValue: 'Brown',
    expectedFormula: 'XLOOKUP',
    solutionFormula: '=XLOOKUP(E2, C2:C4, B2:B4)'
  },
  {
    id: 'xlookup-3-error',
    title: 'Ex 3: Handling Errors',
    description: 'Display a custom message if the item is not found.',
    category: 'practice',
    content: `
# Exercise 3: "Not Found"

Sometimes the value you search for doesn't exist. XLOOKUP lets you define a custom message for this using the 4th argument.

**Syntax**:
\`=XLOOKUP(val, lookup, return, "Message")\`

**Task**:
Search for the ID in **E2** (which does not exist in the list) and return the text "**Missing**".
    `,
    initialSheet: {
        ...BASIC_SALES_DATA,
        'E1': { value: 'Lookup ID', formula: '', style: { bold: true } },
        'F1': { value: 'Price', formula: '', style: { bold: true } },
        'E2': { value: '999', formula: '', style: { backgroundColor: '#fee2e2' } },
    },
    goal: 'Search for ID 999. Return "Missing" if not found in F2.',
    targetCell: 'F2',
    expectedValue: 'Missing',
    expectedFormula: 'XLOOKUP',
    solutionFormula: '=XLOOKUP(E2, A2:A5, C2:C5, "Missing")'
  },
  {
    id: 'xlookup-4-horizontal',
    title: 'Ex 4: Horizontal Lookup',
    description: 'Search across rows instead of columns.',
    category: 'practice',
    content: `
# Exercise 4: Horizontal Search

XLOOKUP works for rows just as well as columns.

**Task**:
Find the Sales figure for the Month listed in **B4**.

**Hint**:
Your arrays will be horizontal (e.g., \`A1:D1\`) instead of vertical.
    `,
    initialSheet: {
        ...generateEmptySheet(),
        'A1': { value: 'Month', formula: '', style: { bold: true } },
        'B1': { value: 'Jan', formula: '' }, 'C1': { value: 'Feb', formula: '' }, 'D1': { value: 'Mar', formula: '' },
        'A2': { value: 'Sales', formula: '', style: { bold: true } },
        'B2': { value: '500', formula: '' }, 'C2': { value: '750', formula: '' }, 'D2': { value: '600', formula: '' },
        'A4': { value: 'Lookup:', formula: '', style: { bold: true } },
        'B4': { value: 'Feb', formula: '', style: { backgroundColor: '#fef3c7' } },
        'C4': { value: 'Result:', formula: '', style: { bold: true } },
    },
    goal: 'Find the Sales for "Feb" in cell D4.',
    targetCell: 'D4',
    expectedValue: '750',
    expectedFormula: 'XLOOKUP',
    solutionFormula: '=XLOOKUP(B4, B1:D1, B2:D2)'
  },
  {
    id: 'xlookup-5-approx',
    title: 'Ex 5: Tax Rates (Approx)',
    description: 'Use approximate matching for ranges.',
    category: 'practice',
    content: `
# Exercise 5: Approximate Match

We want to find the Tax Rate for a salary of **15,000**.
The table lists thresholds (0, 10000, 20000...). Since 15,000 isn't listed exactly, we want the rate for the *next smaller* bracket.

**Task**:
Use XLOOKUP to find the correct Tax Rate for the Salary in **D2**.

**Hint**:
Use the 5th argument of XLOOKUP: \`match_mode\`.
* \`0\`: Exact match (default)
* \`-1\`: Exact match or next smaller item
* \`1\`: Exact match or next larger item
    `,
    initialSheet: TAX_RATE_DATA,
    goal: 'Find the tax rate for 15000 in cell E2.',
    targetCell: 'E2',
    expectedValue: '10%',
    expectedFormula: 'XLOOKUP',
    solutionFormula: '=XLOOKUP(D2, A2:A5, B2:B5, "", -1)'
  },

  // --- GENERAL FUNCTIONS PRACTICE ---
  {
    id: 'func-sum',
    title: 'Ex 6: SUM Function',
    description: 'Calculate total sales.',
    category: 'practice',
    content: `
# Exercise 6: SUM

**Task**:
Calculate the **Total** of all values in the **Price** column (Col C).

**Syntax**:
\`=SUM(start_cell:end_cell)\`
    `,
    initialSheet: {
        ...BASIC_SALES_DATA,
        'B6': { value: 'Total:', formula: '', style: { bold: true } },
    },
    goal: 'Calculate total price in C6.',
    targetCell: 'C6',
    expectedValue: 7.5,
    expectedFormula: 'SUM',
    solutionFormula: '=SUM(C2:C5)'
  },
  {
    id: 'func-average',
    title: 'Ex 7: AVERAGE Function',
    description: 'Calculate the average score.',
    category: 'practice',
    content: `
# Exercise 7: AVERAGE

**Task**:
Calculate the average of the student scores listed in the **Score** column.

**Syntax**:
\`=AVERAGE(range)\`
    `,
    initialSheet: {
        ...GRADES_DATA,
        'A6': { value: 'Average:', formula: '', style: { bold: true } },
    },
    goal: 'Calculate the average score in B6.',
    targetCell: 'B6',
    expectedValue: 62.333333333333336, // ~62.33
    expectedFormula: 'AVERAGE',
    solutionFormula: '=AVERAGE(B2:B4)'
  },
  {
    id: 'func-if',
    title: 'Ex 8: IF Function',
    description: 'Conditional logic: Pass or Fail?',
    category: 'practice',
    content: `
# Exercise 8: IF

**Task**:
Determine if **Tom** (row 2) Passed or Failed.
* If the score is **greater than or equal to 60**, return "**Pass**".
* Otherwise, return "**Fail**".

**Syntax**:
\`=IF(condition, value_if_true, value_if_false)\`

**Hint**:
The condition should compare Tom's score cell to the number 60.
    `,
    initialSheet: GRADES_DATA,
    goal: 'Determine result for Tom in C2 (Pass/Fail).',
    targetCell: 'C2',
    expectedValue: 'Pass',
    expectedFormula: 'IF',
    solutionFormula: '=IF(B2>=60, "Pass", "Fail")'
  },
  {
    id: 'func-countif',
    title: 'Ex 9: COUNTIF Function',
    description: 'Count items that meet a criteria.',
    category: 'practice',
    content: `
# Exercise 9: COUNTIF

**Task**:
Count how many items in the **Price** column have a value **greater than 2.00**.

**Syntax**:
\`=COUNTIF(range, criteria)\`

**Hint**:
Remember to put your criteria in quotes, e.g., \`">10"\`.
    `,
    initialSheet: {
        ...BASIC_SALES_DATA,
        'E1': { value: 'Expensive Items:', formula: '', style: { bold: true } },
    },
    goal: 'Count items with price > 2.00 in F1.',
    targetCell: 'F1',
    expectedValue: 2,
    expectedFormula: 'COUNTIF',
    solutionFormula: '=COUNTIF(C2:C5, ">2.00")'
  },
  {
    id: 'func-concat',
    title: 'Ex 10: Text Joining',
    description: 'Combine First and Last names.',
    category: 'practice',
    content: `
# Exercise 10: CONCAT

**Task**:
Create a full name in cell **D2** by combining the **First Name** and **Last Name**.
Make sure to include a **space** between them.

**Syntax**:
\`=CONCAT(text1, text2, text3...)\`

**Hint**:
You can concat a space by using \`" "\` as one of your arguments.
    `,
    initialSheet: {
        ...EMPLOYEE_DATA,
        'D1': { value: 'Full Name', formula: '', style: { bold: true } },
    },
    goal: 'Combine First (A2) and Last Name (B2) in D2.',
    targetCell: 'D2',
    expectedValue: 'John Doe',
    expectedFormula: 'CONCAT',
    solutionFormula: '=CONCAT(A2, " ", B2)'
  },
  // --- NEW EXERCISES (Math & Text) ---
  {
      id: 'math-mult',
      title: 'Ex 11: Multiplication',
      description: 'Calculate Total Value = Quantity * Cost.',
      category: 'practice',
      content: `
# Exercise 11: Multiplication

**Task**:
Calculate the **Total Value** for the Widget in cell **D2**.

**Formula**:
Multiply the **Quantity** cell by the **Cost** cell.
Use the asterisk \`*\` for multiplication.
      `,
      initialSheet: INVENTORY_DATA,
      goal: 'Calculate Total Value for Widget in D2.',
      targetCell: 'D2',
      expectedValue: 55,
      expectedFormula: '*',
      solutionFormula: '=B2*C2'
  },
  {
      id: 'math-profit',
      title: 'Ex 12: Profit Calculation',
      description: 'Calculate Profit = (Price - Cost) * Sold.',
      category: 'practice',
      content: `
# Exercise 12: Order of Operations

**Task**:
Calculate the total **Profit** for Lemonade.

**Formula**:
Profit is defined as: \`(Price - Cost) * Units Sold\`.

**Hint**:
Use parentheses \`()\` to ensure the subtraction happens before the multiplication.
      `,
      initialSheet: PROFIT_DATA,
      goal: 'Calculate Profit in E2.',
      targetCell: 'E2',
      expectedValue: 150,
      expectedFormula: '*',
      solutionFormula: '=(B2-C2)*D2'
  },
  {
      id: 'func-max',
      title: 'Ex 13: MAX Function',
      description: 'Find the highest score.',
      category: 'practice',
      content: `
# Exercise 13: MAX

**Task**:
Find the **highest score** from the list of students.

**Syntax**:
\`=MAX(range)\`
      `,
      initialSheet: {
          ...GRADES_DATA,
          'A6': { value: 'High Score:', formula: '', style: { bold: true } },
      },
      goal: 'Find the highest score in B6.',
      targetCell: 'B6',
      expectedValue: 92,
      expectedFormula: 'MAX',
      solutionFormula: '=MAX(B2:B5)'
  },
  {
      id: 'func-min',
      title: 'Ex 14: MIN Function',
      description: 'Find the lowest price.',
      category: 'practice',
      content: `
# Exercise 14: MIN

**Task**:
Find the **lowest price** in the product list (Column C).

**Syntax**:
\`=MIN(range)\`
      `,
      initialSheet: {
          ...BASIC_SALES_DATA,
          'E4': { value: 'Cheapest:', formula: '', style: { bold: true } },
      },
      goal: 'Find the lowest price in F4.',
      targetCell: 'F4',
      expectedValue: 0.8,
      expectedFormula: 'MIN',
      solutionFormula: '=MIN(C2:C5)'
  },
  {
      id: 'func-len',
      title: 'Ex 15: LEN Function',
      description: 'Count characters in a cell.',
      category: 'practice',
      content: `
# Exercise 15: LEN (Length)

**Task**:
Count the number of characters in the ID string located in cell **A4**.

**Syntax**:
\`=LEN(text_cell)\`
      `,
      initialSheet: {
          ...TEXT_DATA,
          'B4': { value: '', formula: '' } // Target
      },
      goal: 'Count characters of A4 in B4.',
      targetCell: 'B4',
      expectedValue: 10,
      expectedFormula: 'LEN',
      solutionFormula: '=LEN(A4)'
  },
  {
      id: 'func-proper',
      title: 'Ex 16: PROPER Case',
      description: 'Capitalize names correctly.',
      category: 'practice',
      content: `
# Exercise 16: PROPER

**Task**:
Convert the name in cell **A2** to "Proper Case" (where the first letter of each word is capitalized).

**Syntax**:
\`=PROPER(text_cell)\`
      `,
      initialSheet: TEXT_DATA,
      goal: 'Convert A2 to Proper Case in B2.',
      targetCell: 'B2',
      expectedValue: 'John Doe',
      expectedFormula: 'PROPER',
      solutionFormula: '=PROPER(A2)'
  },
  {
      id: 'func-upper',
      title: 'Ex 17: UPPER Case',
      description: 'Convert text to all uppercase.',
      category: 'practice',
      content: `
# Exercise 17: UPPER

**Task**:
Convert the name in cell **A2** to **ALL UPPERCASE**.

**Syntax**:
\`=UPPER(text_cell)\`
      `,
      initialSheet: TEXT_DATA,
      goal: 'Convert A2 to Uppercase in B2.',
      targetCell: 'B2',
      expectedValue: 'JOHN DOE',
      expectedFormula: 'UPPER',
      solutionFormula: '=UPPER(A2)'
  },
  {
      id: 'func-lower',
      title: 'Ex 18: LOWER Case',
      description: 'Convert text to all lowercase.',
      category: 'practice',
      content: `
# Exercise 18: LOWER

**Task**:
Convert the text in cell **A3** to **all lowercase**.

**Syntax**:
\`=LOWER(text_cell)\`
      `,
      initialSheet: TEXT_DATA,
      goal: 'Convert A3 to Lowercase in B3.',
      targetCell: 'B3',
      expectedValue: 'report_final',
      expectedFormula: 'LOWER',
      solutionFormula: '=LOWER(A3)'
  },
  {
      id: 'func-left',
      title: 'Ex 19: LEFT Function',
      description: 'Extract text from the beginning.',
      category: 'practice',
      content: `
# Exercise 19: LEFT

**Task**:
Extract the first **2 characters** from the ID in cell **A4**.

**Syntax**:
\`=LEFT(text, number_of_chars)\`
      `,
      initialSheet: TEXT_DATA,
      goal: 'Extract first 2 chars of A4 in B4.',
      targetCell: 'B4',
      expectedValue: 'ID',
      expectedFormula: 'LEFT',
      solutionFormula: '=LEFT(A4, 2)'
  },
  {
      id: 'func-right',
      title: 'Ex 20: RIGHT Function',
      description: 'Extract text from the end.',
      category: 'practice',
      content: `
# Exercise 20: RIGHT

**Task**:
Extract the **last character** from the ID in cell **A4**.

**Syntax**:
\`=RIGHT(text, number_of_chars)\`
      `,
      initialSheet: TEXT_DATA,
      goal: 'Extract last 1 char of A4 in B4.',
      targetCell: 'B4',
      expectedValue: 'X',
      expectedFormula: 'RIGHT',
      solutionFormula: '=RIGHT(A4, 1)'
  },
  
  // --- ADVANCED PRACTICE ---
  {
      id: 'adv-commission',
      title: 'Ex 21: Commission (IF + Math)',
      description: 'Calculate commission based on sales threshold.',
      category: 'practice',
      content: `
# Exercise 21: Commission Calculation

**Task**:
Calculate the commission for **Alex** in cell **C2**.
* If Sales are **greater than 1000**, the commission is **10% of Sales**.
* Otherwise, the commission is **0**.

**Hint**:
You can perform math inside the IF function.
\`=IF(Sales > 1000, Sales * 0.1, 0)\`
      `,
      initialSheet: COMMISSION_DATA,
      goal: 'Calculate Alex\'s commission in C2.',
      targetCell: 'C2',
      expectedValue: 120,
      expectedFormula: 'IF',
      solutionFormula: '=IF(B2>1000, B2*0.1, 0)'
  },
  {
      id: 'adv-nested-if',
      title: 'Ex 22: Nested IF (Grading)',
      description: 'Assign grades A, B, or C based on score.',
      category: 'practice',
      content: `
# Exercise 22: Nested IFs

**Task**:
Assign a Grade for **Tyke** (Row 5) in cell **C5**.
* If Score is **>= 90**, return "**A**".
* If Score is **>= 80**, return "**B**".
* Otherwise, return "**C**".

**Syntax**:
\`=IF(condition1, "A", IF(condition2, "B", "C"))\`
      `,
      initialSheet: GRADES_DATA,
      goal: 'Calculate Grade for Tyke in C5.',
      targetCell: 'C5',
      expectedValue: 'A',
      expectedFormula: 'IF',
      solutionFormula: '=IF(B5>=90, "A", IF(B5>=80, "B", "C"))'
  },
  {
      id: 'adv-concat-lookup',
      title: 'Ex 23: Dynamic Report (CONCAT)',
      description: 'Combine text with a lookup result.',
      category: 'practice',
      content: `
# Exercise 23: Dynamic Text

**Task**:
In cell **D2**, create a message that says: "**Manager: [Last Name]**".
You must use **XLOOKUP** to find the Last Name of the employee with ID **E01** (John).

**Syntax**:
Nest your XLOOKUP inside the CONCAT function.
\`=CONCAT("Manager: ", XLOOKUP(...))\`
      `,
      initialSheet: {
          ...EMPLOYEE_DATA,
          'D1': { value: 'Report', formula: '', style: { bold: true } },
      },
      goal: 'Create message "Manager: Doe" in D2.',
      targetCell: 'D2',
      expectedValue: 'Manager: Doe',
      expectedFormula: 'CONCAT',
      solutionFormula: '=CONCAT("Manager: ", XLOOKUP("E01", C2:C4, B2:B4))'
  },
  {
      id: 'adv-discount',
      title: 'Ex 24: Bulk Discount',
      description: 'Apply discount if quantity is high.',
      category: 'practice',
      content: `
# Exercise 24: Bulk Discount

**Task**:
Calculate the **Final Price** in cell **D2**.
* If **Quantity** is **greater than 10**, the price is **90%** of the Unit Price (Price * 0.9).
* Otherwise, it is just the **Unit Price**.

**Hint**:
\`=IF(Qty > 10, Price * 0.9, Price)\`
      `,
      initialSheet: DISCOUNT_DATA,
      goal: 'Calculate discounted price in D2.',
      targetCell: 'D2',
      expectedValue: 1.8,
      expectedFormula: 'IF',
      solutionFormula: '=IF(B2>10, C2*0.9, C2)'
  },
  {
      id: 'adv-driver',
      title: 'Ex 25: Driver Logic',
      description: 'Complex logic checking Age and Licence.',
      category: 'practice',
      content: `
# Exercise 25: Driver Status

**Task**:
Determine the status for the **Adult** (Row 4) in cell **D4**.
Rules:
1. If Age is **less than 18**, return "**Too Young**".
2. If Age is 18+, check **Licence**. If "Yes", return "**Drive**", else "**No Licence**".

**Syntax**:
\`=IF(Age < 18, "Too Young", IF(Licence="Yes", "Drive", "No Licence"))\`
      `,
      initialSheet: DRIVER_DATA,
      goal: 'Determine status for Adult in D4.',
      targetCell: 'D4',
      expectedValue: 'Drive',
      expectedFormula: 'IF',
      solutionFormula: '=IF(B4<18, "Too Young", IF(C4="Yes", "Drive", "No Licence"))'
  }
];