import { ActionTree, ActionContext } from 'vuex';
import axios from 'axios';

import { ApiToGameModel, GameTypes, Metadata, Version } from '@/@types';

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store';
import { State } from './state';
import { Mutations } from './mutations';

import { StorageActionTypes as ActionTypes } from './types/actions';
import { StorageMutationTypes as MutationTypes } from './types/mutations';

const VERSION_MAJOR = 1;
const VERSION_MINOR = 0;
const VERSION_MINI = 5;
const newVersion: Version = [VERSION_MAJOR, VERSION_MINOR, VERSION_MINI];
const newCaughtup = 1;

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

export interface Actions {
  [ActionTypes.INIT]({ commit, dispatch }: AugmentedActionContext): void;
  [ActionTypes.SAVE](
    { commit }: AugmentedActionContext,
    payload: GameTypes
  ): void;
  [ActionTypes.META](
    { commit }: AugmentedActionContext,
    { game, meta }: { game: GameTypes; meta: Metadata }
  ): void;
  [ActionTypes.CATCHUP]({ commit }: AugmentedActionContext): void;
  [ActionTypes.VISIT]({ commit }: AugmentedActionContext, id: number): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.INIT]({ commit, dispatch, state }) {
    if (newVersion !== state.version) commit(MutationTypes.VERSION, newVersion);
    if (newCaughtup !== state.caughtup) dispatch(ActionTypes.CATCHUP);
  },
  [ActionTypes.SAVE]({ commit }, payload) {
    // Client driven additional info
    commit(MutationTypes.SAVE, payload);
  },
  [ActionTypes.VISIT]({ commit }, id) {
    commit(MutationTypes.ADD_PUZZLE, id);
  },
  [ActionTypes.META]({ commit }, { game, meta }) {
    commit(MutationTypes.META, { game, meta });
  },
  [ActionTypes.CATCHUP]({ commit, getters, state }) {
    // Send all of the unposted games to the server to save
    axios
      .post(process.env.VUE_APP_API_URL + 'catchup', {
        session: state.session,
        games: getters.games,
      })
      .then((response) => {
        const games = response.data.games;
        for (let i = 0; i < games.length; i++)
          commit(MutationTypes.META, { ...ApiToGameModel(games[i]) });

        state.caughtup = newCaughtup;
      });
  },
};
