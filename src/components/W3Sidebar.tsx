import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Sparkles,
  Type,
  ListOrdered,
  Box,
  Cpu,
  Radio,
  Layers,
  Calculator,
  GitBranch,
  Layout,
  Database,
  Zap,
} from 'lucide-react';
import { W3_CURRICULUM, Lesson } from '../data/w3curriculum';
import { playClick } from '../sound';

interface W3SidebarProps {
  currentLessonId: string;
  completedLessons: string[];
  onSelectLesson: (lessonId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Type,
  Calculator,
  GitBranch,
  ListOrdered,
  Box,
  Cpu,
  Layout,
  Radio,
  Database,
  Zap,
};

export const W3Sidebar: React.FC<W3SidebarProps> = ({
  currentLessonId,
  completedLessons,
  onSelectLesson,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'js-basics': true,
    'js-strings': true,
    'js-numbers-math': true,
    'js-control-flow': true,
    'js-arrays-masterclass': true,
    'js-objects': true,
    'js-functions': true,
    'js-dom-events': true,
    'js-async': true,
    'js-storage-json': true,
    'js-es6-superpowers': true,
  });

  const toggleCategory = (catId: string) => {
    playClick();
    setOpenCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Filter lessons based on search query
  const filteredCurriculum = W3_CURRICULUM.map((cat) => {
    const matchingLessons = cat.lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.theory.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, lessons: matchingLessons };
  }).filter((cat) => cat.lessons.length > 0);

  const totalLessons = W3_CURRICULUM.reduce((sum, c) => sum + c.lessons.length, 0);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-14 bottom-0 left-0 w-72 sm:w-80 bg-slate-950 border-r border-slate-800 z-30 flex flex-col transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Search Header */}
        <div className="p-3.5 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search JS curriculum (arrays, etc.)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Course Index</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {completedLessons.length} / {totalLessons} Mastered
            </span>
          </div>
        </div>

        {/* Scrollable Curriculum Tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredCurriculum.map((cat) => {
            const isOpen = openCategories[cat.id] ?? true;
            const CatIcon = ICON_MAP[cat.iconName] || Layers;
            const catCompleted = cat.lessons.filter((l) => completedLessons.includes(l.id)).length;

            return (
              <div key={cat.id} className="rounded-xl overflow-hidden mb-1">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between p-2.5 bg-slate-900/60 hover:bg-slate-900 rounded-xl text-left text-xs font-bold text-slate-300 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <CatIcon className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                    <span>{cat.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500">
                      {catCompleted}/{cat.lessons.length}
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                </button>

                {/* Lessons in Category */}
                {isOpen && (
                  <div className="pl-4 pr-1 py-1 space-y-0.5">
                    {cat.lessons.map((lesson) => {
                      const isActive = currentLessonId === lesson.id;
                      const isComplete = completedLessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            playClick();
                            onSelectLesson(lesson.id);
                            onCloseMobile();
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer text-left ${
                            isActive
                              ? 'bg-sky-500 text-slate-950 font-bold shadow-sm shadow-sky-500/20'
                              : isComplete
                              ? 'text-emerald-300 hover:bg-slate-900'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <span className="truncate pr-2">{lesson.title}</span>
                          {isComplete && (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? 'text-slate-950' : 'text-emerald-400'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
