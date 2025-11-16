/*
  # MindCare AI - Emotion Intelligence System Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - User identifier
      - `email` (text, unique) - User email
      - `full_name` (text) - User's full name
      - `created_at` (timestamptz) - Account creation timestamp
      - `last_active` (timestamptz) - Last activity timestamp
      
    - `emotion_logs`
      - `id` (uuid, primary key) - Log identifier
      - `user_id` (uuid, foreign key) - References users
      - `emotion_type` (text) - Detected emotion (happiness, sadness, stress, calm, anger, fear)
      - `confidence_score` (numeric) - Confidence level (0-1)
      - `input_type` (text) - Type of input (text, voice, both)
      - `input_text` (text) - User's input text
      - `ai_response` (text) - AI generated response
      - `created_at` (timestamptz) - Log timestamp
      
    - `journal_entries`
      - `id` (uuid, primary key) - Entry identifier
      - `user_id` (uuid, foreign key) - References users
      - `entry_date` (date) - Date of entry
      - `mood_summary` (text) - AI-generated daily summary
      - `dominant_emotion` (text) - Most frequent emotion of the day
      - `reflection_notes` (text) - User's personal notes
      - `created_at` (timestamptz) - Entry creation timestamp
      
    - `voice_profiles`
      - `id` (uuid, primary key) - Profile identifier
      - `user_id` (uuid, foreign key) - References users
      - `profile_name` (text) - Name of the voice profile (e.g., "Mom", "Best Friend")
      - `audio_sample_url` (text) - Storage URL for voice sample
      - `is_active` (boolean) - Whether this profile is currently active
      - `created_at` (timestamptz) - Profile creation timestamp
      
    - `user_preferences`
      - `id` (uuid, primary key) - Preference identifier
      - `user_id` (uuid, foreign key) - References users
      - `theme_preference` (text) - UI theme preference
      - `voice_response_enabled` (boolean) - Enable voice responses
      - `relaxation_music_enabled` (boolean) - Enable music suggestions
      - `data_retention_days` (integer) - How long to keep data
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Ensure users can only access their own emotion logs, journals, and voice profiles
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create emotion_logs table
CREATE TABLE IF NOT EXISTS emotion_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emotion_type text NOT NULL,
  confidence_score numeric NOT NULL DEFAULT 0,
  input_type text NOT NULL,
  input_text text,
  ai_response text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emotion_logs_user_id_idx ON emotion_logs(user_id);
CREATE INDEX IF NOT EXISTS emotion_logs_created_at_idx ON emotion_logs(created_at);

ALTER TABLE emotion_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emotion logs"
  ON emotion_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotion logs"
  ON emotion_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own emotion logs"
  ON emotion_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  mood_summary text,
  dominant_emotion text,
  reflection_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS journal_entries_entry_date_idx ON journal_entries(entry_date);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create voice_profiles table
CREATE TABLE IF NOT EXISTS voice_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_name text NOT NULL,
  audio_sample_url text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS voice_profiles_user_id_idx ON voice_profiles(user_id);

ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own voice profiles"
  ON voice_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own voice profiles"
  ON voice_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own voice profiles"
  ON voice_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own voice profiles"
  ON voice_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme_preference text DEFAULT 'auto',
  voice_response_enabled boolean DEFAULT false,
  relaxation_music_enabled boolean DEFAULT true,
  data_retention_days integer DEFAULT 365,
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);