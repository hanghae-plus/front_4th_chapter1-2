const eventsMap = new Map();
let rootElement = null;

export function addEvent(element, eventType, handler) {
  if (!eventsMap.has(eventType)) {
    eventsMap.set(eventType, new Map());
  }

  const handlers = eventsMap.get(eventType);
  handlers.set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  if (eventsMap.has(eventType)) {
    const handlers = eventsMap.get(eventType);

    if (handlers.has(element)) {
      const storedHandler = handlers.get(element);
      if (handler === storedHandler) {
        rootElement.removeEventListener(eventType, storedHandler);
        handlers.delete(element);
      }
    }
  }
}

export function setupEventListeners(root) {
  rootElement = root;

  eventsMap.forEach((_, eventType) => {
    rootElement.removeEventListener(eventType, eventHandler);
    rootElement.addEventListener(eventType, eventHandler);
  });
}

function eventHandler(event) {
  const type = event.type;
  const handlers = eventsMap.get(type);

  if (handlers.has(event.target)) {
    const handler = handlers.get(event.target);
    handler(event);
  }
}
