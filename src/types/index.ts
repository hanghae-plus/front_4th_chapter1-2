export interface VNodeProps {
  [key: string]: any;
  children?: VNodeChild[];
}

export type VNode = {
  type: string | Function;
  props: VNodeProps | null;
  children: VNodeChild[];
};

export type VNodeChild = string | number | boolean | null | undefined | VNode;

type MouseEvent =
  | "click"
  | "dblclick"
  | "mousedown"
  | "mouseup"
  | "mousemove"
  | "mouseover"
  | "mouseout"
  | "mouseenter"
  | "mouseleave";
type KeyboardEvent = "keydown" | "keyup" | "keypress";
type FormEvent = "submit" | "change" | "focus" | "blur" | "input";
type TouchEvent = "touchstart" | "touchend" | "touchmove" | "touchcancel";
type DragEvent =
  | "dragstart"
  | "drag"
  | "dragenter"
  | "dragleave"
  | "dragover"
  | "drop"
  | "dragend";

export type DOMEventType =
  | MouseEvent
  | KeyboardEvent
  | FormEvent
  | TouchEvent
  | DragEvent;

export const eventTypes: DOMEventType[] = [
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseover",
  "mouseout",
  "mouseenter",
  "mouseleave",
  "keydown",
  "keyup",
  "keypress",
  "submit",
  "change",
  "focus",
  "blur",
  "input",
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",
  "dragstart",
  "drag",
  "dragenter",
  "dragleave",
  "dragover",
  "drop",
  "dragend",
] as const;
