import { eventTypes } from "../constants/constant";

const eventMap = new Map();

export function setupEventListeners(root) {
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      const target = event.target;

      for (const [element, handlers] of eventMap.entries()) {
        if (element === target || element.contains(target)) {
          const eventTypeHandlers = handlers.get("click");
          if (eventTypeHandlers) {
            eventTypeHandlers.forEach((handler) => handler(event));
          }
        }
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(element)) {
    eventMap.set(element, new Map());
  }

  const handlers = eventMap.get(element);
  if (!handlers.has(eventType)) {
    handlers.set(eventType, []);
  }

  const handlerList = handlers.get(eventType);
  if (!handlerList.includes(handler)) {
    handlerList.push(handler);
  }
}

export function removeEvent(element, eventType, handler) {
  if (!eventMap.has(element)) return;

  const handlers = eventMap.get(element);
  if (handlers.has(eventType)) {
    const handlerList = handlers.get(eventType);
    const index = handlerList.indexOf(handler);

    if (index !== -1) {
      handlerList[index] = null;
      handlerList.splice(index, 1);
    }
    if (handlerList.length === 0) {
      handlers.delete(eventType);
      if (handlers.size === 0) {
        eventMap.delete(element);
      }
    }
  }
}
