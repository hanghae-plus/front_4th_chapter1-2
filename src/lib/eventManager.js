export function setupEventListeners(root) {
  console.log(`start event / my root: ${root}`);
}

export function addEvent(element, eventType, handler) {
  element.addEventListener(eventType, handler);
}

// export function removeEvent(element, eventType, handler) {}
