import {
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  Module,
  ModuleTree,
} from 'vuex';

import { store as storage } from '@/store/storage';
import { store as admin } from '@/store/admin';

import { RootState } from '@/store';
import { State, state } from './state';
import { GettersDefinition, getters } from './getters';
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
    [K in keyof GettersDefinition]: ReturnType<GettersDefinition[K]>;
  };
};

const modules: ModuleTree<RootState> = {
  admin,
  storage,
};

export const store: Module<State, RootState> = {
  state,
  getters,
  mutations,
  modules,
  actions,
};
