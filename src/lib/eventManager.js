import { ALL_EVENTS } from "@/constants/events";
import { createBaseSyntheticEvent } from "../utils";

const eventHandlersMap = new WeakMap();

export function setupEventListeners(root) {
  if (root.hasInitializedEventListeners) {
    return;
  }

  ALL_EVENTS.forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      const eventBubblingChainPath = event.composedPath();
      const destinationElement = eventBubblingChainPath.indexOf(root);
      const virtualEventBoundary = eventBubblingChainPath.slice(
        0,
        destinationElement,
      );

      const syntheticEvent = createBaseSyntheticEvent(event);

      for (const currentTarget of virtualEventBoundary) {
        const elementEvents = eventHandlersMap.get(currentTarget);
        if (elementEvents && elementEvents.has(eventType)) {
          const handlers = elementEvents.get(eventType);

          for (const handler of handlers) {
            syntheticEvent.currentTarget = currentTarget;
            handler(syntheticEvent);
          }

          if (syntheticEvent.propagationStopped) {
            return;
          }
        }
      }
    });
  });

  root.hasInitializedEventListeners = true;
}

export function addEvent(element, eventType, handler) {
  if (!eventHandlersMap.has(element)) {
    eventHandlersMap.set(element, new Map());
  }

  const elementEvents = eventHandlersMap.get(element);
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }

  elementEvents.get(eventType).add(handler);
}

export function removeEvent(element, eventType, handler) {
  if (!eventHandlersMap.has(element)) {
    return;
  }

  const elementEvents = eventHandlersMap.get(element);
  if (!elementEvents.has(eventType)) {
    return;
  }

  const handlers = elementEvents.get(eventType);
  handlers.delete(handler);

  if (handlers.size === 0) {
    elementEvents.delete(eventType);
  }

  if (elementEvents.size === 0) {
    eventHandlersMap.delete(element);
  }
}
