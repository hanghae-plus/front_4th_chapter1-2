function createEventManager() {
  const elementEventMap = new Map();

  return {
    setupEventListeners: (root) => {
      const delegatedEvents = new Map();

      elementEventMap.forEach((eventTypeHandlerSetMap) => {
        eventTypeHandlerSetMap.forEach((_, eventType) => {
          if (!delegatedEvents.has(eventType)) {
            const handleAllEvent = (event) => {
              let element = event.target;

              while (element && element !== root) {
                const eventHandlerSet =
                  elementEventMap.get(element)?.get(eventType) ?? new Set();

                eventHandlerSet.forEach((eventHandler) => {
                  eventHandler(event);
                });

                element = element.parentNode;
              }
            };

            root.addEventListener(eventType, handleAllEvent);
            delegatedEvents.set(eventType, handleAllEvent);
          }
        });
      });
    },

    addEvent: (element, eventType, handler) => {
      if (!elementEventMap.has(element)) {
        elementEventMap.set(element, new Map());
      }

      const eventTypeHandlerMap = elementEventMap.get(element);

      if (!eventTypeHandlerMap.has(eventType)) {
        eventTypeHandlerMap.set(eventType, new Set());
      }

      eventTypeHandlerMap.get(eventType).add(handler);
    },

    removeEvent: (element, eventType, handler) => {
      if (elementEventMap.has(element)) {
        const eventTypeHandlerMap = elementEventMap.get(element);

        if (eventTypeHandlerMap.has(eventType)) {
          eventTypeHandlerMap.get(eventType).delete(handler);

          if (eventTypeHandlerMap.get(eventType).size === 0) {
            eventTypeHandlerMap.delete(eventType);
          }
        }

        if (eventTypeHandlerMap.size === 0) {
          elementEventMap.delete(element);
        }
      }
    },
  };
}

const { addEvent, removeEvent, setupEventListeners } = createEventManager();

export { addEvent, removeEvent, setupEventListeners };
