const eventMap = new WeakMap(); // 메모리 누수를 방지하기 위해, Map 대신에 WeakMap 사용으로 변경한다

// 버블링 페이즈를 이용한 이벤트 리스너
export function setupEventListeners(root) {
  const eventTypes = [
    "click",
    "submit",
    "change",
    "input",
    "mouseover",
    "focus",
    "keydown",
  ];

  eventTypes.forEach((eventType) => {
    root.removeEventListener(eventType, handleEvent, false); // 업데이트 과정에서 이벤트가 중복으로 등록되는 현상이 발생한다. 등록하기 전에 삭제해줄 수 있도록 한다
    root.addEventListener(eventType, handleEvent, false);
  });
}

function handleEvent(event) {
  let target = event.target;
  const root = event.currentTarget;

  while (target && target !== root) {
    const elementEvents = eventMap.get(target);

    if (elementEvents?.has(event.type)) {
      const handlers = elementEvents.get(event.type);
      handlers.forEach((handler) => {
        handler({
          nativeEvent: event,
          target: event.target,
          currentTarget: target,
          type: event.type,
          preventDefault: () => event.preventDefault(),
          stopPropagation: () => event.stopPropagation(),
        });
      });
    }
    target = target.parentNode;
  }
}

export function addEvent(element, eventType, handler) {
  let elementEvents = eventMap.get(element);
  if (!elementEvents) {
    elementEvents = new Map();
    eventMap.set(element, elementEvents);
  }

  // Clear existing handlers for the event type
  if (elementEvents.has(eventType)) {
    elementEvents.get(eventType).clear();
  } else {
    elementEvents.set(eventType, new Set());
  }

  elementEvents.get(eventType).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const elementEvents = eventMap.get(element);
  if (!elementEvents?.has(eventType)) return;

  const handlers = elementEvents.get(eventType);
  if (handler) {
    // 특정 핸들러만 제거
    handlers.delete(handler);
    if (handlers.size === 0) {
      elementEvents.delete(eventType);
    }
  } else {
    // 해당 이벤트 타입의 모든 핸들러 제거
    elementEvents.delete(eventType);
  }

  // 모든 이벤트가 제거되었다면 요소 자체를 맵에서 제거
  if (elementEvents.size === 0) {
    eventMap.delete(element);
  }
}
