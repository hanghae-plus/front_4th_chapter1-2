import { createElement } from "./createElement.js";
import { updateEventListeners } from "./renderElement.js";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. oldNode만 있는 경우
  if (!newNode && oldNode) {
    const currentChild = parentElement.childNodes[index];
    if (currentChild) parentElement.removeChild(currentChild);
    return;
  }

  // 2. newNode만 있는 경우
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 3. oldNode와 newNode 모두 text 타입일 경우
  if (typeof newNode === "string" || typeof oldNode === "string") {
    if (newNode !== oldNode) {
      const newTextNode = createElement(newNode);
      const currentChild = parentElement.childNodes[index];
      if (currentChild) {
        parentElement.replaceChild(newTextNode, currentChild);
      }
    }
    return;
  }

  // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    const currentChild = parentElement.childNodes[index];
    if (currentChild) {
      parentElement.replaceChild(newElement, currentChild);
    }
    return;
  }

  // 5. oldNode와 newNode의 태그 이름(type)이 같을 경우
  const currentElement = parentElement.childNodes[index];

  if (!currentElement) return;

  // 속성 업데이트
  updateAttributes(currentElement, newNode.props || {}, oldNode.props || {});

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  const maxLength = Math.max(
    newNode.children?.length || 0,
    oldNode.children?.length || 0,
  );

  for (let i = 0; i < maxLength; i++) {
    const newChild = newNode.children ? newNode.children[i] : undefined;
    const oldChild = oldNode.children ? oldNode.children[i] : undefined;

    updateElement(currentElement, newChild, oldChild, i);
  }
}

function updateAttributes(target, newProps, oldProps) {
  // 1. 이벤트 처리 로직 위임
  updateEventListeners(target, newProps, oldProps);

  // 2. 일반 속성 처리
  for (const [key, value] of Object.entries(newProps)) {
    if (!key.startsWith("on") && value !== oldProps[key]) {
      if (key === "className") {
        target.setAttribute("class", value);
      } else {
        target.setAttribute(key, value);
      }
    }
  }

  for (const key of Object.keys(oldProps)) {
    if (!(key in newProps) && !key.startsWith("on")) {
      target.removeAttribute(key);
    }
  }
}
