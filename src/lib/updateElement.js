import { createElement } from "./createElement.js";
import { addEvent, removeEvent } from "./eventManager";

function updateAttributes(target, originNewProps, originOldProps) {
  if (!target) {
    return;
  }
  const newProps = { ...originNewProps };
  const oldProps = { ...originOldProps };

  const props = { ...newProps, ...oldProps };

  Object.keys(props).forEach((key) => {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      if (newProps[key] && !oldProps[key]) {
        addEvent(target, eventType, newProps[key]);
      } else if (!newProps[key] && oldProps[key]) {
        removeEvent(target, eventType, oldProps[key]);
      }
      return;
    }

    if (newProps[key] === oldProps[key]) {
      return;
    }

    if (!newProps[key]) {
      target.removeAttribute(key);
      return;
    }

    if (key === "className") {
      target.setAttribute("class", newProps[key]);
      return;
    }

    target.setAttribute(key, newProps[key]);
  });
}

/**
 * @description 기존 DOM을 업데이트하는 함수
 * @param {*} parentElement
 * @param {*} newNode
 * @param {*} oldNode
 * @param {*} index
 * @returns {void}
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (oldNode && !newNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  if (!oldNode && newNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) {
      return;
    }
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  if (newNode.type === oldNode.type) {
    updateAttributes(
      parentElement.childNodes[index],
      newNode.props || {},
      oldNode.props || {},
    );
  }

  const newLength = newNode.children?.length || 0;
  const oldLength = oldNode.children?.length || 0;
  const maxLength = Math.max(newLength, oldLength);

  for (let i = 0; i < maxLength; i++) {
    if (!parentElement.childNodes[index]) {
      return;
    }
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
