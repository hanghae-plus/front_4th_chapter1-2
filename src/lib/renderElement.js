import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const nodeToContainerMap = new WeakMap();

export function renderElement(vNode, container) {
  vNode = normalizeVNode(vNode);

  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  if (!nodeToContainerMap.has(container)) {
    container.append(createElement(vNode));
  } else {
    // 이후에는 updateElement로 기존 DOM을 업데이트한다.
    const oldNode = nodeToContainerMap.get(container);
    updateElement(container, vNode, oldNode);
  }
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
  nodeToContainerMap.set(container, vNode);
}
