import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ACHIEVEMENTS } from '../src/data/achievements';
import { loadUnlockedAchievements } from '../src/store/achievementStore';

export default function AchievementsScreen() {
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    loadUnlockedAchievements().then(setUnlocked);
  }, []);

  const unlockedCount = unlocked.length;
  const total = ACHIEVEMENTS.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Volver</Text>
        </Pressable>

        <Text style={styles.title}>Logros</Text>
        <Text style={styles.progress}>{unlockedCount} / {total} desbloqueados</Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(unlockedCount / total) * 100}%` as any }]} />
        </View>

        <View style={styles.grid}>
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlocked.includes(achievement.id);
            return (
              <View
                key={achievement.id}
                style={[styles.card, !isUnlocked && styles.cardLocked]}
              >
                <Text style={[styles.emoji, !isUnlocked && styles.emojiLocked]}>
                  {isUnlocked ? achievement.emoji : '🔒'}
                </Text>
                <Text style={[styles.achTitle, !isUnlocked && styles.textLocked]}>
                  {isUnlocked ? achievement.title : '???'}
                </Text>
                <Text style={[styles.achDesc, !isUnlocked && styles.textLocked]}>
                  {isUnlocked ? achievement.description : 'Sigue jugando para descubrirlo'}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  container: { padding: 20, paddingTop: 8, paddingBottom: 40 },
  back: { marginBottom: 20 },
  backText: { color: '#5bc4ff', fontSize: 14 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 4 },
  progress: { fontSize: 13, color: '#888', marginBottom: 12 },
  progressBar: { height: 4, backgroundColor: '#2a2a3a', borderRadius: 2, marginBottom: 24, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#e53935', borderRadius: 2 },
  grid: { gap: 10 },
  card: {
    backgroundColor: '#1a1a2e', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
  },
  cardLocked: { opacity: 0.45 },
  emoji: { fontSize: 28, marginTop: 2 },
  emojiLocked: { opacity: 0.5 },
  achTitle: { fontSize: 14, fontWeight: '700', color: '#fff', flex: 1, marginBottom: 3 },
  achDesc: { fontSize: 12, color: '#888', lineHeight: 17, flexShrink: 1 },
  textLocked: { color: '#555' },
});
