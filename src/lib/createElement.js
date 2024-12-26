import { addEvent } from "./eventManager";

//virtualDOM -> real DOM
export function createElement(vNode) {
  //null, undefined, boolean
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  //number, string
  if (typeof vNode === "number" || typeof vNode === "string") {
    return document.createTextNode(String(vNode));
  }

  //array
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((child) => {
      const childEl = createElement(child);
      fragment.appendChild(childEl);
    });

    return fragment;
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    throw new Error(
      `Function components cannot be directly passed to createElement.`,
    );
  }

  const $el = document.createElement(vNode.type);

  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childEl = createElement(child);
      $el.appendChild(childEl);
    });
  }

  return $el;
}

function updateAttributes($el, props) {
  Object.keys(props).forEach((key) => {
    if (key.startsWith("on")) {
      // 이벤트 리스너 처리 (ex: onClick ...)
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, props[key]);
    } else if (key === "className") {
      // className 처리
      $el.setAttribute("class", props[key]);
    } else {
      // 일반 속성 처리
      $el.setAttribute(key, props[key]);
    }
  });
}
