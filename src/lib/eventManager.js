const eventRegistry = new Map();
let container;

export function addEvent(element, eventType, handler) {
  if (!eventRegistry.has(element)) {
    eventRegistry.set(element, []);
  }

  const elementEvents = eventRegistry.get(element);
  elementEvents.push({ eventType, handler });
}

export function removeEvent(element, eventType, handler) {
  if (eventRegistry.has(element)) {
    const elementEvents = eventRegistry.get(element);
    const index = elementEvents.findIndex(
      (event) => event.eventType === eventType && event.handler === handler,
    );

    if (index !== -1) {
      if (container) {
        container.removeEventListener(eventType, handler);
      }
      elementEvents.splice(index, 1);
    }
  }
}

export function setupEventListeners(root) {
  container = root;
  eventRegistry.forEach((events) => {
    events.forEach(({ eventType, handler }) => {
      root.addEventListener(eventType, handler);
    });
  });
}
