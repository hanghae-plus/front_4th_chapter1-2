import { InvalidVNodeTypeError } from "../errors/InvalidVNodeTypeError";
import { isRenderableVNode, isTextNode } from "../utils/domUtils";
import { getEventTypeFromProps } from "../utils/eventUtils";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (typeof vNode === "function") {
    throw new InvalidVNodeTypeError();
  }

  if (!isRenderableVNode(vNode)) {
    return document.createTextNode("");
  }

  if (isTextNode(vNode)) {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const docFragment = document.createDocumentFragment();
    const childNodes = vNode.map(createElement);
    childNodes.forEach((childNode) => docFragment.appendChild(childNode));
    return docFragment;
  }

  const $element = document.createElement(vNode.type);
  for (let [key, value] of Object.entries(vNode.props || {})) {
    addAttirbutes($element, key, value);
  }
  const childNodes = (vNode.children || []).map(createElement);
  childNodes.forEach((childNode) => $element.appendChild(childNode));
  return $element;
}

export const addAttirbutes = (element, key, value) => {
  if (key.startsWith("on")) {
    addEvent(element, getEventTypeFromProps(key), value);
    return;
  }
  if (key === "className") {
    element.setAttribute("class", value);
    return;
  }
  if (key === "children") {
    return;
  }
  element.setAttribute(key, value);

  return element;
};
