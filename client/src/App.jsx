import React, { useState, useEffect, useMemo } from 'react';
import CoffeeRowItem from './components/CoffeeRowItem';
import CoffeeDetailModal from './components/CoffeeDetailModal';
import AddCoffeeModal from './components/AddCoffeeModal';
import Toast from './components/Toast';
import { coffeeApi, checkBackendConnection } from './services/api';
import { isSoundEnabled, toggleSound } from './utils/sound';
import { Coffee, Plus, RotateCcw, Volume2, VolumeX, Database, Search, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-[#181310] via-[#120e0b] to-[#0c0907] text-[#f7f3ed] font-sans antialiased selection:bg-[#0284c7] selection:text-white flex flex-col justify-between py-6 px-3 sm:px-6">
      
      {/* Top Ambient Bar */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between pb-4 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0284c7] flex items-center justify-center text-white font-black shadow-md shadow-[#0284c7]/30">
            ☕
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>The Great Coffee</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                Official App
              </span>
            </h1>
            <p className="text-[11px] text-[#9c8978]">Specialty Coffee Community Ratings</p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className="p-2 rounded-xl bg-[#241a14] hover:bg-[#2e2119] border border-[#3d2b20] text-[#c7b5a5] hover:text-white transition-all cursor-pointer"
            title={soundOn ? 'Sound feedback ON' : 'Sound feedback OFF'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Reset DB */}
          <button
            onClick={handleResetDb}
            className="p-2 rounded-xl bg-[#241a14] hover:bg-[#2e2119] border border-[#3d2b20] text-[#9c8978] hover:text-white transition-all cursor-pointer"
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
            <span>Add Item</span>
          </button>
        </div>
      </header>

      {/* Main Tablet Centerpiece */}
      <main className="w-full max-w-2xl mx-auto my-2">
        
        {/* Tablet Frame */}
        <div className="rounded-[36px] bg-[#1d2735] p-3.5 sm:p-5 shadow-2xl shadow-black/80 border-4 border-[#2b394d] relative">
          
          {/* Inner Tablet Screen */}
          <div className="rounded-[26px] bg-[#faf6ee] overflow-hidden shadow-inner flex flex-col border border-[#ded5c7]">
            
            {/* Header: "THE GREAT COFFEE Rating App" */}
            <div className="bg-gradient-to-b from-[#1c383d] via-[#182f33] to-[#142629] py-6 px-6 text-center text-white relative border-b-2 border-[#0e1a1c]">
              
              {/* Steaming Coffee Cup Icon */}
              <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-[#27464c] border border-[#3b636a] flex items-center justify-center text-amber-300 shadow-md">
                <Coffee className="w-6 h-6 text-[#f4d19b]" />
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.22em] text-[#faf6ee] font-sans">
                The Great Coffee
              </h2>

              {/* Subtitle in Italian script/serif cursive */}
              <p className="text-sm sm:text-base text-[#d8a774] italic font-serif tracking-wider mt-0.5">
                — Rating App —
              </p>

              {/* Total votes pill */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-[#f4d19b] font-medium shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Total Community Votes: <strong className="text-white font-bold">{totalVotes.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="p-3.5 bg-[#f3ede1] border-b border-[#e2d6c3] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              
              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'All Coffees' },
                  { id: 'beans', label: 'Whole Beans' },
                  { id: 'cold_brew', label: 'Cold Brew' },
                  { id: 'latte', label: 'Lattes & Espresso' },
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
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-[#8c7b6d] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search menu..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#ded4c3] text-[#231b14] placeholder-[#9c8b7e] outline-none focus:border-[#0284c7]"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#ded4c3] text-[#423429] outline-none cursor-pointer"
                >
                  <option value="votes">🔥 Most Votes</option>
                  <option value="name">🔤 Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* List of Coffee Row Cards (The Core Experience) */}
            <div className="p-3.5 sm:p-5 space-y-3.5 max-h-[640px] overflow-y-auto">
              {loading ? (
                <div className="py-20 text-center text-[#736353]">
                  <p className="text-xs font-semibold">Loading freshly brewed coffees...</p>
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
            <div className="p-3 bg-[#eae2d3] border-t border-[#ded4c3] text-[11px] text-[#6e5d4e] flex items-center justify-between px-5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Database Sync: <strong>Active</strong></span>
              </span>
              <span className="font-semibold text-[#1c383d]">
                Showing {filteredCoffees.length} specialty items
              </span>
            </div>

          </div>

        </div>

      </main>

      {/* Subtle Bottom Footer */}
      <footer className="max-w-2xl w-full mx-auto pt-4 text-center text-xs text-[#827162] flex items-center justify-between">
        <p>The Great Coffee • Community Cupping Platform</p>
        <p className="text-[11px] text-[#0284c7] font-semibold">
          Click (+) on any coffee to vote!
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
