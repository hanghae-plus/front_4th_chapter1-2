/**
 * idea
 * 이벤트가 걸려있는 요소를 저장하여 위임된 이벤트를 처리한다.
 */

/**
 * eventHandlers Map
 * [eventType: WeakMap
 *  element: handler
 * ]
 */

export const eventMap = new Map();
function handleEvent(e) {
  const eventType = e.type;
  const elementEventMap = eventMap.get(eventType);

  if (!elementEventMap || !elementEventMap.has(e.target)) {
    return;
  }
  const handler = elementEventMap.get(e.target);
  handler(e);
}

export function setupEventListeners(root) {
  if (!eventMap.size) {
    return;
  }

  eventMap.forEach((elementEventMap, eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new WeakMap());
  }

  const elementEventMap = eventMap.get(eventType);
  elementEventMap.set(element, handler);
}

export function removeEvent(element, eventType) {
  const elementEventMap = eventMap.get(eventType);
  if (!elementEventMap || !elementEventMap.has(element)) {
    return;
  }

  elementEventMap.delete(element);

  if (elementEventMap.size === 0) {
    eventMap.delete(eventType);
  }
}
