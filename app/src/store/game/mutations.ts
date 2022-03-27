import { GameMutationTypes as MutationTypes } from './types/mutations';
import { MutationTree } from 'vuex';
import { PuzzlePayload, Solution, State } from './state';
import { GameModes } from '@/@types';

export type Mutations<S = State> = {
  [MutationTypes.ID](state: S, id: number): void;
  [MutationTypes.TIME](state: S, time: number): void;
  [MutationTypes.MODE](state: S, mode: GameModes): void;
  [MutationTypes.PUZZLE](state: S, puzzles: PuzzlePayload): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ID](state, id) {
    state.id = id;
  },
  [MutationTypes.TIME](state, time) {
    const d = new Date();
    d.setSeconds(d.getTime() + Number(time));
    state.time = d.getTime();
  },
  [MutationTypes.MODE](state, mode) {
    state.mode = mode;
  },
  [MutationTypes.PUZZLE](state, puzzles) {
    state.puzzles = puzzles;
  },
};
