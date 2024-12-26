import { router } from "../router";

const eventStore = new WeakMap();

export function addEvent(element, eventType, handler) {
  if (!eventStore.has(element)) {
    eventStore.set(element, new Map());
  }

  const elementEvents = eventStore.get(element);

  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }

  const handlers = elementEvents.get(eventType);
  handlers.add(handler);
}

export function removeEvent(element, eventType, handler) {
  if (!eventStore.has(element)) return;

  const elementEvents = eventStore.get(element);
  if (!elementEvents.has(eventType)) return;

  const handlers = elementEvents.get(eventType);
  handlers.delete(handler);

  if (handlers.size === 0) {
    elementEvents.delete(eventType);
  }

  if (elementEvents.size === 0) {
    eventStore.delete(element);
  }
}

export function setupEventListeners(root) {
  const events = ["click", "input", "change"];

  events.forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      handleEvent(root, eventType, event);
    });
  });
}

function handleEvent(root, eventType, event) {
  let target = event.target;

  while (target && target !== root) {
    if (eventStore.has(target)) {
      const elementEvents = eventStore.get(target);
      if (elementEvents.has(eventType)) {
        const handlers = elementEvents.get(eventType);

        for (const handler of handlers) {
          handler(event);
        }
      }
    }

    if (
      eventType === "click" &&
      target.tagName === "A" &&
      target.href.startsWith(window.location.origin + "/") &&
      !event.defaultPrevented &&
      !event.cancelBubble
    ) {
      event.preventDefault();
      router.get().push(target.href.replace(window.location.origin, ""));
      return;
    }

    target = target.parentElement;
  }
}
