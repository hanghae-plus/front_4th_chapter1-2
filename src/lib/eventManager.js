const eventRegistry = [];
let rootElement = null;

function isEventMatch(eventA, eventB) {
  return (
    eventA.element === eventB.element &&
    eventA.eventType === eventB.eventType &&
    eventA.handler === eventB.handler
  );
}

export function setupEventListeners(root) {
  rootElement = root;

  // eventRegistry 배열에 있는 모든 이벤트를 루트 요소에 등록
  eventRegistry.forEach(({ eventType, handler }) => {
    rootElement.addEventListener(eventType, handler);
  });
}

export function addEvent(element, eventType, handler) {
  let eventExists = false;

  for (const $event of eventRegistry) {
    if (isEventMatch($event, { element, eventType, handler })) {
      eventExists = true;
      break;
    }
  }

  if (eventExists) return;

  // 이벤트 정보를 배열에 추가
  eventRegistry.push({ element, eventType, handler });
}

export function removeEvent(element, eventType, handler) {
  let matchingEvent = null;
  eventRegistry.forEach(($event) => {
    if (isEventMatch($event, { element, eventType, handler })) {
      matchingEvent = $event;
    }
  });

  if (!matchingEvent) return; //값이 없으면 그대로 종료

  if (matchingEvent !== null) {
    rootElement.removeEventListener(eventType, matchingEvent.handler);
  }
}
