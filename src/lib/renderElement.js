import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  if (!vNode || !container) {
    return;
  }

  const normalizedVNode = normalizeVNode(vNode);

  if (!container._prevVNode) {
    const domElement = createElement(normalizedVNode);
    container.appendChild(domElement);
    setupEventListeners(container);
    container._prevVNode = normalizedVNode;
  } else {
    updateElement(container, normalizedVNode, container._prevVNode);
    container._prevVNode = normalizedVNode;
  }
}
