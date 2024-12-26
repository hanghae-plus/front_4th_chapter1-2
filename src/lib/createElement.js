import { addEvent } from "./eventManager";

function updateAttributes($el, props) {
  Object.entries(props).forEach(([attr, value]) => {
    if (attr.startsWith("on") && typeof value === "function") {
      addEvent($el, attr.slice(2).toLowerCase(), value);
    } else if (attr === "className") {
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(attr, value);
    }
  });
}

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean")
    return document.createTextNode("");

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    console.log("vNode Array", vNode);
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      if (child) {
        fragment.appendChild(createElement(child));
      }
    });
    return fragment;
  }

  const $el = document.createElement(vNode.type);

  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  if (vNode.children) {
    $el.append(...vNode.children.map(createElement));
  }

  return $el;
}
