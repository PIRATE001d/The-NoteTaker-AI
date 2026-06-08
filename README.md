# The Noter AI

The Noter AI is an intelligent audio transcription and meeting assistant. It takes your raw audio, accurately transcribes it using local AI, and then extracts an executive summary, key decisions, and actionable tasks using advanced LLM processing.

## 🚀 How It Works

1. **Upload Audio**: You upload a meeting recording via the Next.js frontend.
2. **Local Transcription (Whisper.cpp)**: The FastAPI backend receives the file and runs it through a highly optimized, locally-hosted **Whisper.cpp** model to generate a highly accurate text transcript.
3. **AI Extraction (Gemini)**: The transcript is automatically sent to **Google Gemini** (via `google-genai`), which acts as an AI meeting assistant to generate:
   - A concise executive summary.
   - A bulleted list of key decisions.
   - Actionable tasks (identifying the task and the owner).
4. **Data Storage**: The parsed intelligence and raw transcript are stored securely in a local **PostgreSQL** database (running via Docker with `pgvector` enabled for future embedding search capabilities).
5. **Insights Dashboard**: The user is instantly presented with a beautiful dashboard breaking down the meeting.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI
- **Backend**: Python, FastAPI, SQLAlchemy, Uvicorn
- **AI / ML**: Whisper.cpp (Local Audio Transcription), Google Gemini 2.5 (LLM Extraction)
- **Database**: PostgreSQL with `pgvector` (via Docker)

---

## 💻 Setup & Installation

### Prerequisites
- Node.js & npm (for the frontend)
- Python 3.10+ (for the backend)
- Docker & Docker Compose (for the database)
- Make / CMake (for building Whisper.cpp)

### 1. Database Setup
Start the PostgreSQL database via Docker.
```bash
# From the root directory
docker compose up -d
```
*(This starts a Postgres instance on port 5434 with `pgvector` installed)*

### 2. Backend Setup
Set up your Python virtual environment and install dependencies.
```bash
# Navigate to the backend directory
cd apps/api

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install google-genai
```

### 3. Whisper.cpp Setup
The backend requires `whisper.cpp` to be built and a model to be downloaded.
```bash
# From the root directory
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp

# Build the whisper-cli executable
make

# Download the base model (you can also use 'tiny' or 'medium')
./models/download-ggml-model.sh base
```

### 4. Environment Variables
In the `apps/api` directory, ensure your `.env` file has your Google Gemini API key:
```env
# apps/api/.env
GEMINI_API_KEY=your-gemini-api-key-here
```

---

## 🏃‍♂️ How to Run the App

You will need to run both the backend and frontend simultaneously in separate terminal windows.

### Start the Backend (FastAPI)
```bash
cd apps/api
source venv/bin/activate
uvicorn app.main:app --reload
```
*The API will be available at `http://localhost:8000`*

### Start the Frontend (Next.js)
```bash
cd apps/web
npm install
npm run dev
```
*The web app will be available at `http://localhost:3000`*

---

## 🧪 Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click **+ New Audio Session** or **Upload Audio**.
3. Select an audio file (e.g., a `.wav` file). *Note: Whisper.cpp works best with 16kHz WAV files.*
4. Wait a few moments as the AI transcribes and extracts insights.
5. Review your beautiful intelligence report featuring the summary, decisions, action items, and full transcript!
