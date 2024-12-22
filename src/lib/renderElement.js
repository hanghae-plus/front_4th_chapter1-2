import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  container.innerHTML = "";
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  if (typeof vNode.type === "function") {
    vNode = normalizeVNode(vNode);
  }
  const newElement = createElement(vNode);
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  updateElement(container, vNode);
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
  container.append(newElement);
}
