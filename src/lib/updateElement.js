import { createElement } from "./createElement.js";
import { handleUpdateAttr } from "../utils";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentNode = parentElement?.childNodes[index];
  const newElement = createElement(newNode);

  // 노드 제거. (newNode가 없고 oldNode가 있는 경우)
  if (oldNode && !newNode) {
    parentElement.removeChild(currentNode);
    return;
  }

  // 새 노드 추가. (newNode가 있고 oldNode가 없는 경우)
  if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 텍스트 노드 업데이트.
  if (typeof oldNode === "string" && typeof newNode === "string") {
    if (oldNode === newNode) return;
    currentNode.nodeValue = newNode;
    return;
  }
  // 노드 교체. (newNode와 oldNode의 타입이 다른 경우)
  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(newElement, currentNode);
    return;
  } else {
    // 같은 타입의 노드 업데이트.
    // 속성 업데이트.
    handleUpdateAttr(currentNode, newNode.props, oldNode.props);

    const oldChildren = oldNode.children?.length;
    const newChildren = newNode.children?.length;

    const max = Math.max(oldChildren, newChildren);

    // 자식 노드 재귀적 업데이트.
    for (let i = 0; i < max; i++) {
      updateElement(currentNode, newNode.children[i], oldNode.children[i], i);
    }
  }
}
