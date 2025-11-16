import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Sparkles, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { JournalEntry } from '../../lib/supabase';

const BACKEND_URL = 'http://localhost:5000';

export function JournalView() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  useEffect(() => {
    const entry = entries.find((e) => e.entry_date === selectedDate);
    if (entry) {
      setCurrentEntry(entry);
      setReflectionNotes(entry.reflection_notes || '');
    } else {
      setCurrentEntry(null);
      setReflectionNotes('');
    }
  }, [selectedDate, entries]);

  const loadEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const generateSummary = async () => {
    if (!user) return;

    setGenerating(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/journal-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          date: selectedDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await loadEntries();
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setGenerating(false);
    }
  };

  const saveReflection = async () => {
    if (!user || !currentEntry) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update({ reflection_notes: reflectionNotes })
        .eq('id', currentEntry.id);

      if (error) throw error;
      await loadEntries();
    } catch (error) {
      console.error('Error saving reflection:', error);
    } finally {
      setLoading(false);
    }
  };

  const emotionColors: Record<string, string> = {
    happiness: '#10b981',
    sadness: '#6b7280',
    stress: '#f59e0b',
    anger: '#ef4444',
    fear: '#8b5cf6',
    calm: '#3b82f6',
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
      <div className="lg:w-1/3">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Journal Entries</h2>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          />

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedDate(entry.entry_date)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  entry.entry_date === selectedDate
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">
                    {new Date(entry.entry_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {entry.dominant_emotion && (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium text-white capitalize"
                      style={{ backgroundColor: emotionColors[entry.dominant_emotion] }}
                    >
                      {entry.dominant_emotion}
                    </span>
                  )}
                </div>
                {entry.mood_summary && (
                  <p className="text-sm text-gray-600 line-clamp-2">{entry.mood_summary}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:w-2/3 flex-1">
        <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h2>
            </div>

            <button
              onClick={generateSummary}
              disabled={generating}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : 'Generate Summary'}
            </button>
          </div>

          {currentEntry ? (
            <div className="flex-1 flex flex-col">
              <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">AI Summary</h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentEntry.mood_summary || 'No summary available for this day.'}
                </p>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Personal Reflections</h3>
                  <button
                    onClick={saveReflection}
                    disabled={loading}
                    className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                </div>
                <textarea
                  value={reflectionNotes}
                  onChange={(e) => setReflectionNotes(e.target.value)}
                  placeholder="Write your thoughts and reflections for today..."
                  className="flex-1 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No journal entry for this date</p>
                <button
                  onClick={generateSummary}
                  disabled={generating}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  {generating ? 'Generating...' : 'Create Entry'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
