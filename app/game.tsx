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
import { Run, GameEvent, Choice } from '../src/types';
import StatsBar from '../src/components/StatsBar';

const CATEGORY_EMOJI: Record<string, string> = {
  crisis: '🔥', client: '👔', technical: '💀',
  social: '📅', career: '🎯', random: '☕', existential: '🤖',
};

const NEXT_DELAY = 3000;

export default function GameScreen() {
  const [run, setRun] = useState<Run | null>(null);
  const [event, setEvent] = useState<GameEvent | null>(null);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadCurrentRun().then((r) => {
      if (!r) { router.replace('/'); return; }
      setRun(r);
      setEvent(pickEvent(r));
    });
  }, []);

  function pickEvent(r: Run): GameEvent {
    const role = ROLES.find((rl) => rl.id === r.role)!;
    const pool = EVENTS.filter(
      (e) => !r.eventHistory.includes(e.id) && (e.weekMin ?? 1) <= r.week
    );
    // weighted random
    const weights = pool.map((e) => {
      const roleWeight = role.eventWeights[e.category] ?? 1;
      return e.weight * roleWeight;
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
      rand -= weights[i];
      if (rand <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  function startProgressBar(onDone: () => void) {
    progressAnim.setValue(0);
    progressAnim2.setValue(0);
    // first bar: fills quickly as "reading time"
    Animated.sequence([
      Animated.timing(progressAnim, {
        toValue: 1, duration: NEXT_DELAY - 400, useNativeDriver: false, delay: 400,
      }),
    ]).start();
    // second delayed bar triggers navigation
    Animated.timing(progressAnim2, {
      toValue: 1, duration: NEXT_DELAY, useNativeDriver: false,
    }).start(({ finished }) => { if (finished) onDone(); });
  }

  async function handleChoice(choice: Choice) {
    if (!run || !event || chosenId) return;

    setChosenId(choice.id);
    setFollowUp(choice.followUpText ?? null);

    const newStats = applyEffects(run.stats, choice.effects as any);
    const gameOver = checkGameOver(newStats);

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

    if (gameOver || gameDone) {
      const outcome = gameOver ?? 'survived';
      const score = calculateScore({ ...updatedRun, outcome });
      const finalRun: Run = { ...updatedRun, outcome, score };
      await completeRun(finalRun);
      startProgressBar(() =>
        router.replace({ pathname: '/result', params: { outcome, score: String(score) } })
      );
    } else {
      await saveCurrentRun(updatedRun);
      startProgressBar(() => {
        setRun(updatedRun);
        setEvent(pickEvent(updatedRun));
        setChosenId(null);
        setFollowUp(null);
        progressAnim.setValue(0);
        progressAnim2.setValue(0);
      });
    }
  }

  if (!run || !event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}><Text style={styles.loadingText}>Cargando evento...</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatsBar stats={run.stats} week={run.week} />

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
                <Animated.View
                  style={[
                    styles.nextBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1], outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.nextLabel}>Siguiente evento...</Text>
            </View>
          )}
        </View>

        {/* Choices */}
        <View style={styles.choices}>
          {event.choices.map((choice, i) => {
            const letters = ['A', 'B', 'C'];
            const isChosen = chosenId === choice.id;
            const isDisabled = chosenId !== null;
            const blocked =
              choice.requiresMinStat &&
              Object.entries(choice.requiresMinStat).some(
                ([stat, min]) => run.stats[stat as keyof typeof run.stats] < (min as number)
              );

            return (
              <Pressable
                key={choice.id}
                style={[
                  styles.choice,
                  isChosen && styles.choiceChosen,
                  blocked && styles.choiceBlocked,
                ]}
                onPress={() => !blocked && handleChoice(choice)}
                disabled={isDisabled || !!blocked}
              >
                <View style={[styles.choiceLetter, isChosen && styles.choiceLetterChosen]}>
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
  choiceChosen: { borderColor: '#e53935', backgroundColor: '#1f0f0f' },
  choiceBlocked: { opacity: 0.4 },
  choiceLetter: {
    width: 24, height: 24, borderRadius: 6,
    backgroundColor: '#2a2a4a', alignItems: 'center', justifyContent: 'center',
  },
  choiceLetterChosen: { backgroundColor: '#e53935' },
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
