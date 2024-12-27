import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // props update
  Object.entries(originNewProps).forEach(([key, value]) => {
    if (originOldProps[key] !== value) {
      if (key === "className") {
        target.setAttribute("class", value);
      } else {
        target.setAttribute(key, value);
      }
      if (typeof value === "function" && key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        if (originOldProps[key]) {
          removeEvent(target, eventType, originOldProps[key]);
        }
        if (key) {
          addEvent(target, eventType, value);
        }
      }
    }
  });
  // props remove
  Object.entries(originOldProps).forEach(([key, value]) => {
    if (!originNewProps[key]) {
      if (typeof value === "function" && key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, value);
      } else {
        target.removeAttribute(key);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  if (!newNode && oldNode) {
    // oldNode를 parent에서 제거
    return parentElement.removeChild(parentElement.childNodes[index]);
  }
  // 2. 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  if (newNode && !oldNode) {
    // newNode를 parent에 추가
    return parentElement.appendChild(createElement(newNode));
  }
  // 3. 텍스트 노드 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    // oldNode의 내용과 newNode의 내용이 다르면, oldNode의 내용을 newNode의 내용으로 교체
    if (newNode === oldNode) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }
  // 4. 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  if (newNode.type !== oldNode.type) {
    // 둘 중에 하나가 String일 경우에도 해당
    // oldNode를 제거하고, 해당 위치에 newNode를 추가
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 5. 같은 타입의 노드 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  const maxLength = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
