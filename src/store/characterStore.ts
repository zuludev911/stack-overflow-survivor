import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gender, AccessoryId } from '../data/sprites';

const KEYS = {
  gender:    'sos:character_gender',
  accessory: 'sos:character_accessory',
};

export async function saveGender(gender: Gender): Promise<void> {
  await AsyncStorage.setItem(KEYS.gender, gender);
}

export async function loadGender(): Promise<Gender | null> {
  const val = await AsyncStorage.getItem(KEYS.gender);
  return (val as Gender) ?? null;
}

export async function saveAccessory(id: AccessoryId | null): Promise<void> {
  if (id) await AsyncStorage.setItem(KEYS.accessory, id);
  else await AsyncStorage.removeItem(KEYS.accessory);
}

export async function loadAccessory(): Promise<AccessoryId | null> {
  const val = await AsyncStorage.getItem(KEYS.accessory);
  return (val as AccessoryId) ?? null;
}
