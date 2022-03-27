import { ActionTree, ActionContext } from 'vuex';

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store';
import { State } from './state';
import { Mutations } from './mutations';

import { SettingActionTypes as ActionTypes } from './types/actions';
import { SettingMutationTypes as MutationTypes } from './types/mutations';
import { Setting, Settings } from '@/@types';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

export interface Actions {
  [ActionTypes.TOGGLE_DARK_THEME]({ dispatch }: AugmentedActionContext): void;
  [ActionTypes.TOGGLE_COLOR_BLIND]({ dispatch }: AugmentedActionContext): void;
  [ActionTypes.TOGGLE_LETTER_HELPER]({
    dispatch,
  }: AugmentedActionContext): void;
  [ActionTypes.TOGGLE_TIME_CHALLENGE]({
    dispatch,
  }: AugmentedActionContext): void;
  [ActionTypes.TOGGLE_REDUCED_MOTION]({
    dispatch,
  }: AugmentedActionContext): void;
  [ActionTypes.SAVE](
    { commit }: AugmentedActionContext,
    payload: Setting
  ): void;
  [ActionTypes.LOAD](
    { commit }: AugmentedActionContext,
    payload: Settings
  ): void;
}

// Need to make settings more type safe with keys
export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.TOGGLE_DARK_THEME]({ dispatch }) {
    const val = !JSON.parse(localStorage.settings).toggleDarkTheme;
    if (val) {
      // if dark theme
      document.documentElement.classList.add('dark');
    } else {
      // if not dark theme
      document.documentElement.classList.remove('dark');
    }
    dispatch(ActionTypes.SAVE, ['toggleDarkTheme', val]);
  },
  [ActionTypes.TOGGLE_COLOR_BLIND]({ dispatch }) {
    const val = !JSON.parse(localStorage.settings).colorBlind;
    dispatch(ActionTypes.SAVE, ['colorBlind', val]);
  },
  [ActionTypes.TOGGLE_LETTER_HELPER]({ dispatch }) {
    const val = !JSON.parse(localStorage.settings).letterHelper;
    dispatch(ActionTypes.SAVE, ['letterHelper', val]);
  },
  [ActionTypes.TOGGLE_REDUCED_MOTION]({ dispatch }) {
    const val = !JSON.parse(localStorage.settings).reducedMotion;
    dispatch(ActionTypes.SAVE, ['reducedMotion', val]);
  },
  [ActionTypes.TOGGLE_TIME_CHALLENGE]({ dispatch }) {
    const val = !JSON.parse(localStorage.settings).timeChallenge;
    dispatch(ActionTypes.SAVE, ['timeChallenge', val]);
  },
  [ActionTypes.SAVE]({ commit }, payload) {
    const settings = JSON.parse(localStorage.settings);
    settings[payload[0]] = payload[1];
    localStorage.settings = JSON.stringify(settings);
    commit(MutationTypes.SET, payload);
  },
  [ActionTypes.LOAD]({ commit }) {
    // does not accouunt for undefined settings payload
    const settings: Settings = JSON.parse(localStorage.settings);
    const payload: Settings = {
      darkTheme:
        settings.darkTheme !== undefined
          ? Boolean(settings.darkTheme)
          : window.matchMedia('(prefers-color-scheme: dark)').matches,
      colorBlind:
        settings.colorBlind !== undefined ? Boolean(settings.colorBlind) : true,
      letterHelper:
        settings.letterHelper !== undefined
          ? Boolean(settings.letterHelper)
          : true,
      reducedMotion:
        settings.reducedMotion !== undefined
          ? Boolean(settings.reducedMotion)
          : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      timeChallenge:
        settings.timeChallenge !== undefined
          ? Boolean(settings.timeChallenge)
          : false,
    };
    commit(MutationTypes.LOADS, payload);
    localStorage.settings = JSON.stringify(payload);
  },
};
