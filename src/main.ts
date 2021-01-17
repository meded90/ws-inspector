let panelCreated = false;
let loadCheckInterval: number;

function createPanelIfReactLoaded() {
  if (panelCreated) {
    return;
  }
  clearInterval(loadCheckInterval);
  const tabId = chrome.devtools.inspectedWindow.tabId;
  chrome.devtools.panels.create(
    '🔌 WebSoccket',
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
}


// Load (or reload) the DevTools extension when the user navigates to a new page.
function checkPageForReact() {
  // syncSavedPreferences();
  createPanelIfReactLoaded();
}

chrome.devtools.network.onNavigated.addListener(checkPageForReact);

// Check to see if React has loaded once per second in case React is added
// after page load
loadCheckInterval = setInterval(function() {
  createPanelIfReactLoaded();
}, 1000);

createPanelIfReactLoaded();
