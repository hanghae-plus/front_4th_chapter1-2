// export function setupEventListeners(root) {}

export function addEvent(element, eventType, handler) {
  element.addEventListener(eventType, handler);
}

export function removeEvent(element, eventType, handler) {
  element.removeEvent(eventType, handler);
}
