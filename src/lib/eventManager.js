/**
 * idea
 * 이벤트가 걸려있는 요소를 저장하여 위임된 이벤트를 처리한다.
 */

const eventHandlers = new Map();
let globalRoot = null;
export function setupEventListeners(root) {
  globalRoot = root;
  eventHandlers.forEach((event, element) => {
    if (root.contains(element)) {
      Object.entries(event).forEach(([eventType, handler]) => {
        root.addEventListener(eventType, handler);
      });
    }
  });
}

export function addEvent(element, eventType, handler) {
  let event = eventHandlers.get(element);
  if (!event) {
    event = {};
    event[eventType] = handler;
  }
  event[eventType] = handler;
  eventHandlers.set(element, event);
}

export function removeEvent(element, eventType, handler) {
  let event = eventHandlers.get(element);
  if (!event || !event[eventType]) {
    return;
  }
  if (!handler) {
    globalRoot.removeEventListener(eventType, event[eventType]);
  } else {
    globalRoot.removeEventListener(eventType, handler);
  }
  delete event[eventType];
}
