import { addEvent } from "./eventManager";

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

  if (vNode.props && Object.keys(vNode.props).length > 0) {
    updateAttributes($el, vNode.props);
  }

  if (vNode.children) {
    vNode.children.forEach((child) => {
      const $child = createElement(child);
      $el.appendChild($child);
    });
  }

  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      $el.setAttribute("class", value);
      return;
    }
    if (key.startsWith("on")) {
      const event = key.slice(2).toLowerCase();
      addEvent($el, event, value);
      return;
    }
    $el.setAttribute(key, value);
  });
}

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
