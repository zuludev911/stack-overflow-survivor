import AsyncStorage from '@react-native-async-storage/async-storage';
import { Run } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';

const KEY = 'sos:unlocked_achievements';

export async function loadUnlockedAchievements(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function checkAndUnlockAchievements(
  run: Run,
  allRuns: Run[]
): Promise<string[]> {
  const already = await loadUnlockedAchievements();
  const newlyUnlocked: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (already.includes(achievement.id)) continue;
    if (achievement.check(run, allRuns)) {
      newlyUnlocked.push(achievement.id);
    }
  }

  if (newlyUnlocked.length > 0) {
    const updated = [...already, ...newlyUnlocked];
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  }

  return newlyUnlocked;
}
