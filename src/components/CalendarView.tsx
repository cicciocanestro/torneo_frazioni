import { useState, useMemo } from 'react';
import { useFirebase } from '../providers/FirebaseProvider';
import TeamLogo from './TeamLogo';
import { Calendar, Clock, Star, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function CalendarView() {
  const { matches, teams, loading } = useFirebase();
  const [groupFilter, setGroupFilter] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'scheduled' | 'completed'>('ALL');

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const matchesGroup = groupFilter === 'ALL' || m.group === groupFilter;
      const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
      return matchesGroup && matchesStatus;
    });
  }, [matches, groupFilter, statusFilter]);

  // Group matches by date
  const matchesByDate = useMemo(() => {
    const map: { [date: string]: typeof matches } = {};
    filteredMatches.forEach((m) => {
      if (!map[m.date]) {
        map[m.date] = [];
      }
      map[m.date].push(m);
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredMatches]);

  const formatDateItalian = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse w-1/2" />
        <div className="space-y-4">
          <div className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
          <div className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-black text-2xl uppercase text-zinc-900 dark:text-white tracking-tight">
            Calendario Partite
          </h2>
          <p className="font-sans text-xs text-zinc-500 dark:text-white/40 mt-1">
            Visualizza tutte le giornate e i risultati del torneo
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2.5">
          {/* Group Filter */}
          <div className="flex rounded bg-zinc-100 dark:bg-white/5 p-1 border border-zinc-200 dark:border-white/10 text-[10px] font-black uppercase tracking-wider">
            <button
              onClick={() => setGroupFilter('ALL')}
              className={`px-3 py-1 rounded transition-all ${
                groupFilter === 'ALL'
                  ? 'bg-white dark:bg-brand-green text-zinc-900 dark:text-black shadow-sm font-black'
                  : 'text-zinc-500 dark:text-white/50'
              }`}
            >
              Tutti
            </button>
            <button
              onClick={() => setGroupFilter('A')}
              className={`px-3 py-1 rounded transition-all ${
                groupFilter === 'A'
                  ? 'bg-white dark:bg-brand-green text-zinc-900 dark:text-black shadow-sm font-black'
                  : 'text-zinc-500 dark:text-white/50'
              }`}
            >
              Girone A
            </button>
            <button
              onClick={() => setGroupFilter('B')}
              className={`px-3 py-1 rounded transition-all ${
                groupFilter === 'B'
                  ? 'bg-white dark:bg-brand-green text-zinc-900 dark:text-black shadow-sm font-black'
                  : 'text-zinc-500 dark:text-white/50'
              }`}
            >
              Girone B
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex rounded bg-zinc-100 dark:bg-white/5 p-1 border border-zinc-200 dark:border-white/10 text-[10px] font-black uppercase tracking-wider">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-brand-green text-zinc-900 dark:text-black shadow-sm font-black'
                  : 'text-zinc-500 dark:text-white/50'
              }`}
            >
              Tutte
            </button>
            <button
              onClick={() => setStatusFilter('scheduled')}
              className={`px-3 py-1 rounded transition-all ${
                statusFilter === 'scheduled'
                  ? 'bg-white dark:bg-brand-green text-zinc-900 dark:text-black shadow-sm font-black'
                  : 'text-zinc-500 dark:text-white/50'
              }`}
            >
              Da Giocare
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded transition-all ${
                statusFilter === 'completed'
                  ? 'bg-white dark:bg-brand-green text-zinc-900 dark:text-black shadow-sm font-black'
                  : 'text-zinc-500 dark:text-white/50'
              }`}
            >
              Risultati
            </button>
          </div>
        </div>
      </div>

      {/* Match List grouped by Date */}
      <div className="space-y-6">
        {matchesByDate.length > 0 ? (
          matchesByDate.map(([date, dateMatches]) => (
            <div key={date} className="space-y-3">
              <h3 className="font-sans font-black text-xs text-emerald-600 dark:text-brand-green uppercase tracking-widest pl-2 border-l-2 border-emerald-500 dark:border-brand-green flex items-center space-x-2">
                <Calendar size={14} />
                <span>{formatDateItalian(date)}</span>
              </h3>

              <div className="space-y-3.5">
                {dateMatches.map((match) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-white/5 rounded-xl p-4 shadow-sm space-y-3 hover:border-zinc-200 dark:hover:border-brand-green/30 transition-colors"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-white/40">
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{match.time}</span>
                      </div>
                      <span className="bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded border border-zinc-200 dark:border-white/10">
                        Girone {match.group}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      {/* Home Team */}
                      <div className="flex items-center space-x-3 w-5/12">
                        <TeamLogo logo={teams.find(t => t.name === match.homeTeam)?.logo} teamName={match.homeTeam} size={32} />
                        <span className="font-sans font-black text-xs md:text-sm text-zinc-900 dark:text-white uppercase tracking-tight truncate">
                          {match.homeTeam}
                        </span>
                      </div>

                      {/* Score or VS */}
                      <div className="w-2/12 flex justify-center">
                        {match.status === 'completed' ? (
                          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/10 px-3 py-1 rounded font-mono font-black text-sm italic select-none">
                            <span className={match.homeGoals! >= match.awayGoals! ? 'text-emerald-600 dark:text-brand-green' : 'text-zinc-600 dark:text-white/40'}>
                              {match.homeGoals}
                            </span>
                            <span className="text-zinc-300 dark:text-white/20">-</span>
                            <span className={match.awayGoals! >= match.homeGoals! ? 'text-emerald-600 dark:text-brand-green' : 'text-zinc-600 dark:text-white/40'}>
                              {match.awayGoals}
                            </span>
                          </div>
                        ) : (
                          <div className="font-mono text-[10px] font-black text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1 rounded italic border border-zinc-100 dark:border-white/5">
                            VS
                          </div>
                        )}
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center justify-end space-x-3 w-5/12 text-right">
                        <span className="font-sans font-black text-xs md:text-sm text-zinc-900 dark:text-white uppercase tracking-tight truncate order-1">
                          {match.awayTeam}
                        </span>
                        <TeamLogo logo={teams.find(t => t.name === match.awayTeam)?.logo} teamName={match.awayTeam} size={32} className="order-2" />
                      </div>
                    </div>

                    {/* Scorers info below result */}
                    {match.status === 'completed' && match.scorers && match.scorers.length > 0 && (
                      <div className="text-[10px] bg-zinc-50 dark:bg-black/30 rounded p-2 text-zinc-500 dark:text-white/60 font-mono leading-relaxed space-y-1 border border-zinc-100 dark:border-white/5">
                        {match.scorers.map((scorer, index) => (
                          <div key={index} className="flex justify-between items-center px-1">
                            <span className="font-sans font-semibold uppercase">{scorer.player} ({scorer.team})</span>
                            <span className="font-black text-emerald-600 dark:text-brand-green tracking-wider">
                              {scorer.goals} GOL ⚽
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-400 dark:text-white/40 font-bold text-xs uppercase tracking-wider">
            Nessun incontro corrisponde ai filtri selezionati.
          </div>
        )}
      </div>
    </div>
  );
}
