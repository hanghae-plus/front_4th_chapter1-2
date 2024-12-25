// import { addEvent, removeEvent } from "./eventManager";
// import { createElement } from "./createElement.js";

// function updateAttributes(target, originNewProps, originOldProps) {}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    oldNode.remove();
  }

  if (!oldNode && newNode) {
    if (index === 0) {
      parentElement.insertBefore(newNode, parentElement.firstChild);
    } else {
      parentElement.appendChild(newNode);
    }
  }
}
