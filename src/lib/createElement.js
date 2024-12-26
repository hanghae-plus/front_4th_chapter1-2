import { addEvent } from "./eventManager";
import { isArray, isFalsy, isStringOrNumber } from "./shared/index.js";

const updateAttributes = ($el, props) => {
  if (props) {
    Object.keys(props).forEach((key) => {
      // 리액트 이벤트 규칙에는 on으로 시작해야한다는 규칙이 있다.
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        addEvent($el, eventType, props[key]); // element 인자를 추가함
        return;
      }

      if (key === "className") {
        $el.setAttribute("class", props[key]);
        return;
      }

      $el.setAttribute(key, props[key]);
    });
  }
};

const updateChildren = ($el, children) => {
  if (children) {
    children.forEach((child) => {
      const $child = createElement(child);
      $el.appendChild($child);
    });
  }
};

const createFragmentFromVNodeArray = (vNodeArray) => {
  const fragment = document.createDocumentFragment();

  const children = vNodeArray.map((child) => createElement(child));

  children.forEach((child) => {
    fragment.appendChild(child);
  });

  return fragment;
};

export function createElement(vNode) {
  if (isFalsy(vNode)) return document.createTextNode("");

  if (isStringOrNumber(vNode)) return document.createTextNode(String(vNode));

  if (isArray(vNode)) return createFragmentFromVNodeArray(vNode);

  const $el = document.createElement(vNode.type);

  updateAttributes($el, vNode.props);

  updateChildren($el, vNode.children);

  return $el;
}
