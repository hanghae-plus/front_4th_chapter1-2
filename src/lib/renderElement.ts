import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";
import { VNode } from "./type";
import { nodeStore } from "../stores";

export function renderElement(vNode: VNode, container: HTMLElement | null) {
  if (!container) return;

  const prevEl = container.firstChild;

  if (!prevEl) {
    container.appendChild(createElement(normalizeVNode(vNode)));
    setupEventListeners(container);
    nodeStore.set(normalizeVNode(vNode));
    return;
  }

  updateElement(container, normalizeVNode(vNode), nodeStore.get());
  nodeStore.set(normalizeVNode(vNode));
  // container.replaceChild(createElement(normalizeVNode(vNode)), prevEl);
  // setupEventListeners(container);
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
}
