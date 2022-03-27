import { ActionTree, ActionContext } from 'vuex';
import axios from 'axios';

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store';
import { State } from './state';
import { Mutations } from './mutations';

import { ClassicActionTypes as ActionTypes } from './types/actions';
import { ClassicMutationTypes as MutationTypes } from './types/mutations';
import { GameModes } from '@/@types';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

export interface Actions {
  [ActionTypes.SET](
    { commit }: AugmentedActionContext,
    { solution, id }: { solution: string; id: number }
  ): void;
  [ActionTypes.END]({ commit }: AugmentedActionContext, won: boolean): void;
  [ActionTypes.LOAD]({ commit }: AugmentedActionContext): void;
  [ActionTypes.SEND]({ commit }: AugmentedActionContext): void;
  [ActionTypes.SAVE]({ commit }: AugmentedActionContext): void;
  [ActionTypes.RESET]({ commit }: AugmentedActionContext): void;
  [ActionTypes.SUBMIT]({
    commit,
    dispatch,
    getters,
    state,
  }: AugmentedActionContext): void;
  [ActionTypes.CONTINUE](
    { commit }: AugmentedActionContext,
    extra: number
  ): void;
  [ActionTypes.ADD_LETTER](
    { commit }: AugmentedActionContext,
    letter: string
  ): void;
  [ActionTypes.REMOVE_LETTER]({ commit }: AugmentedActionContext): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.SET]({ commit, dispatch, getters }, payload) {
    commit(MutationTypes.SET, payload);
    dispatch(ActionTypes.LOAD);

    // If the user wanted to keep going after the default tries!
    if (getters.lost && getters.playing) commit(MutationTypes.ADD_TRIES, 4);
  },

  [ActionTypes.LOAD]({ commit }) {
    commit(MutationTypes.LOAD, undefined);
  },

  [ActionTypes.RESET]({ commit, dispatch }) {
    commit(MutationTypes.RESET, undefined);
    dispatch(ActionTypes.SAVE);
  },

  [ActionTypes.SAVE]({ state, dispatch }) {
    const id = state.id;
    const mode = GameModes.CLASSIC;
    const game = {
      mode,
      puzzleId: state.id,
      solution: state.solution,
      length: state.length,
      guesses: state.guesses,
      startedOn: state.time.started,
      endedOn: state.time.ended,
      won: state.won,
      badges: [],
      challenges: [],
    };

    dispatch('storage/save', { mode, id, payload: game });
  },

  [ActionTypes.SUBMIT]({ state, getters, commit, dispatch }) {
    if (state.won !== null) return;

    if (getters.validLength) {
      dispatch('admin/alert', `Guess is not ${state.length} letters`);
      // context.commit('shake', true)
      return;
    }

    if (!getters.validGuess) {
      dispatch('admin/alert', 'Word not recognized');
      // context.commit('shake', true)
      return;
    }

    commit(MutationTypes.SUBMIT, undefined);

    // Check for win conditions
    if (getters.won) {
      dispatch(ActionTypes.END, !getters.lost); // This should save the win
      dispatch('admin/alert', 'You got it!');
    } else if (getters.lostHard) {
      dispatch(ActionTypes.END, false);
      dispatch('admin/alert', state.solution);
    } else if (getters.lostSoft) {
      dispatch('admin/alert', 'UH OH');
    }

    // Save new state
    dispatch(ActionTypes.SAVE);
  },

  [ActionTypes.CONTINUE]({ getters, commit }, extra) {
    if (getters.lostSoft) commit(MutationTypes.ADD_TRIES, extra);
  },

  [ActionTypes.ADD_LETTER]({ getters, state, commit }, letter) {
    // Checks if space to add letter and or won or lost
    if (getters.remainingLength <= 0 || state.won !== null) return;
    commit(MutationTypes.ADD_LETTER, letter);
  },

  [ActionTypes.REMOVE_LETTER]({ commit }) {
    commit(MutationTypes.REMOVE_LETTER, undefined);
  },

  [ActionTypes.END]({ commit, dispatch }, won) {
    commit(MutationTypes.END, won);
    dispatch(ActionTypes.SAVE);
    dispatch(ActionTypes.SEND);
  },

  [ActionTypes.SEND]({ state, commit, dispatch }) {
    const id = state.id;
    const mode = GameModes.CLASSIC;

    const payload = {
      id,
      mode,
      solution: state.solution,
      session: state.storage.session,
      guesses: state.guesses.join(','),
      startedOn: state.time.started,
      endedOn: state.time.ended,
      length: state.length,
      won: state.won,
    };

    axios
      .post(process.env.VUE_APP_API_URL + 'submit', payload)
      .then((response) => {
        const data = {
          id: response.data.id,
          hash: response.data.hash,
          hashVersion: response.data.hash_version,
        };

        dispatch('storage/addBackupInfo', { mode, id, payload: data });
        commit(MutationTypes.SYNCED, true);
      })
      .catch(() => {
        commit(MutationTypes.SYNCED, false);
      });
  },
};
