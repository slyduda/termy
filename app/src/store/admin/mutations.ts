import { AdminMutationTypes as MutationTypes } from './types/mutations';
import { MutationTree } from 'vuex';
import { State } from './state';

export type Mutations<S = State> = {
  [MutationTypes.ALERT](state: S, payload: string): void;
  [MutationTypes.SCORE](state: S): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ALERT](state, payload: string) {
    state.alert = payload;
    setTimeout(() => {
      state.alert = '';
    }, 4000);
  },
  [MutationTypes.SCORE](state) {
    state.score = !state.score;
  },
};
