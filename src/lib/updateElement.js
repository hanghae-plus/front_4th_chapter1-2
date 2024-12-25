import {
  isClass,
  isEventProp,
  replaceEventProp,
} from "../utils/commonUtils.js";
import { createElement } from "./createElement.js";
import { addEvent, removeEvent } from "./eventManager.js";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // newNode가 없는 경우 oldNode 제거
  if (oldNode && !newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 텍스트 노드인 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (parentElement.textContent !== newNode) {
      parentElement.textContent = newNode;
    }
    return;
  }

  // newNode가 oldNode와 다른 타입인 경우
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 타입이 같은 경우 props 및 children 비교
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // children이 없는 경우 return
  if (Math.max(newNode.children.length, oldNode.children.length) === 0) {
    return;
  }

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

/**
 *
 * @param {HTMLElement} target
 * @param {*} originNewProps
 * @param {*} originOldProps
 */
function updateAttributes(target, originNewProps, originOldProps) {
  const newPropsArr = originNewProps ? Object.entries(originNewProps) : [];
  const oldPropsArr = originOldProps ? Object.entries(originOldProps) : [];

  for (const [prop, value] of oldPropsArr) {
    let newPropValue = originNewProps[prop];

    // 이벤트 프로퍼티인 경우 이벤트 제거하고 시작
    if (isEventProp(prop)) {
      removeEvent(target, replaceEventProp(prop), value);
      newPropValue = originNewProps[replaceEventProp(prop)];
    }

    // 새로 들어올 프로퍼티 값이 없는 경우 제거
    if (newPropValue === undefined) {
      target.removeAttribute(prop);
      continue;
    }

    // 새로 들어올 프로퍼티 값이 있는 경우 업데이트
    if (value !== newPropValue) {
      if (isClass(prop)) {
        target.classList = newPropValue;
        continue;
      }
      if (isEventProp(prop)) {
        addEvent(target, replaceEventProp(prop), newPropValue);
        continue;
      }

      target.setAttribute(prop, newPropValue);
      continue;
    }

    // 새로 들어올 프로퍼티 값이 같은 경우
    if (value === originNewProps[prop]) {
      continue;
    }
  }

  for (const [prop, value] of newPropsArr) {
    // 이전 프로퍼티에 없는 프로퍼티인 경우 추가
    if (oldPropsArr[prop] === undefined) {
      if (isEventProp(prop)) addEvent(target, replaceEventProp(prop), value);
      if (isClass(prop)) {
        target.classList = value;
        continue;
      }
      target.setAttribute(prop, value);
    }
  }
}
