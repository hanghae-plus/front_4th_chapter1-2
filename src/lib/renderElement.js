import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const oldNodeMap = new WeakMap();
export function renderElement(vNode, container) {
  // 1. vNode 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // 1-1. 이전 vNode 가져오기
  const oldVNode = oldNodeMap.get(container);

  if (oldVNode) {
    // 이전 가상 DOM이 있으면 비교 후 업데이트
    updateElement(container, normalizedVNode, oldVNode);
  } else {
    // 최초 렌더링
    container.appendChild(createElement(normalizedVNode));
  }

  oldNodeMap.set(container, normalizedVNode);

  setupEventListeners(container);
}
