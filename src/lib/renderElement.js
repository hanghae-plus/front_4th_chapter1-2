import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";
import { nodeStore } from "./nodeStore";

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  if (container.innerHTML === "") {
    vNode = normalizeVNode(vNode);
    container.appendChild(createElement(vNode));
  } else {
    vNode = normalizeVNode(vNode);
    let oldNode = nodeStore.getVNode(container);

    updateElement(container, vNode, oldNode);
  }

  nodeStore.setWeakMap(container, vNode);

  setupEventListeners(container);
}
