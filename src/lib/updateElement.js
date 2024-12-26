import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  for (const key in newProps) {
    if (oldProps[key] !== newProps[key]) {
      if (key === "className") {
        target.setAttribute("class", newProps[key]);
      } else if (key.startsWith("on") && typeof newProps[key] === "function") {
        const eventName = key.toLowerCase().substring(2);
        // removeEvent(target, eventName);
        addEvent(target, eventName, newProps[key]);
      } else {
        target.setAttribute(key, newProps[key]);
      }
    }
  }

  // a만 있고 b에는 없는 속성 제거
  for (const key in oldProps) {
    if (!(key in newProps)) {
      if (key === "className") {
        target.removeAttribute("class");
      } else if (key.startsWith("on") && typeof oldProps[key] === "function") {
        const eventName = key.toLowerCase().substring(2);
        removeEvent(target, eventName);
      } else {
        target.removeAttribute(key);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode) {
    parentElement.removeChild(parentElement.children[index]);
    return;
  }
  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === "string" || typeof newNode === "number") {
    if (newNode !== oldNode) {
      parentElement.childNodes[index].nodeValue = newNode; // 변경된 코드
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.children[index],
    );
    return;
  }

  updateAttributes(parentElement.children[index], newNode.props, oldNode.props);

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];

  for (let i = 0; i < newChildren.length; i++) {
    updateElement(
      parentElement.children[index],
      newChildren[i],
      oldChildren[i],
      i,
    );
  }
  if (oldChildren.length > newChildren.length) {
    for (let i = newChildren.length; i < oldChildren.length; i++) {
      parentElement.children[index].removeChild(
        parentElement.children[index].children[newChildren.length],
      );
    }
  }
}
