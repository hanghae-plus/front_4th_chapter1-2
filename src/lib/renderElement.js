import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  console.log(vNode);
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  if (typeof vNode.type === "function") {
    container.append(createElement(normalizeVNode(vNode)));
  } else {
    container.append(createElement(vNode));
  }
  setupEventListeners(container);
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
}
