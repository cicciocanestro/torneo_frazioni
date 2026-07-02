export interface Team {
  id?: string;
  name: string;
  group: 'A' | 'B';
  logo?: string;
  edition: number;
}

export interface MatchScorer {
  player: string;
  team: string;
  goals: number;
}

export interface Match {
  id?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  homeTeam: string;
  awayTeam: string;
  homeGoals: number | null;
  awayGoals: number | null;
  group: 'A' | 'B';
  status: 'scheduled' | 'completed';
  edition: number;
  scorers?: MatchScorer[];
}

export interface Scorer {
  id?: string;
  player: string;
  team: string;
  goals: number;
  edition: number;
}

export interface Setting {
  id?: string;
  edition: number;
  tournamentName: string;
  logo?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}
