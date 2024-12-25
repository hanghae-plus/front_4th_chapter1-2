import { isValidVNode, isString, isNumber } from "./validCheck";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // null, undefined, boolean  > 빈 텍스트 노드
  if (!isValidVNode(vNode)) {
    return document.createTextNode("");
  }
  // 텍스트와 숫자 > 텍스트 노드
  if (isString(vNode) || isNumber(vNode)) {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => fragment.appendChild(createElement(child)));
    return fragment;
  }

  const $el = document.createElement(vNode.type);

  $el.append(...vNode.children.map(createElement));
  updateAttributes($el, vNode.props);

  return $el;
}

/**
 * DOM 요소에 속성 추가
 */
function updateAttributes(element, props) {
  Object.entries(props || {})
    //.filter(([attr, value]) => value)
    .forEach(([attr, value]) => {
      // className > class속성으로 변경
      if (attr === "className") {
        element.setAttribute("class", value);
      } else if (attr.startsWith("on")) {
        addEvent(element, attr, value);
      } else {
        element.setAttribute(attr, value);
      }
    });
}
