// addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에
// 저장하거나 삭제합니다.

// setupEventListeners를 이용해서 이벤트 함수를 가져와서
// 한 번에 root에 이벤트를 등록합니다.

// 이벤트 저장 map 생성
const eventMap = new Map();

export function setupEventListeners() {
  // root 아래 모든 요소에 대해 등록된 이벤트 리스너 설정
  eventMap.forEach((events, element) => {
    events.forEach((eventType, handler) => {
      element.addEventListener(eventType, handler);
    });
  });
}

export function addEvent(element, eventType, handler) {
  // 이벤트 리스너 이미 존재하는지 확인
  if (!eventMap.has(element)) {
    eventMap.set(element, []);
  }

  // 요소에 대한 이벤트 배열로 가져오고 배열에 추가
  const events = eventMap.get(element);
  events.push({ eventType, handler });

  // 이벤트 리스너를 요소에 추가
  element.addEventListener(eventType, handler);
}

export function removeEvent(element, eventType, handler) {
  // 요소에 대한 이벤트 배열 가져오기
  const events = eventMap.get(element);

  if (!events) {
    return;
  }

  // 이벤트 리스너 제거
  element.removeEventListener(eventType, handler);
}
