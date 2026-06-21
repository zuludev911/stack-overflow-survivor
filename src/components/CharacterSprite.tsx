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
  const animRef = useRef(animation);
  const genderRef = useRef(gender);

  useEffect(() => {
    animRef.current = animation;
    genderRef.current = gender;
    setFrame(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const frames = SPRITES[gender][animation];
    if (frames.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setFrame((prev) => {
        const total = SPRITES[genderRef.current][animRef.current].length;
        return (prev + 1) % total;
      });
    }, ANIM_SPEED[animation]);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gender, animation]);

  const frames = SPRITES[gender][animation];
  const currentFrame = frame % frames.length;
  const source = frames[currentFrame];
  const accDef = accessory ? ACCESSORIES.find((a) => a.id === accessory) : null;

  const w = size;
  const h = size * 1.2;

  return (
    <View style={{ width: w, height: h }}>
      {/* key fuerza re-mount del Image cuando cambia el frame o la animación */}
      <Image
        key={`${gender}-${animation}-${currentFrame}`}
        source={source}
        style={{ width: w, height: h, position: 'absolute', top: 0, left: 0 }}
        resizeMode="contain"
      />
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
