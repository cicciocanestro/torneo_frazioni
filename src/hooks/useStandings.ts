import { useMemo } from 'react';
import { Team, Match } from '../types';

export interface TeamStats {
  teamName: string;
  logo?: string;
  played: number; // G
  won: number; // V
  drawn: number; // N
  lost: number; // P
  goalsFor: number; // GF
  goalsAgainst: number; // GS
  goalsDifference: number; // DR
  points: number; // Pt
}

export function useStandings(teams: Team[], matches: Match[]) {
  const standings = useMemo(() => {
    const initStats = (teamName: string, logo?: string): TeamStats => ({
      teamName,
      logo,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalsDifference: 0,
      points: 0,
    });

    const statsMap: { [teamName: string]: TeamStats } = {};

    // Initialize all teams
    teams.forEach((t) => {
      statsMap[t.name] = initStats(t.name, t.logo);
    });

    // Process all completed matches
    matches.forEach((m) => {
      if (m.status === 'completed' && m.homeGoals !== null && m.awayGoals !== null) {
        const home = statsMap[m.homeTeam] || initStats(m.homeTeam);
        const away = statsMap[m.awayTeam] || initStats(m.awayTeam);

        home.played += 1;
        away.played += 1;

        home.goalsFor += m.homeGoals;
        home.goalsAgainst += m.awayGoals;
        away.goalsFor += m.awayGoals;
        away.goalsAgainst += m.homeGoals;

        if (m.homeGoals > m.awayGoals) {
          home.won += 1;
          home.points += 3;
          away.lost += 1;
        } else if (m.homeGoals < m.awayGoals) {
          away.won += 1;
          away.points += 3;
          home.lost += 1;
        } else {
          home.drawn += 1;
          home.points += 1;
          away.drawn += 1;
          away.points += 1;
        }

        home.goalsDifference = home.goalsFor - home.goalsAgainst;
        away.goalsDifference = away.goalsFor - away.goalsAgainst;

        statsMap[m.homeTeam] = home;
        statsMap[m.awayTeam] = away;
      }
    });

    const list = Object.values(statsMap);

    // Group A and B lists
    const groupA = list.filter(s => {
      const team = teams.find(t => t.name === s.teamName);
      return team?.group === 'A';
    });

    const groupB = list.filter(s => {
      const team = teams.find(t => t.name === s.teamName);
      return team?.group === 'B';
    });

    // Sort function according to requirements:
    // 1. Points (Pt)
    // 2. Goal difference (DR)
    // 3. Goals scored (GF)
    // 4. Alphabetical order
    const sortStandings = (a: TeamStats, b: TeamStats) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalsDifference !== a.goalsDifference) return b.goalsDifference - a.goalsDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.teamName.localeCompare(b.teamName);
    };

    return {
      groupA: groupA.sort(sortStandings),
      groupB: groupB.sort(sortStandings)
    };
  }, [teams, matches]);

  return standings;
}
