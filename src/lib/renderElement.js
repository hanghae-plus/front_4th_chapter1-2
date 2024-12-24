import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let oldVNode = null;

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  if (!container.firstChild) {
    oldVNode = normalizeVNode(vNode);
    container.appendChild(createElement(oldVNode));
  } else {
    const newVNode = normalizeVNode(vNode);
    updateElement(container, newVNode, oldVNode, 0);
    oldVNode = newVNode;
  }

  setupEventListeners(container);
}
