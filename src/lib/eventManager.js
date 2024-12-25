// NOTE: 학습메이트(최기환)님 꿀팁 듣고 다시 짠 로직
// * WeakMap 사용하고 있는데 이는 메모리 관리에 이점을 가지기 위함일까?
const listeners = new WeakMap();

// NOTE: Event Type에 대한 생각
// 1. `addEvent()` 당시 event type만 따로 저장하다가
//    `setupEventListeners()`가 실행될 때 사용되는 이벤트 타입들만 event listener에 등록 하는게 옳은지(현재)
//
// 2. 미리 사용될 것 같은 event type들을 미리 선언하고
//    `setupEventListeners()`가 실행될 때 모두 등록 하는게 옳은지
let eventTypes = [];

export function setupEventListeners($root) {
  eventTypes.forEach((eventType) => {
    $root.addEventListener(eventType, handleDelegatedEvent);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventTypes.includes(eventType)) {
    eventTypes.push(eventType);
  }

  const elementListeners = listeners.get(element) || [];
  elementListeners.push({ eventType, handler });

  listeners.set(element, elementListeners);
}

export function removeEvent(element, eventType, handler) {
  if (!listeners.has(element)) return;

  const elementListeners = listeners.get(element);
  const updatedElementListeners = elementListeners.filter((elementListener) => {
    const sameEventType = elementListener.eventType === eventType;
    const sameHandler = elementListener.handler === handler;
    return !(sameEventType && sameHandler);
  });

  if (updatedElementListeners.length === 0) {
    listeners.delete(element);
    return;
  }

  listeners.set(element, updatedElementListeners);
}

function handleDelegatedEvent(e) {
  if (!listeners.has(e.target)) return;

  const elementListeners = listeners.get(e.target);
  const filtered = elementListeners.filter(
    ({ eventType }) => eventType === e.type,
  );

  filtered.forEach(({ handler }) => handler(e));
}

// // NOTE: 이전 작업물
// // * 이벤트가 제거되지 않는 문제로 고민하다가 학습메이트(최기환)님에게 상담
// // * 개선된 로직을 제안 받음. 하지만 아직도 왜 이벤트가 제거 되지 않는 지 모르겠음
// // * `$root`도 같고 등록된 `eventType`과 `handler`도 동일 함
// const events = [];
// let $root = null;

// export function setupEventListeners(_$root) {
//   $root = _$root;

//   events.forEach(({ eventType, handler }) => {
//     $root.addEventListener(eventType, handler);
//   });
// }

// export function addEvent(element, eventType, handler) {
//   const isIncluded = events.some((event) => {
//     return isSameEvent(event, { element, eventType, handler });
//   });

//   if (isIncluded) return;

//   events.push({ element, eventType, handler });
// }

// export function removeEvent(element, eventType, handler) {
//   const found = events.find((event) => {
//     return isSameEvent(event, { element, eventType, handler });
//   });

//   if (!found) return;

//   events.filter((event) => {
//     return !isSameEvent(event, { element, eventType, handler });
//   });
//   $root.removeEventListener(found.eventType, found.handler);
// }

// function isSameEvent(a, b) {
//   const isSameElement = a.element === b.element;
//   const isSameEventType = a.eventType === b.eventType;
//   const isSameHandler = a.handler === b.handler;
//   return isSameElement && isSameEventType && isSameHandler;
// }
