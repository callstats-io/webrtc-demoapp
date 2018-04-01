'use strict';

const port = chrome.runtime.connect();

port.onMessage.addListener((message) => {
  window.postMessage(message, '*');
});

window.addEventListener('message', (event) => {
  if (event.data === 'csioCheckAddonInstalled') {
    window.postMessage('csioAddonInstalled', '*');
  } else if (event.source === window) {
    port.postMessage(event.data);
  }
});
