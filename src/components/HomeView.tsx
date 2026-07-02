import { useFirebase } from '../providers/FirebaseProvider';
import { useStandings } from '../hooks/useStandings';
import TeamLogo from './TeamLogo';
import { Calendar, Clock, Trophy, Users, Star, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
}

export default function HomeView({ setActiveTab }: HomeViewProps) {
  const { teams, matches, scorers, loading } = useFirebase();
  const standings = useStandings(teams, matches);

  // 1. Next scheduled match
  const nextMatch = matches.find((m) => m.status === 'scheduled');

  // 2. Latest 5 results
  const completedMatches = matches
    .filter((m) => m.status === 'completed')
    .slice(-5)
    .reverse();

  // 3. Top scorer
  const topScorer = scorers.length > 0 ? scorers[0] : null;

  // Format date helper (Italian style)
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="h-80 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Hero Welcome banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 to-zinc-950 dark:from-brand-bg dark:to-zinc-900 text-white p-6 md:p-8 shadow-xl border border-emerald-500/20"
      >
        <div className="relative z-10 max-w-xl">
          <span className="bg-emerald-500/20 text-emerald-300 dark:text-brand-green text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border border-emerald-500/30">
            Torneo Frazioni 2026
          </span>
          <h2 className="font-sans font-black text-2xl md:text-4xl mt-4 leading-none uppercase tracking-tight">
            Il grande calcio a Castiglion Fiorentino
          </h2>
          <p className="font-sans text-emerald-200/80 text-xs md:text-sm mt-3 leading-relaxed tracking-wide">
            Segui in tempo reale il torneo estivo delle frazioni. Risultati, classifiche, calendario e capocannonieri sempre aggiornati.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Trophy size={200} className="text-emerald-400 stroke-[1px]" />
        </div>
      </motion.div>

      {/* Main Grid: Left Next Match & Last Results, Right Standings & Capocannoniere */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Next Match Card */}
          <section className="space-y-4">
            <h3 className="font-sans font-black text-xs uppercase tracking-widest text-emerald-600 dark:text-brand-green flex items-center space-x-2">
              <Calendar size={16} />
              <span>Prossimo Incontro</span>
            </h3>
            
            {nextMatch ? (
              <motion.div 
                whileHover={{ y: -3 }}
                className="relative overflow-hidden bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-brand-bg border border-zinc-200 dark:border-brand-green/30 p-6 rounded-2xl shadow-md space-y-4"
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-600 dark:bg-brand-green text-white dark:text-black text-[10px] font-black uppercase italic tracking-widest shadow-sm">
                  NEXT MATCH
                </div>

                <div className="flex flex-col pt-2">
                  <span className="text-emerald-600 dark:text-brand-green text-[10px] font-black uppercase tracking-widest mb-1">
                    Girone {nextMatch.group}
                  </span>
                  <p className="text-zinc-900 dark:text-zinc-50 font-mono text-sm font-black uppercase tracking-tight">
                    {formatDate(nextMatch.date)} • {nextMatch.time}
                  </p>
                </div>

                <div className="flex justify-around items-center py-4">
                  {/* Home */}
                  <div className="flex flex-col items-center text-center w-5/12">
                    <TeamLogo logo={teams.find(t => t.name === nextMatch.homeTeam)?.logo} teamName={nextMatch.homeTeam} size={64} />
                    <span className="font-sans font-black uppercase text-sm text-zinc-900 dark:text-white mt-3 truncate max-w-full">
                      {nextMatch.homeTeam}
                    </span>
                  </div>

                  {/* VS */}
                  <div className="text-zinc-300 dark:text-white/20 font-black text-2xl italic font-mono tracking-widest">
                    VS
                  </div>

                  {/* Away */}
                  <div className="flex flex-col items-center text-center w-5/12">
                    <TeamLogo logo={teams.find(t => t.name === nextMatch.awayTeam)?.logo} teamName={nextMatch.awayTeam} size={64} />
                    <span className="font-sans font-black uppercase text-sm text-zinc-900 dark:text-white mt-3 truncate max-w-full">
                      {nextMatch.awayTeam}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-white/10 p-8 rounded-2xl text-center text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-wider">
                Tutte le partite sono state disputate. Torneo concluso!
              </div>
            )}
          </section>

          {/* Latest 5 Results */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-sans font-black text-xs uppercase tracking-widest text-emerald-600 dark:text-brand-green flex items-center space-x-2">
                <Star size={16} />
                <span>Ultimi Risultati</span>
              </h3>
              <button 
                onClick={() => setActiveTab('calendar')}
                className="text-emerald-600 dark:text-brand-green text-xs font-black uppercase tracking-wider hover:underline flex items-center space-x-1"
              >
                <span>Tutti</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="space-y-3.5">
              {completedMatches.length > 0 ? (
                completedMatches.map((match) => (
                  <div 
                    key={match.id}
                    className="bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-white/5 p-4 rounded-xl shadow-sm flex flex-col space-y-3"
                  >
                    <div className="flex justify-between text-[10px] text-zinc-400 dark:text-white/40 font-mono font-bold uppercase tracking-widest border-b border-zinc-100 dark:border-white/5 pb-1.5">
                      <span>{formatDate(match.date)} - {match.time}</span>
                      <span>Girone {match.group}</span>
                    </div>

                    <div className="flex justify-between items-center px-2">
                      {/* Home */}
                      <div className="flex items-center space-x-3 w-5/12">
                        <TeamLogo logo={teams.find(t => t.name === match.homeTeam)?.logo} teamName={match.homeTeam} size={32} />
                        <span className="font-sans font-black text-xs md:text-sm text-zinc-800 dark:text-white uppercase tracking-tight truncate">
                          {match.homeTeam}
                        </span>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/10 px-3 py-1 rounded-lg font-black text-lg italic select-none">
                        <span className={match.homeGoals! >= match.awayGoals! ? 'text-emerald-600 dark:text-brand-green' : 'text-zinc-600 dark:text-white/40'}>
                          {match.homeGoals}
                        </span>
                        <span className="text-zinc-300 dark:text-white/20">-</span>
                        <span className={match.awayGoals! >= match.homeGoals! ? 'text-emerald-600 dark:text-brand-green' : 'text-zinc-600 dark:text-white/40'}>
                          {match.awayGoals}
                        </span>
                      </div>

                      {/* Away */}
                      <div className="flex items-center justify-end space-x-3 w-5/12 text-right">
                        <span className="font-sans font-black text-xs md:text-sm text-zinc-800 dark:text-white uppercase tracking-tight truncate order-1">
                          {match.awayTeam}
                        </span>
                        <TeamLogo logo={teams.find(t => t.name === match.awayTeam)?.logo} teamName={match.awayTeam} size={32} className="order-2" />
                      </div>
                    </div>

                    {/* Scorers list if any */}
                    {match.scorers && match.scorers.length > 0 && (
                      <div className="text-[10px] bg-zinc-50 dark:bg-black/30 rounded p-2 text-zinc-500 dark:text-white/60 font-mono leading-relaxed space-y-1 border border-zinc-100 dark:border-white/5">
                        {match.scorers.map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="font-sans font-semibold uppercase">{s.player} ({s.team})</span>
                            <span className="font-black text-emerald-600 dark:text-brand-green tracking-wider">{s.goals} GOL ⚽</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center p-6 bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-white/10 rounded-xl text-zinc-400 dark:text-white/40 font-bold text-xs uppercase tracking-wider">
                  Nessuna partita disputata finora.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Top Scorer Card */}
          <section className="space-y-4">
            <h3 className="font-sans font-black text-xs uppercase tracking-widest text-emerald-600 dark:text-brand-green flex items-center space-x-2">
              <Trophy size={16} />
              <span>Capocannoniere</span>
            </h3>

            {topScorer ? (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-sm flex items-center space-x-4"
              >
                <div className="w-14 h-14 bg-emerald-100 dark:bg-brand-green/10 border border-emerald-300 dark:border-brand-green/20 rounded-full flex items-center justify-center text-emerald-700 dark:text-brand-green font-black text-xl italic shrink-0">
                  {topScorer.player.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black text-emerald-600 dark:text-brand-green font-mono uppercase tracking-widest leading-none">
                    BOMBER TORNEO
                  </span>
                  <h4 className="font-sans font-black text-base text-zinc-900 dark:text-white uppercase leading-tight truncate mt-1">
                    {topScorer.player}
                  </h4>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-white/40 uppercase mt-0.5 tracking-wider">
                    {topScorer.team}
                  </p>
                </div>
                <div className="text-right pl-2 border-l border-zinc-100 dark:border-white/5">
                  <div className="font-mono font-black text-2xl text-emerald-600 dark:text-brand-green italic leading-none">
                    {topScorer.goals}
                  </div>
                  <span className="text-[9px] font-mono font-bold text-zinc-400 dark:text-white/40 uppercase tracking-widest">
                    GOL
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="p-5 bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl text-center text-zinc-400 dark:text-white/40 font-bold text-xs uppercase tracking-wider">
                Nessun marcatore inserito.
              </div>
            )}
          </section>

          {/* Synthetic Mini Tables */}
          <section className="space-y-4">
            <h3 className="font-sans font-black text-xs uppercase tracking-widest text-emerald-600 dark:text-brand-green flex items-center space-x-2">
              <Users size={16} />
              <span>Classifiche Sintetiche</span>
            </h3>

            <div className="space-y-4">
              {/* Group A */}
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-zinc-100 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5 px-4 py-2.5 flex justify-between items-center">
                  <span className="font-sans font-black text-[11px] text-zinc-800 dark:text-white uppercase tracking-wider">
                    GIRONE A
                  </span>
                  <button 
                    onClick={() => setActiveTab('standings')}
                    className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-brand-green hover:underline"
                  >
                    Vedi Tutto
                  </button>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-white/5 text-[9px] text-zinc-400 dark:text-white/40 font-bold uppercase tracking-wider">
                      <th className="py-2 px-3 w-10 text-center">Pos</th>
                      <th className="py-2 px-2">Squadra</th>
                      <th className="py-2 px-3 text-right w-12 font-bold">Pt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.groupA.slice(0, 3).map((team, idx) => (
                      <tr 
                        key={team.teamName}
                        className="border-b border-zinc-50 dark:border-white/5 last:border-0 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="py-2.5 px-3 text-center font-mono font-black italic text-zinc-400 dark:text-white/30 text-xs">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-2 flex items-center space-x-2">
                          <TeamLogo logo={team.logo} teamName={team.teamName} size={20} />
                          <span className="font-sans font-bold text-zinc-800 dark:text-white uppercase tracking-tight text-xs">
                            {team.teamName}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-black text-sm text-emerald-600 dark:text-brand-green italic">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Group B */}
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-zinc-100 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5 px-4 py-2.5 flex justify-between items-center">
                  <span className="font-sans font-black text-[11px] text-zinc-800 dark:text-white uppercase tracking-wider">
                    GIRONE B
                  </span>
                  <button 
                    onClick={() => setActiveTab('standings')}
                    className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-brand-green hover:underline"
                  >
                    Vedi Tutto
                  </button>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-white/5 text-[9px] text-zinc-400 dark:text-white/40 font-bold uppercase tracking-wider">
                      <th className="py-2 px-3 w-10 text-center">Pos</th>
                      <th className="py-2 px-2">Squadra</th>
                      <th className="py-2 px-3 text-right w-12 font-bold">Pt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.groupB.slice(0, 3).map((team, idx) => (
                      <tr 
                        key={team.teamName}
                        className="border-b border-zinc-50 dark:border-white/5 last:border-0 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="py-2.5 px-3 text-center font-mono font-black italic text-zinc-400 dark:text-white/30 text-xs">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-2 flex items-center space-x-2">
                          <TeamLogo logo={team.logo} teamName={team.teamName} size={20} />
                          <span className="font-sans font-bold text-zinc-800 dark:text-white uppercase tracking-tight text-xs">
                            {team.teamName}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-black text-sm text-emerald-600 dark:text-brand-green italic">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
