// Map(이벤트타입 : Map(요소: Set(), 요소: (핸들러1, 핸들러2), 요소: (핸들러1) ))

const eventHandlers = new Map();
let rootElement = null;

function delegateEvent(event) {
  let target = event.target;

  //루트 노드까지 올라가며 이벤트가 발생한 요소를 찾아 그 요소의 핸들러를 실행
  while (target && target !== rootElement) {
    const handlers = eventHandlers.get(event.type)?.get(target);
    if (handlers) {
      handlers.forEach((handler) => handler(event));
    }
    target = target.parentNode;
  }
}

export function setupEventListeners(root) {
  // 새로운 root 설정
  // 1. 기존 이벤트 리스너 제거
  if (rootElement && rootElement !== root) {
    eventHandlers.forEach((_, eventType) => {
      rootElement.removeEventListener(eventType, delegateEvent);
    });
  }

  //2. 기존에 등록된 이벤트 root에 등록
  if (rootElement !== root) {
    rootElement = root;
    eventHandlers.forEach((_, eventType) => {
      rootElement.addEventListener(eventType, delegateEvent);
    });
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventHandlers.has(eventType)) {
    eventHandlers.set(eventType, new Map());
    //루트에 이벤트 등록
    if (rootElement) {
      rootElement.addEventListener(eventType, delegateEvent);
    }
  }

  const elementMap = eventHandlers.get(eventType);
  if (!elementMap.has(element)) {
    elementMap.set(element, new Set());
  }
  elementMap.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const elementMap = eventHandlers.get(eventType);
  if (!elementMap?.has(element)) return;

  const handlers = elementMap.get(element);
  if (handlers) {
    handlers.delete(handler);
    if (handlers.size === 0) {
      elementMap.delete(element);
    }
  }

  if (elementMap.size === 0) {
    eventHandlers.delete(eventType);
    //루트에 이벤트 제거
    if (rootElement) {
      rootElement.removeEventListener(eventType, delegateEvent);
    }
  }
}
