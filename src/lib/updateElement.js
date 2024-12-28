import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { isClassNameProps, isEventProps } from "./vNodeUtils.js";

function isChangedAttributes(originNewProps, originOldProps) {
  if (
    (!originNewProps && originOldProps) ||
    (originNewProps && !originOldProps)
  ) {
    return true;
  }

  const mergedProps = { ...originOldProps, ...originNewProps };
  return Object.keys(mergedProps).some(
    (key) => mergedProps[key] !== originOldProps[key],
  );
}

function updateAttributes(target, originNewProps, originOldProps) {
  Object.keys(originOldProps).forEach((key) => {
    if (isEventProps(key)) {
      const eventType = key.slice(2).toLowerCase();
      removeEvent(target, eventType);
      return;
    }

    if (isClassNameProps(key)) {
      target.removeAttribute("class");
      return;
    }

    target.removeAttribute(key);
  });

  Object.keys(originNewProps).forEach((key) => {
    if (isEventProps(key)) {
      const eventType = key.slice(2).toLowerCase();
      addEvent(target, eventType, originNewProps[key]);
      return;
    }

    if (isClassNameProps(key)) {
      target.setAttribute("class", originNewProps[key]);
      return;
    }

    target.setAttribute(key, originNewProps[key]);
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 새로운 노드가 추가될 경우
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 이전 노드가 삭제된 경우
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  const childElement = parentElement.childNodes[index];

  // 노드의 타입이 다른경우
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), childElement);
    return;
  }

  // 텍스트 노드일 경우
  if (
    typeof newNode === "string" &&
    typeof oldNode === "string" &&
    newNode !== oldNode
  ) {
    childElement.textContent = newNode;
    return;
  }

  if (isChangedAttributes(newNode.props, oldNode.props)) {
    updateAttributes(childElement, newNode.props ?? {}, oldNode.props ?? {});
  }

  const maxChildren = Math.max(
    newNode.children?.length ?? 0,
    oldNode.children?.length ?? 0,
  );

  for (let i = 0; i < maxChildren; i++) {
    updateElement(childElement, newNode.children[i], oldNode.children[i], i);
  }
}
