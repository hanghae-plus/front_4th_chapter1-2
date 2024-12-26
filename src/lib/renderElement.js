import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

/*
 * 가상돔 시나리오 정리
 * 1. createVNode: JSX에서 VDOM 노드 생성
 * 2. normalizeVNode: Virtual DOM 노드 정규화
 * 3. createElement: 돔 요소 생성
 * 4. renderElement: DOM 렌더링
 */

export function renderElement(vNode, container) {
  setupEventListeners(container);
  const oldVNode = container._vnode;

  // 새로운 가상 DOM 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // 최초 렌더링
  if (!oldVNode) {
    container.appendChild(createElement(normalizedVNode));
  } else {
    // 이전 HTML 초기화
    updateElement(container, normalizedVNode, oldVNode, 0);
  }

  // 현재 가상 DOM 저장
  container._vnode = normalizedVNode;
}
