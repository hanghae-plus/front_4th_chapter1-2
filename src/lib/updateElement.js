import { removeEvent } from "./eventManager";
import { createElement, setElementAttribute } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  for (const [attr, value] of Object.entries(originNewProps)) {
    if (originOldProps[attr] === originNewProps[attr]) continue;
    target.setAttribute(attr, value);

    setElementAttribute(target, attr, value);
  }

  for (const [attr, value] of Object.entries(originOldProps)) {
    if (originNewProps[attr] !== undefined) continue;
    target.removeAttribute(attr);

    removeEvent(target, attr, value);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // only oldnode
  if (!newNode && oldNode) {
    if (parentElement.childNodes[index]) {
      return parentElement.removeChild(parentElement.childNodes[index]);
    }
    return;
  }

  // only newnode
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // both string
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return; // early return
    if (parentElement.childNodes[index]) {
      return parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
    } else {
      return parentElement.appendChild(createElement(newNode));
    }
  }

  // diff-algorithm
  if (newNode.type !== oldNode.type) {
    if (parentElement.childNodes[index]) {
      return parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
    } else {
      return parentElement.appendChild(createElement(newNode));
    }
  }

  // same Tag
  if (parentElement.childNodes[index]) {
    updateAttributes(
      parentElement.childNodes[index],
      newNode.props || {},
      oldNode.props || {},
    );

    // loop algorithm
    const maxLength = Math.max(
      newNode.children.length,
      oldNode.children.length,
    );

    for (let i = 0; i < maxLength; i++) {
      updateElement(
        parentElement.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i,
      );
    }
  }
}
