import { ValidVNode } from "@/types/VNode";
import { isValidVNodeType } from "@/utils/jsxUtils";
import { isTypeIn } from "@/utils/typeCheckUtils";

export function createElement(vNode: ValidVNode) {
  if (!isValidVNodeType(vNode)) return document.createTextNode("");

  if (isTypeIn(vNode, ["string", "number"]))
    return document.createTextNode(String(vNode));

  if (Array.isArray(vNode)) {
    const $fragment = document.createDocumentFragment();

    vNode.forEach((child) => {
      const $child = createElement(child);
      $fragment.appendChild($child);
    });

    return $fragment;
  }

  const $root = document.createElement(vNode.type);

  Object.entries(vNode.props ?? {}).map(([key, value]) => {
    if (key === "children") return;

    if (key === "className") key = "class";

    // TODO: react 의 이벤트 핸들러 key 값을 html 키 값으로 변경한다.
    if (key.startsWith("on")) key = key.toLowerCase();

    $root.setAttribute(key, value);
  });

  vNode.children.forEach((child) => {
    const $child = createElement(child);
    $root.appendChild($child);
  });

  return $root;
}

function updateAttributes($el, props) {}
