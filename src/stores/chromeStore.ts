// / <reference types="chrome"/>
import { FrameStore } from './frameStore';
import { ControlStore } from './controlStore';
import { IFrameSendingType, NetworkWebSocketCreatedParams, NetworkWebSocketParams } from '../viewer/types';
import { action, observable } from 'mobx';

/*
  ChromeStore is used for attaching debugger to a certain page and defining  listeners for
  WebSockets.
  Main goal:
  (1) to make a connection between tab and inspector,
  (2) to setup listeners for WebSockets events
 */
export class ChromeStore {
  tabId: number = parseInt(window.location.search.substr(1), 10);
  @observable
  isAttached = false;

  constructor(private frameStore: FrameStore, private controlStore: ControlStore) {
    this.controlStore.tabId = this.tabId;
    // Restarts Network debugging on command
    chrome.runtime.onMessage.addListener((message) => {
      if (message.message === 'reattach' && message.tabId === this.tabId) {
        this.startDebugging();
      }
    });
    // Starts Network debugging on load
    window.addEventListener('load', () => {
      this.startDebugging();
    });
    this.startDebugging();
    // Main function to listen Network events
    chrome.debugger.onEvent.addListener((source, method, params) => {

      if (source.tabId !== this.tabId && !this.controlStore.isCapturing) {
        return;
      }
      if (method === 'Network.webSocketClosed') {
        const { url, requestId } = params as NetworkWebSocketCreatedParams;
        this.controlStore.removeUrlWs(url, requestId);
      }
      if (method === 'Network.webSocketCreated') {
        const { url, requestId } = params as NetworkWebSocketCreatedParams;
        this.controlStore.addUrlWs(url, requestId);
      }
      const METHOD_FRAME_IN = 'Network.webSocketFrameReceived';
      const METHOD_FRAME_OUT = 'Network.webSocketFrameSent';
      if (method === METHOD_FRAME_IN || method === METHOD_FRAME_OUT) {
        // Get Frame
        const sendingType = method === METHOD_FRAME_IN ? IFrameSendingType.INC : IFrameSendingType.OUT;
        const { requestId, timestamp, response } = params as NetworkWebSocketParams;
        this.frameStore.addFrameEntry(sendingType, requestId, timestamp, response);
      }
    });

    chrome.debugger.onDetach.addListener(action(() => {
      this.isAttached = false;
    }));
  }


  startDebugging = () => {

    // Activate remount debugging in page
    chrome.debugger.attach({ tabId: this.tabId }, '1.3', action(() => {
      this.isAttached = true;
    }));

    // Command Debugger to use Network inspector module
    chrome.debugger.sendCommand({ tabId: this.tabId }, 'Network.enable', undefined, () => {
      if (chrome.runtime.lastError) {
        this.controlStore.networkEnabled = false;
        console.error(chrome.runtime.lastError.message);
      } else {
        this.controlStore.networkEnabled = true;
        console.log('Network enabled');
      }
    });
    // Creates title for inspector page
    chrome.tabs.get(this.tabId, (tab) => {
      if (tab.title) {
        document.title = `(tab.id = ${this.tabId}) WebSocket Inspector - ${tab.title} `;
      } else {
        document.title = 'WebSocket Inspector';
      }
    });
  };
}
