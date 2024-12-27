import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedNode = normalizeVNode(vNode);

  // 기존 요소가 있다면 업데이트하고, 없다면 새로 생성
  if (container.firstChild) {
    updateElement(container.firstChild, normalizedNode);
    return container.firstChild;
  } else {
    const element = createElement(normalizedNode);
    container.appendChild(element);
    setupEventListeners(container);
    return element;
  }
}
