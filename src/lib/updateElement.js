import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const oldProps = originOldProps || {};
  const newProps = originNewProps || {};

  for (const attr in oldProps) {
    if (!(attr in newProps)) {
      if (attr.startsWith("on") && typeof oldProps[attr] === "function") {
        const eventType = attr.toLowerCase().slice(2);
        removeEvent(target, eventType, oldProps[attr]);
      } else {
        target.removeAttribute(attr);
      }
    }
  }

  for (const attr in newProps) {
    if (oldProps[attr] !== newProps[attr]) {
      if (attr.startsWith("on") && typeof newProps[attr] === "function") {
        const eventType = attr.toLowerCase().slice(2);
        if (typeof oldProps[attr] === "function") {
          removeEvent(target, eventType, oldProps[attr]);
        }
        addEvent(target, eventType, newProps[attr]);
      } else if (attr === "className") {
        target.className = newProps[attr];
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // oldNode만 있는 경우: oldNode를 parentElement에서 제거한다.
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // newNode만 있는 경우: newNode를 parentElement에 추가한다.
  if (!oldNode && newNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // oldNode와 newNode 모두 string인 경우: oldNode와 newNode 내용이 다르다면, newNode 내용으로 교체한다.
  if (typeof oldNode === "string" || typeof newNode === "string") {
    if (newNode === oldNode) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // oldeNode와 newNode의 태그 이름(type)이 다를 경우: oldNode를 제거하고 해당 위치에 newNode를 추가한다.
  if (oldNode.type !== newNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // oldNode와 newNode의 태그 이름(type)이 같을 경우: newNode와 oldNode의 속성을 비교하여 변경된 부분만 반영한다.
  if (oldNode.type === newNode.type) {
    updateAttributes(
      parentElement.childNodes[index],
      newNode.props || {},
      oldNode.props || {},
    );
  }

  // oldNode와 newNode를 순회하며, 앞에 조건식을 반복한다.
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
    );
  }
}
