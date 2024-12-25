import { eventTypes } from "../constants/constant";

const eventMap = new Map();
let rootElement = null;

export function setupEventListeners(root) {
  rootElement = root;

  eventTypes.forEach((eventType) => {
    rootElement.addEventListener(eventType, (event) => {
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
      handlerList.splice(index, 1);
    }
    if (handlerList.length === 0) {
      handlers.delete(eventType);
    }
  }
}
