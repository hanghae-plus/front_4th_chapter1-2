import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => fragment.appendChild(createElement(child)));
    return fragment;
  }

  const $el = document.createElement(vNode.type);

  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  if (vNode.children) {
    vNode.children.forEach((child) => $el.appendChild(createElement(child)));
  }

  return $el;
}

function updateAttributes($el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("on")) {
      addEvent($el, key.slice(2).toLowerCase(), value);
    } else if (key === "className") {
      $el.className = value;
    } else {
      $el.setAttribute(key, value);
    }
  }
}
