const eventListeners = [];

export function setupEventListeners(root) {
  eventListeners.forEach(({ element, eventType, handler }, i) => {
    const boundHandler = (e) => {
      if (element === e.target) {
        handler(e);
      }
    };

    root.addEventListener(eventType, boundHandler);
    eventListeners[i] = {
      element,
      eventType,
      handler,
      remove: () => root.removeEventListener(eventType, boundHandler),
    };
  });
}

export function addEvent(element, eventType, handler) {
  eventListeners.push({ element, eventType, handler });
}

export function removeEvent(element, eventType, handler) {
  const deleteIndex = eventListeners.findIndex(
    (event) =>
      event.element === element &&
      event.eventType === eventType &&
      event.handler === handler,
  );
  eventListeners[deleteIndex].remove();
  eventListeners.splice(deleteIndex, 1);
}
