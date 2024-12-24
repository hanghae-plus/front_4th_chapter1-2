const eventHandlers = {};

export function setupEventListeners(root) {
  Object.keys(eventHandlers).forEach((eventType) => {
    root.addEventListener(eventType, handleEvents);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = new WeakMap();
  }

  const elementHandlerMap = eventHandlers[eventType];
  elementHandlerMap.set(element, handler);
}

export function removeEvent(element, eventType) {
  if (eventHandlers[eventType] && eventHandlers[eventType].has(element)) {
    eventHandlers[eventType].delete(element);
  }
}

function handleEvents(e) {
  const handlers = eventHandlers[e.type];
  if (!handlers) return;

  const handler = handlers.get(e.target);
  if (!handler) return;

  handler(e);
}
