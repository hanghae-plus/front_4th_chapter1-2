import { addEvent, removeEvent } from "./eventManager.js";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {}

export function updateElement(
  parentElement,
  newNode,
  oldNode,
  index = 0,
): HTMLElement {
  return createElement(newNode);
}
