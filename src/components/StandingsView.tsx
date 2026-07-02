import { useState } from 'react';
import { useFirebase } from '../providers/FirebaseProvider';
import { useStandings, TeamStats } from '../hooks/useStandings';
import TeamLogo from './TeamLogo';
import { Trophy, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function StandingsView() {
  const { teams, matches, loading } = useFirebase();
  const standings = useStandings(teams, matches);
  const [activeGroup, setActiveGroup] = useState<'A' | 'B'>('A');

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse w-1/3" />
        <div className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  const currentStandings = activeGroup === 'A' ? standings.groupA : standings.groupB;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div>
        <h2 className="font-sans font-black text-2xl uppercase text-zinc-900 dark:text-white tracking-tight">
          Classifiche Ufficiali
        </h2>
        <p className="font-sans text-xs text-zinc-500 dark:text-white/40 mt-1">
          Punti, vittorie, pareggi, sconfitte e differenza reti calcolati in tempo reale
        </p>
      </div>

      {/* Group Selector Tabs */}
      <div className="flex rounded bg-zinc-100 dark:bg-white/5 p-1 border border-zinc-200 dark:border-white/10 w-full sm:w-64 text-[10px] font-black uppercase tracking-wider">
        <button
          onClick={() => setActiveGroup('A')}
          className={`flex-1 py-2 rounded text-center transition-all ${
            activeGroup === 'A'
              ? 'bg-white dark:bg-brand-green text-zinc-900 dark:text-black shadow-sm font-black'
              : 'text-zinc-500 dark:text-white/50'
          }`}
        >
          Girone A
        </button>
        <button
          onClick={() => setActiveGroup('B')}
          className={`flex-1 py-2 rounded text-center transition-all ${
            activeGroup === 'B'
              ? 'bg-white dark:bg-brand-green text-zinc-900 dark:text-black shadow-sm font-black'
              : 'text-zinc-500 dark:text-white/50'
          }`}
        >
          Girone B
        </button>
      </div>

      {/* Standings Table Card */}
      <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-150 dark:border-white/5 text-zinc-400 dark:text-white/40 font-bold text-[10px] uppercase bg-zinc-50/50 dark:bg-white/5 tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Pos</th>
                <th className="py-3 px-2">Squadra</th>
                <th className="py-3 px-3 text-center w-14 font-black text-emerald-600 dark:text-brand-green">Pt</th>
                <th className="py-3 px-3 text-center w-12">G</th>
                <th className="py-3 px-3 text-center w-12">V</th>
                <th className="py-3 px-3 text-center w-12">N</th>
                <th className="py-3 px-3 text-center w-12">P</th>
                <th className="py-3 px-3 text-center w-14">GF</th>
                <th className="py-3 px-3 text-center w-14">GS</th>
                <th className="py-3 px-3 text-center w-14 font-black">DR</th>
              </tr>
            </thead>
            <tbody>
              {currentStandings.length > 0 ? (
                currentStandings.map((team: TeamStats, idx: number) => {
                  const isFirst = idx === 0;
                  return (
                    <tr
                      key={team.teamName}
                      className={`border-b border-zinc-100 dark:border-white/5 last:border-0 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all ${
                        isFirst ? 'bg-emerald-500/5 dark:bg-brand-green/5' : ''
                      }`}
                    >
                      {/* Position */}
                      <td className="py-4 px-4 text-center">
                        <span className={`font-mono font-black italic text-sm flex justify-center items-center ${
                          isFirst ? 'text-emerald-600 dark:text-brand-green' : 'text-zinc-400 dark:text-white/30'
                        }`}>
                          {isFirst ? <Trophy size={14} className="text-amber-500 mr-1 shrink-0" /> : null}
                          {idx + 1}
                        </span>
                      </td>

                      {/* Team Name */}
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-3">
                          <TeamLogo logo={team.logo} teamName={team.teamName} size={24} />
                          <span className="font-sans font-black text-xs md:text-sm text-zinc-900 dark:text-white uppercase tracking-tight">
                            {team.teamName}
                          </span>
                        </div>
                      </td>

                      {/* Points (Pt) */}
                      <td className="py-4 px-3 text-center font-mono font-black text-sm text-emerald-600 dark:text-brand-green italic">
                        {team.points}
                      </td>

                      {/* Played (G) */}
                      <td className="py-4 px-3 text-center font-mono text-xs text-zinc-600 dark:text-white/60">
                        {team.played}
                      </td>

                      {/* Won (V) */}
                      <td className="py-4 px-3 text-center font-mono text-xs text-zinc-600 dark:text-white/60">
                        {team.won}
                      </td>

                      {/* Drawn (N) */}
                      <td className="py-4 px-3 text-center font-mono text-xs text-zinc-600 dark:text-white/60">
                        {team.drawn}
                      </td>

                      {/* Lost (P) */}
                      <td className="py-4 px-3 text-center font-mono text-xs text-zinc-600 dark:text-white/60">
                        {team.lost}
                      </td>

                      {/* Goals For (GF) */}
                      <td className="py-4 px-3 text-center font-mono text-xs text-zinc-500 dark:text-white/50">
                        {team.goalsFor}
                      </td>

                      {/* Goals Against (GS) */}
                      <td className="py-4 px-3 text-center font-mono text-xs text-zinc-500 dark:text-white/50">
                        {team.goalsAgainst}
                      </td>

                      {/* Goal Difference (DR) */}
                      <td className={`py-4 px-3 text-center font-mono text-xs font-black italic ${
                        team.goalsDifference > 0 
                          ? 'text-emerald-600 dark:text-brand-green' 
                          : team.goalsDifference < 0 
                            ? 'text-red-500' 
                            : 'text-zinc-500 dark:text-white/40'
                      }`}>
                        {team.goalsDifference > 0 ? `+${team.goalsDifference}` : team.goalsDifference}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-zinc-400 dark:text-white/30 text-xs font-black uppercase tracking-wider">
                    Nessuna squadra trovata per questa edizione.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Standings Legend / Rules */}
      <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-white/5 p-4 rounded-xl flex items-start space-x-3">
        <HelpCircle className="text-zinc-400 dark:text-white/50 shrink-0 mt-0.5" size={18} />
        <div className="text-xs text-zinc-500 dark:text-white/60 space-y-1.5 font-sans leading-relaxed">
          <p className="font-black uppercase tracking-wider text-[10px] text-zinc-700 dark:text-white/80">Regolamento e Criteri di Classifica:</p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Vittoria: <strong className="text-emerald-600 dark:text-brand-green font-black">3 punti</strong> | Pareggio: <strong className="font-bold">1 punto</strong> | Sconfitta: <strong className="font-bold">0 punti</strong></li>
            <li>In caso di parità di punti, si applicano i seguenti criteri ordinati: 
              <ol className="list-decimal list-inside pl-4 mt-1 space-y-0.5 font-medium">
                <li>Miglior differenza reti (DR)</li>
                <li>Miglior numero di gol fatti (GF)</li>
                <li>Ordine alfabetico</li>
              </ol>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
