import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (!originOldProps && !originNewProps) return;

  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  // 속성 제거 처리
  Object.entries(oldProps).forEach(([attr, value]) => {
    if (!newProps[attr]) {
      if (attr.startsWith("on")) {
        const eventType = attr.slice(2).toLowerCase();
        removeEvent(target, eventType, value);
      } else {
        target.removeAttribute(attr);
      }
    }
  });

  // 속성 추가/갱신 처리
  Object.entries(newProps).forEach(([attr, value]) => {
    if (oldProps[attr] !== value) {
      if (attr.startsWith("on")) {
        const eventType = attr.slice(2).toLowerCase();
        //
        if (typeof oldProps[attr] === "function") {
          removeEvent(target, eventType, oldProps[attr]);
        }
        addEvent(target, eventType, value);
      } else if (attr === "className") {
        target.setAttribute("class", value);
      } else {
        target.setAttribute(attr, value);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentNode = parentElement?.childNodes[index];
  const newElement = createElement(newNode);

  // 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  if (oldNode && !newNode) {
    parentElement.removeChild(currentNode);
    return;
  }

  // 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 텍스트 노드 업데이트
  if (typeof oldNode === "string" && typeof newNode === "string") {
    if (oldNode === newNode) return;
    currentNode.nodeValue = newNode;
    return;
  }
  // 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(newElement, currentNode);
    return;
  } else {
    // 같은 타입의 노드 업데이트
    //  - 속성 업데이트
    updateAttributes(currentNode, newNode.props, oldNode.props);

    const oldChildren = oldNode.children?.length;
    const newChildren = newNode.children?.length;

    const max = Math.max(oldChildren, newChildren);

    //  - 자식 노드 재귀적 업데이트
    //  - 불필요한 자식 노드 제거
    for (let i = 0; i < max; i++) {
      updateElement(currentNode, newNode.children[i], oldNode.children[i], i);
    }
  }
}
