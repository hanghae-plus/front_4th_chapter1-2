const events = [];
let root = null;

export function setupEventListeners(_root) {
  root = _root;

  // 모든 이벤트 타입에 대해 이벤트 리스너를 등록합니다.
  const eventTypes = ["click", "input"]; // 필요한 다른 이벤트 타입도 추가할 수 있습니다.
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(event) {
  const { target, type } = event;

  events.forEach(({ element, eventType, handler }) => {
    if (
      eventType === type &&
      (element === target || target.closest(element.tagName) === element)
    ) {
      handler.call(element, event);
    }
  });
}

export function addEvent(element, eventType, handler) {
  const isIncluded = events.some((event) => {
    return isSameEvent(event, { element, eventType, handler });
  });

  if (isIncluded) {
    console.log(`Event already exists: ${eventType} on element:`, element);
    return;
  }

  events.push({ element, eventType, handler });
  console.log(`Added event: ${eventType} to element:`, element);
}

export function removeEvent(element, eventType, handler) {
  console.log(
    `Attempting to remove event: ${eventType} from element:`,
    element,
  );

  const found = events.find((event) => {
    return isSameEvent(event, { element, eventType, handler });
  });

  if (!found) {
    console.log(`Event not found: ${eventType} on element:`, element);
    return;
  }

  const index = events.indexOf(found);
  events.splice(index, 1);

  root.removeEventListener(eventType, handler);
  console.log(`Removed event: ${eventType} from element:`, element);
}

function isSameEvent(a, b) {
  const sameElement = a.element === b.element;
  const sameEventType = a.eventType === b.eventType;
  const sameHandler = a.handler === b.handler;
  return sameElement && sameEventType && sameHandler;
}
