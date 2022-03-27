import { GameModes } from '@/@types';
// import { LIST5 } from '@/constants/index.js';

export type ClassicSolution = string;
export type PlusSolution = string;
export type MutateSolution = {
  pool: Array<Array<string>>;
  constraints: Array<Array<number>>;
};
export type Solution = ClassicSolution | PlusSolution | MutateSolution;
export type PuzzlePayload = {
  classic: ClassicSolution;
  plus: PlusSolution;
  mutate: MutateSolution;
};

const TEST_PUZZLES = {
  classic: 'ZEBRA',
  plus: 'ZIPPER',
  mutate: {
    pool: [
      ['A', 'I', 'R', 'E', 'M', 'T'],
      ['C', 'M', 'P', 'H', 'O', 'L'],
      ['S', 'K', 'G', 'N', 'I', 'R'],
      ['O', 'L', 'O', 'M', 'B'],
      ['F', 'L', 'U', 'K', 'E'],
      [],
      //['D', 'I', 'N', 'E', 'R']
    ],
    constraints: [[3], [1], [0], [1, 2], [0, 3, 4], []],
  },
};

export interface State {
  id: number;
  time: number;
  mode: GameModes;
  puzzles: PuzzlePayload;
}

export const state = {
  id: 1,
  time: 0,
  mode: GameModes.CLASSIC,
  puzzles: TEST_PUZZLES,
  // words: LIST5,
};
