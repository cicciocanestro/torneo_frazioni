import { useAuth } from '../contexts/AuthContext';
import { useFirebase } from '../providers/FirebaseProvider';
import { 
  Home, 
  Calendar, 
  Trophy, 
  User as UserIcon, 
  Lock, 
  Search, 
  Settings,
  Sun,
  Moon,
  WifiOff,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme }: NavbarProps) {
  const { user, isAdmin, logout } = useAuth();
  const { availableEditions, activeEdition, changeEdition, offline } = useFirebase();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'standings', label: 'Classifiche', icon: Trophy },
    { id: 'scorers', label: 'Bomber', icon: UserIcon },
    { id: 'search', label: 'Cerca', icon: Search },
    { id: 'admin', label: isAdmin ? 'Dashboard' : 'Login', icon: Lock },
  ];

  return (
    <>
      {/* Desktop App Bar */}
      <header className="hidden md:flex items-center justify-between px-8 h-20 bg-white dark:bg-black/40 dark:backdrop-blur-md border-b border-zinc-200 dark:border-white/10 sticky top-0 z-50 transition-colors">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center font-black text-black text-xl italic shadow-md">
            CF
          </div>
          <div>
            <h1 className="text-xl font-extrabold uppercase tracking-tight leading-none text-zinc-900 dark:text-white">
              Torneo Frazioni
            </h1>
            <p className="text-emerald-600 dark:text-brand-green text-xs font-bold uppercase tracking-widest leading-normal">
              Castiglion Fiorentino 2026
            </p>
          </div>
        </div>

        <nav className="flex gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-desktop-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-1 py-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                  isActive
                    ? 'border-emerald-600 dark:border-brand-green text-emerald-700 dark:text-white'
                    : 'border-transparent text-zinc-500 dark:text-white/50 hover:text-zinc-800 dark:hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center space-x-3">
          {/* Offline Badge */}
          {offline && (
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-mono text-xs animate-pulse">
              <WifiOff size={14} />
              <span>OFFLINE</span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-600 dark:text-white/60 transition-colors"
            title={theme === 'light' ? 'Tema scuro' : 'Tema chiaro'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Admin Logout */}
          {user && (
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-950/20 rounded text-xs font-bold uppercase text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-950/40 transition-colors"
              title="Esci dall'account"
            >
              <LogOut size={14} />
              <span className="hidden lg:inline">Esci</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Sticky Header */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white dark:bg-black/40 dark:backdrop-blur-md border-b border-zinc-200 dark:border-white/10 sticky top-0 z-50 transition-colors">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center font-black text-black text-sm italic shadow-sm">
            CF
          </div>
          <div>
            <span className="font-sans font-black text-sm text-zinc-900 dark:text-white uppercase tracking-tight">
              Torneo Frazioni
            </span>
            <span className="ml-1.5 bg-emerald-100 dark:bg-brand-green/20 text-emerald-700 dark:text-brand-green text-[10px] font-black px-1.5 py-0.5 rounded italic">
              2026
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {offline && (
            <div className="flex items-center px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
              <WifiOff size={14} />
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-600 dark:text-white/60 transition-colors"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {user && (
            <button onClick={logout} className="p-1.5 text-red-600 dark:text-red-400">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-white/10 py-2.5 px-3 flex justify-around items-center z-50 transition-colors shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-brand-green font-black scale-105'
                  : 'text-zinc-500 dark:text-white/40'
              }`}
            >
              <Icon size={18} className={isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
              <span className="text-[9px] tracking-wider uppercase font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
