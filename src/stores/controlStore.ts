import { autorun, observable, toJS } from 'mobx';
import isObject from 'lodash/isObject';

export enum IOpenInput {
  'close',
  'filter',
  'name',
}

export class ControlStore {
  @observable activeId: string | null;
  @observable isCapturing = true;
  @observable regName = '';
  @observable filter = 'blue';
  @observable isFilterInverse = true;
  @observable openInput: IOpenInput = IOpenInput.filter;
  @observable
  urlWs: Record<string, Record<string, string>> = {};
  cacheKey: Array<keyof ControlStore> = ['isCapturing', 'regName', 'filter', 'isFilterInverse', 'urlWs'];
  tabId: number;

  // todo Доделать собшения оп розбе перезапуска
  @observable
  networkEnabled: boolean;

  constructor() {
    this.init();
    autorun(() => {
      console.log(`–––   \n this.urlWs `, toJS(this.urlWs), `\n–––`);
    });
    autorun(() => {
      this.cacheKey.forEach((key) => {
        let value = toJS(this[key]);
        if (value !== null) {
          if (isObject(value)) {
            value = JSON.stringify(value);
          }
          localStorage.setItem(key, value as string);
        }
      });
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

  init() {
    const cacheState = this.cacheKey.reduce<Record<string, string | boolean>>((acc, key) => {
      const value = window.localStorage.getItem(key);
      if (value !== null && value !== undefined) {
        acc[key] = value;
        if (value === 'true') {
          acc[key] = true;
        }
        if (value === 'false') {
          acc[key] = false;
        }
        console.log(`–––   \n value `, value, `\n–––`);
        try {
          if (isObject(JSON.parse(value))) {
            return JSON.parse(value);
          }
        } catch {
        }
      }
      return acc;
    }, {});
    Object.assign(this, cacheState);
  }
}
