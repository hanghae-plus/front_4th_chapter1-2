import { addEvent } from "./eventManager";
import { NormalizedVNode } from "./types";

function updateAttributes($el, props) {
  if (props == null) {
    return;
  }

  for (let [key, value] of Object.entries(props)) {
    const isEvent = key.startsWith("on") && typeof value === "function";
    if (isEvent) {
      addEvent($el, key.slice(2).toLowerCase(), value);
      continue;
    }

    if (key === "className") {
      $el.className = value;
      continue;
    }

    $el.setAttribute(key, value);
  }
}

export function createElement(vNode: NormalizedVNode | string) {
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  const { type, props, children } = vNode;
  const $el = document.createElement(type);

  updateAttributes($el, props);

  if (Array.isArray(children)) {
    children.forEach((child) => {
      const $child = createElement(child);
      $el.appendChild($child);
    });
  }

  return $el;
}
