# 🎙️ AURA Speech AI - Next-Gen Google Voice Recognition SaaS

Commercial-grade AI Voice Recognition SaaS web application powered by **Google Speech Recognition API**, featuring multi-language transcription (>40 languages), real-time audio analytics, voice commands, and multi-format subtitle exports (SRT, VTT, PDF, DOCX).

---

## ✨ Key Features

- **Google Speech Engine**: High-accuracy Speech-to-Text conversion powered by Google Speech Recognition API.
- **Multilingual Support**: Supports over 40 languages including English, Tamil (`ta-IN`), Hindi (`hi-IN`), Spanish, French, German, Japanese, and Chinese.
- **Real-Time Visualizer**: Interactive 3D microphone and dynamic audio spectrum visualizer.
- **Speech Analytics**: Live metrics including WPM (words per minute), confidence score, filler word counter, and emotion detection.
- **Export Options**: Export transcripts to SRT (subtitles), WebVTT, PDF, DOCX, and TXT format.
- **History & Favorites**: Save, search, filter, and star past recordings.
- **Admin Dashboard**: System health metrics, active connection monitoring, and server logs.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Python 3.10+, FastAPI, Uvicorn, SQLAlchemy, SpeechRecognition, PyJWT, Passlib, Bcrypt

---

## 🚀 Quick Start

### 1. Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```
- API Base URL: `http://localhost:8000`
- Swagger Documentation: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
- Open application at: `http://localhost:5173`

---

## 📄 License

MIT License
