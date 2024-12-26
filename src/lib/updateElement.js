import { addEvent, removeEvent } from "./eventManager.js";
import { createElement } from "./createElement.js";

/**
 * DOM 요소의 속성을 비교하며 업데이트
 */
function updateAttributes(target, newProps, oldProps) {
  const allProps = new Set([
    ...Object.keys(newProps),
    ...Object.keys(oldProps),
  ]);

  allProps.forEach((prop) => {
    if (prop === "key" || prop === "children") return;

    const newValue = newProps[prop];
    const oldValue = oldProps[prop];

    // 값이 같으면 스킵
    if (newValue === oldValue) return;

    // 이벤트 핸들러 처리
    if (prop.startsWith("on")) {
      const eventType = prop.slice(2).toLowerCase();

      // 이전 핸들러 제거
      if (oldValue) {
        removeEvent(target, eventType, oldValue);
      }

      // 새 핸들러 등록
      if (newValue) {
        addEvent(target, eventType, newValue);
      }

      return;
    }

    // 일반 속성 처리
    const attrName = prop === "className" ? "class" : prop;
    target.setAttribute(attrName, newValue);
  });
}

/**
 * Virtual DOM의 차이를 실제 DOM에 반영
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) {
    console.warn("Invalid parent Element");
    return;
  }

  if (!newNode && oldNode) {
    // Case 1: 노드 삭제
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // Case 2: 노드 추가
  if (newNode && !oldNode) {
    parentElement.append(createElement(newNode));
    return;
  }

  // Case 3: 텍스트 노드 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  // Case 4: 노드 타입 변경
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  const element = parentElement.childNodes[index];
  updateAttributes(element, newNode.props || {}, oldNode.props || {});

  // 자식 노드들을 재귀적으로 업데이트
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(element, newChildren[i], oldChildren[i], i);
  }
}
