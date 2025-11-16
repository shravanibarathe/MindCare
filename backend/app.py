from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from emotion_detector import EmotionDetector
from response_generator import ResponseGenerator
from voice_analyzer import VoiceAnalyzer
# Add these imports at the top of app.py (if not already present)
import traceback
import logging
from datetime import datetime

# configure simple file logging once near top (after imports)
logging.basicConfig(
    filename="backend_runtime.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

load_dotenv()

app = Flask(__name__)
CORS(app)

supabase_url = os.getenv('VITE_SUPABASE_URL')
supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

emotion_detector = EmotionDetector()
response_generator = ResponseGenerator()  # now uses Gemini
voice_analyzer = VoiceAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'MindCare AI Backend is running'}), 200

# Add these imports at the top of app.py (if not already present)
import traceback
import logging
from datetime import datetime

# configure simple file logging once near top (after imports)
logging.basicConfig(
    filename="backend_runtime.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

# Replace the analyze-text route body with this pattern:
@app.route("/api/analyze-text", methods=["POST"])
def analyze_text():
    try:
        data = request.get_json(force=True)  # ensure JSON is parsed
        text = data.get("text") or data.get("message") or data.get("input") or ""
        user_id = data.get("user_id") or None

        # call your existing emotion detector and response generator exactly as before
        # e.g.
        text_emotion = emotion_detector.detect_emotion(text)
        # if you have voice analysis use it otherwise pass None
        voice_emotion = None
        combined = emotion_detector.combine_emotions(text_emotion, voice_emotion)

        # generate response with your existing ResponseGenerator instance:
        reply = response_generator.generate_response(text, combined["emotion"], combined["confidence"])

        # Save to DB as you already do (keep your code)
        # ... existing DB insert logic ...

        return jsonify({
            "success": True,
            "emotion": combined["emotion"],
            "confidence": combined["confidence"],
            "response": reply,
            "raw_text_emotion": text_emotion
        }), 200

    except Exception as e:
        # write full traceback to a file and to logging
        tb = traceback.format_exc()
        timestamp = datetime.utcnow().isoformat()
        with open("full_traceback.log", "a", encoding="utf-8") as f:
            f.write(f"\n\n[{timestamp}] Exception in /api/analyze-text:\n")
            f.write(tb)
        logging.error("Exception in /api/analyze-text: %s", str(e))
        logging.error(tb)

        # return a JSON error so frontend sees a useful message
        return jsonify({
            "success": False,
            "error": "Internal server error - details written to full_traceback.log"
        }), 500


@app.route('/api/analyze-voice', methods=['POST'])
def analyze_voice():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'Audio file is required'}), 400

        audio_file = request.files['audio']
        user_id = request.form.get('user_id')

        voice_emotion = voice_analyzer.analyze_audio(audio_file)

        return jsonify({
            'emotion': voice_emotion['emotion'],
            'confidence': voice_emotion['confidence'],
            'features': voice_emotion['features']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/combined-analysis', methods=['POST'])
def combined_analysis():
    try:
        data = request.json
        text = data.get('text', '')
        text_emotion = data.get('text_emotion', {})
        voice_emotion = data.get('voice_emotion', {})
        user_id = data.get('user_id')

        combined_emotion = emotion_detector.combine_emotions(text_emotion, voice_emotion)

        ai_response = response_generator.generate_response(
            text=text,
            emotion=combined_emotion['emotion'],
            confidence=combined_emotion['confidence']
        )

        if user_id:
            log_data = {
                'user_id': user_id,
                'emotion_type': combined_emotion['emotion'],
                'confidence_score': combined_emotion['confidence'],
                'input_type': 'both',
                'input_text': text,
                'ai_response': ai_response
            }
            supabase.table('emotion_logs').insert(log_data).execute()

        return jsonify({
            'emotion': combined_emotion['emotion'],
            'confidence': combined_emotion['confidence'],
            'response': ai_response
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emotion-stats', methods=['GET'])
def get_emotion_stats():
    try:
        user_id = request.args.get('user_id')
        days = int(request.args.get('days', 7))

        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        response = supabase.table('emotion_logs')\
            .select('emotion_type, confidence_score, created_at')\
            .eq('user_id', user_id)\
            .gte('created_at', f'now() - interval \'{days} days\'')\
            .order('created_at', desc=False)\
            .execute()

        logs = response.data

        emotion_counts = {}
        for log in logs:
            emotion = log['emotion_type']
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1

        return jsonify({
            'logs': logs,
            'emotion_counts': emotion_counts,
            'total_logs': len(logs)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/journal-summary', methods=['POST'])
def generate_journal_summary():
    try:
        data = request.json
        user_id = data.get('user_id')
        date = data.get('date')

        if not user_id or not date:
            return jsonify({'error': 'User ID and date are required'}), 400

        response = supabase.table('emotion_logs')\
            .select('emotion_type, input_text, ai_response, created_at')\
            .eq('user_id', user_id)\
            .gte('created_at', f'{date} 00:00:00')\
            .lte('created_at', f'{date} 23:59:59')\
            .execute()

        logs = response.data

        if not logs:
            return jsonify({'summary': 'No activity recorded for this day.', 'dominant_emotion': 'neutral'}), 200

        summary = response_generator.generate_daily_summary(logs)

        emotion_counts = {}
        for log in logs:
            emotion = log['emotion_type']
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1

        dominant_emotion = max(emotion_counts, key=emotion_counts.get)

        journal_data = {
            'user_id': user_id,
            'entry_date': date,
            'mood_summary': summary,
            'dominant_emotion': dominant_emotion
        }

        supabase.table('journal_entries').upsert(journal_data).execute()

        return jsonify({
            'summary': summary,
            'dominant_emotion': dominant_emotion,
            'emotion_counts': emotion_counts
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/relaxation-recommendations', methods=['POST'])
def get_relaxation_recommendations():
    try:
        data = request.json
        emotion = data.get('emotion', 'neutral')

        recommendations = response_generator.get_relaxation_activities(emotion)

        return jsonify(recommendations), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
