import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const vDom = new WeakMap();

export function renderElement(vNode, container) {
  const newVNode = normalizeVNode(vNode);

  if (!vDom.has(container)) {
    const element = createElement(newVNode);
    container.appendChild(element);
  } else {
    const oldVNode = vDom.get(container);
    updateElement(container, newVNode, oldVNode);
  }

  setupEventListeners(container);
  vDom.set(container, newVNode);
}
