import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((node) => fragment.append(createElement(node)));
    return fragment;
  }
  const $el = document.createElement(vNode.type);

  if (vNode.props) {
    Object.entries(vNode.props || {}).forEach(([key, value]) => {
      if (key.startsWith("on")) {
        const eventType = key.toLowerCase().substring(2);
        addEvent($el, eventType, value);
      } else if (key === "className") {
        $el.setAttribute("class", value);
      } else {
        $el.setAttribute(key, value);
      }
    });
  }

  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      $el.append(childElement);
    });
  }
  return $el;
}
