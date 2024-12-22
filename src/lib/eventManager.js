const eventsMap = new Map();

export function addEvent(element, eventType, handler) {
  const key = `${eventType}-${handler}`;
  if (!eventsMap.has(key)) {
    eventsMap.set(key, handler);
  }
}

export function removeEvent(element, eventType, handler) {
  const key = `${eventType}-${handler}`;
  if (eventsMap.has(key)) {
    eventsMap.delete(key);
  }
}

export function setupEventListeners(root) {
  eventsMap.forEach((handler, key) => {
    const [eventType] = key.split("-");
    root.addEventListener(eventType, handler);
  });
}
