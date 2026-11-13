import React from 'react';
import { Trophy, Flame, Award, Globe2, Sparkles, TrendingUp } from 'lucide-react';

export default function StatsHeader({ stats, coffees }) {
  const totalVotes = stats?.totalVotes || coffees.reduce((s, c) => s + (c.votes || 0), 0);
  const totalCoffees = stats?.totalCoffees || coffees.length;
  
  // Calculate top coffee
  const sorted = [...coffees].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const leader = sorted[0];

  // Calculate average cupping score
  const avgCupping = (
    coffees.reduce((s, c) => s + (parseFloat(c.cupping_score) || 88), 0) / (coffees.length || 1)
  ).toFixed(1);

  // Calculate roast shares
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

  return (
    <section className="relative overflow-hidden pt-8 pb-10 border-b border-[#2d221b] bg-gradient-to-b from-[#18120e] via-[#140e0b] to-[#120e0b]">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#c8965a]/5 blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#261c16] border border-[#3d2e24] text-xs font-medium text-[#e8ba7a] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#c8965a]" />
            <span>Cast your vote to shape the Global Specialty Leaderboard</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-editorial mb-4">
            Discover & Vote for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8ba7a] via-[#c8965a] to-[#a8743a]">Finest Roasts</span>
          </h2>

          <p className="text-base text-[#a8988a] leading-relaxed">
            Every click commits an atomic vote to the database. Explore microlots from Yirgacheffe to Boquete, inspect flavor chemistry, and elevate your favorite cup.
          </p>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Card 1: Total Votes */}
          <div className="p-5 rounded-2xl bg-[#1c1511]/80 border border-[#2e231c] hover:border-[#c8965a]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-[#9e8d7f]">Total Votes</span>
              <div className="p-2 rounded-xl bg-[#c8965a]/10 text-[#e8ba7a]">
                <Flame className="w-4 h-4 text-[#c8965a]" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-editorial tracking-tight">
              {totalVotes.toLocaleString()}
            </div>
            <p className="text-xs text-[#8c7b6e] mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400 inline" />
              <span>Real-time DB synced</span>
            </p>
          </div>

          {/* Card 2: Leader */}
          <div className="p-5 rounded-2xl bg-[#1c1511]/80 border border-[#2e231c] hover:border-[#c8965a]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-[#9e8d7f]">Current #1 Leader</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="text-lg font-bold text-white truncate font-editorial" title={leader?.name}>
              {leader ? leader.name : 'Loading...'}
            </div>
            <p className="text-xs text-[#c8965a] mt-1 font-semibold">
              {leader ? `${leader.votes} votes (${leader.origin})` : 'Awaiting votes'}
            </p>
          </div>

          {/* Card 3: Cupping Score */}
          <div className="p-5 rounded-2xl bg-[#1c1511]/80 border border-[#2e231c] hover:border-[#c8965a]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-[#9e8d7f]">Avg Cupping Score</span>
              <div className="p-2 rounded-xl bg-[#c8965a]/10 text-[#e8ba7a]">
                <Award className="w-4 h-4 text-[#c8965a]" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-editorial tracking-tight">
              {avgCupping} <span className="text-sm font-normal text-[#9e8d7f]">/ 100</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1 font-medium">
              SCA Specialty Grade Tier
            </p>
          </div>

          {/* Card 4: Catalog */}
          <div className="p-5 rounded-2xl bg-[#1c1511]/80 border border-[#2e231c] hover:border-[#c8965a]/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-[#9e8d7f]">Single Origins</span>
              <div className="p-2 rounded-xl bg-[#c8965a]/10 text-[#e8ba7a]">
                <Globe2 className="w-4 h-4 text-[#c8965a]" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-editorial tracking-tight">
              {totalCoffees}
            </div>
            <p className="text-xs text-[#8c7b6e] mt-1">
              Curated international lots
            </p>
          </div>

        </div>

        {/* Roast Popularity Bar */}
        <div className="p-4 rounded-2xl bg-[#18120e] border border-[#2a1f18] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#b8a798]">
            <span className="font-semibold text-white">Roast Preference Distribution:</span>
            <span>Community vote breakdown</span>
          </div>

          <div className="w-full md:w-2/3 flex flex-col gap-2">
            <div className="w-full h-2.5 rounded-full bg-[#261c16] overflow-hidden flex">
              <div 
                style={{ width: `${lightPct}%` }} 
                className="bg-amber-300 transition-all duration-700"
                title={`Light Roast: ${lightPct}%`}
              />
              <div 
                style={{ width: `${mediumPct}%` }} 
                className="bg-[#c8965a] transition-all duration-700"
                title={`Medium Roast: ${mediumPct}%`}
              />
              <div 
                style={{ width: `${darkPct}%` }} 
                className="bg-[#663b1e] transition-all duration-700"
                title={`Dark Roast: ${darkPct}%`}
              />
            </div>

            <div className="flex justify-between text-[11px] text-[#9e8d7f]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                Light: {lightPct}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c8965a]"></span>
                Medium: {mediumPct}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#663b1e]"></span>
                Dark: {darkPct}%
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
