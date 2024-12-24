const eventHandlers = {};

const handleGlobalEvents = (e) => {
  const handlers = eventHandlers[e.type];
  if (!handlers) return;

  for (const selector in handlers) {
    if (e.target.matches(selector)) {
      handlers[selector](e);
      break;
    }
  }
};

export const registerGlobalEvents = (() => {
  let init = false;
  return () => {
    if (init) {
      return;
    }

    Object.keys(eventHandlers).forEach((eventType) => {
      document.body.addEventListener(eventType, handleGlobalEvents);
    });

    init = true;
  };
})();

// 노드 생성 시점에 이벤트가 있다면 이벤트 노드로 만들어주는 시점이다
export const addEventUtil = (eventType, selector, handler) => {
  // 이벤트 위임도 해야한다
  if (!eventHandlers[eventType]) {
    // 이벤트 핸들러 움... 모르게쑨
    eventHandlers[eventType] = {};
  }
  eventHandlers[eventType][selector] = handler;

  console.log(eventHandlers);
};
