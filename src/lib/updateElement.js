import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/*
 * 요소의 속성을 업데이트한다.
 */
function updateAttributes(target, originNewProps, originOldProps) {
  originNewProps = originNewProps || {};
  originOldProps = originOldProps || {};

  // 이전 속성 중 새로운 속성에 없는 것들을 제거
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

  Object.keys(originNewProps).forEach((prop) => {
    if (prop === "key" || prop === "children") return;

    const newProp = originNewProps[prop];
    const oldProp = originOldProps[prop];

    if (prop.startsWith("on")) {
      const eventType = prop.slice(2).toLowerCase();
      if (newProp?.toString() !== oldProp?.toString()) {
        if (oldProp) {
          console.log(`listener 제거 : ${oldProp}`);
          removeEvent(target, eventType, oldProp);
        }
        if (newProp) {
          console.log(`listener 추가 : ${newProp}`);
          addEvent(target, eventType, newProp);
        }
      }
    } else if (newProp !== oldProp) {
      target.setAttribute(prop === "className" ? "class" : prop, newProp);
    }
  });
}

/*
 * Virtual DOM의 변경사항을 Diff 알고리즘에 기반하여 업데이트한다.
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1) 새 노드가 없고 이전 노드만 있는 경우 → 노드 제거
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 2) 새 노드만 있는 경우 → 노드 추가
  if (newNode && !oldNode) {
    parentElement.append(createElement(newNode));
    return;
  }

  // 3) 두 노드 모두 텍스트인 경우 → 텍스트 변경
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  // 4) 노드 타입이 다른 경우 → 요소 교체
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  const element = parentElement.childNodes[index];
  updateAttributes(element, newNode.props, oldNode.props);

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];

  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(element, newChildren[i], oldChildren[i], i);
  }
}
