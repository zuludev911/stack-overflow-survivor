import { View, Text, StyleSheet } from 'react-native';
import { EventCategory } from '../types';
import { Gender, SpriteAnim, AccessoryId } from '../data/sprites';
import CharacterSprite from './CharacterSprite';

type Props = {
  gender: Gender;
  animation: SpriteAnim;
  category: EventCategory;
  accessory?: AccessoryId | null;
};

const SCENE: Record<EventCategory, { bg: string; accent: string; label: string; deco: string }> = {
  crisis:      { bg: '#1a0505', accent: '#e53935', label: 'CRISIS',      deco: '🔥' },
  client:      { bg: '#0a0a1f', accent: '#5bc4ff', label: 'CLIENTE',     deco: '👔' },
  technical:   { bg: '#05100f', accent: '#43a047', label: 'TÉCNICO',     deco: '💻' },
  social:      { bg: '#0f0a1a', accent: '#ab47bc', label: 'SOCIAL',      deco: '📅' },
  career:      { bg: '#0f0f05', accent: '#fb8c00', label: 'CARRERA',     deco: '🎯' },
  random:      { bg: '#0a0a0a', accent: '#888',    label: 'RANDOM',      deco: '☕' },
  existential: { bg: '#050510', accent: '#7c4dff', label: 'EXISTENCIAL', deco: '🤖' },
};

export default function ScenePanel({ gender, animation, category, accessory }: Props) {
  const scene = SCENE[category];

  return (
    <View style={[styles.scene, { backgroundColor: scene.bg }]}>
      {/* Ambient top bar */}
      <View style={[styles.topBar, { backgroundColor: scene.accent + '22' }]}>
        <Text style={[styles.topBarText, { color: scene.accent }]}>
          {scene.deco}  {scene.label}
        </Text>
      </View>

      {/* Scanlines overlay */}
      <View style={styles.scanlines} pointerEvents="none">
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={i} style={styles.scanline} />
        ))}
      </View>

      {/* Character */}
      <View style={styles.characterWrapper}>
        <CharacterSprite gender={gender} animation={animation} accessory={accessory} size={110} />
      </View>

      {/* Floor line */}
      <View style={[styles.floor, { backgroundColor: scene.accent + '44' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  topBarText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  scanlines: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-around',
    pointerEvents: 'none',
  },
  scanline: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  characterWrapper: {
    marginBottom: 10,
  },
  floor: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 2,
  },
});
