import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, StyleSheet, ScrollView, Share, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameOutcome } from '../src/types';
import { loadCompletedRuns } from '../src/store/gameStore';
import { checkAndUnlockAchievements } from '../src/store/achievementStore';
import { ACHIEVEMENTS } from '../src/data/achievements';

const OUTCOME_DATA: Record<GameOutcome, { emoji: string; title: string; message: string }> = {
  survived: {
    emoji: '🏆',
    title: '¡Sobreviviste!',
    message: 'Un mes completo como developer. Tu familia sigue sin entender lo que haces.',
  },
  burnout: {
    emoji: '🔥',
    title: 'Burnout total',
    message: 'El estrés te venció. Tu última acción fue mandar un mensaje de "renuncio" a las 2am.',
  },
  fired: {
    emoji: '💸',
    title: 'Sin dinero',
    message: 'Te quedaste sin sueldo. El cliente nunca pagó la última factura.',
  },
  quit: {
    emoji: '😴',
    title: 'Renunciaste',
    message: 'La energía llegó a cero. Ahora vendes artesanías en Instagram.',
  },
  replaced_by_ai: {
    emoji: '🤖',
    title: 'Te reemplazó la IA',
    message: 'ChatGPT hace tu trabajo por $20/mes. El CEO está muy contento.',
  },
};

export default function ResultScreen() {
  const { outcome, score } = useLocalSearchParams<{ outcome: GameOutcome; score: string }>();
  const data = OUTCOME_DATA[outcome] ?? OUTCOME_DATA.burnout;
  const scoreNum = parseInt(score ?? '0', 10);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    loadCompletedRuns().then(async (allRuns) => {
      const latestRun = allRuns[0];
      if (!latestRun) return;
      const unlocked = await checkAndUnlockAchievements(latestRun, allRuns);
      if (unlocked.length > 0) setNewAchievements(unlocked);
    });
  }, []);

  async function shareResult() {
    await Share.share({
      message: `${data.emoji} ${data.title}\nScore: ${scoreNum} pts\n\n"${data.message}"\n\n#StackOverflowSurvivor`,
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', width: '100%' }}>
          <Text style={styles.emoji}>{data.emoji}</Text>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.message}>{data.message}</Text>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>SCORE FINAL</Text>
            <Text style={styles.score}>{scoreNum}</Text>
          </View>

          {newAchievements.length > 0 && (
            <View style={styles.achievementsBox}>
              <Text style={styles.achievementsTitle}>🎉 Logros desbloqueados</Text>
              {newAchievements.map((id) => {
                const ach = ACHIEVEMENTS.find((a) => a.id === id);
                if (!ach) return null;
                return (
                  <View key={id} style={styles.achievementRow}>
                    <Text style={styles.achEmoji}>{ach.emoji}</Text>
                    <View>
                      <Text style={styles.achTitle}>{ach.title}</Text>
                      <Text style={styles.achDesc}>{ach.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <Pressable style={styles.shareBtn} onPress={shareResult}>
            <Text style={styles.shareBtnText}>📤 Compartir resultado</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={() => router.replace('/role-select')}>
            <Text style={styles.btnText}>Intentar de nuevo</Text>
          </Pressable>

          <View style={styles.bottomLinks}>
            <Pressable onPress={() => router.push('/history')}>
              <Text style={styles.linkText}>📋 Historial</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/achievements')}>
              <Text style={styles.linkText}>🏅 Logros</Text>
            </Pressable>
          </View>

          <Pressable style={styles.btnGhost} onPress={() => router.replace('/')}>
            <Text style={styles.btnGhostText}>Ir al inicio</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  container: { alignItems: 'center', padding: 24, paddingTop: 60 },
  emoji: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  message: { fontSize: 14, color: '#aaa', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  scoreBox: {
    backgroundColor: '#1a1a2e', borderRadius: 16, padding: 24,
    alignItems: 'center', width: '100%', marginBottom: 20,
  },
  scoreLabel: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 2, marginBottom: 8 },
  score: { fontSize: 56, fontWeight: '900', color: '#fff' },
  achievementsBox: {
    width: '100%', backgroundColor: '#1a2a1a', borderRadius: 14,
    padding: 16, marginBottom: 20, gap: 12,
  },
  achievementsTitle: { fontSize: 13, fontWeight: '700', color: '#66bb6a', marginBottom: 4 },
  achievementRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  achEmoji: { fontSize: 24 },
  achTitle: { fontSize: 13, fontWeight: '700', color: '#fff' },
  achDesc: { fontSize: 11, color: '#888', marginTop: 2 },
  shareBtn: {
    width: '100%', backgroundColor: '#1e3a2e', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginBottom: 10,
  },
  shareBtnText: { fontSize: 15, fontWeight: '700', color: '#66bb6a' },
  btn: {
    width: '100%', backgroundColor: '#e53935', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 16,
  },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  bottomLinks: { flexDirection: 'row', gap: 24, marginBottom: 12 },
  linkText: { fontSize: 13, color: '#5bc4ff', fontWeight: '600' },
  btnGhost: { paddingVertical: 12 },
  btnGhostText: { fontSize: 14, color: '#555' },
});
