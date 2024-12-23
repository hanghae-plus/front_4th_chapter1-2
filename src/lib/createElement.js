import { addEvent } from "./eventManager";
import { isClassName, isEvent, isRenderedVNode, isTextVNode } from "./util";

export function createElement(vNode) {
  if (!isRenderedVNode(vNode)) {
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
    if (isEvent(key)) {
      const eventType = key.slice(2).toLowerCase();
      const handler = props[key];
      addEvent($el, eventType, handler);
      return;
    }

    if (isClassName(key)) {
      $el.setAttribute("class", props[key]);
      return;
    }

    $el.setAttribute(key, props[key]);
  });
}
