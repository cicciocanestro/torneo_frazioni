import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  setDoc,
  query, 
  where,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../services/firebase';
import { Team, Match, Scorer, Setting, OperationType } from '../types';
import { DEFAULT_TEAMS_2026, DEFAULT_MATCHES_2026 } from '../utils/seedData';

interface FirebaseContextType {
  teams: Team[];
  matches: Match[];
  scorers: Scorer[];
  settings: Setting | null;
  activeEdition: number;
  availableEditions: number[];
  loading: boolean;
  offline: boolean;
  changeEdition: (edition: number) => void;
  createNewEdition: (edition: number, tournamentName: string) => Promise<void>;
  
  // Admin Operations
  addTeam: (team: Omit<Team, 'id'>) => Promise<void>;
  updateTeam: (id: string, team: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  
  addMatch: (match: Omit<Match, 'id'>) => Promise<void>;
  updateMatch: (id: string, match: Partial<Match>) => Promise<void>;
  deleteMatch: (id: string) => Promise<void>;
  
  addScorer: (scorer: Omit<Scorer, 'id'>) => Promise<void>;
  updateScorer: (id: string, scorer: Partial<Scorer>) => Promise<void>;
  deleteScorer: (id: string) => Promise<void>;
  
  updateSettings: (settings: Partial<Setting>) => Promise<void>;
  reseedEdition: (edition: number) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [settings, setSettings] = useState<Setting | null>(null);
  const [activeEdition, setActiveEdition] = useState<number>(2026);
  const [availableEditions, setAvailableEditions] = useState<number[]>([2026]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 1. Load active edition and all editions from settings
  useEffect(() => {
    const q = collection(db, 'settings');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const settingsList: Setting[] = [];
      snapshot.forEach((doc) => {
        settingsList.push({ id: doc.id, ...doc.data() } as Setting);
      });

      if (settingsList.length > 0) {
        // Find current active edition settings, otherwise use the first one
        const activeSetting = settingsList[0];
        setSettings(activeSetting);
        setActiveEdition(activeSetting.edition);
        
        // Collect all distinct editions present in settings
        const editions = Array.from(new Set(settingsList.map(s => s.edition))).sort((a, b) => b - a);
        setAvailableEditions(editions);
      } else {
        // Auto-seed settings if empty
        const defaultSettingRef = doc(db, 'settings', 'default_config');
        setDoc(defaultSettingRef, {
          edition: 2026,
          tournamentName: 'Torneo Frazioni Castiglion Fiorentino',
          logo: ''
        }).catch(err => {
          console.error('Error auto-seeding settings:', err);
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'settings');
    });

    return () => unsubscribe();
  }, []);

  // 2. Seeding default 2026 teams and matches if none exist
  useEffect(() => {
    if (!activeEdition) return;

    const checkAndSeed = async () => {
      try {
        const teamsQuery = query(collection(db, 'teams'), where('edition', '==', activeEdition));
        const teamsSnapshot = await getDocs(teamsQuery);

        if (teamsSnapshot.empty && activeEdition === 2026) {
          console.log('Seeding default 2026 teams and matches...');
          setLoading(true);

          // Seed teams
          const batch = writeBatch(db);
          const teamIdsMap: { [key: string]: string } = {};

          DEFAULT_TEAMS_2026.forEach((team) => {
            const teamRef = doc(collection(db, 'teams'));
            batch.set(teamRef, team);
            teamIdsMap[team.name] = teamRef.id;
          });

          // Seed matches
          DEFAULT_MATCHES_2026.forEach((match) => {
            const matchRef = doc(collection(db, 'matches'));
            batch.set(matchRef, match);
          });

          await batch.commit();
          console.log('Seeding 2026 completed successfully.');
        }
      } catch (err) {
        console.error('Error during seeding:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAndSeed();
  }, [activeEdition]);

  // 3. Sync Teams, Matches and Scorers in Real-Time for the active edition
  useEffect(() => {
    if (!activeEdition) return;

    setLoading(true);

    const teamsQuery = query(collection(db, 'teams'), where('edition', '==', activeEdition));
    const unsubscribeTeams = onSnapshot(teamsQuery, (snapshot) => {
      const loadedTeams: Team[] = [];
      snapshot.forEach((doc) => {
        loadedTeams.push({ id: doc.id, ...doc.data() } as Team);
      });
      setTeams(loadedTeams);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'teams');
    });

    const matchesQuery = query(collection(db, 'matches'), where('edition', '==', activeEdition));
    const unsubscribeMatches = onSnapshot(matchesQuery, (snapshot) => {
      const loadedMatches: Match[] = [];
      snapshot.forEach((doc) => {
        loadedMatches.push({ id: doc.id, ...doc.data() } as Match);
      });
      // Sort matches chronologically by date and time
      loadedMatches.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
      setMatches(loadedMatches);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'matches');
    });

    const scorersQuery = query(collection(db, 'scorers'), where('edition', '==', activeEdition));
    const unsubscribeScorers = onSnapshot(scorersQuery, (snapshot) => {
      const loadedScorers: Scorer[] = [];
      snapshot.forEach((doc) => {
        loadedScorers.push({ id: doc.id, ...doc.data() } as Scorer);
      });
      // Sort scorers by goals descending, then alphabetically by name
      loadedScorers.sort((a, b) => {
        if (b.goals !== a.goals) return b.goals - a.goals;
        return a.player.localeCompare(b.player);
      });
      setScorers(loadedScorers);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'scorers');
    });

    return () => {
      unsubscribeTeams();
      unsubscribeMatches();
      unsubscribeScorers();
    };
  }, [activeEdition]);

  // Actions & Operations
  const changeEdition = (edition: number) => {
    setActiveEdition(edition);
  };

  const createNewEdition = async (edition: number, tournamentName: string) => {
    try {
      const editionId = `config_${edition}`;
      const docRef = doc(db, 'settings', editionId);
      await setDoc(docRef, {
        edition,
        tournamentName,
        logo: ''
      });
      setActiveEdition(edition);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `settings/config_${edition}`);
    }
  };

  // 1. Teams Operations
  const addTeam = async (team: Omit<Team, 'id'>) => {
    try {
      await addDoc(collection(db, 'teams'), team);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'teams');
    }
  };

  const updateTeam = async (id: string, team: Partial<Team>) => {
    try {
      const docRef = doc(db, 'teams', id);
      await updateDoc(docRef, team);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `teams/${id}`);
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const docRef = doc(db, 'teams', id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `teams/${id}`);
    }
  };

  // 2. Matches Operations
  const addMatch = async (match: Omit<Match, 'id'>) => {
    try {
      await addDoc(collection(db, 'matches'), match);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'matches');
    }
  };

  const updateMatch = async (id: string, match: Partial<Match>) => {
    try {
      const docRef = doc(db, 'matches', id);
      await updateDoc(docRef, match);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `matches/${id}`);
    }
  };

  const deleteMatch = async (id: string) => {
    try {
      const docRef = doc(db, 'matches', id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `matches/${id}`);
    }
  };

  // 3. Scorers Operations
  const addScorer = async (scorer: Omit<Scorer, 'id'>) => {
    try {
      await addDoc(collection(db, 'scorers'), scorer);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'scorers');
    }
  };

  const updateScorer = async (id: string, scorer: Partial<Scorer>) => {
    try {
      const docRef = doc(db, 'scorers', id);
      await updateDoc(docRef, scorer);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `scorers/${id}`);
    }
  };

  const deleteScorer = async (id: string) => {
    try {
      const docRef = doc(db, 'scorers', id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `scorers/${id}`);
    }
  };

  // 4. Update Settings
  const updateSettings = async (updatedSettings: Partial<Setting>) => {
    try {
      if (!settings?.id) return;
      const docRef = doc(db, 'settings', settings.id);
      await updateDoc(docRef, updatedSettings);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `settings/${settings?.id}`);
    }
  };

  // Helper to re-seed an edition completely (for Admin debugging or reset)
  const reseedEdition = async (edition: number) => {
    try {
      setLoading(true);
      
      // Delete existing matches & teams for this edition
      const teamsQuery = query(collection(db, 'teams'), where('edition', '==', edition));
      const teamsSnap = await getDocs(teamsQuery);
      const matchesQuery = query(collection(db, 'matches'), where('edition', '==', edition));
      const matchesSnap = await getDocs(matchesQuery);
      const scorersQuery = query(collection(db, 'scorers'), where('edition', '==', edition));
      const scorersSnap = await getDocs(scorersQuery);

      const batch = writeBatch(db);
      teamsSnap.forEach(t => batch.delete(t.ref));
      matchesSnap.forEach(m => batch.delete(m.ref));
      scorersSnap.forEach(s => batch.delete(s.ref));

      // Seed teams
      DEFAULT_TEAMS_2026.forEach((team) => {
        const teamRef = doc(collection(db, 'teams'));
        batch.set(teamRef, { ...team, edition });
      });

      // Seed matches
      DEFAULT_MATCHES_2026.forEach((match) => {
        const matchRef = doc(collection(db, 'matches'));
        batch.set(matchRef, { ...match, edition });
      });

      await batch.commit();
    } catch (err) {
      console.error('Error reseeding:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FirebaseContext.Provider value={{
      teams,
      matches,
      scorers,
      settings,
      activeEdition,
      availableEditions,
      loading,
      offline,
      changeEdition,
      createNewEdition,
      addTeam,
      updateTeam,
      deleteTeam,
      addMatch,
      updateMatch,
      deleteMatch,
      addScorer,
      updateScorer,
      deleteScorer,
      updateSettings,
      reseedEdition
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
