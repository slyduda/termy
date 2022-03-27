import { createStore, createLogger, ModuleTree, Store } from 'vuex';

// TODO: How to surpass cyclical dependency linting errors cleanly?
// eslint-disable-next-line import/no-cycle
import {
  store as admin,
  Store as AdminStore,
  State as AdminState,
} from '@/store/admin';
import {
  store as setting,
  Store as SettingStore,
  State as SettingState,
} from '@/store/setting';
import {
  store as storage,
  Store as StorageStore,
  State as StorageState,
} from '@/store/storage';
import {
  store as game,
  Store as GameStore,
  State as GameState,
} from '@/store/game';

const debug = process.env.NODE_ENV !== 'production';
const plugins = debug ? [createLogger({})] : [];

// State Type
export type RootState = {
  game: GameState;
  admin: AdminState;
  storage: StorageState;
  setting: SettingState;
};

/*
// Store Type
export type Store = GameStore<Pick<RootState, 'game'>> &
  AdminStore<Pick<RootState, 'admin'>> &
  StorageStore<Pick<RootState, 'storage'>> &
  SettingStore<Pick<RootState, 'setting'>>;
*/

const modules: ModuleTree<RootState> = {
  storage,
  setting,
  admin,
  game,
};

/*
export const store = createStore({
  plugins,
  modules,
});

export function useStore(): Store {
  return store as Store;
}*/

export default new Store<RootState>({
  plugins,
  modules,
});
