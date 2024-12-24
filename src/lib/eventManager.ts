import { HTMLEventName } from "@/types/event";
import { htmlEventNames } from "@/constants/htmlEventsName";

let listeners: Partial<
  Record<HTMLEventName, WeakMap<HTMLElement, (e: Event) => void>>
> = {};

export function setupEventListeners($root: HTMLElement) {
  htmlEventNames.forEach((eventType) => {
    $root.removeEventListener(eventType, handleGlobalEvent, false);
  });
  registerGlobalEvent($root);
}

export function addEvent(
  element: HTMLElement,
  eventType: HTMLEventName,
  handler: (e: Event) => void,
) {
  if (!listeners[eventType]) {
    listeners[eventType] = new WeakMap();
  }
  listeners[eventType].set(element, handler);
}

export function removeEvent(element: HTMLElement, eventType: HTMLEventName) {
  listeners[eventType]?.delete(element);
}

function registerGlobalEvent($root: HTMLElement) {
  htmlEventNames.forEach((eventType) => {
    $root.addEventListener(eventType, handleGlobalEvent, false);
  });
}

function handleGlobalEvent(e: Event) {
  const { type, target } = e;
  const handler = listeners[type]?.get(target);
  if (handler) return handler(e);
  e.stopPropagation();
}
