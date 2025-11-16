import { useState, useEffect } from 'react';
import { Settings, User, Shield, Trash2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { UserPreferences } from '../../lib/supabase';
import { useTheme } from "../../contexts/ThemeContext";

export function SettingsPanel() {
  const { user, signOut } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { applyTheme } = useTheme();

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    if (!user || !preferences) return;

    setLoading(true);
    setSaved(false);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          theme_preference: preferences.theme_preference,
          voice_response_enabled: preferences.voice_response_enabled,
          relaxation_music_enabled: preferences.relaxation_music_enabled,
          data_retention_days: preferences.data_retention_days,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllData = async () => {
    if (!user) return;

    const confirmed = confirm(
      'Are you sure you want to delete all your data? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await supabase.from('emotion_logs').delete().eq('user_id', user.id);
      await supabase.from('journal_entries').delete().eq('user_id', user.id);
      await supabase.from('voice_profiles').delete().eq('user_id', user.id);

      alert('All your data has been deleted.');
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Error deleting data. Please try again.');
    }
  };

  if (!preferences) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex items-center mb-8">
          <Settings className="w-8 h-8 text-blue-500 dark:text-blue-400 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>

        <div className="space-y-6">

          {/* ACCOUNT CARD */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200"
                />
              </div>

              <button
                onClick={signOut}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* PREFERENCES CARD */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>

            <div className="space-y-4">
             
              {/* VOICE TOGGLE */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Voice Responses</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Enable AI voice responses</p>
                </div>
                <button
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      voice_response_enabled: !preferences.voice_response_enabled,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-all ${
                    preferences.voice_response_enabled
                      ? 'bg-blue-500 dark:bg-blue-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white dark:bg-gray-200 rounded-full transition-all ${
                      preferences.voice_response_enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* MUSIC TOGGLE */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Relaxation Music</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Enable music recommendations</p>
                </div>
                <button
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      relaxation_music_enabled: !preferences.relaxation_music_enabled,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-all ${
                    preferences.relaxation_music_enabled
                      ? 'bg-blue-500 dark:bg-blue-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white dark:bg-gray-200 rounded-full transition-all ${
                      preferences.relaxation_music_enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* RETENTION INPUT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Retention (Days)
                </label>
                <input
                  type="number"
                  value={preferences.data_retention_days}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      data_retention_days: parseInt(e.target.value) || 365,
                    })
                  }
                  min="30"
                  max="3650"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  How long to keep your emotional data (30–3650 days)
                </p>
              </div>

              {/* SAVE BUTTON */}
              <button
                onClick={savePreferences}
                disabled={loading}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                <Save className="w-5 h-5 mr-2" />
                {saved ? 'Saved!' : loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>

          {/* DELETE CARD */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-red-200 dark:border-red-700">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Privacy & Data
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Your emotional wellness data is private and secure.
            </p>

            <button
              onClick={deleteAllData}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-all font-medium"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete All My Data
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
