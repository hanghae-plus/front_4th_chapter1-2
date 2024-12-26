import { addEvent } from "./eventManager";
export function createElement(vNode) {
  if (vNode && typeof vNode.type === "function") {
    throw new Error("Function component is not supported");
  }
  // 1. null, undefined, boolean 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 2. 문자열이나 숫자 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // 3. 배열 처리
  if (Array.isArray(vNode)) {
    const $fragment = document.createDocumentFragment();
    vNode.forEach((node) => {
      const $element = createElement(node);
      $fragment.appendChild($element);
    });
    return $fragment;
  }

  // 4. DOM 요소 생성
  const $el = document.createElement(vNode.type);

  // props 처리
  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  // children 처리
  if (vNode.children) {
    const children = Array.isArray(vNode.children)
      ? vNode.children
      : [vNode.children];
    children.forEach((child) => {
      const $child = createElement(child);
      $el.appendChild($child);
    });
  }

  return $el;
}

/**
 * DOM요소 속성 및 이벤트 부여 및 등록 함수
 * @param {*} $el DOM 요소
 * @param {*} props DOM 요소 속성
 */
function updateAttributes($el, props) {
  Object.entries(props).forEach(([attr, value]) => {
    if (attr.startsWith("on") && typeof value === "function") {
      const eventType = attr.toLowerCase().slice(2);
      addEvent($el, eventType, value);
    } else if (attr === "className") {
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(attr, value);
    }
  });
}
