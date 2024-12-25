import { getAttributeName, getEventType, isEvent } from "./helper";
import { addEvent } from "./eventManager";
import { VNode, VNodeProps } from "./type";
import { isBooleanTrue, isNumberZero, isStringOrNum } from "./typeChecker";

export function createElement(vNode: VNode | VNode[]) {
  if (typeof vNode?.type === "function") {
    throw Error();
  }

  if ((!vNode || isBooleanTrue(vNode)) && !isNumberZero(vNode))
    return document.createTextNode("");

  if (isStringOrNum(vNode)) {
    return document.createTextNode(vNode.toString());
  }

  if (Array.isArray(vNode)) {
    let $elArray = document.createDocumentFragment();
    vNode.forEach((el) => {
      $elArray.appendChild(createElement(el));
    });
    return $elArray;
  }

  let $el = document.createElement(vNode.type);

  if ("props" in vNode) {
    $el = updateAttributes($el, vNode.props);
  }

  vNode.children?.forEach((child) => {
    const childEl = createElement(child);

    $el.appendChild(childEl);
  });

  return $el;
}

function updateAttributes($el: HTMLElement, props: VNodeProps): HTMLElement {
  if (!props) return $el;

  for (const [k, v] of Object.entries(props)) {
    if (isEvent(k, v)) {
      addEvent($el, getEventType(k), v);

      continue;
    }

    $el.setAttribute(getAttributeName(k), v);
  }

  return $el;
}
