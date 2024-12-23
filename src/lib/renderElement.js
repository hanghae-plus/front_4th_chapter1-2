import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let globalVNode;

export function renderElement(vNode, container) {
  if (!container.hasChildNodes()) {
    globalVNode = null;
  }

  if (!globalVNode) {
    const normalizedVNode = normalizeVNode(vNode);
    const el = createElement(normalizedVNode);
    container.appendChild(el);
    globalVNode = normalizedVNode;
  } else {
    const newNodes = normalizeVNode(vNode);
    updateElement(container, newNodes, globalVNode);
    globalVNode = newNodes;
  }

  setupEventListeners(container);
}
