import {
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  Module,
} from 'vuex';

import { RootState } from '@/store';
import { State, state } from './state';
import { Getters, getters } from './getters';
import { Mutations, mutations } from './mutations';
import { Actions, actions } from './actions';

export { State };

export type Store<S = State> = Omit<
  VuexStore<S>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
};

export const store: Module<State, RootState> = {
  state,
  getters,
  mutations,
  actions,
};
