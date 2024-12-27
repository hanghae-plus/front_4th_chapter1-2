let events = new Map();

export function setupEventListeners(root) {
  if (events.size > 0) {
    events.forEach((element) => {
      element.forEach((eventType, handler) => {
        root.removeEventListener(handler, eventType);
      });
    });
  }
  events.forEach((element) => {
    element.forEach((eventType, handler) => {
      root.addEventListener(handler, eventType);
    });
  });
}

//createElement("button") === createElement("button") 인가?
// ==> nope 각각 다른 객체

// 엘리먼트 별로 핸들러를 관리하도록 해보기 ==> 통과

// 엘리먼트별로 핸들러를 관리하는데 버블링 우째처리하노...
// 각각 처리되도록 해야하나...?

export function addEvent(element, eventType, handler) {
  if (!events.has(element)) {
    events.set(element, new Map());
  }

  if (!events.get(element).has(eventType)) {
    events.get(element).set(eventType, handler);
  }
}

export function removeEvent(element, eventType, handler) {
  if (events.has(element) && events.get(element).has(eventType)) {
    events.get(element).delete(eventType);
    console.log("====================================");
    console.log("events: ", events.get(handler));
    console.log("====================================");
    if (events.get(element).size === 0) {
      events.delete(element);
    }
  }
}
