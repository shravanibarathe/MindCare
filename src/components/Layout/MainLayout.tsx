import { useState } from 'react';
import { MessageCircle, BarChart3, BookOpen, Settings, Wind, Heart } from 'lucide-react';
import { useEmotion } from '../../contexts/EmotionContext';
import { ChatInterface } from '../Chat/ChatInterface';
import { EmotionChart } from '../Dashboard/EmotionChart';
import { JournalView } from '../Journal/JournalView';
import { SettingsPanel } from '../Settings/SettingsPanel';
import { RelaxationMode } from '../Relaxation/RelaxationMode';

type View = 'chat' | 'dashboard' | 'journal' | 'settings';

export function MainLayout() {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [showRelaxation, setShowRelaxation] = useState(false);
  const { emotionTheme } = useEmotion();

  const navigation = [
    { id: 'chat' as View, name: 'Chat', icon: MessageCircle },
    { id: 'dashboard' as View, name: 'Insights', icon: BarChart3 },
    { id: 'journal' as View, name: 'Journal', icon: BookOpen },
    { id: 'settings' as View, name: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header
        className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${emotionTheme.secondary} 0%, white 100%)`,
        }}
      >
        <div className="flex items-center">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-md"
            style={{ backgroundColor: emotionTheme.primary }}
          >
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: emotionTheme.text }}>
              MindCare AI
            </h1>
            <p className="text-sm text-gray-600">Your Emotion Intelligence Companion</p>
          </div>
        </div>

        <button
          onClick={() => setShowRelaxation(true)}
          className="flex items-center px-4 py-2 rounded-xl text-white font-medium hover:shadow-lg transform hover:scale-105 transition-all"
          style={{ backgroundColor: emotionTheme.primary }}
        >
          <Wind className="w-5 h-5 mr-2" />
          Relax
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          <div className="flex-1 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center px-6 py-4 transition-all ${
                    isActive
                      ? 'border-r-4'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  style={
                    isActive
                      ? {
                          borderRightColor: emotionTheme.primary,
                          color: emotionTheme.primary,
                          backgroundColor: `${emotionTheme.primary}10`,
                        }
                      : {}
                  }
                >
                  <Icon className="w-6 h-6 lg:mr-3 mx-auto lg:mx-0" />
                  <span className="hidden lg:block font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div
              className="p-3 rounded-xl text-center"
              style={{ backgroundColor: `${emotionTheme.primary}10` }}
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2"
                style={{ backgroundColor: emotionTheme.primary }}
              />
              <p className="text-xs font-medium hidden lg:block" style={{ color: emotionTheme.text }}>
                Current Mood
              </p>
              <p className="text-sm font-bold hidden lg:block capitalize" style={{ color: emotionTheme.primary }}>
                {emotionTheme.primary === '#10b981' && 'Happy'}
                {emotionTheme.primary === '#6b7280' && 'Sad'}
                {emotionTheme.primary === '#f59e0b' && 'Stressed'}
                {emotionTheme.primary === '#ef4444' && 'Angry'}
                {emotionTheme.primary === '#8b5cf6' && 'Fearful'}
                {emotionTheme.primary === '#3b82f6' && 'Calm'}
              </p>
            </div>
          </div>
        </nav>

        <main className="flex-1 overflow-hidden">
          {currentView === 'chat' && <ChatInterface />}
          {currentView === 'dashboard' && (
            <div className="h-full overflow-y-auto p-6">
              <EmotionChart />
            </div>
          )}
          {currentView === 'journal' && <JournalView />}
          {currentView === 'settings' && <SettingsPanel />}
        </main>
      </div>

      {showRelaxation && <RelaxationMode onClose={() => setShowRelaxation(false)} />}
    </div>
  );
}
