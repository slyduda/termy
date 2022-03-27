import { ActionTree, ActionContext } from 'vuex';

// eslint-disable-next-line import/no-cycle
import { RootState } from '@/store';
import { PuzzlePayload, State } from './state';
import { Mutations } from './mutations';

import { GameActionTypes as ActionTypes } from './types/actions';
import { GameMutationTypes as MutationTypes } from './types/mutations';
import { GameModes } from '@/@types';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

export interface Actions {
  [ActionTypes.INIT](
    { commit, dispatch, state }: AugmentedActionContext,
    { id, time, puzzles }: { id: string; time: string; puzzles: string }
  ): void;
  [ActionTypes.MODE]({ commit }: AugmentedActionContext, mode: GameModes): void;
}

// DANGEROUS FUNCTION
const PuzzleConverter = (s: string): PuzzlePayload =>
  JSON.parse(s) as PuzzlePayload;

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.INIT]({ commit, dispatch, state }, { id, time, puzzles }) {
    if (id !== '{@ game_id @}') commit(MutationTypes.ID, Number(id));
    if (time !== '{@ payload @}') commit(MutationTypes.TIME, Number(time));
    if (puzzles !== '{@ puzzles @}')
      commit(MutationTypes.PUZZLE, PuzzleConverter(puzzles));

    dispatch('storage/init');
    dispatch('storage/visit', state.id);

    dispatch('classic/set', {
      id: state.id,
      solution: state.puzzles.classic,
    });
    dispatch('plus/set', {
      id: state.id,
      solution: state.puzzles.plus,
    });
    dispatch('mutate/set', {
      id: state.id,
      pool: state.puzzles.mutate.pool,
      constraints: state.puzzles.mutate.constraints,
    });
    dispatch('stage/set', {
      id: state.id,
      pool: state.puzzles.mutate.pool,
      constraints: state.puzzles.mutate.constraints,
    });
  },
  [ActionTypes.MODE]({ commit }, mode) {
    commit(MutationTypes.MODE, mode);
  },
};
