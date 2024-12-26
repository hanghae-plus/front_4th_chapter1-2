const eventManager = new Map();

function createSyntheticEvent(event) {
  let propagationStopped = false;
  return {
    type: event.type,
    target: event.target,
    currentTarget: event.target,
    preventDefault() {
      event.preventDefault();
    },
    stopPropagation() {
      propagationStopped = true;
      event.stopPropagation();
    },
    isPropagationStopped() {
      return propagationStopped;
    },
    nativeEvent: event,
  };
}

function handleGlobalEvent(event) {
  event = createSyntheticEvent(event);
  const eventType = event.type;
  const handlers = eventManager.get(eventType);

  let currentElement = event.target;
  while (currentElement && !event.isPropagationStopped()) {
    if (handlers.has(currentElement)) {
      const handler = handlers.get(currentElement);
      handler(event);
    }
    currentElement = currentElement.parentElement;
  }
}

export function setupEventListeners(root) {
  eventManager.forEach((_, eventType) => {
    root?.removeEventListener(eventType, handleGlobalEvent);
    root?.addEventListener(eventType, handleGlobalEvent);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventManager.has(eventType)) {
    eventManager.set(eventType, new WeakMap());
  }

  const handlerCache = eventManager.get(eventType);
  handlerCache.set(element, handler);
}

export function removeEvent(element, eventType) {
  if (!eventManager.has(eventType)) {
    return;
  }

  const handlerCache = eventManager.get(eventType);
  handlerCache.delete(element);
}
