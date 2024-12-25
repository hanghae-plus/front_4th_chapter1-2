import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    // 1. `oldNode`만 있는 경우 -> 삭제
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    // 2. `newNode`만 있는 경우 -> 추가;
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    // 3. `newNode`와 `oldNode` 모두 문자열일 경우
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  if (newNode.type !== oldNode.type) {
    // 4. `newNode`의 type과 `oldNode`의 타입이 서로 사맛디 아니할 경우

    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // PROFIT!! `newNode`의 type과 `oldNode`의 타입이 서로 사맛을 경우
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  const maxLength = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}

// Utils
function updateAttributes(target, newProps, oldProps) {
  // 등록된 이벤트 초기화
  Object.entries(oldProps).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      removeEvent(target, key.slice(2).toLowerCase(), value);
    }
  });

  Object.entries(newProps).forEach(([key, value]) => {
    // 스타일 속성 처리
    if (key === "style") {
      target.style = value;
      return;
    }

    // 클래스 속성 처리
    if (key === "className") {
      target.setAttribute("class", value);
      return;
    }

    // 이벤트 핸들러 처리
    if (key.startsWith("on") && typeof value === "function") {
      addEvent(target, key.slice(2).toLowerCase(), value);
      return;
    }

    // 나머지 속성 처리
    target.setAttribute(key, value);
  });
}
