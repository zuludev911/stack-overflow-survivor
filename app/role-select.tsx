import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROLES } from '../src/data/roles';
import { Role, Run } from '../src/types';
import { saveCurrentRun, clearCurrentRun } from '../src/store/gameStore';

export default function RoleSelectScreen() {
  const [selected, setSelected] = useState<Role | null>(null);

  async function startGame() {
    if (!selected) return;
    const role = ROLES.find((r) => r.id === selected)!;
    const run: Run = {
      id: Date.now().toString(),
      role: selected,
      week: 1,
      eventIndex: 0,
      stats: { ...role.initialStats },
      eventHistory: [],
      createdAt: Date.now(),
    };
    await clearCurrentRun();
    await saveCurrentRun(run);
    router.replace('/game');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Volver</Text>
        </Pressable>

        <Text style={styles.title}>Elige tu rol</Text>
        <Text style={styles.subtitle}>Cada rol tiene sus propios problemas. Escoge bien.</Text>

        {ROLES.map((role) => (
          <Pressable
            key={role.id}
            style={[styles.card, selected === role.id && styles.cardSelected]}
            onPress={() => setSelected(role.id)}
          >
            <Text style={styles.roleEmoji}>{role.emoji}</Text>
            <View style={styles.roleInfo}>
              <Text style={styles.roleLabel}>{role.label}</Text>
              <Text style={styles.roleDesc}>{role.description}</Text>
              {selected === role.id && (
                <View style={styles.initialStats}>
                  <StatPill label="😰" value={role.initialStats.stress} danger />
                  <StatPill label="💵" value={role.initialStats.money} />
                  <StatPill label="⚡" value={role.initialStats.energy} />
                  <StatPill label="🧠" value={role.initialStats.skill} />
                </View>
              )}
            </View>
          </Pressable>
        ))}

        <Pressable
          style={[styles.startBtn, !selected && styles.startBtnDisabled]}
          onPress={startGame}
          disabled={!selected}
        >
          <Text style={styles.startBtnText}>
            {selected ? `Empezar como ${ROLES.find((r) => r.id === selected)?.label}` : 'Selecciona un rol'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatPill({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={[styles.pillValue, danger && value > 50 ? { color: '#e53935' } : null]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  container: { padding: 20, paddingTop: 8 },
  back: { marginBottom: 20 },
  backText: { color: '#5bc4ff', fontSize: 14 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: '#1a1a2e', borderRadius: 14, padding: 16,
    marginBottom: 10, borderWidth: 2, borderColor: 'transparent',
  },
  cardSelected: { borderColor: '#e53935' },
  roleEmoji: { fontSize: 32, marginTop: 2 },
  roleInfo: { flex: 1 },
  roleLabel: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
  roleDesc: { fontSize: 12, color: '#888', lineHeight: 18 },
  initialStats: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row', gap: 4, backgroundColor: '#0f0f1a',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, alignItems: 'center',
  },
  pillLabel: { fontSize: 13 },
  pillValue: { fontSize: 12, fontWeight: '700', color: '#fff' },
  startBtn: {
    backgroundColor: '#e53935', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  startBtnDisabled: { backgroundColor: '#2a2a3a' },
  startBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
