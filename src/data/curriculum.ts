import { StationData } from '../types';

export const STATIONS: StationData[] = [
  {
    id: 1,
    slug: 'variables-and-types',
    title: 'The Variable Vault',
    shortTitle: 'Variables & Types',
    badgeName: 'Memory Master',
    icon: 'Database',
    accentColor: '#38bdf8', // Neon Sky Blue
    category: 'Foundations',
    stationPos: [-12, 0, -8],
    cameraPos: [-10, 4.5, -4],
    cameraTarget: [-12, 2, -8],
    summary: 'Master how JavaScript stores data in memory using let, const, and core primitive types.',
    beginnerAnalogy: 'Think of variables like labeled storage boxes in a lab. `let` is a box you can open and swap contents anytime. `const` is a sealed vault box—once you put something inside, you cannot replace the whole box!',
    keyConcepts: [
      {
        title: 'Declaring Variables',
        code: `let energy = 100;\nconst labName = "Apex Lab";\nenergy = 85; // Allowed!\n// labName = "New Lab"; // Error! const cannot be reassigned.`,
        explanation: 'Use "let" when values will change over time, and "const" by default for everything else that remains constant.',
      },
      {
        title: 'Primitive Data Types',
        code: `let scientist = "Ada";   // String (text in quotes)\nlet roomTemp = 21.5;     // Number (decimals or integers)\nlet isPowerOn = true;    // Boolean (true or false)\nlet unassigned;          // undefined (no value yet)\nlet emptySlot = null;    // null (explicitly empty)`,
        explanation: 'JavaScript has dynamic types: Strings for words, Numbers for math, and Booleans for on/off switches.',
      },
      {
        title: 'Template Literals',
        code: `const agent = "Byte";\nconst level = 1;\nconsole.log(\`Agent \${agent} is ready for Level \${level}!\`);`,
        explanation: 'Backticks (`) allow you to embed variables directly using ${variable} without messy plus signs.',
      },
    ],
    challenge: {
      title: 'Lab Challenge: Calibrate the Vault Core',
      instructions: 'Create a variable named "fuelLevel" with a number value of 75, and a constant named "reactorName" set to "Helios". Log them using console.log!',
      starterCode: `// 1. Declare let fuelLevel with 75\n// 2. Declare const reactorName with "Helios"\n\nlet fuelLevel = 50;\nconst reactorName = "Helios";\n\n// Update fuelLevel to 75:\nfuelLevel = 75;\n\nconsole.log(\`Reactor: \${reactorName}, Fuel: \${fuelLevel}%\`);`,
      solutionExample: `let fuelLevel = 75;\nconst reactorName = "Helios";\nconsole.log(\`Reactor: \${reactorName}, Fuel: \${fuelLevel}%\`);`,
      hint: 'Make sure "reactorName" is exactly "Helios" and "fuelLevel" is the number 75.',
      validate: (code, logs) => {
        const hasFuel = /fuelLevel\s*=\s*75/.test(code) || logs.some(l => l.includes('75'));
        const hasReactor = /reactorName\s*=\s*["']Helios["']/.test(code) || logs.some(l => l.includes('Helios'));
        if (hasFuel && hasReactor) {
          return { passed: true, message: 'Vault calibrated! Power levels stabilized at 75% on reactor Helios.', visualAction: 'vault-charge' };
        }
        return { passed: false, message: 'Check that fuelLevel is 75 and reactorName is "Helios".' };
      },
    },
    quiz: {
      question: 'Which keyword should you use to declare a variable whose value should never be reassigned?',
      options: ['let', 'const', 'var', 'define'],
      correctIndex: 1,
      explanation: '"const" prevents reassignment, making your code safer and intent clearer.',
    },
  },
  {
    id: 2,
    slug: 'logic-and-conditionals',
    title: 'The Logic Switchboard',
    shortTitle: 'Conditionals & Logic',
    badgeName: 'Logic Conductor',
    icon: 'GitBranch',
    accentColor: '#34d399', // Emerald Green
    category: 'Control Flow',
    stationPos: [-6, 0, -14],
    cameraPos: [-5, 4, -10],
    cameraTarget: [-6, 1.8, -14],
    summary: 'Direct execution paths and power routing with if/else conditionals and comparison gates.',
    beginnerAnalogy: 'Think of conditional logic like a train track switch. If the signal light is green, the train goes to Track A. Otherwise, it is diverted to Track B.',
    keyConcepts: [
      {
        title: 'Strict Equality (===)',
        code: `5 === 5;         // true\n5 === "5";       // false (Number vs String!)\n"ready" !== "off"; // true (strict not-equal)`,
        explanation: 'Always use strict equality (===) instead of loose (==). Strict equality checks both value AND data type!',
      },
      {
        title: 'If / Else If / Else',
        code: `let power = 40;\nif (power > 80) {\n  console.log("Shields: Maximum");\n} else if (power > 30) {\n  console.log("Shields: Nominal");\n} else {\n  console.log("Shields: Critical!");\n}`,
        explanation: 'JavaScript checks conditions from top to bottom. The first one that evaluates to true runs its block.',
      },
      {
        title: 'Logical Operators (&&, ||, !)',
        code: `let hasKey = true;\nlet clearance = 3;\n// AND: Both must be true\nif (hasKey && clearance >= 2) {\n  console.log("Access Granted");\n}\n// OR: At least one must be true\n// NOT: !hasKey inverts true to false`,
        explanation: 'Combine decisions with && (AND), || (OR), and ! (NOT).',
      },
    ],
    challenge: {
      title: 'Lab Challenge: Power Grid Routing',
      instructions: 'Write an if-else check: if voltage is greater than 100, log "High Voltage Warning". Otherwise, log "Safe Voltage". Test with voltage = 120.',
      starterCode: `let voltage = 120;\n\n// Write your if / else logic here:\nif (voltage > 100) {\n  console.log("High Voltage Warning");\n} else {\n  console.log("Safe Voltage");\n}`,
      solutionExample: `let voltage = 120;\nif (voltage > 100) {\n  console.log("High Voltage Warning");\n} else {\n  console.log("Safe Voltage");\n}`,
      hint: 'Use `if (voltage > 100)` and console.log("High Voltage Warning").',
      validate: (code, logs) => {
        const passed = logs.some(l => l.includes('High Voltage Warning'));
        if (passed) {
          return { passed: true, message: 'Circuit breaker engaged! Power routing verified safely.', visualAction: 'switch-activate' };
        }
        return { passed: false, message: 'Expected output "High Voltage Warning" for voltage = 120.' };
      },
    },
    quiz: {
      question: 'What does the expression (10 === "10") evaluate to in JavaScript?',
      options: ['true', 'false', 'undefined', 'NaN'],
      correctIndex: 1,
      explanation: 'Strict equality (===) compares both type and value. A number (10) is never strictly equal to a string ("10").',
    },
  },
  {
    id: 3,
    slug: 'functions-and-scope',
    title: 'The Function Transformer',
    shortTitle: 'Functions & Scope',
    badgeName: 'Function Mechanic',
    icon: 'Cpu',
    accentColor: '#a855f7', // Violet
    category: 'Building Blocks',
    stationPos: [6, 0, -14],
    cameraPos: [5, 4, -10],
    cameraTarget: [6, 1.8, -14],
    summary: 'Build reusable machinery with parameters, return statements, and modern arrow syntax.',
    beginnerAnalogy: 'A function is like a blender or vending machine. You feed in ingredients (arguments), it runs a recipe (code body), and dispenses a delicious smoothie (return value)!',
    keyConcepts: [
      {
        title: 'Declaring & Calling Functions',
        code: `function synthesize(elementA, elementB) {\n  return \`Alloy: \${elementA}+\${elementB}\`;\n}\n\n// Call (invoke) the function:\nconst result = synthesize("Titanium", "Gold");\nconsole.log(result); // "Alloy: Titanium+Gold"`,
        explanation: 'Functions bundle repeatable steps into named reusable routines. "return" sends back the output.',
      },
      {
        title: 'Arrow Functions',
        code: `// Modern concise syntax:\nconst multiply = (x, y) => x * y;\n\nconst greet = name => \`Greetings, Agent \${name}\`;\nconsole.log(multiply(4, 5)); // 20`,
        explanation: 'Arrow functions (=>) are a clean, modern way to write functions in JavaScript.',
      },
      {
        title: 'Scope (Local vs Global)',
        code: `const labCode = "OMEGA"; // Global\n\nfunction testScope() {\n  const secretKey = 999; // Local to testScope\n  console.log(labCode); // Can access global\n}\n// console.log(secretKey); // ReferenceError! It is trapped inside the function.`,
        explanation: 'Variables declared inside a function only exist inside that function—this is called local scope.',
      },
    ],
    challenge: {
      title: 'Lab Challenge: Build the Particle Multiplier',
      instructions: 'Write an arrow function named "boostSpeed" that takes a speed parameter and returns speed multiplied by 2. Call it with 25 and log the result.',
      starterCode: `// Define boostSpeed arrow function:\nconst boostSpeed = (speed) => {\n  return speed * 2;\n};\n\nconst output = boostSpeed(25);\nconsole.log(\`Turbine Speed: \${output} km/s\`);`,
      solutionExample: `const boostSpeed = (speed) => speed * 2;\nconsole.log(boostSpeed(25));`,
      hint: 'Make sure boostSpeed(25) returns 50!',
      validate: (code, logs) => {
        const has50 = logs.some(l => l.includes('50'));
        const hasFunc = /boostSpeed/.test(code);
        if (has50 && hasFunc) {
          return { passed: true, message: 'Particle turbine accelerated to 50 km/s! Speed multiplier online.', visualAction: 'turbine-spin' };
        }
        return { passed: false, message: 'Make sure boostSpeed returns the number 50 when passed 25.' };
      },
    },
    quiz: {
      question: 'What keyword outputs a value from a function and stops its execution?',
      options: ['yield', 'exit', 'return', 'break'],
      correctIndex: 2,
      explanation: 'The "return" statement sends back the computed result and concludes function execution.',
    },
  },
  {
    id: 4,
    slug: 'arrays-and-loops',
    title: 'The Loop Conveyor',
    shortTitle: 'Arrays & Loops',
    badgeName: 'Loop Architect',
    icon: 'Repeat',
    accentColor: '#f59e0b', // Amber / Gold
    category: 'Data Structures',
    stationPos: [12, 0, -8],
    cameraPos: [10, 4.5, -4],
    cameraTarget: [12, 2, -8],
    summary: 'Process collections of data automatically using array lists, for loops, and array helper methods.',
    beginnerAnalogy: 'Think of an array as an assembly conveyor belt with numbered bins starting at index 0. A loop is a robotic scanner that visits each bin in sequence to inspect or transform items.',
    keyConcepts: [
      {
        title: 'Arrays & Zero-Indexing',
        code: `const elements = ["Helium", "Neon", "Argon"];\nconsole.log(elements[0]); // "Helium" (First item!)\nconsole.log(elements.length); // 3 items\nelements.push("Krypton"); // Add to end`,
        explanation: 'Arrays store ordered lists. Remember that computer counting starts at index 0!',
      },
      {
        title: 'Classic For Loop & For...Of',
        code: `const samples = [10, 20, 30];\n// Standard for loop:\nfor (let i = 0; i < samples.length; i++) {\n  console.log(\`Bin \${i}: \${samples[i]}\`);\n}\n\n// Modern for...of loop:\nfor (const sample of samples) {\n  console.log(sample * 2);\n}`,
        explanation: 'Loops automate repeating tasks over lists of data without writing the same line multiple times.',
      },
      {
        title: 'Modern Array Methods (.map & .filter)',
        code: `const numbers = [1, 2, 3, 4, 5];\n// Double every item:\nconst doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]\n\n// Keep only even numbers:\nconst evens = numbers.filter(n => n % 2 === 0); // [2, 4]`,
        explanation: '.map() transforms each item into a new array. .filter() picks items that pass a test.',
      },
    ],
    challenge: {
      title: 'Lab Challenge: Filter Contaminated Samples',
      instructions: 'You have an array of radiation readings: [12, 45, 88, 23, 95, 30]. Use .filter() to create a new array with only readings greater than 50, and log it!',
      starterCode: `const readings = [12, 45, 88, 23, 95, 30];\n\n// Filter readings > 50:\nconst highRadiation = readings.filter(r => r > 50);\n\nconsole.log("Hazard Readings:", highRadiation);`,
      solutionExample: `const readings = [12, 45, 88, 23, 95, 30];\nconst highRadiation = readings.filter(r => r > 50);\nconsole.log(highRadiation);`,
      hint: 'Use `readings.filter(r => r > 50)` which will return [88, 95].',
      validate: (code, logs) => {
        const passed = logs.some(l => l.includes('88') && l.includes('95') && !l.includes('12'));
        if (passed) {
          return { passed: true, message: 'Hazard samples isolated: [88, 95] routed to decontamination chute!', visualAction: 'conveyor-run' };
        }
        return { passed: false, message: 'Result should contain [88, 95]. Make sure you filter for numbers > 50.' };
      },
    },
    quiz: {
      question: 'What is the index of the very first element in any JavaScript array?',
      options: ['1', '0', '-1', 'first'],
      correctIndex: 1,
      explanation: 'JavaScript arrays are zero-indexed. The initial item is accessed with array[0].',
    },
  },
  {
    id: 5,
    slug: 'objects-and-methods',
    title: 'The Holo-Drone Workbench',
    shortTitle: 'Objects & Methods',
    badgeName: 'Object Engineer',
    icon: 'Box',
    accentColor: '#ec4899', // Pink / Magenta
    category: 'Data Structures',
    stationPos: [12, 0, 8],
    cameraPos: [10, 4.5, 4],
    cameraTarget: [12, 2, 8],
    summary: 'Model complex real-world entities with key-value pairs, nested properties, and object methods.',
    beginnerAnalogy: 'An object is like a blueprint or passport for a physical entity. A drone object has traits like color, model, and battery (properties) and actions it can perform like fly or scan (methods).',
    keyConcepts: [
      {
        title: 'Object Anatomy',
        code: `const drone = {\n  id: "DR-400",\n  chassisColor: "cyan",\n  battery: 92,\n  isShieldActive: true,\n  // Nested object:\n  coordinates: { x: 10, y: 5 }\n};\n\n// Access with dot notation:\nconsole.log(drone.chassisColor); // "cyan"`,
        explanation: 'Objects bundle related properties together into a single structured container.',
      },
      {
        title: 'Object Methods & "this"',
        code: `const robot = {\n  name: "Sparky",\n  energy: 50,\n  recharge(amount) {\n    this.energy += amount;\n    console.log(\`\${this.name} recharged to \${this.energy}%\`);\n  }\n};\n\nrobot.recharge(30); // "Sparky recharged to 80%"`,
        explanation: 'When a function lives inside an object, it is called a method. "this" refers to the owner object itself!',
      },
      {
        title: 'Destructuring & Spread Operator',
        code: `const sensor = { temp: 24, humidity: 45, unit: "C" };\n// Unpack variables:\nconst { temp, humidity } = sensor;\n\n// Clone and add new properties:\nconst updatedSensor = { ...sensor, status: "OK" };`,
        explanation: 'Destructuring lets you extract values cleanly, while spread (...) copies properties into new objects.',
      },
    ],
    challenge: {
      title: 'Lab Challenge: Build the Drone Specification',
      instructions: 'Create an object named "labDrone" with properties: model ("Titan-X"), battery (100), and a method "fly()" that returns "Drone airborne!". Test the method!',
      starterCode: `const labDrone = {\n  model: "Titan-X",\n  battery: 100,\n  fly() {\n    return "Drone airborne!";\n  }\n};\n\nconsole.log(labDrone.fly());`,
      solutionExample: `const labDrone = {\n  model: "Titan-X",\n  battery: 100,\n  fly() { return "Drone airborne!"; }\n};\nconsole.log(labDrone.fly());`,
      hint: 'Include `fly() { return "Drone airborne!"; }` inside your labDrone object and log `labDrone.fly()`.',
      validate: (code, logs) => {
        const passed = logs.some(l => l.includes('Drone airborne!'));
        if (passed) {
          return { passed: true, message: 'Drone Titan-X activated! Holographic repulsor thrusters initialized.', visualAction: 'drone-hover' };
        }
        return { passed: false, message: 'Make sure your labDrone.fly() returns and logs "Drone airborne!".' };
      },
    },
    quiz: {
      question: 'Inside an object method, what does the keyword "this" typically refer to?',
      options: ['The window object', 'The parent function', 'The object itself', 'Nothing, it is reserved'],
      correctIndex: 2,
      explanation: 'Inside a standard object method, "this" points to the object currently executing the method.',
    },
  },
  {
    id: 6,
    slug: 'events-and-dom',
    title: 'The Event Horizon Chamber',
    shortTitle: 'DOM & Events',
    badgeName: 'Event Weaver',
    icon: 'Zap',
    accentColor: '#06b6d4', // Cyan
    category: 'Interactive Web',
    stationPos: [6, 0, 14],
    cameraPos: [5, 4, 10],
    cameraTarget: [6, 1.8, 14],
    summary: 'Bring web pages to life by listening for user clicks, keyboard presses, and dispatching dynamic DOM actions.',
    beginnerAnalogy: 'Think of event listeners like laboratory tripwires or motion sensors. You set a sensor to watch for an event (like a footprint or button press), and trigger an alarm action when it happens.',
    keyConcepts: [
      {
        title: 'Selecting Elements',
        code: `// Grab elements by id or CSS selector:\nconst button = document.querySelector("#alarm-button");\nconst statusPanel = document.querySelector(".status-display");\n\nstatusPanel.textContent = "System Armed";\nstatusPanel.style.color = "red";`,
        explanation: 'document.querySelector lets JavaScript grab HTML elements to read or modify text and styling.',
      },
      {
        title: 'Adding Event Listeners',
        code: `const lever = document.querySelector("#power-lever");\n\nlever.addEventListener("click", (event) => {\n  console.log("Lever toggled at coordinates:", event.clientX, event.clientY);\n  lever.classList.toggle("active");\n});`,
        explanation: 'addEventListener attaches a callback function that fires every time the specified event happens.',
      },
      {
        title: 'Event Object & Prevention',
        code: `const form = document.querySelector("#login-form");\n\nform.addEventListener("submit", (e) => {\n  e.preventDefault(); // Stop default page refresh!\n  console.log("Form intercepted cleanly by JS");\n});`,
        explanation: 'The event parameter (e) holds event details, and e.preventDefault() prevents browser defaults like page reload.',
      },
    ],
    challenge: {
      title: 'Lab Challenge: Wire the Emergency Alert',
      instructions: 'Simulate an event dispatcher: Write a function "triggerLaserTrap(event)" that logs "Laser trap activated at: " followed by the event type ("tripwire"). Call it with an event object { type: "tripwire" }!',
      starterCode: `function triggerLaserTrap(event) {\n  console.log(\`Laser trap activated at: \${event.type}\`);\n}\n\n// Simulate the event trigger:\ntriggerLaserTrap({ type: "tripwire" });`,
      solutionExample: `function triggerLaserTrap(event) {\n  console.log(\`Laser trap activated at: \${event.type}\`);\n}\ntriggerLaserTrap({ type: "tripwire" });`,
      hint: 'Call `triggerLaserTrap({ type: "tripwire" })` to trigger the log.',
      validate: (code, logs) => {
        const passed = logs.some(l => l.includes('Laser trap activated at: tripwire'));
        if (passed) {
          return { passed: true, message: 'Tripwire armed! Photon sensor beam online.', visualAction: 'laser-beam' };
        }
        return { passed: false, message: 'Ensure log outputs: "Laser trap activated at: tripwire".' };
      },
    },
    quiz: {
      question: 'Which method is standard for listening to user interactions on a DOM element?',
      options: ['element.listenEvent()', 'element.addEventListener()', 'element.attach()', 'element.onAction()'],
      correctIndex: 1,
      explanation: 'addEventListener(event, callback) is the standard modern method to bind event handlers.',
    },
  },
  {
    id: 7,
    slug: 'async-and-promises',
    title: 'The Quantum Async Portal',
    shortTitle: 'Async & Promises',
    badgeName: 'Async Navigator',
    icon: 'Radio',
    accentColor: '#8b5cf6', // Indigo / Purple
    category: 'Advanced Concepts',
    stationPos: [-6, 0, 14],
    cameraPos: [-5, 4, 10],
    cameraTarget: [-6, 1.8, 14],
    summary: 'Handle delays, network fetches, and the single-threaded Event Loop without freezing the application.',
    beginnerAnalogy: 'Imagine ordering coffee at a cafe. The barista hands you a buzzer (a Promise). You do not freeze standing still; you find a seat and read (non-blocking). When the buzzer beeps (resolved), you pick up your coffee!',
    keyConcepts: [
      {
        title: 'The Event Loop & setTimeout',
        code: `console.log("1: Start request");\n\nsetTimeout(() => {\n  console.log("3: Background task complete");\n}, 1000); // 1-second delay\n\nconsole.log("2: JavaScript continues running!");`,
        explanation: 'JavaScript is single-threaded. Timeouts and network requests run in the background so the UI never freezes.',
      },
      {
        title: 'Promises (.then & .catch)',
        code: `const fetchSample = new Promise((resolve, reject) => {\n  const success = true;\n  if (success) resolve("Sample Data Received");\n  else reject("Sensor Error");\n});\n\nfetchSample\n  .then(data => console.log(data))\n  .catch(err => console.error(err));`,
        explanation: 'A Promise represents a future value that will either be fulfilled (resolved) or fail (rejected).',
      },
      {
        title: 'Modern async / await',
        code: `async function loadLabData() {\n  try {\n    console.log("Syncing with satellite...");\n    // Simulated delay:\n    await new Promise(r => setTimeout(r, 800));\n    return "Telemetry 100% Synced";\n  } catch (error) {\n    console.error("Transmission failed", error);\n  }\n}`,
        explanation: 'async/await lets you write asynchronous code that reads just like clean, straightforward synchronous code!',
      },
    ],
    challenge: {
      title: 'Lab Challenge: Warp Teleportation Async Protocol',
      instructions: 'Write an async function named "teleportCargo" that awaits a 500ms delay and logs "Cargo materialized successfully!". Call the function.',
      starterCode: `async function teleportCargo() {\n  console.log("Initiating warp drive...");\n  // Await 500ms:\n  await new Promise(resolve => setTimeout(resolve, 500));\n  console.log("Cargo materialized successfully!");\n}\n\nteleportCargo();`,
      solutionExample: `async function teleportCargo() {\n  await new Promise(r => setTimeout(r, 500));\n  console.log("Cargo materialized successfully!");\n}\nteleportCargo();`,
      hint: 'Include the log "Cargo materialized successfully!" inside teleportCargo() after the await.',
      validate: (code, logs) => {
        const passed = logs.some(l => l.includes('Cargo materialized successfully!'));
        if (passed) {
          return { passed: true, message: 'Warp portal synchronized! Quantum data packets successfully transmitted.', visualAction: 'portal-vortex' };
        }
        return { passed: false, message: 'Ensure "Cargo materialized successfully!" is logged.' };
      },
    },
    quiz: {
      question: 'Which keyword can only be used directly inside a function that has been declared with "async"?',
      options: ['wait', 'defer', 'await', 'pause'],
      correctIndex: 2,
      explanation: 'The "await" keyword pauses async function execution until a Promise resolves, and must be in an async function.',
    },
  },
  {
    id: 8,
    slug: 'master-lab-reactor',
    title: 'The JS Core Reactor',
    shortTitle: 'Sandbox & Reactor',
    badgeName: 'Lab Director',
    icon: 'Sparkles',
    accentColor: '#10b981', // Neon Jade / Emerald
    category: 'Mastery & Sandbox',
    stationPos: [-12, 0, 8],
    cameraPos: [-10, 4.5, 4],
    cameraTarget: [-12, 2, 8],
    summary: 'Harmonize all concepts in the Central Power Reactor. Run your own code and command the 3D lab environment in real-time!',
    beginnerAnalogy: 'You now sit in the Director\'s seat of the whole facility! Combine variables, logic, functions, loops, and objects to orchestrate the entire 3D laboratory.',
    keyConcepts: [
      {
        title: '3D Lab API in the Sandbox',
        code: `// You have a special "lab" object available in this reactor:\nlab.setCoreSpeed(3.5);             // Speed up central reactor spin\nlab.setReactorColor("#ec4899");    // Change plasma color\nlab.pulseShields();                // Trigger lab energy shockwave\nlab.spawnDataOrbs(5);              // Spawn floating energy particles`,
        explanation: 'In this final station, your JavaScript code directly manipulates the 3D Three.js environment!',
      },
      {
        title: 'Putting It All Together',
        code: `// Example: Loop + Condition + Function\nfunction chargeCapacitors(count) {\n  for (let i = 1; i <= count; i++) {\n    if (i % 2 === 0) {\n      console.log(\`Capacitor #\${i}: OPTIMAL\`);\n    } else {\n      console.log(\`Capacitor #\${i}: CHARGING\`);\n    }\n  }\n}\nchargeCapacitors(4);`,
        explanation: 'Real programming is combining these building blocks into algorithms and interactive features.',
      },
    ],
    challenge: {
      title: 'Lab Challenge: Ignite the Full Reactor Core',
      instructions: 'Write a loop that counts from 1 to 3, logging `Reactor Chamber #${i} Online`. When i === 3, call lab.setCoreSpeed(3) or log "All Chambers Online!"',
      starterCode: `for (let i = 1; i <= 3; i++) {\n  console.log(\`Reactor Chamber #\${i} Online\`);\n}\nconsole.log("All Chambers Online!");`,
      solutionExample: `for (let i = 1; i <= 3; i++) {\n  console.log(\`Reactor Chamber #\${i} Online\`);\n}\nconsole.log("All Chambers Online!");`,
      hint: 'Run the starter loop and ensure "All Chambers Online!" is logged.',
      validate: (code, logs) => {
        const passed = logs.some(l => l.includes('All Chambers Online!'));
        if (passed) {
          return { passed: true, message: 'Reactor ignition complete! Maximum output achieved across all 8 stations!', visualAction: 'reactor-overdrive' };
        }
        return { passed: false, message: 'Ensure you log "All Chambers Online!".' };
      },
    },
    quiz: {
      question: 'What is JavaScript primarily designed to provide in web development?',
      options: [
        'Document typography only',
        'Database hardware manufacturing',
        'Interactive logic, behavior, and dynamic manipulation',
        'Physical network cabling',
      ],
      correctIndex: 2,
      explanation: 'JavaScript is the programming language of the web, responsible for interactivity, logic, and dynamic state.',
    },
  },
];
