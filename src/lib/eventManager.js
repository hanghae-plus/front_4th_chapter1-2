/**
 * globalEvents
 * {
 *  click: {
 *    element: handler
 *  }
 * }
 */

let globalEvents = {};

// 콜백으로 넣으면 add할때의 remove할때의 콜백이 다를 수 있음
/**
 *
 * @param {HTMLElement} root
 */
export function setupEventListeners(root) {
  for (const eventType in globalEvents) {
    root.addEventListener(eventType, handleGlobalEvents);
  }
}

export function handleGlobalEvents(e) {
  let target = e.target;
  // 버블링 처리
  while (target) {
    if (globalEvents[e.type].has(target)) {
      globalEvents[e.type].get(target)(e);
    }
    target = target.parentElement;
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
