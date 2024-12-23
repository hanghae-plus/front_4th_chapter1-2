// 1. addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에 저장하거나 삭제합니다.
// 2. setupEventListeners를 이용해서 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록합니다.

const handlers = {};

export function setupEventListeners(root) {
  Object.keys(handlers).forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

export function addEvent(element, eventType, handler) {
  if (!handlers[eventType]) {
    handlers[eventType] = new WeakMap<Element, Map<string, Set<Function>>>();
  }

  handlers[eventType].set(element, handler);
}

export function removeEvent(element, eventType) {
  if (handlers[eventType] && handlers[eventType].has(element)) {
    handlers[eventType].delete(element);
  }
}

function handleEvent(event) {
  const handler = handlers[event.type].get(event.target);

  if (!handler) return;

  handler(event);
}
