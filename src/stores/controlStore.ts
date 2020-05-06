import { autorun, observable } from 'mobx';


export enum IOpenInput {
  'close',
  'filter',
  'name'
}


export class ControlStore {
  @observable activeId: string | null;
  @observable isCapturing = true;
  @observable regName = '';
  @observable filter = 'blue';
  @observable isFilterInverse = true;
  @observable openInput: IOpenInput = IOpenInput.filter;

  cacheKey: Array<keyof ControlStore> = ['isCapturing', 'regName', 'filter', 'isFilterInverse'];

  constructor() {
    this.init();
    autorun(() => {
      this.cacheKey.forEach((key) => {
        const value = this[key];
        if (value !== null) {
          localStorage.setItem(key, value as string);
        }
      });
    });
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
      }
      return acc;
    }, {});
    Object.assign(this, cacheState);
  }
}
