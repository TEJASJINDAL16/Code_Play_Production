<div align="center">

# ⚡ CodePlay

### The Modern Collaborative Code Editor for Competitive Programmers

[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

**Write • Collaborate • Compete • Learn**

CodePlay is a feature-rich online IDE with real-time collaboration, AI-powered assistance, competitive programming integration (Codeforces, LeetCode, CSES), voice chat, and a Chrome extension for submitting solutions directly from the editor.

[Getting Started](#-getting-started) • [Features](#-features) • [Architecture](#-architecture) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## ✨ Features

| Category | Features |
|----------|----------|
| **📝 Code Editor** | Monaco Editor, 30+ languages, syntax highlighting, IntelliSense, multiple themes |
| **👥 Real-Time Collaboration** | Yjs CRDT-based sync, live cursors, presence indicators, collaborative rooms |
| **🤖 AI Assistant** | Google Gemini integration for code explanation, debugging, and generation |
| **🏆 Competitive Programming** | Codeforces, LeetCode, and CSES problem browsing, code execution, and submission |
| **🎯 Code Judge** | Built-in judge with Docker sandboxed execution (C++, Python, Java, JavaScript) |
| **🎙️ Voice Chat** | LiveKit-powered real-time voice communication in collaborative rooms |
| **🔗 Code Sharing** | Shareable links with syntax-highlighted read-only views |
| **👤 User Profiles** | Coding stats, Codeforces/LeetCode/CodeChef/GitHub integration, activity tracking |
| **🧩 Chrome Extension** | Submit solutions to Codeforces and LeetCode directly from CodePlay |
| **📁 File Management** | Multi-file projects with folder structure support |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         NGINX GATEWAY (:80)                          │
│                   Rate Limiting │ SSL │ Caching                      │
└────────────────┬──────────────────────────────────────┬────────────────┘
                 │                                      │
    ┌────────────┴────────┐          ┌────────────┴────────┐
    │   FRONTEND (:5173)     │          │   BACKEND (:5000)      │
    │   React + Vite         │          │   Express + Socket.IO  │
    │   Monaco Editor        │◄───WS───►│   Yjs + WebSocket      │
    │   React Query          │          │   LiveKit Integration  │
    └───────────────────────┘          └───────┬───────┬───────┘
                                             │       │
                                    ┌───────┴─┐ ┌───┴───────┐
                                    │ MongoDB │ │   Redis   │
                                    │  (:27017)│ │  (:6379)  │
                                    └─────────┘ └──────────┘
```

---

## 📦 Folder Structure

```
Code_Play_Production/
├── backend/                    # Express.js API Server
│   ├── config/                 #   Redis, database configuration
│   ├── middleware/             #   Auth, rate limiting, caching, error handling
│   ├── models/                 #   Mongoose schemas (User, Room, File, etc.)
│   ├── routes/                 #   API endpoints (auth, code, AI, problems, etc.)
│   ├── services/               #   Business logic (Docker judge, CSES test cases)
│   ├── socket/                 #   Socket.IO event handlers
│   ├── utils/                  #   Helpers (scrapers, queue, token)
│   ├── workers/                #   Background jobs (CSES judge worker)
│   ├── tests/                  #   Jest test suites
│   ├── docker/                 #   Language-specific Dockerfiles for code judge
│   ├── index.js                #   Server entry point
│   ├── db.js                   #   MongoDB connection with pooling
│   ├── Dockerfile              #   Backend container
│   └── .env.example            #   Environment variable template
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/         #     UI components (Dashboard, Workspace, etc.)
│   │   ├── context/            #     React context providers (Auth, App)
│   │   ├── hooks/              #     Custom React hooks
│   │   ├── lib/                #     API client, React Query, lazy loading
│   │   ├── utils/              #     Utility functions
│   │   ├── App.jsx             #     Root component with routes
│   │   └── main.jsx            #     App entry point
│   ├── Dockerfile              #   Frontend container (nginx)
│   └── .env.example            #   Frontend environment template
├── chrome-extension/           # Chrome Extension (Manifest V3)
│   ├── manifest.json           #   Extension config
│   ├── background.js           #   Service worker
│   ├── content.js              #   Content scripts
│   └── popup.html/js           #   Extension popup
├── docker/                     # Infrastructure
│   └── nginx-gateway.conf      #   Nginx reverse proxy config
├── docker-compose.yml          # Full-stack orchestration
├── Makefile                    # Development commands
├── .github/workflows/          # CI/CD pipelines
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | 20 LTS | Runtime |
| [MongoDB](https://www.mongodb.com/try/download) | 6.0+ | Database |
| [Redis](https://redis.io/download) | 7.0+ | Caching & queues (optional) |
| [Docker](https://www.docker.com/get-started) | 24+ | Containerized setup (alternative) |

> **💡 Tip:** If you don't want to install MongoDB/Redis locally, use the [Docker setup](#-docker-setup-recommended) instead.

---

### Option A: Docker Setup (Recommended)

The fastest way to get everything running.

```bash
# 1. Clone the repository
git clone https://github.com/TEJASJINDAL16/Code_Play_Production.git
cd Code_Play_Production

# 2. Create backend environment file
cp backend/.env.example backend/.env
# Edit backend/.env and set your MONGO_URI, JWT_SECRET, etc.

# 3. Start all services
make docker-up
# OR: docker compose up -d

# 4. Open in browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# Gateway:  http://localhost:80
```

---

### Option B: Manual Setup (Development)

<details>
<summary><strong>🐧 Linux</strong></summary>

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
# See: https://www.mongodb.com/docs/manual/administration/install-on-linux/

# Install Redis (optional)
sudo apt-get install redis-server

# Clone and setup
git clone https://github.com/TEJASJINDAL16/Code_Play_Production.git
cd Code_Play_Production

# Install dependencies
make install

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both .env files with your values

# Start development servers
make dev
# Backend runs on http://localhost:5000
# Frontend runs on http://localhost:5173
```

</details>

<details>
<summary><strong>🍎 macOS</strong></summary>

```bash
# Install Node.js 20 LTS (via Homebrew)
brew install node@20

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0

# Install Redis (optional)
brew install redis
brew services start redis

# Clone and setup
git clone https://github.com/TEJASJINDAL16/Code_Play_Production.git
cd Code_Play_Production

# Install dependencies
make install

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both .env files with your values

# Start development servers
make dev
```

</details>

<details>
<summary><strong>🪟 Windows</strong></summary>

```powershell
# Install Node.js 20 LTS
# Download from: https://nodejs.org/en/download/

# Install MongoDB
# Download from: https://www.mongodb.com/try/download/community

# Install Redis (optional, use WSL or Memurai)
# WSL: sudo apt-get install redis-server
# Memurai: https://www.memurai.com/

# Clone and setup
git clone https://github.com/TEJASJINDAL16/Code_Play_Production.git
cd Code_Play_Production

# Install dependencies
cd backend && npm ci && cd ..
cd frontend && npm install && cd ..

# Configure environment
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
# Edit both .env files with your values

# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

</details>

---

### ⚙️ Environment Variables

#### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | ✅ | `mongodb://localhost:27017/codeplay` | MongoDB connection string |
| `JWT_SECRET` | ✅ | — | Secret key for JWT tokens |
| `PORT` | ❌ | `5000` | Backend server port |
| `NODE_ENV` | ❌ | `development` | Environment mode |
| `FRONTEND_URL` | ❌ | `http://localhost:5173` | Frontend URL for CORS |
| `GOOGLE_CLIENT_ID` | ❌ | — | Google OAuth client ID |
| `GITHUB_CLIENT_ID` | ❌ | — | GitHub OAuth client ID |
| `GEMINI_API_KEY` | ❌ | — | Google Gemini API key for AI features |
| `REDIS_URL` | ❌ | — | Redis connection URL |
| `EMAIL_USER` | ❌ | — | Email for password reset |

#### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ❌ | `http://localhost:5000` | Backend API URL |

---

## 📚 API Reference

### Core Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | ❌ | Health check |
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login |
| `GET` | `/api/profile` | ✅ | Get user profile |
| `GET` | `/api/rooms` | ❌ | List collaborative rooms |

### Code Execution

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/code/run` | ✅ | Execute code (sandboxed) |
| `GET` | `/api/problems` | ❌ | List competitive problems |
| `POST` | `/api/submissions` | ✅ | Submit solution |

### AI Assistant

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/ai/explain` | ❌ | AI-powered code explanation |
| `POST` | `/api/ai/debug` | ❌ | AI-powered debugging |

### Proxy Endpoints (CORS bypass)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/proxy/codeforces/user/info/:handle` | Codeforces user info |
| `GET` | `/api/proxy/leetcode/:username` | LeetCode stats |
| `GET` | `/api/proxy/codechef/:handle` | CodeChef rating data |
| `GET` | `/api/proxy/github/:username` | GitHub profile stats |

---

## 🧩 Chrome Extension

The CodePlay Helper extension allows you to submit solutions directly from the editor to Codeforces and LeetCode.

### Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `chrome-extension/` directory

> **Note:** The extension is configured for the production URL (`cod-play.tech`). For local development, update the URLs in `chrome-extension/manifest.json` and `chrome-extension/background.js` to use `localhost`.

---

## 🛠️ Development

### Available Commands

```bash
make help              # Show all available commands
make install           # Install all dependencies
make dev               # Start both frontend and backend
make dev-backend       # Start backend only
make dev-frontend      # Start frontend only
make build             # Build frontend for production
make test              # Run backend tests
make lint              # Lint both frontend and backend
make clean             # Remove node_modules and build artifacts
make docker-up         # Start all Docker services
make docker-down       # Stop all Docker services
make docker-logs       # Tail container logs
```

### Running Tests

```bash
cd backend
npm test               # Run all tests
npm run lint           # Check code style
npm run format         # Auto-format code
```

---

## 🔧 Troubleshooting

<details>
<summary><strong>MongoDB connection refused</strong></summary>

```
❌ MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Fix:** Ensure MongoDB is running:
- **macOS:** `brew services start mongodb-community@6.0`
- **Linux:** `sudo systemctl start mongod`
- **Docker:** `docker compose up mongo`

</details>

<details>
<summary><strong>Redis connection error (warnings in console)</strong></summary>

```
⚠️ Redis Connection Error (Caching disabled)
```

**This is non-fatal.** Redis is optional — the app works without it, but caching and background jobs (CSES judge) will be disabled.

</details>

<details>
<summary><strong>Port already in use</strong></summary>

```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change the port in backend/.env:
PORT=5001
```

</details>

<details>
<summary><strong>Frontend can't reach backend</strong></summary>

Ensure `VITE_API_URL` in `frontend/.env` matches your backend URL:

```env
VITE_API_URL=http://localhost:5000
```

If using Docker, the frontend container proxies through the nginx gateway.

</details>

<details>
<summary><strong>"Cannot find module" errors</strong></summary>

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

</details>

---

## 📍 Roadmap

- [ ] 🧪 Expand test coverage (integration + E2E tests)
- [ ] 🔐 Add refresh token rotation
- [ ] 🌍 Multi-language UI (i18n)
- [ ] 📱 Mobile-responsive editor layout
- [ ] ☁️ Kubernetes deployment manifests
- [ ] 📊 Admin dashboard with usage analytics
- [ ] 🤖 Multiple AI model support (GPT-4, Claude)
- [ ] 🎬 Session recording and playback

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">

**Built with ❤️ by [Tejas Jindal](https://github.com/TEJASJINDAL16)**

</div>
