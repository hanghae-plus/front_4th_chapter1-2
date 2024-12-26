import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// 최초 렌더링시에는 createElement로 DOM을 생성하고
// 이후에는 updateElement로 기존 DOM을 업데이트한다.
// 렌더링이 완료되면 container에 이벤트를 등록한다.
export function renderElement(vNode, container) {
  // 가상 DOM 노드를 정규화한다
  const normalizedNode = normalizeVNode(vNode);

  // container에 가상 노드가 있는 경우
  if (container._vNode) {
    // 업데이트 처리
    updateElement(container, normalizedNode, container._vNode);
  }
  // container에 가상 노드가 없는 경우
  else {
    // container.innerHTML = ""; // 최초 렌더링인 경우 새로운 DOM을 생성한다
    const $el = createElement(normalizedNode); // 가상 DOM을 실제 DOM으로 변환한다
    container.appendChild($el); // 생성한 DOM을 container에 추가한다
  }

  // 현재의 가상 DOM을 다름 렌더링을 위해 저장한다. !!!!
  container._vNode = normalizedNode;

  // 이벤트 등록한다
  setupEventListeners(container);
}
