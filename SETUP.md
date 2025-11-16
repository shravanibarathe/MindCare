# MindCare AI - Setup Guide

## Overview
MindCare AI is an Emotion Intelligence System that detects, understands, and responds to human emotions using both text and voice inputs. It provides empathetic, personalized mental health support with features like emotion tracking, AI journaling, relaxation exercises, and more.

## Prerequisites

### Frontend
- Node.js 18+ and npm
- Modern web browser

### Backend
- Python 3.8+
- pip (Python package manager)

## Installation Steps

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Setup Backend

Navigate to the backend directory and install Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

### 3. Environment Configuration

The `.env` file in the root directory contains your Supabase credentials.

Create a `.env` file in the `backend` directory with the following:

```env
VITE_SUPABASE_URL=https://bbcnxvuzfnquwuhxysha.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_api_key
```

**Important:** To use the AI response generation, you need an OpenAI API key.
Get one at: https://platform.openai.com/api-keys

### 4. Database Setup

The database schema has been automatically created in Supabase with the following tables:
- `users` - User account information
- `emotion_logs` - Emotion detection history
- `journal_entries` - Daily reflection entries
- `voice_profiles` - Voice cloning profiles (future feature)
- `user_preferences` - User settings and preferences

All tables have Row Level Security (RLS) enabled for data privacy.

## Running the Application

### Start the Backend Server

```bash
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

### Start the Frontend Development Server

In a new terminal, from the project root:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features

### 1. Emotion Detection
- Text-based emotion analysis using DistilRoBERTa model
- Voice tone analysis using librosa
- Combined text + voice emotion detection
- Real-time emotion tracking

### 2. Empathy Engine
- GPT-powered response generation
- Context-aware, empathetic responses
- CBT-inspired emotional support
- Personalized tone based on detected emotion

### 3. Chat Interface
- Real-time emotion-adaptive UI
- Text and voice input support
- Conversation history
- Visual feedback for emotions

### 4. Emotion Analytics Dashboard
- 7-day and 30-day emotion trends
- Visual emotion distribution charts
- Dominant emotion insights
- Interaction statistics

### 5. Relaxation Mode
- Guided breathing exercises (4-7-8 technique)
- Dynamic breathing animations
- Emotion-specific affirmations
- Calming music recommendations
- Grounding exercises

### 6. AI Journal
- Daily emotion summaries
- Personal reflection notes
- Mood pattern tracking
- AI-generated insights

### 7. Settings & Privacy
- Theme preferences
- Voice response toggle
- Music recommendations toggle
- Data retention controls
- Complete data deletion option

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Supabase for authentication and database
- Lucide React for icons
- Vite for build tooling

### Backend
- Flask (Python web framework)
- Transformers (Hugging Face) for NLP
- librosa for audio analysis
- OpenAI API for response generation
- Supabase Python client

### Database
- Supabase (PostgreSQL)
- Row Level Security for data privacy
- Real-time capabilities

## API Endpoints

### Backend API

- `GET /health` - Health check
- `POST /api/analyze-text` - Analyze text emotion
- `POST /api/analyze-voice` - Analyze voice emotion
- `POST /api/combined-analysis` - Combined text + voice analysis
- `GET /api/emotion-stats` - Get emotion statistics
- `POST /api/journal-summary` - Generate daily journal summary
- `POST /api/relaxation-recommendations` - Get relaxation activities

## Security & Privacy

- All user data is encrypted and secure
- Row Level Security ensures users can only access their own data
- Authentication required for all protected routes
- No data sharing with third parties
- User can delete all data at any time

## Troubleshooting

### Backend Issues

**Issue:** Model loading errors
**Solution:** Ensure you have enough RAM (8GB+ recommended) and stable internet for first-time model downloads

**Issue:** Audio analysis errors
**Solution:** Install ffmpeg: `brew install ffmpeg` (Mac) or `apt-get install ffmpeg` (Linux)

### Frontend Issues

**Issue:** CORS errors
**Solution:** Ensure backend is running on port 5000 and frontend on 5173

**Issue:** Authentication errors
**Solution:** Verify Supabase credentials in `.env` file

## Development Notes

- The emotion detection model downloads on first run (~500MB)
- Voice analysis requires audio files in common formats (mp3, wav, ogg)
- AI responses require OpenAI API key (costs apply)
- Fallback responses are provided if OpenAI is not configured

## Production Deployment

### Frontend
Deploy to Vercel, Netlify, or similar:
```bash
npm run build
```

### Backend
Deploy to Render, Railway, or AWS:
- Set environment variables
- Use gunicorn for production: `gunicorn app:app`
- Ensure Python dependencies are installed

## Support

For issues or questions, check:
1. Browser console for frontend errors
2. Backend terminal for Python errors
3. Supabase dashboard for database issues
