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
    return createFragmentWithArray(vNode);
  }

  const $el = document.createElement(vNode.type);

  return $el;
}

// function updateAttributes($el, props) {}

/**
 * 배열 형태의 vNode를 받을 경우 fragment로 감싸서 반환
 * @param {*} vNode
 * @returns {DocumentFragment} fragment
 */
function createFragmentWithArray(vNode) {
  const fragment = document.createDocumentFragment();
  vNode.forEach((node) => {
    const $el = createElement(node);
    fragment.appendChild($el);
  });
  return fragment;
}
