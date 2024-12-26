import { isTextNode } from "../utils/domUtils.js";
import { getEventTypeFromProps } from "../utils/eventUtils.js";
import { addAttirbutes, createElement } from "./createElement.js";
import { removeEvent } from "./eventManager.js";

function updateAttributes(element, newProps, oldProps) {
  for (let [key, value] of Object.entries(oldProps)) {
    if (key in newProps) return;

    element.removeAttribute(key);

    if (key.startsWith("on")) {
      removeEvent(element, getEventTypeFromProps(key), value);
      return element;
    }
  }
  for (let [key, value] of Object.entries(newProps)) {
    addAttirbutes(element, key, value);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const oldElement = parentElement.childNodes[index];

  //oldNode만 있는 경우
  if (oldNode && !newNode) {
    parentElement.removeChild(oldElement);
    return;
  }

  //newNode만 있는 경우
  if (newNode && !oldNode) {
    const newElement = createElement(newNode);
    parentElement.appendChild(newElement);
    return;
  }
  //oldNode와 newNode 모두 text 타입일 경우
  if (isTextNode(newNode) && isTextNode(oldNode) && oldNode !== newNode) {
    const newTextElement = document.createTextNode(newNode);
    parentElement.replaceChild(newTextElement, oldElement);
    return;
  }
  //oldNode와 newNode의 태그 이름(type)이 다를 경우
  if (newNode.type !== oldNode.type) {
    parentElement.removeChild(oldElement);
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (newNode.type === oldNode.type) {
    updateAttributes(oldElement, newNode.props || {}, oldNode.props || {});
  }

  const oldChildren = oldNode.children || [];
  const newChildren = newNode.children || [];
  const maxChildrenLength = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxChildrenLength; i++) {
    updateElement(oldElement, newChildren[i], oldChildren[i], i);
  }
}
