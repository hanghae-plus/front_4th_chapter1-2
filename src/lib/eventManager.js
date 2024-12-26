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

// 이벤트 리스너 설정
export function setupEventListeners(root) {
  // 이벤트 타입 반복
  Object.values(EVENT_TYPES).forEach((eventType) => {
    // 이벤트 위임 설정
    root.addEventListener(eventType, (e) => {
      // 실제 이벤트가 발생한 요소 가져오기
      let target = e.target;

      // 버블링 처리
      while (target && target !== root) {
        const handlers = eventHandlers.get(target);

        // 이벤트 핸들러 실행
        if (handlers?.[eventType]) {
          handlers[eventType](e);
          if (e.cancelBubble) break;
        }
        target = target.parentElement;
      }
    });
  });
}

// 이벤트 핸들러 추가
export function addEvent(element, eventName, handler) {
  // 이벤트 타입 가져오기 (onClick -> click)
  const eventType = EVENT_TYPES[eventName] || eventName.toLowerCase();

  // 이벤트 핸들러 추가
  if (!eventHandlers.has(element)) {
    eventHandlers.set(element, {});
  }

  // 이벤트 핸들러 추가
  const handlers = eventHandlers.get(element);
  handlers[eventType] = handler;
}

// 이벤트 핸들러 제거
export function removeEvent(element, eventName) {
  // 이벤트 타입 가져오기
  const eventType = EVENT_TYPES[eventName] || eventName.toLowerCase();

  const handlers = eventHandlers.get(element);
  if (handlers) {
    delete handlers[eventType];
    if (Object.keys(handlers).length === 0) {
      eventHandlers.delete(element);
    }
  }
}

// 이벤트 매니저
// // 1. 메모리 효율성
// - 루트에만 리스너 설정
// - WeakMap으로 메모리 누수 방지

// // 2. 동적 요소 처리
// const newButton = document.createElement('button');
// addEvent(newButton, 'onClick', handler);
// container.appendChild(newButton);
// // 추가 설정 없이 바로 동작

// // 3. 성능 최적화
// - 이벤트 리스너 최소화
// - 효율적인 핸들러 검색
