const eventHandlers = new Map();
const registeredEvents = new Set();

// 1. container 에 이벤트 등록: 상위 요소에 이벤트 리스너를 등록
export function setupEventListeners(root) {
  eventHandlers.forEach((_, eventType) => {
    // 2. eventHandlers 의 키 값으로(이벤트명) 순회하며, 이벤트가 이미 등록되어 있는지 확인
    if (!registeredEvents.has(eventType)) {
      // 3. 이벤트 리스너를 상위 요소에 등록
      root.addEventListener(eventType, handleEvent);
      registeredEvents.add(eventType);
    }
  });
}

// 4. 이벤트 핸들러 함수: 이벤트가 발생하면 호출
function handleEvent(e) {
  const { type, target } = e;
  if (eventHandlers.has(type)) {
    const handlers = eventHandlers.get(type);
    handlers.forEach(({ selector, handler }) => {
      // 5. 이벤트가 발생한 요소가 특정 조건을 만족하는지 췍
      if (target === selector) {
        // 6. 핸들러 호출
        handler.call(target, e);
        console.log(eventHandlers);
      }
    });
  }
}

// 1. 이벤트 핸들러를 등록: 이벤트 핸들러를 등록
export function addEvent(selector, eventType, handler) {
  if (!eventHandlers.has(eventType)) {
    eventHandlers.set(eventType, []);
  }

  const handlers = eventHandlers.get(eventType);

  const isHandlerRegistered = handlers.some((eventObj) => {
    eventObj.selector === selector && eventObj.handler === handler;
    console.log(eventObj.selector, selector);
  });

  if (!isHandlerRegistered) {
    handlers.push({ selector, handler });
  }
}

// 1. 이벤트 핸들러를 제거: 이벤트 핸들러를 제거
export function removeEvent(selector, eventType, handler) {
  selector.removeEventListener(eventType, handler);
  registeredEvents.clear();
}
