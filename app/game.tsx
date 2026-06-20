import { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EVENTS } from '../src/data/events';
import { ROLES } from '../src/data/roles';
import {
  loadCurrentRun, saveCurrentRun, completeRun,
  applyEffects, checkGameOver, calculateScore,
  EVENTS_PER_WEEK, TOTAL_WEEKS,
} from '../src/store/gameStore';
import { Run, GameEvent, Choice, StatDelta } from '../src/types';
import StatsBar from '../src/components/StatsBar';
import ScenePanel from '../src/components/ScenePanel';
import { loadGender } from '../src/store/characterStore';
import { Gender, SpriteAnim } from '../src/data/sprites';

const CATEGORY_EMOJI: Record<string, string> = {
  crisis: '🔥', client: '👔', technical: '💀',
  social: '📅', career: '🎯', random: '☕', existential: '🤖',
};

// How long the "working" animation plays before showing followUp
const WORK_DURATION = 2000;
const NEXT_DELAY    = 3000;

type Phase = 'idle' | 'working' | 'reacting' | 'next';

export default function GameScreen() {
  const [run, setRun] = useState<Run | null>(null);
  const [event, setEvent] = useState<GameEvent | null>(null);
  const [gender, setGender] = useState<Gender>('boy');
  const [phase, setPhase] = useState<Phase>('idle');
  const [spriteAnim, setSpriteAnim] = useState<SpriteAnim>('idle');
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(null);

  const workAnim   = useRef(new Animated.Value(0)).current; // "Trabajando..." bar
  const nextAnim   = useRef(new Animated.Value(0)).current; // "Siguiente evento..." bar
  const nextAnim2  = useRef(new Animated.Value(0)).current; // triggers navigation

  useEffect(() => {
    Promise.all([loadCurrentRun(), loadGender()]).then(([r, g]) => {
      if (!r) { router.replace('/'); return; }
      setRun(r);
      setEvent(pickEvent(r));
      if (g) setGender(g);
    });
  }, []);

  function pickEvent(r: Run): GameEvent {
    const role = ROLES.find((rl) => rl.id === r.role)!;
    const pool = EVENTS.filter(
      (e) => !r.eventHistory.includes(e.id) && (e.weekMin ?? 1) <= r.week
    );
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

  async function handleChoice(choice: Choice) {
    if (!run || !event || chosenId) return;

    setChosenId(choice.id);
    setPhase('working');
    setSpriteAnim('work');

    // "Trabajando..." progress bar fills over WORK_DURATION
    workAnim.setValue(0);
    Animated.timing(workAnim, {
      toValue: 1, duration: WORK_DURATION, useNativeDriver: false,
    }).start(async ({ finished }) => {
      if (!finished) return;

      const newStats = applyEffects(run.stats, choice.effects as any);
      const gameOver = checkGameOver(newStats);
      const positive = isPositiveOutcome(choice.effects);

      // Show reaction
      setPhase('reacting');
      setSpriteAnim(positive ? 'happy' : 'sad');
      setFollowUp(choice.followUpText ?? null);

      const nextEventIndex = run.eventIndex + 1;
      const weekDone = nextEventIndex >= EVENTS_PER_WEEK;
      const nextWeek = weekDone ? run.week + 1 : run.week;
      const gameDone = weekDone && run.week >= TOTAL_WEEKS;

      const updatedRun: Run = {
        ...run,
        stats: newStats,
        eventIndex: weekDone ? 0 : nextEventIndex,
        week: nextWeek,
        eventHistory: [...run.eventHistory, event.id],
      };

      // Start "Siguiente evento..." bar after reaction appears
      nextAnim.setValue(0);
      nextAnim2.setValue(0);
      setPhase('next');

      Animated.timing(nextAnim, {
        toValue: 1, duration: NEXT_DELAY - 400, delay: 400, useNativeDriver: false,
      }).start();

      Animated.timing(nextAnim2, {
        toValue: 1, duration: NEXT_DELAY, useNativeDriver: false,
      }).start(async ({ finished: f2 }) => {
        if (!f2) return;

        if (gameOver || gameDone) {
          const outcome = gameOver ?? 'survived';
          const score = calculateScore({ ...updatedRun, outcome });
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
          nextAnim2.setValue(0);
        }
      });
    });
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
        <StatsBar stats={run.stats} week={run.week} />

        {/* Character scene */}
        <ScenePanel gender={gender} animation={spriteAnim} category={event.category} />

        {/* Working overlay */}
        {phase === 'working' && (
          <View style={styles.workingBox}>
            <Text style={styles.workingText}>💻  Trabajando...</Text>
            <View style={styles.workBarBg}>
              <Animated.View style={[styles.workBarFill, {
                width: workAnim.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] }),
              }]} />
            </View>
          </View>
        )}

        {/* Event card */}
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
              <View style={styles.nextBarBg}>
                <Animated.View style={[styles.nextBarFill, {
                  width: nextAnim.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] }),
                }]} />
              </View>
              <Text style={styles.nextLabel}>Siguiente evento...</Text>
            </View>
          )}
        </View>

        {/* Choices — hidden while working */}
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
