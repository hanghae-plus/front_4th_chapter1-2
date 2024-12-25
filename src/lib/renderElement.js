import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // TODO:  updateElement로 기존 DOM을 업데이트한다.
  container.innerHTML = null;
  container.append(createElement(normalizeVNode(vNode)));
  setupEventListeners(container);
}
