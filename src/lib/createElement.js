// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => fragment.appendChild(createElement(child)));
    return fragment;
  }

  const $el = document.createElement(vNode.type);

  if (vNode.props) {
    for (const [key, value] of Object.entries(vNode.props)) {
      console.log(key, value);
      if (key.startsWith("on")) {
        $el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === "className") {
        $el.className = value;
      } else {
        $el.setAttribute(key, value);
      }
    }
  }

  if (vNode.children) {
    vNode.children.forEach((child) => $el.appendChild(createElement(child)));
  }

  return $el;
}

// function updateAttributes($el, props) {}
