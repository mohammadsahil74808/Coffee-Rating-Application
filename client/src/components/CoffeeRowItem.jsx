import React, { useState } from 'react';
import { Plus, Check, Sparkles } from 'lucide-react';
import { CoffeeIllustration } from './CoffeeIllustrations';
import { playVoteSound } from '../utils/sound';
import { triggerVoteConfetti } from '../utils/confetti';

export default function CoffeeRowItem({
  coffee,
  onVote,
  onOpenDetails,
  isSelected
}) {
  const [isVoting, setIsVoting] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [floatingPlus, setFloatingPlus] = useState(false);

  const handlePlusClick = async (e) => {
    e.stopPropagation();
    if (isVoting) return;

    playVoteSound();
    triggerVoteConfetti(e);
    setFloatingPlus(true);
    setJustVoted(true);

    setTimeout(() => setFloatingPlus(false), 900);
    setTimeout(() => setJustVoted(false), 1200);

    setIsVoting(true);
    try {
      await onVote(coffee.id);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(coffee)}
      className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none shadow-sm ${
        justVoted || isSelected
          ? 'bg-[#fceed8] border-[#e0aa6a] shadow-md shadow-[#e0aa6a]/20 ring-2 ring-[#e0aa6a]/30'
          : 'bg-[#faf6ee] hover:bg-[#f6efe2] border-[#e8ded1] hover:border-[#d4c3b0]'
      }`}
    >
      {/* Left: Handcrafted Coffee Art Illustration */}
      <div className="shrink-0 mr-3.5 sm:mr-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center p-1 bg-white/70 shadow-inner border border-[#ede3d5] group-hover:scale-105 transition-transform duration-300">
          <CoffeeIllustration type={coffee.icon_type} className="w-full h-full" />
        </div>
      </div>

      {/* Center: Details */}
      <div className="flex-1 min-w-0 pr-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-[#231b14] truncate font-sans tracking-tight">
            {coffee.name}
          </h3>
          {coffee.votes >= 140 && (
            <span className="hidden xs:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e37d28]/15 text-[#b95712] border border-[#e37d28]/30">
              <Sparkles className="w-2.5 h-2.5" /> Popular
            </span>
          )}
        </div>

        <p className="text-xs text-[#736353] line-clamp-2 leading-relaxed mt-0.5 font-normal">
          {coffee.description}
        </p>

        {/* Votes Counter Label matching the diagram: "Votes: 125" */}
        <div className="relative inline-flex items-center gap-1.5 mt-1.5">
          <span className="text-xs font-extrabold text-[#3b2d20]">
            Votes: <span className="text-[#0284c7] font-black">{coffee.votes.toLocaleString()}</span>
          </span>

          {/* Floating +1 effect */}
          {floatingPlus && (
            <span className="absolute -top-5 left-12 text-xs font-black text-[#0284c7] animate-float-up pointer-events-none drop-shadow">
              +1 VOTE!
            </span>
          )}
        </div>
      </div>

      {/* Right: Plus (+) Vote Button with Ripple & Pulse from Tutorial Diagram */}
      <div className="shrink-0 pl-1">
        <div className="relative">
          {/* Animated ripple circle when clicked (just like the turquoise circle around the finger in the photo) */}
          {(justVoted || isVoting) && (
            <span className="absolute -inset-2 rounded-2xl bg-[#0284c7]/25 animate-ping pointer-events-none"></span>
          )}

          <button
            onClick={handlePlusClick}
            disabled={isVoting}
            aria-label={`Vote for ${coffee.name}`}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl font-bold flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer active:scale-90 ${
              justVoted
                ? 'bg-[#0284c7] text-white ring-4 ring-[#0284c7]/40 scale-105'
                : 'bg-[#0284c7] hover:bg-[#0369a1] text-white hover:scale-105 active:bg-[#075985]'
            }`}
          >
            {justVoted ? (
              <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] animate-scale" />
            ) : (
              <Plus className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
            )}
          </button>
        </div>
      </div>

    </div>
  );
}

