import { updateAttributes } from "@/lib";

export function createElement(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => fragment.appendChild(createElement(child)));
    return fragment;
  }

  const newElement = document.createElement(vNode.type);

  updateAttributes(newElement, vNode.props, {});

  vNode.children.forEach((child) => {
    newElement.appendChild(createElement(child));
  });

  return newElement;
}
