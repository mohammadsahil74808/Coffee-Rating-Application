// Adaptive Coffee Rating Data Service
// Dual Mode Architecture:
// 1. Backend Mode: Connects to Express + SQLite API at /api/*
// 2. GitHub Pages / In-Browser Mode: Persists in localStorage with atomic updates

const LOCAL_STORAGE_KEY = 'roastrank_coffees_db_v1';
const HISTORY_STORAGE_KEY = 'roastrank_vote_history_v1';

export const SEED_COFFEES = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe G1',
    roaster: 'Artisanal Roastery Co.',
    origin: 'Yirgacheffe, Ethiopia',
    roast_level: 'Light',
    votes: 42,
    cupping_score: 91.5,
    acidity: 9,
    sweetness: 8,
    body: 6,
    aroma: 10,
    flavor_notes: 'Jasmine, Bergamot, Meyer Lemon, Wild Blossom Honey',
    process: 'Washed',
    altitude: '2,050m MASL',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    description: 'Iconic Ethiopian heirloom varieties harvested at high altitudes. Vibrant citrus blossoms, crisp bergamot tea finish, and unmatched floral clarity.'
  },
  {
    id: 2,
    name: 'Panama Geisha Esmeralda',
    roaster: 'Panama Highlands Reserve',
    origin: 'Boquete, Panama',
    roast_level: 'Light',
    votes: 68,
    cupping_score: 94.0,
    acidity: 8,
    sweetness: 10,
    body: 7,
    aroma: 10,
    flavor_notes: 'White Peach, Jasmine, Passionfruit, Candied Mandarin',
    process: 'Natural Anaerobic',
    altitude: '1,850m MASL',
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
    description: 'The pinnacle of specialty coffee. Rare Geisha lot delivering silk-like mouthfeel, ethereal white florality, and luscious tropical stone fruit sweetness.'
  },
  {
    id: 3,
    name: 'Colombian Huila Supremo',
    roaster: 'Andean Slope Roasters',
    origin: 'Huila, Colombia',
    roast_level: 'Medium',
    votes: 35,
    cupping_score: 88.5,
    acidity: 7,
    sweetness: 9,
    body: 8,
    aroma: 8,
    flavor_notes: 'Dulce de Leche, Red Fuji Apple, Roasted Pecan, Milk Chocolate',
    process: 'Washed',
    altitude: '1,750m MASL',
    image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop',
    description: 'Crowd-favorite balanced Colombian lot. Rich buttery caramel sweetness complemented by crisp red apple juiciness and a lingering chocolate truffle finish.'
  },
  {
    id: 4,
    name: 'Costa Rican Tarrazú Honey',
    roaster: 'Pura Vida Microlots',
    origin: 'Tarrazú Valley, Costa Rica',
    roast_level: 'Medium',
    votes: 29,
    cupping_score: 89.2,
    acidity: 7,
    sweetness: 9,
    body: 8,
    aroma: 8,
    flavor_notes: 'Yellow Plum, Golden Cane Sugar, Toasted Almond, Vanilla Cream',
    process: 'Yellow Honey',
    altitude: '1,900m MASL',
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop',
    description: 'Processed with mucilage intact during sun drying, producing round velvety sweetness, stone fruit juiciness, and a creamy toasted almond aroma.'
  },
  {
    id: 5,
    name: 'Guatemala Fuego Antigua',
    roaster: 'Volcanic Bean Works',
    origin: 'Antigua Valley, Guatemala',
    roast_level: 'Medium',
    votes: 24,
    cupping_score: 87.8,
    acidity: 6,
    sweetness: 8,
    body: 9,
    aroma: 8,
    flavor_notes: 'Dark Belgian Chocolate, Cinnamon Bark, Toasted Hazelnut, Brown Butter',
    process: 'Washed',
    altitude: '1,600m MASL',
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
    description: 'Grown in mineral-rich volcanic soil surrounded by volcanoes Agua, Acatenango, and Fuego. Deep chocolate fudge body with comforting warming spices.'
  },
  {
    id: 6,
    name: 'Sumatra Mandheling Reserve',
    roaster: 'Equatorial Archipelago',
    origin: 'Lake Toba, North Sumatra',
    roast_level: 'Dark',
    votes: 31,
    cupping_score: 86.5,
    acidity: 4,
    sweetness: 7,
    body: 10,
    aroma: 8,
    flavor_notes: 'Cedarwood, Molasses, 85% Dark Chocolate, Earthy Clove',
    process: 'Giling Basah (Wet-Hulled)',
    altitude: '1,450m MASL',
    image_url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop',
    description: 'Traditional Indonesian wet-hulled preparation yielding an ultra-dense syrupy body, deep forest cedar tones, and bold bittersweet chocolate finish.'
  },
  {
    id: 7,
    name: 'Kenya Nyeri Peaberry AA',
    roaster: 'Rift Valley Specialty',
    origin: 'Nyeri County, Kenya',
    roast_level: 'Light',
    votes: 49,
    cupping_score: 92.0,
    acidity: 10,
    sweetness: 8,
    body: 7,
    aroma: 9,
    flavor_notes: 'Blackcurrant Jam, Blood Orange, Cane Sugar, Winey Finish',
    process: 'Double Washed',
    altitude: '1,950m MASL',
    image_url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop',
    description: 'Rare round Peaberry beans bursting with vibrant blackcurrant brightness, juicy blood orange acidity, and a sparkling wine-like complexity.'
  },
  {
    id: 8,
    name: 'Yemen Mocha Matari Terroir',
    roaster: 'Heritage Silk Roasters',
    origin: 'Bani Matar, Yemen',
    roast_level: 'Medium',
    votes: 38,
    cupping_score: 90.0,
    acidity: 6,
    sweetness: 8,
    body: 9,
    aroma: 9,
    flavor_notes: 'Dried Black Fig, Cardamom, Cacao Nibs, Wild Leather',
    process: 'Ancient Terrace Sun-Dried',
    altitude: '2,200m MASL',
    image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop',
    description: 'From thousand-year-old stone terraces high in the Yemeni mountains. Deeply exotic cup with notes of wild dried figs, warm cardamom, and intense raw cocoa.'
  }
];

// Helper to determine if backend is available
let isBackendActive = false;
let checkDone = false;

export const checkBackendConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const res = await fetch('/api/health', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      isBackendActive = data.status === 'ok';
    } else {
      isBackendActive = false;
    }
  } catch (e) {
    isBackendActive = false;
  }
  checkDone = true;
  return isBackendActive;
};

// In-browser LocalStorage DB engine
const getLocalCoffees = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_COFFEES));
    return SEED_COFFEES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_COFFEES));
    return SEED_COFFEES;
  }
};

const saveLocalCoffees = (coffees) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(coffees));
};

export const coffeeApi = {
  getStorageMode: () => (isBackendActive ? 'backend' : 'local'),

  // Fetch all coffees
  getAll: async () => {
    if (!checkDone) {
      await checkBackendConnection();
    }

    if (isBackendActive) {
      try {
        const res = await fetch('/api/coffees');
        if (res.ok) {
          const json = await res.json();
          return { data: json.data, source: 'backend' };
        }
      } catch (err) {
        console.warn('Backend fetch failed, falling back to local DB:', err);
        isBackendActive = false;
      }
    }

    // LocalStorage fallback
    const coffees = getLocalCoffees();
    // Sort by votes desc
    coffees.sort((a, b) => b.votes - a.votes);
    return { data: coffees, source: 'local' };
  },

  // Cast vote for coffee
  vote: async (id) => {
    if (isBackendActive) {
      try {
        const res = await fetch(`/api/coffees/${id}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const json = await res.json();
          return { data: json.data, source: 'backend' };
        }
      } catch (err) {
        console.warn('Backend vote failed, falling back to local DB:', err);
        isBackendActive = false;
      }
    }

    // LocalStorage fallback
    const coffees = getLocalCoffees();
    const index = coffees.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Coffee not found');
    }

    coffees[index].votes += 1;
    saveLocalCoffees(coffees);

    // Save vote log
    const history = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
    history.push({ coffeeId: id, timestamp: new Date().toISOString() });
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));

    return { data: coffees[index], source: 'local' };
  },

  // Add new coffee
  addCoffee: async (newCoffee) => {
    if (isBackendActive) {
      try {
        const res = await fetch('/api/coffees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCoffee)
        });
        if (res.ok) {
          const json = await res.json();
          return { data: json.data, source: 'backend' };
        }
      } catch (err) {
        console.warn('Backend addCoffee failed, falling back to local DB:', err);
        isBackendActive = false;
      }
    }

    // LocalStorage fallback
    const coffees = getLocalCoffees();
    const maxId = coffees.reduce((max, c) => Math.max(max, c.id || 0), 0);
    const created = {
      ...newCoffee,
      id: maxId + 1,
      votes: 0,
      cupping_score: parseFloat(newCoffee.cupping_score) || 88.0,
      acidity: parseInt(newCoffee.acidity, 10) || 7,
      sweetness: parseInt(newCoffee.sweetness, 10) || 8,
      body: parseInt(newCoffee.body, 10) || 7,
      aroma: parseInt(newCoffee.aroma, 10) || 8,
      created_at: new Date().toISOString()
    };
    coffees.push(created);
    saveLocalCoffees(coffees);
    return { data: created, source: 'local' };
  },

  // Get aggregated stats
  getStats: async () => {
    if (isBackendActive) {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const json = await res.json();
          return { data: json.data, source: 'backend' };
        }
      } catch (e) {
        isBackendActive = false;
      }
    }

    // LocalStorage fallback
    const coffees = getLocalCoffees();
    const totalVotes = coffees.reduce((sum, c) => sum + (c.votes || 0), 0);
    const sorted = [...coffees].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const topCoffee = sorted[0] || null;

    // Roast breakdown
    const roastMap = {};
    coffees.forEach(c => {
      const r = c.roast_level || 'Medium';
      if (!roastMap[r]) roastMap[r] = { roast_level: r, count: 0, votes: 0 };
      roastMap[r].count += 1;
      roastMap[r].votes += (c.votes || 0);
    });

    return {
      data: {
        totalVotes,
        totalCoffees: coffees.length,
        topCoffee,
        roastBreakdown: Object.values(roastMap)
      },
      source: 'local'
    };
  },

  // Reset database back to seed
  reset: async () => {
    if (isBackendActive) {
      try {
        const res = await fetch('/api/reset', { method: 'POST' });
        if (res.ok) {
          return { success: true, source: 'backend' };
        }
      } catch (e) {
        isBackendActive = false;
      }
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return { success: true, source: 'local' };
  }
};
