export interface State {
  id: number;
  solution: string;
  length: number;
  tries: number;
  current: string;
  guesses: string[];
  won: boolean | null;
  time: {
    started: number | null;
    ended: number | null;
  };
  synced: boolean | null;
}

export const state = {
  id: -1,
  solution: 'XXXXX',

  length: 5,
  tries: 6,

  current: '',

  guesses: [],
  won: null,
  time: {
    started: null,
    ended: null,
  },

  synced: false,
};
