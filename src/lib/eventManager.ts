import { HTMLEventName } from "@/types/event";
import { htmlEventNames } from "@/constants/htmlEventsName";

let listeners = {};

export function setupEventListeners($root: HTMLElement) {
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

export function removeEvent(element, eventType, handler) {
  listeners[eventType].delete(element);
}

export function removeAllEvent() {
  listeners = {};
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
