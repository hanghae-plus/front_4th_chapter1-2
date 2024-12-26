import { extractEvent, supportedEventNames } from "./extractEvent.js";

export const eventStore = new WeakMap();

export function listenToAllSupportedEvents(root) {
  if (root._eventsInitialized) return;
  supportedEventNames.forEach((domEventName) => {
    listenToNativeEvent(root, domEventName);
  });

  root._eventsInitialized = true;
}

function listenToNativeEvent(target, eventType) {
  const listener = (nativeEvent) => {
    dispatchEvent(eventType, target, nativeEvent);
  };

  target.addEventListener(eventType, listener, false);
}

function dispatchEvent(domEventName, targetContainer, nativeEvent) {
  const syntheticEvent = extractEvent(
    domEventName,
    nativeEvent,
    nativeEvent.target,
  );
  const dispatchQueue = accumulateListeners(
    nativeEvent.target,
    targetContainer,
    domEventName,
  );

  for (let i = 0; i < dispatchQueue.length; i++) {
    const { handler, currentTarget } = dispatchQueue[i];
    syntheticEvent.currentTarget = currentTarget;
    handler(syntheticEvent);
    syntheticEvent.currentTarget = null;
  }
}

function accumulateListeners(target, rootContainer, eventType) {
  let dispatchQueue = [];
  let currentTarget = target;

  while (currentTarget && currentTarget !== rootContainer) {
    const elementEvents = eventStore.get(currentTarget);
    if (elementEvents?.has(eventType)) {
      const handlers = elementEvents.get(eventType);
      handlers.forEach((handler) => {
        dispatchQueue.push({ handler, currentTarget });
      });
    }
    currentTarget = currentTarget.parentNode;
  }
  return dispatchQueue;
}

/**
 * 이벤트 핸들러를 등록한다.
 */
export function addEvent(element, eventType, handler) {
  if (!eventStore.has(element)) {
    eventStore.set(element, new Map());
  }

  const elementEvents = eventStore.get(element);
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }

  elementEvents.get(eventType).add(handler);
}

/*
 * 이벤트 핸들러를 제거한다.
 */
export function removeEvent(element, eventType, handler) {
  if (!eventStore.has(element)) return;

  const elementEvents = eventStore.get(element);
  if (!elementEvents.has(eventType)) return;

  elementEvents.get(eventType).delete(handler);

  if (elementEvents.size === 0) {
    eventStore.delete(element);
  }
}
