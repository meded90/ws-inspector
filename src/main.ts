const tabId = chrome.devtools.inspectedWindow.tabId;
chrome.devtools.panels.create(
  '🔌 WebSocket',
  '',
  `inspector.html?${tabId}`,
  extensionPanel => {
    console.log(`===  \n create \n===`);
    extensionPanel.onShown.addListener(panel => {
      console.log(`===  \n onShown.addListener \n===`);
    });
    extensionPanel.onHidden.addListener(panel => {
      // TODO: Stop highlighting and stuff.
      console.log(`===  \n onHidden.addListener \n===`);
    });
  },
);

chrome.devtools.network.onNavigated.removeListener(function() {
  console.log(`===  \n onNavigated.removeListener \n===`);
});

chrome.devtools.network.onNavigated.addListener(function onNavigated() {
  console.log(`===  \n onNavigated.addListener \n===`);
});
