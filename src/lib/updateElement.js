import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // 기존 Attribute 중 새로운 Attribute에 없는 것은 제거
  Object.keys(originOldProps).forEach((key) => {
    if (!(key in originNewProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, originOldProps[key]);
      } else if (key === "className") {
        target.removeAttribute("class");
      } else {
        target.removeAttribute(key);
      }
    }
  });

  // 새로운 속성 추가 또는 업데이트
  for (const key in originNewProps) {
    const oldValue = originOldProps[key];
    const newValue = originNewProps[key];

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

// 자식 노드 업데이트
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
