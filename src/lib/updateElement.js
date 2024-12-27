import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps = {}, oldProps = {}) {
  newProps = newProps || {};
  oldProps = oldProps || {};

  // 이전 속성 제거
  for (const key in oldProps) {
    if (!(key in newProps)) {
      if (key.startsWith("on")) {
        const eventName = key.toLowerCase().substring(2);
        removeEvent(target, eventName);
      } else {
        target.removeAttribute(key === "className" ? "class" : key);
      }
    }
  }

  // 새로운 속성 설정 또는 업데이트
  for (const key in newProps) {
    const oldValue = oldProps[key];
    const newValue = newProps[key];

    if (oldValue !== newValue) {
      if (key.startsWith("on")) {
        const eventName = key.toLowerCase().substring(2);
        if (oldValue) {
          removeEvent(target, eventName);
        }
        if (newValue) {
          addEvent(target, eventName, newValue);
        }
      } else {
        if (key === "className") {
          target.setAttribute("class", newValue);
        } else {
          target.setAttribute(key, newValue);
        }
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 실제 DOM 노드 (업데이트 대상)
  const domNode = parentElement.childNodes[index];

  // 기본 케이스 처리
  if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (!newNode) {
    parentElement.removeChild(domNode);
    return;
  }

  // 텍스트 노드 처리
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (domNode.nodeType === 3) {
      if (domNode.textContent !== String(newNode)) {
        domNode.textContent = String(newNode);
      }
    } else {
      parentElement.replaceChild(
        document.createTextNode(String(newNode)),
        domNode,
      );
    }
    return;
  }

  // 함수형 컴포넌트 처리
  if (typeof newNode.type === "function") {
    const newComponent = newNode.type(newNode.props);
    updateElement(parentElement, newComponent, oldNode, index);
    return;
  }

  // 노드 타입이 다르면 완전히 교체
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(createElement(newNode), domNode);
  }

  const newNodeChild = newNode.children;
  const oldNodeChild = oldNode.children;

  const maxLength = Math.max(newNodeChild.length, oldNodeChild.length);

  updateAttributes(domNode, newNode.props, oldNode.props);

  for (let i = 0; i < maxLength; i++) {
    updateElement(domNode, newNodeChild[i], oldNodeChild[i], i);
  }
}
