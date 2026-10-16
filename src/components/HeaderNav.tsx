import React from 'react';
import { Volume2, VolumeX, Sparkles, Award, RotateCcw, Compass, BookOpen } from 'lucide-react';
import { StationData } from '../types';

interface HeaderNavProps {
  activeStation: StationData | null;
  completedStations: number[];
  totalStations: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSandbox: () => void;
  onOpenCertificate: () => void;
  onResetProgress: () => void;
  onShowOverview: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeStation,
  completedStations,
  totalStations,
  soundEnabled,
  onToggleSound,
  onOpenSandbox,
  onOpenCertificate,
  onResetProgress,
  onShowOverview,
}) => {
  const progressPercent = Math.round((completedStations.length / totalStations) * 100);
  const isAllComplete = completedStations.length === totalStations;

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-3 md:p-4 flex items-center justify-between">
      {/* Left: Branding & Status */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onClick={onShowOverview}
          className="flex items-center gap-2.5 px-3 py-2 bg-slate-900/90 border border-slate-700/80 hover:border-sky-500/80 text-white rounded-xl shadow-lg transition-all backdrop-blur-sm group cursor-pointer"
          title="Return to Lab Overview"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-mono font-bold text-base group-hover:scale-105 transition-transform">
            JS
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <span>HoloLab 3D</span>
              <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800">
                v1.0
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>JavaScript Learning Space</span>
            </div>
          </div>
        </button>

        {activeStation && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs text-slate-300">
            <span className="text-slate-400">Current Station:</span>
            <span className="font-semibold text-sky-400 font-mono">0{activeStation.id}</span>
            <span className="text-white font-medium">{activeStation.shortTitle}</span>
          </div>
        )}
      </div>

      {/* Right: Controls & Progress */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Progress Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200">
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Mastery Progress</span>
            <span className="font-mono font-semibold text-emerald-400">
              {completedStations.length}/{totalStations} ({progressPercent}%)
            </span>
          </div>
          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Certificate Button */}
        {isAllComplete && (
          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Claim Certificate!</span>
          </button>
        )}

        {/* Sandbox Button */}
        <button
          onClick={onOpenSandbox}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white rounded-xl text-xs font-semibold shadow-lg transition-all cursor-pointer"
          title="Open Freeform JavaScript Reactor & Sandbox"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">JS Reactor</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl shadow-lg transition-all cursor-pointer"
          title={soundEnabled ? 'Mute Procedural Lab Sounds' : 'Unmute Sounds'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Reset Progress */}
        <button
          onClick={onResetProgress}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-400 hover:text-rose-400 rounded-xl shadow-lg transition-all cursor-pointer"
          title="Reset Lab Progress"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
