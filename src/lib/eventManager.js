// 사용 중인 이벤트를 담을 객체
// const eventMap = new Map();
// let rootElement = null;
//
// // eventMap = {
// //   element : {
// //     eventType : handler
// //   }
// // }
//
// // 컴포넌트에 이벤트를 추가해주는 함수
// export function addEvent(element, eventType, handler) {
//   let thisElement = element;
//   while (thisElement && thisElement !== rootElement) {
//     if (eventMap.get(thisElement)) {
//       eventMap.get(thisElement).set(eventType, handler);
//     } else {
//       const newEventMap = new Map();
//       newEventMap.set(eventType, handler);
//       eventMap.set(thisElement, newEventMap);
//     }
//     console.log("부모", thisElement.parentElement)
//     thisElement = thisElement.parentElement;
//   }
// }
//
// export function setupEventListeners(root) {
//   rootElement = root;
//   Object.entries(eventMap).forEach(([element, eventTypeMap]) => {
//     Object.entries(eventTypeMap).forEach(([eventType, handler]) => {
//       rootElement.removeEventListener(eventType, (event) => handleEvent(element, event));
//       rootElement.addEventListener(eventType, (event) => handleEvent(element, event));
//     })
//   })
// }
//
// export function handleEvent(element, event) {
//   let target = event.target;
//   // 이벤트 버블 현상으로 Root까지 찾아나가기
//   while (target && target !== rootElement) {
//     const eventHandlerMap = eventMap.get(element);
//     if (eventHandlerMap) {
//       Object.entries(eventHandlerMap).forEach(([eventType, handler]) => {
//         handler(event);
//       });
//     }
//     target = target.parentElement;
//   }
// }
//
// export function removeEvent(element, eventType, handler) {
//   let thisElement = element;
//   while (thisElement && thisElement !== rootElement) {
//     const eventTypeMap = eventMap.get(thisElement);
//     if (eventTypeMap) {
//       if (eventTypeMap.get(eventType)) {
//         eventTypeMap.delete(eventType)
//       }
//       if(Object.entries(eventTypeMap).length === 0) {
//         eventMap.delete(thisElement);
//       }
//     } else {
//       return;
//     }
//
//     if (thisElement.size === 0) {
//       eventMap.delete(thisElement);
//       const eventTypeMap = eventMap.get(thisElement);
//       Object.entries(([key, value]) => {
//         if (rootElement && rootElement._listener?.has(key)) {
//           rootElement.removeEventListener(key, (event) => handleEvent(thisElement, event), true);
//           rootElement._listener.delete(key);
//         }
//       })
//
//     }
//     thisElement = element.parentElement;
//   }
// }

const eventMap = new Map();
let rootElement = null;

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(element)) {
    eventMap.set(element, new Map());
  }
  eventMap.get(element).set(eventType, handler);
}

export function setupEventListeners(root) {
  // 기존 리스너 제거
  if (rootElement) {
    const handlers = rootElement._eventHandlers || new Map();
    for (const [type, handler] of handlers) {
      rootElement.removeEventListener(type, handler);
    }
  }

  rootElement = root;
  rootElement._eventHandlers = new Map();

  for (const eventData of eventMap) {
    const eventTypeMap = eventData[1];
    for (const eventTypeData of eventTypeMap) {
      const eventType = eventTypeData[0];
      if (!rootElement._eventHandlers.has(eventType)) {
        const boundHandler = (event) => handleEvent(event);
        rootElement._eventHandlers.set(eventType, boundHandler);
        rootElement.addEventListener(eventType, boundHandler);
      }
    }
  }
}

export function handleEvent(event) {
  let target = event.target;
  const eventType = event.type;

  while (target && target !== rootElement) {
    if (eventMap.has(target)) {
      const handler = eventMap.get(target).get(eventType);
      if (handler) {
        // console.log("여기 에러나나", handler, event)
        handler?.(event);
      }
    }
    target = target.parentElement;
  }
}

export function removeEvent(element, eventType) {
  if (!eventMap.has(element)) return;

  const elementEvents = eventMap.get(element);
  elementEvents.delete(eventType);

  if (elementEvents.size === 0) {
    eventMap.delete(element);
  }

  // 해당 이벤트 타입에 대한 리스너가 더 이상 필요없는 경우
  if (![...eventMap.values()].some((map) => map.has(eventType))) {
    const handler = rootElement._eventHandlers?.get(eventType);
    if (handler) {
      rootElement.removeEventListener(eventType, handler, true);
      rootElement._eventHandlers.delete(eventType);
    }
  }
}

// function handleEvent(event) {
//   let target = event.target;
//   while (target && target !== rootElement) {
//     const elementHandlers = eventMap.get(event.type)?.get(target);
//     if (elementHandlers) {
//       elementHandlers.forEach((handler) => handler(event));
//     }
//     target = target.parentNode;
//   }
// }
//
// export function setupEventListeners(root) {
//   rootElement = root;
//   eventMap.forEach((handlers, eventType) => {
//     rootElement.removeEventListener(eventType, handleEvent);
//     rootElement.addEventListener(eventType, handleEvent);
//   });
// }
//
// // 컴포넌트이 이벤트를 추가해주는 함수
// export function addEvent(element, eventType, handler) {
//   if (!eventMap.has(eventType)) {
//     eventMap.set(eventType, new WeakMap());
//   }
//   const elementMap = eventMap.get(eventType);
//   if (!elementMap.has(element)) {
//     elementMap.set(element, new Set());
//   }
//   elementMap.get(element).add(handler);
// }
//
// export function removeEvent(element, eventType, handler) {
//   const elementMap = eventMap.get(eventType);
//   if (!elementMap) return;
//
//   const handlers = elementMap.get(element);
//   if (handlers) {
//     handlers.delete(handler);
//     if (handlers.size === 0) {
//       elementMap.delete(element);
//     }
//   }
//
//   if (element.size === 0) {
//     eventMap.delete(eventType);
//     if (rootElement && rootElement._listener?.has(eventType)) {
//       rootElement.removeEventListener(eventType, handleEvent, true);
//       rootElement._listener.delete(eventType);
//     }
//   }
// }
