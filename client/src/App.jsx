import React, { useState, useEffect, useMemo } from 'react';
import CoffeeRowItem from './components/CoffeeRowItem';
import LeaderboardSidebar from './components/LeaderboardSidebar';
import CommunityStatsSidebar from './components/CommunityStatsSidebar';
import CoffeeDetailModal from './components/CoffeeDetailModal';
import AddCoffeeModal from './components/AddCoffeeModal';
import Toast from './components/Toast';
import { coffeeApi, checkBackendConnection } from './services/api';
import { isSoundEnabled, toggleSound } from './utils/sound';
import { Coffee, Plus, RotateCcw, Volume2, VolumeX, Database, Search, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageMode, setStorageMode] = useState('local');
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('votes');
  const [selectedCoffeeId, setSelectedCoffeeId] = useState(4); // Default highlighted coffee (Vanilla Latte)

  // Modals & Toast
  const [activeModalCoffee, setActiveModalCoffee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  // Load initial coffees
  const loadData = async () => {
    try {
      setLoading(true);
      const isBackend = await checkBackendConnection();
      setStorageMode(isBackend ? 'backend' : 'local');

      const res = await coffeeApi.getAll();
      setCoffees(res.data || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      showToast('Error connecting to database', 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle voting with instant optimistic update
  const handleVote = async (coffeeId) => {
    setSelectedCoffeeId(coffeeId);

    // 1. Optimistic UI update
    setCoffees(prev =>
      prev.map(c => {
        if (c.id === coffeeId) {
          return { ...c, votes: c.votes + 1 };
        }
        return c;
      })
    );

    try {
      // 2. Persist to Database
      const res = await coffeeApi.vote(coffeeId);
      if (res && res.data) {
        setCoffees(prev =>
          prev.map(c => (c.id === coffeeId ? res.data : c))
        );
        showToast(`Vote recorded for "${res.data.name}"! ☕`, 'success');
      }
    } catch (err) {
      console.error('Vote failed:', err);
      showToast('Database update failed', 'warning');
      // Rollback
      setCoffees(prev =>
        prev.map(c => (c.id === coffeeId ? { ...c, votes: Math.max(0, c.votes - 1) } : c))
      );
    }
  };

  // Add coffee
  const handleAddCoffee = async (formData) => {
    const res = await coffeeApi.addCoffee(formData);
    showToast(`"${formData.name}" added to menu!`, 'success');
    loadData();
    return res;
  };

  // Reset database
  const handleResetDb = async () => {
    if (window.confirm('Reset all vote counts to initial tutorial values?')) {
      await coffeeApi.reset();
      showToast('Database reset successfully.', 'info');
      loadData();
    }
  };

  // Filtered and sorted coffees
  const filteredCoffees = useMemo(() => {
    let list = [...coffees];

    if (selectedCategory !== 'all') {
      list = list.filter(c => c.category === selectedCategory || c.icon_type === selectedCategory);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.flavor_notes && c.flavor_notes.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'votes') return (b.votes || 0) - (a.votes || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [coffees, selectedCategory, searchTerm, sortBy]);

  // Total community votes
  const totalVotes = useMemo(() => {
    return coffees.reduce((acc, c) => acc + (c.votes || 0), 0);
  }, [coffees]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#141b24] via-[#0f141c] to-[#0a0e14] text-[#f7f3ed] font-sans antialiased selection:bg-[#0284c7] selection:text-white flex flex-col justify-between">
      
      {/* Top Ambient Bar */}
      <header className="w-full bg-[#16202c]/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0284c7] flex items-center justify-center text-white font-black shadow-md shadow-[#0284c7]/30">
              ☕
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>The Great Coffee</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  Rating App
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Community Specialty Cupping & Votes</p>
            </div>
          </div>

          {/* Top Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Storage Mode Badge */}
            <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${
              storageMode === 'backend'
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span>{storageMode === 'backend' ? 'SQLite Backend' : 'Persistent Storage'}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer"
              title={soundOn ? 'Sound feedback ON' : 'Sound feedback OFF'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Reset DB */}
            <button
              onClick={handleResetDb}
              className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Reset votes to initial tutorial state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Add Coffee Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-md shadow-[#0284c7]/30 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden xs:inline">Add Coffee</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Experience Layout:
          - Mobile: 100% full screen fit, single natural scroll, edge-to-edge
          - Desktop: 3-column layout (Left: Leaderboard, Center: Tablet Menu, Right: Community Stats)
      */}
      <main className="max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 flex-1">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* Left Column (Desktop Only): Leaderboard & Barista Guide */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <LeaderboardSidebar
              coffees={coffees}
              onOpenDetails={(c) => setActiveModalCoffee(c)}
            />
          </div>

          {/* Center Column: The Tablet Coffee Rating Menu (Full Screen Fit on Mobile!) */}
          <div className="col-span-1 lg:col-span-6 w-full">
            
            {/* Tablet Shell */}
            <div className="w-full rounded-2xl sm:rounded-[36px] bg-[#1a232f] p-1.5 sm:p-4 shadow-2xl border sm:border-4 border-[#2b394a]">
              
              {/* Inner Tablet Screen */}
              <div className="rounded-xl sm:rounded-[24px] bg-[#faf6ee] overflow-hidden shadow-inner flex flex-col border border-[#ded5c7]">
                
                {/* Header: "THE GREAT COFFEE Rating App" */}
                <div className="bg-gradient-to-b from-[#1c383d] via-[#182f33] to-[#142629] py-5 sm:py-6 px-4 text-center text-white relative border-b-2 border-[#0e1a1c]">
                  
                  {/* Steaming Coffee Cup Icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 mx-auto mb-1.5 sm:mb-2 rounded-2xl bg-[#27464c] border border-[#3b636a] flex items-center justify-center text-amber-300 shadow-md">
                    <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-[#f4d19b]" />
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-[#faf6ee] font-sans">
                    The Great Coffee
                  </h2>

                  {/* Subtitle in Italian script/serif cursive */}
                  <p className="text-xs sm:text-sm md:text-base text-[#d8a774] italic font-serif tracking-wider mt-0.5">
                    — Rating App —
                  </p>

                  {/* Total votes pill */}
                  <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs text-[#f4d19b] font-medium shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Total Community Votes: <strong className="text-white font-bold">{totalVotes.toLocaleString()}</strong></span>
                  </div>
                </div>

                {/* Category Filter Pills & Search */}
                <div className="p-2.5 sm:p-3.5 bg-[#f3ede1] border-b border-[#e2d6c3] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  
                  {/* Categories */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {[
                      { id: 'all', label: 'All Items' },
                      { id: 'beans', label: 'Whole Beans' },
                      { id: 'cold_brew', label: 'Cold Brew' },
                      { id: 'latte', label: 'Latte & Espresso' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedCategory(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          selectedCategory === tab.id
                            ? 'bg-[#1c383d] text-white shadow-sm'
                            : 'bg-white/80 text-[#675445] hover:bg-white hover:text-[#231b14] border border-[#ded4c3]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search & Sort */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-44">
                      <Search className="w-3.5 h-3.5 text-[#8c7b6d] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search coffees..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#ded4c3] text-[#231b14] placeholder-[#9c8b7e] outline-none focus:border-[#0284c7]"
                      />
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-2 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#ded4c3] text-[#423429] outline-none cursor-pointer"
                    >
                      <option value="votes">🔥 Votes</option>
                      <option value="name">🔤 Name</option>
                    </select>
                  </div>
                </div>

                {/* List of Coffee Row Cards:
                    - NO inner nested scrollbar! Flows naturally on mobile & desktop!
                */}
                <div className="p-2 sm:p-4 space-y-2.5 sm:space-y-3.5">
                  {loading ? (
                    <div className="py-20 text-center text-[#736353]">
                      <p className="text-xs font-semibold">Loading freshly roasted coffees...</p>
                    </div>
                  ) : filteredCoffees.length > 0 ? (
                    filteredCoffees.map(coffee => (
                      <CoffeeRowItem
                        key={coffee.id}
                        coffee={coffee}
                        onVote={handleVote}
                        onOpenDetails={(c) => setActiveModalCoffee(c)}
                        isSelected={selectedCoffeeId === coffee.id}
                      />
                    ))
                  ) : (
                    <div className="text-center py-16 text-[#736353]">
                      <p className="text-sm font-bold">No coffees found in this category.</p>
                      <button
                        onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                        className="mt-2 text-xs text-[#0284c7] underline font-semibold"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Tablet Bottom Status Bar */}
                <div className="p-2.5 sm:p-3 bg-[#eae2d3] border-t border-[#ded4c3] text-[11px] text-[#6e5d4e] flex items-center justify-between px-3 sm:px-5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Database: <strong>Synced</strong></span>
                  </span>
                  <span className="font-semibold text-[#1c383d]">
                    {filteredCoffees.length} specialty roasts
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Right Column (Desktop Only): Community Stats & Roast Share */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <CommunityStatsSidebar
              coffees={coffees}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          </div>

        </div>

      </main>

      {/* Bottom Footer */}
      <footer className="max-w-7xl w-full mx-auto px-4 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/80">
        <p>The Great Coffee • Specialty Rating Platform</p>
        <p className="flex items-center gap-1.5 text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
          <span>Deployed on GitHub Pages</span>
        </p>
      </footer>

      {/* Detail Modal */}
      <CoffeeDetailModal
        coffee={activeModalCoffee}
        onClose={() => setActiveModalCoffee(null)}
        onVote={handleVote}
      />

      {/* Add Coffee Modal */}
      <AddCoffeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCoffee}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
