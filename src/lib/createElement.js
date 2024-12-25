import { addEvent } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";

export function createElement(vNode) {
  if (vNode && typeof vNode === "object" && typeof vNode.type === "function") {
    throw new Error(
      "컴포넌트를 createElement로 처리하려고 하면 오류가 발생한다",
    );
  }

  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  vNode = normalizeVNode(vNode);

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });
    return fragment;
  }

  const $el = document.createElement(vNode.type);

  updateAttributes($el, vNode.props);

  // 이벤트 속성 처리
  Object.entries(vNode.props || {}).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      addEvent($el, key.toLowerCase().slice(2), value);
    }
  });

  if (Array.isArray(vNode.children)) {
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      $el.appendChild(childElement);
    });
  }

  return $el;
}

function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      $el.setAttribute("class", value);
    } else if (key === "htmlFor") {
      $el.setAttribute("for", value);
    } else if (!key.startsWith("on")) {
      $el.setAttribute(key, value);
    }
  });
}
