import { View, Text, StyleSheet } from 'react-native';
import { Stats } from '../types';

type Props = { stats: Stats; week: number };

export default function StatsBar({ stats, week }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.week}>Semana {week} / 4</Text>
      <View style={styles.row}>
        <StatItem emoji="😰" value={stats.stress} danger highIsBad />
        <StatItem emoji="💵" value={stats.money} danger={stats.money < 25} />
        <StatItem emoji="⚡" value={stats.energy} danger={stats.energy < 20} />
        <StatItem emoji="🧠" value={stats.skill} />
      </View>
    </View>
  );
}

function StatItem({
  emoji, value, danger, highIsBad,
}: {
  emoji: string; value: number; danger?: boolean; highIsBad?: boolean;
}) {
  const bad = highIsBad ? value > 70 : danger;
  const barColor = bad ? '#e53935' : value > 50 ? '#43a047' : '#fb8c00';

  return (
    <View style={styles.stat}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${value}%` as any, backgroundColor: barColor }]} />
      </View>
      <Text style={[styles.val, bad && styles.valDanger]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1a1a2e', padding: 14, borderRadius: 14, marginBottom: 14 },
  week: { fontSize: 11, color: '#888', textAlign: 'center', marginBottom: 10, fontWeight: '600', letterSpacing: 1 },
  row: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  emoji: { fontSize: 16 },
  barBg: { width: '100%', height: 4, backgroundColor: '#2a2a3a', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  val: { fontSize: 11, fontWeight: '700', color: '#aaa' },
  valDanger: { color: '#e53935' },
});
