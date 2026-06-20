import AsyncStorage from '@react-native-async-storage/async-storage';
import { Run, LifetimeStats, GameOutcome, Stats } from '../types';

const KEYS = {
  currentRun: 'sos:current_run',
  completedRuns: 'sos:completed_runs',
  lifetimeStats: 'sos:lifetime_stats',
  unlockedEvents: 'sos:unlocked_events',
} as const;

export async function saveCurrentRun(run: Run): Promise<void> {
  await AsyncStorage.setItem(KEYS.currentRun, JSON.stringify(run));
}

export async function loadCurrentRun(): Promise<Run | null> {
  const raw = await AsyncStorage.getItem(KEYS.currentRun);
  return raw ? JSON.parse(raw) : null;
}

export async function clearCurrentRun(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.currentRun);
}

export async function completeRun(run: Run): Promise<void> {
  const [rawCompleted, rawLifetime] = await Promise.all([
    AsyncStorage.getItem(KEYS.completedRuns),
    AsyncStorage.getItem(KEYS.lifetimeStats),
  ]);

  const completed: Run[] = rawCompleted ? JSON.parse(rawCompleted) : [];
  completed.unshift(run);
  if (completed.length > 50) completed.pop();

  const lifetime: LifetimeStats = rawLifetime
    ? JSON.parse(rawLifetime)
    : { totalRuns: 0, totalSurvivals: 0, deathsByOutcome: {}, bestScore: 0 };

  lifetime.totalRuns += 1;
  if (run.outcome === 'survived') lifetime.totalSurvivals += 1;
  if (run.outcome && run.outcome !== 'survived') {
    lifetime.deathsByOutcome[run.outcome] = (lifetime.deathsByOutcome[run.outcome] ?? 0) + 1;
  }
  if ((run.score ?? 0) > lifetime.bestScore) {
    lifetime.bestScore = run.score ?? 0;
  }

  await Promise.all([
    AsyncStorage.setItem(KEYS.completedRuns, JSON.stringify(completed)),
    AsyncStorage.setItem(KEYS.lifetimeStats, JSON.stringify(lifetime)),
    AsyncStorage.removeItem(KEYS.currentRun),
  ]);
}

export async function loadLifetimeStats(): Promise<LifetimeStats> {
  const raw = await AsyncStorage.getItem(KEYS.lifetimeStats);
  return raw
    ? JSON.parse(raw)
    : { totalRuns: 0, totalSurvivals: 0, deathsByOutcome: {}, bestScore: 0 };
}

export async function loadCompletedRuns(): Promise<Run[]> {
  const raw = await AsyncStorage.getItem(KEYS.completedRuns);
  return raw ? JSON.parse(raw) : [];
}

// ─── Game logic helpers ────────────────────────────────────

export const EVENTS_PER_WEEK = 5;
export const TOTAL_WEEKS = 4;

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function applyEffects(stats: Stats, effects: Partial<Stats>): Stats {
  return {
    stress: clampStat(stats.stress + (effects.stress ?? 0)),
    money: clampStat(stats.money + (effects.money ?? 0)),
    energy: clampStat(stats.energy + (effects.energy ?? 0)),
    skill: clampStat(stats.skill + (effects.skill ?? 0)),
  };
}

export function checkGameOver(stats: Stats): GameOutcome | null {
  if (stats.stress >= 100) return 'burnout';
  if (stats.money <= 0) return 'fired';
  if (stats.energy <= 0) return 'quit';
  return null;
}

export function calculateScore(run: Run): number {
  const { stress, money, energy, skill } = run.stats;
  return Math.round(
    run.week * 100 + skill - stress + money * 0.5 + energy * 0.3
  );
}
