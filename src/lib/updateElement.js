import { addEvent, createElement, removeEvent } from "@/lib";

export function updateElement(parent, newNode, oldNode, index = 0) {
  // 1. oldNode만 있는 경우
  if (!newNode && oldNode) {
    return parent.removeChild(parent.childNodes[index]);
  }

  // 2. newNode만 있는 경우
  if (newNode && !oldNode) {
    return parent.appendChild(createElement(newNode));
  }

  // 3. oldNode와 newNode 모두 string 타입일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      return (parent.childNodes[index].nodeValue = newNode);
    }
    return;
  }

  // 4. oldNode와 newNode의 type이 다를 경우
  if (newNode.type !== oldNode.type) {
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index],
    );
  }

  // 5. oldNode와 newNode의 type이 같을 경우
  const currentElement = parent.childNodes[index];
  updateAttributes(currentElement, newNode.props, oldNode.props);

  // 6. 자식 노드를 순회하며 업데이트
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  Array.from({ length: maxLength }).forEach((_, i) => {
    updateElement(currentElement, newNode.children[i], oldNode.children[i], i);
  });
}

export function updateAttributes(target, newProps, oldProps) {
  const allProps = new Set([
    ...Object.keys(oldProps || {}),
    ...Object.keys(newProps || {}),
  ]);

  allProps.forEach((attr) => {
    if (attr === "children") return;

    const oldValue = oldProps?.[attr];
    const newValue = newProps?.[attr];

    if (attr.startsWith("on")) {
      const eventType = attr.slice(2).toLowerCase();

      if (newValue !== oldValue) {
        if (oldValue) {
          removeEvent(target, eventType, oldValue);
        }
        if (newValue) {
          addEvent(target, eventType, newValue);
        }
      }
      return;
    }

    if (newValue === undefined) {
      target.removeAttribute(attr);
      return;
    }

    const attributeName = attr === "className" ? "class" : attr;
    target.setAttribute(attributeName, newValue);
  });
}
