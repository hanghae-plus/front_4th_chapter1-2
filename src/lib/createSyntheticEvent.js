/**
 * 합성 이벤트 생성자 함수를 반환하는 팩토리 함수
 * @param Interface Interface 이벤트 타입 별 속성 정의
 * @returns {function(*, *, *, *): SyntheticBaseEvent} 합성 이벤트 생성자 함수
 */
function createSyntheticEvent(Interface) {
  // 기본 합성 이벤트 생성자
  function SyntheticBaseEvent(name, eventType, nativeEvent, nativeEventTarget) {
    this._name = name;
    this.nativeEvent = nativeEvent;
    this.target = nativeEventTarget;
    this.currentTarget = null;

    // Interface에 정의된 속성들을 인스턴스에 복사
    for (let prop in Interface) {
      if (Object.hasOwn(Interface, prop)) {
        this[prop] = Interface[prop];
      }
    }

    // 이벤트 취소/전파 중단 상태 초기화
    const defaultPrevented = nativeEvent.defaultPrevented ?? false;
    this.isDefaultPrevented = () => defaultPrevented;
    this.isPropagationStopped = () => false;

    return this;
  }

  // 이벤트 제어(전파 중단 등)를 위한 메서드 정의
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

// 기본 이벤트 인터페이스 정의
const EventInterface = {
  eventPhase: 0,
  bubbles: 0,
  cancelable: 0,
  defaultPrevented: 0,
};

// UI 이벤트 (click, focus 등의 기본이 되는 이벤트)
const UIEventInterface = {
  ...EventInterface,
  view: 0,
  detail: 0,
};

// 터치 이벤트
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

// 마우스 이벤트 (click, hover 등)
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

// 드래그 이벤트
const DragEventInterface = {
  ...MouseEventInterface,
  dataTransfer: 0,
};

// 터치 이벤트
const FocusEventInterface = {
  ...UIEventInterface,
  relatedTarget: 0,
};

// 휠 이벤트 (마우스 휠, 트랙 패드)
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

// 각 이벤트 타입별 합성 이벤트 생성자 export
export const SyntheticEvent = createSyntheticEvent(EventInterface);
export const SyntheticUIEvent = createSyntheticEvent(UIEventInterface);
export const SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface);
export const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);
export const SyntheticDragEvent = createSyntheticEvent(DragEventInterface);
export const SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface);
export const SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface);
