// eventMap: 이벤트 타입별로 요소와 해당 요소의 이벤트 핸들러를 저장.
// 구조: { click: { element: Set<handler>, ... }, ... }
const eventMap = new Map();

let rootElement = null;

/**
 * 이벤트 리스너 설정.
 *
 * @param root - 이벤트 위임의 기준이 되는 루트 요소
 */
export function setupEventListeners(delegationRoot) {
  rootElement = delegationRoot;

  const allEventTypes = Array.from(eventMap.keys());

  // 이벤트 위임 설정
  allEventTypes.forEach((eventType) => {
    if (
      (rootElement && rootElement !== delegationRoot) || // 루트 요소 변경
      eventMap.get(eventType).size > 0 // 기존 핸들러 존재
    ) {
      rootElement.removeEventListener(eventType, handleEvent);
    }

    rootElement.addEventListener(eventType, handleEvent);
  });
}

/**
 * 이벤트 핸들러 실행.
 *
 * @param event - 발생한 이벤트 객체
 * @description
 * 이벤트 버블링을 이용하며 이벤트 핸들러를 실행합니다.
 */
function handleEvent(event) {
  let currentTargetEl = event.target;

  while (currentTargetEl && currentTargetEl !== rootElement) {
    const elementHandlers = eventMap.get(event.type)?.get(currentTargetEl);

    if (elementHandlers) {
      elementHandlers.forEach((handler) => handler(event));
    }

    currentTargetEl = currentTargetEl.parentNode; // 상위 요소로 이동
  }
}

/**
 * 이벤트 추가.
 *
 * @param element - 이벤트를 추가할 요소
 * @param eventType - 이벤트 타입 (예: 'click')
 * @param handler - 이벤트 핸들러 함수
 */
export function addEvent(element, eventType, handler) {
  // 이벤트 타입에 대한 Map 초기화
  const handlersByEl =
    eventMap.get(eventType) ??
    eventMap.set(eventType, new Map()).get(eventType);

  // 요소에 대한 핸들러 Set 초기화
  const handlers =
    handlersByEl.get(element) ??
    handlersByEl.set(element, new Set()).get(element);

  // 핸들러 추가
  handlers.add(handler);
}

/**
 * 이벤트 제거.
 *
 * @param element - 이벤트를 제거할 요소
 * @param eventType - 이벤트 타입 (예: 'click')
 * @param handler - 제거할 이벤트 핸들러 함수
 */
export function removeEvent(element, eventType, handler) {
  const handlersByEl = eventMap.get(eventType);
  if (!handlersByEl) return;

  const handlers = handlersByEl.get(element);
  if (!handlers) return;

  // 핸들러 제거
  handlers.delete(handler);

  // 핸들러가 비어 있으면 요소 제거
  if (handlers.size === 0) {
    handlersByEl.delete(element);
  }

  // 이벤트 타입에 더 이상 요소가 없으면 타입 제거
  if (handlersByEl.size === 0) {
    eventMap.delete(eventType);
  }
}
