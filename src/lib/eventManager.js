const eventHandlers = new WeakMap();

const EVENT_TYPES = {
  onClick: "click",
  onMouseOver: "mouseover",
  onFocus: "focus",
  onKeyDown: "keydown",
  onChange: "change",
  onInput: "input",
  onSubmit: "submit",
};

// 테스트를 위한 초기화 함수 추가
export function resetEventManager() {
  eventHandlers.clear?.();
}

export function setupEventListeners(root) {
  Object.values(EVENT_TYPES).forEach((eventType) => {
    root.addEventListener(eventType, (e) => {
      let target = e.target;

      while (target && target !== root) {
        const handlers = eventHandlers.get(target);
        if (handlers?.[eventType]) {
          handlers[eventType](e);
          if (e.cancelBubble) break;
        }
        target = target.parentElement;
      }
    });
  });
}

export function addEvent(element, eventName, handler) {
  // onClick -> click 변환
  const eventType = EVENT_TYPES[eventName] || eventName.toLowerCase();

  if (!eventHandlers.has(element)) {
    eventHandlers.set(element, {});
  }

  const handlers = eventHandlers.get(element);
  handlers[eventType] = handler;
}

export function removeEvent(element, eventName) {
  const eventType = EVENT_TYPES[eventName] || eventName.toLowerCase();

  const handlers = eventHandlers.get(element);
  if (handlers) {
    delete handlers[eventType];
    if (Object.keys(handlers).length === 0) {
      eventHandlers.delete(element);
    }
  }
}
