const eventsMap = new Map();
let rootElement = null;

export function addEvent(element, eventType, handler) {
  if (!eventsMap.has(handler)) {
    eventsMap.set(handler, { eventType, element });
  }
}

export function removeEvent(element, eventType, handler) {
  if (eventsMap.has(handler)) {
    if (rootElement) {
      rootElement.removeEventListener(eventType, handler);
    }
    eventsMap.delete(handler);
  }
}

export function setupEventListeners(root) {
  rootElement = root;

  eventsMap.forEach(({ eventType }, handler) => {
    rootElement.addEventListener(eventType, handler);
  });
}
