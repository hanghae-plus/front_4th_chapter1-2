const eventManager = {};

export function setupEventListeners(root) {
  registerGlobalEvents(root);
}

export function addEvent(element, eventType, handler) {
  if (!eventManager[eventType]) {
    eventManager[eventType] = new Map();
  }

  const elementEventMap = eventManager[eventType];
  elementEventMap.set(element, handler);
}

export function removeEvent(element, eventType) {
  if (eventManager[eventType] && eventManager[eventType].has(element)) {
    eventManager[eventType].delete(element);
  }
}

const handleGlobalEvents = (e) => {
  const handlers = eventManager[e.type];
  if (!handlers) return;

  for (const [element, handler] of handlers.entries()) {
    if (element.contains(e.target)) {
      handler(e);
      break;
    }
  }
};

const registerGlobalEvents = (root) => {
  Object.keys(eventManager).forEach((eventType) => {
    root.addEventListener(eventType, handleGlobalEvents);
  });
};
