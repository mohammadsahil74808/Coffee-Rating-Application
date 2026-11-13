import React from 'react';
import { Trophy, Award, Sparkles, Thermometer, Droplets, Clock, Flame } from 'lucide-react';
import { CoffeeIllustration } from './CoffeeIllustrations';

export default function LeaderboardSidebar({ coffees, onOpenDetails }) {
  // Sort coffees by votes desc
  const sorted = [...coffees].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const topThree = sorted.slice(0, 3);

  const getMedalColor = (idx) => {
    if (idx === 0) return 'from-amber-400 to-amber-600 text-slate-950 border-amber-300 shadow-amber-500/30';
    if (idx === 1) return 'from-slate-200 to-slate-400 text-slate-950 border-slate-200 shadow-slate-400/20';
    return 'from-amber-700 to-amber-900 text-amber-100 border-amber-600 shadow-amber-800/20';
  };

  return (
    <aside className="space-y-5">
      
      {/* Leaderboard Card */}
      <div className="rounded-3xl bg-[#1a232f] border border-[#2b394a] p-4 sm:p-5 shadow-xl text-white">
        <div className="flex items-center justify-between pb-3 border-b border-[#293749] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-100">
                Top Rated Podium
              </h3>
              <p className="text-[10px] text-slate-400">Current community leaders</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Live Rank
          </span>
        </div>

        {/* Podium Items */}
        <div className="space-y-3">
          {topThree.map((coffee, idx) => (
            <div
              key={coffee.id}
              onClick={() => onOpenDetails(coffee)}
              className="p-3 rounded-2xl bg-[#141c26] hover:bg-[#182230] border border-[#263342] hover:border-[#38495c] transition-all cursor-pointer flex items-center gap-3 group"
            >
              {/* Medal */}
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br font-black text-xs flex items-center justify-center shrink-0 border shadow-md ${getMedalColor(idx)}`}>
                #{idx + 1}
              </div>

              {/* Illustration Thumbnail */}
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center p-1 border border-white/5 shrink-0 group-hover:scale-105 transition-transform">
                <CoffeeIllustration type={coffee.icon_type} className="w-full h-full" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                  {coffee.name}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  {coffee.origin} • {coffee.roast_level}
                </p>
              </div>

              {/* Vote Count */}
              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold text-[#38bdf8]">
                  {coffee.votes}
                </span>
                <span className="text-[9px] text-slate-500 block -mt-0.5">votes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialty Barista Brewing Guide */}
      <div className="rounded-3xl bg-[#1a232f] border border-[#2b394a] p-4 sm:p-5 shadow-xl text-white">
        <div className="flex items-center gap-2 pb-3 border-b border-[#293749] mb-4">
          <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-100">
              Barista Brew Guide
            </h3>
            <p className="text-[10px] text-slate-400">Optimal cup extraction standards</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141c26] border border-[#263342]">
            <span className="text-slate-400 flex items-center gap-2">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Water Temp
            </span>
            <strong className="text-slate-100 font-bold">92°C – 94°C</strong>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141c26] border border-[#263342]">
            <span className="text-slate-400 flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              Ratio (V60)
            </span>
            <strong className="text-slate-100 font-bold">1:16 (15g / 240g)</strong>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141c26] border border-[#263342]">
            <span className="text-slate-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Brew Time
            </span>
            <strong className="text-slate-100 font-bold">2m 45s – 3m 15s</strong>
          </div>
        </div>
      </div>

    </aside>
  );
}
