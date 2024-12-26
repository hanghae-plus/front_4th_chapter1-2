import { addEvent } from "./eventManager.js";
import { supportedEventNames } from "./extractEvent.js";

/**
 * DOM API를 이용하여 Virtual DOM을 실제 DOM으로 변환한다.
 */
export function createElement(vNode) {
  // 문자열이나 숫자 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // null, undefined, boolean 처리
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 배열(fragment) 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });
    return fragment;
  }

  const element = document.createElement(vNode.type);

  // props 처리
  if (vNode.props) {
    Object.entries(vNode.props).forEach(([key, value]) => {
      if (key === "className") {
        element.setAttribute("class", value);
      } else if (key.startsWith("on") && typeof value === "function") {
        const eventType = key.slice(2).toLowerCase();
        if (supportedEventNames.has(eventType)) {
          addEvent(element, eventType, value);
        }
      } else if (key !== "key" && key !== "children") {
        element.setAttribute(key, value);
      }
    });
  }

  // 자식 노드 처리
  vNode.children.forEach((child) => {
    const childElement = createElement(child);
    element.appendChild(childElement);
  });

  return element;
}
