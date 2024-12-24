import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

interface VNode {
  type: string | Function;
  props: Record<string, any>;
  children?: Array<VNode | string | number>;
}

export function renderElement(vNode: VNode, container: HTMLElement): void {
  const normalizedNode = normalizeVNode(vNode);

  // container의 첫 번째 자식이 있다면 업데이트, 없다면 새로 생성
  const oldNode = container.firstChild;

  if (oldNode) {
    // 기존 DOM이 있으면 업데이트
    const updatedElement = updateElement(container, normalizedNode, oldNode);
    container.replaceChild(updatedElement, oldNode);
  } else {
    // 기존 DOM이 없으면 새로 생성
    container.appendChild(createElement(normalizedNode));
  }

  setupEventListeners(container);
}
