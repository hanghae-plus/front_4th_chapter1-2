import { ATTR_NAME_MAP } from "./const";
import { addEvent } from "./eventManager";
import { VNode, VNodeProps } from "./type";
import { isBooleanTrue, isNumberZero, isStringOrNum } from "./typeChecker";

export function createElement(vNode: VNode | VNode[]) {
  if ((!vNode || isBooleanTrue(vNode)) && !isNumberZero(vNode))
    return document.createTextNode("");

  if (isStringOrNum(vNode)) {
    return document.createTextNode(vNode.toString());
  }

  if (Array.isArray(vNode)) {
    let $arrayNode = document.createDocumentFragment();
    vNode.forEach((el) => {
      $arrayNode.appendChild(createElement(el));
    });
    return $arrayNode;
  }

  let $el = document.createElement(vNode.type);

  if ("props" in vNode) {
    $el = updateAttributes($el, vNode.props);
  }

  if ("children" in vNode) {
    (vNode as typeof vNode).children.flat().forEach((child) => {
      const childNode = createElement(child);

      $el.appendChild(childNode);
    });
  }

  return $el;
}

function updateAttributes($el: HTMLElement, props: VNodeProps): HTMLElement {
  if (!props) return $el;
  Object.keys(props).forEach((key: string) => {
    $el.setAttribute(ATTR_NAME_MAP[key] ?? key, props[key]);
  });

  return $el;
}
