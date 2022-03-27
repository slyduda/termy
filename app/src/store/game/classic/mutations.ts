import { ClassicMutationTypes as MutationTypes } from './types/mutations';
import { MutationTree } from 'vuex';
import { State } from './state';

export type Mutations<S = State> = {
  [MutationTypes.SET](
    state: S,
    { solution, id }: { solution: string; id: number }
  ): void;
  [MutationTypes.END](state: S, won: boolean): void;
  [MutationTypes.LOAD](state: S): void;
  [MutationTypes.RESET](state: S): void;
  [MutationTypes.SYNCED](state: S, won: boolean): void;
  [MutationTypes.SUBMIT](state: S): void;
  [MutationTypes.ADD_TRIES](state: S, extra: number): void;
  [MutationTypes.ADD_LETTER](state: S, letter: string): void;
  [MutationTypes.REMOVE_LETTER](state: S): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET](state, { solution, id }) {
    state.solution = solution;
    state.id = id;
  },
  [MutationTypes.LOAD](state) {
    const games = state.storage.games[state.id];
    if (games?.classic === undefined) return;

    const game = games.classic;
    state.guesses = game.guesses;
    state.won = game.won;
    state.time.started = game.startedOn
      ? new Date(game.startedOn).getTime()
      : null;
    state.time.ended = game.endedOn ? new Date(game.endedOn).getTime() : null;
  },
  [MutationTypes.RESET](state) {
    state.length = 5;
    state.tries = 6;

    state.current = '';

    state.guesses = [];
    state.won = null;
    state.time = {
      started: null,
      ended: null,
    };

    state.synced = null;
  },
  [MutationTypes.SUBMIT](state) {
    if (state.guesses.length === 0) {
      const d = new Date();
      state.time.started = d.getTime();
    }
    state.guesses.push(state.current);
    state.current = '';
  },
  [MutationTypes.END](state, won) {
    const d = new Date();
    state.time.ended = d.getTime();
    state.won = won;
  },
  [MutationTypes.SYNCED](state, synced) {
    state.synced = synced;
  },
  [MutationTypes.ADD_TRIES](state, extra) {
    state.tries += extra;
  },
  [MutationTypes.ADD_LETTER](state, letter) {
    state.current += letter;
  },
  [MutationTypes.REMOVE_LETTER](state) {
    state.current = state.current.slice(0, -1);
  },
};
