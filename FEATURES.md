# MindCare AI - Complete Features Guide

## Table of Contents
1. [Authentication System](#authentication-system)
2. [Emotion Detection](#emotion-detection)
3. [Chat Interface](#chat-interface)
4. [Emotion Analytics](#emotion-analytics)
5. [AI Journal](#ai-journal)
6. [Relaxation Mode](#relaxation-mode)
7. [Settings & Privacy](#settings--privacy)

---

## Authentication System

### Sign Up
- Email and password authentication
- Full name collection for personalization
- Automatic user profile creation
- Default preferences initialization
- Secure password hashing via Supabase Auth

### Sign In
- Email/password login
- Session management with JWT tokens
- Automatic session persistence
- Last active timestamp tracking
- Secure authentication flow

### Security Features
- Row Level Security (RLS) on all data
- Users can only access their own information
- Encrypted password storage
- Secure session tokens
- Automatic logout on token expiration

---

## Emotion Detection

### Text Emotion Analysis

**Model**: DistilRoBERTa (j-hartmann/emotion-english-distilroberta-base)

**Detected Emotions**:
- Happiness (joy, contentment, excitement)
- Sadness (down, depressed, melancholy)
- Stress (overwhelmed, anxious, worried)
- Anger (frustrated, irritated, mad)
- Fear (scared, worried, nervous)
- Calm (peaceful, relaxed, neutral)

**How It Works**:
1. User sends a message
2. Text is processed by DistilRoBERTa model
3. Model outputs confidence scores for all emotions
4. Emotions are mapped to 6 core categories
5. Primary emotion selected based on highest confidence
6. All emotion scores returned for transparency

**Example Output**:
```json
{
  "emotion": "stress",
  "confidence": 0.87,
  "all_emotions": {
    "stress": 0.87,
    "sadness": 0.12,
    "calm": 0.01
  }
}
```

### Voice Emotion Analysis

**Library**: librosa (audio processing)

**Analyzed Features**:
- Energy/Volume levels
- Pitch (fundamental frequency)
- Pitch variation (standard deviation)
- Tempo/Speaking rate
- Spectral centroid (brightness)
- Zero-crossing rate (roughness)

**Classification Rules**:
- High energy + fast tempo → Happiness/Stress
- High energy + high pitch variation → Anger
- Low energy + slow tempo → Sadness
- High pitch variation + high ZCR → Fear
- Low pitch variation + moderate energy → Calm

**Supported Formats**:
- MP3
- WAV
- OGG
- M4A (with ffmpeg)

### Combined Analysis

**Weighting**:
- Text emotion: 60%
- Voice emotion: 40%

**Why This Ratio?**:
- Text content is usually more explicit about emotion
- Voice provides additional context for ambiguous text
- Balance ensures neither modality dominates unfairly

**Example**:
```
Text says: "I'm fine" (detected as calm, 0.6)
Voice shows: High pitch, fast tempo (detected as stress, 0.8)
Combined: Stress (0.6×0.6 + 0.4×0.8 = 0.68) → More accurate!
```

---

## Chat Interface

### Main Features

**Real-Time Conversation**:
- Send text messages
- Receive AI responses in 1-3 seconds
- Conversation history preserved
- Timestamps on all messages
- Smooth scrolling to latest message

**Emotion-Adaptive UI**:
- AI message bubbles change color based on detected emotion
- Border colors match emotion theme
- Background gradient transitions smoothly
- Visual feedback reinforces emotional understanding

**Voice Input Button**:
- Microphone icon in chat
- Toggle recording state
- Visual feedback when recording
- Ready for future voice input integration

**Message Composition**:
- Multi-line text input
- Enter to send, Shift+Enter for new line
- Character count (future feature)
- Disabled during processing
- Clear after send

### AI Response Generation

**OpenAI GPT-3.5 Integration**:
- Model: gpt-3.5-turbo
- Temperature: 0.8 (creative but consistent)
- Max tokens: 150 (2-4 sentences)

**Emotion-Specific Prompts**:

**Happiness**:
```
Tone: Warm and encouraging
Approach: Reinforce positive thoughts and encourage gratitude
Response length: 2-3 sentences
```

**Sadness**:
```
Tone: Gentle, comforting, and validating
Approach: Validate feelings, offer gentle reframing
Response length: 3-4 sentences
```

**Stress**:
```
Tone: Calming and supportive
Approach: Break down problems, suggest breathing exercises
Response length: 2-3 sentences
```

**Anger**:
```
Tone: Calm, non-judgmental, understanding
Approach: Help identify triggers, promote cooling down
Response length: 2-3 sentences
```

**Fear**:
```
Tone: Reassuring and grounding
Approach: Ground in present, challenge catastrophic thinking
Response length: 3-4 sentences
```

**Calm**:
```
Tone: Peaceful and reflective
Approach: Encourage mindfulness and reflection
Response length: 2 sentences
```

**CBT Principles Applied**:
- Thought identification
- Cognitive reframing
- Behavioral activation
- Mindfulness grounding
- Positive reinforcement

**Fallback Responses**:
If OpenAI API unavailable or not configured:
- Pre-written empathetic responses for each emotion
- Still validates feelings and offers support
- Encourages user to continue sharing

---

## Emotion Analytics

### Dashboard Overview

**Key Metrics**:
- Total emotion check-ins
- Emotion distribution (percentages)
- Dominant emotion
- Time range selection (7/30 days)

### Emotion Distribution Chart

**Visual Elements**:
- Horizontal bar chart
- Emotion icons (lucide-react)
- Color-coded bars matching emotion themes
- Percentage labels
- Count labels
- Smooth animations

**Emotion Colors**:
- Happiness: Green (#10b981)
- Sadness: Gray (#6b7280)
- Stress: Orange (#f59e0b)
- Anger: Red (#ef4444)
- Fear: Purple (#8b5cf6)
- Calm: Blue (#3b82f6)

### Dominant Emotion Card

**Displays**:
- Largest emotion icon
- Emotion name
- Percentage of time
- Color-coded background
- Prominent positioning

### Interaction Statistics

**Shows**:
- Total conversations
- Check-ins per day average
- Longest streak (future)
- Most improved emotion (future)

### Time Range Selection

**Options**:
- Last 7 days
- Last 30 days
- Custom range (future)
- Year view (future)

**Updates**:
- Instant data refresh
- Smooth chart transitions
- Loading states
- Empty state handling

---

## AI Journal

### Daily Summaries

**AI-Generated Content**:
- 2-3 sentence summary of emotional day
- Acknowledges emotional journey
- Highlights patterns or progress
- Ends with encouraging note
- Uses GPT-3.5 for natural language

**Example**:
```
"Today you navigated through various emotions with resilience.
You started calm, experienced some stress midday, but returned
to a peaceful state by evening. Your ability to self-regulate
is growing stronger."
```

### Personal Reflections

**Features**:
- Free-form text input
- Unlimited length
- Auto-save functionality
- Rich text support (future)
- Export option (future)

**Use Cases**:
- Gratitude journaling
- Thought dumping
- Goal setting
- Progress tracking
- Therapy preparation

### Calendar View

**Interface**:
- Date selector
- Entry list sorted by date
- Emotion tags on each entry
- Quick navigation
- Search functionality (future)

**Entry Display**:
- Date (formatted nicely)
- Dominant emotion badge
- Summary preview (2 lines)
- Click to expand full entry

### Generation Process

**How It Works**:
1. User clicks "Generate Summary"
2. Backend fetches all emotion logs for selected date
3. GPT analyzes conversation patterns
4. Identifies dominant emotion
5. Creates compassionate summary
6. Saves to journal_entries table
7. Frontend displays result

**Fallback**:
If no activity: "No activity recorded for this day."

---

## Relaxation Mode

### Full-Screen Experience

**Layout**:
- Full viewport overlay
- Blurred background
- Close button (top-right)
- Centered content
- Gradient background matching current emotion

### Guided Breathing

**Exercise Types**:

**4-7-8 Technique** (Stress):
- Inhale: 4 seconds
- Hold: 7 seconds
- Exhale: 8 seconds
- Repeat cycle

**Box Breathing** (Calm):
- Inhale: 4 seconds
- Hold: 4 seconds
- Exhale: 4 seconds
- Hold: 4 seconds

**Simple Breathing** (Other emotions):
- Inhale: 4 seconds
- Exhale: 6 seconds

### Visual Animation

**Breathing Circle**:
- Starts at base size
- Expands during inhale (scales to 2x)
- Contracts during exhale (scales to 1x)
- Smooth transitions (1000ms ease)
- Color matches emotion theme
- Pulsing border effect

**Instructions**:
- Phase name ("Inhale", "Exhale", "Hold")
- Instruction text ("Breathe in slowly...")
- Central wind icon
- Real-time phase updates

### Affirmations

**Emotion-Specific Messages**:

- **Happiness**: "I am grateful for this moment of joy in my life."
- **Sadness**: "It's okay to feel this way. I am worthy of comfort."
- **Stress**: "I release what I cannot control. I am capable."
- **Anger**: "I choose peace. I can express feelings healthily."
- **Fear**: "I am safe in this moment. I have overcome before."
- **Calm**: "I embrace this peace and carry it with me."

**Display**:
- Card with quote icon
- Emotion-colored background
- Easy-to-read typography
- Changes with emotion

### Grounding Exercises

**5-4-3-2-1 Technique**:
- 5 things you can see
- 4 things you can touch
- 3 things you can hear
- 2 things you can smell
- 1 thing you can taste

**Purpose**:
- Anchors to present moment
- Reduces dissociation
- Calms anxiety
- Increases awareness

### Music Recommendations

**Emotion-Based Moods**:
- Happiness: Uplifting, happy, energetic
- Sadness: Calm, peaceful, acoustic
- Stress: Ambient, meditation, spa
- Anger: Calm, instrumental, nature sounds
- Fear: Soft, reassuring, classical
- Calm: Peaceful, ambient, zen

**Integration** (Future):
- Spotify playlist embedding
- YouTube video player
- Apple Music integration
- Custom playlist creation

---

## Settings & Privacy

### Account Management

**Displayed Info**:
- Email address (read-only)
- Account creation date (future)
- Last login (future)

**Actions**:
- Sign out
- Delete account (future)
- Change password (future)

### Preferences

**Theme Preference**:
- Auto (emotion-based) - default
- Light mode
- Dark mode (future)

**Voice Responses**:
- Toggle on/off
- Uses text-to-speech for AI responses
- Multiple voice options (future)
- Voice cloning option (future)

**Relaxation Music**:
- Enable/disable music recommendations
- Default: enabled
- Respects user preference in relaxation mode

**Data Retention**:
- Configurable: 30-3650 days
- Default: 365 days
- Automatic old data cleanup (future)
- Export before deletion option (future)

### Privacy & Data

**Information Panel**:
- Explains data usage
- Links to privacy policy (future)
- Data protection guarantees
- Third-party disclosure (none)

**Delete All Data Button**:
- Confirmation dialog
- Deletes from all tables:
  - emotion_logs
  - journal_entries
  - voice_profiles
- User preferences reset
- Account remains active
- Irreversible action warning

### Security Features

**Row Level Security**:
- Users can only see own data
- SQL-level enforcement
- No way to bypass
- Tested and verified

**Data Encryption**:
- At rest in Supabase
- In transit via HTTPS
- API keys in environment variables
- No plaintext sensitive data

**Audit Logging** (Future):
- Login attempts
- Data access
- Settings changes
- Export requests

---

## Advanced Features (Planned)

### Voice Cloning
- Upload loved one's voice sample
- AI clones voice characteristics
- Responses in familiar voice
- Requires explicit consent
- Secure storage of voice data

### 3D Relaxation Scenes
- Beach environment
- Forest setting
- Rain/thunderstorm
- Space/stars
- Interactive elements
- WebGL rendering with Three.js

### Music Integration
- Spotify API connection
- Create wellness playlists
- Emotion-based radio
- Collaborative playlists
- YouTube integration

### Wearable Integration
- Heart rate monitoring
- Sleep tracking
- Activity correlation
- Real-time emotion prediction
- Health insights

### Group Features
- Shared emotion tracking (family/team)
- Group wellness challenges
- Anonymous emotion sharing
- Collective mood visualization
- Support circles

---

## Mobile Experience (Future)

### React Native App
- Native iOS/Android apps
- Push notifications for check-ins
- Offline mode
- Sync across devices
- Native voice recording
- Haptic feedback

---

## Accessibility Features

### Current
- Keyboard navigation
- Screen reader support (ARIA labels)
- High contrast mode compatibility
- Focus indicators
- Semantic HTML

### Planned
- Voice commands
- Text size adjustment
- Color blind modes
- Dyslexia-friendly fonts
- Reduced motion option

---

## Performance Optimization

### Frontend
- Code splitting by route
- Lazy loading components
- Image optimization
- Caching strategies
- Bundle size: ~313 KB (gzipped: 91 KB)

### Backend
- Model caching after first load
- Database connection pooling
- Query optimization with indexes
- Response compression
- Stateless design for horizontal scaling

### Database
- Indexed frequently queried columns
- Efficient RLS policies
- Automatic backups
- Real-time subscriptions ready
- Supabase managed scaling

---

This comprehensive guide covers all features of MindCare AI. For setup instructions, see [QUICKSTART.md](./QUICKSTART.md) or [SETUP.md](./SETUP.md).
