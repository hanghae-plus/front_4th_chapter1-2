const events = new Map();
let $root = null;

function handleEvent(event) {
  const element = event.target;
  const elementMap = events.get(element);

  if (!elementMap) return;

  const handlers = elementMap.get(event.type);
  if (!handlers) return;

  handlers.forEach((handler) => handler(event));
}

export function setupEventListeners(root) {
  if ($root && $root !== root) {
    events.forEach((value) => {
      $root.removeEventListener(value.eventType, value.handler);
    });
  }

  if ($root !== root) {
    $root = root;
    events.forEach((value, key) => {
      const elementMap = events.get(key);
      elementMap.forEach((handlers, eventType) => {
        $root.addEventListener(eventType, handleEvent);
      });
    });
  }
}

// 이벤트 추가 함수
export function addEvent(element, eventType, handler) {
  if (!events.has(element)) {
    events.set(element, new Map());
  }

  if ($root) {
    $root.addEventListener(eventType, handleEvent);
  }

  const eventMap = events.get(element);
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Set());
  }

  eventMap.get(eventType).add(handler);
}

// 이벤트 제거 함수
export function removeEvent(element, eventType, handler) {
  const elementMap = events.get(element);
  if (!elementMap) return;

  const handlers = elementMap.get(eventType);
  if (!handlers) return;

  handlers.delete(handler);

  if (handlers.size === 0) {
    elementMap.delete(eventType);
  }

  if (elementMap.size === 0) {
    events.delete(element);
    if ($root) {
      $root.removeEventListener(eventType, handleEvent);
    }
  }
}
