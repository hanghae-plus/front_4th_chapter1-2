import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const oldVNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  const _vNode = normalizeVNode(vNode);

  if (!oldVNodeMap.has(container)) {
    const newNode = createElement(_vNode);
    container.appendChild(newNode);
  } else {
    updateElement(container, _vNode, oldVNodeMap.get(container));
  }
  oldVNodeMap.set(container, _vNode);

  setupEventListeners(container);
}
