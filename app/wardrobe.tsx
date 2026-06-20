import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ACCESSORIES, AccessoryId, SPRITES } from '../src/data/sprites';
import { loadGender, loadAccessory, saveAccessory } from '../src/store/characterStore';
import { loadUnlockedAchievements } from '../src/store/achievementStore';
import { Gender } from '../src/data/sprites';
import CharacterSprite from '../src/components/CharacterSprite';

export default function WardrobeScreen() {
  const [gender, setGender] = useState<Gender>('boy');
  const [selected, setSelected] = useState<AccessoryId | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([loadGender(), loadAccessory(), loadUnlockedAchievements()]).then(
      ([g, acc, achievements]) => {
        if (g) setGender(g);
        setSelected(acc);
        setUnlocked(achievements);
      }
    );
  }, []);

  async function handleSelect(id: AccessoryId | null) {
    setSelected(id);
    await saveAccessory(id);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Volver</Text>
        </Pressable>

        <Text style={styles.title}>Guardarropa</Text>

        {/* Preview */}
        <View style={styles.preview}>
          <CharacterSprite gender={gender} animation="idle" accessory={selected} size={110} />
        </View>

        {/* No accessory option */}
        <Pressable
          style={[styles.accCard, selected === null && styles.accCardSelected]}
          onPress={() => handleSelect(null)}
        >
          <Text style={styles.accEmoji}>🚫</Text>
          <View style={styles.accInfo}>
            <Text style={styles.accLabel}>Sin accesorio</Text>
          </View>
          {selected === null && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>

        {/* Accessories */}
        {ACCESSORIES.map((acc) => {
          const isUnlocked = unlocked.includes(acc.unlockedBy);
          const isSelected = selected === acc.id;

          return (
            <Pressable
              key={acc.id}
              style={[
                styles.accCard,
                isSelected && styles.accCardSelected,
                !isUnlocked && styles.accCardLocked,
              ]}
              onPress={() => isUnlocked && handleSelect(acc.id)}
              disabled={!isUnlocked}
            >
              <Image source={acc.source} style={styles.accThumb} resizeMode="contain" />
              <View style={styles.accInfo}>
                <Text style={[styles.accLabel, !isUnlocked && styles.textLocked]}>
                  {isUnlocked ? acc.label : '???'}
                </Text>
                <Text style={[styles.accHint, !isUnlocked && styles.textLocked]}>
                  {isUnlocked ? acc.emoji + ' Desbloqueado' : `🔒 ${acc.hint}`}
                </Text>
              </View>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  container: { padding: 20, paddingTop: 8, paddingBottom: 40 },
  back: { marginBottom: 20 },
  backText: { color: '#5bc4ff', fontSize: 14 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 20 },
  preview: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1a1a2e', borderRadius: 16,
    height: 160, marginBottom: 24,
  },
  accCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#1a1a2e', borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 2, borderColor: 'transparent',
  },
  accCardSelected: { borderColor: '#e53935' },
  accCardLocked: { opacity: 0.45 },
  accThumb: { width: 52, height: 52 },
  accEmoji: { fontSize: 32, width: 52, textAlign: 'center' },
  accInfo: { flex: 1 },
  accLabel: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 3 },
  accHint: { fontSize: 12, color: '#888' },
  textLocked: { color: '#555' },
  checkmark: { fontSize: 18, color: '#e53935', fontWeight: '800' },
});
