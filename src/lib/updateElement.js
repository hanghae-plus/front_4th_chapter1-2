import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  for (const key in originOldProps) {
    if (!(key in originNewProps) && key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      removeEvent(target, eventType);
    }
  }

  for (const key in originNewProps) {
    if (originNewProps[key] !== originOldProps[key]) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        addEvent(target, eventType, originNewProps[key]);
      } else if (key === "className") {
        target.className = originNewProps[key];
      } else {
        target.setAttribute(key, originNewProps[key]);
      }
    }
  }
}

function updateTextNode(parentElement, currentChild, newText) {
  if (currentChild?.nodeType === Node.TEXT_NODE) {
    if (currentChild.textContent !== newText) {
      currentChild.textContent = newText;
    }
  } else {
    const newChild = createElement(newText);
    parentElement.replaceChild(newChild, currentChild);
  }
}

function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentChild = parentElement.childNodes[index];

  if (!newNode) {
    if (oldNode) parentElement.removeChild(currentChild);
    return;
  }

  if (!oldNode) {
    const newChild = createElement(newNode);
    parentElement.appendChild(newChild);
    return;
  }

  if (typeof newNode === "string" || typeof newNode === "number") {
    updateTextNode(parentElement, currentChild, String(newNode));
    return;
  }

  if (newNode.type !== oldNode.type) {
    const newChild = createElement(newNode);
    parentElement.replaceChild(newChild, currentChild);
    return;
  }

  updateAttributes(currentChild, newNode.props || {}, oldNode.props || {});

  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(currentChild, newNode.children[i], oldNode.children[i], i);
  }
}

export { updateElement };
