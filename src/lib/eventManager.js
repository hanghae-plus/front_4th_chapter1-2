const eventMap = new Map();
let rootElement = null;

export function setupEventListeners(root) {
  rootElement = root;
  eventMap.forEach((handlers, eventType) => {
    rootElement.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(event) {
  let target = event.target;
  const elementHandlers = eventMap.get(event.type).get(target);
  if (elementHandlers) {
    elementHandlers.forEach((handler) => handler(event));
  }
}

export function addEvent(element, eventType, handler) {
  eventMap.set(eventType, new WeakMap());
  const elementMap = eventMap.get(eventType);
  elementMap.set(element, new Set());
  elementMap.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const elementMap = eventMap.get(eventType);
  const elementHandlers = elementMap.get(element);
  if (elementHandlers) {
    elementHandlers.delete(handler);
    if (elementHandlers.size === 0) {
      elementMap.delete(element);
    }
  }
}
