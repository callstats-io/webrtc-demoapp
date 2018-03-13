'use strict';

chrome.runtime.onConnect.addListener( (port) => {
  const onScreenSourceID = (sourceId) => {
    if(!sourceId || !sourceId.length) {
      port.postMessage('PermissionDeniedError');
    } else {
      port.postMessage( {'csioSourceId': sourceId,
        'evt': 'onCsioSourceId'} );
    }
  };

  const onCSIORequest = (evt) => {
    if( evt !== 'csioRequestScreenSourceId' ) {
      return;
    }
    chrome.desktopCapture.chooseDesktopMedia(
      ['screen', 'window'],
      port.sender.tab,
      onScreenSourceID
    );
  };
  port.onMessage.addListener(onCSIORequest );
});