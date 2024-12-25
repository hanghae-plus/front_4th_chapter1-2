import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function removeStaleEvents(target, newProps, oldProps) {
  Object.keys(oldProps).forEach((key) => {
    if (key.startsWith("on") && typeof oldProps[key] === "function") {
      const eventType = key.toLowerCase().substring(2);
      const oldHandler = oldProps[key];
      const newHandler = newProps[key];

      if (!newHandler || newHandler !== oldHandler) {
        removeEvent(target, eventType, oldHandler);
      }
    } else if (!newProps[key]) {
      target?.removeAttribute(key);
    }
  });
}

function addNewEvents(target, newProps, oldProps) {
  Object.keys(newProps).forEach((key) => {
    if (key.startsWith("on")) {
      const eventType = key.toLowerCase().substring(2);
      const newHandler = newProps[key];
      const oldHandler = oldProps[key];

      if (!oldHandler || newHandler !== oldHandler) {
        addEvent(target, eventType, newHandler);
      }
    } else if (key.toLowerCase() === "classname") {
      target?.setAttribute("class", newProps[key] ?? "");
    } else {
      target?.setAttribute(key, newProps[key]);
    }
  });
}

function updateAttributes(target, newProps, oldProps) {
  removeStaleEvents(target, newProps, oldProps);
  addNewEvents(target, newProps, oldProps);
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
      return;
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    const newVNode = createElement(newNode);
    const oldVNode = parentElement?.childNodes[index];
    if (oldVNode) {
      parentElement.replaceChild(newVNode, oldVNode);
      return;
    }
    parentElement.appendChild(newVNode);
    return;
  }

  updateAttributes(
    parentElement?.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  const max = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < max; i++) {
    updateElement(
      parentElement?.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
