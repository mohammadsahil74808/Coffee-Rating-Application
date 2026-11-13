import React from 'react';
import { ArrowRight, Database, Server, MousePointerClick, CheckCircle2 } from 'lucide-react';

export default function FlowInspector({ lastVotedCoffee, isVoting }) {
  return (
    <aside className="w-full lg:w-96 flex flex-col gap-4">
      {/* Educational Header */}
      <div className="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] text-white shadow-xl">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-sky-400">
          <Server className="w-4 h-4" />
          <span>Interactive Architecture Flow</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Watch how each user click triggers client events, executes backend business logic, and commits atomic database updates.
        </p>
      </div>

      {/* Step 1: User Click Event */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 shadow-lg ${
        isVoting
          ? 'bg-sky-950/70 border-sky-500 ring-2 ring-sky-500/30'
          : 'bg-[#1b2533] border-[#293548]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <MousePointerClick className="w-4 h-4" />
            1. User Click Event
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            isVoting ? 'bg-sky-500 text-slate-900 animate-pulse' : 'bg-slate-700 text-slate-300'
          }`}>
            {isVoting ? 'ACTIVE CLICK' : 'LISTENING'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-200">
          <code>
            {'onClick={() => handleVote('}
            <span className="text-amber-400">{lastVotedCoffee?.id || 4}</span>
            {')'}
          </code>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Target: <strong className="text-white">{lastVotedCoffee?.name || 'Vanilla Latte'}</strong>
        </p>
      </div>

      {/* Connecting Arrow */}
      <div className="flex justify-center -my-2 text-sky-400">
        <ArrowRight className="w-5 h-5 rotate-90" />
      </div>

      {/* Step 2: Backend Logic Handling */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 shadow-lg ${
        isVoting
          ? 'bg-amber-950/70 border-amber-500 ring-2 ring-amber-500/30'
          : 'bg-[#1b2533] border-[#293548]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Server className="w-4 h-4" />
            2. Backend Logic Handling
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
            POST /api/coffees/:id/vote
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 leading-relaxed overflow-x-auto">
          <pre>{`async function incrementVote(id) {
  const current = await db.get(id);
  const updated = current.votes + 1;
  return await db.commit(id, updated);
}`}</pre>
        </div>
      </div>

      {/* Connecting Arrow */}
      <div className="flex justify-center -my-2 text-sky-400">
        <ArrowRight className="w-5 h-5 rotate-90" />
      </div>

      {/* Step 3: Database Update */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 shadow-lg ${
        isVoting
          ? 'bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-500/30'
          : 'bg-[#1b2533] border-[#293548]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Database className="w-4 h-4" />
            3. Database Persistence
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> ATOMIC COMMIT
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-sky-300">
          <code>
            UPDATE coffees<br />
            SET votes = votes + 1<br />
            WHERE id = <span className="text-amber-400">{lastVotedCoffee?.id || 4}</span>;
          </code>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Current Count: <strong className="text-white">{lastVotedCoffee?.votes || 125} votes</strong> stored in database.
        </p>
      </div>
    </aside>
  );
}
