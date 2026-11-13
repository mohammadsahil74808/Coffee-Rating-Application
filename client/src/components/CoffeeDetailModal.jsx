import React from 'react';
import { X, ThumbsUp, MapPin, Mountain, Award, Sparkles, Coffee, Flame, Droplets, Thermometer } from 'lucide-react';
import { playVoteSound } from '../utils/sound';
import { triggerVoteConfetti } from '../utils/confetti';

export default function CoffeeDetailModal({
  coffee,
  onClose,
  onVote
}) {
  if (!coffee) return null;

  const notes = coffee.flavor_notes
    ? coffee.flavor_notes.split(',').map(n => n.trim())
    : [];

  const handleVoteInside = (e) => {
    playVoteSound();
    triggerVoteConfetti(e);
    onVote(coffee.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#18120e] border border-[#35251b] shadow-2xl shadow-black text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-[#a8988a] hover:text-white border border-white/10 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 w-full bg-[#241a14]">
          <img
            src={coffee.image_url}
            alt={coffee.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18120e] via-black/40 to-transparent"></div>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-2.5 py-1 rounded-full bg-[#c8965a]/20 border border-[#c8965a]/40 text-[#e8ba7a] text-xs font-semibold uppercase tracking-wider inline-block mb-2">
              {coffee.roast_level} Roast • {coffee.process}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-editorial tracking-tight drop-shadow-md">
              {coffee.name}
            </h2>
            <p className="text-sm text-[#e8ba7a] flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4" />
              {coffee.origin} • Roasted by {coffee.roaster}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Cupping Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-[#201712] border border-[#2e2119] text-center">
              <span className="text-[10px] text-[#8c7b6e] uppercase tracking-wider block">Cupping Score</span>
              <span className="text-xl font-extrabold text-white font-editorial">{coffee.cupping_score}</span>
              <span className="text-[10px] text-emerald-400 block font-medium">Specialty Grade</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#201712] border border-[#2e2119] text-center">
              <span className="text-[10px] text-[#8c7b6e] uppercase tracking-wider block">Altitude</span>
              <span className="text-sm font-bold text-white mt-1 block truncate">{coffee.altitude}</span>
              <span className="text-[10px] text-[#8c7b6e] block">High Mountain</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#201712] border border-[#2e2119] text-center">
              <span className="text-[10px] text-[#8c7b6e] uppercase tracking-wider block">Processing</span>
              <span className="text-sm font-bold text-white mt-1 block truncate">{coffee.process}</span>
              <span className="text-[10px] text-[#8c7b6e] block">Artisanal Lot</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#201712] border border-[#2e2119] text-center">
              <span className="text-[10px] text-[#8c7b6e] uppercase tracking-wider block">Total Votes</span>
              <span className="text-xl font-extrabold text-[#e8ba7a] font-editorial">{coffee.votes}</span>
              <span className="text-[10px] text-[#8c7b6e] block">In Database</span>
            </div>
          </div>

          {/* Sensory Description */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#c8965a] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Sensory Profile & Story
            </h4>
            <p className="text-sm text-[#b8a798] leading-relaxed">
              {coffee.description}
            </p>
          </div>

          {/* Tasting Notes */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#c8965a] mb-2">
              Recognized Cupping Notes:
            </h4>
            <div className="flex flex-wrap gap-2">
              {notes.map((note, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-[#251a14] border border-[#3b2a1f] text-xs font-semibold text-[#f0e6dc]"
                >
                  🌿 {note}
                </span>
              ))}
            </div>
          </div>

          {/* Cup Radar / Meter Breakdown */}
          <div className="p-4 rounded-2xl bg-[#140e0b] border border-[#261c16]">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#c8965a] mb-3">
              Cup Balance Breakdown (1 - 10)
            </h4>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#a8988a]">Acidity / Brightness</span>
                  <span className="font-bold text-white">{coffee.acidity || 7}/10</span>
                </div>
                <div className="w-full bg-[#241a14] h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: `${(coffee.acidity || 7) * 10}%` }} className="bg-amber-400 h-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#a8988a]">Sweetness / Finish</span>
                  <span className="font-bold text-white">{coffee.sweetness || 8}/10</span>
                </div>
                <div className="w-full bg-[#241a14] h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: `${(coffee.sweetness || 8) * 10}%` }} className="bg-[#c8965a] h-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#a8988a]">Mouthfeel / Body</span>
                  <span className="font-bold text-white">{coffee.body || 7}/10</span>
                </div>
                <div className="w-full bg-[#241a14] h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: `${(coffee.body || 7) * 10}%` }} className="bg-orange-600 h-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#a8988a]">Aroma Intensity</span>
                  <span className="font-bold text-white">{coffee.aroma || 9}/10</span>
                </div>
                <div className="w-full bg-[#241a14] h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: `${(coffee.aroma || 9) * 10}%` }} className="bg-yellow-500 h-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Master Brewer Guide */}
          <div className="p-4 rounded-2xl bg-[#201712] border border-[#2e2119] flex items-center justify-between text-xs text-[#b8a798]">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-[#c8965a]" />
              <span>Recommended Water Temp: <strong className="text-white">92°C - 94°C (198°F)</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#c8965a]" />
              <span>Brew Ratio: <strong className="text-white">1:16 (V60 / Pour-over)</strong></span>
            </div>
          </div>

          {/* Modal Footer Vote Action */}
          <div className="pt-4 flex items-center justify-between border-t border-[#2e2119]">
            <span className="text-xs text-[#8c7b6e]">
              Currently holds <strong className="text-white font-bold">{coffee.votes}</strong> community votes
            </span>

            <button
              onClick={handleVoteInside}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c8965a] to-[#a8743a] hover:from-[#d8a66a] hover:to-[#b8844a] text-[#120e0b] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#c8965a]/30 active:scale-95 transition-all cursor-pointer"
            >
              <ThumbsUp className="w-4 h-4 fill-[#120e0b]/20" />
              <span>Cast Vote (+1)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
