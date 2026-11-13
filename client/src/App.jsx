import React, { useState, useEffect, useMemo } from 'react';
import CoffeeRowItem from './components/CoffeeRowItem';
import FlowInspector from './components/FlowInspector';
import CoffeeDetailModal from './components/CoffeeDetailModal';
import AddCoffeeModal from './components/AddCoffeeModal';
import Toast from './components/Toast';
import { coffeeApi, checkBackendConnection } from './services/api';
import { isSoundEnabled, toggleSound } from './utils/sound';
import { Coffee, Plus, RotateCcw, Volume2, VolumeX, Database, Search, Sparkles, Filter, Code2, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageMode, setStorageMode] = useState('local');
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastVotedCoffee, setLastVotedCoffee] = useState(null);
  const [isVotingState, setIsVotingState] = useState(false);
  const [showInspector, setShowInspector] = useState(true);

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
      if (res.data && res.data.length > 0 && !lastVotedCoffee) {
        setLastVotedCoffee(res.data[3] || res.data[0]); // Default to Vanilla Latte like reference photo
      }
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
    setIsVotingState(true);

    // 1. Optimistic UI update
    setCoffees(prev =>
      prev.map(c => {
        if (c.id === coffeeId) {
          const updated = { ...c, votes: c.votes + 1 };
          setLastVotedCoffee(updated);
          return updated;
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
        setLastVotedCoffee(res.data);
        showToast(`Vote committed for "${res.data.name}" in database! ☕`, 'success');
      }
    } catch (err) {
      console.error('Vote failed:', err);
      showToast('Database update failed', 'warning');
      // Rollback
      setCoffees(prev =>
        prev.map(c => (c.id === coffeeId ? { ...c, votes: Math.max(0, c.votes - 1) } : c))
      );
    } finally {
      setTimeout(() => setIsVotingState(false), 800);
    }
  };

  // Add coffee
  const handleAddCoffee = async (formData) => {
    const res = await coffeeApi.addCoffee(formData);
    showToast(`"${formData.name}" added to database!`, 'success');
    loadData();
    return res;
  };

  // Reset database
  const handleResetDb = async () => {
    if (window.confirm('Reset database back to the original tutorial coffee items?')) {
      await coffeeApi.reset();
      showToast('Database reset and re-seeded successfully.', 'info');
      loadData();
    }
  };

  // Filtered coffees
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

    return list;
  }, [coffees, selectedCategory, searchTerm]);

  // Total community votes
  const totalVotes = useMemo(() => {
    return coffees.reduce((acc, c) => acc + (c.votes || 0), 0);
  }, [coffees]);

  return (
    <div className="min-h-screen bg-[#111822] text-[#f7f3ed] font-sans antialiased selection:bg-[#0284c7] selection:text-white flex flex-col justify-between py-6 px-3 sm:px-6">
      
      {/* Top Navbar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0284c7] flex items-center justify-center text-white font-black shadow-md shadow-[#0284c7]/30">
            ☕
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>The Great Coffee</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                Live Rating System
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Database updates & backend logic handling</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Storage Mode Badge */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            storageMode === 'backend'
              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
              : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
          }`}>
            <Database className="w-3.5 h-3.5" />
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${storageMode === 'backend' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              {storageMode === 'backend' ? 'SQLite Backend' : 'Persistent DB (GH Pages)'}
            </span>
          </div>

          {/* Toggle Flow Inspector (Mobile/Desktop) */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showInspector
                ? 'bg-sky-600 text-white border-sky-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle Live Backend Architecture Flow"
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden md:inline">Flow Diagram</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer"
            title={soundOn ? 'Sound feedback ON' : 'Sound feedback OFF'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Reset DB */}
          <button
            onClick={handleResetDb}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Reset database to default seed"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Add Coffee Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-md shadow-[#0284c7]/30 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>
      </header>

      {/* Main Experience Layout */}
      <main className="max-w-6xl w-full mx-auto my-6 flex flex-col lg:flex-row items-start justify-center gap-8">
        
        {/* Tablet / Application Frame (Matching Reference Photo) */}
        <div className="w-full max-w-xl mx-auto rounded-[32px] bg-[#1a232f] p-3 sm:p-4 shadow-2xl border-4 border-[#2b394a] relative">
          
          {/* Inner Tablet Shell */}
          <div className="rounded-[24px] bg-[#faf6ee] overflow-hidden shadow-inner flex flex-col border border-[#ded5c7]">
            
            {/* Tablet Header: "THE GREAT COFFEE Rating App" */}
            <div className="bg-gradient-to-b from-[#1b3438] to-[#162a2d] py-5 px-6 text-center text-white relative border-b-2 border-[#102022]">
              {/* Steaming Coffee Cup Icon */}
              <div className="w-9 h-9 mx-auto mb-1.5 rounded-full bg-[#27464c] border border-[#3b636a] flex items-center justify-center text-amber-300 shadow-sm">
                <Coffee className="w-5 h-5 text-[#f4d19b]" />
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-[#faf6ee] font-sans">
                The Great Coffee
              </h2>

              {/* Subtitle in Italian script/serif cursive */}
              <p className="text-xs sm:text-sm text-[#d8a774] italic font-serif tracking-wider -mt-0.5">
                — Rating App —
              </p>

              {/* Total votes pill */}
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-[11px] text-[#f4d19b]">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Total Votes Cast: <strong>{totalVotes.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Quick Filter Pills & Search */}
            <div className="p-3 bg-[#f3ede1] border-b border-[#e2d6c3] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'beans', label: 'Single Origin' },
                  { id: 'cold_brew', label: 'Cold Brew' },
                  { id: 'latte', label: 'Espresso & Latte' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === tab.id
                        ? 'bg-[#1b3438] text-white shadow-sm'
                        : 'bg-white/70 text-[#675445] hover:bg-white hover:text-[#231b14] border border-[#ded4c3]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-44">
                <Search className="w-3.5 h-3.5 text-[#8c7b6d] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter coffee..."
                  className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-white border border-[#ded4c3] text-[#231b14] placeholder-[#9c8b7e] outline-none focus:border-[#0284c7]"
                />
              </div>
            </div>

            {/* List of Coffees */}
            <div className="p-3 sm:p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="py-16 text-center text-[#736353]">
                  <p className="text-xs font-semibold">Loading coffee database...</p>
                </div>
              ) : filteredCoffees.length > 0 ? (
                filteredCoffees.map(coffee => (
                  <CoffeeRowItem
                    key={coffee.id}
                    coffee={coffee}
                    onVote={handleVote}
                    onOpenDetails={(c) => setActiveModalCoffee(c)}
                    isSelected={lastVotedCoffee?.id === coffee.id}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-[#736353]">
                  <p className="text-xs font-bold">No coffees match your filter.</p>
                  <button
                    onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                    className="mt-2 text-xs text-[#0284c7] underline font-semibold"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            {/* Tablet Footer bar */}
            <div className="p-2.5 bg-[#eae2d3] border-t border-[#ded4c3] text-center text-[11px] text-[#6e5d4e] flex items-center justify-between px-4">
              <span>Click <strong className="text-[#0284c7] font-black">(+)</strong> to register a live database vote</span>
              <span className="font-bold text-[#1b3438]">{filteredCoffees.length} items loaded</span>
            </div>

          </div>

        </div>

        {/* Right: Architecture Flow Inspector (Illustrated in Reference Photo) */}
        {showInspector && (
          <FlowInspector
            lastVotedCoffee={lastVotedCoffee}
            isVoting={isVotingState}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-4 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>The Great Coffee Rating Application • Database Updates & Backend Logic Handling</p>
        <p className="flex items-center gap-1.5 text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
          <span>Deployed on GitHub Pages</span>
        </p>
      </footer>

      {/* Modals */}
      <CoffeeDetailModal
        coffee={activeModalCoffee}
        onClose={() => setActiveModalCoffee(null)}
        onVote={handleVote}
      />

      <AddCoffeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCoffee}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
