import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Crosshair,
  Globe,
  CheckCircle2,
  Lock,
  Layers,
  Database,
  GitBranch,
  Cpu,
  Repeat,
  Box,
  Zap,
  Radio,
  Sparkles,
} from 'lucide-react';
import { STATIONS } from '../data/curriculum';
import { StationId } from '../types';

interface BottomDockProps {
  activeStationId: StationId | null;
  completedStations: number[];
  onSelectStation: (id: StationId) => void;
  onOverviewView: () => void;
  onCenterCoreView: () => void;
  onInspectActive: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Database,
  GitBranch,
  Cpu,
  Repeat,
  Box,
  Zap,
  Radio,
  Sparkles,
};

export const BottomDock: React.FC<BottomDockProps> = ({
  activeStationId,
  completedStations,
  onSelectStation,
  onOverviewView,
  onCenterCoreView,
  onInspectActive,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Keyboard shortcut 'H' to toggle dock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'h' || e.key === 'H') {
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="fixed z-20 transition-transform duration-300 pointer-events-auto"
      style={{
        bottom: '18px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isCollapsed ? 'calc(100% - 32px)' : '0'})`,
        maxWidth: 'min(960px, 95vw)',
        width: '100%',
      }}
    >
      {/* Collapse / Expand Tab Button */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 border border-slate-700 hover:border-sky-500/60 rounded-full text-[11px] font-semibold text-slate-300 hover:text-white shadow-md transition-all cursor-pointer"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Show Lab Dock (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Hide Dock (H)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-2.5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left: Camera / Navigation Quick View Modes */}
        <div className="flex items-center gap-1.5 w-full md:w-auto justify-center md:justify-start pb-1.5 md:pb-0 border-b md:border-b-0 md:border-r border-slate-800 md:pr-3">
          <button
            onClick={onOverviewView}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Bird's Eye Lab Overview"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            onClick={onCenterCoreView}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Focus Quantum Core Reactor"
          >
            <Crosshair className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">JS Core</span>
          </button>

          {activeStationId && (
            <button
              onClick={onInspectActive}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-950/80 border border-sky-800/80 hover:bg-sky-900 text-sky-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Inspect Current Station Apparatus"
            >
              <Eye className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">Inspect</span>
            </button>
          )}
        </div>

        {/* Center: 8 Station Selectors */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full md:w-auto py-0.5 px-1 scrollbar-none justify-start md:justify-center">
          {STATIONS.map((station) => {
            const isCompleted = completedStations.includes(station.id);
            const isActive = activeStationId === station.id;
            const IconComponent = ICON_MAP[station.icon] || Layers;

            return (
              <button
                key={station.id}
                onClick={() => onSelectStation(station.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap relative ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20 scale-105'
                    : isCompleted
                    ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60'
                    : 'bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-750 hover:text-white'
                }`}
                title={`Station 0${station.id}: ${station.title}`}
              >
                <span className="font-mono text-[11px] opacity-80">0{station.id}</span>
                <IconComponent className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{station.shortTitle}</span>

                {isCompleted && !isActive && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 absolute -top-1 -right-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
