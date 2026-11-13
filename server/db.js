const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');

const initialCoffees = [
  {
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
    description: 'Cold Brew Nitro is slow-steeped for 18 hours and charged with pure nitrogen for a Guinness-like cascade.'
  },
  {
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
    description: 'Vanilla Latte handcrafted with double ristretto espresso, velvety microfoam, and real bourbon vanilla.'
  },
  {
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

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
  } else {
    console.log('Connected to SQLite database at', DB_PATH);
    initSchema();
  }
});

function initSchema() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS coffees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        roaster TEXT NOT NULL,
        origin TEXT NOT NULL,
        category TEXT DEFAULT 'beans',
        roast_level TEXT NOT NULL,
        votes INTEGER DEFAULT 0,
        cupping_score REAL DEFAULT 88.0,
        acidity INTEGER DEFAULT 7,
        sweetness INTEGER DEFAULT 8,
        body INTEGER DEFAULT 7,
        aroma INTEGER DEFAULT 8,
        flavor_notes TEXT NOT NULL,
        process TEXT DEFAULT 'Washed',
        altitude TEXT DEFAULT '1,800m MASL',
        icon_type TEXT DEFAULT 'beans',
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS vote_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coffee_id INTEGER NOT NULL,
        ip_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coffee_id) REFERENCES coffees(id)
      )
    `);

    // Always ensure fresh table with exact initial seed if empty or outdated
    db.get('SELECT COUNT(*) as count FROM coffees', (err, row) => {
      if (err) {
        console.error('Error checking coffees count:', err);
        return;
      }
      if (row.count === 0) {
        console.log('Seeding initial coffee catalogue...');
        seedCoffees();
      }
    });
  });
}

function seedCoffees() {
  const stmt = db.prepare(`
    INSERT INTO coffees (
      name, roaster, origin, category, roast_level, votes, cupping_score,
      acidity, sweetness, body, aroma, flavor_notes, process,
      altitude, icon_type, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of initialCoffees) {
    stmt.run(
      c.name, c.roaster, c.origin, c.category, c.roast_level, c.votes, c.cupping_score,
      c.acidity, c.sweetness, c.body, c.aroma, c.flavor_notes, c.process,
      c.altitude, c.icon_type, c.description
    );
  }
  stmt.finalize(() => {
    console.log('Seed completed successfully.');
  });
}

const dbOps = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM coffees ORDER BY votes DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM coffees WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  vote: (id, ipHash = 'anon') => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run('UPDATE coffees SET votes = votes + 1 WHERE id = ?', [id], function (err) {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }
          if (this.changes === 0) {
            db.run('ROLLBACK');
            return reject(new Error('Coffee not found'));
          }

          db.run(
            'INSERT INTO vote_history (coffee_id, ip_hash) VALUES (?, ?)',
            [id, ipHash],
            (insertErr) => {
              if (insertErr) {
                db.run('ROLLBACK');
                return reject(insertErr);
              }

              db.get('SELECT * FROM coffees WHERE id = ?', [id], (getErr, row) => {
                if (getErr) {
                  db.run('ROLLBACK');
                  return reject(getErr);
                }
                db.run('COMMIT');
                resolve(row);
              });
            }
          );
        });
      });
    });
  },

  addCoffee: (coffee) => {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO coffees (
          name, roaster, origin, category, roast_level, votes, cupping_score,
          acidity, sweetness, body, aroma, flavor_notes, process,
          altitude, icon_type, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        coffee.name,
        coffee.roaster || 'Specialty Roasters',
        coffee.origin || 'Single Origin',
        coffee.category || 'beans',
        coffee.roast_level || 'Medium',
        0,
        coffee.cupping_score || 88.0,
        coffee.acidity || 7,
        coffee.sweetness || 8,
        coffee.body || 7,
        coffee.aroma || 8,
        coffee.flavor_notes || 'Caramel, Floral, Cocoa',
        coffee.process || 'Washed',
        coffee.altitude || '1,800m MASL',
        coffee.icon_type || 'beans',
        coffee.description || 'Artisanal single origin roast with distinct terroir.'
      , function(err) {
        if (err) return reject(err);
        db.get('SELECT * FROM coffees WHERE id = ?', [this.lastID], (getErr, row) => {
          if (getErr) reject(getErr);
          else resolve(row);
        });
      });
      stmt.finalize();
    });
  },

  getStats: () => {
    return new Promise((resolve, reject) => {
      const queries = {
        totalVotes: 'SELECT SUM(votes) as total_votes, COUNT(*) as total_coffees FROM coffees',
        topCoffee: 'SELECT * FROM coffees ORDER BY votes DESC LIMIT 1',
        categoryBreakdown: 'SELECT category, COUNT(*) as count, SUM(votes) as votes FROM coffees GROUP BY category'
      };

      db.get(queries.totalVotes, (err1, totals) => {
        if (err1) return reject(err1);
        db.get(queries.topCoffee, (err2, top) => {
          if (err2) return reject(err2);
          db.all(queries.categoryBreakdown, (err3, categories) => {
            if (err3) return reject(err3);
            resolve({
              totalVotes: totals.total_votes || 0,
              totalCoffees: totals.total_coffees || 0,
              topCoffee: top || null,
              categoryBreakdown: categories || []
            });
          });
        });
      });
    });
  },

  reset: () => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('DELETE FROM vote_history');
        db.run('DELETE FROM coffees');
        db.run('DELETE FROM sqlite_sequence WHERE name IN ("coffees", "vote_history")');
        seedCoffees();
        resolve({ message: 'Database reset and re-seeded successfully' });
      });
    });
  }
};

module.exports = {
  db,
  dbOps,
  initialCoffees
};
