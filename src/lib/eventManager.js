const eventHandlers = {};

/**
 * root 요소에 이벤트 리스너를 설정
 * @param {Element} root - 이벤트 리스너를 추가할 루트 요소
 */
export function setupEventListeners(root) {
  Object.keys(eventHandlers).forEach((eventType) => {
    root.addEventListener(eventType, handleEvents);
  });
}

/**
 * 요소와 이벤트 타입에 핸들러 추가
 * @param {Element} element - 이벤트를 받을 요소
 * @param {string} eventType - 이벤트 타입
 * @param {Function} handler - 이벤트 핸들러
 */
export function addEvent(element, eventType, handler) {
  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = new WeakMap();
  }

  const elementHandlerMap = eventHandlers[eventType];
  elementHandlerMap.set(element, handler);
}

/**
 * 요소와 이벤트 타입에 핸들러 제거
 * @param {Element} element - 핸들러를 제거할 요소
 * @param {string} eventType - 이벤트 타입
 */
export function removeEvent(element, eventType) {
  if (eventHandlers[eventType] && eventHandlers[eventType].has(element)) {
    eventHandlers[eventType].delete(element);
  }
}

/**
 * 이벤트 발생 시 핸들러 실행
 * @param {Event} e - 발생한 이벤트 객체
 */
function handleEvents(e) {
  const handlers = eventHandlers[e.type];
  if (!handlers) return;

  const handler = handlers.get(e.target);
  if (!handler) return;

  handler(e);
}
