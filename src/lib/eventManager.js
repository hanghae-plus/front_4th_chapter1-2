// addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에
// 저장하거나 삭제합니다.

// setupEventListeners를 이용해서 이벤트 함수를 가져와서
// 한 번에 root에 이벤트를 등록합니다.

// 이벤트 저장
const eventStorage = {};
// const eventStorage = new Map();

export function setupEventListeners(root) {
  Object.keys(eventStorage).forEach((eventType) => {
    root.addEventListener(eventType, eventHandlers);
  });
}
// export function setupEventListeners(root) {
//   eventStorage.forEach((handlerMap, eventType) => {
//     root.addEventListener(eventType, eventHandlers);
//   });
// }

export function addEvent(element, eventType, handler) {
  if (!eventStorage[eventType]) {
    eventStorage[eventType] = new Map();
  }

  const eventsMap = eventStorage[eventType];
  eventsMap.set(element, handler);

  // if (!eventStorage.has(eventType)) {
  //   eventStorage.set(eventType, new Map());
  // }

  // const handlerMap = eventStorage.get(eventType);
  // handlerMap.set(element, handler);
}

export function removeEvent(element, eventType) {
  if (eventStorage[eventType]) {
    const eventsMap = eventStorage[eventType];
    eventsMap.delete(element);

    if (eventsMap.size === 0) {
      delete eventStorage[eventType];
    }
  }
}
// export function removeEvent(element, eventType) {
//   if (eventStorage[eventType]) {
//     const handlerMap = eventStorage[eventType];
//     handlerMap.delete(element);

//     if (handlerMap.size === 0) {
//       delete eventStorage[eventType];
//     }
//   }
// }

const eventHandlers = (e) => {
  if (!eventStorage[e.type]) {
    return;
  }
  const handlerGroup = eventStorage[e.type];
  const handler = handlerGroup.get(e.target);

  if (handler) {
    handler(e);
  }
};

// const eventHandlers = (e) => {
//   if (!eventStorage[e.type]) {
//     return;
//   }
//   const handlerMap = eventStorage[e.type];
//   const handler = handlerMap.get(e.target);

//   if (handler) {
//     handler(e);
//   }
// };
