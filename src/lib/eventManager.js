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
  if ($root) return;
  $root = root;

  eventListeners.forEach((handlers, eventType) => {
    $root.removeEventListener(eventType, handleEvent);
    $root.addEventListener(eventType, handleEvent);
  });

  // const supportedEvents = ["click", "input", "change", "submit"];

  // supportedEvents.forEach((eventType) => {
  //   if (!eventListeners.has(eventType)) {
  //     eventListeners.set(eventType, new Map());
  //   }

  //   root.addEventListener(eventType, handleEvent, true);
  // });
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
  const handlers = eventListeners.get(eventType);

  if (!handlers) return;

  const handlerList = handlers.get(element);
  if (handlerList) {
    handlerList.delete(handler);
    if (handlerList.size === 0) {
      handlers.delete(element);
    }
  }

  if (eventListeners.size === 0) {
    eventListeners.delete(eventType);
    if ($root && $root._listeners?.has(eventType)) {
      $root.removeEventListener(eventType, handleEvent, true);
      $root._listeners.delete(eventType);
    }
  }
}
