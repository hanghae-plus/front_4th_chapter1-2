import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originOldProps, originNewProps) {
  // 새로운 속성 추가 및 기존 속성 업데이트
  for (const key in originNewProps) {
    if (key.startsWith("on")) {
      // 이벤트 리스너 처리
      const eventType = key.slice(2).toLowerCase();
      // 기존 핸들러가 없으면 추가
      if (!originOldProps[key] || originOldProps[key] !== originNewProps[key]) {
        addEvent(target, eventType, originNewProps[key]); // addEvent 사용
      }
    } else {
      // 일반 속성 처리
      target.setAttribute(key, originNewProps[key]);
    }
  }

  // 기존 속성 제거
  for (const key in originOldProps) {
    if (!(key in originNewProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, originOldProps[key]); // 이벤트 핸들러 제거
      } else {
        target.removeAttribute(key); // 일반 속성 제거
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 노드가 다르면 교체
  if (oldNode.type !== newNode.type) {
    const newEl = createElement(newNode);
    parentElement.replaceChild(newEl, parentElement.childNodes[index]);
    return newEl;
  }

  // 속성 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    oldNode.props || {},
    newNode.props || {},
  );

  // 자식 요소 업데이트
  const oldChildren = oldNode.children || [];
  const newChildren = newNode.children || [];

  const minLength = Math.min(oldChildren.length, newChildren.length);

  // 기존 자식 업데이트
  for (let i = 0; i < minLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newChildren[i],
      oldChildren[i],
      i,
    );
  }

  // 추가된 자식 요소 처리
  if (newChildren.length > oldChildren.length) {
    for (let i = minLength; i < newChildren.length; i++) {
      parentElement.childNodes[index].appendChild(
        createElement(newChildren[i]),
      );
    }
  }

  // 제거된 자식 요소 처리
  if (oldChildren.length > newChildren.length) {
    for (let i = minLength; i < oldChildren.length; i++) {
      parentElement.childNodes[index].removeChild(
        parentElement.childNodes[index].childNodes[minLength],
      );
    }
  }

  return parentElement.childNodes[index]; // 업데이트된 요소 반환
}
