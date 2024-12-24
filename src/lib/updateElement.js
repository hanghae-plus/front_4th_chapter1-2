import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // 속성 제거
  for (const key in originOldProps) {
    if (!(key in originNewProps)) {
      if (key.startsWith("on")) {
        const eventType = key.toLowerCase().slice(2);
        removeEvent(target, eventType);
      }
    }
  }
  // 속성 추가
  for (const key in originNewProps) {
    if (originNewProps[key] !== originOldProps[key]) {
      if (key.startsWith("on")) {
        const eventType = key.toLowerCase().slice(2);
        addEvent(target, eventType, originNewProps[key]);
      } else if (key === "className") {
        target.classList = originNewProps[key];
      } else {
        target.setAttribute(key, originNewProps[key]);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 현재 인덱스에 해당하는 자식 노드 참조
  const currentChild = parentElement.childNodes[index];

  // 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  if (!newNode && oldNode) {
    parentElement.removeChild(currentChild);
    return;
  }

  // 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  if (newNode && !oldNode) {
    const newChild = createElement(newNode);
    parentElement.appendChild(newChild);
    return;
  }

  // 텍스트 노드 업데이트
  if (typeof newNode === "string" || typeof newNode === "number") {
    const newText = String(newNode);
    if (currentChild?.nodeType === Node.TEXT_NODE) {
      if (currentChild.textContent !== newText) {
        currentChild.textContent = newText;
      }
    } else {
      const newChild = createElement(newText);
      parentElement.replaceChild(newChild, currentChild);
    }
    return;
  }

  // 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  if (newNode.type !== oldNode.type) {
    const newChild = createElement(newNode);
    parentElement.replaceChild(newChild, currentChild);
    return;
  }

  // 같은 타입의 노드 업데이트
  if (newNode.type === oldNode.type) {
    updateAttributes(currentChild, newNode.props || {}, oldNode.props || {});

    const newLength = newNode.children.length || 0;
    const oldLength = oldNode.children.length || 0;

    for (let i = 0; i < Math.max(newLength, oldLength); i++) {
      updateElement(currentChild, newNode.children[i], oldNode.children[i], i);
    }
  }
}
