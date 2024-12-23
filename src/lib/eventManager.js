const eventHandler = {};

export function setupEventListeners(root) {
  // TODO: 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록한다.
  Object.keys(eventHandler).forEach((eventType) => {
    root.addEventListener(eventType, (e) => {
      const handlers = eventHandler[eventType];
      const target = e.target;

      if (handlers[target]) {
        handlers[target](e);
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  // element에 대한 이벤트 함수를 어딘가에 저장한다
  if (!eventHandler[element]) {
    eventHandler[element] = {};
  }
  eventHandler[element][eventType] = handler;
}

export function removeEvent(element, eventType) {
  // element에 대한 이벤트 함수를 어딘가에 삭제한다
  if (!eventHandler[element]) {
    return;
  }
  delete eventHandler[element][eventType];
}
