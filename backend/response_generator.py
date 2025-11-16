import os
import google.generativeai as genai

class ResponseGenerator:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        self.enabled = bool(api_key)

        if self.enabled:
            genai.configure(api_key=api_key)

        self.model = genai.GenerativeModel("gemini-2.0-flash") if self.enabled else None

        self.emotion_contexts = {
            'happiness': {
                'tone': 'warm and encouraging',
                'prompt_prefix': 'The user is feeling happy and joyful.',
                'cbt_approach': 'Reinforce positive thoughts and encourage gratitude.'
            },
            'sadness': {
                'tone': 'gentle, comforting, and validating',
                'prompt_prefix': 'The user is feeling sad or down.',
                'cbt_approach': 'Validate their feelings, offer gentle reframing, and suggest small actions.'
            },
            'stress': {
                'tone': 'calming and supportive',
                'prompt_prefix': 'The user is feeling stressed or overwhelmed.',
                'cbt_approach': 'Help break down problems, suggest breathing exercises, and reduce catastrophizing.'
            },
            'anger': {
                'tone': 'calm, non-judgmental, and understanding',
                'prompt_prefix': 'The user is feeling angry or frustrated.',
                'cbt_approach': 'Help identify triggers, promote cooling down, and reframe thoughts constructively.'
            },
            'fear': {
                'tone': 'reassuring and grounding',
                'prompt_prefix': 'The user is feeling anxious or fearful.',
                'cbt_approach': 'Ground them in the present, challenge catastrophic thinking, offer reassurance.'
            },
            'calm': {
                'tone': 'peaceful and reflective',
                'prompt_prefix': 'The user is feeling calm or neutral.',
                'cbt_approach': 'Encourage mindfulness and reflection on this positive state.'
            }
        }

        self.fallback_responses = {
            'happiness': "I'm so glad to hear you're feeling good! What's bringing you joy today?",
            'sadness': "I hear you, and it's okay to feel this way. I'm here with you. Would you like to talk about what's on your mind?",
            'stress': "It sounds like you're carrying a lot right now. Let's take a slow breath together.",
            'anger': "I understand you're feeling frustrated. Let's take a moment to slow down and breathe.",
            'fear': "I can sense your worry. You're not alone. Let's focus on the present moment together.",
            'calm': "It's lovely to connect with you in this peaceful moment. How are you feeling right now?"
        }

    def generate_response(self, text, emotion, confidence):
        if not self.enabled:
            return self.fallback_responses.get(emotion, "I'm here to listen. How can I support you today?")

        try:
            emotion_context = self.emotion_contexts.get(emotion, self.emotion_contexts['calm'])

            system_prompt = f"""
You are MindCare AI — an empathetic Emotional Intelligence Companion.
You use Cognitive Behavioral Therapy principles and emotional intelligence to support the user.

Current Context:
- {emotion_context['prompt_prefix']}
- Confidence: {confidence:.2f}
- Tone: {emotion_context['tone']}
- CBT Approach: {emotion_context['cbt_approach']}

Guidelines:
1. Validate feelings first
2. Use warm, human, comforting language
3. Apply soft CBT reframing
4. Keep responses 2–4 sentences
5. Ask a gentle follow-up question
6. Avoid sounding clinical
7. Never minimize feelings
"""

            response = self.model.generate_content(system_prompt + "\nUser: " + text)
            return response.text.strip()

        except Exception as e:
            print(f"Gemini Error: {e}")
            return self.fallback_responses.get(emotion, "I'm here to listen. How can I support you today?")

    def generate_daily_summary(self, logs):
        if not self.enabled or not logs:
            return "Today was a day of varied emotions and experiences."

        try:
            emotions = [log['emotion_type'] for log in logs]
            summary_prompt = f"""
Create a gentle, compassionate emotional summary of the user's day.

Emotions experienced: {', '.join(emotions)}
Entries: {len(logs)}

Write 2–3 sentences:
- Describe their emotional journey
- Highlight any patterns
- End with a supportive message
"""

            response = self.model.generate_content(summary_prompt)
            return response.text.strip()

        except Exception as e:
            print(f"Gemini Summary Error: {e}")
            dominant = max(set(emotions), key=emotions.count)
            return f"Today you felt a mix of emotions, with {dominant} being most dominant. You're doing your best, and that's enough."

    def get_relaxation_activities(self, emotion):
        activities = {
            'happiness': {
                'breathing': 'Joy Breathing - in positivity, out gratitude',
                'music_mood': 'uplifting, energetic',
                'affirmation': 'I am grateful for this joy.',
                'color': '#10b981',
                'activity': 'Reflect on what made you happy today.'
            },
            'sadness': {
                'breathing': 'Slow comfort breathing',
                'music_mood': 'soft, peaceful',
                'affirmation': 'It’s okay to feel this way. I deserve care.',
                'color': '#6b7280',
                'activity': 'Create a calm space with something warm.'
            },
            'stress': {
                'breathing': '4-7-8 breathing',
                'music_mood': 'ambient, spa',
                'affirmation': 'I release what I can’t control.',
                'color': '#f59e0b',
                'activity': 'Take a short stretch or walk.'
            },
            'anger': {
                'breathing': 'Cooling breaths',
                'music_mood': 'nature sounds',
                'affirmation': 'I choose calm and clarity.',
                'color': '#ef4444',
                'activity': 'Try journaling or physical release.'
            },
            'fear': {
                'breathing': 'Grounding breaths',
                'music_mood': 'classical, soothing',
                'affirmation': 'I am safe in this moment.',
                'color': '#8b5cf6',
                'activity': 'Practice the 5-4-3-2-1 grounding technique.'
            },
            'calm': {
                'breathing': 'Peaceful slow breathing',
                'music_mood': 'zen, ambient',
                'affirmation': 'I embrace this moment of peace.',
                'color': '#3b82f6',
                'activity': 'Enjoy the stillness or meditate.'
            }
        }

        return activities.get(emotion, activities['calm'])
