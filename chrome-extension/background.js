'use strict';

chrome.runtime.onConnect.addListener( (port) => {
  function onResponse( sourceId ) {
    if(!sourceId || !sourceId.length) {
      port.postMessage('PermissionDeniedError');
    } else {
      port.postMessage( {sourceId: sourceId} );
    }
  }

  port.onMessage.addListener( (evt, sender) => {
    if( evt !== 'requestScreenSourceId' ) {
      return;
    }
    chrome.desktopCapture.chooseDesktopMedia(
      ['screen', 'window'],
      sender.tab,
      onResponse
    );
  }, port.sender);
});