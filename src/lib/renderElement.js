import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const el = createElement(normalizeVNode(vNode));
  container.appendChild(el);

  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // updateElement(container, normalizeVNode(vNode));
  if (container.childNodes.length) {
    container.replaceChild(el, container.childNodes[0]);
  }

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
