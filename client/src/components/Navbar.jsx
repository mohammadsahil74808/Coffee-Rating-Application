import React from 'react';
import { Coffee, Plus, RotateCcw, Volume2, VolumeX, Database, Sparkles, CheckCircle2 } from 'lucide-react';
import { toggleSound, isSoundEnabled } from '../utils/sound';

export default function Navbar({
  storageMode,
  onOpenAddModal,
  onResetDb,
  soundOn,
  setSoundOn
}) {
  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#16110e]/90 backdrop-blur-md border-b border-[#2d221b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#c8965a] to-[#78492a] flex items-center justify-center shadow-lg shadow-[#c8965a]/20 border border-[#e8ba7a]/30">
            <Coffee className="w-6 h-6 text-[#120e0b] animate-bean" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8ba7a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c8965a]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white font-editorial">
                RoastRank
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#c8965a]/15 text-[#e8ba7a] border border-[#c8965a]/30">
                Specialty V1.0
              </span>
            </div>
            <p className="text-xs text-[#a8988a]">Community Cupping & Live Coffee Rating</p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          
          {/* Storage Mode Badge */}
          <div 
            title={storageMode === 'backend' ? 'Live connected to SQLite Backend (Port 5000)' : 'Client-side persistent database active (GitHub Pages Mode)'}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
              storageMode === 'backend'
                ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                : 'bg-amber-950/40 border-amber-700/50 text-amber-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${storageMode === 'backend' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              {storageMode === 'backend' ? 'SQLite Backend Active' : 'Persistent Storage (GH Pages)'}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? 'Sound feedback ON' : 'Sound feedback OFF'}
            className="p-2.5 rounded-xl bg-[#231a14] hover:bg-[#2d221b] border border-[#3d2f25] text-[#d6c7b8] hover:text-white transition-all"
            aria-label="Toggle Sound Effects"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#c8965a]" /> : <VolumeX className="w-4 h-4 text-[#756455]" />}
          </button>

          {/* Reset DB Button */}
          <button
            onClick={onResetDb}
            title="Reset vote counts to default seed data"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#231a14] hover:bg-[#2d221b] border border-[#3d2f25] text-xs text-[#b8a798] hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#a8988a]" />
            <span>Reset DB</span>
          </button>

          {/* Add Coffee Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c8965a] to-[#a8743a] hover:from-[#d8a66a] hover:to-[#b8844a] text-[#120e0b] font-semibold text-sm shadow-md shadow-[#c8965a]/25 hover:shadow-[#c8965a]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Add Coffee</span>
          </button>

        </div>
      </div>
    </header>
  );
}
