import React, { useState } from 'react';
import { ThumbsUp, Award, MapPin, Mountain, Sparkles, ChevronRight, Check } from 'lucide-react';
import { playVoteSound } from '../utils/sound';
import { triggerVoteConfetti } from '../utils/confetti';

export default function CoffeeCard({
  coffee,
  rank,
  onVote,
  onOpenDetails,
  onTagClick
}) {
  const [isVoting, setIsVoting] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [floatingPlus, setFloatingPlus] = useState(false);

  const handleVoteClick = async (e) => {
    e.stopPropagation();
    if (isVoting) return;

    // Trigger immediate tactile feedback
    playVoteSound();
    triggerVoteConfetti(e);
    setFloatingPlus(true);
    setJustVoted(true);

    setTimeout(() => setFloatingPlus(false), 900);
    setTimeout(() => setJustVoted(false), 1500);

    setIsVoting(true);
    try {
      await onVote(coffee.id);
    } finally {
      setIsVoting(false);
    }
  };

  // Flavor notes array
  const notes = coffee.flavor_notes
    ? coffee.flavor_notes.split(',').map(n => n.trim())
    : [];

  // Roast badge color
  const getRoastStyle = (roast) => {
    const r = (roast || '').toLowerCase();
    if (r.includes('light')) {
      return {
        bg: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
        dot: 'bg-amber-300'
      };
    }
    if (r.includes('dark')) {
      return {
        bg: 'bg-stone-800 text-stone-300 border-stone-600',
        dot: 'bg-stone-400'
      };
    }
    return {
      bg: 'bg-[#c8965a]/15 text-[#e8ba7a] border-[#c8965a]/30',
      dot: 'bg-[#c8965a]'
    };
  };

  const roastStyle = getRoastStyle(coffee.roast_level);

  // Rank medals
  const getRankBadge = () => {
    if (rank === 1) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-[#120e0b] font-extrabold text-xs shadow-lg shadow-amber-500/30 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" /> #1 Top Pick
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="px-2 py-0.5 rounded-full bg-slate-300 text-slate-900 font-bold text-xs">
          #2 Rank
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="px-2 py-0.5 rounded-full bg-amber-700/80 text-amber-100 font-bold text-xs">
          #3 Rank
        </span>
      );
    }
    return null;
  };

  return (
    <article className="group relative flex flex-col rounded-3xl bg-[#19130f] border border-[#2a1f18] hover:border-[#c8965a]/40 shadow-xl shadow-black/40 hover:shadow-[#c8965a]/10 transition-all duration-300 overflow-hidden">
      
      {/* Coffee Photo Container */}
      <div className="relative h-52 w-full overflow-hidden bg-[#241a14]">
        <img
          src={coffee.image_url}
          alt={coffee.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#19130f] via-black/30 to-transparent"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div>{getRankBadge()}</div>

          <div className="flex items-center gap-2">
            {/* Cupping Score */}
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold text-xs flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-[#e8ba7a]" />
              {coffee.cupping_score} <span className="text-[10px] text-[#a8988a] font-normal">pts</span>
            </span>

            {/* Roast Level */}
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md flex items-center gap-1.5 ${roastStyle.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${roastStyle.dot}`}></span>
              {coffee.roast_level}
            </span>
          </div>
        </div>

        {/* Origin & Roaster Header on Image */}
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#e8ba7a] flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {coffee.origin}
          </p>
          <h3 className="text-xl font-bold text-white font-editorial tracking-tight drop-shadow-md">
            {coffee.name}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Roaster & Altitude info */}
          <div className="flex items-center justify-between text-xs text-[#a8988a] pb-3 border-b border-[#281c15] mb-3">
            <span className="font-medium text-[#d9c8b8]">{coffee.roaster}</span>
            <span className="flex items-center gap-1">
              <Mountain className="w-3 h-3 text-[#c8965a]" />
              {coffee.altitude}
            </span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-[#a8988a] line-clamp-2 leading-relaxed mb-4">
            {coffee.description}
          </p>

          {/* Flavor Notes Tags */}
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-wider text-[#7e6d61] font-semibold block mb-1.5">
              Tasting Notes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {notes.map((note, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(note);
                  }}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#241a14] hover:bg-[#c8965a]/20 border border-[#35251b] hover:border-[#c8965a]/40 text-[#d8c8b8] hover:text-[#e8ba7a] transition-all cursor-pointer"
                  title={`Filter by ${note}`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Cup Profile Mini Meters */}
          <div className="p-3 rounded-2xl bg-[#140e0b] border border-[#241913] mb-5">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <span className="text-[10px] text-[#7e6d61] block">Acidity</span>
                <span className="text-xs font-bold text-[#e8ba7a]">{coffee.acidity || 7}/10</span>
                <div className="w-full bg-[#241a14] h-1 rounded-full mt-1 overflow-hidden">
                  <div style={{ width: `${(coffee.acidity || 7) * 10}%` }} className="bg-amber-400 h-full"></div>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#7e6d61] block">Sweetness</span>
                <span className="text-xs font-bold text-[#e8ba7a]">{coffee.sweetness || 8}/10</span>
                <div className="w-full bg-[#241a14] h-1 rounded-full mt-1 overflow-hidden">
                  <div style={{ width: `${(coffee.sweetness || 8) * 10}%` }} className="bg-[#c8965a] h-full"></div>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#7e6d61] block">Body</span>
                <span className="text-xs font-bold text-[#e8ba7a]">{coffee.body || 7}/10</span>
                <div className="w-full bg-[#241a14] h-1 rounded-full mt-1 overflow-hidden">
                  <div style={{ width: `${(coffee.body || 7) * 10}%` }} className="bg-orange-600 h-full"></div>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#7e6d61] block">Aroma</span>
                <span className="text-xs font-bold text-[#e8ba7a]">{coffee.aroma || 9}/10</span>
                <div className="w-full bg-[#241a14] h-1 rounded-full mt-1 overflow-hidden">
                  <div style={{ width: `${(coffee.aroma || 9) * 10}%` }} className="bg-yellow-500 h-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions: Vote Count & Interactive Vote Button */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#261c16]">
          
          {/* Live Votes Counter */}
          <div className="relative">
            <span className="text-[10px] uppercase tracking-wider text-[#7e6d61] font-semibold block">
              Community Votes
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white font-editorial tracking-tight">
                {coffee.votes.toLocaleString()}
              </span>
              <span className="text-xs text-[#a8988a]">votes</span>
            </div>

            {/* Floating +1 animation on click */}
            {floatingPlus && (
              <span className="absolute -top-6 left-6 text-sm font-black text-amber-400 animate-float-up pointer-events-none drop-shadow-md">
                +1 VOTE! ☕
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetails(coffee)}
              className="p-2.5 rounded-xl bg-[#241a14] hover:bg-[#2d2019] text-[#b8a798] hover:text-white border border-[#35251b] transition-all cursor-pointer"
              title="View Cupping Story & Brew Guide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Interactive Vote Button */}
            <button
              onClick={handleVoteClick}
              disabled={isVoting}
              className={`relative overflow-hidden group/btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                justVoted
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-105'
                  : 'bg-gradient-to-r from-[#c8965a] to-[#a8743a] hover:from-[#d8a66a] hover:to-[#b8844a] text-[#120e0b] shadow-[#c8965a]/25 hover:shadow-[#c8965a]/40 active:scale-95'
              }`}
            >
              {justVoted ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Voted!</span>
                </>
              ) : (
                <>
                  <ThumbsUp className="w-4 h-4 group-hover/btn:-rotate-12 transition-transform duration-200 fill-[#120e0b]/20" />
                  <span>Vote</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </article>
  );
}
