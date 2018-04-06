'use strict';

function triggerEvent(name, detail) {
  const newEvent = new CustomEvent(name, {'detail': detail});
  document.dispatchEvent(newEvent);
}

export { triggerEvent };
