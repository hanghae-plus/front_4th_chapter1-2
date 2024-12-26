import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const OldNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  console.log(`renderElement ${JSON.stringify(vNode)}, ${container}`);

  const oldNode = OldNodeMap.get(container);
  const newNode = normalizeVNode(vNode);

  if (!oldNode) {
    const element = createElement(newNode);
    container.appendChild(element);
  } else {
    updateElement(container, newNode, oldNode);
  }

  OldNodeMap.set(container, newNode);
  setupEventListeners(container);
}
