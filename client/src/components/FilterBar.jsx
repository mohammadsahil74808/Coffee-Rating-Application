import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedRoast,
  setSelectedRoast,
  sortBy,
  setSortBy,
  coffeesCount
}) {
  const roasts = [
    { id: 'all', label: 'All Profiles' },
    { id: 'Light', label: 'Light Roast' },
    { id: 'Medium', label: 'Medium Roast' },
    { id: 'Dark', label: 'Dark Roast' }
  ];

  return (
    <div className="py-6 border-b border-[#241a14] mb-8">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a796c]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, roaster, origin, or flavor (e.g. bergamot)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#1a130f] border border-[#2e231c] focus:border-[#c8965a] focus:ring-1 focus:ring-[#c8965a] text-sm text-white placeholder-[#78675a] outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a796c] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Roast level selector tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#18120e] border border-[#2a1f18] overflow-x-auto">
          {roasts.map((r) => {
            const isActive = selectedRoast === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRoast(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#c8965a] text-[#120e0b] shadow-sm'
                    : 'text-[#9e8d7f] hover:text-white hover:bg-[#231a14]'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#8a796c] hidden sm:block" />
          <span className="text-xs text-[#8a796c] hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#1a130f] border border-[#2e231c] text-xs font-semibold text-[#f0e6dc] focus:border-[#c8965a] outline-none cursor-pointer"
          >
            <option value="votes">🔥 Most Voted First</option>
            <option value="cupping">⭐ Highest Cupping Score</option>
            <option value="altitude">⛰️ Highest Altitude</option>
            <option value="name">🔤 Name (A - Z)</option>
          </select>
        </div>

      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#8a796c]">
        <span>
          Showing <strong className="text-white">{coffeesCount}</strong> specialty coffees
        </span>
        {searchTerm && (
          <span>
            Filtering by query: <strong className="text-[#c8965a]">"{searchTerm}"</strong>
          </span>
        )}
      </div>
    </div>
  );
}

