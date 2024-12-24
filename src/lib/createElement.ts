import { NormalizedVNode } from "@/types/VNode";
import { isValidVNodeType } from "@/utils/jsxUtils";
import { isTypeIn } from "@/utils/typeCheckUtils";
import { updateAttributes } from "@/utils/domUtils";

export function createElement(vNode: NormalizedVNode | string) {
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

  updateAttributes($root, vNode.props);

  vNode.children.forEach((child) => {
    const $child = createElement(child);
    $root.appendChild($child);
  });

  return $root;
}
