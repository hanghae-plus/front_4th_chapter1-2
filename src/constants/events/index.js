// 마우스 이벤트
export const MOUSE_EVENTS = [
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseover",
  "mouseout",
  "mouseenter",
  "mouseleave",
];

// 키보드 이벤트
export const KEYBOARD_EVENTS = ["keydown", "keyup", "keypress"];

// 폼 이벤트
export const FORM_EVENTS = [
  "submit",
  "reset",
  "change",
  "input",
  "focus",
  "blur",
];

// 문서/윈도우 이벤트
export const DOCUMENT_EVENTS = [
  "load",
  "unload",
  "resize",
  "scroll",
  "DOMContentLoaded",
];

// 드래그 앤 드롭 이벤트
export const DRAG_EVENTS = [
  "dragstart",
  "drag",
  "dragend",
  "dragenter",
  "dragover",
  "dragleave",
  "drop",
];

// 터치 이벤트
export const TOUCH_EVENTS = [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
];

// 모든 이벤트 통합
export const ALL_EVENTS = new Set([
  ...MOUSE_EVENTS,
  ...KEYBOARD_EVENTS,
  ...FORM_EVENTS,
  ...DOCUMENT_EVENTS,
  ...DRAG_EVENTS,
  ...TOUCH_EVENTS,
]);
