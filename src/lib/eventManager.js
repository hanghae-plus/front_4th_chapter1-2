//TODO: 여기 코드 다시 살펴보기

// 전역 이벤트 맵
const eventMap = new WeakMap();
// 이벤트 리스너가 설정된 요소들을 추적
const initializedElements = new WeakSet();

export function setupEventListeners(root) {
  // 이미 초기화된 요소라면 다시 설정하지 않음
  if (initializedElements.has(root)) {
    return;
  }

  const eventHandler = (event) => {
    let target = event.target;

    while (target && target !== root) {
      const handlers = eventMap.get(target);
      if (handlers && handlers[event.type]) {
        handlers[event.type](event);
        if (event.cancelBubble) break;
      }
      target = target.parentNode;
    }
  };

  // 이벤트 리스너 등록
  root.addEventListener("click", eventHandler);
  root.addEventListener("input", eventHandler);
  root.addEventListener("change", eventHandler);

  // 초기화된 요소로 표시
  initializedElements.add(root);
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(element)) {
    eventMap.set(element, {});
  }
  const handlers = eventMap.get(element);
  handlers[eventType] = handler;
}

export function removeEvent(element, eventType) {
  if (eventMap.has(element)) {
    const handlers = eventMap.get(element);
    delete handlers[eventType];

    if (Object.keys(handlers).length === 0) {
      eventMap.delete(element);
    }
  }
}
