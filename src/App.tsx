import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EmotionProvider } from './contexts/EmotionContext';
import { ChatProvider } from './contexts/ChatContext';
import { AuthForm } from './components/Auth/AuthForm';
import { MainLayout } from './components/Layout/MainLayout';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading MindCare AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <MainLayout />;
}

function App() {
  return (
    <AuthProvider>
      <EmotionProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </EmotionProvider>
    </AuthProvider>
  );
}

export default App;
