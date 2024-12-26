import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const newVNode = normalizeVNode(vNode);

  if (container.oldVNode) {
    updateElement(container, newVNode, container.oldVNode);
  } else {
    container.append(createElement(newVNode));
  }

  container.oldVNode = newVNode;
  setupEventListeners(container);
}
