// 요소와 이벤트 타입을 기반으로 저장 DOM 요소가 삭제되면 해당 키와 값이 자동으로 제거되므로 메모리 누수 방지
// 특정 요소(key, element)에 대해 여러 핸들러(뭘 할건지)를 관리하기 위해
const eventHandlers = new Map();
// 이벤트 타입(key, eventType)별로 루트 요소에 리스너 등록, 발생한 이벤트 해당 핸들러로 전달
const rootEvent = new Map();

// 루트에서 이벤트를 위임 처리
function handleEvent(event, root) {
  let target = event.target;

  // 이벤트 전파를 따라가며 핸들러 호출
  while (target && target !== root) {
    const handlersMap = eventHandlers.get(target);

    if (handlersMap && handlersMap.has(event.type)) {
      handlersMap.get(event.type).forEach((handler) => handler(event)); // 핸들러 호출
    }

    target = target.parentNode; // 부모로 이동
  }
}

export function setupEventListeners(root) {
  //이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록한다.
  // rootEvent의 각 이벤트 타입에 대해 리스너를 등록
  rootEvent.forEach((listener, eventType) => {
    if (listener) return; // 이미 등록된 경우 무시

    const rootListener = (event) => handleEvent(event, root); // 위임된 이벤트 처리
    rootEvent.set(eventType, rootListener); // 리스너 저장
    root.addEventListener(eventType, rootListener); // 리스너 등록
  });
}

export function addEvent(element, eventType, handler) {
  if (eventHandlers.has(element)) return;

  eventHandlers.set(element, new Map());

  const handlersMap = eventHandlers.get(element);
  if (!handlersMap.has(eventType)) {
    handlersMap.set(eventType, new Set());
  }
  handlersMap.get(eventType).add(handler);

  //초기화 => 이거 해주니까 통과..
  //이벤트 타입이 rootEvent에 등록되지 않은 경우 rootEvent에 등록
  if (!rootEvent.has(eventType)) {
    rootEvent.set(eventType, null); // 이벤트 전파를 위임할 리스트
    setupEventListeners(document.body); // rootElement에 이벤트를 등록
  }
}

export function removeEvent(element, eventType, handler) {
  const handlersMap = eventHandlers.get(element);
  if (!handlersMap) return;

  const handlers = handlersMap.get(eventType);
  if (!handlers) return;

  handlers.delete(handler);
  if (handlers.size === 0) {
    handlersMap.delete(eventType);
    if (handlersMap.size === 0) {
      eventHandlers.delete(element);
    }
  }
}
