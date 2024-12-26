// 사용 중인 이벤트를 담을 객체
// 이벤트 저장소
const eventMap = new Map();
// {element : {eventType : handler}} 형식으로 저장
let rootElement = null;

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(element)) {
    eventMap.set(element, new Map());
  }
  eventMap.get(element).set(eventType, handler);
}

export function setupEventListeners(root) {
  // 기존 리스너 제거
  if (rootElement) {
    const handlers = rootElement._eventHandlers || new Map();
    for (const [type, handler] of handlers) {
      rootElement.removeEventListener(type, handler);
    }
  }

  rootElement = root;
  rootElement._eventHandlers = new Map();

  for (const eventData of eventMap) {
    const eventTypeMap = eventData[1];
    for (const eventTypeData of eventTypeMap) {
      const eventType = eventTypeData[0];
      if (!rootElement._eventHandlers.has(eventType)) {
        const eventHandler = (event) => handleEvent(event);
        rootElement._eventHandlers.set(eventType, eventHandler);
        rootElement.addEventListener(eventType, eventHandler);
      }
    }
  }
}

export function handleEvent(event) {
  let target = event.target;
  const eventType = event.type;

  while (target && target !== rootElement) {
    if (eventMap.has(target)) {
      const handler = eventMap.get(target).get(eventType);
      if (handler) {
        // console.log("여기 에러나나", handler, event)
        handler?.(event);
      }
    }
    target = target.parentElement;
  }
}

export function removeEvent(element, eventType) {
  if (!eventMap.has(element)) return;

  const elementEvents = eventMap.get(element);
  elementEvents.delete(eventType);

  if (elementEvents.size === 0) {
    eventMap.delete(element);
  }

  // 해당 이벤트 타입에 대한 리스너가 더 이상 필요없는 경우
  if (![...eventMap.values()].some((map) => map.has(eventType))) {
    const handler = rootElement._eventHandlers?.get(eventType);
    if (handler) {
      rootElement.removeEventListener(eventType, handler, true);
      rootElement._eventHandlers.delete(eventType);
    }
  }
}
