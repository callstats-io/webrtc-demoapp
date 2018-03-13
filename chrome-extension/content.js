'use strict';

const port = chrome.runtime.connect();

port.onMessage.addListener( (message) => {
  window.postMessage(message, '*');
});

window.addEventListener('screenShareEvent', (event)=> {
  if( event.data === 'addonInstalled' ) {
    window.postMessage( 'addonInstalled', '*' );
  } else if (event.source === window) {
    port.postMessage( event.data );
  }
});