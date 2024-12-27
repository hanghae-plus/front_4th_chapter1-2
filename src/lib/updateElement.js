import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps = {}, oldProps = {}) {
  // null이나 undefined인 경우 빈 객체로 처리
  newProps = newProps || {};
  oldProps = oldProps || {};
  // 1. HTML 속성 이름 변환 함수
  function getHtmlAttrName(key) {
    if (key === "className") return "class";
    if (key === "htmlFor") return "for";
    return key;
  }

  // 2. 이벤트 처리 함수
  function handleEvent(target, eventName, newHandler, oldHandler) {
    // 이벤트 이름 변환 (예: onClick -> click)
    const eventType = eventName.slice(2).toLowerCase();

    // 이전 이벤트 제거
    if (oldHandler) {
      removeEvent(target, eventType, oldHandler);
    }

    // 새 이벤트 추가
    if (newHandler) {
      addEvent(target, eventType, newHandler);
    }
  }

  // 3. 이전 속성 제거
  Object.keys(oldProps).forEach((key) => {
    // 새 속성에 있으면 건너뛰기
    if (key in newProps) return;

    // 이벤트 처리
    if (key.startsWith("on")) {
      handleEvent(target, key, null, oldProps[key]);
    }
    // 일반 속성 처리
    else {
      target.removeAttribute(getHtmlAttrName(key));
    }
  });

  // 4. 새 속성 추가/수정
  Object.keys(newProps).forEach((key) => {
    const newValue = newProps[key];
    const oldValue = oldProps[key];

    // 값이 같으면 건너뛰기
    if (newValue === oldValue) return;

    // 이벤트 처리
    if (key.startsWith("on")) {
      handleEvent(target, key, newValue, oldValue);
    }
    // 일반 속성 처리
    else {
      target.setAttribute(getHtmlAttrName(key), newValue);
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
