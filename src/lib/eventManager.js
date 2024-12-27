let eventHandlers = {};

function handleEvents(event) {
  // 이벤트 전파가 중단된 경우 처리하지 않음
  // if (event.cancelBubble) return;

  const handlers = eventHandlers[event.type];
  if (!handlers) return;

  const handler = handlers.get(event.target);
  if (!handler) return;

  handler(event);
}

export function setupEventListeners(root) {
  for (const eventType in eventHandlers) {
    root.removeEventListener(eventType, handleEvents);
    root.addEventListener(eventType, handleEvents);
  }
}

export function addEvent(element, eventType, handler) {
  // if (!element || !eventType || typeof handler !== "function") return;

  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = new WeakMap();
  }

  const handlers = eventHandlers[eventType];
  handlers.set(element, handler);
}

export function removeEvent(element, eventType) {
  // if (!element || !eventType || typeof handler !== "function") return;

  if (eventHandlers[eventType] && eventHandlers[eventType].has(element)) {
    eventHandlers[eventType].delete(element);
  }
}

// export function clearEvent() {
//   eventHandlers = {};
// }
