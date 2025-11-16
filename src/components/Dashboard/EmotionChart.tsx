import { useEffect, useState } from 'react';
import { TrendingUp, Heart, Frown, Zap, Flame, AlertCircle, Wind } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { EmotionType } from '../../lib/supabase';

const BACKEND_URL = 'http://localhost:5000';

interface EmotionStats {
  emotion_counts: Record<string, number>;
  total_logs: number;
  logs: Array<{
    emotion_type: string;
    created_at: string;
    confidence_score: number;
  }>;
}

const emotionIcons: Record<EmotionType, React.ReactNode> = {
  happiness: <Heart className="w-5 h-5" />,
  sadness: <Frown className="w-5 h-5" />,
  stress: <Zap className="w-5 h-5" />,
  anger: <Flame className="w-5 h-5" />,
  fear: <AlertCircle className="w-5 h-5" />,
  calm: <Wind className="w-5 h-5" />,
};

const emotionColors: Record<EmotionType, string> = {
  happiness: '#10b981',
  sadness: '#6b7280',
  stress: '#f59e0b',
  anger: '#ef4444',
  fear: '#8b5cf6',
  calm: '#3b82f6',
};

export function EmotionChart() {
  const [stats, setStats] = useState<EmotionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30>(7);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/emotion-stats?user_id=${user.id}&days=${timeRange}`
        );

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching emotion stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, timeRange]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.total_logs === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Emotion Insights</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-300 text-center py-8">
          Start chatting to see your emotional journey
        </p>
      </div>
    );
  }

  const totalCount = Object.values(stats.emotion_counts).reduce((a, b) => a + b, 0);
  const emotionPercentages = Object.entries(stats.emotion_counts).map(([emotion, count]) => ({
    emotion: emotion as EmotionType,
    count,
    percentage: (count / totalCount) * 100,
  }));

  emotionPercentages.sort((a, b) => b.count - a.count);

  const dominantEmotion = emotionPercentages[0]?.emotion;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Emotion Insights
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange(7)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              timeRange === 7
                ? 'bg-blue-500 dark:bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange(30)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              timeRange === 30
                ? 'bg-blue-500 dark:bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Most Frequent Emotion</p>
        <div className="flex items-center">
          <div
            className="p-2 rounded-lg mr-3"
            style={{ backgroundColor: `${emotionColors[dominantEmotion]}20` }}
          >
            <div style={{ color: emotionColors[dominantEmotion] }}>
              {emotionIcons[dominantEmotion]}
            </div>
          </div>
          <div>
            <p
              className="text-2xl font-bold capitalize"
              style={{ color: emotionColors[dominantEmotion] }}
            >
              {dominantEmotion}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {emotionPercentages[0].percentage.toFixed(0)}% of the time
            </p>
          </div>
        </div>
      </div>

      {/* Percentage List */}
      <div className="space-y-3">
        {emotionPercentages.map(({ emotion, count, percentage }) => (
          <div key={emotion}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div
                  className="p-1.5 rounded-lg mr-2"
                  style={{ backgroundColor: `${emotionColors[emotion]}20` }}
                >
                  <div style={{ color: emotionColors[emotion] }}>
                    {emotionIcons[emotion]}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {emotion}
                </span>
              </div>

              <span className="text-sm text-gray-600 dark:text-gray-300">
                {count} ({percentage.toFixed(0)}%)
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: emotionColors[emotion],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-900 dark:text-white">{stats.total_logs}</span>{' '}
          emotional check-ins in the last {timeRange} days
        </p>
      </div>
    </div>
  );
}
