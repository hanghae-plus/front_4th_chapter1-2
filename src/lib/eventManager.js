// 이벤트 타입
const EVENT_TYPES = {
  MOUSE: [
    "click",
    "mousedown",
    "mouseup",
    "mouseover",
    "mouseout",
    "mousemove",
  ],
  KEYBOARD: ["keydown", "keyup", "keypress"],
  FORM: ["submit", "input", "change", "focus", "blur"],
  TOUCH: ["touchstart", "touchend", "touchmove"],
  DRAG: ["drag", "drop"],
};

// 모든 지원 이벤트를 하나의 배열로 변환
const SUPPORTED_EVENTS = Object.values(EVENT_TYPES).flat();

const eventMap = new WeakMap(); // Map 대신 WeakMap 사용

function getEventHandlers(element, eventType) {
  const elementEvents = eventMap.get(element);
  return elementEvents?.get(eventType) ?? new Set();
}

function initializeEventMap(element) {
  if (!eventMap.has(element)) {
    eventMap.set(element, new Map());
  }
  return eventMap.get(element);
}

export function setupEventListeners(root) {
  const handleEvent = (e) => {
    let target = e.target;
    while (target && target !== root) {
      const handlers = getEventHandlers(target, e.type);
      handlers.forEach((handler) => handler(e));
      target = target.parentNode;
    }
  };

  SUPPORTED_EVENTS.forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });

  // cleanup 함수 반환
  return () => {
    SUPPORTED_EVENTS.forEach((eventType) => {
      root.removeEventListener(eventType, handleEvent);
    });
  };
}

export function addEvent(element, eventType, handler) {
  if (!SUPPORTED_EVENTS.includes(eventType)) {
    console.warn(`Unsupported event type: ${eventType}`);
    return;
  }

  const elementEvents = initializeEventMap(element);
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }
  elementEvents.get(eventType).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const elementEvents = eventMap.get(element);
  if (!elementEvents) return;

  if (handler) {
    const handlers = elementEvents.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        elementEvents.delete(eventType);
      }
    }
  } else {
    elementEvents.delete(eventType);
  }

  if (elementEvents.size === 0) {
    eventMap.delete(element);
  }
}
