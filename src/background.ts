import './img/icon-128.png';
import Window from 'chrome';

type inspectorMask = {
  id: number;
  popup: Window; // https://developer.chrome.com/extensions/windows#type-Window
  active: boolean;
};
// a list of created inspector windows
const inspectors: inspectorMask[] = [];
// Deletes removed inspectors mask from array
chrome.windows.onRemoved.addListener((id) => {
  const pos = inspectors.findIndex(({ popup }) => popup.id === id);
  if (pos >= 0) {
    if (inspectors[pos].active) {
      chrome.debugger.detach({ tabId: inspectors[pos].id });
    }
    inspectors.splice(pos, 1);
  }
});
// Listens to possible Detachment of existing inspector windows
chrome.debugger.onDetach.addListener(({ tabId }) => {
  const inspector = inspectors.find(({ id }) => id === tabId);
  if (inspector) {
    inspector.active = false;
  }
});

// Listens to clicks on extension icon
chrome.browserAction.onClicked.addListener((tab) => {
  // Checks if there is an existing inspector window
  const inspector = inspectors.find(({ id }) => id === tab.id);
  // if true it gets focus
  if (inspector && inspector.active) {
    chrome.windows.update(inspector.popup.id, { focused: true });
  } else {
    // else attaches debugger to the given target
    chrome.debugger.attach({ tabId: tab.id }, '1.0', () => {
      // All module of callback executes after attachment attempt
      // signalize if attachment attempt failed
      if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
      }

      // inspector Local and inspector should be identical  TODO delete inspectorLocal?
      const inspectorLocal = inspectors.find(({ id }) => id === tab.id);
      // if inspector window exists it get reattached and focused
      if (inspectorLocal) {
        inspectorLocal.active = true;
        chrome.runtime.sendMessage({
          message: 'reattach',
          tabId: tab.id,
        });
        chrome.windows.update(inspectorLocal.popup.id, { focused: true });
        // else inspector windows created and new object pushed to inspectors array
      } else {
        chrome.windows.create(
          {
            url: `inspector.html?${tab.id}`,
            type: 'popup',
            width: 800,
            height: 600,
          },
          (wnd) => {
            inspectors.push({ id: tab.id, popup: wnd, active: true });
          }
        );
      }
    });
  }
});
