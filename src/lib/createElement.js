// import { addEvent } from "./eventManager";

import { isString } from "../utils/isString";
import { isValid } from "../utils/isValid";

export function createElement(vNode) {
  if (!isValid(vNode)) {
    return document.createTextNode("");
  }
  if (isString(vNode)) {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode) && vNode.length > 1) {
    const fragment = document.createDocumentFragment();
    vNode.map(createElement).forEach((el) => fragment.appendChild(el));

    return fragment;
  }

  const $el = document.createElement(vNode.type);

  return $el;
}

// function updateAttributes($el, props) {}
