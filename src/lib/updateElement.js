import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  // 이전 속성 제거
  Object.keys(oldProps).forEach((key) => {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      if (oldProps[key]) {
        removeEvent(target, eventType, oldProps[key]);
      }
    } else if (!(key in newProps)) {
      if (key === "className") {
        target.className = "";
      } else {
        target.removeAttribute(key);
      }
    }
  });

  // 새로운 속성 추가/업데이트
  Object.entries(newProps).forEach(([key, value]) => {
    if (oldProps[key] === value) return;

    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      if (oldProps[key]) {
        removeEvent(target, eventType, oldProps[key]);
      }
      addEvent(target, eventType, value);
    } else if (key === "className") {
      target.className = value;
    } else {
      if (value === false || value === null || value === undefined) {
        target.removeAttribute(key);
      } else {
        target.setAttribute(key, value);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 노드가 모두 없는 경우
  if (!oldNode && !newNode) {
    return;
  }

  // 이전 노드만 있는 경우 (삭제)
  if (oldNode && !newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 새로운 노드만 있는 경우 (추가)
  if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 둘 다 텍스트 노드인 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode !== newNode) {
      const newTextNode = document.createTextNode(String(newNode));
      parentElement.replaceChild(newTextNode, parentElement.childNodes[index]);
    }
    return;
  }

  // 노드 타입이 다른 경우
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }
  // 속성 업데이트
  const element = parentElement.childNodes[index];
  updateAttributes(element, newNode.props, oldNode.props);

  // 자식 노드 비교 및 업데이트
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  Array.from({ length: maxLength }).forEach((_, i) => {
    updateElement(element, newChildren[i] || null, oldChildren[i] || null, i);
  });
}
