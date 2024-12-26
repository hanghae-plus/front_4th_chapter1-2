const eventHandlers = {};

export function setupEventListeners(root) {
  Object.keys(eventHandlers).forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(event) {
  const handler = eventHandlers[event.type].get(event.target);

  if (!handler) return;

  handler(event);
}

export function addEvent(element, eventType, handler) {
  let elementHandlers = eventHandlers[eventType];
  if (!elementHandlers) {
    eventHandlers[eventType] = new WeakMap();
  }

  eventHandlers[eventType].set(element, handler);
}

export function removeEvent(element, eventType) {
  if (eventHandlers[eventType] && eventHandlers[eventType].has(element)) {
    eventHandlers[eventType].delete(element);
  }
}
