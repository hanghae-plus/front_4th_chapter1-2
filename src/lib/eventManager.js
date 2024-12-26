const eventRegistry = new WeakMap();

export function setupEventListeners(root) {
  console.log("setupEventListeners 진입");

  // 모든 요소에 대해 이벤트 핸들러를 등록합니다.
  Object.entries(eventRegistry).forEach((events) => {
    for (const [eventType, handlers] of Object.entries(events)) {
      // 각 이벤트 타입에 대한 리스너 등록
      root.addEventListener(eventType, (event) => {
        const target = event.target;

        handlers.forEach((handler) => {
          // 핸들러의 선택자를 사용하여 이벤트를 처리
          if (target.matches(handler.selector)) {
            handler.callback(event); // 이벤트 객체를 핸들러에 전달
          }
        });
      });
    }
  });
}
export function addEvent(element, eventType, handler) {
  // element에 대한 이벤트 저장소가 없으면 새로 생성
  if (!eventRegistry.has(element)) {
    eventRegistry.set(element, {});
  }

  const events = eventRegistry.get(element);

  // eventType이 없으면 새로 추가
  if (!events[eventType]) {
    events[eventType] = [];
  }

  // 동일한 핸들러가 이미 등록되어 있는지 확인
  const existingHandler = events[eventType].find((h) => h.callback === handler);
  if (existingHandler) {
    console.log("이벤트 핸들러가 이미 등록되어 있습니다.");
    return; // 이미 등록된 핸들러가 있으면 추가하지 않음
  }

  // 선택자와 핸들러를 함께 저장
  events[eventType].push({
    selector: element.tagName.toLowerCase(), // 선택자는 태그 이름으로 설정
    callback: handler, // 핸들러 등록
  });
}
export function removeEvent(element, eventType, handler) {
  console.log("removeEvent 진입");

  // 이벤트 레지스트리에서 요소 확인
  if (eventRegistry.has(element)) {
    const events = eventRegistry.get(element);
    if (events[eventType]) {
      // 핸들러를 제거
      events[eventType] = events[eventType].filter(
        (h) => h.callback !== handler,
      );

      // 핸들러가 모두 제거되면 해당 이벤트 타입을 삭제
      if (events[eventType].length === 0) {
        delete events[eventType];
      }

      // 모든 핸들러가 제거되면 요소의 레지스트리를 삭제
      if (Object.keys(events).length === 0) {
        eventRegistry.delete(element);
      }
    }
  }
}
