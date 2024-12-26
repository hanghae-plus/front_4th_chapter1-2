import {
  SyntheticDragEvent,
  SyntheticEvent,
  SyntheticFocusEvent,
  SyntheticMouseEvent,
  SyntheticTouchEvent,
  SyntheticUIEvent,
  SyntheticWheelEvent,
} from "./createSyntheticEvent.js";

export const supportedEventNames = new Set([
  "click",
  "change",
  "input",
  "submit",
  "keydown",
  "keyup",
  "keypress",
  "mousedown",
  "mouseup",
  "mouseover",
  "mouseout",
  "mousemove",
  "focus",
  "blur",
]);

export function extractEvent(domEventName, nativeEvent, nativeEventTarget) {
  if (!supportedEventNames.has(domEventName)) {
    console.error("지원하지 않는 이벤트 형식입니다.", domEventName);
    return;
  }
  let SyntheticEventConstructor = SyntheticEvent;
  let eventType = domEventName;
  switch (domEventName) {
    case "click":
    case "mousedown":
    case "mousemove":
    case "mouseup":
    case "mouseout":
    case "mouseover":
    case "contextmenu":
      SyntheticEventConstructor = SyntheticMouseEvent;
      break;
    case "drag":
    case "dragend":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "dragstart":
    case "drop":
      SyntheticEventConstructor = SyntheticDragEvent;
      break;
    case "touchcancel":
    case "touchend":
    case "touchmove":
    case "touchstart":
      SyntheticEventConstructor = SyntheticTouchEvent;
      break;
    case "scroll":
    case "scrollend":
      SyntheticEventConstructor = SyntheticUIEvent;
      break;
    case "wheel":
      SyntheticEventConstructor = SyntheticWheelEvent;
      break;
    case "focusin":
    case "focusout":
    case "beforeblur":
    case "afterblur":
      SyntheticEventConstructor = SyntheticFocusEvent;
      break;
  }

  const event = new SyntheticEventConstructor(
    name,
    eventType,
    nativeEvent,
    nativeEventTarget,
  );

  return event;
}
