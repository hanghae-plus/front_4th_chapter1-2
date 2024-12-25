import {
  checkNullishExceptZero,
  replaceIfPropIsClass,
} from "../utils/commonUtils";
import { addEvent } from "./eventManager";
// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (typeof vNode === "function" || typeof vNode?.type === "function") {
    throw new Error("NEED NORMALIZE");
  }
  if (typeof vNode === "boolean" || !checkNullishExceptZero(vNode)) {
    return document.createTextNode("");
  }

  // 문자열 또는 숫자인 경우 텍스트 노드로 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // 배열로 들어온 경우 fragment로 처리
  if (Array.isArray(vNode)) {
    const frag = document.createDocumentFragment();
    vNode.forEach((node) => {
      frag.append(makeElement(node));
    });
    return frag;
  }

  // 그 외의 경우 element로 처리
  const el = makeElement(vNode);

  if (Array.isArray(vNode.children)) {
    vNode.children.forEach((child) => {
      el.appendChild(createElement(child));
    });
  }

  return el;
}

function makeElement(vNode) {
  const el = document.createElement(vNode.type);
  updateAttributes(el, vNode.props);
  return el;
}

/**
 *
 * @param {HTMLElement} $el
 * @param {object} props
 */
function updateAttributes($el, props) {
  for (const prop in props) {
    if (prop?.startsWith("on")) {
      addEvent($el, prop.slice(2).toLowerCase(), props[prop]);
      continue;
    }
    $el.setAttribute(replaceIfPropIsClass(prop), props[prop]);
  }
}
