import React, { useState } from 'react';
import { useFirebase } from '../providers/FirebaseProvider';
import TeamLogo, { LOGO_OPTIONS } from './TeamLogo';
import { Team, Match, MatchScorer, Scorer } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Settings, 
  RefreshCw, 
  Save, 
  UserPlus, 
  Calendar, 
  Shield 
} from 'lucide-react';
import { motion } from 'motion/react';
import { writeBatch, collection, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function AdminDashboard() {
  const { 
    teams, 
    matches, 
    activeEdition, 
    addMatch, 
    updateMatch, 
    deleteMatch,
    reseedEdition
  } = useFirebase();

  const adminTab = 'matches';

  // Modal / Form States
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [homeGoals, setHomeGoals] = useState<number>(0);
  const [awayGoals, setAwayGoals] = useState<number>(0);
  const [matchScorers, setMatchScorers] = useState<MatchScorer[]>([]);
  const [newScorerName, setNewScorerName] = useState('');
  const [newScorerTeam, setNewScorerTeam] = useState('');
  const [newScorerGoals, setNewScorerGoals] = useState<number>(1);

  // New Match Form States
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [matchHome, setMatchHome] = useState('');
  const [matchAway, setMatchAway] = useState('');
  const [matchGroup, setMatchGroup] = useState<'A' | 'B'>('A');

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchDate || !matchTime || !matchHome || !matchAway) return;
    await addMatch({
      date: matchDate,
      time: matchTime,
      homeTeam: matchHome,
      awayTeam: matchAway,
      homeGoals: null,
      awayGoals: null,
      group: matchGroup,
      status: 'scheduled',
      edition: activeEdition,
      scorers: []
    });
    setMatchDate('');
    setMatchTime('');
  };

  // --- Scorer & Results Logic ---
  const handleOpenResultModal = (match: Match) => {
    setSelectedMatch(match);
    setHomeGoals(match.homeGoals || 0);
    setAwayGoals(match.awayGoals || 0);
    setMatchScorers(match.scorers || []);
    setNewScorerTeam(match.homeTeam);
    setNewScorerName('');
    setNewScorerGoals(1);
    setIsResultModalOpen(true);
  };

  const handleAddMatchScorer = () => {
    if (!newScorerName.trim()) return;
    setMatchScorers([
      ...matchScorers,
      {
        player: newScorerName.trim(),
        team: newScorerTeam,
        goals: newScorerGoals
      }
    ]);
    setNewScorerName('');
    setNewScorerGoals(1);
  };

  const handleRemoveMatchScorer = (idx: number) => {
    setMatchScorers(matchScorers.filter((_, i) => i !== idx));
  };

  // Aggregates all scorers from ALL matches of activeEdition and updates the scorers collection atomically
  const syncOverallScorers = async (updatedMatches: Match[]) => {
    try {
      const batch = writeBatch(db);
      
      // 1. Get and delete all current scorers for activeEdition
      const scorersQuery = query(collection(db, 'scorers'), where('edition', '==', activeEdition));
      const scorersSnapshot = await getDocs(scorersQuery);
      scorersSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // 2. Aggregate from scratch
      const aggregateMap: { [key: string]: { player: string; team: string; goals: number } } = {};
      
      updatedMatches.forEach((m) => {
        if (m.status === 'completed' && m.scorers) {
          m.scorers.forEach((s) => {
            const key = `${s.player.toLowerCase()}_${s.team.toLowerCase()}`;
            if (aggregateMap[key]) {
              aggregateMap[key].goals += s.goals;
            } else {
              aggregateMap[key] = {
                player: s.player,
                team: s.team,
                goals: s.goals
              };
            }
          });
        }
      });

      // 3. Write new scorer documents
      Object.values(aggregateMap).forEach((scorer) => {
        const scorerRef = doc(collection(db, 'scorers'));
        batch.set(scorerRef, {
          player: scorer.player,
          team: scorer.team,
          goals: scorer.goals,
          edition: activeEdition
        });
      });

      await batch.commit();
      console.log('Overall scorers synced.');
    } catch (err) {
      console.error('Error syncing overall scorers:', err);
    }
  };

  const handleSaveMatchResult = async () => {
    if (!selectedMatch?.id) return;
    
    const updatedMatch: Match = {
      ...selectedMatch,
      homeGoals,
      awayGoals,
      status: 'completed',
      scorers: matchScorers
    };

    // Save match result
    await updateMatch(selectedMatch.id, {
      homeGoals,
      awayGoals,
      status: 'completed',
      scorers: matchScorers
    });

    // Create temporary copy of matches list to run aggregation sync
    const nextMatches = matches.map(m => m.id === selectedMatch.id ? updatedMatch : m);
    await syncOverallScorers(nextMatches);

    setIsResultModalOpen(false);
    setSelectedMatch(null);
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-black text-2xl text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center space-x-2">
            <Settings className="text-emerald-600" size={24} />
            <span>Pannello Amministratore</span>
          </h2>
          <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Gestisci squadre, incontri, risultati e impostazioni generali del torneo
          </p>
        </div>

        {/* Reseed action for testing */}
        <button
          onClick={() => {
            if (confirm('Vuoi davvero ripristinare i dati originali del 2026? Tutti i risultati attuali andranno persi.')) {
              reseedEdition(activeEdition);
            }
          }}
          className="flex items-center space-x-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border border-zinc-200 dark:border-zinc-700 self-start"
        >
          <RefreshCw size={14} />
          <span>Ripristina default 2026</span>
        </button>
      </div>

      {/* MATCHES MANAGEMENT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Create Match Form */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-sm text-zinc-800 dark:text-zinc-100 uppercase tracking-wider flex items-center space-x-2">
              <Calendar size={16} className="text-emerald-600" />
              <span>Crea Incontro</span>
            </h3>

            <form onSubmit={handleAddMatch} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-zinc-500">Data Partita</label>
                <input
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500">Ora Inizio</label>
                <input
                  type="text"
                  placeholder="e.g., 21:00"
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-zinc-100 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500">Girone</label>
                <select
                  value={matchGroup}
                  onChange={(e) => setMatchGroup(e.target.value as 'A' | 'B')}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-zinc-100"
                >
                  <option value="A">Girone A</option>
                  <option value="B">Girone B</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500">Squadra Casa</label>
                <select
                  value={matchHome}
                  onChange={(e) => setMatchHome(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-zinc-100"
                  required
                >
                  <option value="">Seleziona...</option>
                  {teams
                    .filter(t => t.group === matchGroup)
                    .map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500">Squadra Ospite</label>
                <select
                  value={matchAway}
                  onChange={(e) => setMatchAway(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-zinc-100"
                  required
                >
                  <option value="">Seleziona...</option>
                  {teams
                    .filter(t => t.group === matchGroup && t.name !== matchHome)
                    .map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <Plus size={16} />
                <span>Crea Partita</span>
              </button>
            </form>
          </div>

          {/* Matches list for updating scores */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-sans font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider pl-1">
              Inserisci o Modifica Risultati
            </h3>

            <div className="space-y-3">
              {matches.map((match) => (
                <div 
                  key={match.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 font-bold uppercase">
                      <span>{match.date} {match.time}</span>
                      <span>•</span>
                      <span className="text-emerald-600">Girone {match.group}</span>
                    </div>

                    <div className="flex items-center space-x-4 mt-2 font-sans font-extrabold text-sm text-zinc-800 dark:text-zinc-100">
                      <span>{match.homeTeam}</span>
                      <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs text-zinc-500">
                        {match.status === 'completed' ? `${match.homeGoals} - ${match.awayGoals}` : 'VS'}
                      </span>
                      <span>{match.awayTeam}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenResultModal(match)}
                      className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-400 font-sans font-bold text-xs px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Edit2 size={12} />
                      <span>{match.status === 'completed' ? 'Modifica Risultato' : 'Inserisci Risultato'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Vuoi davvero cancellare questa partita?')) {
                          deleteMatch(match.id!);
                        }
                      }}
                      className="p-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 transition-colors"
                      title="Elimina partita"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* RESULT AND SCORERS INPUT MODAL */}
      {isResultModalOpen && selectedMatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h4 className="font-sans font-black text-base text-zinc-900 dark:text-zinc-50">
                  Inserisci Risultato
                </h4>
                <p className="text-[11px] font-mono font-medium text-zinc-400 mt-0.5">
                  {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                </p>
              </div>
              <button 
                onClick={() => setIsResultModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Score Inputs */}
            <div className="flex justify-around items-center bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              {/* Home Goals */}
              <div className="flex flex-col items-center space-y-2">
                <span className="font-sans font-bold text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]">
                  {selectedMatch.homeTeam}
                </span>
                <input
                  type="number"
                  min="0"
                  value={homeGoals}
                  onChange={(e) => setHomeGoals(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 text-center font-mono font-black text-xl text-zinc-800 dark:text-zinc-100 outline-none"
                />
              </div>

              <div className="font-sans font-black text-lg text-zinc-300">-</div>

              {/* Away Goals */}
              <div className="flex flex-col items-center space-y-2">
                <span className="font-sans font-bold text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]">
                  {selectedMatch.awayTeam}
                </span>
                <input
                  type="number"
                  min="0"
                  value={awayGoals}
                  onChange={(e) => setAwayGoals(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 text-center font-mono font-black text-xl text-zinc-800 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            {/* Scorers Sub-section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <h5 className="font-sans font-extrabold text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Marcatori Partita
                </h5>
                <span className="text-[10px] font-mono font-bold text-zinc-400">
                  Somma gol: {matchScorers.reduce((acc, s) => acc + s.goals, 0)} / {homeGoals + awayGoals}
                </span>
              </div>

              {/* Add Scorer Row Form */}
              <div className="bg-zinc-50 dark:bg-zinc-950/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs font-semibold">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Nome giocatore"
                    value={newScorerName}
                    onChange={(e) => setNewScorerName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 outline-none"
                  />
                </div>
                
                <div className="sm:col-span-4">
                  <select
                    value={newScorerTeam}
                    onChange={(e) => setNewScorerTeam(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 outline-none"
                  >
                    <option value={selectedMatch.homeTeam}>{selectedMatch.homeTeam}</option>
                    <option value={selectedMatch.awayTeam}>{selectedMatch.awayTeam}</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="number"
                    min="1"
                    value={newScorerGoals}
                    onChange={(e) => setNewScorerGoals(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-center font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddMatchScorer}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg font-bold transition-colors flex items-center justify-center"
                  >
                    <UserPlus size={16} />
                  </button>
                </div>
              </div>

              {/* Added Match Scorers List */}
              <div className="space-y-2">
                {matchScorers.map((scorer, idx) => (
                  <div 
                    key={idx}
                    className="flex justify-between items-center p-2.5 bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800 rounded-lg text-xs"
                  >
                    <div className="font-sans font-bold text-zinc-800 dark:text-zinc-200">
                      {scorer.player} <span className="font-normal text-zinc-400">({scorer.team})</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {scorer.goals} Gol
                      </span>
                      <button
                        onClick={() => handleRemoveMatchScorer(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Actions */}
            <div className="flex justify-end space-x-2 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <button
                type="button"
                onClick={() => setIsResultModalOpen(false)}
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold px-4 py-2.5 rounded-xl text-xs"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleSaveMatchResult}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-600/10"
              >
                <Check size={14} />
                <span>Salva Risultato</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
