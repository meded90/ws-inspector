import { observable } from 'mobx';

export class WebSocketUrlStore {
  @observable urlWs: Record<string, Record<string, string>> = {};
  tabId: number;

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
