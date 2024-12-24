import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (typeof vNode === "undefined" || vNode === null) {
    return document.createTextNode("");
  }

  if (typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  if (typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((node) => fragment.append(createElement(node)));
    return fragment;
  }

  if (typeof vNode.type === "function") {
    throw Error();
  }

  const element = document.createElement(vNode.type);

  if (vNode.props) {
    Object.entries(vNode.props).forEach(([key, value]) => {
      if (key === "className") {
        element.classList = value;
        return;
      }
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        addEvent(element, eventType, value);
        return;
      }
      element.setAttribute(key, value);
    });
  }

  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      element.append(childElement);
    });
  }

  return element;
}

// function updateAttributes($el, props) {}
