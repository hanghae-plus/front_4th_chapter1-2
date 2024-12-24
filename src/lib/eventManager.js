const eventListeners = [];

/**
 * root 요소에 이벤트 리스너를 등록하는 함수
 * @description
 * - 이벤트 위임을 통해 이벤트 핸들러를 등록
 * - 이벤트 해제를 위한 remove 함수를 이벤트 리스너 배열에 업데이트
 * @param {HTMLElement} root
 */
export function setupEventListeners(root) {
  eventListeners.forEach(({ element, eventType, handler }, i) => {
    const boundHandler = (e) => {
      if (element === e.target) {
        handler(e);
      }
    };

    root.addEventListener(eventType, boundHandler);
    eventListeners[i] = {
      element,
      eventType,
      handler,
      remove: () => root.removeEventListener(eventType, boundHandler),
    };
  });
}

/**
 * 이벤트 리스너를 등록하는 함수
 * @param {*} element
 * @param {*} eventType
 * @param {*} handler
 */
export function addEvent(element, eventType, handler) {
  eventListeners.push({ element, eventType, handler });
}

/**
 * 이벤트 리스너를 해제하는 함수
 * @description 이벤트 리스너 배열에서 element, eventType, handler가 일치하는 요소를 찾아 remove 함수를 호출하여 리스너 해제
 * @param {*} element
 * @param {*} eventType
 * @param {*} handler
 */
export function removeEvent(element, eventType, handler) {
  const deleteIndex = eventListeners.findIndex(
    (event) =>
      event.element === element &&
      event.eventType === eventType &&
      event.handler === handler,
  );
  eventListeners[deleteIndex].remove();
  eventListeners.splice(deleteIndex, 1);
}
