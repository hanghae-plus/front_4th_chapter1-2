import { SIMPLE_EVENTS } from "./constants";

export const setupEventListeners = (root) =>
  eventManager.setupEventListeners(root);
export const addEvent = (element, eventType, handler) =>
  eventManager.addEvent(element, eventType, handler);
export const removeEvent = (element, eventType, handler) =>
  eventManager.removeEvent(element, eventType, handler);

interface DelegatedEvent {
  eventType: string;
  element: HTMLElement;
  handler: EventListener;
}

export const eventManager = (() => {
  let $root: Element;
  let eventSet = new Map<string, Array<DelegatedEvent>>();
  const deleteQueue = new Set<DelegatedEvent>();

  function sync() {
    for (const event of deleteQueue) {
      console.log(
        `${event.element.tagName}의 ${event.eventType} 이벤트가 제거되었습니다.`,
      );

      $root.removeEventListener(event.eventType, event.handler);
    }

    deleteQueue.clear();
  }

  return {
    eventSet,
    addEvent: (element, eventType, handler: EventListener) => {
      if (eventSet.has(eventType)) {
        eventSet.get(eventType)!.push({
          eventType,
          element,
          handler,
        });
      } else {
        eventSet.set(eventType, [
          {
            eventType,
            element,
            handler,
          },
        ]);
      }
      console.log(
        `${element.tagName} 의 ${eventType} 이벤트(${handler.name})가 추가되었습니다.`,
        eventSet.get(eventType)?.map((x) => ({
          ...x,
          element: x.element.tagName,
          handler: x.handler.name,
        })),
      );
    },

    removeEvent: (element, eventType, handler: EventListener) => {
      const targetEvents = (eventSet.get(eventType) ?? []).filter(
        (event) =>
          event.element === element &&
          event.eventType === eventType &&
          event.handler === handler,
      );

      console.log(
        `${element.tagName} 의 ${eventType} 이벤트(${handler.name})가 제거되었습니다.`,
      );

      for (const targetEvent of targetEvents) {
        eventSet.set(
          eventType,
          eventSet.get(eventType)!.filter((x) => x !== targetEvent),
        );

        deleteQueue.add(targetEvent);
      }

      sync();
    },

    setupEventListeners: (root: HTMLElement) => {
      if (root == null) return;
      $root = root;

      if (root.getAttribute("isRegisteredEventListeners") != null) return;
      root.setAttribute("isRegisteredEventListeners", "true");

      for (const _eventType of SIMPLE_EVENTS) {
        const eventType = _eventType.toLowerCase();
        if (eventType === "focus" || eventType === "click") {
          console.log(
            `${$root.tagName} #root 의 ${eventType} 전역 이벤트가 추가되었습니다.`,
          );
        }
        $root.addEventListener(eventType, function (e) {
          console.log(`${eventType} 전역 이벤트가 발생했습니다.`);
          let target = e.target;
          if (!eventSet.has(eventType)) {
            return;
          }

          while (target && target !== $root) {
            const targetEvents = eventSet.get(eventType)!;
            for (const event of targetEvents) {
              if (event.element === target) {
                event.handler(e);
                break;
              }
            }

            target = (target as any).parentElement;
          }
        });
      }
    },
  };
})();
