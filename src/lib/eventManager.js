const eventListeners = new Map();
let $root = null;

function handleEvent(e) {
  let target = e.target;

  while (target && target !== $root) {
    const handlers = eventListeners.get(e.type)?.get(target);
    if (handlers) {
      handlers.forEach((handler) => handler(e));
    }
    target = target.parentElement;
  }
}

export function setupEventListeners(root) {
  if (!root) return;
  $root = root;

  eventListeners.forEach((handlers, eventType) => {
    $root.removeEventListener(eventType, handleEvent);
    $root.addEventListener(eventType, handleEvent);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventListeners.has(eventType)) {
    eventListeners.set(eventType, new WeakMap());
  }

  const handlers = eventListeners.get(eventType);
  if (!handlers.has(element)) {
    handlers.set(element, new Set());
  }

  handlers.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const handlersMap = eventListeners.get(eventType);
  if (!handlersMap) return;

  const handlers = handlersMap.get(element);
  if (!handlers) return;

  if (handler) {
    handlers.delete(handler);

    if (handlers.size === 0) {
      handlersMap.delete(element);
    }
  } else {
    handlersMap.delete(element);
  }

  if (handlersMap.size === 0) {
    eventListeners.delete(eventType);
  }
}
