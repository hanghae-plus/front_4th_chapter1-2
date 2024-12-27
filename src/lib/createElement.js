import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (typeof vNode === "function") {
    throw new Error("invalid vNode");
  }

  if (
    typeof vNode === "boolean" ||
    typeof vNode === "undefined" ||
    vNode === null
  ) {
    return new Text("");
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return new Text(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = new DocumentFragment();

    vNode.forEach((node) => fragment.append(createElement(node)));

    return fragment;
  }

  if (!Array.isArray(vNode) && typeof vNode === "object") {
    const container = document.createElement(vNode.type);

    updateAttributes(container, vNode?.props);
    container.append(createElement(vNode.children));

    return container;
  }

  return vNode;
}

function updateAttributes($el, props = {}) {
  if (props === null) return;

  Object.entries(props).forEach(([attr, value]) => {
    if (attr === "className") {
      $el.setAttribute("class", value);
      return;
    }

    if (attr.startsWith("on")) {
      addEvent($el, attr.slice(2).toLowerCase(), value);
      return;
    }

    $el.setAttribute(attr, value);
  });
}
