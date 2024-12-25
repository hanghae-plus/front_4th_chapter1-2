import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

export function updateElement(element, normalizedVNode, prevVNode) {
  const { children, props } = normalizedVNode;
  const { children: prevChildren = [], props: prevProps = {} } =
    prevVNode || {};

  // 속성 업데이트 (props)
  updateProps(element, props, prevProps);

  // 자식 업데이트 (children)
  updateChildren(element, children, prevChildren);
}

function updateProps(element, newProps, oldProps) {
  // 새로운 속성과 기존 속성 비교하여 업데이트
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      if (key.startsWith("on")) {
        // 이벤트 업데이트
        const eventType = key.slice(2).toLowerCase();
        if (oldProps[key]) {
          removeEvent(element, eventType, oldProps[key]);
        }
        if (newProps[key]) {
          addEvent(element, eventType, newProps[key]);
        }
      } else {
        element.setAttribute(key, newProps[key]);
      }
    }
  }

  // 이전 속성 중 더 이상 존재하지 않는 속성은 제거
  for (const key in oldProps) {
    if (!Object.prototype.hasOwnProperty.call(newProps, key)) {
      if (key.startsWith("on")) {
        // 이벤트 제거
        const eventType = key.slice(2).toLowerCase();
        removeEvent(element, eventType, oldProps[key]);
      } else {
        element.removeAttribute(key);
      }
    }
  }
}

function updateChildren(element, newChildren, oldChildren) {
  const maxLen = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLen; i++) {
    const newChild = newChildren[i];
    const oldChild = oldChildren[i];

    if (newChild === undefined) {
      // 자식 제거
      element.removeChild(element.childNodes[i]);
      continue;
    }

    if (oldChild === undefined) {
      // 자식 추가
      const newElement = createElement(newChild);
      element.appendChild(newElement);
      continue;
    }

    if (typeof newChild === "string" || typeof newChild === "number") {
      // 텍스트 노드 업데이트
      if (typeof oldChild === "string" || typeof oldChild === "number") {
        if (newChild !== oldChild) {
          element.childNodes[i].textContent = newChild;
        }
      } else {
        const textNode = document.createTextNode(newChild);
        element.replaceChild(textNode, element.childNodes[i]);
      }
    } else if (newChild.type !== oldChild.type) {
      // 노드 교체
      const newElement = createElement(newChild);
      element.replaceChild(newElement, element.childNodes[i]);
    } else {
      // 동일한 타입의 노드 업데이트
      updateElement(element.childNodes[i], newChild, oldChild);
    }
  }
}
