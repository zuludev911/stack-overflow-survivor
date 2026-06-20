import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadLifetimeStats, loadCurrentRun } from '../src/store/gameStore';
import { LifetimeStats } from '../src/types';

export default function HomeScreen() {
  const [stats, setStats] = useState<LifetimeStats | null>(null);
  const [hasActiveRun, setHasActiveRun] = useState(false);

  useEffect(() => {
    (async () => {
      const [lifetime, current] = await Promise.all([
        loadLifetimeStats(),
        loadCurrentRun(),
      ]);
      setStats(lifetime);
      setHasActiveRun(current !== null);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.emoji}>💀</Text>
        <Text style={styles.title}>Stack Overflow{'\n'}Survivor</Text>
        <Text style={styles.subtitle}>¿Puedes sobrevivir un mes como developer?</Text>

        {stats && stats.totalRuns > 0 && (
          <View style={styles.statsBox}>
            <StatRow label="Partidas jugadas" value={String(stats.totalRuns)} />
            <StatRow label="Veces sobrevivido" value={String(stats.totalSurvivals)} />
            <StatRow label="Mejor score" value={String(stats.bestScore)} />
            {stats.deathsByOutcome.burnout && (
              <StatRow label="Muertes por burnout" value={String(stats.deathsByOutcome.burnout)} color="#e53935" />
            )}
          </View>
        )}

        {hasActiveRun && (
          <Pressable
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => router.push('/game')}
          >
            <Text style={styles.btnSecondaryText}>▶ Continuar partida</Text>
          </Pressable>
        )}

        <Pressable style={styles.btn} onPress={() => router.push('/role-select')}>
          <Text style={styles.btnText}>
            {hasActiveRun ? 'Nueva partida' : 'Empezar a sufrir'}
          </Text>
        </Pressable>

        <View style={styles.secondaryBtns}>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push('/history')}>
            <Text style={styles.secondaryBtnText}>📋 Historial</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push('/achievements')}>
            <Text style={styles.secondaryBtnText}>🏅 Logros</Text>
          </Pressable>
        </View>

        <Text style={styles.hint}>Basado en eventos reales de desarrolladores reales.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  container: { alignItems: 'center', padding: 24, paddingTop: 48 },
  emoji: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 38 },
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 10, marginBottom: 32 },
  statsBox: {
    width: '100%', backgroundColor: '#1a1a2e', borderRadius: 16,
    padding: 16, marginBottom: 24, gap: 8,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 13, color: '#aaa' },
  statValue: { fontSize: 13, fontWeight: '700', color: '#fff' },
  btn: {
    width: '100%', backgroundColor: '#e53935', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  btnSecondary: { backgroundColor: '#1e2a3a' },
  btnSecondaryText: { fontSize: 16, fontWeight: '700', color: '#5bc4ff' },
  secondaryBtns: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 4 },
  secondaryBtn: {
    flex: 1, backgroundColor: '#1a1a2e', borderRadius: 12,
    paddingVertical: 12, alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 13, fontWeight: '600', color: '#888' },
  hint: { fontSize: 11, color: '#444', marginTop: 24, textAlign: 'center' },
});
