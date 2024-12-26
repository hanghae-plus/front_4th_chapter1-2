import { addEvent } from "./eventManager";

// function updateAttributes($el, props) {}

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean")
    return document.createTextNode("");

  if (typeof vNode === "string" || typeof vNode === "number")
    return document.createTextNode(String(vNode));

  if (vNode && Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    const children = vNode.map((child) => createElement(child));

    children.forEach((child) => {
      fragment.appendChild(child);
    });

    return fragment;
  }

  const $el = document.createElement(vNode.type);

  if (vNode.props) {
    Object.keys(vNode.props).forEach((key) => {
      // 리액트 이벤트 규칙에는 on으로 시작해야한다는 규칙이 있다.
      // 정규표현식으로 대문자도 체크할까하다가 Tomuch인거 같아서 패스.
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        addEvent(eventType, vNode.props[key], vNode.props[key]);
        return;
      }

      $el.setAttribute(key, vNode.props[key]);
    });
  }

  if (vNode.children) {
    vNode.children.forEach((child) => {
      const $child = createElement(child);
      $el.appendChild($child);
    });
  }

  return $el;
}
