import { ALL_EVENTS } from "../constants";
import { addEvent } from "./eventManager";

/*
 * [createElement workFlow]
 * 1. null, undefined, boolean 빈 텍스트 반환
 * 2. 원시값 빈 텍스트 반환
 * 3. 배열 값에대한 반환은 DocumentFragment 반환 (반복하는 요소들에 대한 요소를 묶어서 처리하기 위함)
 * 4. 그 외 일반 엘리먼트 생성 후 props, children 처리
 */

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });
    return fragment;
  }

  const element = document.createElement(vNode.type);

  if (vNode.props) {
    Object.entries(vNode.props).forEach(([key, value]) => {
      if (key === "key" || key === "children") {
        return;
      }

      if (key === "className") {
        element.setAttribute("class", value);
        return;
      }

      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        if (ALL_EVENTS.has(eventType) && typeof value === "function") {
          addEvent(element, eventType, value);
          return;
        }
      }

      element.setAttribute(key, value);
    });
  }

  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      element.appendChild(childElement);
    });
  }

  return element;
}
