import { useEffect, useRef, useState } from 'react';
import { Image, View } from 'react-native';
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
  const accDef = accessory ? ACCESSORIES.find((a) => a.id === accessory) : null;
  const w = size;
  const h = size * 1.2;

  return (
    <View style={{ width: w, height: h }}>
      {/* Renderizamos todos los frames y mostramos solo el actual con opacity */}
      {frames.map((src, i) => (
        <Image
          key={`${gender}-${animation}-${i}`}
          source={src}
          style={{
            width: w, height: h,
            position: i === 0 ? 'relative' : 'absolute',
            top: 0, left: 0,
            opacity: i === frame ? 1 : 0,
          }}
          resizeMode="contain"
        />
      ))}
      {accDef && (
        <Image
          key={`acc-${accDef.id}`}
          source={accDef.source}
          style={{ width: w, height: h, position: 'absolute', top: 0, left: 0 }}
          resizeMode="contain"
        />
      )}
    </View>
  );
}
