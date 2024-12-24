const eventMap = new Map();

// DOM 이벤트 목록
const SUPPORTED_EVENTS = [
  "click",
  "submit",
  "input",
  "change",
  "focus",
  "blur",
  "keydown",
  "keyup",
  "keypress",
  "mousedown",
  "mouseup",
  "mouseover",
  "mouseout",
  "mousemove",
  "touchstart",
  "touchend",
  "touchmove",
  "drag",
  "drop",
];

export function setupEventListeners(root) {
  // 모든 지원 이벤트에 대해 리스너 등록
  SUPPORTED_EVENTS.forEach((eventType) => {
    root.addEventListener(eventType, (e) => {
      let target = e.target;
      while (target && target !== root) {
        if (eventMap.has(target)) {
          const handlers = eventMap.get(target).get(eventType);
          if (handlers) {
            handlers.forEach((handler) => handler(e));
          }
        }
        target = target.parentNode;
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  // 새로운 요소의 이벤트 등록
  if (!eventMap.has(element)) {
    eventMap.set(element, new Map());
  }
  const elementEvents = eventMap.get(element);
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }
  elementEvents.get(eventType).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const elementEvents = eventMap.get(element);
  if (!elementEvents) return;

  // 특정 핸들러만 제거
  if (handler) {
    const handlers = elementEvents.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        elementEvents.delete(eventType);
      }
    }
  } else {
    // 해당 이벤트 타입의 모든 핸들러 제거
    elementEvents.delete(eventType);
  }

  // 요소의 모든 이벤트가 제거되면 Map에서도 제거
  if (elementEvents.size === 0) {
    eventMap.delete(element);
  }
}
