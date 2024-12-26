import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";
export function renderElement(vNode, container) {
  if (!container._oldVNode) {
    container._oldVNode = null;
  }

  const normalizedVNode = normalizeVNode(vNode);
  if (!container._oldVNode) {
    container.appendChild(createElement(normalizedVNode));
  } else {
    updateElement(container, normalizedVNode, container._oldVNode);
  }

  setupEventListeners(container);
  container._oldVNode = normalizedVNode;
}
