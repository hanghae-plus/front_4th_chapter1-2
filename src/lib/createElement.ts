import { ValidVNode } from "@/types/VNode";
import { isValidVNodeType } from "@/utils/jsxUtils";
import { isTypeIn } from "@/utils/typeCheckUtils";
import { addEvent } from "@/lib/eventManager";
import { HTMLEventName } from "@/types/event";

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

    if (key === "className") {
      $root.className = value;
      return;
    }

    if (key.startsWith("data-")) {
      const dataKey = key.slice(5);
      $root.dataset[dataKey] = value;
      return;
    }

    if (key.startsWith("on")) {
      const eventName = key.slice(2).toLowerCase();
      addEvent($root, eventName as HTMLEventName, value as () => void);
      return;
    }

    $root.setAttribute(key, value);
  });

  vNode.children.forEach((child) => {
    const $child = createElement(child);
    $root.appendChild($child);
  });

  return $root;
}

function updateAttributes($el, props) {}
