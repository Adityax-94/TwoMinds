<div align="center">

# TWOMINDS
### AI Debate Arena

**Two AI agents. One topic. One winner.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-black?style=for-the-badge&logo=vercel)](https://two-minds-nine.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-blueviolet?style=for-the-badge&logo=railway)](https://twominds-production.up.railway.app)
[![GitHub](https://img.shields.io/github/stars/Adityax-94/TwoMinds?style=for-the-badge&logo=github)](https://github.com/Adityax-94/TwoMinds)

</div>

---

## What is TwoMinds?

TwoMinds is a **multi-agent AI debate system** where two LLM agents argue opposing sides of any topic — orchestrated by a LangGraph state machine, scored by a judge agent, and displayed in a sleek React frontend.

Enter any topic. Watch AI argue. See who wins.

---

## Live Demo

🌐 **Frontend:** [two-minds-nine.vercel.app](https://two-minds-nine.vercel.app)  
⚙️ **API:** [twominds-production.up.railway.app](https://twominds-production.up.railway.app)

---

## Features

- 🤖 **Multi-agent orchestration** — Two AI agents with opposing personas debate in real time
- ⚖️ **Judge agent** — A third agent scores each round on logic, evidence and persuasiveness
- 🔄 **Stateful debate loop** — LangGraph conditional edges drive N-round debates with shared memory
- 📊 **Live scoreboard** — Real-time score bar updates after every round
- 🏆 **Final verdict** — Judge declares a winner with detailed reasoning
- 🎨 **Production UI** — Dark cinematic React frontend with streaming responses
- 📡 **Streaming API** — FastAPI Server-Sent Events stream arguments live to the frontend
- 💬 **Preset topics** — One-click debate starters for quick demos

---

## Architecture

```
User enters topic
       │
       ▼
  FastAPI Backend  ──── Server-Sent Events ────►  React Frontend
       │
       ▼
  LangGraph State Machine
       │
       ├──► Proponent Agent (Llama 3.3 70B)  — argues FOR
       │           │
       │           ▼
       ├──► Opponent Agent (Llama 3.3 70B)   — argues AGAINST
       │           │
       │           ▼
       └──► Judge Agent (Llama 3.3 70B)      — scores round
                   │
         ┌─────────┴──────────┐
      round < N           round == N
         │                    │
    next round          Final Verdict
```

The shared `DebateState` (Pydantic model) flows through every LangGraph node — each agent reads the full debate history before responding, creating genuine context-aware arguments.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Agent Orchestration** | LangGraph |
| **LLM Provider** | Groq (Llama 3.3 70B Versatile) |
| **Agent Framework** | LangChain |
| **State Schema** | Pydantic v2 |
| **Backend API** | FastAPI + Uvicorn |
| **Streaming** | Server-Sent Events (SSE) |
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS |
| **Backend Deploy** | Railway |
| **Frontend Deploy** | Vercel |

---

## Project Structure

```
TwoMinds/
├── api.py                    # FastAPI backend with SSE streaming
├── agents/
│   ├── proponent.py          # Llama agent — argues FOR
│   ├── opponent.py           # Llama agent — argues AGAINST
│   └── judge.py              # Scores rounds + delivers final verdict
├── graph/
│   └── debate_graph.py       # LangGraph state machine
├── state/
│   └── debate_state.py       # Pydantic shared state model
├── utils/
│   └── prompts.py            # All system prompts
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app + SSE client
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── TopicInput.jsx
│   │   │   ├── DebateArena.jsx
│   │   │   ├── ArgumentBubble.jsx
│   │   │   ├── ScoreBar.jsx
│   │   │   └── Verdict.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── nixpacks.toml             # Railway Python config
├── Procfile                  # Railway start command
└── requirements.txt
```

---

## Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend Setup
```bash
# Clone the repo
git clone https://github.com/Adityax-94/TwoMinds.git
cd TwoMinds

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GROQ_API_KEY=your_key_here > .env

# Start backend
uvicorn api:app --reload --port 8000
```

### Frontend Setup
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** 🚀

---

## Key Engineering Concepts

- **Agentic loop** — LangGraph conditional edges route between "next round" and "final verdict" based on state
- **Shared state** — Pydantic `DebateState` passed through every node carrying full debate history
- **Structured output** — Judge agent returns JSON scores, parsed and validated with fallback handling
- **Memory** — every agent receives the full debate transcript as context before each response
- **SSE streaming** — FastAPI streams debate events to React in real time using Server-Sent Events
- **CORS** — configured to allow cross-origin requests between Vercel frontend and Railway backend

---

## Roadmap

- [ ] Fact-checker agent that flags dubious claims mid-debate
- [ ] Audience voting mode
- [ ] Export debate transcript as PDF
- [ ] Support for open-source models via Ollama
- [ ] WebSocket support for true real-time streaming
- [ ] Multiple judge personas

---


<div align="center">

Built by [Aditya](https://github.com/Adityax-94) &nbsp;·&nbsp; Powered by LangGraph · Groq · FastAPI · React

</div>
