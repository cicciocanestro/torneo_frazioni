import { useFirebase } from '../providers/FirebaseProvider';
import TeamLogo from './TeamLogo';
import { Trophy, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function ScorersView() {
  const { scorers, teams, loading } = useFirebase();

  const getTeamLogo = (teamName: string) => {
    const team = teams.find((t) => t.name === teamName);
    return team?.logo;
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse w-1/3" />
        <div className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      <div>
        <h2 className="font-sans font-black text-2xl uppercase text-zinc-900 dark:text-white tracking-tight">
          Classifica Marcatori
        </h2>
        <p className="font-sans text-xs text-zinc-500 dark:text-white/40 mt-1">
          I migliori bomber del torneo ordinati per reti segnate
        </p>
      </div>

      {/* Scorers Table Card */}
      <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-150 dark:border-white/5 text-zinc-400 dark:text-white/40 font-bold text-[10px] uppercase bg-zinc-50/50 dark:bg-white/5 tracking-wider">
              <th className="py-3 px-4 w-16 text-center">Pos</th>
              <th className="py-3 px-2">Giocatore</th>
              <th className="py-3 px-2">Squadra</th>
              <th className="py-3 px-4 text-right w-24 font-black text-emerald-600 dark:text-brand-green">Gol</th>
            </tr>
          </thead>
          <tbody>
            {scorers.length > 0 ? (
              scorers.map((scorer, idx) => {
                const isTop3 = idx < 3;
                const medalColors = [
                  'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/20 font-black', // Gold
                  'text-zinc-400 bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-500/20 font-black',   // Silver
                  'text-amber-700 bg-amber-50 dark:bg-amber-950/10 border border-amber-700/20 font-black', // Bronze
                ];
                
                return (
                  <tr
                    key={scorer.id || `${scorer.player}-${scorer.team}`}
                    className="border-b border-zinc-100 dark:border-white/5 last:border-0 hover:bg-zinc-50/30 dark:hover:bg-white/5 transition-colors"
                  >
                    {/* Position */}
                    <td className="py-3.5 px-4 text-center">
                      {isTop3 ? (
                        <div className={`inline-flex items-center justify-center font-mono text-[10px] w-6 h-6 rounded italic ${medalColors[idx]}`}>
                          {idx + 1}
                        </div>
                      ) : (
                        <span className="font-mono font-black italic text-sm text-zinc-400 dark:text-white/30">
                          {idx + 1}
                        </span>
                      )}
                    </td>

                    {/* Player Name */}
                    <td className="py-3.5 px-2">
                      <span className="font-sans font-black text-xs md:text-sm text-zinc-800 dark:text-white uppercase tracking-tight">
                        {scorer.player}
                      </span>
                    </td>

                    {/* Team */}
                    <td className="py-3.5 px-2">
                      <div className="flex items-center space-x-2">
                        <TeamLogo logo={getTeamLogo(scorer.team)} teamName={scorer.team} size={20} />
                        <span className="font-sans text-xs font-black uppercase tracking-tight text-zinc-600 dark:text-white/60">
                          {scorer.team}
                        </span>
                      </div>
                    </td>

                    {/* Goals */}
                    <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-emerald-600 dark:text-brand-green italic">
                      <span className="mr-1.5">{scorer.goals}</span>
                      <span className="text-xs">⚽</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-zinc-400 dark:text-white/30 text-xs font-black uppercase tracking-wider">
                  Nessun gol segnato finora in questa edizione.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
