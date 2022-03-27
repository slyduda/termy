import { GetterTree } from 'vuex';

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store';
import { State } from './state';

export type Getters = {
  id(state: State): number;
};

export const getters: GetterTree<State, RootState> & Getters = {
  id: (state) => state.id,
};
