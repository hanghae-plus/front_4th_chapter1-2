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
    if (newProps[key] === oldProps[key]) {
      return;
    }

    const onEvent = getOnEventName(key);
    if (onEvent) {
      if (newProps[key] && !oldProps[key]) {
        addEvent(target, onEvent, newProps[key]);
      } else if (!newProps[key] && oldProps[key]) {
        removeEvent(target, onEvent, oldProps[key]);
      }
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
    removeOnEvent(parentElement, oldNode);
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 기존 노드가 없는 경우 신규 노드 추가
  if (!oldNode && newNode) {
    addOnEvent(parentElement, newNode);
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

/**
 * 이벤트 속성 추가 함수
 * @param {*} parentElement
 * @param {*} newNode
 * @returns {void}
 */
export function addOnEvent(parentElement, newNode) {
  if (!newNode.props) {
    return;
  }
  Object.keys(newNode.props).forEach((key) => {
    const eventType = getOnEventName(key);
    if (eventType) {
      addEvent(parentElement, eventType, newNode.props[key]);
    }
  });
}

/**
 * 이벤트 속성 제거 함수
 * @param {*} parentElement
 * @param {*} oldNode
 * @returns {void}
 */
export function removeOnEvent(parentElement, oldNode) {
  if (!oldNode.props) {
    return;
  }
  Object.keys(oldNode.props).forEach((key) => {
    const eventType = getOnEventName(key);
    if (eventType) {
      removeEvent(parentElement, eventType, oldNode.props[key]);
    }
  });
}

/**
 * 이벤트 속성명 추출 함수
 * @description 속성명이 on으로 시작하는 경우 이벤트 속성명 반환, 그 외의 경우 null 반환
 * @param {*} key
 * @returns {string|null}
 */
export function getOnEventName(key) {
  if (key.startsWith("on")) {
    return key.slice(2).toLowerCase();
  }
  return null;
}
