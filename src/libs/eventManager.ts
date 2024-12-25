import { DOMEventType, eventTypes } from "@types";

type EventHandlerMap = Map<string, Set<Function>>;
const eventMap = new WeakMap<HTMLElement, EventHandlerMap>();

export function setupEventListeners(container: HTMLElement) {
  if (container.getAttribute("data-event-listeners") === "true") {
    return;
  }

  eventTypes.forEach((eventType) => {
    container.addEventListener(eventType, (e: Event) => {
      let target = e.target as HTMLElement;
      while (target && target !== container) {
        const elementEvents = eventMap.get(target);
        if (elementEvents) {
          const handlers = elementEvents.get(eventType);
          if (handlers) {
            const handlerArray = Array.from(handlers);
            for (const handler of handlerArray) {
              if (typeof handler === "function") {
                handler(e);
                return;
              }
            }
          }
        }
        target = target.parentElement!;
      }
    });
  });

  container.setAttribute("data-event-listeners", "true");
}

export function addEvent(
  element: HTMLElement,
  eventType: DOMEventType,
  handler: Function,
) {
  if (!eventMap.has(element)) {
    eventMap.set(element, new Map());
  }

  const elementEvents = eventMap.get(element)!;
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }

  elementEvents.get(eventType)!.add(handler);
}

export function removeEvent(
  element: HTMLElement,
  eventType: DOMEventType,
  handler: Function,
) {
  const elementEvents = eventMap.get(element);
  if (!elementEvents) return;

  const handlers = elementEvents.get(eventType);
  if (!handlers) return;

  handlers.delete(handler);
}
