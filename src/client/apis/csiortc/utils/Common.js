'use strict';

function triggerEvent(name, detail) {
  const newEvent = new CustomEvent(name, {'detail': detail});
  document.dispatchEvent(newEvent);
}

const csioConfigParams = {
  disableBeforeUnloadHandler: false,
  applicationVersion: 'v1.0'
};

export { triggerEvent, csioConfigParams };
