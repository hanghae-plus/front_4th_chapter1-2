// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    vNode = document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    vNode = document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((element) => {
      fragment.appendChild(createElement(element));
    });

    vNode = fragment;
  } else if (typeof vNode === "object") {
    const element =
      vNode.type !== undefined
        ? document.createElement(vNode.type)
        : document.createTextNode(vNode);

    const refinedProps = { ...(vNode.props ?? {}) };

    updateAttributes(element, refinedProps);

    if (Array.isArray(vNode.children)) {
      vNode.children.forEach((child) => {
        element.appendChild(createElement(child));
      });
    }

    vNode = element;
  }

  return vNode;
}

function updateAttributes(element, props) {
  for (let key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      const event = key.split("on").at(1)?.toLowerCase();

      if (event) {
        element.addEventListener(event, props[key]);
      }
    } else {
      element.setAttribute(key === "className" ? "class" : key, props[key]);
    }
  }
}
