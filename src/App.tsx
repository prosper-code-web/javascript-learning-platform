import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  BookOpen,
  Box,
  Terminal as TerminalIcon,
  Award,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { W3Sidebar } from './components/W3Sidebar';
import { W3LessonView } from './components/W3LessonView';
import { DeveloperTerminal } from './components/DeveloperTerminal';
import { CertificateModal } from './components/CertificateModal';
import { ThreeCanvas } from './components/ThreeCanvas';
import { BottomDock } from './components/BottomDock';
import { StationModal } from './components/StationModal';
import { SandboxModal } from './components/SandboxModal';
import { LabScene } from './three/LabScene';
import { W3_CURRICULUM, Lesson } from './data/w3curriculum';
import { STATIONS } from './data/curriculum';
import { StationId } from './types';
import { setSoundMuted, playClick, playWarp } from './sound';

export default function App() {
  // Mode: 'course' (W3Schools style + 3D Visualizer + Terminal) vs '3d-arena' (Full 3D Room)
  const [viewMode, setViewMode] = useState<'course' | '3d-arena'>('course');

  // W3 Course state
  const allLessons: Lesson[] = W3_CURRICULUM.flatMap((c) => c.lessons);
  const [currentLessonId, setCurrentLessonId] = useState<string>(allLessons[0].id);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Completed Lessons Persistence
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('js_w3_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('js_w3_completed_lessons', JSON.stringify(completedLessons));
    } catch {}
  }, [completedLessons]);

  // 3D Arena state
  const sceneRef = useRef<LabScene | null>(null);
  const [activeStationId, setActiveStationId] = useState<StationId | null>(null);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [completedStations, setCompletedStations] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('js_hololab_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];

  const handleSelectLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteLesson = (lessonId: string) => {
    setCompletedLessons((prev) => {
      if (!prev.includes(lessonId)) {
        const next = [...prev, lessonId];
        if (next.length === allLessons.length) {
          setTimeout(() => setIsCertificateOpen(true), 1500);
        }
        return next;
      }
      return prev;
    });
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      playClick();
      handleSelectLesson(allLessons[currentLessonIndex - 1].id);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      playClick();
      handleSelectLesson(allLessons[currentLessonIndex + 1].id);
    }
  };

  // Sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setSoundMuted(!next);
  };

  // Reset Progress
  const handleResetProgress = () => {
    if (window.confirm('Reset all course and lab progress to start fresh?')) {
      setCompletedLessons([]);
      setCompletedStations([]);
      try {
        localStorage.removeItem('js_w3_completed_lessons');
        localStorage.removeItem('js_hololab_completed');
      } catch {}
    }
  };

  // 3D Arena Station handler
  const handleSelectStation = (stationId: StationId) => {
    setActiveStationId(stationId);
    setIsStationModalOpen(true);
    playWarp();
    if (sceneRef.current) {
      sceneRef.current.focusStation(stationId);
    }
  };

  const progressPercent = Math.round((completedLessons.length / allLessons.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Application Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between shadow-sm">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          {viewMode === 'course' && (
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center font-mono font-bold text-sky-400 text-sm">
              JS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-tight">JS HoloLab</span>
                <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800 font-mono hidden sm:inline">
                  W3-Grade Course & 3D Lab
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: View Mode Switcher (Course vs 3D Arena) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => {
              playClick();
              setViewMode('course');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'course'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Course & Terminal</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setViewMode('3d-arena');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === '3d-arena'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Lab Arena</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* REPL Terminal Button */}
          <button
            onClick={() => {
              playClick();
              setIsTerminalOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer"
            title="Open Interactive JavaScript Terminal"
          >
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Terminal</span>
          </button>

          {/* Certificate Button */}
          {completedLessons.length >= allLessons.length && (
            <button
              onClick={() => setIsCertificateOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Certificate</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset */}
          <button
            onClick={handleResetProgress}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-rose-400 hover:bg-slate-900 cursor-pointer"
            title="Reset Course Progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {viewMode === 'course' ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left W3Schools-Style Sidebar */}
          <W3Sidebar
            currentLessonId={currentLessonId}
            completedLessons={completedLessons}
            onSelectLesson={handleSelectLesson}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Lesson Content Area */}
          <main className="flex-1 lg:pl-80 overflow-y-auto pb-16">
            <W3LessonView
              lesson={currentLesson}
              isCompleted={completedLessons.includes(currentLesson.id)}
              onCompleteLesson={handleCompleteLesson}
              onPrevLesson={handlePrevLesson}
              onNextLesson={handleNextLesson}
              hasPrev={currentLessonIndex > 0}
              hasNext={currentLessonIndex < allLessons.length - 1}
            />
          </main>
        </div>
      ) : (
        /* Full 3D Lab Arena View */
        <div className="relative flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden">
          <ThreeCanvas onStationSelect={handleSelectStation} sceneRef={sceneRef} />

          <BottomDock
            activeStationId={activeStationId}
            completedStations={completedStations}
            onSelectStation={handleSelectStation}
            onOverviewView={() => sceneRef.current?.resetToOverview()}
            onCenterCoreView={() => sceneRef.current?.focusCenterCore()}
            onInspectActive={() => {
              if (activeStationId) {
                setIsStationModalOpen(true);
                sceneRef.current?.focusStation(activeStationId);
              }
            }}
          />

          {isStationModalOpen && activeStationId && (
            <StationModal
              station={STATIONS.find((s) => s.id === activeStationId)!}
              isCompleted={completedStations.includes(activeStationId)}
              onClose={() => setIsStationModalOpen(false)}
              onCompleteStation={(id) => {
                setCompletedStations((prev) => (prev.includes(id) ? prev : [...prev, id]));
              }}
              onSelectStation={handleSelectStation}
              onTriggerVisualAction={(act) => sceneRef.current?.triggerVisualAction(act)}
              onSetDroneColor={(c) => sceneRef.current?.setDroneEyeColor(c)}
            />
          )}

          {isSandboxOpen && (
            <SandboxModal
              onClose={() => setIsSandboxOpen(false)}
              onSetCoreSpeed={(speed) => {
                if (sceneRef.current) sceneRef.current.coreSpeed = speed;
              }}
              onTriggerVisualAction={(act) => sceneRef.current?.triggerVisualAction(act)}
              onSetDroneColor={(c) => sceneRef.current?.setDroneEyeColor(c)}
            />
          )}
        </div>
      )}

      {/* Floating REPL Developer Terminal */}
      <DeveloperTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

      {/* Certificate Modal */}
      {isCertificateOpen && (
        <CertificateModal onClose={() => setIsCertificateOpen(false)} />
      )}
    </div>
  );
}
