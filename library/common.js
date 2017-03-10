'use strict';

function triggerEvent(name, detail) {
  var newEvent = new CustomEvent(name, {'detail': detail});
  document.dispatchEvent(newEvent);
}

module.exports.triggerEvent = triggerEvent;
