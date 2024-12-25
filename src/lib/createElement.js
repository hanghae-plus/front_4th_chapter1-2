import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(`${vNode}`);
  }

  if (typeof vNode.type === "function" && typeof vNode === "object") {
    throw new Error();
  }

  if (Array.isArray(vNode)) {
    const $fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      $fragment.appendChild(createElement(child));
    });
    return $fragment;
  }

  const $el = document.createElement(vNode.type);
  updateAttributes($el, vNode.props);
  if (Array.isArray(vNode.children)) {
    vNode.children.forEach((child) => {
      $el.appendChild(createElement(child));
    });
  }
  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props || {}).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      const eventType = key.toLowerCase().substring(2);
      addEvent($el, eventType, value);
    } else if (key.toLowerCase() === "classname") {
      // console.log($el, key, value);
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
