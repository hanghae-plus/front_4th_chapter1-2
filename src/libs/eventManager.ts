import { DOMEventType, eventTypes } from "../types";

const eventMap = new WeakMap<HTMLElement, Map<string, Set<Function>>>();

export function setupEventListeners(container: HTMLElement) {
  eventTypes.forEach((eventType) => {
    container.addEventListener(eventType, (e: Event) => {
      let target = e.target as HTMLElement;

      while (target && target !== container) {
        const elementEvents = eventMap.get(target);
        if (elementEvents) {
          const handlers = elementEvents.get(eventType);
          if (handlers) {
            handlers.forEach((handler) => handler(e));
          }
        }
        target = target.parentElement!;
      }
    });
  });
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
