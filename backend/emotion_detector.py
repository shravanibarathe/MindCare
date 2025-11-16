# emotion_detector.py
import os
import json
import google.generativeai as genai

# Allowed emotion labels used across the app
EMOTIONS = ["happiness", "sadness", "stress", "anger", "fear", "calm"]

class EmotionDetector:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        self.enabled = bool(api_key)
        if self.enabled:
            genai.configure(api_key=api_key)
            # choose the same model family used elsewhere in your project
            try:
                self.model = genai.GenerativeModel("gemini-2.0-flash")
            except Exception:
                # fallback to a commonly-available name
                self.model = genai.GenerativeModel("gemini-pro")
        else:
            self.model = None

    def _prompt_for_emotions(self, text):
        # Ask the model to return a JSON object with probabilities for each emotion.
        # Keep the prompt strict so model returns valid JSON.
        return f"""
You are an emotion classifier. Given the user text below, output a single JSON object mapping the following emotions to numeric probabilities (0.0 to 1.0): {', '.join(EMOTIONS)}.
Return **only valid JSON** (no commentary). Ensure the probabilities sum approximately to 1.0.

Text:
\"\"\"{text}\"\"\"
"""

    def detect_emotion(self, text):
        # Fallback if Gemini key not provided
        if not self.model:
            return {
                "emotion": "calm",
                "confidence": 0.5,
                "all_emotions": {"calm": 0.5}
            }

        try:
            prompt = self._prompt_for_emotions(text)
            resp = self.model.generate_content(prompt)
            raw = resp.text.strip()

            # Try to extract JSON: sometimes the model includes backticks or explanation.
            # Find first "{" and last "}" and parse substring.
            json_str = None
            try:
                start = raw.index("{")
                end = raw.rindex("}") + 1
                json_str = raw[start:end]
            except ValueError:
                # no braces found — maybe it's already plain JSON or something else
                json_str = raw

            # Try multiple parsing attempts
            parsed = None
            for candidate in (json_str, raw):
                try:
                    parsed = json.loads(candidate)
                    break
                except Exception:
                    continue

            # If parsing failed, attempt a simple fallback parsing (key: value pairs)
            if parsed is None:
                all_emotions = {}
                for line in raw.splitlines():
                    line = line.strip().strip('",')
                    if ":" in line:
                        k, v = line.split(":", 1)
                        try:
                            all_emotions[k.strip().strip('"').lower()] = float(v.strip())
                        except Exception:
                            continue
                if all_emotions:
                    parsed = all_emotions
                else:
                    # final fallback: neutral
                    return {"emotion": "calm", "confidence": 0.5, "all_emotions": {"calm": 0.5}}

            # Normalize/clean parsed keys and values
            all_emotions = {}
            for k, v in parsed.items():
                key = str(k).strip().lower()
                # map any synonyms if needed
                if key not in EMOTIONS:
                    # try to map likely labels (e.g. 'joy' -> 'happiness')
                    if "joy" in key:
                        key = "happiness"
                    elif "neutral" in key:
                        key = "calm"
                    elif "disgust" in key:
                        key = "stress"
                    else:
                        # unknown label — skip
                        continue
                try:
                    val = float(v)
                except Exception:
                    # if value is string like "0.12", try remove %
                    s = str(v).strip().replace("%", "")
                    try:
                        val = float(s) / 100.0 if "%" in str(v) else float(s)
                    except Exception:
                        val = 0.0
                all_emotions[key] = all_emotions.get(key, 0.0) + val

            # If parsed has none of canonical labels, fallback
            if not all_emotions:
                return {"emotion": "calm", "confidence": 0.5, "all_emotions": {"calm": 0.5}}

            # Normalize probabilities to sum to 1 (protect from raw scores)
            total = sum(all_emotions.values())
            if total <= 0:
                # give equal mass to calm
                return {"emotion": "calm", "confidence": 0.5, "all_emotions": {"calm": 0.5}}

            for k in list(all_emotions.keys()):
                all_emotions[k] = float(all_emotions[k]) / float(total)

            # Select primary emotion & confidence
            primary = max(all_emotions, key=all_emotions.get)
            confidence = float(all_emotions[primary])

            return {
                "emotion": primary,
                "confidence": confidence,
                "all_emotions": all_emotions
            }

        except Exception as e:
            # Avoid crashing the whole server
            print(f"EmotionDetector error: {e}")
            return {"emotion": "calm", "confidence": 0.5, "all_emotions": {"calm": 0.5}}

    def combine_emotions(self, text_emotion, voice_emotion):
        text_weight = 0.6
        voice_weight = 0.4

        emotions = {}

        if text_emotion and "emotion" in text_emotion:
            emotions[text_emotion["emotion"]] = emotions.get(
                text_emotion["emotion"], 0
            ) + (text_emotion.get("confidence", 0.5) * text_weight)

        if voice_emotion and "emotion" in voice_emotion:
            emotions[voice_emotion["emotion"]] = emotions.get(
                voice_emotion["emotion"], 0
            ) + (voice_emotion.get("confidence", 0.5) * voice_weight)

        if not emotions:
            return {"emotion": "calm", "confidence": 0.5}

        combined_emotion = max(emotions, key=emotions.get)
        combined_confidence = emotions[combined_emotion]

        return {
            "emotion": combined_emotion,
            "confidence": float(min(combined_confidence, 1.0))
        }
