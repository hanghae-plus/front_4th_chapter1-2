import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement.js";
import { setupEventListeners } from "./eventManager.js";

/*
 * Virtual DOM 기반 파이프라인
 * 1. JSX -> Virtual DOM 노드 생성 (createVNode)
 * 2. Virtual DOM 노드 정규화 (normalizeVNode)
 * 3. 실제 DOM 요소 생성 (createElement)
 * 4. DOM 렌더링 (renderElement)
 */

export function renderElement(vNode, container) {
  // root 엘리먼트에 합성 이벤트로 처리되는 리스너 등록
  setupEventListeners(container);

  // 이전 가상 DOM 가져오기
  const oldVNode = container._vnode;

  // 새로운 가상 DOM 정규화
  const normalizedVNode = normalizeVNode(vNode);

  if (!oldVNode) {
    // 최초 렌더링
    container.appendChild(createElement(normalizedVNode));
  } else {
    updateElement(container, normalizedVNode, oldVNode, 0);
  }

  // 현재 가상 DOM 저장
  container._vnode = normalizedVNode;
}
