const eventListeners = new Map();
let $root = null;

function handleEvent(e) {
  let target = e.target;

  while (target && target !== $root) {
    const handlers = eventListeners.get(e.type)?.get(target);
    if (handlers) {
      handlers.forEach((handler) => handler(e));
    }
    target = target.parentElement;
  }
}

export function setupEventListeners(root) {
  if (!root) return;
  $root = root;

  eventListeners.forEach((handlers, eventType) => {
    $root.removeEventListener(eventType, handleEvent);
    $root.addEventListener(eventType, handleEvent);
  });

  // const supportedEvents = ["click", "input", "change", "submit"];

  // supportedEvents.forEach((eventType) => {
  //   if (!eventListeners.has(eventType)) {
  //     eventListeners.set(eventType, new Map());
  //   }

  //   root.addEventListener(eventType, handleEvent, true);
  // });
}

export function addEvent(element, eventType, handler) {
  if (!eventListeners.has(eventType)) {
    eventListeners.set(eventType, new WeakMap());
  }

  const handlers = eventListeners.get(eventType);
  if (!handlers.has(element)) {
    handlers.set(element, new Set());
  }

  handlers.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const handlersMap = eventListeners.get(eventType);
  if (!handlersMap) return;

  const handlers = handlersMap.get(element);
  if (!handlers) return;

  if (handler) {
    handlers.delete(handler);

    if (handlers.size === 0) {
      handlersMap.delete(element);
    }
  } else {
    handlersMap.delete(element);
  }

  if (handlersMap.size === 0) {
    eventListeners.delete(eventType);
  }
}

// export function removeEvent(element, eventType, handler) {
//   const elementEvents = eventListeners.get(element);
//   if (!elementEvents) return;

//   if (handler) {
//     const handlers = elementEvents.get(eventType);
//     if (handlers) {
//       handlers.delete(handler);
//       if (handlers.size === 0) {
//         elementEvents.delete(eventType);
//       }
//     }
//   } else {
//     elementEvents.delete(eventType);
//   }

//   if (elementEvents.size === 0) {
//     eventListeners.delete(element);
//   }

//   // const handlers = eventListeners.get(eventType);

//   // if (!handlers) return;

//   // const handlerList = handlers.get(element);
//   // if (handlerList) {
//   //   handlerList.delete(handler);
//   //   if (handlerList.size === 0) {
//   //     handlers.delete(element);
//   //   }
//   // }

//   // if (eventListeners.size === 0) {
//   //   eventListeners.delete(eventType);
//   //   if ($root && $root._listeners?.has(eventType)) {
//   //     $root.removeEventListener(eventType, handleEvent, true);
//   //     $root._listeners.delete(eventType);
//   //   }
//   // }
// }
