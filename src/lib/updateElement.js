import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // 삭제된 속성 제거
  for (const key in originOldProps) {
    if (!(key in originNewProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, originOldProps[key]);
      } else if (key === "className") {
        target.className = ""; // className 초기화
      } else {
        target.removeAttribute(key);
      }
    }
  }

  // 새로운 속성 추가 또는 업데이트
  for (const [key, value] of Object.entries(originNewProps)) {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      // 기존 이벤트 제거 후 새 이벤트 추가
      if (originOldProps[key]) {
        removeEvent(target, eventType, originOldProps[key]);
      }
      addEvent(target, eventType, value);
    } else if (key === "className") {
      target.className = value;
    } else {
      if (originOldProps[key] !== value) {
        target.setAttribute(key, value);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const targetElement = parentElement.childNodes[index];

  if (!oldNode && newNode) {
    // oldNode가 없고 newNode가 있는 경우
    parentElement.appendChild(createElement(newNode)); // 추가
    return;
  }
  if (!newNode && oldNode) {
    // newNode 없고 oldNode가 있는 경우
    parentElement.removeChild(targetElement); // 제거
    return;
  }
  if (typeof newNode !== typeof oldNode || newNode.type !== oldNode.type) {
    // 타입이 다를 경우
    parentElement.replaceChild(createElement(newNode), targetElement);
    return;
  }
  if (typeof newNode === "string" || typeof newNode === "number") {
    // 텍스트 업데이트
    if (newNode !== oldNode) {
      targetElement.textContent = newNode;
    }
    return;
  }

  const originNewProps = newNode.props || {};
  const originOldProps = oldNode.props || {};

  updateAttributes(targetElement, originNewProps, originOldProps);

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(targetElement, newChildren[i], oldChildren[i], i);
  }
}
