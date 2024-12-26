const eventListeners = new Map();

/**
 * root 요소에 이벤트 리스너를 등록하는 함수
 * @description
 * - 이벤트 위임을 통해 이벤트 핸들러를 등록
 * - 메모리 누수 방지를 위해 이벤트 리스너를 해제하고 다시 등록
 * @param {HTMLElement} root
 */
export function setupEventListeners(root) {
  eventListeners.forEach((_, eventType) => {
    root.removeEventListener(eventType, handleEvent);
    root.addEventListener(eventType, handleEvent);
  });
}

/**
 * 이벤트 리스너를 등록하는 함수
 * @param {*} element
 * @param {*} eventType
 * @param {*} handler
 */
export function addEvent(element, eventType, handler) {
  if (typeof handler !== "function") {
    throw new TypeError("Handler must be a function");
  }

  if (!eventListeners.has(eventType)) {
    eventListeners.set(eventType, new WeakMap());
  }

  const listeners = eventListeners.get(eventType);
  listeners.set(element, handler);
}

/**
 * 이벤트 리스너를 해제하는 함수
 * - WeakMap을 사용했기 때문에 eventListeners에 대한 삭제는 별도로 처리하지 않아도 된다.
 * @description
 * @param {*} element
 * @param {*} eventType
 * @param {*} handler
 */
export function removeEvent(element, eventType) {
  if (!eventListeners.has(eventType)) {
    return;
  }

  const elementEventListeners = eventListeners.get(eventType);
  elementEventListeners.delete(element);
}

/**
 * 이벤트 핸들러 처리 함수
 */
const handleEvent = (e) => {
  const { target, type } = e;
  const listeners = eventListeners.get(type);

  if (!listeners) {
    return;
  }

  const handler = listeners.get(target);
  if (typeof handler === "function") {
    handler(e);
  }
};
