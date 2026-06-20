import { Run, GameOutcome } from './index';

export type Achievement = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  check: (run: Run, allRuns: Run[]) => boolean;
};
