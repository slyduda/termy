import { SettingMutationTypes as MutationTypes } from './types/mutations';
import { MutationTree } from 'vuex';
import { State } from './state';
import { Settings, Setting } from '@/@types';

export type Mutations<S = State> = {
  [MutationTypes.SET](state: S, payload: Setting): void;
  [MutationTypes.LOADS](state: S, payload: Settings): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET](state, payload: Setting) {
    state[payload[0]] = payload[1];
  },
  [MutationTypes.LOADS](state, payload: Settings) {
    state.darkTheme = payload.darkTheme;
    state.colorBlind = payload.colorBlind;
    state.letterHelper = payload.letterHelper;
    state.reducedMotion = payload.reducedMotion;
    state.timeChallenge = payload.timeChallenge;
  },
};
