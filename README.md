<p align="center">
  <a href="https://github.com/yourusername/the-noter-ai">
    <img src="https://img.shields.io/badge/status-active-success" alt="Status" />
  </a>
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-15-black" alt="Next.js" />
  </a>
  <a href="https://fastapi.tiangolo.com">
    <img src="https://img.shields.io/badge/FastAPI-latest-009688" alt="FastAPI" />
  </a>
  <a href="https://www.python.org">
    <img src="https://img.shields.io/badge/Python-3.10+-3776AB" alt="Python" />
  </a>
</p>

<br />

<p align="center">
  <img width="80" src="https://raw.githubusercontent.com/ggerganov/whisper.cpp/master/logo.png" alt="Logo" />
</p>

<h1 align="center">Noter AI</h1>

<p align="center">
  <strong>Intelligent meeting assistant that transforms audio into actionable insights.</strong><br />
  <sub>Local transcription with Whisper.cpp + AI-powered analysis with Google Gemini</sub>
</p>

<br />

<p align="center">
  <a href="#features">Features</a> &nbsp;&middot;&nbsp;
  <a href="#how-it-works">How It Works</a> &nbsp;&middot;&nbsp;
  <a href="#tech-stack">Tech Stack</a> &nbsp;&middot;&nbsp;
  <a href="#setup">Setup</a> &nbsp;&middot;&nbsp;
  <a href="#usage">Usage</a>
</p>

---

## Features

- **Real-time Live Sessions** &mdash; Capture meeting audio directly from your browser tab with live waveform visualization and auto-stop on silence detection
- **Audio File Upload** &mdash; Drag-and-drop audio files for batch transcription and analysis
- **Local Transcription** &mdash; Powered by Whisper.cpp running locally for privacy and accuracy
- **AI Intelligence** &mdash; Google Gemini extracts executive summaries, key decisions, and action items with owner assignment
- **Session Dashboard** &mdash; Browse and manage all your past meeting sessions with status tracking
- **Insights Report** &mdash; Beautiful, structured view of summaries, decisions, action items, and full transcripts

## How It Works

```
Audio Input  -->  Whisper.cpp  -->  Transcript  -->  Gemini AI  -->  Intelligence Report
```

1. **Capture** &mdash; Record live meeting audio via browser tab capture, or upload a pre-recorded audio file
2. **Transcribe** &mdash; Whisper.cpp processes the audio locally into an accurate text transcript
3. **Analyze** &mdash; Google Gemini extracts structured intelligence: summaries, decisions, and action items
4. **Store** &mdash; All data is persisted in PostgreSQL with `pgvector` for future semantic search
5. **Present** &mdash; A polished dashboard displays the full meeting intelligence report

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS 4, Shadcn UI, Zustand |
| **Backend** | Python, FastAPI, SQLAlchemy, Uvicorn |
| **Transcription** | Whisper.cpp (local, optimized C++ inference) |
| **AI Analysis** | Google Gemini 2.5 via `google-genai` |
| **Database** | PostgreSQL with `pgvector` (Docker) |

## Setup

### Prerequisites

- **Node.js** & npm (frontend)
- **Python 3.10+** (backend)
- **Docker & Docker Compose** (database)
- **Make / CMake** (building Whisper.cpp)

### 1. Database

```bash
# From the root directory
docker compose up -d
```

> Starts PostgreSQL on port `5434` with `pgvector` enabled.

### 2. Backend

```bash
cd apps/api

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
pip install google-genai
```

### 3. Whisper.cpp

```bash
# From the root directory
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp

# Build the CLI executable
make

# Download a model (base recommended, or use tiny/medium/large)
./models/download-ggml-model.sh base
```

### 4. Environment Variables

Create `apps/api/.env`:

```env
GEMINI_API_KEY=your-gemini-api-key-here
```

## Usage

Run the backend and frontend in separate terminals:

### Backend (FastAPI)

```bash
cd apps/api
source venv/bin/activate
uvicorn app.main:app --reload
```

> API available at `http://localhost:8000`

### Frontend (Next.js)

```bash
cd apps/web
npm install
npm run dev
```

> App available at `http://localhost:3000`

### Workflow

1. Open `http://localhost:3000` in your browser
2. Start a **Live Session** to record in real-time, or **Upload Audio** for batch processing
3. Wait for AI transcription and analysis to complete
4. Review your intelligence report with summary, decisions, action items, and full transcript

## Project Structure

```
The-NoteTaker-AI/
├── apps/
│   ├── api/                  # FastAPI backend
│   │   ├── app/
│   │   │   ├── main.py       # Application entry point
│   │   │   ├── models/       # SQLAlchemy models
│   │   │   ├── routers/      # API route handlers
│   │   │   └── services/     # Business logic
│   │   └── requirements.txt
│   └── web/                  # Next.js frontend
│       └── src/
│           ├── app/          # Pages (dashboard, upload, live, session)
│           ├── components/   # UI components and live session widgets
│           └── hooks/        # Custom hooks (audio, speech, silence)
├── docker-compose.yml        # PostgreSQL + pgvector
└── README.md
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and future direction.
