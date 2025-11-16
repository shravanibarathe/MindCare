import librosa
import numpy as np
import io

class VoiceAnalyzer:
    def __init__(self):
        self.emotion_thresholds = {
            'energy_high': 0.1,
            'pitch_variation_high': 100,
            'tempo_fast': 130
        }

    def analyze_audio(self, audio_file):
        try:
            audio_bytes = audio_file.read()
            audio_data, sr = librosa.load(io.BytesIO(audio_bytes), sr=None)

            features = self.extract_audio_features(audio_data, sr)

            emotion = self.classify_emotion(features)

            return {
                'emotion': emotion['emotion'],
                'confidence': emotion['confidence'],
                'features': features
            }

        except Exception as e:
            print(f"Error analyzing audio: {e}")
            return {
                'emotion': 'calm',
                'confidence': 0.5,
                'features': {}
            }

    def extract_audio_features(self, audio_data, sr):
        features = {}

        try:
            features['energy'] = float(np.mean(librosa.feature.rms(y=audio_data)))

            pitches, magnitudes = librosa.piptrack(y=audio_data, sr=sr)
            pitch_values = []
            for t in range(pitches.shape[1]):
                index = magnitudes[:, t].argmax()
                pitch = pitches[index, t]
                if pitch > 0:
                    pitch_values.append(pitch)

            if pitch_values:
                features['pitch_mean'] = float(np.mean(pitch_values))
                features['pitch_std'] = float(np.std(pitch_values))
            else:
                features['pitch_mean'] = 0.0
                features['pitch_std'] = 0.0

            tempo, _ = librosa.beat.beat_track(y=audio_data, sr=sr)
            features['tempo'] = float(tempo)

            spectral_centroid = librosa.feature.spectral_centroid(y=audio_data, sr=sr)
            features['spectral_centroid'] = float(np.mean(spectral_centroid))

            zcr = librosa.feature.zero_crossing_rate(audio_data)
            features['zero_crossing_rate'] = float(np.mean(zcr))

        except Exception as e:
            print(f"Error extracting features: {e}")

        return features

    def classify_emotion(self, features):
        try:
            energy = features.get('energy', 0)
            pitch_std = features.get('pitch_std', 0)
            tempo = features.get('tempo', 0)
            zcr = features.get('zero_crossing_rate', 0)

            scores = {
                'happiness': 0,
                'sadness': 0,
                'anger': 0,
                'fear': 0,
                'calm': 0,
                'stress': 0
            }

            if energy > 0.15 and tempo > 130:
                scores['happiness'] += 0.4
                scores['stress'] += 0.2
            elif energy > 0.15 and pitch_std > 80:
                scores['anger'] += 0.4
                scores['stress'] += 0.3
            elif energy < 0.05 and tempo < 90:
                scores['sadness'] += 0.5
            elif pitch_std > 100 and zcr > 0.1:
                scores['fear'] += 0.4
                scores['stress'] += 0.3
            else:
                scores['calm'] += 0.4

            if tempo > 140:
                scores['stress'] += 0.2
            if energy > 0.2:
                scores['anger'] += 0.2
            if pitch_std < 30:
                scores['calm'] += 0.2
                scores['sadness'] += 0.2

            max_emotion = max(scores, key=scores.get)
            confidence = min(scores[max_emotion], 1.0)

            if confidence < 0.3:
                confidence = 0.5
                max_emotion = 'calm'

            return {
                'emotion': max_emotion,
                'confidence': float(confidence)
            }

        except Exception as e:
            print(f"Error classifying emotion: {e}")
            return {
                'emotion': 'calm',
                'confidence': 0.5
            }
