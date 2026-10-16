export type StationId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface CodeChallenge {
  title: string;
  instructions: string;
  starterCode: string;
  solutionExample: string;
  hint: string;
  validate: (code: string, logs: string[], result: unknown) => { passed: boolean; message: string; visualAction?: string };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InteractiveExperiment {
  id: string;
  title: string;
  description: string;
  controls: {
    type: 'slider' | 'button' | 'toggle' | 'select' | 'input';
    id: string;
    label: string;
    defaultValue?: any;
    options?: { label: string; value: any }[];
    min?: number;
    max?: number;
    step?: number;
  }[];
}

export interface StationData {
  id: StationId;
  slug: string;
  title: string;
  shortTitle: string;
  badgeName: string;
  icon: string;
  accentColor: string; // e.g. '#38bdf8'
  category: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  stationPos: [number, number, number];
  summary: string;
  beginnerAnalogy: string;
  keyConcepts: {
    title: string;
    code: string;
    explanation: string;
  }[];
  challenge: CodeChallenge;
  quiz: QuizQuestion;
}

export interface ConsoleEntry {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error' | 'success';
  content: string;
  timestamp: string;
}

export interface LabSettings {
  soundEnabled: boolean;
  autoRotate: boolean;
  showFloorGrid: boolean;
  particlesEnabled: boolean;
}
