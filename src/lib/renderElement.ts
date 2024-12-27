import { eventManager, setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { updateElement } from "./updateElement";
import { normalizeVNode } from "./normalizeVNode";

let oldVNode;
export function renderElement(vNode, container) {
  setupEventListeners(container);

  eventManager.eventSet.clear();
  const normalizedVNode = normalizeVNode(vNode);

  if (container.children.length === 0) {
    const $el = createElement(normalizedVNode);
    container.appendChild($el);
  } else {
    updateElement(container, normalizedVNode, oldVNode);
  }

  oldVNode = normalizedVNode;
}
