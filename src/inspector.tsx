/// <reference types="chrome"/>
import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import App from './viewer/App';
import { NetworkWebSocketParams } from './viewer/types';
import FrameDataArray from './FrameData';

// gets tabId of inspected window from URL
const tabId = parseInt(window.location.search.substr(1), 10);
// TODO create
const handlers: any = {};
const frameDataArray = new FrameDataArray();

function startDebugging() {
  // Command Debugger to use Network inspector module
  chrome.debugger.sendCommand({ tabId }, 'Network.enable', undefined, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    } else {
      console.log('Network enabled');
    }
  });
  // Creates title for inspector page
  chrome.tabs.get(tabId, (tab) => {
    if (tab.title) {
      document.title = `(tab.id = ${tabId}) WebSocket Inspector - ${tab.title} `;
    } else {
      document.title = 'WebSocket Inspector';
    }
  });
}
// Restarts Network debugging on command
chrome.runtime.onMessage.addListener((message) => {
  if (message.message === 'reattach' && message.tabId === tabId) {
    startDebugging();
  }
});
// Starts Network debugging on load
window.addEventListener('load', () => {
  startDebugging();
});
// Old function to listen Network events TODO refactor to core
chrome.debugger.onEvent.addListener((debuggee, message, params) => {
  if (debuggee.tabId !== tabId) {
    return;
  }

  // What does this do?
  if (handlers[message]) {
    handlers[message](params);
  }
});
// New function to listen Network events
chrome.debugger.onEvent.addListener((source, method, params) => {
  const METHOD_FRAME_IN = 'Network.webSocketFrameReceived',
    METHOD_FRAME_OUT = 'Network.webSocketFrameSent';
  if (source.tabId !== tabId) {
    return;
  }
  if (method === METHOD_FRAME_IN || method === METHOD_FRAME_OUT) {
    // Get Frame
    const sendingType = method === METHOD_FRAME_IN ? 'incoming' : 'outgoing';
    const { requestId, timestamp, response } = params as NetworkWebSocketParams;
    frameDataArray.addFrameEntry(sendingType, requestId, timestamp, response);
    console.log({ frameDataArray });
    let abs = frameDataArray.getFrameViewArray();
    console.log({ abs });
  }
});

const frameViewArray = frameDataArray.getFrameViewArray();
ReactDOM.render(
  <App handlers={handlers} frameViewArray={frameViewArray} />,
  document.getElementById('root')
);
