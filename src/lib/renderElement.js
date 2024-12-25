import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const oldNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  const oldNode = oldNodeMap.get(container);
  const newNode = normalizeVNode(vNode);

  if (!oldNode) {
    container.appendChild(createElement(newNode));
  } else {
    // 이후에는 updateElement로 기존 DOM을 업데이트한다.
    updateElement(container, newNode, oldNode);
  }

  oldNodeMap.set(container, newNode);

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
