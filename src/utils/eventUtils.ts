type DOMEventType = keyof HTMLElementEventMap;

type EventHandler<T extends DOMEventType> = (
  event: HTMLElementEventMap[T],
) => void;

const eventStore = new Map<
  DOMEventType,
  Map<string, EventHandler<DOMEventType>>
>();

const handleGlobalEvents = <T extends DOMEventType>(
  e: HTMLElementEventMap[T],
) => {
  const handlers = eventStore.get(e.type as T);
  if (!handlers) return;

  const target = e.target as Element;

  handlers.forEach((handler, selector) => {
    if (target.matches(selector)) {
      handler(e);
    }
  });
};

export const registerGlobalEvents = (() => {
  let initialized = false;

  return () => {
    if (initialized) return;

    eventStore.forEach((_, eventType) => {
      document.body.addEventListener(eventType, (e: Event) =>
        handleGlobalEvents(e as HTMLElementEventMap[typeof eventType]),
      );
    });

    initialized = true;
  };
})();

export const addEvent = <T extends DOMEventType>(
  eventType: T,
  selector: string,
  handler: EventHandler<T>,
) => {
  if (!eventStore.has(eventType)) {
    eventStore.set(eventType, new Map());
  }

  const handlers = eventStore.get(eventType)!;
  handlers.set(selector, handler as EventHandler<DOMEventType>);
};
