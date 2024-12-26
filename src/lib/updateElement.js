import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps = {}, originOldProps = {}) {
  if (originOldProps) {
    Object.keys(originOldProps).forEach((key) => {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        const oldHandler = originOldProps[key];

        if (typeof oldHandler === "function") {
          removeEvent(target, eventType, oldHandler);
          originOldProps[key] = null;
        }
      } else if (!(key in originNewProps)) {
        target.removeAttribute(key);
      }
    });
  }

  if (originNewProps) {
    Object.entries(originNewProps).forEach(([key, value]) => {
      const oldValue = originOldProps[key];
      if (key === "className") {
        if (value !== oldValue) {
          target.className = value;
        }
      } else if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        if (value !== oldValue) {
          if (typeof oldValue === "function") {
            removeEvent(target, eventType, oldValue);
          }
          if (value) {
            addEvent(target, eventType, value);
          } else {
            target.removeEventListener(eventType, oldValue);
          }
        }
      } else if (key === "style" && typeof value === "object") {
        Object.assign(target.style, value);
      } else if (value !== oldValue) {
        target.setAttribute(key, value);
      }
    });
  }
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
