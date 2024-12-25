export type EventHandler = (e: Event) => void;

export type EventHandlerByEl = WeakMap<EventTarget, EventHandler>;

export const eventHandlersByEventType: Map<string, EventHandlerByEl> =
  new Map();

export const BASIC_EVENT_TYPES = [
  "click",
  "input",
  "change",
  "submit",
  "keyup",
  "keydown",
  "mouseover",
  "focus",
  "blur",
  "scroll",
  "resize",
];

export function setupEventListeners(root: Element) {
  const eventTypes = new Set([
    ...BASIC_EVENT_TYPES,
    ...eventHandlersByEventType.keys(),
  ]);

  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, (e) => {
      const eventHandlerByEl = eventHandlersByEventType.get(eventType);
      const element = e.target;
      eventHandlerByEl?.get(element)?.(e);
    });
  });
}

export function addEvent(
  element: HTMLElement,
  eventType: string,
  handler: EventHandler,
) {
  const targetHandler: EventHandlerByEl =
    eventHandlersByEventType.get(eventType) ?? new WeakMap();
  const newHandlerMap = targetHandler.set(element, handler);

  eventHandlersByEventType.set(eventType, newHandlerMap);
}

export function removeEvent(
  element: EventTarget,
  eventType: string,
  handler: (e: Event) => {},
) {
  const targetHandler = eventHandlersByEventType.get(eventType);

  if (!targetHandler) return;

  targetHandler.delete(element);
}
