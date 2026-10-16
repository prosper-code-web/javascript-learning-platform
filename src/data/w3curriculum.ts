export interface Lesson {
  id: string;
  categoryId: string;
  categoryTitle: string;
  title: string;
  shortDesc: string;
  theory: string;
  syntaxSnippets: {
    title: string;
    code: string;
    explanation: string;
  }[];
  tryItStarterCode: string;
  exercise: {
    instruction: string;
    starterCode: string;
    solutionCode: string;
    hint: string;
    validate: (code: string, logs: string[]) => { passed: boolean; message: string };
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  visualType: 'array' | 'variable' | 'logic' | 'function' | 'object' | 'async' | 'dom';
}

export interface Category {
  id: string;
  title: string;
  iconName: string;
  description: string;
  lessons: Lesson[];
}

export const W3_CURRICULUM: Category[] = [
  {
    id: 'js-basics',
    title: '1. JS Basics & Syntax',
    iconName: 'Sparkles',
    description: 'Core building blocks: how JavaScript executes, syntax rules, variables, and primitive types.',
    lessons: [
      {
        id: 'js-intro',
        categoryId: 'js-basics',
        categoryTitle: '1. JS Basics & Syntax',
        title: 'JavaScript Introduction & Execution',
        shortDesc: 'What JavaScript is, how browsers run it, and its role as the engine of web interactivity.',
        theory: `JavaScript is the world's most popular lightweight, interpreted (or JIT-compiled) programming language with first-class functions.
Alongside HTML (which defines content structure) and CSS (which controls styling and presentation), JavaScript brings dynamic behavior, calculation, user interaction, and data fetching to applications.

Key Characteristics of JavaScript:
1. Dynamic & Weakly Typed: Variables are not bound to a fixed type; types are inferred at runtime.
2. Single-Threaded Event Loop: Executes code line by line with a non-blocking asynchronous event loop.
3. Multi-Paradigm: Supports object-oriented, imperative, and functional programming styles.`,
        syntaxSnippets: [
          {
            title: 'Printing to the Console',
            code: `console.log("Hello, World!");\nconsole.info("System operational");\nconsole.warn("Low memory warning");\nconsole.error("Critical failure detected");`,
            explanation: 'The console object provides access to the browser debugging console. console.log() is your primary tool for inspecting values.',
          },
        ],
        tryItStarterCode: `// Try running your first JavaScript code:\nconst greeting = "Welcome to JavaScript!";\nconst year = 2026;\n\nconsole.log(greeting);\nconsole.log("Current Year:", year);\nconsole.log("Ready to learn everything in JS!");`,
        exercise: {
          instruction: 'Declare a message variable with the text "Hello JS Lab" and log it using console.log().',
          starterCode: `// Write your code below:\nlet message = "Hello JS Lab";\nconsole.log(message);`,
          solutionCode: `let message = "Hello JS Lab";\nconsole.log(message);`,
          hint: 'Use let message = "Hello JS Lab"; and console.log(message);',
          validate: (code, logs) => {
            const hasLog = logs.some((l) => l.includes('Hello JS Lab'));
            if (hasLog) return { passed: true, message: 'Great job! You logged "Hello JS Lab" to the terminal.' };
            return { passed: false, message: 'Please ensure your output includes "Hello JS Lab".' };
          },
        },
        quiz: {
          question: 'What is the primary role of JavaScript in web development?',
          options: ['Defining static document structure', 'Styling page layouts and fonts', 'Programming page logic, interactivity, and data flow', 'Configuring DNS routing'],
          correctIndex: 2,
          explanation: 'JavaScript powers the behavior, logic, and interactivity of web applications.',
        },
        visualType: 'variable',
      },
      {
        id: 'js-variables',
        categoryId: 'js-basics',
        categoryTitle: '1. JS Basics & Syntax',
        title: 'Variables: let, const, and var',
        shortDesc: 'How JavaScript allocates memory and the vital differences in scope, reassignment, and hoisting.',
        theory: `In modern JavaScript (ES6+), you declare variables using let and const. Avoid var in modern code due to its confusing function-scoping and hoisting rules.

1. "const": Block-scoped. Cannot be reassigned. Use const by default for variables, functions, arrays, and objects whose identifier should never be pointed to a new value.
2. "let": Block-scoped. Can be reassigned. Use let when you know the value needs to change over time (such as loop counters or state flags).
3. "var": Function-scoped or globally-scoped. Can be redeclared and reassigned. Suffers from hoisting with undefined. Avoid in modern code.`,
        syntaxSnippets: [
          {
            title: 'Declaring and Reassigning',
            code: `const maxSpeed = 300; // Locked in place\n// maxSpeed = 350; // TypeError: Assignment to constant variable.\n\nlet currentSpeed = 120;\ncurrentSpeed = 180; // Valid reassignment!\n\n// Block Scope example:\nif (true) {\n  let blockScoped = "Hidden inside this block";\n}\n// console.log(blockScoped); // ReferenceError: blockScoped is not defined`,
            explanation: 'Variables declared with let and const are strictly confined to the { curly braces } where they are declared.',
          },
        ],
        tryItStarterCode: `const labId = "LAB-700";\nlet powerLevel = 50;\n\nconsole.log(\`Station: \${labId}, Initial Power: \${powerLevel}%\`);\n\n// Increase power level:\npowerLevel += 25;\nconsole.log(\`Station: \${labId}, Boosted Power: \${powerLevel}%\`);`,
        exercise: {
          instruction: 'Create a const named "appName" set to "HoloLab" and a let named "version" set to 2. Log both.',
          starterCode: `const appName = "HoloLab";\nlet version = 2;\n\nconsole.log(\`\${appName} v\${version}\`);`,
          solutionCode: `const appName = "HoloLab";\nlet version = 2;\nconsole.log(\`\${appName} v\${version}\`);`,
          hint: 'Use const for appName and let for version.',
          validate: (code, logs) => {
            const passed = logs.some((l) => l.includes('HoloLab') && l.includes('2'));
            if (passed) return { passed: true, message: 'Variables correctly declared and logged!' };
            return { passed: false, message: 'Make sure your output prints "HoloLab" and "2".' };
          },
        },
        quiz: {
          question: 'What happens if you try to reassign a variable declared with "const"?',
          options: ['It silently updates', 'It throws a TypeError', 'It creates a new global variable', 'It converts to let'],
          correctIndex: 1,
          explanation: 'Reassigning a const identifier triggers a TypeError: Assignment to constant variable.',
        },
        visualType: 'variable',
      },
      {
        id: 'js-datatypes',
        categoryId: 'js-basics',
        categoryTitle: '1. JS Basics & Syntax',
        title: 'Data Types: Primitives vs Reference Types',
        shortDesc: 'Understand all 7 primitive types and reference types (Objects, Arrays, Functions).',
        theory: `JavaScript values belong to one of two major classifications:

1. Primitive Types (Stored directly on the stack by value, immutable):
   - string: Textual data ("hello", 'world', \`template\`)
   - number: 64-bit IEEE 754 floats (42, 3.14159, NaN, Infinity)
   - bigint: Arbitrary precision integers (9007199254740991n)
   - boolean: Logical true or false
   - undefined: Variable declared but has not been assigned a value
   - null: Explicit intentional absence of any object value
   - symbol: Unique and immutable primitive identifier

2. Reference Types (Stored on the heap, accessed by memory reference):
   - Object ({ key: value })
   - Array ([1, 2, 3])
   - Function (function() {})`,
        syntaxSnippets: [
          {
            title: 'Checking Types with typeof',
            code: `console.log(typeof "Ada");       // "string"\nconsole.log(typeof 42);          // "number"\nconsole.log(typeof true);        // "boolean"\nconsole.log(typeof undefined);   // "undefined"\nconsole.log(typeof null);        // "object" (famous historical JS quirk!)\nconsole.log(typeof [1, 2]);      // "object" (Arrays are objects!)\nconsole.log(Array.isArray([1])); // true`,
            explanation: 'The typeof operator returns a string indicating the type of the unevaluated operand.',
          },
        ],
        tryItStarterCode: `const dataSamples = [\n  "Text string",\n  100,\n  true,\n  null,\n  undefined,\n  { id: 1 },\n  [10, 20, 30]\n];\n\ndataSamples.forEach(val => {\n  console.log(\`Value: \${JSON.stringify(val)} -> Type: \${typeof val}\`);\n});`,
        exercise: {
          instruction: 'Use typeof to check the type of the boolean true and log the result.',
          starterCode: `const isReady = true;\nconsole.log(typeof isReady);`,
          solutionCode: `const isReady = true;\nconsole.log(typeof isReady);`,
          hint: 'console.log(typeof isReady) outputs "boolean".',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('boolean'))) {
              return { passed: true, message: 'Correct! typeof isReady is "boolean".' };
            }
            return { passed: false, message: 'Expected output to be "boolean".' };
          },
        },
        quiz: {
          question: 'What does typeof null evaluate to in JavaScript?',
          options: ['"null"', '"undefined"', '"object"', '"boolean"'],
          correctIndex: 2,
          explanation: 'In JavaScript, typeof null returns "object", which is a documented historical quirk from the first 1995 JS engine.',
        },
        visualType: 'variable',
      },
      {
        id: 'js-operators',
        categoryId: 'js-basics',
        categoryTitle: '1. JS Basics & Syntax',
        title: 'Operators & Strict Equality (=== vs ==)',
        shortDesc: 'Arithmetic, logical operators, truthy/falsy values, and why === is mandatory.',
        theory: `Operators allow you to perform computations, assign values, and evaluate logical conditions:

1. Arithmetic: + (addition/concatenation), - (subtraction), * (multiplication), / (division), % (modulo/remainder), ** (exponentiation)
2. Comparison:
   - === (Strict equality: checks value AND type without coercion)
   - !== (Strict inequality)
   - == (Loose equality: coerces types before checking - NEVER USE!)
3. Logical:
   - && (Logical AND: returns first falsy value or last value)
   - || (Logical OR: returns first truthy value or last value)
   - ! (Logical NOT: inverts truthiness)
   - ?? (Nullish Coalescing: returns right side only if left is null or undefined)
4. Falsy Values in JS: false, 0, -0, "" (empty string), null, undefined, NaN. Everything else is truthy!`,
        syntaxSnippets: [
          {
            title: 'Strict Equality vs Type Coercion',
            code: `5 === 5;     // true\n5 === "5";   // false! Number !== String\n5 == "5";    // true (danger! Coerces string "5" into number 5)\n\n0 === false; // false\n0 == false;  // true (type coercion!)`,
            explanation: 'Always use === and !==. Loose equality == creates subtle and dangerous bugs.',
          },
        ],
        tryItStarterCode: `console.log("Strict test 10 === 10:", 10 === 10);\nconsole.log("Strict test 10 === '10':", 10 === "10");\n\n// Logical operators:\nconst hasTicket = true;\nconst hasBadge = false;\n\nconsole.log("Can enter (hasTicket && hasBadge)?", hasTicket && hasBadge);\nconsole.log("Can enter (hasTicket || hasBadge)?", hasTicket || hasBadge);`,
        exercise: {
          instruction: 'Compare 42 to "42" using strict inequality !== and log the boolean result.',
          starterCode: `const num = 42;\nconst str = "42";\nconsole.log(num !== str);`,
          solutionCode: `console.log(42 !== "42");`,
          hint: '42 !== "42" will log true because their data types differ.',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('true'))) {
              return { passed: true, message: 'Correct! 42 !== "42" evaluates to true.' };
            }
            return { passed: false, message: 'Expected output to be true.' };
          },
        },
        quiz: {
          question: 'Which of the following is considered a falsy value in JavaScript?',
          options: ['"0"', '[]', '0', '{}'],
          correctIndex: 2,
          explanation: 'The number 0 is falsy. Non-empty string "0", empty array [], and empty object {} are all truthy!',
        },
        visualType: 'logic',
      },
    ],
  },
  {
    id: 'js-strings',
    title: '2. Strings in Depth',
    iconName: 'Type',
    description: 'String manipulation, template literals, indexing, searching, and transformations.',
    lessons: [
      {
        id: 'string-methods',
        categoryId: 'js-strings',
        categoryTitle: '2. Strings in Depth',
        title: 'String Methods: Search, Slice & Replace',
        shortDesc: 'Master length, slice(), substring(), replace(), toUpperCase(), trim(), split(), and includes().',
        theory: `Strings in JavaScript are indexed, immutable sequences of UTF-16 code units.

Top String Methods:
1. "length": Property returning character count.
2. "slice(start, end)": Extracts a section from start up to (not including) end. Supports negative indices!
3. "substring(start, end)": Similar to slice, but treats negative numbers as 0.
4. "replace(search, replacement)": Replaces first match. Use replaceAll() to replace all matches.
5. "toUpperCase()" / "toLowerCase()": Transforms letter case.
6. "trim()": Strips whitespace from both ends. trimStart() / trimEnd() for single sides.
7. "split(delimiter)": Splits string into an Array of substrings!
8. "includes(sub)", "startsWith(sub)", "endsWith(sub)": Boolean checks.
9. "indexOf(sub)": Finds index of first occurrence (-1 if not found).`,
        syntaxSnippets: [
          {
            title: 'Common String Operations',
            code: `const text = "  JavaScript Lab Space  ";\nconsole.log(text.trim());                  // "JavaScript Lab Space"\nconsole.log(text.trim().slice(0, 10));     // "JavaScript"\nconsole.log(text.includes("Lab"));         // true\nconsole.log(text.replace("Space", "Core"));// "  JavaScript Lab Core  "\n\nconst parts = "apple,banana,orange".split(",");\nconsole.log(parts); // ["apple", "banana", "orange"]`,
            explanation: 'Remember: strings are immutable. All string methods return a brand new string and never modify the original.',
          },
        ],
        tryItStarterCode: `const mission = "Apollo Quantum Orbit";\n\nconsole.log("Length:", mission.length);\nconsole.log("Upper Case:", mission.toUpperCase());\nconsole.log("First Word:", mission.slice(0, 6));\nconsole.log("Has 'Quantum'?:", mission.includes("Quantum"));\nconsole.log("Replaced:", mission.replace("Apollo", "Artemis"));`,
        exercise: {
          instruction: 'Take the string "javascript", capitalize it using toUpperCase(), and log it.',
          starterCode: `const lang = "javascript";\nconsole.log(lang.toUpperCase());`,
          solutionCode: `const lang = "javascript";\nconsole.log(lang.toUpperCase());`,
          hint: 'Call lang.toUpperCase() and log the output.',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('JAVASCRIPT'))) {
              return { passed: true, message: 'Excellent! "JAVASCRIPT" produced.' };
            }
            return { passed: false, message: 'Expected output "JAVASCRIPT".' };
          },
        },
        quiz: {
          question: 'What does "code".slice(1, 3) return?',
          options: ['"co"', '"od"', '"ode"', '"code"'],
          correctIndex: 1,
          explanation: 'Index 1 is "o", index 2 is "d", and index 3 is not included. So "od".',
        },
        visualType: 'variable',
      },
    ],
  },
  {
    id: 'js-numbers-math',
    title: '3. Numbers, Math & Randomness',
    iconName: 'Calculator',
    description: 'Precision math, conversions, toFixed(), Math object methods, and generating random numbers.',
    lessons: [
      {
        id: 'math-random-methods',
        categoryId: 'js-numbers-math',
        categoryTitle: '3. Numbers, Math & Randomness',
        title: 'Math Object, toFixed() & Random Generators',
        shortDesc: 'Understand Math.floor, Math.round, Math.ceil, Math.random(), and formatting decimals.',
        theory: `The Math built-in object provides mathematical properties and constants, plus helper methods for calculation and games.

Key Methods:
1. "Math.floor(x)": Rounds DOWN to nearest integer (e.g. 4.9 -> 4).
2. "Math.ceil(x)": Rounds UP to nearest integer (e.g. 4.1 -> 5).
3. "Math.round(x)": Rounds to nearest integer.
4. "Math.max(...nums)" & "Math.min(...nums)": Returns largest or smallest.
5. "Math.random()": Returns a float between 0 (inclusive) and 1 (exclusive).
   - Random integer between min and max:
     Math.floor(Math.random() * (max - min + 1)) + min;
6. "num.toFixed(digits)": Formats a number with fixed decimal places as a STRING. (e.g. (3.14159).toFixed(2) -> "3.14").
7. "parseInt(str)" & "parseFloat(str)": Converts strings to numbers.`,
        syntaxSnippets: [
          {
            title: 'Dice Roll & Decimals',
            code: `// Roll a 6-sided die:\nconst roll = Math.floor(Math.random() * 6) + 1;\nconsole.log("Die Roll:", roll);\n\n// Currency rounding:\nconst total = 19.99 * 1.08;\nconsole.log("$" + total.toFixed(2)); // "$21.59"`,
            explanation: 'Math.floor with Math.random() is the universal pattern for random numbers in JavaScript.',
          },
        ],
        tryItStarterCode: `const random1to100 = Math.floor(Math.random() * 100) + 1;\nconsole.log("Random Score:", random1to100);\n\nconsole.log("Floor 7.9:", Math.floor(7.9));\nconsole.log("Ceil 7.1:", Math.ceil(7.1));\nconsole.log("Max of (5, 99, 12):", Math.max(5, 99, 12));`,
        exercise: {
          instruction: 'Use Math.floor on the number 9.85 and log the resulting integer.',
          starterCode: `const num = 9.85;\nconsole.log(Math.floor(num));`,
          solutionCode: `console.log(Math.floor(9.85));`,
          hint: 'Math.floor(9.85) evaluates to 9.',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('9') && !l.includes('9.85'))) {
              return { passed: true, message: 'Correct! Math.floor rounded 9.85 down to 9.' };
            }
            return { passed: false, message: 'Expected output 9.' };
          },
        },
        quiz: {
          question: 'What does Math.floor(Math.random() * 10) generate?',
          options: ['An integer from 1 to 10', 'An integer from 0 to 9', 'A float from 0 to 10', 'A boolean'],
          correctIndex: 1,
          explanation: 'Math.random() generates 0 to <1. Multiplied by 10 gives 0 to <10, and Math.floor truncates to 0 through 9.',
        },
        visualType: 'variable',
      },
    ],
  },
  {
    id: 'js-control-flow',
    title: '4. Conditionals & Loops',
    iconName: 'GitBranch',
    description: 'Control flow: if/else, switch statements, for loops, for...of, for...in, while, break & continue.',
    lessons: [
      {
        id: 'loops-and-switch',
        categoryId: 'js-control-flow',
        categoryTitle: '4. Conditionals & Loops',
        title: 'Loops (for, for...of, while) & switch Statements',
        shortDesc: 'Automate tasks with loops, iterate collections with for...of, and cleanly branch with switch.',
        theory: `Loops and conditionals govern the execution path of your algorithms:

1. "for (let i = 0; i < N; i++)":
   - The classic index-based loop. Ideal when you need the counter index.

2. "for...of":
   - The modern, clean way to loop over iterables (Arrays, Strings, Maps, Sets).
   - Example: for (const item of items) { console.log(item); }

3. "for...in":
   - Loops over the enumerable property keys of an OBJECT.
   - Example: for (const key in user) { console.log(key, user[key]); }

4. "while (condition)":
   - Executes as long as the condition remains true. Be careful to increment counter to avoid infinite loops!

5. "switch (value)":
   - Clean alternative to nested if/else if chains. Always remember to "break;" each case!`,
        syntaxSnippets: [
          {
            title: 'for...of vs switch statement',
            code: `// for...of loop:\nconst ranks = ["Cadet", "Officer", "Commander"];\nfor (const rank of ranks) {\n  console.log("Rank:", rank);\n}\n\n// switch statement:\nconst status = "online";\nswitch (status) {\n  case "online":\n    console.log("System Active");\n    break;\n  case "offline":\n    console.log("System Sleeping");\n    break;\n  default:\n    console.log("Unknown status");\n}`,
            explanation: 'Use for...of for arrays and switch for multi-value branching.',
          },
        ],
        tryItStarterCode: `// Loop counting up:\nlet total = 0;\nfor (let i = 1; i <= 5; i++) {\n  total += i;\n  console.log(\`Step \${i}: Total is now \${total}\`);\n}\n\n// for...of over words:\nconst fruits = ["Apple", "Banana", "Cherry"];\nfor (const fruit of fruits) {\n  console.log("Fruit:", fruit.toUpperCase());\n}`,
        exercise: {
          instruction: 'Write a for loop that calculates the sum of numbers from 1 to 4 (1 + 2 + 3 + 4 = 10) and logs the final sum.',
          starterCode: `let sum = 0;\nfor (let i = 1; i <= 4; i++) {\n  sum += i;\n}\nconsole.log("Final Sum:", sum);`,
          solutionCode: `let sum = 0;\nfor (let i = 1; i <= 4; i++) sum += i;\nconsole.log(sum);`,
          hint: 'The loop runs for i = 1, 2, 3, 4, giving 10.',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('10'))) {
              return { passed: true, message: 'Loop sum of 10 computed and logged!' };
            }
            return { passed: false, message: 'Expected output to include 10.' };
          },
        },
        quiz: {
          question: 'What happens if you omit the "break;" keyword inside a switch case?',
          options: ['SyntaxError', 'Execution "falls through" into the next case', 'The script terminates', 'The switch restarts'],
          correctIndex: 1,
          explanation: 'Without break;, JavaScript falls through and executes subsequent cases regardless of their condition.',
        },
        visualType: 'logic',
      },
    ],
  },
  {
    id: 'js-arrays-masterclass',
    title: '5. Arrays Masterclass (All Methods)',
    iconName: 'ListOrdered',
    description: 'The most comprehensive guide to every single JavaScript array method and manipulation pattern.',
    lessons: [
      {
        id: 'array-basics-mutators',
        categoryId: 'js-arrays-masterclass',
        categoryTitle: '5. Arrays Masterclass (All Methods)',
        title: 'Adding, Removing & Splicing (push, pop, shift, unshift, splice)',
        shortDesc: 'Master array length, push, pop, shift, unshift, and splice vs toSpliced.',
        theory: `Arrays in JavaScript are ordered lists of values. In JavaScript, arrays can hold any mix of data types and resize automatically.

Core Mutating Methods:
1. "push(...items)": Appends items to the END. Returns new array length.
2. "pop()": Removes the LAST item. Returns the removed item.
3. "unshift(...items)": Adds items to the BEGINNING. Shifts all other items right. Returns new length.
4. "shift()": Removes the FIRST item. Shifts remaining items left. Returns removed item.
5. "splice(start, deleteCount, ...items)": The Swiss Army knife! Can delete, replace, or insert items at ANY index. Modifies original array in place!
6. "toSpliced(start, deleteCount, ...items)": Modern ES2023 immutable alternative to splice (returns a copy, leaving original untouched).`,
        syntaxSnippets: [
          {
            title: 'Push, Pop, Shift, Unshift',
            code: `const tools = ["Laser", "Scanner"];\n\ntools.push("Wrench"); // ["Laser", "Scanner", "Wrench"]\nconst last = tools.pop(); // Removes "Wrench"\n\ntools.unshift("Reactor"); // ["Reactor", "Laser", "Scanner"]\nconst first = tools.shift(); // Removes "Reactor"\n\n// Splice: delete 1 item at index 1 and insert "Beacon":\ntools.splice(1, 1, "Beacon");`,
            explanation: 'push/pop are fast O(1) operations. shift/unshift require re-indexing elements O(n).',
          },
        ],
        tryItStarterCode: `const stack = ["A", "B", "C"];\nconsole.log("Initial:", stack);\n\nstack.push("D");\nconsole.log("After push('D'):", stack);\n\nconst removedEnd = stack.pop();\nconsole.log("Popped:", removedEnd, "-> Result:", stack);\n\nstack.unshift("Z");\nconsole.log("After unshift('Z'):", stack);`,
        exercise: {
          instruction: 'Start with array [1, 2, 3]. Use push to add 4, then pop to remove it, and log the final array.',
          starterCode: `const numbers = [1, 2, 3];\nnumbers.push(4);\nnumbers.pop();\nconsole.log(numbers);`,
          solutionCode: `const numbers = [1, 2, 3];\nnumbers.push(4);\nnumbers.pop();\nconsole.log(numbers);`,
          hint: 'numbers.push(4) adds 4, numbers.pop() removes it.',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('1') && l.includes('2') && l.includes('3') && !l.includes('4'))) {
              return { passed: true, message: 'Perfect! Array was mutated and restored to [1, 2, 3].' };
            }
            return { passed: false, message: 'Final array should be [1, 2, 3].' };
          },
        },
        quiz: {
          question: 'Which method removes the FIRST element of an array?',
          options: ['pop()', 'shift()', 'unshift()', 'splice()'],
          correctIndex: 1,
          explanation: 'shift() removes the first item from index 0 and shifts all other elements down.',
        },
        visualType: 'array',
      },
      {
        id: 'array-search-slice',
        categoryId: 'js-arrays-masterclass',
        categoryTitle: '5. Arrays Masterclass (All Methods)',
        title: 'Searching & Extracting (includes, indexOf, find, slice, flat)',
        shortDesc: 'Deep dive into includes, indexOf, lastIndexOf, find, findIndex, slice, concat, and flat.',
        theory: `Searching and extracting data from arrays without mutating the source is a daily task in modern JavaScript:

Search Methods:
1. "includes(value)": Returns true/false if value exists (uses strict equality).
2. "indexOf(value)": Returns index of first match, or -1 if not found.
3. "lastIndexOf(value)": Searches from end to start.
4. "find(callback)": Returns the FIRST element that satisfies the test function, or undefined.
5. "findIndex(callback)": Returns index of first matching element, or -1.
6. "findLast(callback)" & "findLastIndex()": ES2023 methods that search from right to left.

Extraction & Combination:
1. "slice(start, end)": Shallow-copies elements from start up to (not including) end.
2. "concat(...arrays)": Merges two or more arrays into a new array.
3. "flat(depth)": Flattens nested sub-arrays into a single-level array (e.g. [[1], [2]].flat() -> [1, 2]).`,
        syntaxSnippets: [
          {
            title: 'find() vs includes() vs slice()',
            code: `const users = [\n  { id: 1, name: "Ada", role: "admin" },\n  { id: 2, name: "Bob", role: "user" }\n];\n\n// find() matching object:\nconst admin = users.find(u => u.role === "admin");\nconsole.log(admin.name); // "Ada"\n\n// slice() sub-array:\nconst letters = ["A", "B", "C", "D"];\nconsole.log(letters.slice(1, 3)); // ["B", "C"]\n\n// flat() nested arrays:\nconst nested = [1, [2, [3, 4]]];\nconsole.log(nested.flat(2)); // [1, 2, 3, 4]`,
            explanation: 'find() takes a predicate function and returns the first matching item, while slice() produces non-destructive slices.',
          },
        ],
        tryItStarterCode: `const inventory = [\n  { item: "Battery", power: 90 },\n  { item: "Sensor", power: 45 },\n  { item: "Reactor", power: 100 }\n];\n\nconst highPowerItem = inventory.find(i => i.power >= 95);\nconsole.log("Top Component:", highPowerItem);\n\nconst names = ["Alpha", "Beta", "Gamma"];\nconsole.log("Has 'Beta'?:", names.includes("Beta"));\nconsole.log("Slice first 2:", names.slice(0, 2));`,
        exercise: {
          instruction: 'Given array ["Mercury", "Venus", "Earth", "Mars"], find the index of "Earth" using indexOf() and log it.',
          starterCode: `const planets = ["Mercury", "Venus", "Earth", "Mars"];\nconst earthIndex = planets.indexOf("Earth");\nconsole.log("Earth Index:", earthIndex);`,
          solutionCode: `const planets = ["Mercury", "Venus", "Earth", "Mars"];\nconsole.log(planets.indexOf("Earth"));`,
          hint: 'planets.indexOf("Earth") returns 2.',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('2'))) {
              return { passed: true, message: 'Correct! Earth is at index 2.' };
            }
            return { passed: false, message: 'Expected output to be 2.' };
          },
        },
        quiz: {
          question: 'What does array.includes("test") return if "test" is not in the array?',
          options: ['-1', 'undefined', 'false', 'null'],
          correctIndex: 2,
          explanation: 'includes() strictly returns a boolean: true if found, false otherwise.',
        },
        visualType: 'array',
      },
      {
        id: 'array-iteration-functional',
        categoryId: 'js-arrays-masterclass',
        categoryTitle: '5. Arrays Masterclass (All Methods)',
        title: 'Functional Iteration (.map, .filter, .reduce, .forEach)',
        shortDesc: 'Master the core functional programming array methods that power modern JavaScript and React.',
        theory: `Modern JavaScript emphasizes declarative, functional data transformation over manual for-loops.

1. ".map(callback)":
   - Transforms every element and returns a BRAND NEW array of the exact same length.
   - Example: [1, 2, 3].map(n => n * 2) -> [2, 4, 6]

2. ".filter(callback)":
   - Tests every element; items returning truthy are kept in a new array.
   - Example: [10, 25, 5].filter(n => n > 8) -> [10, 25]

3. ".reduce(callback, initialValue)":
   - Reduces an entire array down to a single value (sum, object, tally).
   - Callback parameters: (accumulator, currentValue, index, array).
   - Example: [1, 2, 3].reduce((acc, curr) => acc + curr, 0) -> 6

4. ".forEach(callback)":
   - Executes a side-effect for every element. Returns undefined. Does NOT return a new array!

5. ".every(callback)" & ".some(callback)":
   - .every() checks if ALL items pass the test.
   - .some() checks if AT LEAST ONE item passes the test.`,
        syntaxSnippets: [
          {
            title: 'Chaining Map, Filter, and Reduce',
            code: `const numbers = [1, 2, 3, 4, 5, 6];\n\n// Double only the even numbers and sum them:\nconst sumDoubledEvens = numbers\n  .filter(n => n % 2 === 0)      // [2, 4, 6]\n  .map(n => n * 2)               // [4, 8, 12]\n  .reduce((sum, n) => sum + n, 0); // 24\n\nconsole.log(sumDoubledEvens); // 24`,
            explanation: 'Method chaining allows expressive, declarative data processing pipelines.',
          },
        ],
        tryItStarterCode: `const scores = [85, 92, 45, 78, 99, 61];\n\n// 1. Filter passing scores (>= 70):\nconst passing = scores.filter(s => s >= 70);\nconsole.log("Passing Scores:", passing);\n\n// 2. Add bonus points to each (+5):\nconst boosted = passing.map(s => s + 5);\nconsole.log("Boosted:", boosted);\n\n// 3. Compute class average:\nconst total = boosted.reduce((acc, val) => acc + val, 0);\nconsole.log("Average:", Math.round(total / boosted.length));`,
        exercise: {
          instruction: 'Use .map() on array [2, 4, 6] to triple each number, and log the resulting array.',
          starterCode: `const original = [2, 4, 6];\nconst tripled = original.map(n => n * 3);\nconsole.log(tripled);`,
          solutionCode: `const original = [2, 4, 6];\nconst tripled = original.map(n => n * 3);\nconsole.log(tripled);`,
          hint: 'Use original.map(n => n * 3) to get [6, 12, 18].',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('6') && l.includes('12') && l.includes('18'))) {
              return { passed: true, message: 'Excellent! [6, 12, 18] produced.' };
            }
            return { passed: false, message: 'Result should be [6, 12, 18].' };
          },
        },
        quiz: {
          question: 'What does .map() return?',
          options: ['The same array mutated in-place', 'A new array of the same length with transformed elements', 'A boolean', 'undefined'],
          correctIndex: 1,
          explanation: '.map() returns a brand-new array containing the results of calling the function on every item.',
        },
        visualType: 'array',
      },
      {
        id: 'array-sorting-advanced',
        categoryId: 'js-arrays-masterclass',
        categoryTitle: '5. Arrays Masterclass (All Methods)',
        title: 'Sorting & Reversing (sort, toSorted, reverse, toReversed)',
        shortDesc: 'Understand lexicographical vs numerical sorting, comparator functions, and immutable sorting.',
        theory: `One of the most famous JavaScript gotchas is array.sort()!

1. The Default Sort Gotcha:
   - By default, array.sort() converts all elements to STRINGS and compares their UTF-16 code units.
   - Result: [10, 5, 20].sort() becomes [10, 20, 5] because "10" comes before "5"!

2. Numeric Comparator Function:
   - To sort numbers ascending: array.sort((a, b) => a - b)
   - If (a - b) is negative, "a" comes first.
   - If (a - b) is positive, "b" comes first.
   - To sort numbers descending: array.sort((a, b) => b - a)

3. Modern Non-Mutating Alternatives (ES2023):
   - "toSorted(comparator)": Returns a new sorted array without mutating the original.
   - "toReversed()": Returns a new reversed array without mutating the original.`,
        syntaxSnippets: [
          {
            title: 'Sorting Numbers and Objects',
            code: `const prices = [100, 25, 450, 10];\n// Correct numerical ascending sort:\nprices.sort((a, b) => a - b);\nconsole.log(prices); // [10, 25, 100, 450]\n\n// Sorting objects by property:\nconst crew = [{ age: 30 }, { age: 22 }, { age: 45 }];\ncrew.sort((a, b) => a.age - b.age);`,
            explanation: 'Always supply a comparator function when sorting numbers or objects.',
          },
        ],
        tryItStarterCode: `const data = [100, 5, 25, 1, 90];\nconsole.log("Default alphabetical sort:", [...data].sort());\nconsole.log("Numeric ascending sort:", [...data].sort((a, b) => a - b));\nconsole.log("Numeric descending sort:", [...data].sort((a, b) => b - a));`,
        exercise: {
          instruction: 'Sort the array [50, 12, 88, 3] in ascending order using (a, b) => a - b and log it.',
          starterCode: `const nums = [50, 12, 88, 3];\nnums.sort((a, b) => a - b);\nconsole.log(nums);`,
          solutionCode: `const nums = [50, 12, 88, 3];\nnums.sort((a, b) => a - b);\nconsole.log(nums);`,
          hint: 'nums.sort((a, b) => a - b) sorts numerically to [3, 12, 50, 88].',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('3') && l.includes('12') && l.includes('50') && l.includes('88'))) {
              return { passed: true, message: 'Sorted properly in numeric order!' };
            }
            return { passed: false, message: 'Array should be [3, 12, 50, 88].' };
          },
        },
        quiz: {
          question: 'What does [10, 5, 1].sort() output without a comparator function?',
          options: ['[1, 5, 10]', '[1, 10, 5]', '[10, 5, 1]', '[5, 1, 10]'],
          correctIndex: 1,
          explanation: 'Default sort converts elements to strings. String "1" < "10" < "5", yielding [1, 10, 5].',
        },
        visualType: 'array',
      },
    ],
  },
  {
    id: 'js-objects',
    title: '6. Objects & Classes',
    iconName: 'Box',
    description: 'Object properties, methods, Object static methods, destructuring, and classes.',
    lessons: [
      {
        id: 'objects-methods',
        categoryId: 'js-objects',
        categoryTitle: '6. Objects & Classes',
        title: 'Object Anatomy, "this", & Object Static Methods',
        shortDesc: 'Keys, values, dot vs bracket notation, methods, this, Object.keys(), Object.values(), and Object.entries().',
        theory: `Objects are key-value dictionaries and the cornerstone of data organization in JavaScript.

Accessing Properties:
1. Dot notation: object.propName (must be a valid identifier).
2. Bracket notation: object["propName"] (allows dynamic keys and spaces).

The "this" Keyword:
Inside a normal function method belonging to an object, "this" refers to the object itself. In arrow functions, "this" is lexically bound to the enclosing execution context!

Object Static Methods:
1. Object.keys(obj): Returns array of all string property keys.
2. Object.values(obj): Returns array of all property values.
3. Object.entries(obj): Returns array of [key, value] pairs.
4. Object.assign(target, ...sources): Copies properties.
5. Object.freeze(obj): Prevents any modification to properties.`,
        syntaxSnippets: [
          {
            title: 'Object Methods and Object.entries',
            code: `const robot = {\n  model: "Titan",\n  battery: 80,\n  charge(amount) {\n    this.battery = Math.min(100, this.battery + amount);\n    return \`Battery at \${this.battery}%\`;\n  }\n};\n\nconsole.log(robot.charge(15)); // "Battery at 95%"\nconsole.log(Object.keys(robot)); // ["model", "battery", "charge"]`,
            explanation: 'Object.entries() and Object.keys() provide simple access to iterate over object contents.',
          },
        ],
        tryItStarterCode: `const ship = {\n  name: "Voyager",\n  warpSpeed: 8,\n  shieldsUp: true,\n  describe() {\n    return \`Ship \${this.name} cruising at Warp \${this.warpSpeed}\`;\n  }\n};\n\nconsole.log(ship.describe());\nconsole.log("Keys:", Object.keys(ship));\nconsole.log("Values:", Object.values(ship));`,
        exercise: {
          instruction: 'Create an object "lab" with property "room: 404". Use Object.keys(lab) and log the keys array.',
          starterCode: `const lab = { room: 404 };\nconsole.log(Object.keys(lab));`,
          solutionCode: `const lab = { room: 404 };\nconsole.log(Object.keys(lab));`,
          hint: 'Object.keys(lab) will return ["room"].',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('room'))) {
              return { passed: true, message: 'Object.keys correctly returned ["room"]!' };
            }
            return { passed: false, message: 'Make sure you log Object.keys(lab).' };
          },
        },
        quiz: {
          question: 'What does Object.values({ a: 1, b: 2 }) return?',
          options: ['["a", "b"]', '[1, 2]', '[["a", 1], ["b", 2]]', '{ 1, 2 }'],
          correctIndex: 1,
          explanation: 'Object.values() returns an array containing all property values, here [1, 2].',
        },
        visualType: 'object',
      },
    ],
  },
  {
    id: 'js-functions',
    title: '7. Functions & Scope',
    iconName: 'Cpu',
    description: 'Declarations vs arrow functions, parameters, rest/spread, scope chain, and closures.',
    lessons: [
      {
        id: 'functions-arrows-scope',
        categoryId: 'js-functions',
        categoryTitle: '7. Functions & Scope',
        title: 'Arrow Functions, Rest Parameters & Closures',
        shortDesc: 'Understand function declarations, concise arrow functions, rest parameters (...args), and closures.',
        theory: `Functions are first-class citizens in JavaScript: they can be assigned to variables, passed as arguments, and returned from other functions.

1. Arrow Functions:
   - Concise syntax: const add = (a, b) => a + b;
   - Implicit return: If no curly braces {}, the expression is automatically returned.
   - Do NOT have their own "this", "arguments", or "super".

2. Default & Rest Parameters:
   - Default values: function greet(name = "Cadet") {}
   - Rest parameters: function sum(...numbers) { return numbers.reduce((a, b) => a + b, 0); }

3. Closures:
   - A closure is the combination of a function bundled together with references to its surrounding lexical state (variables).
   - A function remembers the variables from where it was created, even after the parent function has finished executing!`,
        syntaxSnippets: [
          {
            title: 'Closure Example: Counter Generator',
            code: `function createCounter() {\n  let count = 0; // Private state trapped in closure\n  return {\n    increment: () => ++count,\n    getCount: () => count\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter.increment()); // 1\nconsole.log(counter.increment()); // 2\nconsole.log(counter.getCount());  // 2`,
            explanation: 'createCounter encapsulates private state that cannot be modified directly from the outside.',
          },
        ],
        tryItStarterCode: `// Arrow function with rest parameters:\nconst calculateEnergy = (multiplier, ...readings) => {\n  const total = readings.reduce((a, b) => a + b, 0);\n  return total * multiplier;\n};\n\nconsole.log("Calculated:", calculateEnergy(2, 10, 20, 30));`,
        exercise: {
          instruction: 'Write an arrow function "square" that takes a number x and returns x * x. Call square(6) and log it.',
          starterCode: `const square = (x) => x * x;\nconsole.log(square(6));`,
          solutionCode: `const square = (x) => x * x;\nconsole.log(square(6));`,
          hint: 'square(6) should return 36.',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('36'))) {
              return { passed: true, message: 'Arrow function returned 36 correctly!' };
            }
            return { passed: false, message: 'Expected output 36.' };
          },
        },
        quiz: {
          question: 'What happens in an arrow function if you omit the curly braces around the body?',
          options: ['It throws a syntax error', 'It implicitly returns the evaluated expression', 'It returns undefined', 'It executes as an async function'],
          correctIndex: 1,
          explanation: 'Single-expression arrow functions without curly braces have an implicit return.',
        },
        visualType: 'function',
      },
    ],
  },
  {
    id: 'js-dom-events',
    title: '8. DOM Manipulation & Web Events',
    iconName: 'Layout',
    description: 'The Document Object Model: selecting elements, altering styles, event listeners, and creating HTML dynamically.',
    lessons: [
      {
        id: 'dom-basics-events',
        categoryId: 'js-dom-events',
        categoryTitle: '8. DOM Manipulation & Web Events',
        title: 'DOM Selectors, Modifying HTML & Event Listeners',
        shortDesc: 'How JavaScript bridges to the browser: querySelector, classList, textContent, and addEventListener.',
        theory: `The DOM (Document Object Model) represents an HTML document as a tree of objects. JavaScript can query, alter, add, and remove nodes in real-time!

1. Selecting Elements:
   - document.querySelector(cssSelector): Returns first matching element.
   - document.querySelectorAll(cssSelector): Returns a NodeList of all matches.
   - document.getElementById("id"): Fast single element selector.

2. Modifying Content & Styling:
   - element.textContent = "New text": Safe plain text injection.
   - element.innerHTML = "<span>HTML</span>": Parses HTML string (sanitize user input!).
   - element.classList.add("active"), .remove("hidden"), .toggle("dark"): Clean CSS class manipulation.
   - element.style.backgroundColor = "cyan": Inline style updates.

3. Event Listeners:
   - element.addEventListener("click", (event) => { ... })
   - Common events: "click", "input", "change", "keydown", "submit".
   - event.preventDefault(): Prevents browser default behavior (such as page reload on form submit).`,
        syntaxSnippets: [
          {
            title: 'Selecting and Wiring a Button',
            code: `// Grab button and display:\nconst btn = document.querySelector("#action-btn");\nconst display = document.querySelector("#status-output");\n\nbtn.addEventListener("click", (e) => {\n  display.textContent = "Button Clicked!";\n  display.classList.toggle("highlight");\n  console.log("Clicked at X:", e.clientX);\n});`,
            explanation: 'addEventListener is the foundation of every interactive web application.',
          },
        ],
        tryItStarterCode: `// Simulating DOM manipulation in JavaScript:\nconst mockElement = {\n  id: "hero-title",\n  textContent: "Welcome to JS Lab",\n  classList: new Set(["header", "dark"]),\n  style: { color: "white" },\n  addEventListener(evt, cb) {\n    console.log(\`[Listener Registered] Event '\${evt}' attached.\`);\n  }\n};\n\nconsole.log("Initial textContent:", mockElement.textContent);\nmockElement.textContent = "Updated via JavaScript DOM!";\nconsole.log("Updated textContent:", mockElement.textContent);\nmockElement.addEventListener("click", () => {});`,
        exercise: {
          instruction: 'Create an object representing a button with textContent "Submit". Update its textContent to "Saved!" and log it.',
          starterCode: `const button = { textContent: "Submit" };\nbutton.textContent = "Saved!";\nconsole.log(button.textContent);`,
          solutionCode: `const button = { textContent: "Saved!" };\nconsole.log(button.textContent);`,
          hint: 'Update button.textContent to "Saved!" and log it.',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('Saved!'))) {
              return { passed: true, message: 'DOM textContent successfully simulated and updated to "Saved!"!' };
            }
            return { passed: false, message: 'Expected output "Saved!".' };
          },
        },
        quiz: {
          question: 'Which method should you use to prevent a form from submitting and refreshing the browser page?',
          options: ['event.stopPropagation()', 'event.preventDefault()', 'event.stop()', 'document.freeze()'],
          correctIndex: 1,
          explanation: 'event.preventDefault() halts default browser actions like form submissions and link navigations.',
        },
        visualType: 'dom',
      },
    ],
  },
  {
    id: 'js-async',
    title: '9. Asynchronous JavaScript & Promises',
    iconName: 'Radio',
    description: 'The Event Loop, Callbacks, Promises, async/await, and the Fetch API.',
    lessons: [
      {
        id: 'async-await-promises',
        categoryId: 'js-async',
        categoryTitle: '9. Asynchronous JavaScript & Promises',
        title: 'Promises, async/await, & The Event Loop',
        shortDesc: 'Understand the Call Stack, Web APIs, Task Queue, Microtasks, Promise chaining, and async/await.',
        theory: `JavaScript is single-threaded, meaning it has one call stack and executes one command at a time. Asynchronous operations allow the engine to delegate time-consuming tasks (network requests, timers) to the browser/runtime and continue running without freezing!

1. The Event Loop Architecture:
   - Call Stack: Synchronous code execution.
   - Web APIs: Handles setTimeout, fetch, DOM events in the background.
   - Microtask Queue: Promises (.then callbacks, queueMicrotask) have HIGHEST priority!
   - Macrotask Queue: setTimeout, setInterval, I/O tasks.

2. Promises:
   - States: Pending -> Fulfilled (resolved) OR Rejected.
   - .then(res => ...) handles success.
   - .catch(err => ...) handles errors.
   - .finally(() => ...) runs regardless of outcome.

3. async / await:
   - Syntactic sugar over Promises.
   - "async" makes any function return a Promise automatically.
   - "await" pauses the async function execution until the Promise settles.
   - Always wrap with try / catch for robust error handling.`,
        syntaxSnippets: [
          {
            title: 'Modern async / await with Error Handling',
            code: `async function fetchUserData(userId) {\n  try {\n    console.log("Fetching telemetry...");\n    // Simulated network delay:\n    const data = await new Promise((resolve) => {\n      setTimeout(() => resolve({ id: userId, status: "Active" }), 500);\n    });\n    console.log("Data received:", data);\n    return data;\n  } catch (error) {\n    console.error("Fetch failed:", error);\n  }\n}\n\nfetchUserData(101);`,
            explanation: 'async/await writes asynchronous code that looks and behaves like clean, linear synchronous code.',
          },
        ],
        tryItStarterCode: `// Experiment with the Event Loop order:\nconsole.log("1. Synchronous First");\n\nsetTimeout(() => {\n  console.log("4. Macrotask (setTimeout) - runs after microtasks");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log("3. Microtask (Promise) - runs before Macrotask");\n});\n\nconsole.log("2. Synchronous Second");`,
        exercise: {
          instruction: 'Write an async function "loadLab()" that returns "Lab Online". Await it and log the message.',
          starterCode: `async function loadLab() {\n  return "Lab Online";\n}\n\nasync function main() {\n  const status = await loadLab();\n  console.log(status);\n}\nmain();`,
          solutionCode: `async function loadLab() { return "Lab Online"; }\nloadLab().then(console.log);`,
          hint: 'Ensure "Lab Online" is logged to the console.',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('Lab Online'))) {
              return { passed: true, message: 'Async Promise resolved and logged correctly!' };
            }
            return { passed: false, message: 'Expected output "Lab Online".' };
          },
        },
        quiz: {
          question: 'Between a Promise .then() callback and a setTimeout(..., 0), which executes first when the call stack clears?',
          options: ['setTimeout', 'Promise .then() (Microtask Queue)', 'Both execute in random order', 'Neither, it hangs'],
          correctIndex: 1,
          explanation: 'Microtasks (Promises) are given higher priority and drain completely before the macrotask queue (setTimeout) runs.',
        },
        visualType: 'async',
      },
    ],
  },
  {
    id: 'js-storage-json',
    title: '10. Web Storage & JSON Persistence',
    iconName: 'Database',
    description: 'How real-world web apps save user state, preferences, and lists using localStorage and JSON.',
    lessons: [
      {
        id: 'localstorage-json-guide',
        categoryId: 'js-storage-json',
        categoryTitle: '10. Web Storage & JSON Persistence',
        title: 'localStorage, sessionStorage & JSON (stringify/parse)',
        shortDesc: 'Save data across page reloads and browser restarts using key-value storage and JSON.',
        theory: `Web Storage allows web applications to store up to ~5MB of data in the user's browser securely:

1. "localStorage":
   - Persists data indefinitely until explicitly cleared (even after closing browser).
   - Only stores STRINGS!

2. "sessionStorage":
   - Same API as localStorage, but data is wiped as soon as the browser tab is closed.

3. The JSON Bridge (Storing Arrays & Objects):
   - Because localStorage only accepts strings, we serialize data:
   - "JSON.stringify(object)": Converts JS arrays or objects into a JSON string!
   - "JSON.parse(string)": Parses a JSON string back into a live JS object or array!

4. Core Methods:
   - localStorage.setItem(key, stringValue)
   - localStorage.getItem(key)
   - localStorage.removeItem(key)
   - localStorage.clear()`,
        syntaxSnippets: [
          {
            title: 'Storing and Retrieving an Array',
            code: `// Saving an array to storage:\nconst tasks = ["Build App", "Study JS", "Deploy"];\nconst serialized = JSON.stringify(tasks);\nconsole.log("JSON String:", serialized); // '["Build App","Study JS","Deploy"]'\n\n// Restoring array from storage:\nconst restored = JSON.parse(serialized);\nconsole.log("Restored Count:", restored.length); // 3`,
            explanation: 'Always use JSON.stringify() when saving and JSON.parse() when reading complex data.',
          },
        ],
        tryItStarterCode: `// Simulating localStorage in sandbox:\nconst mockStorage = new Map();\n\nconst userProfile = { name: "Agent Alex", score: 980 };\nmockStorage.set("profile", JSON.stringify(userProfile));\n\nconsole.log("Stored JSON:", mockStorage.get("profile"));\n\nconst retrieved = JSON.parse(mockStorage.get("profile"));\nconsole.log(\`Welcome back, \${retrieved.name}! High Score: \${retrieved.score}\`);`,
        exercise: {
          instruction: 'Convert the object { score: 100 } into a JSON string using JSON.stringify() and log it.',
          starterCode: `const data = { score: 100 };\nconst jsonString = JSON.stringify(data);\nconsole.log(jsonString);`,
          solutionCode: `console.log(JSON.stringify({ score: 100 }));`,
          hint: 'Call JSON.stringify(data) and log the output.',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('100') && l.includes('score'))) {
              return { passed: true, message: 'JSON successfully serialized!' };
            }
            return { passed: false, message: 'Expected JSON string with score: 100.' };
          },
        },
        quiz: {
          question: 'What type of data does localStorage store natively?',
          options: ['Binary byte buffers', 'Strings only', 'Any JavaScript object or array directly', 'Numbers only'],
          correctIndex: 1,
          explanation: 'localStorage only accepts and returns strings. Use JSON.stringify and JSON.parse to store arrays and objects.',
        },
        visualType: 'variable',
      },
    ],
  },
  {
    id: 'js-es6-superpowers',
    title: '11. Modern ES6+ Superpowers',
    iconName: 'Zap',
    description: 'Destructuring, Spread/Rest operators, Optional Chaining (?.), and Nullish Coalescing (??).',
    lessons: [
      {
        id: 'modern-syntax-sugar',
        categoryId: 'js-es6-superpowers',
        categoryTitle: '11. Modern ES6+ Superpowers',
        title: 'Destructuring, Spread (...) & Optional Chaining (?.)',
        shortDesc: 'Write elegant, safe, modern JavaScript with destructuring, spread cloning, and defensive chaining.',
        theory: `Modern JavaScript includes concise syntax patterns that eliminate boilerplate and guard against runtime errors:

1. Destructuring:
   - Objects: const { name, level = 1 } = user;
   - Arrays: const [first, second, ...rest] = colors;

2. Spread Operator (...):
   - Shallow clone an object: const clone = { ...original, updatedKey: "newVal" };
   - Combine arrays: const merged = [...arrayA, ...arrayB];

3. Optional Chaining (?.):
   - Safely access deeply nested properties without throwing TypeError: Cannot read properties of undefined!
   - Example: user?.profile?.avatarUrl ?? "default-avatar.png"

4. Nullish Coalescing (??):
   - Returns the right-hand value ONLY if left-hand is null or undefined (unlike || which also triggers on 0 or "").`,
        syntaxSnippets: [
          {
            title: 'Modern Defensive Patterns',
            code: `const telemetry = {\n  system: "Helios",\n  diagnostics: null\n};\n\n// Safe access with ?. and fallback with ?:\nconst errorCount = telemetry.diagnostics?.errors ?? 0;\nconsole.log("Errors:", errorCount); // 0 (Never crashes!)\n\n// Object destructuring with defaults:\nconst { system, status = "OPTIMAL" } = telemetry;\nconsole.log(\`\${system} is \${status}\`);`,
            explanation: 'Optional chaining and nullish coalescing are essential for working with real-world API data.',
          },
        ],
        tryItStarterCode: `const config = {\n  server: "Europe-West",\n  port: 8080,\n  features: { logging: true }\n};\n\n// Unpack with destructuring:\nconst { server, port } = config;\nconsole.log(\`Connected to \${server}:\${port}\`);\n\n// Clone with spread and override port:\nconst devConfig = { ...config, port: 3000 };\nconsole.log("Dev Config:", devConfig);\n\n// Optional chaining test:\nconsole.log("Nested safe:", config.analytics?.views ?? "No analytics");`,
        exercise: {
          instruction: 'Use destructuring to extract "a" and "b" from object { a: 10, b: 20 }. Log a + b (which equals 30).',
          starterCode: `const coords = { a: 10, b: 20 };\nconst { a, b } = coords;\nconsole.log(a + b);`,
          solutionCode: `const coords = { a: 10, b: 20 };\nconst { a, b } = coords;\nconsole.log(a + b);`,
          hint: 'const { a, b } = coords; logs a + b = 30.',
          validate: (code, logs) => {
            if (logs.some((l) => l.includes('30'))) {
              return { passed: true, message: 'Destructuring completed! a + b = 30.' };
            }
            return { passed: false, message: 'Expected output 30.' };
          },
        },
        quiz: {
          question: 'What will "data?.user?.email" evaluate to if "user" is undefined?',
          options: ['Throws TypeError', 'undefined', 'null', 'false'],
          correctIndex: 1,
          explanation: 'Optional chaining (?.) short-circuits and safely returns undefined rather than crashing with a TypeError.',
        },
        visualType: 'object',
      },
    ],
  },
];
