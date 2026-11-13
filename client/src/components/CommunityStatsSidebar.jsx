import React from 'react';
import { Flame, PieChart, Globe2, Plus, Sparkles, Layers } from 'lucide-react';

export default function CommunityStatsSidebar({ coffees, onOpenAddModal }) {
  const totalVotes = coffees.reduce((acc, c) => acc + (c.votes || 0), 0);

  // Roast breakdown
  const roastStats = coffees.reduce(
    (acc, c) => {
      const r = (c.roast_level || 'Medium').toLowerCase();
      if (r.includes('light')) acc.light += c.votes || 0;
      else if (r.includes('dark')) acc.dark += c.votes || 0;
      else acc.medium += c.votes || 0;
      return acc;
    },
    { light: 0, medium: 0, dark: 0 }
  );

  const safeTotal = totalVotes || 1;
  const lightPct = Math.round((roastStats.light / safeTotal) * 100);
  const mediumPct = Math.round((roastStats.medium / safeTotal) * 100);
  const darkPct = Math.max(0, 100 - lightPct - mediumPct);

  // Unique origins
  const origins = Array.from(new Set(coffees.map(c => c.origin.split(',')[0].trim()))).slice(0, 5);

  return (
    <aside className="space-y-5">
      
      {/* Roast Distribution Card */}
      <div className="rounded-3xl bg-[#1a232f] border border-[#2b394a] p-4 sm:p-5 shadow-xl text-white">
        <div className="flex items-center justify-between pb-3 border-b border-[#293749] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/15 text-orange-400">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-100">
                Roast Share
              </h3>
              <p className="text-[10px] text-slate-400">Community flavor preference</p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-400">
            {totalVotes.toLocaleString()} votes
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 rounded-full bg-[#141c26] overflow-hidden flex mb-3 p-0.5 border border-[#263342]">
          <div style={{ width: `${lightPct}%` }} className="bg-amber-300 h-full rounded-l-full" title={`Light Roast: ${lightPct}%`} />
          <div style={{ width: `${mediumPct}%` }} className="bg-[#c8965a] h-full" title={`Medium Roast: ${mediumPct}%`} />
          <div style={{ width: `${darkPct}%` }} className="bg-[#663b1e] h-full rounded-r-full" title={`Dark Roast: ${darkPct}%`} />
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300 inline-block"></span>
              Light Roast (Bright & Floral)
            </span>
            <strong className="text-white font-bold">{lightPct}%</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c8965a] inline-block"></span>
              Medium Roast (Balanced)
            </span>
            <strong className="text-white font-bold">{mediumPct}%</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#663b1e] inline-block"></span>
              Dark Roast (Bold & Smoky)
            </span>
            <strong className="text-white font-bold">{darkPct}%</strong>
          </div>
        </div>
      </div>

      {/* Specialty Origins */}
      <div className="rounded-3xl bg-[#1a232f] border border-[#2b394a] p-4 sm:p-5 shadow-xl text-white">
        <div className="flex items-center gap-2 pb-3 border-b border-[#293749] mb-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-100">
              Featured Terroirs
            </h3>
            <p className="text-[10px] text-slate-400">High-altitude origin belts</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {origins.map((origin, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-[#141c26] border border-[#263342] text-[11px] font-medium text-slate-300"
            >
              📍 {origin}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Add Promo Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0284c7]/20 via-[#1a232f] to-[#141c26] border border-sky-500/30 p-5 shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider mb-2 border border-sky-500/30">
            <Sparkles className="w-3 h-3 text-sky-400" /> Community Driven
          </div>
          <h4 className="text-base font-extrabold text-white mb-1">
            Know a Great Coffee?
          </h4>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Submit your favorite roaster or micro-lot directly to the live database for voting.
          </p>

          <button
            onClick={onOpenAddModal}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0284c7]/30 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Submit Coffee to Database</span>
          </button>
        </div>
      </div>

    </aside>
  );
}
