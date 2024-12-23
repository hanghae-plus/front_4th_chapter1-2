const eventRegistry = new Map();

export function addEvent(element, eventType, handler) {
  if (!eventRegistry.has(element)) {
    eventRegistry.set(element, new Map());
  }
  const events = eventRegistry.get(element);
  if (!events.has(eventType)) {
    events.set(eventType, new Set());
  }
  events.get(eventType).add(handler);
}

export function removeEvent(element, eventType, handler) {
  if (eventRegistry.has(element)) {
    const events = eventRegistry.get(element);
    if (events.has(eventType)) {
      events.get(eventType).delete(handler);
      if (events.get(eventType).size === 0) {
        events.delete(eventType);
      }
    }
    if (events.size === 0) {
      eventRegistry.delete(element);
    }
  }
}

export function setupEventListeners(root) {
  // 이벤트 위임을 위한 핸들러 맵
  const delegatedEvents = new Map();

  // 등록된 모든 이벤트와 핸들러를 순회
  eventRegistry.forEach((events) => {
    events.forEach((handlers, eventType) => {
      // 이벤트 타입별로 하나의 위임된 핸들러만 등록
      if (!delegatedEvents.has(eventType)) {
        const delegatedHandler = (event) => {
          // 이벤트가 발생한 요소부터 시작해서 상위로 올라가며 핸들러 찾기
          let target = event.target;
          while (target && target !== root) {
            if (eventRegistry.has(target)) {
              const targetEvents = eventRegistry.get(target);
              if (targetEvents.has(eventType)) {
                const handlers = targetEvents.get(eventType);
                handlers.forEach((handler) => handler(event));
              }
            }
            target = target.parentNode;
          }
        };

        // 루트 요소에 이벤트 위임 핸들러 등록
        root.addEventListener(eventType, delegatedHandler);
        delegatedEvents.set(eventType, delegatedHandler);
      }
    });
  });
}
