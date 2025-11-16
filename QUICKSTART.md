# MindCare AI - Quick Start Guide

Get MindCare AI running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- OpenAI API key (get at https://platform.openai.com/api-keys)

## Step 1: Install Dependencies

### Frontend
```bash
npm install
```

### Backend
```bash
cd backend
pip install -r requirements.txt
```

## Step 2: Configure Environment

Create `backend/.env`:
```env
VITE_SUPABASE_URL=https://bbcnxvuzfnquwuhxysha.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY254dnV6Zm5xdXd1aHh5c2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMDcyMjIsImV4cCI6MjA3ODU4MzIyMn0.SY-TvIsbF3VzArwFWl98jQpeoDyZ4Y9Lr3m4xCz-eSk
OPENAI_API_KEY=your_openai_api_key_here
```

**Note:** Replace `your_openai_api_key_here` with your actual OpenAI API key.

## Step 3: Start Backend

```bash
cd backend
python app.py
```

Backend runs on `http://localhost:5000`

## Step 4: Start Frontend

Open a new terminal:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Step 5: Use the App

1. Open `http://localhost:5173` in your browser
2. Sign up with email and password
3. Start chatting about your feelings
4. Explore the dashboard, journal, and relaxation mode

## Important Notes

### First Run
- The emotion detection model will download on first use (~500MB)
- This may take a few minutes depending on your internet speed
- Subsequent runs will be instant

### Without OpenAI API Key
- The system will still work with fallback responses
- Responses won't be as dynamic but still empathetic
- Emotion detection works independently of OpenAI

### Voice Analysis (Optional)
- Requires ffmpeg for audio processing
- Install on Mac: `brew install ffmpeg`
- Install on Linux: `apt-get install ffmpeg`
- Not required for text-only usage

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is taken:
```bash
# Backend: Edit app.py and change port
app.run(port=5001)

# Frontend: Vite will automatically use next available port
```

### Module Not Found
```bash
# Backend
pip install -r requirements.txt --upgrade

# Frontend
rm -rf node_modules && npm install
```

### CORS Errors
Ensure:
1. Backend is running on port 5000
2. Frontend is running on port 5173
3. No VPN or proxy blocking requests

### Database Connection
The Supabase database is already configured. If you see auth errors:
1. Check your internet connection
2. Verify credentials in `.env` files
3. Try signing up with a new account

## What's Next?

Once running, try:
1. Chat with the AI about different emotions
2. Check your emotion analytics dashboard
3. Generate a daily journal summary
4. Use the relaxation mode for guided breathing
5. Customize settings and preferences

For detailed documentation, see:
- [README.md](./README.md) - Full project overview
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Technical details

## Need Help?

Common issues:
- **Slow responses**: OpenAI API can take 1-3 seconds
- **No emotion themes**: Make sure to send a message first
- **Voice not working**: Voice input UI present but backend processing optional
- **Charts empty**: Chat first to generate emotion data

Enjoy MindCare AI! 💙
