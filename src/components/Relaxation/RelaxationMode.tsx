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
    'I am grateful for this moment of joy.',
    'I embrace all the positivity around me.',
    'I deserve to feel this happiness.',
  ],
  sadness: [
    "It's okay to feel this way. I deserve compassion.",
    'This feeling will pass. I am resilient.',
    'I allow myself the space to heal.',
  ],
  stress: [
    'I am capable and strong.',
    'I release the tension I do not need.',
    'I breathe in calm and breathe out worry.',
  ],
  anger: [
    'I choose inner peace.',
    'I am in control of my emotions.',
    'I gently release this anger.',
  ],
  fear: [
    'I am safe in this moment.',
    'I trust myself to handle what comes.',
    'I am grounded and protected.',
  ],
  calm: [
    'I am at peace.',
    'I am centered and grounded.',
    'I carry this calmness with me.',
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

  // Breathing animation
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

  const circleScale =
    currentBreathingPhase.name === 'Inhale' ? 1 + phaseProgress / 100 : 2 - phaseProgress / 100;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center p-4 
        backdrop-blur-md 
        bg-black/40 dark:bg-black/70
      "
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="
          absolute top-4 right-4 p-2 rounded-full 
          bg-white dark:bg-gray-800 
          text-gray-700 dark:text-gray-300
          border border-gray-300 dark:border-gray-700
          shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition
        "
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-2xl">
        
        {/* TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Relaxation Space
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 opacity-90">
            Take a moment to breathe and center yourself
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="
          bg-white dark:bg-gray-800 
          rounded-3xl shadow-2xl p-8 
          border border-gray-200 dark:border-gray-700
          backdrop-blur-xl
        ">
          
          {/* BREATHING CIRCLE */}
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
                <Wind
                  className="w-12 h-12 mx-auto mb-2"
                  style={{ color: emotionTheme.primary }}
                />
                {isBreathing && (
                  <>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {currentBreathingPhase.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {currentBreathingPhase.instruction}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* START/PAUSE BUTTON */}
            <button
              onClick={() => setIsBreathing(!isBreathing)}
              className="
                px-8 py-3 rounded-full text-white font-medium 
                shadow-lg hover:shadow-xl transform hover:scale-105 transition
              "
              style={{ backgroundColor: emotionTheme.primary }}
            >
              {isBreathing ? 'Pause' : 'Start Breathing Exercise'}
            </button>
          </div>

          {/* AFFIRMATION + MUSIC BOXES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* AFFIRMATION */}
            <div
              className="
                p-4 rounded-xl 
                bg-gray-100 dark:bg-gray-700
                border border-gray-200 dark:border-gray-600
              "
            >
              <div className="flex items-center mb-2">
                <Quote
                  className="w-5 h-5 mr-2"
                  style={{ color: emotionTheme.primary }}
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Affirmation
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {affirmation}
              </p>
            </div>

            {/* MUSIC */}
            <div
              className="
                p-4 rounded-xl 
                bg-gray-100 dark:bg-gray-700
                border border-gray-200 dark:border-gray-600
              "
            >
              <div className="flex items-center mb-2">
                <Music
                  className="w-5 h-5 mr-2"
                  style={{ color: emotionTheme.primary }}
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Calming Sounds
                </h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Playing ambient sounds for {currentEmotion}
              </p>
            </div>
          </div>

          {/* GROUNDING EXERCISE */}
          <div className="mt-6 p-4 rounded-xl bg-gray-100 dark:bg-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Grounding Exercise
            </h3>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              Notice 5 things you can see, 4 you can touch, 3 you can hear,
              2 you can smell, and 1 you can taste. This brings you into the present moment.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
