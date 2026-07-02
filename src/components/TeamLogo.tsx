import { 
  Shield, 
  Crown, 
  Mountain, 
  Sword, 
  Castle, 
  Star, 
  Flame, 
  Users, 
  Trophy,
  Activity
} from 'lucide-react';

interface TeamLogoProps {
  logo?: string;
  className?: string;
  size?: number;
  teamName?: string;
}

export default function TeamLogo({ logo, className = '', size = 24, teamName }: TeamLogoProps) {
  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (teamName && size > 28) {
    const initials = getInitials(teamName);
    return (
      <div 
        className={`shrink-0 rounded-full flex items-center justify-center font-black italic select-none bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white shadow-sm ${className}`}
        style={{ width: size, height: size, fontSize: `${size * 0.42}px` }}
      >
        {initials}
      </div>
    );
  }

  const defaultClass = `text-emerald-500 dark:text-brand-green shrink-0 ${className}`;
  
  switch (logo) {
    case 'shield':
      return <Shield className={defaultClass} size={size} />;
    case 'club':
      return <Activity className={defaultClass} size={size} />;
    case 'crown':
      return <Crown className={defaultClass} size={size} />;
    case 'mountain':
      return <Mountain className={defaultClass} size={size} />;
    case 'sword':
      return <Sword className={defaultClass} size={size} />;
    case 'castle':
      return <Castle className={defaultClass} size={size} />;
    case 'star':
      return <Star className={defaultClass} size={size} />;
    case 'flame':
      return <Flame className={defaultClass} size={size} />;
    case 'users':
      return <Users className={defaultClass} size={size} />;
    case 'trophy':
      return <Trophy className={defaultClass} size={size} />;
    default:
      return <Shield className={defaultClass} size={size} />;
  }
}

export const LOGO_OPTIONS = [
  { value: 'shield', label: 'Scudo' },
  { value: 'club', label: 'Attività/Club' },
  { value: 'crown', label: 'Corona' },
  { value: 'mountain', label: 'Montagna' },
  { value: 'sword', label: 'Spada' },
  { value: 'castle', label: 'Castello' },
  { value: 'star', label: 'Stella' },
  { value: 'flame', label: 'Fiamma' },
  { value: 'users', label: 'Gruppo' },
  { value: 'trophy', label: 'Trofeo' }
];
