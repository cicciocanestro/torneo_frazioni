import { useState, useMemo } from 'react';
import { useFirebase } from '../providers/FirebaseProvider';
import TeamLogo from './TeamLogo';
import { Search, Shield, User, Calendar, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function SearchView() {
  const { teams, matches, scorers, loading } = useFirebase();
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    const cleanTerm = searchTerm.trim().toLowerCase();
    if (!cleanTerm) {
      return { teams: [], players: [], matches: [] };
    }

    // 1. Filter teams
    const filteredTeams = teams.filter((t) => 
      t.name.toLowerCase().includes(cleanTerm)
    );

    // 2. Filter players/scorers
    const filteredPlayers = scorers.filter((s) => 
      s.player.toLowerCase().includes(cleanTerm)
    );

    // 3. Filter matches by team name or match scorers
    const filteredMatches = matches.filter((m) => {
      const matchesTeam = m.homeTeam.toLowerCase().includes(cleanTerm) || 
                          m.awayTeam.toLowerCase().includes(cleanTerm);
      const matchesScorer = m.scorers?.some((s) => 
        s.player.toLowerCase().includes(cleanTerm)
      );
      return matchesTeam || matchesScorer;
    });

    return {
      teams: filteredTeams,
      players: filteredPlayers,
      matches: filteredMatches
    };
  }, [searchTerm, teams, matches, scorers]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      <div>
        <h2 className="font-sans font-black text-2xl uppercase text-zinc-900 dark:text-white tracking-tight">
          Cerca nel Torneo
        </h2>
        <p className="font-sans text-xs text-zinc-500 dark:text-white/40 mt-1">
          Cerca all'istante squadre, giocatori, partite o marcatori
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white/40" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Scrivi il nome di una squadra o di un giocatore..."
          className="w-full bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 font-sans text-xs uppercase font-bold tracking-wider outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-brand-green transition-all text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-white/25"
          autoFocus
        />
      </div>

      {/* Results Section */}
      {searchTerm.trim() ? (
        <div className="space-y-8">
          {/* Teams Results */}
          {searchResults.teams.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-sans font-black text-[10px] text-zinc-400 dark:text-white/40 uppercase tracking-widest pl-2 border-l-2 border-zinc-300 dark:border-white/20 flex items-center space-x-2">
                <Shield size={12} />
                <span>Squadre ({searchResults.teams.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.teams.map((team) => (
                  <div 
                    key={team.id}
                    className="flex items-center space-x-3 p-4 bg-white dark:bg-zinc-900/40 border border-zinc-150 dark:border-white/5 rounded-xl shadow-sm"
                  >
                    <TeamLogo logo={team.logo} teamName={team.name} size={28} />
                    <div>
                      <h4 className="font-sans font-black text-xs md:text-sm text-zinc-900 dark:text-white uppercase tracking-tight">{team.name}</h4>
                      <p className="font-sans text-[10px] text-zinc-400 dark:text-white/40 font-bold uppercase tracking-wider">Girone {team.group}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Players/Scorers Results */}
          {searchResults.players.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-sans font-black text-[10px] text-zinc-400 dark:text-white/40 uppercase tracking-widest pl-2 border-l-2 border-zinc-300 dark:border-white/20 flex items-center space-x-2">
                <User size={12} />
                <span>Giocatori ({searchResults.players.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.players.map((player) => (
                  <div 
                    key={player.id}
                    className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900/40 border border-zinc-150 dark:border-white/5 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-zinc-100 dark:bg-white/5 p-2 rounded text-zinc-400 dark:text-white/40 border border-zinc-200 dark:border-white/10">
                        <User size={14} />
                      </div>
                      <div>
                        <h4 className="font-sans font-black text-xs md:text-sm text-zinc-900 dark:text-white uppercase tracking-tight">{player.player}</h4>
                        <p className="font-sans text-[10px] text-zinc-400 dark:text-white/40 font-bold uppercase tracking-wider">{player.team}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black italic text-emerald-600 dark:text-brand-green text-sm">{player.goals} GOL ⚽</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matches Results */}
          {searchResults.matches.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-sans font-black text-[10px] text-zinc-400 dark:text-white/40 uppercase tracking-widest pl-2 border-l-2 border-zinc-300 dark:border-white/20 flex items-center space-x-2">
                <Calendar size={12} />
                <span>Partite ({searchResults.matches.length})</span>
              </h3>
              <div className="space-y-3">
                {searchResults.matches.map((match) => (
                  <div 
                    key={match.id}
                    className="p-4 bg-white dark:bg-zinc-900/40 border border-zinc-150 dark:border-white/5 rounded-xl shadow-sm space-y-3"
                  >
                    <div className="flex justify-between text-[10px] text-zinc-400 dark:text-white/40 font-mono font-bold uppercase tracking-widest">
                      <span>{formatDate(match.date)} - {match.time}</span>
                      <span>Girone {match.group}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3 w-5/12">
                        <TeamLogo logo={teams.find(t => t.name === match.homeTeam)?.logo} teamName={match.homeTeam} size={24} />
                        <span className="font-sans font-black text-xs md:text-sm text-zinc-900 dark:text-white uppercase tracking-tight truncate">{match.homeTeam}</span>
                      </div>

                      <div className="w-2/12 flex justify-center font-mono font-black text-xs bg-zinc-100 dark:bg-white/10 px-2.5 py-1 rounded italic">
                        {match.status === 'completed' ? (
                          <span>{match.homeGoals} - {match.awayGoals}</span>
                        ) : (
                          <span className="text-zinc-400 dark:text-white/30">VS</span>
                        )}
                      </div>

                      <div className="flex items-center justify-end space-x-3 w-5/12 text-right">
                        <span className="font-sans font-black text-xs md:text-sm text-zinc-900 dark:text-white uppercase tracking-tight truncate order-1">{match.awayTeam}</span>
                        <TeamLogo logo={teams.find(t => t.name === match.awayTeam)?.logo} teamName={match.awayTeam} size={24} className="order-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.teams.length === 0 && 
           searchResults.players.length === 0 && 
           searchResults.matches.length === 0 && (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-400 dark:text-white/40 text-xs font-black uppercase tracking-wider">
              Nessun risultato trovato per "{searchTerm}". Prova con un altro nome!
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
          <div className="max-w-xs mx-auto space-y-2">
            <Star className="text-emerald-500/30 dark:text-brand-green/30 mx-auto" size={40} />
            <h4 className="font-sans font-black text-sm text-zinc-700 dark:text-white/80 uppercase tracking-wide">Inizia a scrivere</h4>
            <p className="text-xs text-zinc-400 dark:text-white/40 font-sans leading-relaxed">
              Cerca squadre (es. "Boscatello") o giocatori (es. "Rossi") per trovare statistiche e partite associate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
