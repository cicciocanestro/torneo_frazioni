import { Team, Match } from '../types';

export const DEFAULT_TEAMS_2026: Omit<Team, 'id'>[] = [
  // Girone A
  { name: 'La Nave', group: 'A', edition: 2026, logo: 'shield' },
  { name: 'Noceta', group: 'A', edition: 2026, logo: 'club' },
  { name: 'Boscatello', group: 'A', edition: 2026, logo: 'crown' },
  { name: 'Altavalle', group: 'A', edition: 2026, logo: 'mountain' },
  { name: 'Brolio', group: 'A', edition: 2026, logo: 'sword' },

  // Girone B
  { name: 'Montecchio PMV', group: 'B', edition: 2026, logo: 'castle' },
  { name: 'Castroncello', group: 'B', edition: 2026, logo: 'star' },
  { name: 'Manciano Chiesa', group: 'B', edition: 2026, logo: 'flame' },
  { name: 'Villaggio del Giovane', group: 'B', edition: 2026, logo: 'users' },
  { name: 'Manciano Polisportiva', group: 'B', edition: 2026, logo: 'trophy' }
];

export const DEFAULT_MATCHES_2026: Omit<Match, 'id'>[] = [
  // Girone A - Round 1
  {
    date: '2026-06-15',
    time: '21:00',
    homeTeam: 'La Nave',
    awayTeam: 'Noceta',
    homeGoals: null,
    awayGoals: null,
    group: 'A',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },
  {
    date: '2026-06-15',
    time: '22:15',
    homeTeam: 'Boscatello',
    awayTeam: 'Altavalle',
    homeGoals: null,
    awayGoals: null,
    group: 'A',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },

  // Girone B - Round 1
  {
    date: '2026-06-16',
    time: '21:00',
    homeTeam: 'Montecchio PMV',
    awayTeam: 'Castroncello',
    homeGoals: null,
    awayGoals: null,
    group: 'B',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },
  {
    date: '2026-06-16',
    time: '22:15',
    homeTeam: 'Manciano Chiesa',
    awayTeam: 'Villaggio del Giovane',
    homeGoals: null,
    awayGoals: null,
    group: 'B',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },

  // Girone A - Round 2
  {
    date: '2026-06-18',
    time: '21:00',
    homeTeam: 'Brolio',
    awayTeam: 'La Nave',
    homeGoals: null,
    awayGoals: null,
    group: 'A',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },
  {
    date: '2026-06-18',
    time: '22:15',
    homeTeam: 'Noceta',
    awayTeam: 'Boscatello',
    homeGoals: null,
    awayGoals: null,
    group: 'A',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },

  // Girone B - Round 2
  {
    date: '2026-06-19',
    time: '21:00',
    homeTeam: 'Manciano Polisportiva',
    awayTeam: 'Montecchio PMV',
    homeGoals: null,
    awayGoals: null,
    group: 'B',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },
  {
    date: '2026-06-19',
    time: '22:15',
    homeTeam: 'Castroncello',
    awayTeam: 'Manciano Chiesa',
    homeGoals: null,
    awayGoals: null,
    group: 'B',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },

  // Girone A - Round 3
  {
    date: '2026-06-22',
    time: '21:00',
    homeTeam: 'Altavalle',
    awayTeam: 'Brolio',
    homeGoals: null,
    awayGoals: null,
    group: 'A',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },
  {
    date: '2026-06-22',
    time: '22:15',
    homeTeam: 'La Nave',
    awayTeam: 'Boscatello',
    homeGoals: null,
    awayGoals: null,
    group: 'A',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },

  // Girone B - Round 3
  {
    date: '2026-06-23',
    time: '21:00',
    homeTeam: 'Villaggio del Giovane',
    awayTeam: 'Manciano Polisportiva',
    homeGoals: null,
    awayGoals: null,
    group: 'B',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },
  {
    date: '2026-06-23',
    time: '22:15',
    homeTeam: 'Montecchio PMV',
    awayTeam: 'Manciano Chiesa',
    homeGoals: null,
    awayGoals: null,
    group: 'B',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },

  // Girone A - Round 4
  {
    date: '2026-06-25',
    time: '21:00',
    homeTeam: 'Noceta',
    awayTeam: 'Altavalle',
    homeGoals: null,
    awayGoals: null,
    group: 'A',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },
  {
    date: '2026-06-25',
    time: '22:15',
    homeTeam: 'Boscatello',
    awayTeam: 'Brolio',
    homeGoals: null,
    awayGoals: null,
    group: 'A',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },

  // Girone B - Round 4
  {
    date: '2026-06-26',
    time: '21:00',
    homeTeam: 'Castroncello',
    awayTeam: 'Villaggio del Giovane',
    homeGoals: null,
    awayGoals: null,
    group: 'B',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },
  {
    date: '2026-06-26',
    time: '22:15',
    homeTeam: 'Manciano Chiesa',
    awayTeam: 'Manciano Polisportiva',
    homeGoals: null,
    awayGoals: null,
    group: 'B',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },

  // Girone A - Round 5
  {
    date: '2026-06-29',
    time: '21:00',
    homeTeam: 'Brolio',
    awayTeam: 'Noceta',
    homeGoals: null,
    awayGoals: null,
    group: 'A',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },
  {
    date: '2026-06-29',
    time: '22:15',
    homeTeam: 'Altavalle',
    awayTeam: 'La Nave',
    homeGoals: null,
    awayGoals: null,
    group: 'A',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },

  // Girone B - Round 5
  {
    date: '2026-06-30',
    time: '21:00',
    homeTeam: 'Manciano Polisportiva',
    awayTeam: 'Castroncello',
    homeGoals: null,
    awayGoals: null,
    group: 'B',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  },
  {
    date: '2026-06-30',
    time: '22:15',
    homeTeam: 'Villaggio del Giovane',
    awayTeam: 'Montecchio PMV',
    homeGoals: null,
    awayGoals: null,
    group: 'B',
    status: 'scheduled',
    edition: 2026,
    scorers: []
  }
];
