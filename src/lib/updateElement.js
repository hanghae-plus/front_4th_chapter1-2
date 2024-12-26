import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const oldProps = originOldProps || {};
  const newProps = originNewProps || {};

  for (const attr in oldProps) {
    if (!(attr in newProps)) {
      if (attr.startsWith("on") && typeof newProps[attr] === "function") {
        const eventType = attr.slice(2).toLowerCase();
        removeEvent(target, eventType, oldProps[attr]);
      } else {
        target.removeAttribute(attr);
      }
    }
  }

  for (const attr in newProps) {
    if (oldProps[attr] !== newProps[attr]) {
      if (attr.startsWith("on") && typeof newProps[attr] === "function") {
        const eventType = attr.slice(2).toLowerCase();
        if (typeof oldProps[attr] === "function") {
          removeEvent(target, eventType, oldProps[attr]);
        }
        addEvent(target, eventType, newProps[attr]);
      } else if (attr === "className") {
        target.className = newProps[attr];
      } else if (attr === "style" && typeof newProps[attr] === "object") {
        Object.entries(newProps[attr]).forEach(([key, value]) => {
          target.style[key] = value;
        });
      } else {
        target.setAttribute(attr, newProps[attr]);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const existingNode = parentElement.childNodes[index];

  // oldNode만 있는 경우: oldNode를 parentElement에서 제거한다.
  if (!newNode && oldNode) {
    parentElement.removeChild(existingNode);
    return;
  }

  // newNode만 있는 경우: newNode를 parentElement에 추가한다.
  if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // oldNode와 newNode 모두 string인 경우: oldNode와 newNode 내용이 다르다면, newNode 내용으로 교체한다.
  if (typeof oldNode === "string" || typeof newNode === "string") {
    if (newNode !== oldNode) {
      parentElement.replaceChild(createElement(newNode), existingNode);
    }
    return;
  }

  // oldeNode와 newNode의 태그 이름(type)이 다를 경우: oldNode를 제거하고 해당 위치에 newNode를 추가한다.
  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(createElement(newNode), existingNode);
    return;
  }

  // oldNode와 newNode의 태그 이름(type)이 같을 경우: newNode와 oldNode의 속성을 비교하여 변경된 부분만 반영한다.
  updateAttributes(existingNode, newNode?.props, oldNode?.props);

  // oldNode와 newNode를 순회하며, 앞에 조건식을 반복한다.
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];

  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(existingNode, newChildren[i], oldChildren[i], i);
  }
}
