import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps = {}, oldProps = {}) {
  Object.keys(newProps).forEach((key) => {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      if (newProps[key] !== oldProps[key]) {
        if (oldProps[key]) removeEvent(target, eventType); // 기존 핸들러 제거
        if (newProps[key]) addEvent(target, eventType, newProps[key]); // 새로운 핸들러 추가
      }
    } else if (key === "className") {
      if (newProps[key] !== oldProps[key]) {
        target.setAttribute("class", newProps[key]);
      }
    } else {
      if (newProps[key] !== oldProps[key]) {
        target.setAttribute(key, newProps[key]);
      }
    }
  });

  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType);
      } else {
        target.removeAttribute(key);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const oldChild = parentElement.childNodes[index];

  // oldNode만 있는 경우 -> 삭제
  if (oldNode && !newNode) {
    parentElement.removeChild(oldChild);
    return;
  }

  // newNode만 있는 경우 -> 추가
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 둘 다 텍스트 노드일 경우 -> 내용이 다르면 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      oldChild.textContent = newNode;
    }
    return;
  }

  // 둘 다 동일한 태그일 경우 -> 속성과 자식 노드 업데이트
  if (newNode.type === oldNode.type) {
    updateAttributes(oldChild, newNode.props || {}, oldNode.props || {});

    const newChildren = newNode.children || [];
    const oldChildren = oldNode.children || [];
    const max = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < max; i++) {
      updateElement(oldChild, newChildren[i], oldChildren[i], i);
    }
    return;
  }

  // 태그가 다른 경우 -> 교체
  parentElement.replaceChild(createElement(newNode), oldChild);
}
