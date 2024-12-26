import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (originOldProps) {
    for (const attr of Object.keys(originOldProps)) {
      if (attr.startsWith("on")) {
        const eventType = attr.toLowerCase().slice(2);
        removeEvent(target, eventType);
      }
    }
  }

  if (originNewProps) {
    for (const [attr, value] of Object.entries(originNewProps)) {
      if (originOldProps[attr] === originNewProps[attr]) continue;

      if (attr.startsWith("on") && typeof value === "function") {
        const eventType = attr.toLowerCase().slice(2);
        addEvent(target, eventType, value);
      } else if (attr === "className") {
        target.setAttribute("class", value);
      } else {
        target.setAttribute(attr, value);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  if (newNode && !oldNode) {
    return parentElement.append(createElement(newNode));
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;

    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  const parentEl = parentElement.childNodes[index];
  const newNodeChild = newNode.children;
  const oldNodeChild = oldNode.children;

  const maxLength = Math.max(newNodeChild.length, oldNodeChild.length);

  updateAttributes(parentEl, newNode.props, oldNode.props);

  for (let i = 0; i < maxLength; i++) {
    updateElement(parentEl, newNodeChild[i], oldNodeChild[i], i);
  }
}
