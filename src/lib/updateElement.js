import { addEvent, removeEvent } from "./eventManager.js";
import { createElement } from "./createElement.js";

/**
 * DOM 요소의 속성을 비교하며 업데이트
 */
function updateAttributes(target, originNewProps, originOldProps) {
  // 1. 제거된 속성 처리
  Object.keys(originOldProps).forEach((prop) => {
    if (prop === "key" || prop === "children") return;

    if (!(prop in originNewProps)) {
      if (prop.startsWith("on")) {
        // 이벤트 리스너 제거
        const eventType = prop.slice(2).toLowerCase();
        removeEvent(target, eventType, originOldProps[prop]);
      } else {
        // 일반 속성 제거
        target.removeAttribute(prop === "className" ? "class" : prop);
      }
    }
  });

  // 2. 새로운/변경된 속성 처리
  Object.keys(originNewProps).forEach((prop) => {
    if (prop === "key" || prop === "children") return;

    const newProp = originNewProps[prop];
    const oldProp = originOldProps[prop];

    if (newProp !== oldProp) {
      console.log("not same", newProp, oldProp);
      console.log(typeof newProp, typeof oldProp);
    }

    if (prop.startsWith("on")) {
      // 이벤트 리스너 처리
      const eventType = prop.slice(2).toLowerCase();
      if (newProp?.toString() !== oldProp?.toString()) {
        oldProp && removeEvent(target, eventType, oldProp);
        newProp && addEvent(target, eventType, newProp);
      }
    } else if (newProp !== oldProp) {
      // 일반 속성 업데이트
      target.setAttribute(prop === "className" ? "class" : prop, newProp);
    }
  });
}

/**
 * Virtual DOM의 차이를 실제 DOM에 반영
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // Case 1: 노드 삭제
  if (!newNode && oldNode) {
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
