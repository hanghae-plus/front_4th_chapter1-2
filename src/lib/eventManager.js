const eventListeners = new Set();

export function setupEventListeners(root) {
  eventListeners.forEach(({ element, eventType, handler }) => {
    root.addEventListener(eventType, (e) => {
      if (element === e.target) {
        handler(e);
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  eventListeners.add({ element, eventType, handler });
}

// export function removeEvent(element, eventType, handler) {}
