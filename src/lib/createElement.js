import { addEvent } from "./eventManager";
import {
  isClassNameProps,
  isEventProps,
  isRenderableVNode,
  isTextVNode,
} from "./vNodeUtils";

export function createElement(vNode) {
  if (!isRenderableVNode(vNode)) {
    return document.createTextNode("");
  }

  if (isTextVNode(vNode)) {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    fragment.append(...Array.from(vNode).map(createElement));
    return fragment;
  }

  const { type, props, children } = vNode;
  const element = document.createElement(type);
  updateAttributes(element, props);

  element.append(...Array.from(children).map(createElement));

  return element;
}

function updateAttributes($el, props) {
  Object.keys(props ?? {}).forEach((key) => {
    if (isEventProps(key)) {
      const eventType = key.slice(2).toLowerCase();
      const handler = props[key];
      addEvent($el, eventType, handler);
      return;
    }

    if (isClassNameProps(key)) {
      $el.setAttribute("class", props[key]);
      return;
    }

    $el.setAttribute(key, props[key]);
  });
}
