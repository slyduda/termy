import { DailyPuzzle, GameModes, GameTypes, Metadata, Version } from '@/@types';

import { StorageMutationTypes as MutationTypes } from './types/mutations';
import { MutationTree } from 'vuex';
import { State } from './state';

export type Mutations<S = State> = {
  [MutationTypes.SAVE](state: S, game: GameTypes): void;
  [MutationTypes.META](
    state: S,
    { game, meta }: { game: GameTypes; meta: Metadata }
  ): void;
  [MutationTypes.VERSION](state: S, payload: Version): void;
  [MutationTypes.ADD_PUZZLE](state: S, id: number): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SAVE](state, game) {
    switch (game.mode) {
      case GameModes.CLASSIC:
        state.puzzles[game.puzzle].classic = game;
        break;
      case GameModes.PLUS:
        state.puzzles[game.puzzle].plus = game;
        break;
      case GameModes.MUTATE:
        state.puzzles[game.puzzle].mutate = game;
    }
  },
  [MutationTypes.META](state, { game, meta }) {
    const g = game; // Need to assign a whole object
    g.meta = meta;

    switch (g.mode) {
      case GameModes.CLASSIC:
        state.puzzles[game.puzzle].classic = g;
        break;
      case GameModes.PLUS:
        state.puzzles[game.puzzle].plus = g;
        break;
      case GameModes.MUTATE:
        state.puzzles[game.puzzle].mutate = g;
    }
  },
  [MutationTypes.ADD_PUZZLE](state, id) {
    if (!state.puzzles[id])
      state.puzzles[id] = {
        version: state.version,
        id: id,
      } as DailyPuzzle;
  },
  [MutationTypes.VERSION](state, payload) {
    state.version = payload;
    state.newVersion = true;
  },
};
