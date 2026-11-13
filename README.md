# ☕ RoastRank — Specialty Coffee Rating Application

An interactive, full-stack coffee rating and cupping platform built with **React**, **Vite**, **Tailwind CSS**, **Node.js/Express**, and **SQLite**.

Designed with an **Adaptive Dual-Mode Storage Architecture**:
1. **Full-Stack Mode (Local)**: Real Express.js REST API with SQLite database, atomic vote transactions, and audit logging.
2. **GitHub Pages Mode (Production)**: In-browser persistent database layer enabling full voting, filtering, and persistence without requiring paid backend servers.

---

## 🌟 Key Features

- **Interactive Voting System**:
  - Tactile voting button with micro-animations.
  - Procedural ceramic cup audio chime (synthesized via Web Audio API — zero audio asset dependencies).
  - Celebratory coffee-bean confetti burst on click.
  - Floating `+1` particle animations and optimistic UI updates with automatic rollback on error.
- **Backend & Database Logic**:
  - SQLite persistent database (`server/database.sqlite`).
  - Atomic transactions (`BEGIN TRANSACTION`, `UPDATE ... votes = votes + 1`, `INSERT INTO vote_history`, `COMMIT`).
  - Client IP auditing and timestamped vote history table.
  - RESTful API endpoints for querying, voting, inserting coffees, and aggregating stats.
- **Sensory & Cupping Profile**:
  - Specialty Coffee Association (SCA) cupping scores (e.g. 94.0 pts).
  - Cup Balance meters (Acidity, Sweetness, Body, Aroma).
  - Terroir details: Elevation (MASL), Processing Method (Washed, Natural, Honey, Anaerobic), and Roaster origin.
  - Interactive tasting notes chips that double as one-click search filters.
- **Community Analytics**:
  - Dynamic leaderboard ranking (#1 Top Pick medal, #2, #3).
  - Total community votes cast counter.
  - Roast preference distribution bar (Light, Medium, Dark).
- **Extensible Catalog**:
  - "Submit New Specialty Coffee" modal to insert custom beans into the database.
  - Database reset & re-seed action.
  - Responsive dark espresso artisanal theme (`#120e0b`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Canvas-Confetti, Web Audio API.
- **Backend**: Node.js, Express.js, SQLite (`sqlite3` with serialized transactions), CORS.
- **CI/CD**: GitHub Actions workflow for automatic deployment to GitHub Pages.

---

## 🚀 Getting Started Locally

### 1. Installation
Clone the repository and install dependencies:

```bash
# Install root, client, and server dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Run the Application (Full-Stack Dev Mode)
Run both the Express backend and the Vite frontend concurrently:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

### 3. Run Backend Verification Tests
Verify all API endpoints and database updates with the automated test suite:

```bash
npm test
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and SQLite database status |
| `GET` | `/api/coffees` | Returns list of all coffees sorted by votes |
| `GET` | `/api/coffees/:id` | Returns single coffee by ID |
| `POST` | `/api/coffees/:id/vote` | Atomically increments vote count by +1 |
| `POST` | `/api/coffees` | Inserts a new coffee into the database |
| `GET` | `/api/stats` | Aggregated metrics (total votes, leader, roast breakdown) |
| `POST` | `/api/reset` | Resets database back to default seed coffees |

---

## 🌐 Deploying to GitHub Pages

1. Create a repository on GitHub.
2. Link the repository and push:
   ```bash
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git add .
   git commit -m "feat: complete coffee rating application with dual-mode db"
   git push -u origin main
   ```
3. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
   - The included workflow `.github/workflows/deploy.yml` will automatically build and publish your site!

