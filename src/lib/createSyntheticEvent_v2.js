function createSyntheticEvent(Interface) {
  function SyntheticBaseEvent(name, eventType, nativeEvent, nativeEventTarget) {
    this._name = name;
    this.nativeEvent = nativeEvent;
    this.target = nativeEventTarget;
    this.currentTarget = null;

    // Interface 속성들 적용
    for (let prop in Interface) {
      if (Interface.hasOwn(Interface, prop)) {
        this[prop] = Interface[prop];
      }
    }

    const defaultPrevented = nativeEvent.defaultPrevented ?? false;
    this.isDefaultPrevented = () => defaultPrevented;
    this.isPropagationStopped = () => false;

    return this;
  }

  Object.assign(SyntheticBaseEvent.prototype, {
    preventDefault: function () {
      this.defaultPrevented = true;
      const event = this.nativeEvent;
      if (!event) return;
      if (event.preventDefault) {
        event.preventDefault();
      }
    },
    stopPropagation: function () {
      const event = this.nativeEvent;
      if (!event) return;
      if (event.stopPropagation) {
        event.stopPropagation();
      }
      this.isPropagationStopped = () => true;
    },
  });

  return SyntheticBaseEvent;
}

/**
 * @property {number} eventPhase - 이벤트 현재 단계
 * @property {boolean} bubbles - 이벤트 버블링 여부
 * @property {boolean} cancelable - preventDefault()로 취소 가능 여부
 * @property {boolean} bubbles - preventDefault() 호출 여부
 */
const EventInterface = {
  eventPhase: 0,
  bubbles: 0,
  cancelable: 0,
  defaultPrevented: 0,
};
export const SyntheticEvent = createSyntheticEvent(EventInterface);

const UIEventInterface = {
  ...EventInterface,
  view: 0,
  detail: 0,
};
export const SyntheticUIEvent = createSyntheticEvent(UIEventInterface);

const TouchEventInterface = {
  ...UIEventInterface,
  touches: 0,
  targetTouches: 0,
  changedTouches: 0,
  altKey: 0,
  metaKey: 0,
  ctrlKey: 0,
  shiftKey: 0,
};
export const SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface);

const MouseEventInterface = {
  ...UIEventInterface,
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
  pageX: 0,
  pageY: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  button: 0,
  buttons: 0,
};
export const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);

const DragEventInterface = {
  ...MouseEventInterface,
  dataTransfer: 0,
};
export const SyntheticDragEvent = createSyntheticEvent(DragEventInterface);

const FocusEventInterface = {
  ...UIEventInterface,
  relatedTarget: 0,
};
export const SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface);

const WheelEventInterface = {
  ...MouseEventInterface,
  deltaX(event) {
    return "deltaX" in event
      ? event.deltaX
      : "wheelDeltaX" in event
        ? -event.wheelDeltaX
        : 0;
  },
  deltaY(event) {
    return "deltaY" in event
      ? event.deltaY
      : "wheelDeltaY" in event
        ? -event.wheelDeltaY
        : "wheelDelta" in event
          ? -event.wheelDelta
          : 0;
  },
  deltaZ: 0,
  deltaMode: 0,
};
export const SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface);
