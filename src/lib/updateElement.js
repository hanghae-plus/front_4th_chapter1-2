import { createElement } from "./createElement.js";
import { handleUpdateAttr } from "../utils";

/**
 * 부모 노드와 비교하여 DOM을 업데이트하는 함수.
 *
 * @param parentElement - DOM 업데이트가 수행될 부모 노드
 * @param newNode - 새 가상 노드
 * @param oldNode - 기존 가상 노드
 * @param index - 부모 노드의 자식 인덱스
 * @description
 * - newNode가 없고 oldNode가 있는 경우 노드를 제거합니다.
 * - newNode가 있고 oldNode가 없는 경우 노드를 추가합니다.
 * - 두 노드가 텍스트 노드일 경우 내용을 업데이트합니다.
 * - 두 노드의 타입이 다를 경우 새 노드로 교체합니다.
 * - 두 노드의 타입이 같을 경우
 *   - 속성을 업데이트합니다.
 *   - 자식 노드를 재귀적으로 업데이트합니다.
 *   - 불필요한 자식 노드를 제거합니다.
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentNode = parentElement?.childNodes[index];
  const newElement = createElement(newNode);

  // 노드 제거
  if (oldNode && !newNode) {
    parentElement.removeChild(currentNode);
    return;
  }

  // 새 노드 추가
  if (!oldNode && newNode) {
    parentElement.appendChild(newElement);
    return;
  }

  // 텍스트 노드 업데이트
  if (typeof oldNode === "string" && typeof newNode === "string") {
    if (oldNode === newNode) return;
    currentNode.nodeValue = newNode;
    return;
  }

  // 타입이 다른 경우
  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(newElement, currentNode);
    return;
  }
  // 같은 타입인 경우
  else {
    handleUpdateAttr(currentNode, newNode.props, oldNode.props); // 속성 업데이트

    const oldChildren = oldNode.children.length;
    const newChildren = newNode.children.length;

    const max = Math.max(oldChildren, newChildren);

    // 자식 노드 재귀적 업데이트
    for (let i = 0; i < max; i++) {
      updateElement(currentNode, newNode.children[i], oldNode.children[i], i);
    }
  }
}
