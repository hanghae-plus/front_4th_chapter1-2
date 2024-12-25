import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  if (!container._oldVNode) {
    container._oldVNode = null;
  }
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  const normalizedVNode = normalizeVNode(vNode);
  if (!container._oldVNode) {
    const $el = createElement(normalizedVNode);
    container.appendChild($el);
  } else {
    updateElement(container, normalizedVNode, container._oldVNode);
  }

  setupEventListeners(container);
  container._oldVNode = normalizedVNode;

  return container;
}
