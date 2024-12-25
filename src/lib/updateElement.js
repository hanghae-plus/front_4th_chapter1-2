// import { addEvent, removeEvent } from "./eventManager";
import { checkNullishExceptZero } from "../utils/commonUtils.js";
import { createElement } from "./createElement.js";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!checkNullishExceptZero(newNode) || typeof newNode === "boolean") {
    return;
  }

  // 텍스트 노드인 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (parentElement.textContent !== newNode) {
      parentElement.textContent = newNode;
    }
    return;
  }

  // oldNode가 없는 경우 새로운 element를 생성해 append
  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
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
  // updateAttributes(parentElement, newNode.props, oldNode.props);

  // children이 없는 경우 return
  if (Math.max(newNode.children.length, oldNode.children.length) === 0) {
    return;
  }

  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement?.childNodes[index] || parentElement,
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}

// function updateAttributes(target, originNewProps, originOldProps) {}
