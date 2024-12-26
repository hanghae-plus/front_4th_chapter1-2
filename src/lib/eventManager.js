// eventMap: 이벤트 타입별로 요소와 해당 요소의 이벤트 핸들러를 저장.
// getEventListener의 반환 형태 참고.
// { click : { { type : click, listener : f }, ... }
const eventMap = new Map();
let rootElement = null;

export function setupEventListeners(root) {
  rootElement = root;

  // 이벤트 위임(feat. 버블링)
  eventMap.forEach((_, eventType) => {
    rootElement.removeEventListener(eventType, handleEvent);
    rootElement.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(e) {
  let element = e.target;

  while (element && element !== rootElement) {
    if (!eventMap.has(e.type)) return;

    const elementMap = eventMap.get(e.type);
    const handlers = elementMap.get(element);

    if (handlers) {
      handlers.forEach((handler) => handler(e));
    }

    element = element.parentNode; // 상위 요소로 이동.
  }
}

// eventType > element > handler 순으로 체크.
export function addEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Map());
  }

  const elementMap = eventMap.get(eventType);

  if (!elementMap.has(element)) {
    elementMap.set(element, new Set()); // handler의 내용은 중복되면 안되므로 set 사용.
  }

  const handlers = elementMap.get(element);

  handlers.add(handler);
}

// eventType > element > handler 순으로 체크.
export function removeEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) return;
  const elementMap = eventMap.get(eventType);

  if (!elementMap.has(element)) return;
  const handlers = elementMap.get(element);

  if (handlers) {
    handlers.delete(handler);

    // 만약 엘리먼트만 있고 핸들러는 없다면 엘리먼트도 삭제할 것. (메모리 및 공간 이슈 방지)
    if (handlers.size === 0) {
      elementMap.delete(element);
    }
  }
}
