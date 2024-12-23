const eventManager = {};

export function setupEventListeners(root) {
  Object.keys(eventManager).forEach((eventType) => {
    const elementEventMap = eventManager[eventType];
    for (const handler of elementEventMap.value) {
      console.log(handler);
      root.addEventListener(eventType, handler);
    }
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventManager[eventType]) {
    eventManager[eventType] = new Map();
  }

  const elementEventMap = eventManager[eventType];
  elementEventMap.set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  console.log("removeEvent", element, eventType, handler);
}
