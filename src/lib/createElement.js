import { isValidVNode, isString, isNumber } from "./validCheck";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (!isValidVNode(vNode)) {
    return document.createTextNode("");
  }

  if (isString(vNode) || isNumber(vNode)) {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const $fragment = document.createDocumentFragment();
    vNode.forEach((child) => $fragment.appendChild(createElement(child)));
    return $fragment;
  }

  if (typeof vNode.type === "function") {
    throw new Error("Function Components are not supported.");
  }

  const $element = document.createElement(vNode.type);

  updateAttributes($element, vNode.props ?? {});

  $element.append(...vNode.children.map(createElement));

  return $element;
}

/**
 * DOM 요소에 속성 추가
 */
function updateAttributes($element, props) {
  Object.entries(props).forEach(([attr, value]) => {
    if (attr === "className") {
      $element.setAttribute("class", value);
    } else if (attr.startsWith("on") && typeof value === "function") {
      const eventType = attr.toLowerCase().slice(2);
      addEvent($element, eventType, value);
    } else {
      $element.setAttribute(attr, value);
    }
  });
}
