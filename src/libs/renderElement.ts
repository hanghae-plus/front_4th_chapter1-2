import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";
import { VNode, VNodeChild } from "../types";

const vNodeMap = new WeakMap<HTMLElement, VNode | string>();

/**
 * Virtual DOM을 실제 DOM으로 렌더링하는 함수
 * @param vNode - 렌더링할 Virtual Node
 * @param container - 렌더링될 컨테이너 DOM Element
 */
export function renderElement(vNode: VNodeChild, container: HTMLElement) {
  const normalizedNode = normalizeVNode(vNode);
  const oldVNode = vNodeMap.get(container);

  if (!oldVNode) {
    const element = createElement(normalizedNode);
    container.appendChild(element);
  } else {
    updateElement(container, normalizedNode, oldVNode, 0);
  }

  setupEventListeners(container);
  vNodeMap.set(container, normalizedNode);
}
