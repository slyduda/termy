import { v4 as uuidv4 } from 'uuid';
import { DailyPuzzle, Game, Version } from '@/@types';


export interface State {
  newVersion: boolean;
  version: Version;
  puzzles: { [key: number]: DailyPuzzle };
  session: string;
  caughtup: number;
}

export const state: State = {
  newVersion: false,
  version: [1, 0, 0],
  puzzles: {},
  session: uuidv4(),
  caughtup: 0,
};
