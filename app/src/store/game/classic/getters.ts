import { GetterTree } from 'vuex';

import { unique, checkGuesses } from '@/helpers';

import { ALPHABET, ALPHABET_DICT, LIST5, HARD_LOSS } from '@/constants';

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store';
import { State } from './state';
import { LetterStatuses } from '@/@types';

export interface Getters {
  won: boolean;
  lost: boolean;
  lostSoft: boolean;
  playing: boolean;
  remainingLength: number;
  validLength: boolean;
  guessResults: string[][][];
  hints: string[];
  charStatuses: {
    [key: string]: LetterStatuses | '';
    // [Property in keyof ALPHABET_DICT]: LetterStatuses;
  };
  absentChars: string;
  presentChars: string;
  correctChars: string;
}

export type GettersDefinition = {
  [P in keyof Getters]: (state: State, getters: Getters) => Getters[P];
};

export const getters: GetterTree<State, RootState> & GettersDefinition = {
  won: (state) => {
    return state.guesses[state.guesses.length - 1] === state.solution;
  },
  lost: (state) => {
    return state.guesses.length >= 6;
  },
  lostSoft: (state) => {
    return (
      state.guesses.length === state.tries &&
      state.guesses.length < HARD_LOSS &&
      state.won === null
    );
  },
  lostHard: (state) => {
    return state.guesses.length >= HARD_LOSS;
  },
  playing: (state) => {
    return state.won === null;
  },
  validLength: (state) => {
    return state.current.length === state.length;
  },
  validGuess: (state) => {
    return LIST5.indexOf(state.current.toLowerCase()) >= 0;
  },
  remainingLength: (state) => {
    return state.length - state.current.length;
  },
  guessResults: (state) => {
    const results = [];

    for (let i = 0; i < state.guesses.length; i++) {
      const guessCharacters = state.guesses[i].split('');
      const guessResult = checkGuesses(guessCharacters, state.solution);
      results.push(guessResult);
    }
    return results; // [ [ [a , 2], [b, 0], [c, 1] ], [ [a , 2], [c, 2], [d, 2] ] ]
  },
  hints: (state, getters) => {
    const arr = new Array(state.length).fill('');
    if (getters.won) return arr;
    for (let i = 0; i < getters.guessResults.length; i++) {
      const guess = getters.guessResults[i];
      for (let j = 0; j < guess.length; j++)
        if (guess[j][1] === LetterStatuses.CORRECT) arr[j] = guess[j][0];
    }
    return arr;
  },
  charStatuses: (state, getters) => {
    return Object.fromEntries(
      ALPHABET.map((k) => [
        k,
        getters.correctChars.includes(k)
          ? LetterStatuses.CORRECT
          : getters.presentChars.includes(k)
          ? LetterStatuses.PRESENT
          : getters.absentChars.includes(k)
          ? LetterStatuses.ABSENT
          : '',
      ])
    );
  },
  correctChars: (state, getters) => {
    const correct = [];
    for (let i = 0; i < getters.guessResults.length; i++) {
      const guess = getters.guessResults[i];
      for (let j = 0; j < guess.length; j++) {
        const guessChar = guess[j];
        if (guessChar[1] === LetterStatuses.CORRECT) correct.push(guessChar[0]);
      }
    }
    return unique(correct.join());
  },
  presentChars: (state, getters) => {
    const correct = [];
    for (let i = 0; i < getters.guessResults.length; i++) {
      const guess = getters.guessResults[i];
      for (let j = 0; j < guess.length; j++) {
        const guessChar = guess[j];
        if (guessChar[1] === LetterStatuses.PRESENT) correct.push(guessChar[0]);
      }
    }
    return unique(correct.join());
  },
  absentChars: (state, getters) => {
    const correct = [];
    for (let i = 0; i < getters.guessResults.length; i++) {
      const guess = getters.guessResults[i];
      for (let j = 0; j < guess.length; j++) {
        const guessChar = guess[j];
        if (guessChar[1] === LetterStatuses.ABSENT) correct.push(guessChar[0]);
      }
    }
    return unique(correct.join());
  },
};
