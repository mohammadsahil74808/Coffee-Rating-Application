const express = require('express');
const cors = require('cors');
const { dbOps } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Coffee Rating Application Backend',
    database: 'SQLite 3',
    timestamp: new Date().toISOString()
  });
});

// Get all coffees
app.get('/api/coffees', async (req, res) => {
  try {
    const coffees = await dbOps.getAll();
    res.json({ success: true, data: coffees, count: coffees.length });
  } catch (error) {
    console.error('Error fetching coffees:', error);
    res.status(500).json({ success: false, error: 'Database query failed' });
  }
});

// Get single coffee by id
app.get('/api/coffees/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid coffee ID' });
    }
    const coffee = await dbOps.getById(id);
    if (!coffee) {
      return res.status(404).json({ success: false, error: 'Coffee not found' });
    }
    res.json({ success: true, data: coffee });
  } catch (error) {
    console.error('Error fetching coffee by id:', error);
    res.status(500).json({ success: false, error: 'Database query failed' });
  }
});

// Vote for a coffee (+1 vote)
app.post('/api/coffees/:id/vote', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid coffee ID' });
    }
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const updatedCoffee = await dbOps.vote(id, clientIp);
    res.json({
      success: true,
      message: `Vote registered for ${updatedCoffee.name}`,
      data: updatedCoffee
    });
  } catch (error) {
    console.error('Error casting vote:', error);
    if (error.message === 'Coffee not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: 'Failed to record vote' });
  }
});

// Add a new specialty coffee
app.post('/api/coffees', async (req, res) => {
  try {
    const { name, roaster, origin, roast_level, cupping_score, flavor_notes, process, altitude, image_url, description } = req.body;
    if (!name || !roaster || !origin) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, roaster, and origin are required.'
      });
    }

    const newCoffee = await dbOps.addCoffee({
      name,
      roaster,
      origin,
      roast_level: roast_level || 'Medium',
      cupping_score: parseFloat(cupping_score) || 88.0,
      flavor_notes: flavor_notes || 'Caramel, Floral, Cocoa',
      process: process || 'Washed',
      altitude: altitude || '1,800m MASL',
      image_url: image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
      description: description || 'Artisanal single origin roast with distinct terroir.'
    });

    res.status(201).json({ success: true, message: 'Coffee added successfully', data: newCoffee });
  } catch (error) {
    console.error('Error adding coffee:', error);
    res.status(500).json({ success: false, error: 'Failed to add coffee' });
  }
});

// Get overall stats
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await dbOps.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve stats' });
  }
});

// Reset database to initial seed
app.post('/api/reset', async (req, res) => {
  try {
    const result = await dbOps.reset();
    res.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ success: false, error: 'Failed to reset database' });
  }
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`☕ Specialty Coffee Backend Server is running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints available:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/coffees`);
  console.log(`   - POST /api/coffees/:id/vote`);
  console.log(`   - POST /api/coffees`);
  console.log(`   - GET  /api/stats`);
  console.log(`   - POST /api/reset`);
});

module.exports = { app, server };
