import { ActionTree, ActionContext } from 'vuex';

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store';
import { State } from './state';
import { Mutations } from './mutations';

import { AdminActionTypes as ActionTypes } from './types/actions';
import { AdminMutationTypes as MutationTypes } from './types/mutations';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

export interface Actions {
  [ActionTypes.ALERT](
    { commit }: AugmentedActionContext,
    payload: string
  ): void;
  [ActionTypes.SCORE]({ commit }: AugmentedActionContext): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.ALERT]({ commit }, payload) {
    commit(MutationTypes.ALERT, payload);
  },
  [ActionTypes.SCORE]({ commit }) {
    commit(MutationTypes.SCORE, undefined);
  },
};
