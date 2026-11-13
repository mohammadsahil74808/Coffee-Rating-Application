// Automated Backend & Database Verification Script
const { app, server } = require('./server');
const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: 'localhost',
      port,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting automated API and Database verification tests...\n');
  let passed = 0;
  let failed = 0;

  try {
    // 1. Health check
    const health = await request('/api/health');
    if (health.status === 200 && health.body.status === 'ok') {
      console.log('✅ Test 1: GET /api/health returned 200 OK');
      passed++;
    } else {
      console.error('❌ Test 1 Failed:', health);
      failed++;
    }

    // 2. Fetch all coffees
    const list = await request('/api/coffees');
    if (list.status === 200 && Array.isArray(list.body.data) && list.body.data.length >= 8) {
      console.log(`✅ Test 2: GET /api/coffees returned ${list.body.data.length} seeded coffees`);
      passed++;
    } else {
      console.error('❌ Test 2 Failed:', list);
      failed++;
    }

    // 3. Test Voting (+1 vote in DB)
    const targetCoffee = list.body.data[0];
    const initialVotes = targetCoffee.votes;
    const voteRes = await request(`/api/coffees/${targetCoffee.id}/vote`, { method: 'POST' });

    if (voteRes.status === 200 && voteRes.body.data.votes === initialVotes + 1) {
      console.log(`✅ Test 3: POST /api/coffees/${targetCoffee.id}/vote successfully incremented votes from ${initialVotes} to ${voteRes.body.data.votes} in SQLite DB`);
      passed++;
    } else {
      console.error('❌ Test 3 Failed:', voteRes);
      failed++;
    }

    // 4. Test Stats
    const statsRes = await request('/api/stats');
    if (statsRes.status === 200 && statsRes.body.data.totalVotes > 0) {
      console.log(`✅ Test 4: GET /api/stats returned total votes: ${statsRes.body.data.totalVotes}, leader: ${statsRes.body.data.topCoffee.name}`);
      passed++;
    } else {
      console.error('❌ Test 4 Failed:', statsRes);
      failed++;
    }

    // 5. Test Adding a New Coffee
    const newCoffeePayload = {
      name: 'Rwanda Huye Mountain Red Bourbon',
      roaster: 'Thousand Hills Roasters',
      origin: 'Huye District, Southern Province, Rwanda',
      roast_level: 'Light',
      cupping_score: 90.0,
      flavor_notes: 'Red Currant, Black Tea, Orange Zest, Brown Sugar',
      process: 'Fully Washed',
      altitude: '2,100m MASL',
      image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
      description: 'Grown on the steep slopes of Mount Huye by cooperative farmers.'
    };
    const addRes = await request('/api/coffees', { method: 'POST', body: newCoffeePayload });
    if (addRes.status === 201 && addRes.body.data.id) {
      console.log(`✅ Test 5: POST /api/coffees successfully inserted new coffee #${addRes.body.data.id} into database`);
      passed++;
    } else {
      console.error('❌ Test 5 Failed:', addRes);
      failed++;
    }

    console.log(`\n🎉 Verification Complete: ${passed} passed, ${failed} failed.\n`);
  } catch (err) {
    console.error('💥 Test suite encountered exception:', err);
  } finally {
    server.close(() => {
      console.log('🔒 Backend test server closed.');
      process.exit(failed > 0 ? 1 : 0);
    });
  }
}

// Allow server a moment to spin up and seed before testing
setTimeout(runTests, 500);

