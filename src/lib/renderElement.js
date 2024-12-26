import {
  setupEventListeners,
  createElement,
  normalizeVNode,
  updateElement,
} from "@/lib";

/**
 * 최초 렌더링 구분은 컨테이너에 previousVirtualDOM이 없는지 여부로 판단
 * rendering flow 이 후 다시 previousVirtualDOM 갱신
 */

export function renderElement(vNode, container) {
  setupEventListeners(container);
  const oldVNode = container.previousVirtualDOM;
  const normalizedNode = normalizeVNode(vNode);

  if (oldVNode) {
    updateElement(container, normalizedNode, oldVNode, 0);
  } else {
    const newElement = createElement(normalizedNode);
    container.appendChild(newElement);
  }

  container.previousVirtualDOM = normalizedNode;
}
