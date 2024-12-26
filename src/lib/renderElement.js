import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const nodeToContainerMap = new WeakMap();

export function renderElement(vNode, container) {
  vNode = normalizeVNode(vNode);
  if (!nodeToContainerMap.has(container)) {
    container.append(createElement(vNode));
  } else {
    const oldNode = nodeToContainerMap.get(container);
    updateElement(container, vNode, oldNode);
  }
  setupEventListeners(container);
  nodeToContainerMap.set(container, vNode);
}
