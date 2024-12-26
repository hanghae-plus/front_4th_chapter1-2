import { createElement } from "./createElement";
import { addEvent, removeEvent } from "./eventManager";

function resolveVNode(vNode) {
  if (!vNode) return vNode;
  if (typeof vNode.type === "function") {
    const result = vNode.type(vNode.props || {});
    return resolveVNode(result);
  }
  return vNode;
}

export function updateElement(parentElement, newVNode, oldVNode, index = 0) {
  const childNode = parentElement.childNodes[index];

  if (!newVNode && !childNode) return;

  if (!newVNode) {
    parentElement.removeChild(childNode);
    return;
  }

  if (!childNode) {
    parentElement.appendChild(createElement(newVNode));
    return;
  }

  if (
    (typeof newVNode === "string" || typeof newVNode === "number") &&
    childNode.nodeType === 3
  ) {
    if (childNode.nodeValue !== String(newVNode)) {
      childNode.nodeValue = newVNode;
    }
    return;
  }

  if (typeof newVNode.type === "function") {
    const resolvedNew = resolveVNode(newVNode);
    const resolvedOld =
      oldVNode && typeof oldVNode.type === "function"
        ? resolveVNode(oldVNode)
        : oldVNode;
    updateElement(parentElement, resolvedNew, resolvedOld, index);
    return;
  }

  if (
    !oldVNode ||
    typeof newVNode !== typeof oldVNode ||
    typeof newVNode === "string" ||
    typeof oldVNode === "string" ||
    newVNode.type !== oldVNode.type
  ) {
    const newElement = createElement(newVNode);
    parentElement.replaceChild(newElement, childNode);
    return;
  }

  const oldProps = oldVNode && oldVNode.props ? oldVNode.props : {};
  updateAttributes(childNode, newVNode.props, oldProps);

  // Update children
  const newChildren = newVNode.children || [];
  const oldChildren = (oldVNode && oldVNode.children) || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(childNode, newChildren[i], oldChildren[i], i);
  }
}

export function updateAttributes(domElement, newProps, oldProps) {
  oldProps = oldProps || {};
  newProps = newProps || {};

  for (const key in oldProps) {
    if (!(key in newProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        const oldHandler = oldProps[key];

        if (oldHandler) {
          removeEvent(domElement, eventType, oldHandler);
          domElement.removeEventListener(eventType, oldHandler);
          const handlerKey = `__handler_${eventType}`;
          if (domElement[handlerKey]) {
            delete domElement[handlerKey];
          }
        }
      } else {
        domElement.removeAttribute(key);
      }
    }
  }

  // 새 속성들 추가/업데이트
  for (const key in newProps) {
    const newValue = newProps[key];
    const oldValue = oldProps[key];

    if (newValue !== oldValue) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        const oldHandler = oldProps[key];

        if (oldHandler) {
          removeEvent(domElement, eventType, oldHandler);
          domElement.removeEventListener(eventType, oldHandler);
        }

        if (newValue && typeof newValue === "function") {
          addEvent(domElement, eventType, newValue);
          domElement.addEventListener(eventType, newValue);
        }
      } else if (key === "className") {
        domElement.setAttribute("class", newValue);
      } else {
        domElement.setAttribute(key, newValue);
      }
    }
  }
}
