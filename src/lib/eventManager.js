const eventStore = new Map();

// SyntheticEvent는 리액트의 이벤트 객체를 모방
// SyntheicEvent는 이벤트 객체를 감싸고 있는 객체로, 이벤트 객체와 유사한 API를 제공한다.
// const createSyntheticEvent = (nativeEvent) => {
//   let isPropagationStopped = false;
//   let isDefaultPrevented = false;
//   return {
//     type: nativeEvent.type,
//     target: nativeEvent.target,
//     currentTarget: nativeEvent.currentTarget,
//     nativeEvent,
//     stopPropagation() {
//       isPropagationStopped = true;
//       nativeEvent.stopPropagation();
//     },
//     isPropagationStopped() {
//       return isPropagationStopped;
//     },
//     preventDefault() {
//       isDefaultPrevented = true;
//       nativeEvent.preventDefault();
//     },
//     isDefaultPrevented() {
//       return isDefaultPrevented;
//     },
//   };
// };

export function setupEventListeners(root) {
  eventStore.forEach((handlers, eventType) => {
    // 각 이벤트 타입 별 위임된 하나의 이벤트 리스너를 생성
    root.addEventListener(eventType, (event) => {
      let target = event.target;
      while (target && target !== root) {
        if (handlers.has(target)) {
          handlers.get(target)(event);
          break;
        }
        target = target.parentElement;
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!element || !eventType || typeof handler !== "function") return;

  if (!eventStore.has(eventType)) {
    eventStore.set(eventType, new WeakMap());
  }

  const handlers = eventStore.get(eventType);
  handlers.set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  if (!element || !eventType || typeof handler !== "function") return;

  const handlers = eventStore.get(eventType);
  if (handlers) {
    handlers.delete(element);
    if (handlers.size === 0) {
      eventStore.delete(eventType);
    }
  }
}
