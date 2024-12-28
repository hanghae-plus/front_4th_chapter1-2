import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedNode = normalizeVNode(vNode);

  if (container.oldVNode) {
    updateElement(container, normalizedNode, container.oldVNode);
  } else {
    const newNode = createElement(normalizedNode);
    container.appendChild(newNode);
  }
  setupEventListeners(container);
  container.oldVNode = normalizedNode;
}
