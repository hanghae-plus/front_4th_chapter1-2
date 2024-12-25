const eventManager = new Map();

function eventHandler(event) {
  const eventType = event.type;
  const handlers = eventManager.get(eventType);

  if (handlers.has(event.target)) {
    const handler = handlers.get(event.target);
    handler(event);
  }
}

export function setupEventListeners(root) {
  eventManager.forEach((_, eventType) => {
    root?.removeEventListener(eventType, eventHandler);
    root?.addEventListener(eventType, eventHandler);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventManager.has(eventType)) {
    eventManager.set(eventType, new WeakMap());
  }

  const handlerCache = eventManager.get(eventType);
  handlerCache.set(element, handler);
}

export function removeEvent(element, eventType) {
  if (!eventManager.has(eventType)) {
    return;
  }

  const handlerCache = eventManager.get(eventType);
  handlerCache.delete(element);
}
