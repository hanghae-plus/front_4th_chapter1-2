const eventManager = () => {
  const events = {};

  const scopedEventHandler = (e) => {
    const targetgetEvent = events[e.type].get(e.target);
    if (targetgetEvent) targetgetEvent(e);
  };

  const setupEventListeners = (root) => {
    for (const eventType in events) {
      root.removeEventListener(eventType, scopedEventHandler);
      root.addEventListener(eventType, scopedEventHandler);
    }
  };

  const addEvent = (element, eventType, handler) => {
    if (!events[eventType]) {
      events[eventType] = new WeakMap();
    }
    events[eventType].set(element, handler);
  };

  const removeEvent = (element, eventType, handler) => {
    if (events[eventType].get(element) === handler) {
      events[eventType].delete(element);
    }
  };

  return { setupEventListeners, addEvent, removeEvent };
};
export const { setupEventListeners, addEvent, removeEvent } = eventManager();
