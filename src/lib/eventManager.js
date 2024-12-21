// eventManager.js
const eventMap = new Map();
let rootElement = null;

export function setupEventListeners(root) {
  rootElement = root;
  eventMap.forEach((handlers, eventType) => {
    rootElement.removeEventListener(eventType, handleEvent);
    rootElement.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(event) {
  let target = event.target;
  while (target && target !== rootElement) {
    const elementHandlers = eventMap.get(event.type)?.get(target);
    if (elementHandlers) {
      elementHandlers.forEach((handler) => handler(event));
    }
    target = target.parentNode;
  }
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

  // 해당 이벤트 타입에 대한 모든 핸들러가 제거되었다면 리스너도 제거
  if (elementMap.size === 0) {
    eventMap.delete(eventType);
    if (rootElement && rootElement._listeners?.has(eventType)) {
      rootElement.removeEventListener(eventType, handleEvent, true);
      rootElement._listeners.delete(eventType);
    }
  }
}
