export type Stats = {
  stress: number;  // 0–100. Game Over si llega a 100
  money: number;   // 0–100. Game Over si llega a 0
  energy: number;  // 0–100
  skill: number;   // 0–100
};

export type Role = 'frontend' | 'backend' | 'pm' | 'designer' | 'fullstack';

export type RoleConfig = {
  id: Role;
  label: string;
  emoji: string;
  description: string;
  initialStats: Stats;
  eventWeights: Partial<Record<EventCategory, number>>;
};

export type EventCategory =
  | 'crisis'
  | 'client'
  | 'technical'
  | 'social'
  | 'career'
  | 'random'
  | 'existential';

export type StatDelta = Partial<Record<keyof Stats, number>>;

export type Choice = {
  id: string;
  text: string;
  effects: StatDelta;
  requiresMinStat?: Partial<Record<keyof Stats, number>>;
  followUpText?: string;
};

export type GameEvent = {
  id: string;
  category: EventCategory;
  title: string;
  body: string;
  choices: [Choice, Choice, Choice];
  weight: number;
  weekMin?: number;
};

export type GameOutcome =
  | 'survived'
  | 'burnout'
  | 'fired'
  | 'quit'
  | 'replaced_by_ai';

export type Run = {
  id: string;
  role: Role;
  week: number;
  eventIndex: number;
  stats: Stats;
  eventHistory: string[];
  outcome?: GameOutcome;
  score?: number;
  createdAt: number;
};

export type LifetimeStats = {
  totalRuns: number;
  totalSurvivals: number;
  deathsByOutcome: Partial<Record<GameOutcome, number>>;
  bestScore: number;
};
