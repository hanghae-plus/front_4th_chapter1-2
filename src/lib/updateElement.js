import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps = {}, oldProps = {}) {
  // null이나 undefined인 경우 빈 객체로 처리
  oldProps = oldProps || {};
  newProps = newProps || {};

  // 이전 속성 제거
  Object.keys(oldProps).forEach((key) => {
    if (key === "className") {
      if (!(key in newProps)) {
        target.removeAttribute("class");
      }
    } else if (key === "htmlFor") {
      if (!(key in newProps)) {
        target.removeAttribute("for");
      }
    } else if (key.startsWith("on")) {
      if (!(key in newProps)) {
        removeEvent(target, key.toLowerCase().slice(2), oldProps[key]);
      }
    } else {
      if (!(key in newProps)) {
        target.removeAttribute(key);
      }
    }
  });

  // 새로운 속성 추가/업데이트
  Object.entries(newProps).forEach(([key, value]) => {
    if (key === "className") {
      target.setAttribute("class", value);
    } else if (key === "htmlFor") {
      target.setAttribute("for", value);
    } else if (key.startsWith("on")) {
      const eventType = key.toLowerCase().slice(2);
      if (oldProps[key] !== value) {
        if (oldProps[key]) {
          removeEvent(target, eventType, oldProps[key]);
        }
        addEvent(target, eventType, value);
      }
    } else {
      target.setAttribute(key, value);
    }
  });
}

export function updateElement($parent, oldNode, newNode, index = 0) {
  // 노드가 없는 경우
  if (!oldNode && !newNode) {
    return;
  }

  // 새로운 노드만 있는 경우 (추가)
  if (!oldNode) {
    $parent.appendChild(createElement(newNode));
    return;
  }

  // 이전 노드만 있는 경우 (제거)
  if (!newNode) {
    $parent.removeChild($parent.childNodes[index]);
    return;
  }

  // 노드 타입이 다른 경우
  if (typeof oldNode !== typeof newNode) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
    return;
  }

  // 텍스트 노드인 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode !== newNode) {
      $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
    }
    return;
  }

  // 노드 타입이 다른 경우
  if (oldNode.type !== newNode.type) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
    return;
  }

  // 속성 업데이트
  updateAttributes($parent.childNodes[index], newNode.props, oldNode.props);

  // 자식 노드 업데이트
  const maxLength = Math.max(
    oldNode.children?.length || 0,
    newNode.children?.length || 0,
  );

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      $parent.childNodes[index],
      oldNode.children?.[i],
      newNode.children?.[i],
      i,
    );
  }
}
