const eventArray = [];
let $el = null;

export function setupEventListeners(root) {
  $el = root;
  eventArray.forEach((event) => {
    root.addEventListener(event.eventType, event.handler);
  });
}

export function addEvent(element, eventType, handler) {
  eventArray.push({ element, eventType, handler });
}

export function removeEvent(element, eventType, handler) {
  const index = eventArray.findIndex(
    ({ element: el, eventType: et, handler: h }) =>
      el === element && et === eventType && h === handler,
  );
  if (index !== -1) {
    eventArray.splice(index, 1);
  }

  $el.removeEventListener(eventType, handler);
}
