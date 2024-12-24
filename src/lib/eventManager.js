// addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에
// 저장하거나 삭제합니다.

// setupEventListeners를 이용해서 이벤트 함수를 가져와서
// 한 번에 root에 이벤트를 등록합니다.

// 이벤트 저장
const eventStorage = {};

export function setupEventListeners(root) {
  Object.keys(eventStorage).forEach((eventType) => {
    root.addEventListener(eventType, eventHandlers);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventStorage[eventType]) {
    eventStorage[eventType] = new Map();
  }

  const eventsMap = eventStorage[eventType];
  eventsMap.set(element, handler);
}

export function removeEvent(element, eventType) {
  // 요소에 대한 이벤트 배열 가져오기
  if (eventStorage[eventType] && eventStorage[eventType].has(element)) {
    eventStorage[eventType].delete(element);
  }
}

const eventHandlers = (e) => {
  const handlerGroup = eventStorage[e.type];
  if (!handlerGroup) {
    return;
  }
  const handler = handlerGroup.get(e.target);
  if (!handler) {
    return;
  }
  handler(e);
};
