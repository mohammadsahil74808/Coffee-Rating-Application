const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');

const initialCoffees = [
  {
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
        image_url TEXT NOT NULL,
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
      name, roaster, origin, roast_level, votes, cupping_score,
      acidity, sweetness, body, aroma, flavor_notes, process,
      altitude, image_url, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of initialCoffees) {
    stmt.run(
      c.name, c.roaster, c.origin, c.roast_level, c.votes, c.cupping_score,
      c.acidity, c.sweetness, c.body, c.aroma, c.flavor_notes, c.process,
      c.altitude, c.image_url, c.description
    );
  }
  stmt.finalize(() => {
    console.log('Seed completed successfully.');
  });
}

const dbOps = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM coffees ORDER BY votes DESC, cupping_score DESC', (err, rows) => {
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
          name, roaster, origin, roast_level, votes, cupping_score,
          acidity, sweetness, body, aroma, flavor_notes, process,
          altitude, image_url, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        coffee.name,
        coffee.roaster || 'Specialty Roasters',
        coffee.origin || 'Single Origin',
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
        coffee.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
        coffee.description || 'Artisanal single origin coffee hand-roasted with precision.'
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
        roastBreakdown: 'SELECT roast_level, COUNT(*) as count, SUM(votes) as votes FROM coffees GROUP BY roast_level'
      };

      db.get(queries.totalVotes, (err1, totals) => {
        if (err1) return reject(err1);
        db.get(queries.topCoffee, (err2, top) => {
          if (err2) return reject(err2);
          db.all(queries.roastBreakdown, (err3, roasts) => {
            if (err3) return reject(err3);
            resolve({
              totalVotes: totals.total_votes || 0,
              totalCoffees: totals.total_coffees || 0,
              topCoffee: top || null,
              roastBreakdown: roasts || []
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

