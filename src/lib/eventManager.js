export const eventRegistry = new Map();

export function addEvent(element, eventType, handler) {
  if (!eventRegistry.has(element)) {
    eventRegistry.set(element, {});
  }

  const elementEvents = eventRegistry.get(element);

  if (!elementEvents[eventType]) {
    elementEvents[eventType] = new Set();
  }

  elementEvents[eventType].add(handler);
}

export function removeEvent(element, eventType, handler) {
  if (eventRegistry.has(element)) {
    const elementEvents = eventRegistry.get(element);

    if (elementEvents[eventType]) {
      elementEvents[eventType].delete(handler);
      if (elementEvents[eventType].size === 0) {
        delete elementEvents[eventType];
        element.removeEventListener(eventType, handler);
      }
    }
  }
}

export const eventDelegation = (event) => {
  const target = event.target;

  eventRegistry.forEach((elementEvents, registeredElement) => {
    if (registeredElement.contains(target)) {
      const handlers = elementEvents[event.type];
      handlers?.forEach((handler) => handler.call(target, event));
    }
  });
};

export function setupEventListeners(root) {
  if (!eventRegistry.size) return;

  const eventTypes = new Set();

  eventRegistry.forEach((elementEvents) => {
    Object.keys(elementEvents).forEach((eventType) => {
      if (!eventTypes.has(eventType)) {
        eventTypes.add(eventType);
        root.addEventListener(eventType, eventDelegation);
      }
    });
  });
}
