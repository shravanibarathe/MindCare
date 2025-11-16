import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type EmotionType = 'happiness' | 'sadness' | 'stress' | 'anger' | 'fear' | 'calm';

export interface EmotionLog {
  id: string;
  user_id: string;
  emotion_type: EmotionType;
  confidence_score: number;
  input_type: string;
  input_text?: string;
  ai_response?: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  mood_summary?: string;
  dominant_emotion?: string;
  reflection_notes?: string;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme_preference: string;
  voice_response_enabled: boolean;
  relaxation_music_enabled: boolean;
  data_retention_days: number;
  updated_at: string;
}

console.log("URL:", supabaseUrl);
console.log("KEY:", supabaseAnonKey);
