import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";

export function renderElement(vNode, container) {
  // 1. vNode를 정규화
  const normalizedNode = normalizeVNode(vNode);

  // 2. 정규화된 vNode를 실제 DOM 요소로 변환
  const element = createElement(normalizedNode);

  // 3. container를 비우고 새로운 element를 추가
  container.innerHTML = "";
  container.appendChild(element);

  // 4. 이벤트 리스너 설정
  setupEventListeners(container);
}
