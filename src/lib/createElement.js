import { addEvent } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";

export function createElement(vNode) {
  const normalVNode = normalizeVNode(vNode);

  if (typeof normalVNode == "object") {
    if (typeof vNode.type == "function") {
      console.log("에러?");
      throw new Error("컴포넌트 예외");
    }

    const fragment = document.createDocumentFragment();
    if (Array.isArray(normalVNode)) {
      normalVNode.forEach((data) => {
        fragment.appendChild(createElement(data));
      });
      return fragment;
    }

    // 객체(단일 Virtual DOM 노드) 처리
    const $el = document.createElement(normalVNode.type);
    if (normalVNode.props) {
      updateAttributes($el, normalVNode.props);
    }
    normalVNode.children.forEach((data) => {
      $el.appendChild(createElement(data));
    });
    return $el;
  }

  const result = document.createTextNode(normalVNode);
  return result;
}

function updateAttributes($el, props) {
  Object.keys(props).forEach((key) => {
    if (key.startsWith("on") && typeof props[key] == "function") {
      const eventType = key.toLowerCase().substring(2);
      addEvent($el, eventType, props[key]);
    } else if (key == "className") {
      $el.setAttribute("class", props["className"]);
    } else {
      $el.setAttribute(key, props[key]);
    }
  });
}
