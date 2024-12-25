import { addEvent } from "./eventManager";

/**
 * @typedef {Object} VNode
 * @property {string|function} type - 요소의 타입
 * @property {Object | null} props - 요소의 속성
 * @property {Array<*>} children - 요소의 자식 노드
 */

export function createElement(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
  if (vNode instanceof Array) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  const $el = document.createElement(vNode.type);
  updateAttributes($el, vNode.props);
  vNode.children.forEach((child) => {
    $el.appendChild(createElement(child));
  });

  return $el;
}
function updateAttributes($el, props) {
  if (props === null) return;

  Object.keys(props).forEach((key) => {
    if (key === "className") {
      $el.setAttribute("class", props[key]);
    } else if (key.startsWith("on") && typeof props[key] === "function") {
      const eventName = key.toLowerCase().substring(2);
      addEvent($el, eventName, props[key]);
    } else {
      $el.setAttribute(key, props[key]);
    }
  });
}
