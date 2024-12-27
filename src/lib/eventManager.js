// 이벤트 타입별 핸들러 저장
const eventHandlers = new Map();
let rootElement = null;

function delegateEvent(event) {
  const eventType = event.type;

  const handlers = eventHandlers.get(eventType);
  if (!handlers) return;

  let target = event.target;
  while (target && target !== rootElement?.parentElement) {
    const elementHandlers = handlers.get(target);
    if (elementHandlers) {
      elementHandlers.forEach((handler) => {
        handler.call(target, event);
      });
      if (!event.bubbles) break;
    }
    target = target.parentElement;
  }
}

export function setupEventListeners(root) {
  // 이전 root의 이벤트 리스너 제거
  if (rootElement && rootElement !== root) {
    eventHandlers.forEach((_, eventType) => {
      rootElement.removeEventListener(eventType, delegateEvent);
    });
  }

  // 새로운 root 설정
  if (rootElement !== root) {
    rootElement = root;
    // 기존에 등록된 이벤트 타입들에 대해 root에 이벤트 리스너 등록
    eventHandlers.forEach((_, eventType) => {
      rootElement.addEventListener(eventType, delegateEvent);
    });
  }
}

export function addEvent(element, eventType, handler) {
  // 이벤트 타입에 대한 Map이 없으면 생성
  if (!eventHandlers.has(eventType)) {
    eventHandlers.set(eventType, new WeakMap());
    // root 엘리먼트에 이벤트 리스너 등록
    if (rootElement) {
      rootElement.addEventListener(eventType, delegateEvent);
    }
  }

  // 엘리먼트의 핸들러 Set이 없으면 생성
  const handlers = eventHandlers.get(eventType);
  if (!handlers.has(element)) {
    handlers.set(element, new Set());
  }

  // 핸들러 추가
  handlers.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const handlers = eventHandlers.get(eventType);
  if (!handlers) return;

  const elementHandlers = handlers.get(element);
  if (!elementHandlers) return;

  // 핸들러 제거
  elementHandlers.delete(handler);

  // 엘리먼트의 모든 핸들러가 제거되면 Map에서 제거
  if (elementHandlers.size === 0) {
    handlers.delete(element);
  }

  // 해당 이벤트 타입의 모든 핸들러가 제거되었는지 확인
  const handlersMap = eventHandlers.get(eventType);
  if (!handlersMap || handlersMap.size === 0) {
    rootElement?.removeEventListener(eventType, delegateEvent);
    eventHandlers.delete(eventType);
  }
}
