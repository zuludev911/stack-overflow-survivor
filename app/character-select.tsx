import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gender, SPRITES } from '../src/data/sprites';
import { saveGender } from '../src/store/characterStore';

export default function CharacterSelectScreen() {
  const [selected, setSelected] = useState<Gender | null>(null);

  async function handleContinue() {
    if (!selected) return;
    await saveGender(selected);
    router.replace('/role-select');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Elige tu personaje</Text>
        <Text style={styles.subtitle}>Puedes cambiar accesorios a medida que desbloquees logros.</Text>

        <View style={styles.row}>
          <Pressable
            style={[styles.card, selected === 'boy' && styles.cardSelected]}
            onPress={() => setSelected('boy')}
          >
            <Image
              source={SPRITES.boy.idle[0]}
              style={styles.sprite}
              resizeMode="contain"
            />
            <Text style={styles.cardLabel}>Dev Niño</Text>
          </Pressable>

          <Pressable
            style={[styles.card, selected === 'girl' && styles.cardSelected]}
            onPress={() => setSelected('girl')}
          >
            <Image
              source={SPRITES.girl.idle[0]}
              style={styles.sprite}
              resizeMode="contain"
            />
            <Text style={styles.cardLabel}>Dev Niña</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.btn, !selected && styles.btnDisabled]}
          onPress={handleContinue}
          disabled={!selected}
        >
          <Text style={styles.btnText}>
            {selected ? 'Continuar' : 'Selecciona un personaje'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', gap: 24 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#666', textAlign: 'center' },
  row: { flexDirection: 'row', gap: 16 },
  card: {
    width: 140, alignItems: 'center', gap: 12,
    backgroundColor: '#1a1a2e', borderRadius: 16,
    padding: 20, borderWidth: 2, borderColor: 'transparent',
  },
  cardSelected: { borderColor: '#e53935' },
  sprite: { width: 90, height: 108 },
  cardLabel: { fontSize: 14, fontWeight: '700', color: '#fff' },
  btn: {
    width: '100%', backgroundColor: '#e53935', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#2a2a3a' },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
