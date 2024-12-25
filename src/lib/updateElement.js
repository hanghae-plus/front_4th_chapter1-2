import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (!originOldProps && !originNewProps) return;

  // 새로 추가 해야하는 경우
  if (originNewProps) {
    Object.entries(originNewProps).forEach(([attr, value]) => {
      if (value !== originOldProps[attr]) {
        if (attr.startsWith("on")) {
          // 함수
          addEvent(target, attr, value);
          return;
        } else if (attr === "className") {
          target.setAttribute("class", value);
          return;
        } else {
          target.setAttribute(attr, value);
          return;
        }
      }
    });
  }

  // 삭제해야 하는 경우
  if (originOldProps) {
    Object.entries(originOldProps).forEach(([attr, value]) => {
      if (originNewProps?.[attr] !== value) {
        if (attr.startsWith("on")) {
          removeEvent(target, attr.slice(2).toLowerCase(), value);
          return;
        } else if (attr === "className") {
          removeEvent(target, "class", value);
          return;
        } else {
          removeEvent(target, attr, value);
        }
      }
    });
  }
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
