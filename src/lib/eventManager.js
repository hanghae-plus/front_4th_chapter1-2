const eventListeners = new Map();
let $root = null;

export function setupEventListeners(root) {
  if ($root) {
    eventListeners.forEach((_, eventType) => {
      $root.removeEventListener(eventType, handleEvent);
    });
    $root._listeners.clear();
  }

  $root = root;
  if (!$root._listeners) {
    $root._listeners = new Set();
  }

  eventListeners.forEach((_, eventType) => {
    $root.addEventListener(eventType, handleEvent);
    $root._listeners.add(eventType);
  });
}

function handleEvent(e) {
  let target = e.target;

  while (target && target !== $root) {
    const handlers = eventListeners.get(e.type)?.get(target);
    if (handlers) {
      handlers.forEach((handler) => handler(e));
    }
    target = target.parentNode;
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventListeners.has(eventType)) {
    eventListeners.set(eventType, new Map());
  }

  const elementMap = eventListeners.get(eventType);
  if (!elementMap.has(element)) {
    elementMap.set(element, new Set());
  }
  elementMap.get(element).add(handler);

  if ($root && !$root._listeners.has(eventType)) {
    $root._listeners.add(eventType);
  }
}

export function removeEvent(element, eventType, handler) {
  const elementMap = eventListeners.get(eventType);
  if (!elementMap) return;

  const handlers = elementMap.get(element);
  if (handlers) {
    handlers.delete(handler);
    if (handlers.size === 0) {
      elementMap.delete(element);
    }
  }

  if (elementMap.size === 0) {
    eventListeners.delete(eventType);

    if ($root && $root._listeners?.has(eventType)) {
      $root._listeners.delete(eventType);
    }
  }
}
