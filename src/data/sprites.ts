export type Gender = 'boy' | 'girl';
export type SpriteAnim = 'idle' | 'work' | 'happy' | 'sad' | 'run';

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
