import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const vNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  // vNode를 정규화
  const normalizedNode = normalizeVNode(vNode);
  const currentVNode = vNodeMap.get(container);

  if (!currentVNode) {
    // 최초 렌더링
    container.innerHTML = "";
    const element = createElement(normalizedNode);
    container.appendChild(element);
    setupEventListeners(container);
  } else {
    // 업데이트: 변경된 부분만 업데이트
    updateElement(container, normalizedNode, currentVNode);
  }

  // 현재 vNode 저장
  vNodeMap.set(container, normalizedNode);
}
