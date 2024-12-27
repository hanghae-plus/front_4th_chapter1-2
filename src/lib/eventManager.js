const eventArray = [];
let $el = null;

export function setupEventListeners(root) {
  $el = root;
  eventArray.forEach((event) => {
    $el.addEventListener(event.eventType, event.handler);
  });
}

export function addEvent(element, eventType, handler) {
  eventArray.push({ element, eventType, handler });
}

export function removeEvent(element, eventType, handler) {
  const delEvent = eventArray.find(
    ({ element: el, eventType: et, handler: h }) =>
      el === element && et === eventType && h === handler,
  );

  if (!delEvent) {
    return;
  }

  eventArray.splice(eventArray.indexOf(delEvent), 1);
  $el.removeEventListener(eventType, delEvent.handler);
}
