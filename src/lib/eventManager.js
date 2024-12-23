// 이벤트 핸들러를 저장
const eventHandlers = new WeakMap();

export function addEvent(element, eventType, handler) {
  if (!eventHandlers.has(element)) {
    eventHandlers.set(element, new Map());
  }

  const elementEvents = eventHandlers.get(element);

  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }

  elementEvents.get(eventType).add(handler);
}

export function removeEvent(element, eventType, handler) {
  if (!eventHandlers.has(element)) {
    return;
  }

  const elementEvents = eventHandlers.get(element);
  if (!elementEvents.has(eventType)) {
    return;
  }

  elementEvents.get(eventType).delete(handler);

  if (elementEvents.get(eventType).size === 0) {
    elementEvents.delete(eventType);
  }

  if (elementEvents.size === 0) {
    eventHandlers.delete(element);
  }
}

export function setupEventListeners(root) {
  // 지원할 이벤트 타입들
  const supportedEvents = [
    "click",
    "input",
    "change",
    "submit",
    "keydown",
    "keyup",
    "keypress",
    "mousedown",
    "mouseup",
    "mousemove",
  ];

  supportedEvents.forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      let target = event.target;

      while (target && target !== root) {
        if (eventHandlers.has(target)) {
          const elementEvents = eventHandlers.get(target);
          if (elementEvents.has(eventType)) {
            elementEvents.get(eventType).forEach((handler) => {
              handler.call(target, event);
            });
          }
        }
        target = target.parentElement;
      }
    });
  });
}
