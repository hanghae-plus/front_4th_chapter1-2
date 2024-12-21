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
    Object.keys(vNode.props).forEach((key) => {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        addEvent(element, eventType, vNode.props[key]);
        return;
      }
      if (key.startsWith("data-")) {
        const dataset = key.replace("data-", "");
        element.dataset[dataset] = vNode.props[key];
      }
      element[key] = vNode.props[key];
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
