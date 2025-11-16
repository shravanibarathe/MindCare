import { createContext, useContext, useState, ReactNode } from 'react';
import type { EmotionType } from '../lib/supabase';

interface EmotionTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

interface EmotionContextType {
  currentEmotion: EmotionType;
  emotionTheme: EmotionTheme;
  setEmotion: (emotion: EmotionType) => void;
}

const emotionThemes: Record<EmotionType, EmotionTheme> = {
  happiness: {
    primary: '#10b981',
    secondary: '#d1fae5',
    background: 'linear-gradient(135deg, #fef3c7 0%, #d1fae5 100%)',
    text: '#065f46',
    accent: '#34d399',
  },
  sadness: {
    primary: '#6b7280',
    secondary: '#e5e7eb',
    background: 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)',
    text: '#374151',
    accent: '#9ca3af',
  },
  stress: {
    primary: '#f59e0b',
    secondary: '#fef3c7',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    text: '#92400e',
    accent: '#fbbf24',
  },
  anger: {
    primary: '#ef4444',
    secondary: '#fee2e2',
    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    text: '#991b1b',
    accent: '#f87171',
  },
  fear: {
    primary: '#8b5cf6',
    secondary: '#ede9fe',
    background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    text: '#5b21b6',
    accent: '#a78bfa',
  },
  calm: {
    primary: '#3b82f6',
    secondary: '#dbeafe',
    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    text: '#1e40af',
    accent: '#60a5fa',
  },
};

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export function EmotionProvider({ children }: { children: ReactNode }) {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('calm');

  const setEmotion = (emotion: EmotionType) => {
    setCurrentEmotion(emotion);
  };

  const emotionTheme = emotionThemes[currentEmotion];

  return (
    <EmotionContext.Provider value={{ currentEmotion, emotionTheme, setEmotion }}>
      {children}
    </EmotionContext.Provider>
  );
}

export function useEmotion() {
  const context = useContext(EmotionContext);
  if (context === undefined) {
    throw new Error('useEmotion must be used within an EmotionProvider');
  }
  return context;
}
