// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode == null || typeof vNode === "boolean" || vNode === undefined) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragement = document.createDocumentFragment();

    vNode.forEach((child) => {
      const childNode = createElement(child);
      fragement.appendChild(childNode);
    });
    return fragement;
  }

  const $el = document.createElement(vNode.type);
  updateAttributes($el, vNode.props);
  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childNode = createElement(child);
      $el.appendChild(childNode);
    });
  } else {
    $el.appendChild(createElement(vNode.children));
  }

  return $el;
}

function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      $el.setAttribute("class", value);
    } else if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase(); // 예: onClick -> click
      $el.addEventListener(eventType, value); // 이벤트 핸들러 등록
    } else {
      $el.setAttribute(key, value); // 일반 속성 처리
    }
  });
}
