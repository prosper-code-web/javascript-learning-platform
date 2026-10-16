import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Code2,
  BookOpen,
  HelpCircle,
  Sparkles,
  Terminal,
  Layers,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StationData, ConsoleEntry, StationId } from '../types';
import { playClick, playSuccess, playError, playDataPulse } from '../sound';

interface StationModalProps {
  station: StationData;
  isCompleted: boolean;
  onClose: () => void;
  onCompleteStation: (stationId: StationId) => void;
  onSelectStation: (stationId: StationId) => void;
  onTriggerVisualAction: (actionName: string) => void;
  onSetDroneColor?: (colorHex: string) => void;
}

export const StationModal: React.FC<StationModalProps> = ({
  station,
  isCompleted,
  onClose,
  onCompleteStation,
  onSelectStation,
  onTriggerVisualAction,
  onSetDroneColor,
}) => {
  const [activeTab, setActiveTab] = useState<'concept' | 'challenge' | 'quiz'>('concept');
  const [userCode, setUserCode] = useState(station.challenge.starterCode);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Interactive Live Demo State
  const [demoState, setDemoState] = useState<{ [key: string]: any }>({
    varType: 'let',
    fuelVal: 75,
    gateCondition: true,
    droneHue: '#38bdf8',
  });

  // Reset when station changes
  useEffect(() => {
    setUserCode(station.challenge.starterCode);
    setConsoleEntries([
      {
        id: 'init',
        type: 'info',
        content: `Station 0${station.id} console initialized. Ready for execution.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setShowHint(false);
    setChallengeStatus(isCompleted ? 'success' : 'idle');
    setStatusMessage(isCompleted ? 'Station challenge previously mastered!' : '');
    setSelectedOption(null);
    setQuizSubmitted(false);
  }, [station.id, isCompleted]);

  // Execute JavaScript safely in browser sandbox
  const handleRunCode = () => {
    playClick();
    const newLogs: ConsoleEntry[] = [];
    const logStrings: string[] = [];

    // Custom console wrapper
    const customConsole = {
      log: (...args: any[]) => {
        const text = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
        logStrings.push(text);
        newLogs.push({
          id: Math.random().toString(),
          type: 'log',
          content: text,
          timestamp: new Date().toLocaleTimeString(),
        });
      },
      warn: (...args: any[]) => {
        const text = args.map((a) => String(a)).join(' ');
        logStrings.push(text);
        newLogs.push({
          id: Math.random().toString(),
          type: 'warn',
          content: text,
          timestamp: new Date().toLocaleTimeString(),
        });
      },
      error: (...args: any[]) => {
        const text = args.map((a) => String(a)).join(' ');
        logStrings.push(text);
        newLogs.push({
          id: Math.random().toString(),
          type: 'error',
          content: text,
          timestamp: new Date().toLocaleTimeString(),
        });
      },
    };

    try {
      // Safe execution function
      const runFn = new Function('console', userCode);
      const result = runFn(customConsole);

      playDataPulse();

      // Validate against station challenge
      const validation = station.challenge.validate(userCode, logStrings, result);

      if (validation.passed) {
        setChallengeStatus('success');
        setStatusMessage(validation.message);
        playSuccess();
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#34d399', '#f59e0b', '#ec4899'],
        });

        if (validation.visualAction) {
          onTriggerVisualAction(validation.visualAction);
        }

        onCompleteStation(station.id);
      } else {
        setChallengeStatus('failed');
        setStatusMessage(validation.message);
        playError();
      }

      setConsoleEntries((prev) => [
        ...newLogs,
        {
          id: Math.random().toString(),
          type: validation.passed ? 'success' : 'warn',
          content: validation.passed ? `✓ ${validation.message}` : `⚠ ${validation.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      playError();
      setChallengeStatus('failed');
      const errorMsg = err?.message || 'JavaScript Execution Error';
      setStatusMessage(`Runtime Error: ${errorMsg}`);
      setConsoleEntries((prev) => [
        ...newLogs,
        {
          id: Math.random().toString(),
          type: 'error',
          content: `Syntax / Runtime Error: ${errorMsg}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const handleResetCode = () => {
    playClick();
    setUserCode(station.challenge.starterCode);
    setChallengeStatus('idle');
    setStatusMessage('');
  };

  const handleQuizAnswer = (idx: number) => {
    setSelectedOption(idx);
    setQuizSubmitted(true);
    if (idx === station.quiz.correctIndex) {
      playSuccess();
      confetti({ particleCount: 40, spread: 40 });
    } else {
      playError();
    }
  };

  const handleDemoDroneChange = (color: string) => {
    setDemoState((prev) => ({ ...prev, droneHue: color }));
    if (onSetDroneColor) {
      onSetDroneColor(color);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs pointer-events-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="px-4 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-inner"
              style={{
                backgroundColor: `${station.accentColor}20`,
                borderColor: `${station.accentColor}60`,
                borderWidth: '1px',
                color: station.accentColor,
              }}
            >
              0{station.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{station.title}</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {station.category}
                </span>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    <span>Mastered</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{station.summary}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Station"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 pt-1">
          <button
            onClick={() => {
              playClick();
              setActiveTab('concept');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'concept'
                ? 'border-sky-400 text-sky-400 bg-sky-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Concept & Lab Setup</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveTab('challenge');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer relative ${
              activeTab === 'challenge'
                ? 'border-sky-400 text-sky-400 bg-sky-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>2. Hands-on Code Lab</span>
            {challengeStatus === 'success' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveTab('quiz');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'border-sky-400 text-sky-400 bg-sky-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>3. Knowledge Check</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: Concept & Lab Setup */}
          {activeTab === 'concept' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Beginner Analogy Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/50 to-indigo-950/30 border border-sky-800/50 text-sky-200">
                <div className="flex items-center gap-2 mb-2 font-bold text-sky-300 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Beginner Mental Model (Analogy)</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                  {station.beginnerAnalogy}
                </p>
              </div>

              {/* Station Specific Interactive Experiment Widget */}
              {station.id === 1 && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-sky-400" />
                    <span>Live Vault Memory Simulator</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Declaration Keyword:</label>
                      <div className="flex gap-2">
                        {['let', 'const'].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              playClick();
                              setDemoState((prev) => ({ ...prev, varType: type }));
                              onTriggerVisualAction('vault-charge');
                            }}
                            className={`flex-1 py-1.5 px-3 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                              demoState.varType === type
                                ? 'bg-sky-500 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Fuel Value Injection: {demoState.fuelVal}%</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={demoState.fuelVal}
                        onChange={(e) => {
                          setDemoState((prev) => ({ ...prev, fuelVal: Number(e.target.value) }));
                          onTriggerVisualAction('vault-charge');
                        }}
                        className="w-full accent-sky-400 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-sky-300">
                    {demoState.varType === 'const' ? (
                      <span>
                        <strong className="text-amber-400">const</strong> fuel = {demoState.fuelVal}; // Locked
                        in memory! Reassignment prohibited.
                      </span>
                    ) : (
                      <span>
                        <strong className="text-sky-400">let</strong> fuel = {demoState.fuelVal}; // Dynamic!
                        Can be reassigned at any time.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {station.id === 5 && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-pink-400" />
                    <span>3D Holo-Drone Object Mutator</span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-slate-400">Chassis Glow Color:</span>
                    {[
                      { name: 'Cyan', color: '#06b6d4' },
                      { name: 'Magenta', color: '#ec4899' },
                      { name: 'Emerald', color: '#10b981' },
                      { name: 'Amber', color: '#f59e0b' },
                    ].map((swatch) => (
                      <button
                        key={swatch.name}
                        onClick={() => handleDemoDroneChange(swatch.color)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          demoState.droneHue === swatch.color ? 'scale-110 border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: swatch.color }}
                        title={`Set drone color to ${swatch.name}`}
                      />
                    ))}
                    <button
                      onClick={() => onTriggerVisualAction('drone-hover')}
                      className="ml-auto px-3 py-1.5 bg-pink-500/20 border border-pink-500/40 text-pink-300 hover:bg-pink-500/30 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Call drone.fly() in 3D
                    </button>
                  </div>
                </div>
              )}

              {/* Key Concept Snippet Cards */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Essential Syntax & Rules
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {station.keyConcepts.map((concept, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{concept.title}</span>
                      </div>
                      <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-[11px] sm:text-xs text-sky-300 overflow-x-auto">
                        <code>{concept.code}</code>
                      </pre>
                      <p className="text-xs text-slate-400 leading-relaxed">{concept.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proceed to challenge button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    playClick();
                    setActiveTab('challenge');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                >
                  <span>Ready to Code: Enter Lab Challenge</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Hands-on Code Lab */}
          {activeTab === 'challenge' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Challenge Instructions */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{station.challenge.title}</span>
                  </h3>
                  <button
                    onClick={() => {
                      playClick();
                      setShowHint(!showHint);
                    }}
                    className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{station.challenge.instructions}</p>
                {showHint && (
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs">
                    💡 <strong>Hint:</strong> {station.challenge.hint}
                  </div>
                )}
              </div>

              {/* Code Editor Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-mono text-[11px] flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    <span>solution.js</span>
                  </span>
                  <button
                    onClick={handleResetCode}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset starter code</span>
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 font-mono text-xs">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    rows={8}
                    className="w-full p-3.5 bg-transparent text-emerald-300 font-mono text-xs resize-none focus:outline-none selection:bg-sky-900"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunCode}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Run Code & Verify</span>
                  </button>
                </div>

                {challengeStatus === 'success' && (
                  <button
                    onClick={() => {
                      playClick();
                      setActiveTab('quiz');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-sky-500/20 border border-sky-500/40 hover:bg-sky-500/30 text-sky-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <span>Proceed to Quiz</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Terminal Console Output */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-xs">
                <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px] font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Interactive Console Output</span>
                  </span>
                  <span>{consoleEntries.length} log(s)</span>
                </div>
                <div className="p-3 max-h-40 overflow-y-auto space-y-1.5 font-mono text-[11px]">
                  {consoleEntries.map((log) => (
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
                      <span className="text-slate-600 select-none text-[10px]">{log.timestamp}</span>
                      <span>› {log.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Knowledge Quiz */}
          {activeTab === 'quiz' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white leading-relaxed">
                  {station.quiz.question}
                </h3>

                <div className="space-y-2">
                  {station.quiz.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === station.quiz.correctIndex;

                    let btnClass = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';
                    if (quizSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={quizSubmitted}
                        className={`w-full p-3 text-left rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-sky-400">Explanation:</span>
                    <p className="text-slate-300 leading-relaxed">{station.quiz.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar: Previous / Next Station */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              playClick();
              if (station.id > 1) onSelectStation((station.id - 1) as StationId);
            }}
            disabled={station.id <= 1}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-slate-800 transition-all ${
              station.id <= 1
                ? 'opacity-30 cursor-not-allowed text-slate-600'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Station</span>
          </button>

          <span className="text-xs font-mono text-slate-500">
            Station {station.id} of 8
          </span>

          <button
            onClick={() => {
              playClick();
              if (station.id < 8) onSelectStation((station.id + 1) as StationId);
            }}
            disabled={station.id >= 8}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-slate-800 transition-all ${
              station.id >= 8
                ? 'opacity-30 cursor-not-allowed text-slate-600'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer'
            }`}
          >
            <span>Next Station</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
