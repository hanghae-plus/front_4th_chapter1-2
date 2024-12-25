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
  // TODO: 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록한다.
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

export function addEvent(element, eventType, handler) {
  if (events.has(element)) return;

  events.set(element, new Map());

  if ($root) {
    $root.addEventListener(eventType, handleEvent);
  }

  const elementMap = events.get(element);
  if (!elementMap.has(eventType)) {
    elementMap.set(eventType, new Set());
  }
  elementMap.get(eventType).add(handler);
}

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
