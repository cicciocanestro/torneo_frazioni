import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FirebaseProvider, useFirebase } from './providers/FirebaseProvider';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import CalendarView from './components/CalendarView';
import StandingsView from './components/StandingsView';
import ScorersView from './components/ScorersView';
import SearchView from './components/SearchView';
import LoginView from './components/LoginView';
import AdminDashboard from './components/AdminDashboard';
import { Trophy } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Default to dark mode for a sleek, premium dark sporty aesthetic
    return 'dark';
  });
  const { user, isAdmin } = useAuth();
  const { settings } = useFirebase();

  // Handle HTML Theme Class toggles
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView setActiveTab={setActiveTab} />;
      case 'calendar':
        return <CalendarView />;
      case 'standings':
        return <StandingsView />;
      case 'scorers':
        return <ScorersView />;
      case 'search':
        return <SearchView />;
      case 'admin':
        return user && isAdmin ? <AdminDashboard /> : <LoginView />;
      default:
        return <HomeView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-brand-bg text-zinc-800 dark:text-zinc-100 font-sans flex flex-col transition-colors duration-200">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Main Panel Content */}
      <main className="flex-1 px-4 py-6 md:py-8 md:px-8 max-w-7xl mx-auto w-full">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="hidden md:block py-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400 dark:text-zinc-500 font-sans">
        <p>© 2026 {settings?.tournamentName || 'Torneo Frazioni Castiglion Fiorentino'} • PWA Ready</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FirebaseProvider>
        <AppContent />
      </FirebaseProvider>
    </AuthProvider>
  );
}
