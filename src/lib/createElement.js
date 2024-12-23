import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (!vNode || typeof vNode === "boolean") {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(`${vNode}`);
  }
  if (Array.isArray(vNode)) {
    const $fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      $fragment.appendChild(createElement(child));
    });
    return $fragment;
  }

  const $el = document.createElement(vNode.type, vNode.props);
  updateAttributes($el, vNode.props);
  vNode.children.forEach((child) => $el.appendChild(createElement(child)));
  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props || {}).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      const eventType = key.toLowerCase().substring(2);
      addEvent(eventType, value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
