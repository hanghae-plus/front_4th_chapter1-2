// 1. addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에 저장하거나 삭제합니다.
// 2. setupEventListeners를 이용해서 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록합니다.

// 이벤트 위임 방식
// "setupEventListeners를 실행하면 addEvent로 저장된 함수들이 root에 register된다!"

// 이벤트 위임을 위한 전역 이벤트 맵
// 이 맵은 이벤트 타입별로 요소와 해당 요소의 이벤트 핸들러를 저장합니다.
const eventMap = new Map();

let rootElement = null;

export function setupEventListeners(root) {
  // 1. rootElement 설정
  rootElement = root;
  // 2. 기존에 설정된 이벤트 리스너 제거 (있다면)
  // 3. eventMap에 등록된 모든 이벤트 타입에 대해 루트 요소에 이벤트 리스너 추가
  // 주의: 이벤트 캡처링을 사용하여 이벤트를 상위에서 하위로 전파
  eventMap.forEach((_, eventType) => {
    rootElement.removeEventListener(eventType, handleEvent);
    rootElement.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(e) {
  // 이벤트 타겟 식별:
  //   - `event.target`을 사용하여 실제 이벤트가 발생한 요소를 식별
  //   - 조건문을 통해 특정 요소나 클래스에 대해서만 이벤트 처리 가능
  let target = e.target; // element

  while (target && target !== rootElement) {
    const handlers = eventMap.get(e.type).get(target);

    if (handlers) {
      handlers.forEach((handler) => handler(e));
    }

    target = target.parentNode; // 버블링?
  }
}

export function addEvent(element, eventType, handler) {
  //  eventMap에 해당 eventType이 있는지 먼저 확인
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new WeakMap());
  }

  const eventTypeMap = eventMap.get(eventType);
  if (!eventTypeMap.has(element)) {
    eventTypeMap.set(element, new Set()); // handler의 내용은 중복되면 안되므로 set 사용
  }

  eventTypeMap.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  //  eventMap에 해당 eventType이 있는지 먼저 확인
  const eventTypeMap = eventMap.get(eventType);
  if (!eventTypeMap) return;

  // eventMap에서 해당 요소와 이벤트 타입에 대한 핸들러 제거
  const handlerSet = eventTypeMap.get(element);

  if (handlerSet) {
    handlerSet.delete(handler);
    if (handlerSet.size === 0) eventTypeMap.delete(element);
  }

  // 해당 이벤트 타입의 모든 핸들러가 제거되면 루트 요소의 리스너도 제거
  // 이를 통해 더 이상 필요 없는 이벤트 핸들러를 정리하고 메모리 누수 방지
  if (eventTypeMap.size === 0) {
    eventMap.delete(eventType);
    if (rootElement) {
      rootElement.removeEventListener(eventType, handleEvent);
    }
  }
}
