import { createElement } from "./createElement.js";
import { addEvent, removeEvent } from "./eventManager";

/**
 * 속성 업데이트 함수
 * @description 업데이트할 속성을 기존 속성과 비교하여 업데이트
 * - 이벤트 핸들러 추가 및 삭제
 * - 속성 값이 변경된 경우 업데이트
 * - 속성 값이 삭제된 경우 제거
 * @param {*} target
 * @param {*} originNewProps
 * @param {*} originOldProps
 * @returns {void}
 */
function updateAttributes(target, originNewProps, originOldProps) {
  if (!target) {
    return;
  }
  const newProps = { ...originNewProps };
  const oldProps = { ...originOldProps };

  const props = { ...newProps, ...oldProps };

  Object.keys(props).forEach((key) => {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      if (newProps[key] && !oldProps[key]) {
        addEvent(target, eventType, newProps[key]);
      } else if (!newProps[key] && oldProps[key]) {
        removeEvent(target, eventType, oldProps[key]);
      }
      return;
    }

    if (newProps[key] === oldProps[key]) {
      return;
    }

    if (!newProps[key]) {
      target.removeAttribute(key);
      return;
    }

    if (key === "className") {
      target.setAttribute("class", newProps[key]);
      return;
    }

    target.setAttribute(key, newProps[key]);
  });
}

/**
 * @description 기존 DOM을 업데이트하는 함수
 * @param {*} parentElement
 * @param {*} newNode
 * @param {*} oldNode
 * @param {*} index
 * @returns {void}
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 신규 노드가 없는 경우 기존 노드 제거
  if (oldNode && !newNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 기존 노드가 없는 경우 신규 노드 추가
  if (!oldNode && newNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 노드가 모두 문자열인 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) {
      return;
    }
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 타입이 다른 경우 노드 교체
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 타입이 같은 경우 속성 업데이트
  if (newNode.type === oldNode.type) {
    updateAttributes(
      parentElement.childNodes[index],
      newNode.props || {},
      oldNode.props || {},
    );
  }

  // 자식 노드 업데이트
  const newLength = newNode.children?.length || 0;
  const oldLength = oldNode.children?.length || 0;
  const maxLength = Math.max(newLength, oldLength);

  for (let i = 0; i < maxLength; i++) {
    if (!parentElement.childNodes[index]) {
      return;
    }
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
