import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Gender, SpriteAnim, SPRITES, ANIM_SPEED, AccessoryId, ACCESSORIES } from '../data/sprites';

type Props = {
  gender: Gender;
  animation: SpriteAnim;
  accessory?: AccessoryId | null;
  size?: number;
};

export default function CharacterSprite({ gender, animation, accessory, size = 96 }: Props) {
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
  const accDef = accessory ? ACCESSORIES.find((a) => a.id === accessory) : null;

  return (
    <View style={{ width: size, height: size * 1.2 }}>
      <Image source={source} style={styles.img(size)} resizeMode="contain" />
      {accDef && (
        <Image
          source={accDef.source}
          style={[styles.img(size), StyleSheet.absoluteFillObject]}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = {
  img: (size: number) => ({
    width: size,
    height: size * 1.2,
  }),
};
