import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let currentVNode = new WeakMap();

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);

  // 기존 DOM 제거
  if (!currentVNode.has(container)) {
    const $el = createElement(normalizedVNode);
    container.appendChild($el);
  } else {
    const oldNode = currentVNode.get(container);
    updateElement(container, normalizedVNode, oldNode);
  }

  // 이벤트 리스너 설정
  setupEventListeners(container);
  currentVNode.set(container, normalizedVNode);
}
