import { useState } from 'react';
import { MessageCircle, BarChart3, BookOpen, Settings, Wind, Heart } from 'lucide-react';
import { useEmotion } from '../../contexts/EmotionContext';
import { ChatInterface } from '../Chat/ChatInterface';
import { EmotionChart } from '../Dashboard/EmotionChart';
import { JournalView } from '../Journal/JournalView';
import { SettingsPanel } from '../Settings/SettingsPanel';
import { RelaxationMode } from '../Relaxation/RelaxationMode';
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

type View = 'chat' | 'dashboard' | 'journal' | 'settings';

export function MainLayout() {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [showRelaxation, setShowRelaxation] = useState(false);
  const { emotionTheme } = useEmotion();
  const { theme, applyTheme } = useTheme();


  const navigation = [
    { id: 'chat' as View, name: 'Chat', icon: MessageCircle },
    { id: 'dashboard' as View, name: 'Insights', icon: BarChart3 },
    { id: 'journal' as View, name: 'Journal', icon: BookOpen },
    { id: 'settings' as View, name: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

      {/* HEADER */}
      {/* HEADER */}
      <header
        className={`
    w-full flex flex-wrap items-center justify-between 
    px-6 py-4 gap-3
    shadow-sm border-b 
    border-gray-200 dark:border-gray-700
    transition-all
    ${theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : ""}
  `}
        style={
          theme === "light"
            ? { background: `linear-gradient(135deg, ${emotionTheme.secondary} 0%, white 100%)` }
            : {}
        }
      >

        {/* LEFT SIDE */}
        <div className="flex items-center min-w-[200px] flex-shrink-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-md"
            style={{ backgroundColor: emotionTheme.primary }}
          >
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              MindCare AI
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your Emotion Intelligence Companion
            </p>
          </div>
        </div>

        {/* RIGHT BUTTONS (FULLY RESPONSIVE) */}
        <div
          className="
      flex items-center gap-3 
      ml-auto 
      flex-wrap 
      justify-end
      min-w-[160px]
    "
        >

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
            className="
        p-3 rounded-xl 
        bg-gray-200 dark:bg-gray-700 
        text-gray-700 dark:text-gray-200 
        hover:bg-gray-300 dark:hover:bg-gray-600
        active:scale-90 
        transition-all duration-300
        shadow-sm hover:shadow-md
        flex-shrink
      "
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* RELAX BUTTON */}
          <button
            onClick={() => setShowRelaxation(true)}
            className="
        flex items-center px-4 py-2 rounded-xl 
        text-white font-medium 
        hover:shadow-lg transform hover:scale-105 transition-all 
        flex-shrink
      "
            style={{ backgroundColor: emotionTheme.primary }}
          >
            <Wind className="w-5 h-5 mr-2" />
            Relax
          </button>

        </div>

      </header>



      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <nav className="
          w-20 lg:w-64 
          bg-white dark:bg-gray-800
          border-r border-gray-200 dark:border-gray-700
          flex flex-col shadow-sm
        ">

          <div className="flex-1 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`
                    w-full flex items-center px-6 py-4 transition-all rounded-r-lg
                    ${isActive
                      ? "font-semibold text-blue-500 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    }
                  `}
                  style={
                    isActive
                      ? {
                        borderRightWidth: "4px",
                        borderRightColor: emotionTheme.primary,
                        backgroundColor: `${emotionTheme.primary}15`,
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

          {/* CURRENT MOOD BOX */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div
              className="p-3 rounded-xl text-center bg-gray-100 dark:bg-gray-700"
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2"
                style={{ backgroundColor: emotionTheme.primary }}
              />
              <p className="text-xs font-medium hidden lg:block text-gray-700 dark:text-gray-300">
                Current Mood
              </p>
              <p
                className="text-sm font-bold hidden lg:block capitalize"
                style={{ color: emotionTheme.primary }}
              >
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

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
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
