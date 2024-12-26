const eventMap = new Map();
let rootElement = null;

function handleEvent(event) {
  let target = event.target;
  while (target && target !== rootElement) {
    const elementHandlers = eventMap.get(event.type)?.get(target);
    if (elementHandlers) {
      elementHandlers.forEach((handler) => handler(event));
    }
    target = target.parentElement;
  }
}

export function setupEventListeners(root) {
  rootElement = root;
  eventMap.forEach((handlers, eventType) => {
    rootElement.removeEventListener(eventType, handleEvent);
    rootElement.addEventListener(eventType, handleEvent);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new WeakMap());
  }
  const elementMap = eventMap.get(eventType);
  if (!elementMap.has(element)) {
    elementMap.set(element, new Set());
  }
  elementMap.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const elementMap = eventMap.get(eventType);
  if (!elementMap) return;

  const handlers = elementMap.get(element);
  if (handlers) {
    handlers.delete(handler);
    if (handlers.size === 0) {
      elementMap.delete(element);
    }
  }

  if (eventMap.size === 0) {
    eventMap.delete(eventType);
    if (rootElement && rootElement._listeners?.has(eventType)) {
      rootElement.removeEventListener(eventType, handleEvent, true);
      rootElement._listeners.delete(eventType);
    }
  }
}
