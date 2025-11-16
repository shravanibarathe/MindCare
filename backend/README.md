# MindCare AI Backend

## Overview
Flask-based backend for emotion detection, AI response generation, and voice analysis.

## Quick Start

```bash
pip install -r requirements.txt
python app.py
```

## Environment Variables

Create a `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_key
```

## API Documentation

### Analyze Text
```bash
POST /api/analyze-text
Content-Type: application/json

{
  "text": "I'm feeling really happy today!",
  "user_id": "uuid"
}

Response:
{
  "emotion": "happiness",
  "confidence": 0.89,
  "all_emotions": {...},
  "response": "AI generated empathetic response"
}
```

### Analyze Voice
```bash
POST /api/analyze-voice
Content-Type: multipart/form-data

audio: <audio file>
user_id: uuid

Response:
{
  "emotion": "calm",
  "confidence": 0.75,
  "features": {...}
}
```

### Get Emotion Stats
```bash
GET /api/emotion-stats?user_id=uuid&days=7

Response:
{
  "logs": [...],
  "emotion_counts": {...},
  "total_logs": 42
}
```

### Generate Journal Summary
```bash
POST /api/journal-summary
Content-Type: application/json

{
  "user_id": "uuid",
  "date": "2025-11-13"
}

Response:
{
  "summary": "AI generated summary",
  "dominant_emotion": "calm",
  "emotion_counts": {...}
}
```

## Architecture

### emotion_detector.py
- Uses DistilRoBERTa model for emotion classification
- Maps 7 emotions to 6 core emotions
- Combines text and voice emotions with weighted average

### response_generator.py
- OpenAI GPT-3.5 integration
- Emotion-specific system prompts
- CBT-inspired response generation
- Fallback responses when API unavailable

### voice_analyzer.py
- librosa for audio feature extraction
- Analyzes energy, pitch, tempo, spectral features
- Rule-based emotion classification
- Supports common audio formats

## Models Used

- Text: `j-hartmann/emotion-english-distilroberta-base`
- Response: OpenAI GPT-3.5 Turbo
- Voice: librosa + custom classification

## Production Deployment

Use gunicorn for production:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Notes

- First run downloads emotion model (~500MB)
- Audio analysis requires ffmpeg
- OpenAI API key required for full functionality
- CORS enabled for all origins (configure for production)
