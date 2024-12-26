import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  for (const attr in oldProps) {
    // 없는 props는 삭제
    if (!(attr in newProps)) {
      if (attr.startsWith("on") && typeof oldProps[attr] === "function") {
        const eventType = attr.toLowerCase().substring(2);
        removeEvent(target, eventType, oldProps[attr]);
      } else {
        target.removeAttribute(attr);
      }
    }
  }

  for (const attr in newProps) {
    if (oldProps[attr] !== newProps[attr]) {
      if (attr.startsWith("on") && typeof newProps[attr] === "function") {
        const eventType = attr.toLowerCase().substring(2);
        if (typeof oldProps[attr] === "function") {
          removeEvent(target, eventType, oldProps[attr]);
        }
        addEvent(target, eventType, newProps[attr]);
      } else if (attr === "className") {
        target.className = newProps[attr];
      } else {
        target[attr] = newProps[attr];
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  //   console.log("parentElement", parentElement);
  //   console.log("newNode", newNode);
  //   console.log("oldNode", oldNode);

  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === "number" || typeof newNode === "string") {
    if (newNode !== oldNode) {
      const newTextNode = document.createTextNode(newNode);
      parentElement.replaceChild(newTextNode, parentElement.childNodes[index]);
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newChildren[i],
      oldChildren[i],
      i,
    );
  }
}
