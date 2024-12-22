const eventMap = new WeakMap(); // 메모리 누수를 방지하기 위해, Map 대신에 WeakMap 사용으로 변경한다

// 버블링 페이즈를 이용한 이벤트 리스너
export function setupEventListeners(root) {
  const eventTypes = ["click", "submit", "change", "input"];

  eventTypes.forEach((eventType) => {
    root.addEventListener(
      eventType,
      (event) => {
        let target = event.target;

        // 이벤트 버블링 체인을 따라 올라가며 핸들러를 찾음
        while (target && target !== root) {
          const elementEvents = eventMap.get(target);

          // 해당 요소에 등록된 이벤트 핸들러가 있다면 실행
          if (elementEvents?.has(eventType)) {
            const handlers = elementEvents.get(eventType);
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
      },
      false, // 캡처링 페이즈에서 이벤트를 처리여부, false는 버블링 페이즈에서 처리하는 것을 의미
    );
  });
}

export function addEvent(element, eventType, handler) {
  // WeakMap에서 요소의 이벤트 맵 가져오기
  let elementEvents = eventMap.get(element);
  if (!elementEvents) {
    elementEvents = new Map(); // Q. 여기서는 Map으로 생성하는 이유는 무엇일까? A. WeakMap은 키가 객체이므로, 객체를 키로 사용하기 위해서는 Map을 사용해야 한다
    eventMap.set(element, elementEvents);
  }

  // 이벤트 타입에 대한 핸들러 Set 가져오기
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }

  // 핸들러 추가
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
