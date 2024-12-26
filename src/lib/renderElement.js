import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  vNode = normalizeVNode(vNode);
  const isInitialRender = !container.childNodes[0];

  if (isInitialRender) {
    container.append(createElement(vNode));
  } else {
    updateElement(container, vNode, container.childNodes[0]);
  }

  setupEventListeners(container);
}
