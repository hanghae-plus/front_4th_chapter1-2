/**
 * globalEvents
 * {
 *  click: {
 *    element: handler
 *  }
 * }
 */

let globalEvents = {};

export function setupEventListeners(root) {
  Object.entries(globalEvents).forEach(([eventType, eventsMap]) => {
    root.addEventListener(eventType, (e) => handleGlobalEvents(e, eventsMap));
  });
}

export function handleGlobalEvents(e, eventsMap) {
  if (eventsMap.has(e.target)) {
    eventsMap.get(e.target)(e);
  }
}

export function addEvent(element, eventType, handler) {
  if (!element || typeof handler !== "function") return;

  globalEvents[eventType] = globalEvents[eventType] || new WeakMap();
  globalEvents[eventType].set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  if (globalEvents[eventType].get(element) === handler) {
    globalEvents[eventType].delete(element);
  }
}

export function clearEvents() {
  globalEvents = {};
}

window.__myEventListeners = globalEvents;
