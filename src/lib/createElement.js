import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // vNode가 null, undefined, boolean인 경우
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return document.createTextNode("");
  }

  // vNode가 문자열, 숫자인 경우
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // vNode가 배열인 경우
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      if (child != null) {
        fragment.appendChild(createElement(child));
      }
    });
    return fragment;
  }

  const $el = document.createElement(vNode.type);

  // 아래 코드 뭉치 설명할 수 있도록 정리하기
  // props 처리
  // Q. 이벤트 위임 방식이 어떻게 구현되어 있는건지 파악 필요
  if (vNode.props) {
    Object.keys(vNode.props).forEach((key) => {
      const value = vNode.props[key];
      // Q. on, className으로 처리하는 이유는 무엇일까? A. 이벤트 핸들러를 처리하기 위해서
      if (key.startsWith("on")) {
        const eventName = key.slice(2).toLowerCase(); // onclick -> click
        addEvent($el, eventName, value);
      } else if (key === "className") {
        $el.setAttribute("class", value);
      } else {
        $el.setAttribute(key, value);
      }
    });
  }

  const children = vNode.children.map(createElement);
  children.forEach((child) => $el.appendChild(child));

  return $el;
}

// function updateAttributes($el, props) {
// }
