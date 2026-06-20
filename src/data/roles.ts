import { RoleConfig } from '../types';

export const ROLES: RoleConfig[] = [
  {
    id: 'frontend',
    label: 'Frontend Dev',
    emoji: '🎨',
    description: 'Vives en CSS y el cliente siempre quiere "moverlo 2px".',
    initialStats: { stress: 20, money: 60, energy: 70, skill: 55 },
    eventWeights: { client: 2, technical: 1.5, crisis: 1 },
  },
  {
    id: 'backend',
    label: 'Backend Dev',
    emoji: '⚙️',
    description: 'Nadie sabe lo que haces pero todos te culpan cuando cae prod.',
    initialStats: { stress: 25, money: 70, energy: 65, skill: 65 },
    eventWeights: { crisis: 2, technical: 2, client: 0.5 },
  },
  {
    id: 'fullstack',
    label: 'Fullstack Dev',
    emoji: '🧩',
    description: 'Haces todo. También te culpan de todo.',
    initialStats: { stress: 35, money: 75, energy: 55, skill: 60 },
    eventWeights: { crisis: 1.5, client: 1.5, technical: 1.5 },
  },
  {
    id: 'pm',
    label: 'Product Manager',
    emoji: '📋',
    description: 'No programas, pero tampoco duermes.',
    initialStats: { stress: 40, money: 80, energy: 60, skill: 40 },
    eventWeights: { client: 2.5, social: 2, career: 1.5, technical: 0.3 },
  },
  {
    id: 'designer',
    label: 'UX Designer',
    emoji: '✏️',
    description: '"Hazlo más moderno pero igual que antes."',
    initialStats: { stress: 20, money: 55, energy: 75, skill: 50 },
    eventWeights: { client: 2, social: 1.5, random: 1.5, technical: 0.5 },
  },
];
