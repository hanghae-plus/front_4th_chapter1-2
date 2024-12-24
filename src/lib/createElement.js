import { addEvent } from "./eventManager";

/*
 * VirtualDOM을 받아 실제 DOM을 생성
 * */
export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const $fragment = document.createDocumentFragment();
    vNode.forEach((child) => $fragment.appendChild(createElement(child)));
    return $fragment;
  }

  const $element = document.createElement(vNode.type);

  updateAttributes($element, vNode.props ?? {});

  $element.append(...vNode.children.map(createElement));

  return $element;
}

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
