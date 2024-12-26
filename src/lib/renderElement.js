import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let oldVNode = null;

export function renderElement(vNode, container) {
  const newVNode = normalizeVNode(vNode);

  if (oldVNode) {
    updateElement(container, newVNode, oldVNode);
  } else {
    container.replaceChildren(createElement(newVNode));
  }

  setupEventListeners(container);
  oldVNode = newVNode;
}
