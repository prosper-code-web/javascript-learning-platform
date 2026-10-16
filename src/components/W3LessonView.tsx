import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Terminal as TerminalIcon,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Code2,
  Sparkles,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson } from '../data/w3curriculum';
import { Compact3DVisualizer } from './Compact3DVisualizer';
import { playClick, playSuccess, playError, playDataPulse } from '../sound';

interface W3LessonViewProps {
  lesson: Lesson;
  isCompleted: boolean;
  onCompleteLesson: (lessonId: string) => void;
  onPrevLesson: () => void;
  onNextLesson: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

interface ConsoleLog {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error' | 'success';
  text: string;
  time: string;
}

export const W3LessonView: React.FC<W3LessonViewProps> = ({
  lesson,
  isCompleted,
  onCompleteLesson,
  onPrevLesson,
  onNextLesson,
  hasPrev,
  hasNext,
}) => {
  // Try It editor state
  const [tryItCode, setTryItCode] = useState(lesson.tryItStarterCode);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);

  // Exercise state
  const [exerciseCode, setExerciseCode] = useState(lesson.exercise.starterCode);
  const [exerciseStatus, setExerciseStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [exerciseMessage, setExerciseMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Quiz state
  const [selectedQuizIdx, setSelectedQuizIdx] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // Copied code feedback
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);

  // Reset when lesson changes
  useEffect(() => {
    setTryItCode(lesson.tryItStarterCode);
    setExerciseCode(lesson.exercise.starterCode);
    setExerciseStatus(isCompleted ? 'success' : 'idle');
    setExerciseMessage(isCompleted ? 'Lesson exercise completed!' : '');
    setSelectedQuizIdx(null);
    setIsQuizSubmitted(false);
    setShowHint(false);
    setConsoleLogs([
      {
        id: 'init',
        type: 'info',
        text: `Terminal ready for: ${lesson.title}`,
        time: new Date().toLocaleTimeString(),
      },
    ]);
  }, [lesson.id, isCompleted]);

  // Execute Try It Code
  const handleRunTryIt = () => {
    playClick();
    const newLogs: ConsoleLog[] = [];

    const customConsole = {
      log: (...args: any[]) => {
        newLogs.push({
          id: Math.random().toString(),
          type: 'log',
          text: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
          time: new Date().toLocaleTimeString(),
        });
      },
      warn: (...args: any[]) => {
        newLogs.push({
          id: Math.random().toString(),
          type: 'warn',
          text: args.map((a) => String(a)).join(' '),
          time: new Date().toLocaleTimeString(),
        });
      },
      error: (...args: any[]) => {
        newLogs.push({
          id: Math.random().toString(),
          type: 'error',
          text: args.map((a) => String(a)).join(' '),
          time: new Date().toLocaleTimeString(),
        });
      },
    };

    try {
      const runFn = new Function('console', tryItCode);
      runFn(customConsole);
      playDataPulse();

      setConsoleLogs((prev) => [
        ...newLogs,
        {
          id: Math.random().toString(),
          type: 'success',
          text: '✓ Code executed successfully',
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      playError();
      setConsoleLogs((prev) => [
        ...newLogs,
        {
          id: Math.random().toString(),
          type: 'error',
          text: `Runtime Error: ${err?.message || 'Execution error'}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  // Run and validate Exercise
  const handleRunExercise = () => {
    playClick();
    const logStrings: string[] = [];

    const customConsole = {
      log: (...args: any[]) => {
        logStrings.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      warn: (...args: any[]) => logStrings.push(args.map(String).join(' ')),
      error: (...args: any[]) => logStrings.push(args.map(String).join(' ')),
    };

    try {
      const runFn = new Function('console', exerciseCode);
      runFn(customConsole);

      const result = lesson.exercise.validate(exerciseCode, logStrings);
      if (result.passed) {
        setExerciseStatus('success');
        setExerciseMessage(result.message);
        playSuccess();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        onCompleteLesson(lesson.id);
      } else {
        setExerciseStatus('failed');
        setExerciseMessage(result.message);
        playError();
      }
    } catch (err: any) {
      setExerciseStatus('failed');
      setExerciseMessage(`Syntax/Runtime Error: ${err?.message}`);
      playError();
    }
  };

  // Copy code snippet helper
  const handleCopySnippet = (codeText: string, idx: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedSnippetIdx(idx);
    playClick();
    setTimeout(() => setCopiedSnippetIdx(null), 2000);
  };

  // Submit Quiz
  const handleSelectQuiz = (idx: number) => {
    setSelectedQuizIdx(idx);
    setIsQuizSubmitted(true);
    if (idx === lesson.quiz.correctIndex) {
      playSuccess();
      confetti({ particleCount: 40, spread: 40 });
      onCompleteLesson(lesson.id);
    } else {
      playError();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-8 space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span>{lesson.categoryTitle}</span>
            <span>/</span>
            <span className="text-slate-400">Lesson</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>{lesson.title}</span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-semibold font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Completed</span>
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{lesson.shortDesc}</p>
        </div>

        {/* Quick Prev / Next Header Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevLesson}
            disabled={!hasPrev}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-xl border border-slate-800 transition-colors ${
              hasPrev
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 cursor-pointer'
                : 'opacity-40 cursor-not-allowed text-slate-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={onNextLesson}
            disabled={!hasNext}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-xl transition-colors font-semibold ${
              hasNext
                ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer shadow-md'
                : 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-600'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive 3D Visualizer Simulation (Compact WebGL Lab Companion) */}
      <Compact3DVisualizer visualType={lesson.visualType} lessonTitle={lesson.title} />

      {/* Detailed Theory Section (W3Schools Style) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-400" />
          <span>Core Concepts & Mechanics</span>
        </h2>
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-2">
          {lesson.theory}
        </div>
      </section>

      {/* Syntax & Examples Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-purple-400" />
          <span>Syntax & Practical Code Examples</span>
        </h2>
        <div className="space-y-4">
          {lesson.syntaxSnippets.map((snippet, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{snippet.title}</span>
                <button
                  onClick={() => handleCopySnippet(snippet.code, idx)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedSnippetIdx === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-sky-300 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                <code>{snippet.code}</code>
              </pre>
              <div className="px-4 py-2.5 bg-slate-900/50 border-t border-slate-800/80 text-xs text-slate-400">
                {snippet.explanation}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Iconic W3Schools "Try It Yourself" Editor & Live Terminal */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Try It Yourself (Live Playground)</span>
          </h2>
          <button
            onClick={() => {
              playClick();
              setTryItCode(lesson.tryItStarterCode);
            }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Starter Code</span>
          </button>
        </div>

        <div className="rounded-2xl border border-emerald-500/40 bg-slate-950 overflow-hidden shadow-2xl">
          {/* Editor Header */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs font-bold text-slate-200">sandbox.js</span>
            </div>
            <button
              onClick={handleRunTryIt}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Run Code (Ctrl + Enter)</span>
            </button>
          </div>

          {/* Textarea Code Editor */}
          <div className="p-3">
            <textarea
              value={tryItCode}
              onChange={(e) => setTryItCode(e.target.value)}
              rows={8}
              className="w-full p-2 bg-transparent text-emerald-300 font-mono text-xs sm:text-sm resize-none focus:outline-none selection:bg-emerald-950"
              spellCheck={false}
            />
          </div>

          {/* Integrated Terminal Console */}
          <div className="border-t border-slate-800 bg-slate-950">
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Live Terminal Console</span>
              </span>
              <button
                onClick={() => setConsoleLogs([])}
                className="text-[11px] text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="p-3 max-h-48 overflow-y-auto space-y-1 font-mono text-xs">
              {consoleLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 ${
                    log.type === 'error'
                      ? 'text-rose-400'
                      : log.type === 'warn'
                      ? 'text-amber-400'
                      : log.type === 'success'
                      ? 'text-emerald-400 font-bold'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 select-none text-[10px]">{log.time}</span>
                  <span>› {log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Practice Exercise Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Practice Exercise: Test Your Skill</span>
          </h2>
          <button
            onClick={() => {
              playClick();
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <p className="text-xs sm:text-sm text-slate-300 font-medium">{lesson.exercise.instruction}</p>

          {showHint && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs">
              💡 <strong>Hint:</strong> {lesson.exercise.hint}
            </div>
          )}

          <div className="rounded-xl border border-slate-700 bg-slate-950 p-2 font-mono text-xs">
            <textarea
              value={exerciseCode}
              onChange={(e) => setExerciseCode(e.target.value)}
              rows={5}
              className="w-full bg-transparent text-amber-300 font-mono text-xs resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleRunExercise}
              className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Submit & Verify Answer</span>
            </button>

            {exerciseStatus === 'success' && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>{exerciseMessage}</span>
              </span>
            )}

            {exerciseStatus === 'failed' && (
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{exerciseMessage}</span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Quick Checkpoint Quiz */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-sky-400" />
          <span>Knowledge Checkpoint Quiz</span>
        </h2>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <p className="text-sm font-semibold text-white">{lesson.quiz.question}</p>

          <div className="space-y-2">
            {lesson.quiz.options.map((option, idx) => {
              const isSelected = selectedQuizIdx === idx;
              const isCorrect = idx === lesson.quiz.correctIndex;

              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';
              if (isQuizSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuiz(idx)}
                  disabled={isQuizSubmitted}
                  className={`w-full p-3 text-left rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isQuizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  {isQuizSubmitted && isSelected && !isCorrect && (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {isQuizSubmitted && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-sky-400">Explanation:</span>
              <p className="text-slate-300 leading-relaxed">{lesson.quiz.explanation}</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Navigation: Previous & Next Lesson */}
      <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={onPrevLesson}
          disabled={!hasPrev}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl border border-slate-800 transition-colors ${
            hasPrev
              ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 cursor-pointer'
              : 'opacity-40 cursor-not-allowed text-slate-600'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Lesson</span>
        </button>

        <button
          onClick={onNextLesson}
          disabled={!hasNext}
          className={`flex items-center gap-1.5 px-5 py-2 text-xs rounded-xl transition-colors font-bold ${
            hasNext
              ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer shadow-lg shadow-sky-500/20'
              : 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-600'
          }`}
        >
          <span>Next Lesson</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
