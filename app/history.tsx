import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadCompletedRuns } from '../src/store/gameStore';
import { Run, GameOutcome } from '../src/types';
import { ROLES } from '../src/data/roles';

const OUTCOME_LABEL: Record<GameOutcome, { emoji: string; label: string; color: string }> = {
  survived:       { emoji: '🏆', label: 'Sobrevivió', color: '#43a047' },
  burnout:        { emoji: '🔥', label: 'Burnout',    color: '#e53935' },
  fired:          { emoji: '💸', label: 'Sin dinero', color: '#fb8c00' },
  quit:           { emoji: '😴', label: 'Renunció',   color: '#5bc4ff' },
  replaced_by_ai: { emoji: '🤖', label: 'Reemplazado', color: '#ab47bc' },
};

export default function HistoryScreen() {
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    loadCompletedRuns().then(setRuns);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Volver</Text>
        </Pressable>
        <Text style={styles.title}>Historial</Text>

        {runs.length === 0 && (
          <Text style={styles.empty}>Aún no hay partidas completadas.</Text>
        )}

        {runs.map((run, i) => {
          const outcome = run.outcome ? OUTCOME_LABEL[run.outcome] : null;
          const role = ROLES.find((r) => r.id === run.role);
          const date = new Date(run.createdAt).toLocaleDateString('es', {
            day: '2-digit', month: 'short',
          });

          return (
            <View key={run.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.cardNum}>#{runs.length - i}</Text>
                <Text style={styles.cardDate}>{date}</Text>
              </View>
              <View style={styles.cardMiddle}>
                <Text style={styles.roleEmoji}>{role?.emoji}</Text>
                <View style={styles.cardInfo}>
                  <Text style={styles.roleName}>{role?.label}</Text>
                  {outcome && (
                    <Text style={[styles.outcome, { color: outcome.color }]}>
                      {outcome.emoji} {outcome.label}
                    </Text>
                  )}
                </View>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>SCORE</Text>
                  <Text style={styles.scoreVal}>{run.score ?? 0}</Text>
                </View>
              </View>
              <View style={styles.statsRow}>
                <MiniStat emoji="😰" val={run.stats.stress} />
                <MiniStat emoji="💵" val={run.stats.money} />
                <MiniStat emoji="⚡" val={run.stats.energy} />
                <MiniStat emoji="🧠" val={run.stats.skill} />
                <Text style={styles.weekBadge}>Sem. {run.week}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({ emoji, val }: { emoji: string; val: number }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniEmoji}>{emoji}</Text>
      <Text style={styles.miniVal}>{val}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  container: { padding: 20, paddingTop: 8 },
  back: { marginBottom: 20 },
  backText: { color: '#5bc4ff', fontSize: 14 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 20 },
  empty: { color: '#555', textAlign: 'center', marginTop: 60, fontSize: 14 },
  card: { backgroundColor: '#1a1a2e', borderRadius: 14, padding: 16, marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardNum: { fontSize: 11, color: '#555', fontWeight: '700' },
  cardDate: { fontSize: 11, color: '#555' },
  cardMiddle: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  roleEmoji: { fontSize: 28 },
  cardInfo: { flex: 1 },
  roleName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  outcome: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  scoreBox: { alignItems: 'flex-end' },
  scoreLabel: { fontSize: 9, color: '#555', letterSpacing: 1 },
  scoreVal: { fontSize: 22, fontWeight: '800', color: '#fff' },
  statsRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  miniStat: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  miniEmoji: { fontSize: 11 },
  miniVal: { fontSize: 11, color: '#888', fontWeight: '600' },
  weekBadge: { marginLeft: 'auto', fontSize: 10, color: '#555', fontWeight: '700' },
});
