const eventStore = new WeakMap();

export const SUPPORTED_EVENTS = new Set([
  "click",
  "change",
  "input",
  "submit",
  "keydown",
  "keyup",
  "keypress",
  "mousedown",
  "mouseup",
  "mouseover",
  "mouseout",
  "mousemove",
  "focus",
  "blur",
]);

/*
 * 합성 이벤트를 생성한다.
 */
function createSyntheticEvent(navigateEvent) {
  const synthetic = {
    navigateEvent: navigateEvent, // 원본 브라우저 이벤트 객체
    target: navigateEvent.target, // 이벤트가 발생한 실제 DOM 요소
    currentTarget: navigateEvent.currentTarget, // 현재 이벤트가 처리되고 있는 DOM 요소
    type: navigateEvent.type, // 이벤트 타입
    bubbles: navigateEvent.bubbles, // 이벤트 버블링 여부
    preventDefault() {
      // 기본 동작 방지
      this.defaultPrevented = true;
      navigateEvent.preventDefault();
    },
    stopPropagation() {
      // 이벤트 전파 중단
      this.propagationStopped = true;
      navigateEvent.stopPropagation();
    },
    defaultPrevented: false,
    propagationStopped: false,
    persist() {
      // 이벤트 객체 유지
      Object.freeze(this);
    },
  };
  return synthetic;
}

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
