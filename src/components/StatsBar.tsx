import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Stats } from '../types';

type Props = { stats: Stats; week: number };

export default function StatsBar({ stats, week }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.week}>Semana {week} / 4</Text>
      <View style={styles.row}>
        <StatItem emoji="😰" value={stats.stress} highIsBad />
        <StatItem emoji="💵" value={stats.money} lowIsBad />
        <StatItem emoji="⚡" value={stats.energy} lowIsBad />
        <StatItem emoji="🧠" value={stats.skill} />
      </View>
    </View>
  );
}

function StatItem({
  emoji, value, highIsBad, lowIsBad,
}: {
  emoji: string; value: number; highIsBad?: boolean; lowIsBad?: boolean;
}) {
  const anim = useRef(new Animated.Value(value)).current;
  const flashAnim = useRef(new Animated.Value(1)).current;
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;

    // Flash effect on change
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 0.3, duration: 80, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    // Animated bar width
    Animated.spring(anim, {
      toValue: value,
      tension: 60,
      friction: 8,
      useNativeDriver: false,
    }).start();

    prevValue.current = value;
  }, [value]);

  const isDanger = highIsBad ? value > 70 : lowIsBad ? value < 25 : false;
  const barColor = isDanger
    ? '#e53935'
    : highIsBad
    ? value > 40 ? '#fb8c00' : '#43a047'
    : value < 40 ? '#fb8c00' : '#43a047';

  const barWidth = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.stat, { opacity: flashAnim }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.barBg}>
        <Animated.View
          style={[styles.barFill, { width: barWidth, backgroundColor: barColor }]}
        />
      </View>
      <Text style={[styles.val, isDanger && styles.valDanger]}>{value}</Text>
    </Animated.View>
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
