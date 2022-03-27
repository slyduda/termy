import { Settings } from '@/@types';

export type State = Settings;

export const state: State = {
  timeChallenge: false,
  colorBlind: true,
  letterHelper: true,
  darkTheme: true,
  reducedMotion: false,
};
