import { useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, StyleSheet, ScrollView, Share } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameOutcome } from '../src/types';

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

  async function shareResult() {
    await Share.share({
      message: `${data.emoji} ${data.title}\nScore: ${scoreNum} pts\n\n"${data.message}"\n\n#StackOverflowSurvivor`,
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.emoji}>{data.emoji}</Text>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.message}>{data.message}</Text>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>SCORE FINAL</Text>
          <Text style={styles.score}>{scoreNum}</Text>
        </View>

        <Pressable style={styles.shareBtn} onPress={shareResult}>
          <Text style={styles.shareBtnText}>📤 Compartir resultado</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={() => router.replace('/role-select')}>
          <Text style={styles.btnText}>Intentar de nuevo</Text>
        </Pressable>

        <Pressable style={styles.btnGhost} onPress={() => router.replace('/')}>
          <Text style={styles.btnGhostText}>Ir al inicio</Text>
        </Pressable>
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
    alignItems: 'center', width: '100%', marginBottom: 32,
  },
  scoreLabel: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 2, marginBottom: 8 },
  score: { fontSize: 56, fontWeight: '900', color: '#fff' },
  shareBtn: {
    width: '100%', backgroundColor: '#1e3a2e', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginBottom: 10,
  },
  shareBtnText: { fontSize: 15, fontWeight: '700', color: '#66bb6a' },
  btn: {
    width: '100%', backgroundColor: '#e53935', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 10,
  },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  btnGhost: { paddingVertical: 12 },
  btnGhostText: { fontSize: 14, color: '#888' },
});
