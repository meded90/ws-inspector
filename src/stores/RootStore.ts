import { FrameStore } from './frameStore';
import { ControlStore } from './controlStore';
import { ChromeStore } from './chromeStore';
import { MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';

export function createStores() {
  const controlStore = new ControlStore();
  const frameStore = new FrameStore(controlStore);
  const chromeStore = new ChromeStore(frameStore, controlStore);

  return { frameStore, controlStore, chromeStore };
}

export type RootStore = ReturnType<typeof createStores>;

export type StorePartial = Partial<RootStore>;
export type StoreConsumer<K extends keyof RootStore> = {
  [P in K]: Readonly<RootStore[P]>;
};


export function useStores(): RootStore {
  return useContext(MobXProviderContext) as RootStore;
}

/*
  custom hook to create context
 */
