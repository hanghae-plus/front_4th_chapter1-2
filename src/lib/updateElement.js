import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  //oldProps 속성 삭제
  Object.keys(originOldProps).forEach((key) => {
    if (key.startsWith("on") && typeof originOldProps[key] === "function") {
      const eventType = key.toLowerCase().substring(2);

      const oldHandler = originOldProps[key];
      const newHandler = originNewProps[key];

      if (!newHandler) {
        target?.removeAttribute(key);
        removeEvent(target, eventType, oldHandler);
      } else if (newHandler !== oldHandler) {
        removeEvent(target, eventType, oldHandler);
      }
    }
  });

  //oldProps 속성 추가
  Object.keys(originNewProps).forEach((key) => {
    if (key.startsWith("on")) {
      const eventType = key.toLowerCase().substring(2);

      const oldHandler = originOldProps[key];
      const newHandler = originNewProps[key];

      if (!oldHandler || newHandler !== oldHandler) {
        addEvent(target, eventType, newHandler);
      }
    } else if (key === "className") {
      target?.setAttribute("class", originNewProps[key] ?? "");
    } else {
      target?.setAttribute(key, originNewProps[key]);
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && !oldNode) {
    //노드가 둘 다 없을때
    return;
  }

  if (!newNode && oldNode) {
    // 올드노드는 있지만 새로운 노드가 없을땐 삭제
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    // 새로운 노드만 있을때 추가
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 둘 다 존재할 때

  // string 비교
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
      return;
    }
    return;
  }

  // type 비교
  if (newNode.type !== oldNode.type) {
    const newVNode = createElement(newNode);
    const oldVNode = parentElement?.childNodes[index];
    if (oldVNode) {
      parentElement.replaceChild(newVNode, oldVNode);
      return;
    }
    parentElement.appendChild(newVNode);
    return;
  }

  updateAttributes(
    parentElement?.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  const max = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < max; i++) {
    updateElement(
      parentElement?.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
