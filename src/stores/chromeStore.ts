/// <reference types="chrome"/>
import { FrameStore } from './frameStore';
import { ControlStore } from './controlStore';
import { NetworkWebSocketParams } from '../viewer/types';

/*
  ChromeStore is used for attaching debugger to a certain page and defining  listeners for
  WebSockets.
  Main goal:
  (1) to make a connection between tab and inspector,
  (2) to setup listeners for WebSockets events
 */
export class ChromeStore {
  tabId: number = parseInt(window.location.search.substr(1), 10);

  constructor(private frameStore: FrameStore, private controlStore: ControlStore) {
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
    // Main function to listen Network events
    chrome.debugger.onEvent.addListener((source, method, params) => {
      const METHOD_FRAME_IN = 'Network.webSocketFrameReceived';
      const METHOD_FRAME_OUT = 'Network.webSocketFrameSent';
      if (source.tabId !== this.tabId && !this.controlStore.isCapturing) {
        return;
      }
      if (method === METHOD_FRAME_IN || method === METHOD_FRAME_OUT) {
        // Get Frame
        const sendingType = method === METHOD_FRAME_IN ? 'incoming' : 'outgoing';
        const { requestId, timestamp, response } = params as NetworkWebSocketParams;
        this.frameStore.addFrameEntry(sendingType, requestId, timestamp, response);
      }
    });
  }

  startDebugging() {
    // Command Debugger to use Network inspector module
    chrome.debugger.sendCommand({ tabId: this.tabId }, 'Network.enable', undefined, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
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
  }
}
