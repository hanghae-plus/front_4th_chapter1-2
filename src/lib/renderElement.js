import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";

export function renderElement(vNode, container) {
  // vNode를 정규화
  const normalizedNode = normalizeVNode(vNode);

  // createElement로 노드 생성
  const element = createElement(normalizedNode);

  // container에 삽입
  container.innerHTML = "";
  container.appendChild(element);

  // 이벤트 등록
  setupEventListeners(container);
}
