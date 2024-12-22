// 1. addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에 저장하거나 삭제합니다.
// 2. setupEventListeners를 이용해서 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록합니다.

// 이벤트 위임 방식
// "setupEventListeners를 실행하면 addEvent로 저장된 함수들이 root에 register된다!"

// 이벤트 위임을 위한 전역 이벤트 맵
// 이 맵은 이벤트 타입별로 요소와 해당 요소의 이벤트 핸들러를 저장합니다.
const eventMap = new Map();

export function setupEventListeners(root) {
  // 1. rootElement 설정
  // 2. 기존에 설정된 이벤트 리스너 제거 (있다면)
  // 3. eventMap에 등록된 모든 이벤트 타입에 대해 루트 요소에 이벤트 리스너 추가
  // 주의: 이벤트 캡처링을 사용하여 이벤트를 상위에서 하위로 전파
  console.log(root);
  eventMap.forEach((value, key, obj) => console.log(value, key, obj));
}

export function addEvent(element, eventType, handler) {
  // 1. eventMap에 이벤트 타입과 요소, 핸들러 정보 저장
  // 2. 필요한 경우 루트 요소에 새 이벤트 리스너 추가
  // 이 함수를 통해 개별 요소에 직접 이벤트를 붙이지 않고도 이벤트 처리 가능

  // element.addEventListener(eventType, handler);

  eventMap.set(element, {
    eventType: eventType,
    handler: handler,
  });

  console.log("📍EventMap 확인", eventMap);
}

export function removeEvent(element, eventType, handler) {
  // 1. eventMap에서 해당 요소와 이벤트 타입에 대한 핸들러 제거
  // 2. 해당 이벤트 타입의 모든 핸들러가 제거되면 루트 요소의 리스너도 제거
  // 이를 통해 더 이상 필요 없는 이벤트 핸들러를 정리하고 메모리 누수 방지

  element.removeEventListener(eventType, handler);
}
