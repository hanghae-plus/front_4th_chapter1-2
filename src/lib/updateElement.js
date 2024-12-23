import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (originNewProps === null) {
    return;
  }

  Object.entries(originNewProps).forEach(([key, value]) => {
    const oldPropsValue = originOldProps[key];
    if (key === "className") {
      if (value !== oldPropsValue) {
        target.classList = value;
      }
      return;
    }
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      if (oldPropsValue) {
        removeEvent(target, eventType);
      }
      addEvent(target, eventType, value);
      return;
    }
    target.setAttribute(key, value);
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    const newElement = createElement(newNode);
    parentElement.append(newElement);
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode != oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    const oldElement = parentElement.childNodes[index];
    if (oldElement) {
      parentElement.replaceChild(newElement, parentElement.childNodes[index]);
      return;
    }
    parentElement.appendChild(newElement);
    return;
  }

  const element = parentElement.childNodes[index];
  const newChildren = newNode.children;
  const oldChildren = oldNode.children;
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  updateAttributes(element, newNode.props, oldNode.props);

  for (let i = 0; i < maxLength; i++) {
    updateElement(element, newChildren[i], oldChildren[i], i);
  }
}
