import { extractEvent, supportedEventNames } from "./extractEvent.js";

// DOM 요소와 이벤트 핸들러를 맵핑하는 WeakMap
// WeakMap 사용으로 메모리 누수 방지
export const eventStore = new WeakMap();

/**
 * root 엘리먼트에 지원되는 모든 이벤트 리스너 등록
 * 중복 초기화 방지를 위한 flag 사용
 */
export function setupEventListeners(root) {
  if (root._eventsInitialized) return;
  supportedEventNames.forEach((eventName) => {
    listenToNativeEvent(root, eventName);
  });

  root._eventsInitialized = true;
}

/**
 * 네이티브 DOM 이벤트를 리스닝하고 합성 이벤트로 변환하여 dispatch
 */
function listenToNativeEvent(target, eventType) {
  const listener = (nativeEvent) => {
    dispatchEvent(eventType, target, nativeEvent);
  };

  target.addEventListener(eventType, listener, false);
}

/**
 * 이벤트 dispatch 처리
 * 1. 네이티브 이벤트 합성 이벤트로 변환
 * 2. 이벤트 버블링 경로 상의 모든 핸들러 수집
 * 3. 수집된 핸들러 순차적으로 실행
 */
function dispatchEvent(domEventName, targetContainer, nativeEvent) {
  const syntheticEvent = extractEvent(
    domEventName,
    nativeEvent,
    nativeEvent.target,
  );
  const dispatchQueue = accumulateListeners(
    nativeEvent.target,
    targetContainer,
    domEventName,
  );

  // 버블링 경로 상의 모든 핸들러 실행
  for (let i = 0; i < dispatchQueue.length; i++) {
    const { handler, currentTarget } = dispatchQueue[i];
    syntheticEvent.currentTarget = currentTarget;
    handler(syntheticEvent);
    syntheticEvent.currentTarget = null;
  }
}

/**
 * 이벤트 버블링 경로상의 모든 핸들러 수집
 */
function accumulateListeners(target, rootContainer, eventType) {
  let dispatchQueue = [];
  let currentTarget = target;

  // target 부터 root 컨테이너까지 순회하며 핸들러 수집
  while (currentTarget && currentTarget !== rootContainer) {
    const elementEvents = eventStore.get(currentTarget);
    if (elementEvents?.has(eventType)) {
      const handlers = elementEvents.get(eventType);
      handlers.forEach((handler) => {
        dispatchQueue.push({ handler, currentTarget });
      });
    }
    currentTarget = currentTarget.parentNode;
  }
  return dispatchQueue;
}

/**
 * 특정 엘리먼트에 대한 이벤트 핸들러 등록
 * WeakMap > Map > Set 구조로 저장
 */
export function addEvent(element, eventType, handler) {
  try {
    if (!eventStore.has(element)) {
      eventStore.set(element, new Map());
    }

    const elementEvents = eventStore.get(element);
    if (!elementEvents.has(eventType)) {
      elementEvents.set(eventType, new Set());
    }

    elementEvents.get(eventType).add(handler);
  } catch (error) {
    console.error("eventManager - addEvent :", error);
    throw error;
  }
}

/**
 * 특정 엘리먼트의 이벤트 핸들러 제거
 */
export function removeEvent(element, eventType, handler) {
  try {
    if (!eventStore.has(element)) return;

    const elementEvents = eventStore.get(element);
    if (!elementEvents.has(eventType)) return;

    elementEvents.get(eventType).delete(handler);

    if (elementEvents.get(eventType).size === 0) {
      elementEvents.delete(eventType);
    }

    if (elementEvents.size === 0) {
      eventStore.delete(element);
    }
  } catch (error) {
    console.error("eventManager - removeEvent :", error);
  }
}
