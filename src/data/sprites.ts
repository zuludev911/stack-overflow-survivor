export type Gender = 'boy' | 'girl';
export type SpriteAnim = 'idle' | 'work' | 'happy' | 'sad' | 'run';
export type AccessoryId = 'cap' | 'glasses' | 'medal' | 'coffee' | 'cape';

export const SPRITES: Record<Gender, Record<SpriteAnim, any[]>> = {
  boy: {
    idle:  [require('../../assets/sprites/boy_idle_1.png'), require('../../assets/sprites/boy_idle_2.png')],
    work:  [require('../../assets/sprites/boy_work_1.png'), require('../../assets/sprites/boy_work_2.png'), require('../../assets/sprites/boy_work_3.png')],
    happy: [require('../../assets/sprites/boy_happy_1.png'), require('../../assets/sprites/boy_happy_2.png')],
    sad:   [require('../../assets/sprites/boy_sad_1.png'), require('../../assets/sprites/boy_sad_2.png')],
    run:   [require('../../assets/sprites/boy_run_1.png'), require('../../assets/sprites/boy_run_2.png')],
  },
  girl: {
    idle:  [require('../../assets/sprites/girl_idle_1.png'), require('../../assets/sprites/girl_idle_2.png')],
    work:  [require('../../assets/sprites/girl_work_1.png'), require('../../assets/sprites/girl_work_2.png'), require('../../assets/sprites/girl_work_3.png')],
    happy: [require('../../assets/sprites/girl_happy_1.png'), require('../../assets/sprites/girl_happy_2.png')],
    sad:   [require('../../assets/sprites/girl_sad_1.png'), require('../../assets/sprites/girl_sad_2.png')],
    run:   [require('../../assets/sprites/girl_run_1.png'), require('../../assets/sprites/girl_run_2.png')],
  },
};

export const ANIM_SPEED: Record<SpriteAnim, number> = {
  idle:  500,
  work:  200,
  happy: 300,
  sad:   400,
  run:   180,
};

export type AccessoryDef = {
  id: AccessoryId;
  label: string;
  emoji: string;
  source: any;
  unlockedBy: string; // achievement id
  hint: string;       // cómo desbloquear
};

export const ACCESSORIES: AccessoryDef[] = [
  {
    id: 'cap',
    label: 'Gorra',
    emoji: '🧢',
    source: require('../../assets/sprites/acc_cap.png'),
    unlockedBy: 'first_blood',
    hint: 'Completa tu primera partida',
  },
  {
    id: 'medal',
    label: 'Medalla',
    emoji: '🥇',
    source: require('../../assets/sprites/acc_medal.png'),
    unlockedBy: 'survivor',
    hint: 'Sobrevive un mes completo',
  },
  {
    id: 'glasses',
    label: 'Lentes pro',
    emoji: '🤓',
    source: require('../../assets/sprites/acc_glasses.png'),
    unlockedBy: 'skill_maxed',
    hint: 'Termina con skill mayor a 90',
  },
  {
    id: 'coffee',
    label: 'Café eterno',
    emoji: '☕',
    source: require('../../assets/sprites/acc_coffee.png'),
    unlockedBy: 'burnout_king',
    hint: 'Muere de burnout 3 veces',
  },
  {
    id: 'cape',
    label: 'Capa de héroe',
    emoji: '🦸',
    source: require('../../assets/sprites/acc_cape.png'),
    unlockedBy: 'high_scorer',
    hint: 'Termina con score mayor a 500',
  },
];
