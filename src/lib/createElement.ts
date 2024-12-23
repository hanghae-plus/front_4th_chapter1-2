import { ATTR_NAME_MAP } from "./const";
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

  Object.keys(props).forEach((key: string) => {
    if (key.startsWith("on") && typeof props[key] === "function") {
      const eventHandler = props[key];
      const eventType = key.replace("on", "").toLowerCase();
      addEvent($el, eventType, eventHandler);
      // $el._vNode = eventHandler;
      return;
    }

    $el.setAttribute(getAttributeKey(key), props[key]);
  });

  return $el;
}

const getAttributeKey = (key: string) => ATTR_NAME_MAP[key] ?? key;
