import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (!target) return;

  for (const [key, value] of Object.entries(originOldProps)) {
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase(); // "onClick" -> "click"
      // 새로운 props에 같은 이벤트가 없거나 다른 핸들러인 경우에만 제거
      if (!originNewProps[key] || originNewProps[key] !== value) {
        removeEvent(target, eventType, value);
      }
    }
  }

  for (const [key, value] of Object.entries(originNewProps)) {
    if (originOldProps[key] === originNewProps[key]) continue;

    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase(); // "onClick" -> "click"
      addEvent(target, eventType, value);
    } else if (key === "className") {
      target.className = value; // className -> class
    } else {
      target.setAttribute(key, value); // 일반 속성 처리
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // node가 없는 경우 체크
  if (!parentElement) return;

  // 1. oldNode만 있는 경우
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 2. newNode만 있는 경우
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 3. oldNode와 newNode 모두 text 타입일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    // replaceChild(newChild, old);
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
  if (newNode.type !== oldNode.type) {
    if (!parentElement || !parentElement.childNodes[index]) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 5. oldNode와 newNode의 태그 이름(type)이 같을 경우
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  const maxLength = Math.max(
    (newNode.children || []).length,
    (oldNode.children || []).length,
  );
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
