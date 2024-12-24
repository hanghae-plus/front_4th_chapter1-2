// container 에 이벤트 등록
export function setupEventListeners(root) {
  console.log(root);
}

export function addEvent(element, eventType, handler) {
  element.addEventListener(eventType, handler);
}

export function removeEvent(element, eventType, handler) {
  console.log(`start event / my root: `, { element, eventType, handler });
}
