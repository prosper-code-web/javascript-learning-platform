import React, { useState } from 'react';
import { X, Play, RotateCcw, Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';
import { ConsoleEntry } from '../types';
import { playClick, playSuccess, playError, playDataPulse } from '../sound';

interface SandboxModalProps {
  onClose: () => void;
  onSetCoreSpeed: (speed: number) => void;
  onTriggerVisualAction: (actionName: string) => void;
  onSetDroneColor: (color: string) => void;
}

const SNIPPETS = [
  {
    name: '3D Reactor Overdrive',
    code: `// Accelerate the 3D Central Core and trigger energy pulse!\nlab.setCoreSpeed(4.0);\nlab.triggerVisualAction('reactor-overdrive');\nconsole.log("⚡ Reactor ignited into Overdrive mode (4x spin)!");`,
  },
  {
    name: 'Drone Color Mutator',
    code: `// Change 3D Drone sensor to glowing magenta\nlab.setDroneEyeColor('#ec4899');\nlab.triggerVisualAction('drone-hover');\nconsole.log("🛸 Drone repulsor thrusters engaged with Magenta optics!");`,
  },
  {
    name: 'Array Method Pipeline',
    code: `// Filter and transform lab isotopes\nconst isotopes = [\n  { name: 'U-235', active: true, halfLife: 700 },\n  { name: 'Th-232', active: false, halfLife: 1400 },\n  { name: 'Pu-239', active: true, halfLife: 2400 }\n];\n\nconst activeIsotopes = isotopes\n  .filter(item => item.active)\n  .map(item => \`\${item.name} (\${item.halfLife} Myr)\`);\n\nconsole.log("Active Fuel Elements:", activeIsotopes);`,
  },
  {
    name: 'Async Promise Teleporter',
    code: `// Asynchronous cargo countdown simulation\nasync function dispatchWarp() {\n  console.log("🚀 Warming quantum coils...");\n  await new Promise(r => setTimeout(r, 600));\n  console.log("🌌 Teleportation matrix locked!");\n  lab.triggerVisualAction('vault-charge');\n}\n\ndispatchWarp();`,
  },
];

export const SandboxModal: React.FC<SandboxModalProps> = ({
  onClose,
  onSetCoreSpeed,
  onTriggerVisualAction,
  onSetDroneColor,
}) => {
  const [code, setCode] = useState(SNIPPETS[0].code);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([
    {
      id: 'init',
      type: 'info',
      content: 'JavaScript 3D Sandbox ready. The global `lab` object is wired directly to the 3D environment!',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const handleRunCode = () => {
    playClick();
    const newLogs: ConsoleEntry[] = [];

    const customConsole = {
      log: (...args: any[]) => {
        newLogs.push({
          id: Math.random().toString(),
          type: 'log',
          content: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
          timestamp: new Date().toLocaleTimeString(),
        });
      },
      warn: (...args: any[]) => {
        newLogs.push({
          id: Math.random().toString(),
          type: 'warn',
          content: args.map((a) => String(a)).join(' '),
          timestamp: new Date().toLocaleTimeString(),
        });
      },
      error: (...args: any[]) => {
        newLogs.push({
          id: Math.random().toString(),
          type: 'error',
          content: args.map((a) => String(a)).join(' '),
          timestamp: new Date().toLocaleTimeString(),
        });
      },
    };

    const labApi = {
      setCoreSpeed: (speed: number) => onSetCoreSpeed(speed),
      triggerVisualAction: (action: string) => onTriggerVisualAction(action),
      setDroneEyeColor: (color: string) => onSetDroneColor(color),
    };

    try {
      const runFn = new Function('console', 'lab', code);
      runFn(customConsole, labApi);
      playDataPulse();

      setConsoleEntries((prev) => [
        ...newLogs,
        {
          id: Math.random().toString(),
          type: 'success',
          content: '✓ Script evaluated smoothly in 3D Lab.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      playError();
      setConsoleEntries((prev) => [
        ...newLogs,
        {
          id: Math.random().toString(),
          type: 'error',
          content: `Error: ${err?.message || 'Execution error'}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs pointer-events-auto">
      <div className="bg-slate-900 border border-purple-500/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/20 border border-purple-400/40 rounded-xl text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">JavaScript 3D Reactor Sandbox</h2>
              <p className="text-xs text-slate-400">Write custom JavaScript code and control the 3D lab directly</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Snippets */}
        <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-slate-400 whitespace-nowrap">Load Preset:</span>
          {SNIPPETS.map((snippet) => (
            <button
              key={snippet.name}
              onClick={() => {
                playClick();
                setCode(snippet.code);
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap font-medium"
            >
              {snippet.name}
            </button>
          ))}
        </div>

        {/* Editor & Console */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 font-mono text-xs">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={9}
              className="w-full p-3.5 bg-transparent text-purple-300 font-mono text-xs resize-none focus:outline-none selection:bg-purple-900"
              spellCheck={false}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleRunCode}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Execute in 3D Lab</span>
            </button>
          </div>

          {/* Console */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-xs">
            <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Reactor Console</span>
              </span>
              <span>{consoleEntries.length} entries</span>
            </div>
            <div className="p-3 max-h-40 overflow-y-auto space-y-1 font-mono text-[11px]">
              {consoleEntries.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 ${
                    log.type === 'error'
                      ? 'text-rose-400'
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
      </div>
    </div>
  );
};
