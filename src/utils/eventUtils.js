const eventHandlers = {};

const handleGlobalEvents = (e) => {
  const handlers = eventHandlers[e.type];
  if (!handlers) return;

  for (const selector in handlers) {
    if (e.target.matches(selector)) {
      handlers[selector](e);
      break;
    }
  }
};

export const registerGlobalEvents = (() => {
  let init = false;
  return () => {
    if (init) {
      return;
    }

    Object.keys(eventHandlers).forEach((eventType) => {
      document.body.addEventListener(eventType, handleGlobalEvents);
    });

    init = true;
  };
})();

export const addEvent = (eventType, selector, handler) => {
  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = {};
  }
  eventHandlers[eventType][selector] = handler;
};

/**
 * 합성이벤트(SyntheticEvent) 정의
 * https://ko.legacy.reactjs.org/docs/events.html#overview
 */
export const createBaseSyntheticEvent = (nativeEvent) => {
  const synthetic = {
    nativeEvent,
    target: nativeEvent.target,
    currentTarget: nativeEvent.currentTarget,
    type: nativeEvent.type,
    bubbles: nativeEvent.bubbles,
    defaultPrevented: false,
    propagationStopped: false,

    preventDefault: () => {
      synthetic.defaultPrevented = true;
      nativeEvent.preventDefault();
    },

    stopPropagation: () => {
      synthetic.propagationStopped = true;
      nativeEvent.stopPropagation();
    },

    persist: () => {
      Object.freeze(synthetic);
    },
  };

  return synthetic;
};
