import { GetterTree } from 'vuex';

import { GameTypes, SortedGames } from '@/@types';

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store';
import { State } from './state';

export type Getters = {
  games(state: State): GameTypes[];
  pending(state: State, getters: Getters): SortedGames;
};

export const getters: GetterTree<State, RootState> & Getters = {
  games: (state) => {
    const puzzles = Object.entries(state.puzzles);
    const classic = puzzles
      .filter(([, puzzle]) => puzzle.classic !== undefined)
      .map(([, puzzle]) => {
        return { ...puzzle.classic };
      })
      .filter((game) => game.won !== null && !game.meta);

    const plus = puzzles
      .filter(([, puzzle]) => puzzle.plus !== undefined)
      .map(([, game]) => {
        return { ...game.plus };
      })
      .filter((game) => game.won !== null && !game.meta);

    return [...classic, ...plus];
  },
  pending: (state, getters) => {
    return [];
  },
};
