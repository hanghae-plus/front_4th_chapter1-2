const eventManager = () => {
  let events = [];
  let rootElement = null;

  const createScopedEventHandler = (addEvent) => {
    return (e) => {
      const target = e.target;
      if (target !== addEvent.element) return;
      addEvent.handler(e);
    };
  };
  const setupEventListeners = (root) => {
    rootElement = root;

    events.forEach(({ eventType, handler: convertHandler }) => {
      rootElement.removeEventListener(eventType, convertHandler);
    });

    events.forEach((event) => {
      rootElement.addEventListener(event.eventType, event.handler);
    });
  };

  const addEvent = (element, eventType, handler) => {
    const isExistingEvent = events.some(
      (event) =>
        event.element == element &&
        event.eventType == eventType &&
        event.originalHandler == handler,
    );
    if (isExistingEvent) return;

    const scopedEventHandler = createScopedEventHandler({
      element,
      eventType,
      handler,
    });
    events.push({
      element,
      eventType,
      handler: scopedEventHandler,
      originalHandler: handler,
    });
  };
  const removeEvent = (element, eventType, handler) => {
    const sameEvent = events.filter(
      (prevEvent) =>
        prevEvent.element === element &&
        prevEvent.eventType === eventType &&
        prevEvent.originalHandler === handler,
    );

    sameEvent.forEach(({ eventType, handler: convertHandler }) => {
      rootElement.removeEventListener(eventType, convertHandler);
    });

    events = events.filter(
      (prevEvent) =>
        prevEvent.element !== element ||
        prevEvent.eventType !== eventType ||
        prevEvent.originalHandler !== handler,
    );
  };

  return { setupEventListeners, addEvent, removeEvent };
};
export const { setupEventListeners, addEvent, removeEvent } = eventManager();
