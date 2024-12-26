// 1. addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에 저장하거나 삭제합니다.
// 2. setupEventListeners를 이용해서 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록합니다.

// getEventListener의 반환 형태 참고({click: [{type: click, listener: f}, {type: click, listener: f2}]})
// 이벤트 타입별로 요소와 해당 요소의 이벤트 핸들러를 저장
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
  let element = e.target;

  while (element) {
    const typeMap = eventMap.get(e.type);
    if (!typeMap) return; // 이벤트 타입이 없으면 종료

    const handlers = typeMap.get(element);
    if (handlers) {
      for (const handler of handlers) {
        handler(e);
        if (e.immediatePropagationStopped) return; // 전파 중단 처리
      }
    }

    if (element === rootElement) break; // 루트 요소에서 종료
    element = element.parentNode; // 상위 요소로 이동
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

// 목적: evnetMap에 저장되어있는 element에 대한 이벤트 함수를 삭제
export function removeEvent(element, eventType, handler) {
  // 타입 : 엘리먼트 => 핸들러
  // 타입이 있는지 확인
  const elementMap = eventMap.get(eventType);
  if (!elementMap) return; // 타입 없으면 종료

  // 엘리먼트 있는지 확인
  const handlerSet = elementMap.get(element);
  console.log(typeof element);

  if (handlerSet) {
    handlerSet.delete(handler); // 엘리먼트가 있다면 핸들러 삭제

    // 만약 엘리먼트만 있고 핸들러는 없다면 엘리먼트도 삭제할 것 (메모리 및 공간 이슈 방지)
    console.log("핸들러 다 삭제 됐을 경우(0)를 찾아라", handlerSet.size);
    if (handlerSet.size === 0) {
      console.log(element, "를 삭제할고야 => ", elementMap);
      elementMap.delete(element);
      console.log(element, "를 삭제했지롱", elementMap);
    }
  }

  // 만약 해당 타입에 대한 엘리먼트도 다 삭제 됐다면?
  // 리스너도 삭제해야지.
}
