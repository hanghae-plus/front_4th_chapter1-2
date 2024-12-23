const eventsMap = new Map();
let rootElement = null;

export function addEvent(element, eventType, handler) {
  if (!eventsMap.has(handler)) {
    eventsMap.set(handler, { eventType, element });
  }
}

export function removeEvent(element, eventType, handler) {
  if (eventsMap.has(handler)) {
    const { eventType: storedEventType, element: storedElement } =
      eventsMap.get(handler);

    if (storedEventType === eventType && storedElement === element) {
      if (rootElement) {
        rootElement.removeEventListener(eventType, handler);
      }
      eventsMap.delete(handler);
    }
  }
}

export function setupEventListeners(root) {
  if (rootElement) {
    eventsMap.forEach(({ eventType }, handler) => {
      rootElement.removeEventListener(eventType, handler);
    });
  }

  rootElement = root;

  eventsMap.forEach(({ eventType }, handler) => {
    rootElement.addEventListener(eventType, handler);
  });
}
