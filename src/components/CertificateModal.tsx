import React, { useState } from 'react';
import { X, Award, CheckCircle, Download, Sparkles, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { STATIONS } from '../data/curriculum';

interface CertificateModalProps {
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ onClose }) => {
  const [cadetName, setCadetName] = useState('Cadet Developer');

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs pointer-events-auto">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>JavaScript HoloLab Cadet Certificate</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Display Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 relative shadow-2xl text-center space-y-5">
            {/* Holographic Watermark Badge */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-mono font-black text-2xl shadow-lg shadow-amber-500/20">
              JS
            </div>

            <div>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                Certificate of Laboratory Mastery
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                JavaScript HoloLab Cadet
              </h2>
            </div>

            <div className="py-2 border-y border-slate-800/80">
              <p className="text-xs text-slate-400 mb-1">This certifies that</p>
              <input
                type="text"
                value={cadetName}
                onChange={(e) => setCadetName(e.target.value)}
                className="text-lg sm:text-xl font-bold text-center text-sky-400 bg-transparent border-b border-sky-500/40 focus:border-sky-400 outline-none px-2 py-0.5 max-w-xs"
                placeholder="Enter Your Name"
              />
              <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                has successfully completed all 8 physical apparatus stations in the 3D Virtual Lab,
                mastering Variables, Logic Gates, Functions, Arrays, Objects, DOM Events, Asynchronous Promises, and the Master Reactor.
              </p>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
              {STATIONS.map((s) => (
                <div
                  key={s.id}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center"
                  title={s.badgeName}
                >
                  <span className="font-mono text-[9px] text-sky-400">0{s.id}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">✓</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 font-mono">
              <span>Date: {new Date().toLocaleDateString()}</span>
              <span className="text-amber-400">ID: HOLO-JS-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={triggerConfetti}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Celebrate Again</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
