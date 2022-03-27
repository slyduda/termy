import {
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  Module,
  ModuleTree,
} from 'vuex';

import { RootState } from '@/store';
import { State, state } from './state';
import { Getters, getters } from './getters';
import { Mutations, mutations } from './mutations';
import { Actions, actions } from './actions';

export { State };

import {
  store as classic,
  Store as ClassicStore,
  State as ClassicState,
} from '@/store/game/classic';
import {
  store as plus,
  Store as PlusStore,
  State as PlusState,
} from '@/store/game/plus';
import {
  store as mutate,
  Store as MutateStore,
  State as MutateState,
} from '@/store/game/mutate';
import {
  store as stage,
  Store as StageStore,
  State as StageState,
} from '@/store/game/stage';

/*
export type SubrootState = {
  classic: ClassicState;
  plus: PlusState;
  mutate: MutateState;
  stage: StageState;
};

export type Store = ClassicStore<Pick<SubrootState, 'classic'>> &
  PlusStore<Pick<SubrootState, 'plus'>> &
  MutateStore<Pick<SubrootState, 'mutate'>> &
  StageStore<Pick<SubrootState, 'stage'>> &
*/

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

const modules: ModuleTree<RootState> = {
  classic,
  plus,
  mutate,
  stage,
};

export const store: Module<State, RootState> = {
  state,
  getters,
  mutations,
  actions,
  modules,
};
