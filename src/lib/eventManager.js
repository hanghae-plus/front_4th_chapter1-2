const eventMap = new Map();

let rootElement = null;

export function setupEventListeners(root) {
  // 1. rootElement 설정
  // 2. 기존에 설정된 이벤트 리스너 제거 (있다면)
  // 3. eventMap에 등록된 모든 이벤트 타입에 대해 루트 요소에 이벤트 리스너 추가
  // 주의: 이벤트 캡처링을 사용하여 이벤트를 상위에서 하위로 전파
  if (rootElement && rootElement !== root) {
    eventMap.forEach((_, eventType) => {
      rootElement.removeEventListener(eventType, handleEvent);
    });
  }

  rootElement = root;

  eventMap.forEach((_, eventType) => {
    rootElement.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(event) {
  // 1. 이벤트 타겟에서 시작하여 루트 요소까지 버블링
  // 2. 각 요소에 대해 해당 이벤트 타입의 핸들러가 있는지 확인
  // 3. 핸들러가 있다면 실행
  // 이를 통해 하위 요소에서 발생한 이벤트를 상위에서 효율적으로 처리할 수 있습니다.
  const { target, type } = event;

  const handlerMap = eventMap.get(type);

  let currentTarget = target;

  while (currentTarget && currentTarget !== rootElement.parentNode) {
    if (handlerMap.has(currentTarget)) {
      const handler = handlerMap.get(currentTarget);

      handler(event);
    }
    currentTarget = currentTarget.parentNode;
  }
}

export function addEvent(target, eventType, handler) {
  // 1. eventMap에 이벤트 타입과 요소, 핸들러 정보 저장
  // 2. 필요한 경우 루트 요소에 새 이벤트 리스너 추가
  // 이 함수를 통해 개별 요소에 직접 이벤트를 붙이지 않고도 이벤트 처리 가능
  let handlerMap = eventMap.get(eventType);

  if (!handlerMap) {
    handlerMap = new Map();
    eventMap.set(eventType, handlerMap);
  }

  handlerMap.set(target, handler);
}

export function removeEvent(target, eventType) {
  // 1. eventMap에서 해당 요소와 이벤트 타입에 대한 핸들러 제거
  // 2. 해당 이벤트 타입의 모든 핸들러가 제거되면 루트 요소의 리스너도 제거
  // 이를 통해 더 이상 필요 없는 이벤트 핸들러를 정리하고 메모리 누수 방지
  if (!eventMap.has(eventType)) {
    return;
  }

  const handlerMap = eventMap.get(eventType);

  if (handlerMap.has(target)) {
    handlerMap.delete(target);
  }

  if (handlerMap.size === 0) {
    eventMap.delete(eventType);

    if (rootElement) {
      rootElement.removeEventListener(eventType, handleEvent);
    }
  }
}
