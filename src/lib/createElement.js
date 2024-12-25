// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode == null || typeof vNode === "boolean" || vNode === undefined) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragement = document.createDocumentFragment();

    vNode.forEach((child) => {
      const childNode = createElement(child);
      fragement.appendChild(childNode);
    });
    return fragement;
  }

  const $el = document.createElement(vNode?.type);
  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childNode = createElement(child);
      $el.appendChild(childNode);
    });
  }
  updateAttributes($el, vNode?.props);

  return $el;
}

function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    key === "className"
      ? $el.setAttribute("class", value)
      : $el.setAttribute(key, value);
  });
}
