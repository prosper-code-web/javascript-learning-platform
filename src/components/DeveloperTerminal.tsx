import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, X, Sparkles, HelpCircle } from 'lucide-react';
import { playClick, playDataPulse, playError } from '../sound';

interface DeveloperTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TerminalLog {
  id: string;
  type: 'in' | 'out' | 'error' | 'info';
  content: string;
  timestamp: string;
}

export const DeveloperTerminal: React.FC<DeveloperTerminalProps> = ({ isOpen, onClose }) => {
  const [inputCode, setInputCode] = useState('');
  const [history, setHistory] = useState<TerminalLog[]>([
    {
      id: '1',
      type: 'info',
      content: 'JavaScript Developer Console v2026.1 (Interactive REPL ready). Type any JS expression (e.g. [1,2,3].map(x => x*10))',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  if (!isOpen) return null;

  const handleExecute = () => {
    if (!inputCode.trim()) return;
    playClick();

    const code = inputCode.trim();
    const time = new Date().toLocaleTimeString();

    const newLogs: TerminalLog[] = [
      {
        id: Math.random().toString(),
        type: 'in',
        content: `› ${code}`,
        timestamp: time,
      },
    ];

    try {
      // Evaluate expression or statement safely using indirect eval
      const result = (0, eval)(code);
      playDataPulse();
      newLogs.push({
        id: Math.random().toString(),
        type: 'out',
        content: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result),
        timestamp: time,
      });
    } catch (err: any) {
      playError();
      newLogs.push({
        id: Math.random().toString(),
        type: 'error',
        content: `Uncaught ${err?.name || 'Error'}: ${err?.message}`,
        timestamp: time,
      });
    }

    setHistory((prev) => [...prev, ...newLogs]);
    setInputCode('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecute();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs pointer-events-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-3xl h-[560px] max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 font-mono text-xs font-bold">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Interactive JavaScript REPL Terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistory([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs bg-slate-950">
          {history.map((item) => (
            <div
              key={item.id}
              className={`leading-relaxed whitespace-pre-wrap ${
                item.type === 'in'
                  ? 'text-sky-300 font-semibold'
                  : item.type === 'out'
                  ? 'text-emerald-300 pl-4'
                  : item.type === 'error'
                  ? 'text-rose-400 pl-4'
                  : 'text-slate-400'
              }`}
            >
              {item.content}
            </div>
          ))}
        </div>

        {/* Command Input Prompt */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 font-mono text-xs">
          <span className="text-emerald-400 font-bold select-none">js&gt;</span>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type JS expression (e.g. ['a', 'b'].join('-') or 2 ** 10)..."
            className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-600"
            autoFocus
          />
          <button
            onClick={handleExecute}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
          >
            Run
          </button>
        </div>
      </div>
    </div>
  );
};
