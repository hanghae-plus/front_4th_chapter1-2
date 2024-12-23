//import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

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
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.substring(2).toLowerCase();
      $el.addEventListener(eventType, value);
    } else if (key === "className") {
      $el.setAttribute("class", value);
    } else if (value != null && value !== false) {
      $el.setAttribute(key, value);
    }
  });
}
