import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Gender, SpriteAnim, SPRITES, ANIM_SPEED } from '../data/sprites';

type Props = {
  gender: Gender;
  animation: SpriteAnim;
  size?: number;
};

export default function CharacterSprite({ gender, animation, size = 96 }: Props) {
  const [frame, setFrame] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setFrame(0);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const frames = SPRITES[gender][animation];
    if (frames.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setFrame((f) => (f + 1) % frames.length);
    }, ANIM_SPEED[animation]);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gender, animation]);

  const frames = SPRITES[gender][animation];
  const source = frames[frame % frames.length];

  return (
    <View style={[styles.container, { width: size, height: size * 1.2 }]}>
      <Image
        source={source}
        style={{ width: size, height: size * 1.2 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
});
