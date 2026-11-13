import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsHeader from './components/StatsHeader';
import FilterBar from './components/FilterBar';
import CoffeeCard from './components/CoffeeCard';
import CoffeeDetailModal from './components/CoffeeDetailModal';
import AddCoffeeModal from './components/AddCoffeeModal';
import Toast from './components/Toast';
import { coffeeApi, checkBackendConnection } from './services/api';
import { isSoundEnabled } from './utils/sound';
import { Coffee, Sparkles, RefreshCw, Layers, Database, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [coffees, setCoffees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storageMode, setStorageMode] = useState('local');
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoast, setSelectedRoast] = useState('all');
  const [sortBy, setSortBy] = useState('votes');

  // Modal & Toast states
  const [activeModalCoffee, setActiveModalCoffee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Load initial coffees and stats
  const loadData = async () => {
    try {
      setLoading(true);
      const isBackend = await checkBackendConnection();
      setStorageMode(isBackend ? 'backend' : 'local');

      const [coffeesRes, statsRes] = await Promise.all([
        coffeeApi.getAll(),
        coffeeApi.getStats()
      ]);

      setCoffees(coffeesRes.data || []);
      setStats(statsRes.data || null);
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
    // 1. Optimistic UI update
    setCoffees(prev =>
      prev.map(c => (c.id === coffeeId ? { ...c, votes: c.votes + 1 } : c))
    );

    try {
      // 2. Persist to Database (SQLite backend or In-Browser persistent DB)
      const res = await coffeeApi.vote(coffeeId);
      
      // Update with exact record returned from DB
      if (res && res.data) {
        setCoffees(prev =>
          prev.map(c => (c.id === coffeeId ? res.data : c))
        );
        showToast(`Vote recorded for "${res.data.name}" (+1) ☕`, 'success');
      }

      // Refresh stats
      const statsRes = await coffeeApi.getStats();
      if (statsRes?.data) setStats(statsRes.data);
    } catch (err) {
      console.error('Vote failed:', err);
      showToast('Failed to record vote in database', 'warning');
      // Rollback optimistic update
      setCoffees(prev =>
        prev.map(c => (c.id === coffeeId ? { ...c, votes: Math.max(0, c.votes - 1) } : c))
      );
    }
  };

  // Handle adding new coffee
  const handleAddCoffee = async (formData) => {
    const res = await coffeeApi.addCoffee(formData);
    showToast(`"${formData.name}" added to the database!`, 'success');
    loadData();
    return res;
  };

  // Handle database reset
  const handleResetDb = async () => {
    if (window.confirm('Reset database back to original specialty coffee seed data?')) {
      await coffeeApi.reset();
      showToast('Database reset and re-seeded successfully.', 'info');
      loadData();
    }
  };

  // Filter and sort computation
  const filteredAndSortedCoffees = useMemo(() => {
    let list = [...coffees];

    // Filter by roast
    if (selectedRoast !== 'all') {
      list = list.filter(c =>
        (c.roast_level || '').toLowerCase().includes(selectedRoast.toLowerCase())
      );
    }

    // Filter by search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.roaster.toLowerCase().includes(q) ||
        c.origin.toLowerCase().includes(q) ||
        (c.flavor_notes && c.flavor_notes.toLowerCase().includes(q))
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'votes') return (b.votes || 0) - (a.votes || 0);
      if (sortBy === 'cupping') return (b.cupping_score || 0) - (a.cupping_score || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'altitude') {
        const altA = parseInt((a.altitude || '0').replace(/[^0-9]/g, ''), 10) || 0;
        const altB = parseInt((b.altitude || '0').replace(/[^0-9]/g, ''), 10) || 0;
        return altB - altA;
      }
      return 0;
    });

    return list;
  }, [coffees, selectedRoast, searchTerm, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#120e0b] text-[#f7f3ed]">
      {/* Navigation */}
      <Navbar
        storageMode={storageMode}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetDb={handleResetDb}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* Dynamic Analytics & Hero Banner */}
        <StatsHeader stats={stats} coffees={coffees} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Search, Filter & Sort Bar */}
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRoast={selectedRoast}
            setSelectedRoast={setSelectedRoast}
            sortBy={sortBy}
            setSortBy={setSortBy}
            coffeesCount={filteredAndSortedCoffees.length}
          />

          {/* Interactive Coffee Cards Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <RefreshCw className="w-8 h-8 text-[#c8965a] animate-spin mx-auto mb-3" />
              <p className="text-sm text-[#a8988a]">Querying coffee database...</p>
            </div>
          ) : filteredAndSortedCoffees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedCoffees.map((coffee, idx) => (
                <CoffeeCard
                  key={coffee.id}
                  coffee={coffee}
                  rank={sortBy === 'votes' ? idx + 1 : null}
                  onVote={handleVote}
                  onOpenDetails={(c) => setActiveModalCoffee(c)}
                  onTagClick={(tag) => setSearchTerm(tag)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 rounded-3xl bg-[#18120e] border border-[#2e2119] max-w-lg mx-auto p-8">
              <Coffee className="w-12 h-12 text-[#634e40] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white font-editorial mb-1">
                No coffees match your filter
              </h3>
              <p className="text-xs text-[#a8988a] mb-6">
                Try clearing your search query or switching roast profiles.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRoast('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#2b1f18] hover:bg-[#382a20] text-xs font-semibold text-white transition-all cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#261c16] bg-[#0e0a08] py-10 mt-16 text-xs text-[#8c7b6e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c8965a]/20 border border-[#c8965a]/40 flex items-center justify-center text-[#e8ba7a] font-bold">
              ☕
            </div>
            <div>
              <p className="font-semibold text-white">RoastRank Specialty Coffee Platform</p>
              <p className="text-[11px] text-[#706053]">Database Updates & Backend Logic Handling</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dual-Mode Storage (SQLite + GH Pages Storage)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c8965a]" />
              <span>Atomic Vote Transactions</span>
            </span>
          </div>

          <p className="text-[11px]">
            Handcrafted with precision for coffee lovers worldwide.
          </p>
        </div>
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
