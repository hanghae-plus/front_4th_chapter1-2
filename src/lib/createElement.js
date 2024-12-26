import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (typeof vNode === "function") {
    throw Error("컴포넌트는 인자로 올 수 없습니다.");
  }
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child)); // 자식 노드들을 재귀적으로 추가
    });
    return fragment;
  }

  const { type, props, children } = vNode;

  const element = document.createElement(type);

  if (props) {
    updateAttributes(element, props);
  }

  children.forEach((child) => {
    element.appendChild(createElement(child));
  });

  return element;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      addEvent($el, key.slice(2).toLowerCase(), value);
    } else if (key === "className") {
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
