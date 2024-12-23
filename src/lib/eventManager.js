import {
  createSyntheticEvent,
  SUPPORTED_EVENTS,
} from "./createSyntheticEvent.js";

const eventStore = new WeakMap();

/*
 * 이벤트 위임을 설정한다.
 */
export function setupEventListeners(root) {
  // 중복 이벤트 리스너 등록 방지
  if (root._eventsInitialized) return;

  SUPPORTED_EVENTS.forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      let target = event.target;
      const syntheticEvent = createSyntheticEvent(event);

      // 이벤트 버블링
      while (target && target !== root) {
        const elementEvents = eventStore.get(target);
        if (elementEvents && elementEvents.has(eventType)) {
          const handlers = elementEvents.get(eventType);
          for (const handler of handlers) {
            // 버블링 진행하며 현재 target 변경
            syntheticEvent.currentTarget = target;
            handler(syntheticEvent);

            // 이벤트 전파 중단 확인
            if (syntheticEvent.propagationStopped) {
              return;
            }
          }
        }
        target = target.parentNode;
      }
    });
  });

  root._eventsInitialized = true;
}

/*
 * 이벤트 핸들러를 등록한다.
 */
export function addEvent(element, eventType, handler) {
  if (!eventStore.has(element)) {
    eventStore.set(element, new Map());
  }

  const elementEvents = eventStore.get(element);
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }

  elementEvents.get(eventType).add(handler);
}

/*
 * 이벤트 핸들러를 제거한다.
 */
export function removeEvent(element, eventType, handler) {
  if (!eventStore.has(element)) return;

  const elementEvents = eventStore.get(element);
  if (!elementEvents.has(eventType)) return;

  elementEvents.get(eventType).delete(handler);

  if (elementEvents.size === 0) {
    eventStore.delete(element);
  }
}
