export type Settings = {
  timeChallenge: boolean;
  colorBlind: boolean;
  letterHelper: boolean;
  darkTheme: boolean;
  reducedMotion: boolean;
};

export type Setting = [keyof Settings, boolean];
