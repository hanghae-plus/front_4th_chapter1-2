// import { addEvent, removeEvent } from "./eventManager";
// import { createElement } from "./createElement.js";

function updateAttributes(target, newAttr, oldAttr) {
  for (let key in oldAttr) {
    if (!(key in newAttr)) {
      target.removeAttribute(key); // 더 이상 존재하지 않는 속성 제거
    }
  }

  for (let key in newAttr) {
    if (newAttr[key] !== oldAttr[key]) {
      target.setAttribute(key, newAttr[key]); // 새로운 값으로 속성 업데이트
    }
  }
}

function namedNodeMapToObject(attributes) {
  const obj = {};
  for (let attr of attributes) {
    obj[attr.name] = attr.value; // 속성 이름과 값을 객체로 변환
  }
  return obj;
}

function isAttrChanged(node1, node2) {
  const n1Attributes = node1.attributes;
  const n2Attributes = node2.attributes;

  if (n1Attributes.length !== n2Attributes.length) {
    return true;
  }

  const differentAttribute = Array.from(n1Attributes).find((attribute) => {
    const { name } = attribute;
    const attribute1 = node1.getAttribute(name);
    const attribute2 = node2.getAttribute(name);

    return attribute1 !== attribute2;
  });

  if (differentAttribute) {
    return true;
  }
}

function isTypeChanged(node1, node2) {
  if (node1.tagName !== node2.tagName) {
    return true;
  }

  return false;
}

export function updateElement(parentElement, newNode, oldNode) {
  if (!newNode && oldNode) {
    oldNode.remove();
    return;
  }

  if (newNode && !oldNode) {
    parentElement.appendChild(newNode);
    return;
  }

  if (
    oldNode.nodeType === Node.TEXT_NODE &&
    newNode.nodeType === Node.TEXT_NODE
  ) {
    if (oldNode.textContent !== newNode.textContent) {
      oldNode.replaceWith(newNode);
    }
    return;
  }

  if (isTypeChanged(newNode, oldNode)) {
    oldNode.replaceWith(newNode);
    return;
  }

  if (isAttrChanged(newNode, oldNode)) {
    updateAttributes(
      oldNode,
      namedNodeMapToObject(newNode.attributes),
      namedNodeMapToObject(oldNode.attributes),
    );
    return;
  }

  const oldChildren = Array.from(oldNode.childNodes);
  const newChildren = Array.from(newNode.childNodes);

  const max = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < max; i++) {
    updateElement(oldNode, newChildren[i], oldChildren[i], i);
  }
}
