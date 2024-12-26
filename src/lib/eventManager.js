//이벤트 핸들러들을 저장하는 역할을
const eventMap = new Map();

//현재 이벤트 위임을 설정할 루트 DOM 요소
// 해당 요소에서 이벤트가 발생하면, 해당 이벤트를 위임하여 처리할 다른 자식 요소들을 찾아냄
let rootElement = null;

//eventMap 에 등록된 모든 이벤트 타입에 대해 이벤트 리스너를 설정
export function setupEventListeners(root) {
  rootElement = root;

  if (rootElement) {
    // 이벤트 리스너가 중복으로 등록되지 않도록 하기 위해 rootElement에서 기존에 등록된 이벤트 리스너들을 제거
    eventMap.forEach((_, eventType) => {
      rootElement.removeEventListener(eventType, handleEvent);
    });
  }

  eventMap.forEach((_, eventType) => {
    //rootElement에 이벤트가 발생하면, handleEvent 함수가 호출됨.
    rootElement.addEventListener(eventType, handleEvent);
  });
}

//등록된 이벤트 리스너가 호출할 실제 함수
function handleEvent(event) {
  const eventType = event.type; // "click", "mouseover" ...
  const handlerMap = eventMap.get(eventType);

  if (!handlerMap) return;

  //이벤트가 발생한 요소
  let currentElement = event.target;

  //currentElement부터 시작하여 부모 요소까지 거슬러 올라가며
  //각 요소에 등록된 핸들러를 호출함 (이벤트 위임)
  //부모 요소에서 이벤트를 처리하는 방식을 사용하기 위해
  //현재 요소에서 parentElement를 통해 부모 요소로 이동.
  while (currentElement && currentElement !== rootElement.parentElement) {
    const handler = handlerMap.get(currentElement);
    if (handler) {
      // currentElement에 해당하는 이벤트 핸들러가 있다면, 해당 핸들러를 호출
      handler(event);
    }

    //currentElement를 부모 요소로 변경하여 루프를 계속 진행
    currentElement = currentElement.parentElement;
  }
}

//특정 DOM 요소에 이벤트 핸들러를 추가하는 함수
export function addEvent(element, eventType, handler) {
  //eventMap에 이벤트 타입이 있는지 확인하고, 없으면 Map()을 생성하여 추가

  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Map());
  }

  //해당 이벤트 타입에 대한 핸들러 맵에서, 특정 element에 대한 핸들러를 추가
  const handlerMap = eventMap.get(eventType);
  handlerMap.set(element, handler);
}

//특정 요소에서 이벤트 핸들러를 제거하는 함수
export function removeEvent(element, eventType) {
  if (!eventMap.has(eventType)) return;

  const handlerMap = eventMap.get(eventType);

  //element에 대한 핸들러를 삭제
  if (handlerMap.has(element)) {
    handlerMap.delete(element);
  }

  //해당 이벤트 타입에 대해 더 이상 핸들러가 남아 있지 않으면 eventMap에서 해당 이벤트 타입을 삭제
  if (handlerMap.size === 0) {
    eventMap.delete(eventType);
    if (rootElement) {
      //rootElement에서 더 이상 해당 이벤트 타입을 처리할 필요가 없으면 이벤트 리스너를 제거
      rootElement.removeEventListener(eventType, handleEvent, true);
    }
  }
}
