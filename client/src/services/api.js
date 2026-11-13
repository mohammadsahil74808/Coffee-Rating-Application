// Adaptive Coffee Rating Data Service
// Dual Mode Architecture:
// 1. Backend Mode: Connects to Express + SQLite API at /api/*
// 2. GitHub Pages / In-Browser Mode: Persists in localStorage with atomic updates

const LOCAL_STORAGE_KEY = 'the_great_coffee_db_v2';
const HISTORY_STORAGE_KEY = 'the_great_coffee_history_v2';

export const SEED_COFFEES = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    roaster: 'Artisanal Roastery Co.',
    origin: 'Yirgacheffe, Ethiopia',
    category: 'beans',
    roast_level: 'Light',
    votes: 125,
    cupping_score: 91.5,
    acidity: 9,
    sweetness: 8,
    body: 6,
    aroma: 10,
    flavor_notes: 'Jasmine, Bergamot, Meyer Lemon, Wild Blossom Honey',
    process: 'Washed',
    altitude: '2,050m MASL',
    icon_type: 'beans',
    description: 'Ethiopian Yirgacheffe, heirloom varietals with delicate citrus blossom and bergamot.'
  },
  {
    id: 2,
    name: 'Sumatra Mandheling',
    roaster: 'Equatorial Archipelago',
    origin: 'Lake Toba, North Sumatra',
    category: 'beans',
    roast_level: 'Dark',
    votes: 150,
    cupping_score: 87.5,
    acidity: 4,
    sweetness: 7,
    body: 10,
    aroma: 8,
    flavor_notes: 'Cedarwood, Molasses, 85% Dark Chocolate, Earthy Spice',
    process: 'Wet-Hulled (Giling Basah)',
    altitude: '1,450m MASL',
    icon_type: 'beans',
    description: 'Sumatra Mandheling, volcanic soil roast with cedarwood, dark chocolate, and comforting spice.'
  },
  {
    id: 3,
    name: 'Cold Brew Nitro',
    roaster: 'Draft Brew Lab',
    origin: 'Huila & Antioquia blend',
    category: 'cold_brew',
    roast_level: 'Medium',
    votes: 120,
    cupping_score: 89.0,
    acidity: 5,
    sweetness: 9,
    body: 9,
    aroma: 8,
    flavor_notes: 'Creamy Stout, Dark Cocoa, Sweet Molasses, Velvety Foam',
    process: '18-Hour Nitrogen Infused',
    altitude: '1,800m MASL',
    icon_type: 'cold_brew',
    description: 'Cold Brew Nitro is slow-steeped for 18 hours and charged with pure nitrogen for a creamy cascade.'
  },
  {
    id: 4,
    name: 'Vanilla Latte',
    roaster: 'Velvet Espresso Bar',
    origin: 'Guatemala & Colombia Reserve',
    category: 'latte',
    roast_level: 'Medium',
    votes: 125,
    cupping_score: 88.0,
    acidity: 5,
    sweetness: 9,
    body: 8,
    aroma: 9,
    flavor_notes: 'Madagascar Vanilla, Steamed Oat Milk, Brown Sugar Crema',
    process: 'Double Shot Espresso + Microfoam',
    altitude: '1,700m MASL',
    icon_type: 'latte',
    description: 'Vanilla Latte handcrafted with double espresso, silky microfoam, and natural Madagascar bourbon vanilla.'
  },
  {
    id: 5,
    name: 'Mexican Chiapas',
    roaster: 'Sierra Madre Microlots',
    origin: 'Chiapas, Mexico',
    category: 'beans',
    roast_level: 'Medium',
    votes: 120,
    cupping_score: 88.5,
    acidity: 6,
    sweetness: 8,
    body: 7,
    aroma: 8,
    flavor_notes: 'Milk Chocolate, Roasted Pecan, Crisp Red Apple, Brown Butter',
    process: 'Washed',
    altitude: '1,650m MASL',
    icon_type: 'beans',
    description: 'Mexican Chiapas delivers a comforting cup of milk chocolate, toasted almonds, and sweet red apple crisp.'
  },
  {
    id: 6,
    name: 'Cold Brew',
    roaster: 'Slow Drip Roasters',
    origin: 'Bourbon & Typica single-origin',
    category: 'cold_brew',
    roast_level: 'Medium-Dark',
    votes: 50,
    cupping_score: 86.5,
    acidity: 4,
    sweetness: 8,
    body: 8,
    aroma: 7,
    flavor_notes: 'Bittersweet Cocoa, Toasted Walnut, Black Cherry',
    process: '24-Hour Cold Immersion',
    altitude: '1,600m MASL',
    icon_type: 'cold_brew',
    description: 'Traditional slow-filtered cold brew steeped in chilled spring water for low acidity and natural sweetness.'
  },
  {
    id: 7,
    name: 'Panama Geisha Esmeralda',
    roaster: 'Highlands Micro-Lot',
    origin: 'Boquete, Panama',
    category: 'beans',
    roast_level: 'Light',
    votes: 165,
    cupping_score: 94.5,
    acidity: 8,
    sweetness: 10,
    body: 7,
    aroma: 10,
    flavor_notes: 'White Peach, Jasmine Florals, Passionfruit, Candied Mandarin',
    process: 'Natural Anaerobic',
    altitude: '1,850m MASL',
    icon_type: 'beans',
    description: 'World-renowned Geisha variety known for ethereal jasmine fragrance, tropical fruits, and tea-like elegance.'
  },
  {
    id: 8,
    name: 'Caramel Macchiato',
    roaster: 'Artisan Dolce Works',
    origin: 'Brazil Santos & Colombian Blend',
    category: 'latte',
    roast_level: 'Medium',
    votes: 95,
    cupping_score: 87.0,
    acidity: 4,
    sweetness: 10,
    body: 8,
    aroma: 9,
    flavor_notes: 'Salted Caramel, Steamed Vanilla Milk, Espresso Crema',
    process: 'Marked Espresso over Steamed Milk',
    altitude: '1,500m MASL',
    icon_type: 'latte',
    description: 'Freshly steamed milk with vanilla-infused syrup, marked with rich espresso shots and buttery caramel drizzle.'
  }
];

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

    const coffees = getLocalCoffees();
    coffees.sort((a, b) => b.votes - a.votes);
    return { data: coffees, source: 'local' };
  },

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

    const coffees = getLocalCoffees();
    const index = coffees.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Coffee not found');
    }

    coffees[index].votes += 1;
    saveLocalCoffees(coffees);

    const history = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
    history.push({ coffeeId: id, timestamp: new Date().toISOString() });
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));

    return { data: coffees[index], source: 'local' };
  },

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
      icon_type: newCoffee.icon_type || 'beans',
      created_at: new Date().toISOString()
    };
    coffees.push(created);
    saveLocalCoffees(coffees);
    return { data: created, source: 'local' };
  },

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

    const coffees = getLocalCoffees();
    const totalVotes = coffees.reduce((sum, c) => sum + (c.votes || 0), 0);
    const sorted = [...coffees].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const topCoffee = sorted[0] || null;

    return {
      data: {
        totalVotes,
        totalCoffees: coffees.length,
        topCoffee
      },
      source: 'local'
    };
  },

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
