/**
 * DOM 이벤트 리스너들을 관리하는 중첩된 Map 구조입니다.
 *
 * @type {Map<HTMLElement, Map<string, Map<Function, Function>>>}
 *
 * @description
 * 3중 중첩 Map 구조로 되어있습니다:
 * - 첫 번째 레벨: DOM 엘리먼트를 키로 가지는 Map
 * - 두 번째 레벨: 이벤트 타입(예: 'click', 'mouseover')을 키로 가지는 Map
 * - 세 번째 레벨: 원본 핸들러 함수를 키로 가지고, 래핑된 핸들러 함수를 값으로 가지는 Map
 *
 * @example
 * // Map 구조 예시
 * Map(HTMLElement) => {
 *   Map(eventType: string) => {
 *     Map(originalHandler: Function => wrappedHandler: Function)
 *   }
 * }
 */
const eventListeners = new Map();
let root = null;

export function setupEventListeners(_root) {
  if (!_root) {
    throw new Error("이벤트 리스너 설정을 위해 root 엘리먼트가 필요합니다.");
  }

  root = _root;

  eventListeners.forEach((eventTypeMap) => {
    eventTypeMap?.forEach((handlers, eventType) => {
      handlers?.forEach((handler) => {
        root.addEventListener(eventType, handler);
      });
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventListeners.has(element)) {
    eventListeners.set(element, new Map());
  }

  const elementEvents = eventListeners.get(element);

  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Map());
  }

  const wrappedHandler = (e) => {
    if (e.target === element) {
      handler(e);
    }
  };

  elementEvents.get(eventType).set(handler, wrappedHandler);
}

export function removeEvent(element, eventType, handler) {
  if (!eventListeners.has(element)) return;

  const eventsTypes = eventListeners.get(element);
  if (!eventsTypes.has(eventType)) return;

  const handlers = eventsTypes.get(eventType);
  if (!handlers.has(handler)) return;

  // dom에 등록된 이벤트 제거
  const registeredHandler = handlers.get(handler);
  root.removeEventListener(eventType, registeredHandler);

  // eventListeners에 등록된 이벤트 제거
  handlers.delete(handler);
  if (handlers.size === 0) {
    eventsTypes.delete(eventType);
  }
  if (eventsTypes.size === 0) {
    eventListeners.delete(element);
  }
}
