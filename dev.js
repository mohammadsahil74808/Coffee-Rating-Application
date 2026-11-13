// Cross-platform runner for concurrent backend and frontend development
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting RoastRank Full-Stack Application...\n');

// 1. Start Backend Server
const serverProcess = spawn('node', ['server/server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend Client (Vite)
const clientProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\n🛑 Stopping servers...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

