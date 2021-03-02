import { action, observable, reaction, toJS } from 'mobx';

export enum IOpenInput {
  'close',
  'filter',
  'name',
}

export class ControlStore {
  @observable isInitApp = false;

  @observable activeId: string | null;
  @observable isCapturing = true;
  @observable regName = '';
  @observable filter = '';
  @observable isFilterInverse = true;
  @observable openInput: IOpenInput = IOpenInput.close;
  cacheKey: Array<keyof Partial<ControlStore>> = ['isCapturing', 'regName', 'filter', 'isFilterInverse', 'sizeSplit'];

  // todo Доделать собшения оп розбе перезапуска
  @observable networkEnabled: boolean;

  @observable sizeSplit: number[] = [250];

  constructor() {
    chrome.storage.local.get(action((result) => {
      Object.assign(this, result);
      this.isInitApp = true;
    }));
    reaction(
      () => {
        const result: Partial<ControlStore> = {};
        for (let i = 0; i < this.cacheKey.length; i++) {
          let key = this.cacheKey[i];
          result[key] = toJS(this[key]) as any;
        }
        return result;
      },
      (result) => {
        chrome.storage.local.set(result);
      },
    );
  }

  @action.bound
  onSaveSizes(value: number[]) {
    this.sizeSplit = value;
  };
}
