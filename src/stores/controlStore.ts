import { autorun, observable, toJS } from 'mobx';

export enum IOpenInput {
  'close',
  'filter',
  'name',
}

export class ControlStore {
  @observable activeId: string | null;
  @observable isCapturing = true;
  @observable regName = '';
  @observable filter = '';
  @observable isFilterInverse = true;
  @observable openInput: IOpenInput = IOpenInput.close;
  @observable
  urlWs: Record<string, Record<string, string>> = {};
  cacheKey: Array<keyof Partial<ControlStore>> = ['isCapturing', 'regName', 'filter', 'isFilterInverse'];
  tabId: number;

  // todo Доделать собшения оп розбе перезапуска
  @observable
  networkEnabled: boolean;

  constructor() {
    chrome.storage.local.get((result) => {
      Object.assign(this, result);
    });
    autorun(() => {
      const result: Partial<ControlStore> = {};
      for (let i = 0; i < this.cacheKey.length; i++) {
        let key = this.cacheKey[i];
        result[key] = toJS(this[key]) as any;
      }
      chrome.storage.local.set(result);
    });
  }

  addUrlWs(url: string, requestId: string) {
    if (!this.urlWs[this.tabId]) {
      this.urlWs[this.tabId] = {};
    }
    this.urlWs[this.tabId][url] = requestId;
  }

  removeUrlWs(url: string, requestId: string) {
    if (this.urlWs[this.tabId][url] === requestId) {
      delete this.urlWs[this.tabId][url];
    }
  }

  clearUrlWs() {
    delete this.urlWs[this.tabId];
  }
}
