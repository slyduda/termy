import { Version } from '@/@types';

export enum GameModes {
  CLASSIC = 'classic',
  PLUS = 'plus',
  MUTATE = 'mutate',
}

export enum LetterStatuses {
  PRESENT = 'present',
  ABSENT = 'absent',
  CORRECT = 'correct',
}

export type GameTypes = GameClassic | GamePlus | GameMutate;

type HashVersion = [number, number];
type Badge = {};
type Challenge = {};
type Guess = string;

type Game = {
  mode: GameModes;
  puzzle: number;
  badges: Badges[];
  challenges: Challenge[];
  started: Date;
  ended: Date;
  won: boolean | null;
  meta: Metadata | null;
};

type Metadata = {
  id: uuidv4;
  hash: string;
  hashversion: HashVersion;
};

interface GameClassic extends Game {
  mode: GameModes.CLASSIC;
  guesses: Guess[];
  solution: string;
  length: number = 5;
}

interface GamePlus extends Game {
  mode: GameModes.PLUS;
  guesses: Guess[];
  solution: string;
  length: number = 6;
}

interface GameMutate extends Game {
  mode: GameModes.MUTATE;
}

export type DailyPuzzle = {
  classic: GameClassic | undefined;
  plus: GamePlus | undefined;
  mutate: GameMutate | undefined;
  version: Version;
  id: number;
};

export type SortedGames = {
  classic: { [key: number]: GameClassic };
  plus: { [key: number]: GamePlus };
  mutate: { [key: number]: GameMutate };
};

export const ApiToGameModel = (
  payload: any
): { game: GameTypes; meta: Metadata } => {
  switch (payload.mode) {
    case GameModes.CLASSIC:
      return {};
    case GameModes.PLUS:
      return {};
    case GameModes.MUTATE:
      return {};
  }
};
