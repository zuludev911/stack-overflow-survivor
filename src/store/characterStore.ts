import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gender } from '../data/sprites';

const KEY = 'sos:character_gender';

export async function saveGender(gender: Gender): Promise<void> {
  await AsyncStorage.setItem(KEY, gender);
}

export async function loadGender(): Promise<Gender | null> {
  const val = await AsyncStorage.getItem(KEY);
  return (val as Gender) ?? null;
}
