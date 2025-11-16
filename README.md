# MindCare AI - Emotion Intelligence System

<div align="center">

**An AI-powered emotional wellness platform that detects, understands, and responds to human emotions**

*Not just a chatbot - a complete emotion intelligence companion*

</div>

---

## Overview

MindCare AI is a full-stack emotional wellness platform that goes beyond simple conversation. It senses your emotions from text and voice, understands emotional context, and provides empathetic, personalized support through AI-powered responses, wellness activities, and actionable insights.

### Key Differentiators

- **True Emotion Detection**: Analyzes both text sentiment and voice tone for accurate emotion recognition
- **Context-Aware Empathy**: GPT-powered responses that adapt tone and content based on your emotional state
- **Actionable Wellness**: Not just talk - includes breathing exercises, affirmations, music recommendations
- **Visual Intelligence**: UI dynamically changes colors and themes based on detected emotions
- **Privacy-First**: Complete data control with RLS, encryption, and deletion options
- **Psychology-Grounded**: Incorporates CBT principles for therapeutic support

---

## Features

### 1. Emotion Detection Engine
- **Text Analysis**: DistilRoBERTa model detects emotions from written messages
- **Voice Analysis**: librosa extracts tone features (pitch, energy, tempo)
- **Combined Detection**: Weighted fusion of text + voice for higher accuracy
- **Real-time Processing**: Instant emotion recognition and response

### 2. Empathy Engine
- **GPT-3.5 Integration**: Natural, human-like responses
- **Emotion-Adaptive Tone**: Calm for sadness, uplifting for stress, validating for anger
- **CBT Principles**: Cognitive reframing and positive thought patterns
- **Fallback System**: Works even without OpenAI API

### 3. Emotion-Adaptive Interface
- **Dynamic Color Themes**: UI changes based on detected emotion
  - Happiness: Green gradient
  - Sadness: Gray gradient
  - Stress: Orange gradient
  - Anger: Red gradient
  - Fear: Purple gradient
  - Calm: Blue gradient
- **Smooth Transitions**: Beautiful animations between emotional states
- **Consistent Design**: Professional, calming aesthetic throughout

### 4. Chat Interface
- **Conversational AI**: Natural dialogue with emotion intelligence
- **Voice Input Support**: Speak your feelings (future enhancement)
- **Message History**: Track conversation flow
- **Typing Indicators**: Real-time feedback during AI processing

### 5. Emotion Analytics Dashboard
- **Mood Tracking**: Visualize emotional patterns over time
- **Time Range Selection**: 7-day or 30-day views
- **Emotion Distribution**: Bar charts showing emotion percentages
- **Dominant Emotion**: Identify most frequent emotional state
- **Interaction Stats**: Total check-ins and engagement metrics

### 6. Relaxation Mode
- **Guided Breathing**: 4-7-8 technique and emotion-specific exercises
- **Animated Visual**: Expanding/contracting circle synced to breath
- **Affirmations**: Emotion-appropriate positive statements
- **Grounding Exercises**: 5-4-3-2-1 sensory technique
- **Music Recommendations**: Emotion-based calming sounds
- **Full-Screen Experience**: Immersive relaxation environment

### 7. AI Journal
- **Daily Summaries**: AI-generated reflection of your emotional day
- **Personal Notes**: Add your own thoughts and reflections
- **Mood Calendar**: Browse journal entries by date
- **Pattern Recognition**: Identify emotional trends over time
- **Dominant Emotion Tags**: Quick visual emotion indicators

### 8. Privacy & Settings
- **Account Management**: Email display, sign out
- **Theme Control**: Auto (emotion-based), light, or dark mode
- **Voice Responses**: Toggle AI voice synthesis (future)
- **Music Control**: Enable/disable relaxation music
- **Data Retention**: Customize how long data is kept (30-3650 days)
- **Complete Data Deletion**: One-click to remove all your data
- **Secure Authentication**: Email/password with Supabase Auth

---

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

### Backend
- **Framework**: Flask (Python)
- **NLP Model**: DistilRoBERTa (Hugging Face Transformers)
- **Audio Analysis**: librosa
- **AI Responses**: OpenAI GPT-3.5 Turbo
- **Database Client**: Supabase Python SDK
- **CORS**: Flask-CORS

### Database
- **Platform**: Supabase (PostgreSQL)
- **Security**: Row Level Security (RLS)
- **Tables**:
  - `users` - User accounts
  - `emotion_logs` - Emotion detection history
  - `journal_entries` - Daily reflections
  - `voice_profiles` - Voice cloning (future)
  - `user_preferences` - User settings

### AI Models
- **Emotion Detection**: `j-hartmann/emotion-english-distilroberta-base`
- **Response Generation**: OpenAI GPT-3.5 Turbo
- **Voice Analysis**: Custom librosa-based classifier

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- Python 3.8+
- OpenAI API Key (for AI responses)

### Quick Start

1. **Install frontend dependencies**
   ```bash
   npm install
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure environment**

   Create `backend/.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   OPENAI_API_KEY=your_openai_key
   ```

4. **Start backend**
   ```bash
   cd backend
   python app.py
   ```

5. **Start frontend**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173`

For detailed setup instructions, see [SETUP.md](./SETUP.md)

---

## Architecture

### Frontend Architecture
```
src/
├── components/
│   ├── Auth/          # Authentication forms
│   ├── Chat/          # Chat interface
│   ├── Dashboard/     # Analytics charts
│   ├── Journal/       # Journal view
│   ├── Layout/        # Main layout
│   ├── Relaxation/    # Relaxation mode
│   └── Settings/      # Settings panel
├── contexts/
│   ├── AuthContext    # Authentication state
│   └── EmotionContext # Emotion theme state
└── lib/
    └── supabase       # Supabase client & types
```

### Backend Architecture
```
backend/
├── app.py                 # Flask routes
├── emotion_detector.py    # Text emotion analysis
├── response_generator.py  # AI response generation
├── voice_analyzer.py      # Voice tone analysis
└── requirements.txt       # Python dependencies
```

### Data Flow
1. User inputs text/voice
2. Frontend sends to backend API
3. Backend analyzes emotion
4. GPT generates empathetic response
5. Data logged to Supabase
6. Frontend updates UI with emotion theme
7. Analytics dashboard reflects new data

---

## API Documentation

### Endpoints

#### Analyze Text
```http
POST /api/analyze-text
Content-Type: application/json

{
  "text": "I'm feeling stressed about work",
  "user_id": "uuid"
}

Response:
{
  "emotion": "stress",
  "confidence": 0.87,
  "all_emotions": {...},
  "response": "It sounds like you're carrying a lot right now..."
}
```

#### Analyze Voice
```http
POST /api/analyze-voice
Content-Type: multipart/form-data

audio: <file>
user_id: uuid

Response:
{
  "emotion": "sadness",
  "confidence": 0.72,
  "features": {...}
}
```

#### Get Emotion Stats
```http
GET /api/emotion-stats?user_id=uuid&days=7

Response:
{
  "logs": [...],
  "emotion_counts": {"happiness": 5, "calm": 12, ...},
  "total_logs": 42
}
```

#### Generate Journal Summary
```http
POST /api/journal-summary
Content-Type: application/json

{
  "user_id": "uuid",
  "date": "2025-11-13"
}

Response:
{
  "summary": "Today you experienced varied emotions...",
  "dominant_emotion": "calm",
  "emotion_counts": {...}
}
```

---

## Security & Privacy

### Data Protection
- All database tables have Row Level Security (RLS) enabled
- Users can only access their own data
- Passwords hashed with Supabase Auth
- API keys never exposed to frontend

### User Control
- View all stored emotion data
- Export data (future feature)
- Delete all data with one click
- Configure data retention period (30-3650 days)
- Opt-out of AI features

### Compliance
- No data sold to third parties
- No tracking cookies
- Optional data retention
- Transparent data usage

---

## Roadmap

### Phase 1 (Current)
- ✅ Text emotion detection
- ✅ AI empathetic responses
- ✅ Emotion analytics dashboard
- ✅ AI journal
- ✅ Relaxation mode
- ✅ Privacy controls

### Phase 2 (Planned)
- Voice input for chat
- Voice cloning for familiar comfort
- Real-time emotion tracking
- Emotion trends prediction
- Group chat with emotional awareness
- Mobile app (React Native)

### Phase 3 (Future)
- 3D relaxation environments (Three.js)
- Spotify/YouTube music integration
- Therapist connection
- Emergency support escalation
- Wearable device integration
- Multi-language support

---

## Use Cases

### Personal Wellness
- Daily emotional check-ins
- Stress management
- Mood tracking
- Self-reflection journaling

### Mental Health Support
- Supplement to therapy
- Emotional awareness building
- CBT practice
- Crisis de-escalation

### Professional Use
- Employee wellness programs
- Healthcare patient monitoring
- Education emotional support
- Customer service training

---

## Development

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm run test
```

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npm run typecheck
```

---

## Contributing

This is a production-ready emotional wellness platform. For improvements:

1. Follow existing code patterns
2. Maintain emotion-adaptive design
3. Prioritize user privacy
4. Test emotion detection accuracy
5. Ensure empathetic AI responses

---

## License

This project is for educational and wellness purposes.

---

## Acknowledgments

- **Hugging Face**: DistilRoBERTa emotion model
- **OpenAI**: GPT-3.5 for empathetic responses
- **Supabase**: Database and authentication
- **librosa**: Audio analysis library

---

## Support

For setup help, see [SETUP.md](./SETUP.md)

For backend details, see [backend/README.md](./backend/README.md)

---

**MindCare AI** - *Because everyone deserves emotional support*
