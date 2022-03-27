import { GetterTree } from 'vuex';

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store';
import { State } from './state';

export type Getters = {
  isScore(state: State): boolean;
};

export const getters: GetterTree<State, RootState> & Getters = {
  isScore: (state) => state.score,
};
