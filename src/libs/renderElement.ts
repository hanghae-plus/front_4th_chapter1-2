import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";
import { VNode, VNodeChild } from "../types";

/**
 * Virtual DOM을 실제 DOM으로 렌더링하는 함수
 * @param vNode - 렌더링할 Virtual Node
 * @param container - 렌더링될 컨테이너 DOM Element
 */

const prevVNodeMap = new WeakMap<HTMLElement, VNode | string>();

export function renderElement(vNode: VNodeChild, container: HTMLElement) {
  const normalizedNode = normalizeVNode(vNode);
  const prevVNode = prevVNodeMap.get(container);

  if (!prevVNode) {
    setupEventListeners(container);
    const element = createElement(normalizedNode);
    container.appendChild(element);
  } else {
    updateElement(container, normalizedNode, prevVNode, 0);
  }

  prevVNodeMap.set(container, normalizedNode);
}
