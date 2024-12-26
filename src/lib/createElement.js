import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // falsy 값들 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // string 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });
    return fragment;
  }

  // 객체일 경우
  const element = document.createElement(vNode.type);

  // props 처리
  if (vNode.props) {
    Object.entries(vNode.props).forEach(([key, value]) => {
      // 이벤트 핸들러 처리
      if (key.startsWith("on") && typeof value === "function") {
        addEvent(element, key, value);
      }
      // className 특별 처리
      else if (key === "className") {
        element.setAttribute("class", value);
      }
      // 일반 속성 처리
      else if (key !== "children") {
        element.setAttribute(key, value);
      }
    });
  }

  // 자식노드가 있을 경우 재귀적으로 호출
  if (vNode.children) {
    vNode.children
      .filter(Boolean)
      .map(createElement)
      .forEach((child) => element.appendChild(child));
  }

  return element;
}
