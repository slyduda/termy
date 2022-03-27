import { ActionTree, ActionContext } from 'vuex';
import { RootActionTypes as ActionTypes } from '@/store/action-types';
import { RootState as State } from '@/store';

type AugmentedActionContext = {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1]
  ): ReturnType<Actions[K]>;
} & Omit<ActionContext<State, State>, 'dispatch'>;

export interface Actions {
  [ActionTypes.INIT](
    { dispatch }: AugmentedActionContext,
    payload: string
  ): void;
}

const TEST_PUZZLES = {
  classic: 'ZEBRA',
  plus: 'ZIPPER',
  mutate: {
    pool: [
      ['A', 'I', 'R', 'E', 'M', 'T'],
      ['C', 'M', 'P', 'H', 'O', 'L'],
      ['S', 'K', 'G', 'N', 'I', 'R'],
      ['O', 'L', 'O', 'M', 'B'],
      ['F', 'L', 'U', 'K', 'E'],
      [],
      //['D', 'I', 'N', 'E', 'R']
    ],
    constraints: [[3], [1], [0], [1, 2], [0, 3, 4], []],
  },
};

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.INIT]({ dispatch }) {
    const id: number = parseInt(
      (document.getElementById('i_elem') as HTMLInputElement).value
    );
    const time: number = parseInt(
      (document.getElementById('p_elem') as HTMLInputElement).value
    );
    const plus: string = (document.getElementById('s_elem') as HTMLInputElement)
      .value;

    const classic: string = (
      document.getElementById('p_elem') as HTMLInputElement
    ).value;

    dispatch('game/init', { time, id, classic, plus });
  },
};
