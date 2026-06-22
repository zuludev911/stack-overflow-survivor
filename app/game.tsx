import { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Animated, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EVENTS } from '../src/data/events';
import { ROLES } from '../src/data/roles';
import {
  loadCurrentRun, saveCurrentRun, completeRun, clearCurrentRun,
  applyEffects, checkGameOver, calculateScore,
  EVENTS_PER_WEEK, TOTAL_WEEKS,
} from '../src/store/gameStore';
import { Run, GameEvent, Choice, StatDelta } from '../src/types';
import StatsBar from '../src/components/StatsBar';
import ScenePanel from '../src/components/ScenePanel';
import { loadGender, loadAccessory } from '../src/store/characterStore';
import { Gender, SpriteAnim, AccessoryId } from '../src/data/sprites';

const CATEGORY_EMOJI: Record<string, string> = {
  crisis: '🔥', client: '👔', technical: '💀',
  social: '📅', career: '🎯', random: '☕', existential: '🤖',
};

const WORK_DURATION = 2000;
const NEXT_DELAY    = 3000;

type Phase = 'idle' | 'working' | 'reacting' | 'next';

export default function GameScreen() {
  const [run, setRun]           = useState<Run | null>(null);
  const [event, setEvent]       = useState<GameEvent | null>(null);
  const [gender, setGender]     = useState<Gender>('boy');
  const [accessory, setAccessory] = useState<AccessoryId | null>(null);
  const [phase, setPhase]       = useState<Phase>('idle');
  const [spriteAnim, setSpriteAnim] = useState<SpriteAnim>('idle');
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(null);

  const workAnim = useRef(new Animated.Value(0)).current;
  const nextAnim = useRef(new Animated.Value(0)).current;
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([]);

  function addTimer(fn: () => void, ms: number) {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }

  // Limpia timers y animaciones al desmontar
  useEffect(() => {
    return () => { timers.current.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    Promise.all([loadCurrentRun(), loadGender(), loadAccessory()]).then(([r, g, acc]) => {
      if (!r) { router.replace('/'); return; }
      setRun(r);
      setEvent(pickEvent(r));
      if (g) setGender(g);
      setAccessory(acc);
    });
  }, []);

  function pickEvent(r: Run): GameEvent {
    const role = ROLES.find((rl) => rl.id === r.role)!;
    let pool = EVENTS.filter(
      (e) => !r.eventHistory.includes(e.id) && (e.weekMin ?? 1) <= r.week
    );
    // Si ya se vieron todos los eventos, reinicia el historial
    if (pool.length === 0) {
      pool = EVENTS.filter((e) => (e.weekMin ?? 1) <= r.week);
    }
    const weights = pool.map((e) => e.weight * (role.eventWeights[e.category] ?? 1));
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
      rand -= weights[i];
      if (rand <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  function isPositiveOutcome(effects: StatDelta): boolean {
    const score =
      (effects.money  ?? 0) * 1.5 +
      (effects.skill  ?? 0) * 1.2 +
      (effects.energy ?? 0) -
      (effects.stress ?? 0) * 1.5;
    return score >= 0;
  }

  function confirmExit() {
    Alert.alert(
      'Salir de la partida',
      '¿Seguro? Tu progreso se guardará y podrás continuar luego.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => { timers.current.forEach(clearTimeout); router.replace('/'); },
        },
        {
          text: 'Nueva partida',
          onPress: async () => {
            timers.current.forEach(clearTimeout);
            await clearCurrentRun();
            router.replace('/role-select');
          },
        },
      ]
    );
  }

  async function handleChoice(choice: Choice) {
    if (!run || !event || chosenId) return;

    const newStats    = applyEffects(run.stats, choice.effects as any);
    const gameOver    = checkGameOver(newStats);
    const positive    = isPositiveOutcome(choice.effects);
    const nextIndex   = run.eventIndex + 1;
    const weekDone    = nextIndex >= EVENTS_PER_WEEK;
    const gameDone    = weekDone && run.week >= TOTAL_WEEKS;
    const updatedRun: Run = {
      ...run,
      stats: newStats,
      eventIndex: weekDone ? 0 : nextIndex,
      week: weekDone ? run.week + 1 : run.week,
      eventHistory: [...run.eventHistory, event.id],
    };

    // ── Fase 1: trabajando ──────────────────────────────────
    setChosenId(choice.id);
    setPhase('working');
    setSpriteAnim('work');
    workAnim.setValue(0);
    Animated.timing(workAnim, {
      toValue: 1, duration: WORK_DURATION, useNativeDriver: false,
    }).start();

    // ── Fase 2: reacción ────────────────────────────────────
    addTimer(() => {
      setSpriteAnim(positive ? 'happy' : 'sad');
      setPhase('reacting');
      setFollowUp(choice.followUpText ?? null);

      // ── Fase 3: siguiente evento ─────────────────────────
      addTimer(async () => {
        setPhase('next');
        nextAnim.setValue(0);
        Animated.timing(nextAnim, {
          toValue: 1, duration: NEXT_DELAY, useNativeDriver: false,
        }).start();

        addTimer(async () => {
          if (gameOver || gameDone) {
            const outcome = gameOver ?? 'survived';
            const score   = calculateScore({ ...updatedRun, outcome });
            await completeRun({ ...updatedRun, outcome, score });
            router.replace({ pathname: '/result', params: { outcome, score: String(score) } });
          } else {
            await saveCurrentRun(updatedRun);
            setRun(updatedRun);
            setEvent(pickEvent(updatedRun));
            setChosenId(null);
            setFollowUp(null);
            setPhase('idle');
            setSpriteAnim('idle');
            workAnim.setValue(0);
            nextAnim.setValue(0);
          }
        }, NEXT_DELAY);

      }, 800); // pausa antes de mostrar "siguiente..."

    }, WORK_DURATION);
  }

  if (!run || !event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}><Text style={styles.loadingText}>Cargando...</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header con stats y botón salir */}
        <View style={styles.header}>
          <View style={styles.headerStats}>
            <StatsBar stats={run.stats} week={run.week} />
          </View>
          <Pressable style={styles.exitBtn} onPress={confirmExit}>
            <Text style={styles.exitText}>✕</Text>
          </Pressable>
        </View>

        {/* Escena con personaje */}
        <ScenePanel
          gender={gender}
          animation={spriteAnim}
          category={event.category}
          accessory={accessory}
        />

        {/* Barra "Trabajando..." */}
        {phase === 'working' && (
          <View style={styles.workingBox}>
            <Text style={styles.workingText}>💻  Trabajando...</Text>
            <View style={styles.workBarBg}>
              <Animated.View style={[styles.workBarFill, {
                width: workAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              }]} />
            </View>
          </View>
        )}

        {/* Carta de evento */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.categoryEmoji}>{CATEGORY_EMOJI[event.category]}</Text>
            <Text style={styles.categoryLabel}>{event.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventBody}>{event.body}</Text>

          {followUp && (
            <View style={styles.followUpBox}>
              <Text style={styles.followUpText}>{followUp}</Text>
              {phase === 'next' && (
                <>
                  <View style={styles.nextBarBg}>
                    <Animated.View style={[styles.nextBarFill, {
                      width: nextAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                    }]} />
                  </View>
                  <Text style={styles.nextLabel}>Siguiente evento...</Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* Opciones — solo en fase idle */}
        {phase === 'idle' && (
          <View style={styles.choices}>
            {event.choices.map((choice, i) => {
              const letters = ['A', 'B', 'C'];
              const blocked =
                choice.requiresMinStat &&
                Object.entries(choice.requiresMinStat).some(
                  ([stat, min]) => run.stats[stat as keyof typeof run.stats] < (min as number)
                );
              return (
                <Pressable
                  key={choice.id}
                  style={[styles.choice, blocked && styles.choiceBlocked]}
                  onPress={() => !blocked && handleChoice(choice)}
                  disabled={!!blocked}
                >
                  <View style={styles.choiceLetter}>
                    <Text style={styles.choiceLetterText}>{letters[i]}</Text>
                  </View>
                  <View style={styles.choiceContent}>
                    <Text style={[styles.choiceText, blocked && styles.choiceTextBlocked]}>
                      {blocked ? '🔒 ' : ''}{choice.text}
                    </Text>
                    <View style={styles.effects}>
                      {Object.entries(choice.effects).map(([stat, delta]) => (
                        <Text
                          key={stat}
                          style={[styles.effect, (delta as number) > 0 ? styles.effectPos : styles.effectNeg]}
                        >
                          {(delta as number) > 0 ? '+' : ''}{delta as number} {stat}
                        </Text>
                      ))}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <Text style={styles.progress}>
          Evento {run.eventIndex + 1} / {EVENTS_PER_WEEK} — Semana {run.week}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  container: { padding: 16, paddingBottom: 32 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#888' },

  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 0 },
  headerStats: { flex: 1 },
  exitBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center',
    marginTop: 0,
  },
  exitText: { fontSize: 14, color: '#666', fontWeight: '700' },

  workingBox: {
    backgroundColor: '#1a1a2e', borderRadius: 12, padding: 14,
    marginBottom: 14, gap: 10,
  },
  workingText: { fontSize: 13, fontWeight: '700', color: '#5bc4ff', textAlign: 'center' },
  workBarBg: { height: 6, backgroundColor: '#2a2a3a', borderRadius: 3, overflow: 'hidden' },
  workBarFill: { height: '100%', backgroundColor: '#5bc4ff', borderRadius: 3 },

  card: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 18, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  categoryEmoji: { fontSize: 20 },
  categoryLabel: { fontSize: 10, fontWeight: '700', color: '#888', letterSpacing: 1.5 },
  eventTitle: { fontSize: 18, fontWeight: '800', color: '#fff', lineHeight: 24, marginBottom: 8 },
  eventBody: { fontSize: 13, color: '#aaa', lineHeight: 20 },
  followUpBox: { marginTop: 14, backgroundColor: '#0f0f1a', borderRadius: 10, padding: 12, gap: 10 },
  followUpText: { fontSize: 13, color: '#5bc4ff', fontStyle: 'italic' },
  nextBarBg: { height: 3, backgroundColor: '#2a2a3a', borderRadius: 2, overflow: 'hidden' },
  nextBarFill: { height: '100%', backgroundColor: '#5bc4ff', borderRadius: 2 },
  nextLabel: { fontSize: 10, color: '#444', textAlign: 'right', letterSpacing: 0.5 },

  choices: { gap: 10 },
  choice: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#1a1a2e', borderRadius: 12, padding: 14,
    borderWidth: 1.5, borderColor: '#2a2a3a',
  },
  choiceBlocked: { opacity: 0.4 },
  choiceLetter: {
    width: 24, height: 24, borderRadius: 6,
    backgroundColor: '#2a2a4a', alignItems: 'center', justifyContent: 'center',
  },
  choiceLetterText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  choiceContent: { flex: 1 },
  choiceText: { fontSize: 13, fontWeight: '600', color: '#ddd', lineHeight: 18 },
  choiceTextBlocked: { color: '#666' },
  effects: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  effect: { fontSize: 10, fontWeight: '700', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20 },
  effectPos: { backgroundColor: '#1b2e1b', color: '#66bb6a' },
  effectNeg: { backgroundColor: '#2e1b1b', color: '#ef5350' },
  progress: { textAlign: 'center', color: '#444', fontSize: 11, marginTop: 20 },
});
