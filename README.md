# ⚡ RefactorPulse AI

> An AI-powered code review tool that gives you instant, structured feedback — styled like a real PR diff.

**RefactorPulse AI** lets you paste a code snippet, pick a language, and get back a clean unified diff view with line-anchored annotations powered by **Llama 3.3 70B** (via [Groq](https://console.groq.com)). 
 Live : https://refactor-plus.vercel.app/

---

## ✨ Features

- 🔍 **Instant AI Code Review** — Powered by Llama 3.3 70B via Groq's ultra-fast inference
- 📄 **Unified PR Diff View** — Results appear as a real GitHub-style diff with inline annotations
- 🎨 **Preset Snippets** — Built-in buggy code samples across multiple languages to try immediately
- 🌐 **Multi-language Support** — JavaScript, JSX, Python, TypeScript, and more
- ⚡ **WebGL Animated Background** — Dynamic SideRays rendered with OGL
- 🩺 **Live Server Health Indicator** — Real-time API status shown in the nav bar
- 📏 **200-line Limit Guard** — Validates input length before hitting the API

---

## 🗂️ Project Structure

```
RefactorPlus/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # UI components (CodeInput, UnifiedDiffReview, etc.)
│   │   ├── utils/           # Helper utilities
│   │   ├── App.jsx          # Root component & state management
│   │   └── index.css        # Global styles (Tailwind)
│   ├── index.html
│   └── vite.config.js       # Vite config with /api proxy → port 8000
│
├── server/                  # Express backend
│   ├── routes/
│   │   └── review.js        # POST /api/review endpoint
│   ├── services/
│   │   └── llmService.js    # Groq SDK integration
│   ├── utils/
│   ├── index.js             # Express server entry point (port 8000)
│   └── .env.example         # Environment variable template
│
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js** v18+
- A free **Groq API key** → [console.groq.com](https://console.groq.com)

### 1. Clone the repo

```bash
git clone https://github.com/Tanvik01/RefactorPlus.git
cd RefactorPlus
```

### 2. Set up the server

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and add your Groq key:

```env
PORT=8000
GROQ_API_KEY=gsk_your_actual_key_here
```

### 3. Set up the client

```bash
cd ../client
npm install
```

### 4. Run both together

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

The app will be live at **http://localhost:3000**. The Vite dev server proxies all `/api/*` requests to the Express backend on port 8000.

---

## 🌍 Deploying Live

The recommended approach is to deploy the **backend on Render** (free tier) and the **frontend on Vercel** (free tier).

### Backend → Render

1. Go to [render.com](https://render.com) and create a new **Web Service**
2. Connect your GitHub repo (`Tanvik01/RefactorPlus`)
3. Configure the service:

   | Setting | Value |
   |---|---|
   | **Root Directory** | `server` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Environment** | `Node` |

4. Under **Environment Variables**, add:
   - `GROQ_API_KEY` → your Groq key
5. Deploy — Render gives you a URL like `https://refactorpulse-server.onrender.com`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Set the **Root Directory** to `client`
3. Vercel auto-detects Vite — no build config needed
4. Create `client/vercel.json` to forward `/api` calls to your Render backend:

   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-render-url.onrender.com/api/:path*"
       }
     ]
   }
   ```

5. Deploy — Vercel gives you a URL like `https://refactorpulse.vercel.app`

> **Note:** On Render's free tier, the server spins down after 15 minutes of inactivity. The first request after a cold start can take ~30 seconds.

---

### Alternative: Railway (Full-Stack in One Place)

[Railway](https://railway.app) lets you deploy the monorepo with separate services in one project:

1. Create a new project → **Deploy from GitHub**
2. Add two services — one pointing to `/server`, one to `/client`
3. Set environment variables per service
4. Railway handles ports and networking automatically

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | API key from [console.groq.com](https://console.groq.com) |
| `PORT` | Optional | Server port (defaults to `8000`) |

---

## 📡 API Reference

### `POST /api/review`

Submit a code snippet for AI review.

**Request body:**
```json
{
  "code": "function foo() { var x = 1; }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "lineCount": 1,
    "language": "javascript",
    "timestamp": "2026-07-24T..."
  }
}
```

> **Limit:** Max **200 lines** per request.

### `GET /api/health`

Returns server status and whether the Groq API key is configured.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Animation | OGL (WebGL) |
| Icons | Lucide React |
| Syntax Highlight | PrismJS |
| Backend | Node.js, Express |
| AI Model | Llama 3.3 70B via Groq SDK |
| Schema Validation | Zod |

---

## 📄 License

MIT — see [LICENSE](./LICENSE)
