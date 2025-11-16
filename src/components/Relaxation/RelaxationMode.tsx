import { useState, useEffect } from 'react';
import { Wind, Music, Quote, X } from 'lucide-react';
import { useEmotion } from '../../contexts/EmotionContext';

interface BreathingPhase {
  name: string;
  duration: number;
  instruction: string;
}

const breathingCycles: Record<string, BreathingPhase[]> = {
  calm: [
    { name: 'Inhale', duration: 4, instruction: 'Breathe in slowly...' },
    { name: 'Hold', duration: 4, instruction: 'Hold gently...' },
    { name: 'Exhale', duration: 4, instruction: 'Breathe out slowly...' },
    { name: 'Hold', duration: 4, instruction: 'Rest...' },
  ],
  stress: [
    { name: 'Inhale', duration: 4, instruction: 'Breathe in peace...' },
    { name: 'Hold', duration: 7, instruction: 'Hold with calm...' },
    { name: 'Exhale', duration: 8, instruction: 'Release all tension...' },
  ],
  default: [
    { name: 'Inhale', duration: 4, instruction: 'Breathe in...' },
    { name: 'Exhale', duration: 6, instruction: 'Breathe out...' },
  ],
};

const affirmations: Record<string, string[]> = {
  happiness: [
    'I am grateful for this moment of joy in my life.',
    'I celebrate my successes, big and small.',
    'I deserve to feel this happiness.',
  ],
  sadness: [
    "It's okay to feel this way. I am worthy of comfort and care.",
    'This feeling will pass. I am resilient.',
    'I give myself permission to heal at my own pace.',
  ],
  stress: [
    'I release what I cannot control. I am capable and strong.',
    'I take things one step at a time. I am doing my best.',
    'I breathe in calm and breathe out tension.',
  ],
  anger: [
    'I choose peace. I can express my feelings in healthy ways.',
    'I am in control of my reactions and responses.',
    'I release this anger and make space for calm.',
  ],
  fear: [
    'I am safe in this moment. I have overcome challenges before.',
    'I trust in my ability to handle whatever comes.',
    'I am grounded, present, and protected.',
  ],
  calm: [
    'I embrace this peace and carry it with me.',
    'I am centered, balanced, and at ease.',
    'I appreciate this moment of tranquility.',
  ],
};

interface RelaxationModeProps {
  onClose: () => void;
}

export function RelaxationMode({ onClose }: RelaxationModeProps) {
  const { currentEmotion, emotionTheme } = useEmotion();
  const [isBreathing, setIsBreathing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [affirmation, setAffirmation] = useState('');

  const cycles = breathingCycles[currentEmotion] || breathingCycles.default;
  const currentBreathingPhase = cycles[currentPhase];

  useEffect(() => {
    const emotionAffirmations = affirmations[currentEmotion] || affirmations.calm;
    setAffirmation(emotionAffirmations[Math.floor(Math.random() * emotionAffirmations.length)]);
  }, [currentEmotion]);

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setPhaseProgress((prev) => {
        if (prev >= 100) {
          setCurrentPhase((p) => (p + 1) % cycles.length);
          return 0;
        }
        return prev + (100 / (currentBreathingPhase.duration * 10));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isBreathing, currentPhase, cycles.length, currentBreathingPhase.duration]);

  const circleScale = currentBreathingPhase.name === 'Inhale' ? 1 + phaseProgress / 100 : 2 - phaseProgress / 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: emotionTheme.background }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-all shadow-lg"
      >
        <X className="w-6 h-6 text-gray-700" />
      </button>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: emotionTheme.text }}>
            Relaxation Space
          </h2>
          <p className="text-lg opacity-80" style={{ color: emotionTheme.text }}>
            Take a moment to breathe and center yourself
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-64 h-64 flex items-center justify-center mb-6">
              <div
                className="absolute inset-0 rounded-full transition-all duration-1000 ease-in-out"
                style={{
                  backgroundColor: `${emotionTheme.primary}20`,
                  transform: `scale(${isBreathing ? circleScale : 1})`,
                  border: `4px solid ${emotionTheme.primary}`,
                }}
              />
              <div className="relative z-10 text-center">
                <Wind className="w-12 h-12 mx-auto mb-2" style={{ color: emotionTheme.primary }} />
                {isBreathing && (
                  <>
                    <p className="text-2xl font-bold mb-1" style={{ color: emotionTheme.text }}>
                      {currentBreathingPhase.name}
                    </p>
                    <p className="text-sm" style={{ color: emotionTheme.text }}>
                      {currentBreathingPhase.instruction}
                    </p>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsBreathing(!isBreathing)}
              className="px-8 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              style={{ backgroundColor: emotionTheme.primary }}
            >
              {isBreathing ? 'Pause' : 'Start Breathing Exercise'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: `${emotionTheme.primary}10` }}
            >
              <div className="flex items-center mb-2">
                <Quote className="w-5 h-5 mr-2" style={{ color: emotionTheme.primary }} />
                <h3 className="font-semibold" style={{ color: emotionTheme.text }}>
                  Affirmation
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: emotionTheme.text }}>
                {affirmation}
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: `${emotionTheme.primary}10` }}
            >
              <div className="flex items-center mb-2">
                <Music className="w-5 h-5 mr-2" style={{ color: emotionTheme.primary }} />
                <h3 className="font-semibold" style={{ color: emotionTheme.text }}>
                  Calming Sounds
                </h3>
              </div>
              <p className="text-sm" style={{ color: emotionTheme.text }}>
                Playing ambient sounds for {currentEmotion}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Grounding Exercise</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things
              you can smell, and 1 thing you can taste. This helps bring you into the present
              moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
