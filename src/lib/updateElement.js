import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {}

export function updateElement(parentElement, newVNode, oldVNode, index = 0) {
  const targetElement = parentElement.children[index];

  // 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  if (!newVNode && oldVNode) {
    targetElement?.remove();
    return;
  }
  // 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  if (newVNode && !oldVNode) {
    parentElement.appendChild(createElement(newVNode));
    return;
  }
  // 텍스트 노드 업데이트
  if (typeof newVNode === "string" && typeof oldVNode === "string") {
    parentElement.textContent = newVNode;
    return;
  }
  // 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  if (newVNode.type !== oldVNode.type) {
    parentElement.replaceChild(createElement(newVNode), targetElement);
    return;
  }
  // 같은 타입의 노드 업데이트
  if (targetElement && newVNode.type === oldVNode.type) {
    const newVNodeChildren = newVNode.children ?? [];
    const oldVNodeChildren = oldVNode.children ?? [];

    const maxLength = Math.max(
      newVNodeChildren.length,
      oldVNodeChildren.length,
    );

    for (let i = 0; i < maxLength; i++) {
      updateElement(targetElement, newVNodeChildren[i], oldVNodeChildren[i], i);
    }
  }
}

function isDeepEqual(obj1, obj2) {
  // 기본 타입이거나 null인 경우 직접 비교
  if (obj1 === obj2) return true;

  // null 체크
  if (obj1 === null || obj2 === null) return false;

  // 타입이 다른 경우
  if (typeof obj1 !== typeof obj2) return false;

  // 배열인 경우
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => isDeepEqual(item, obj2[index]));
  }

  // 객체인 경우
  if (typeof obj1 === "object" && typeof obj2 === "object") {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => {
      return keys2.includes(key) && isDeepEqual(obj1[key], obj2[key]);
    });
  }

  return obj1 === obj2;
}
