import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, $root) {
  // 1. vNode 정규화
  const normalizedVNode = normalizeVNode(vNode);
  // 2. DOM 요소 생성 또는 업데이트
  if (!$root.prevNode) {
    // 최초 렌더링: createElement로 새로운 DOM 생성
    const $el = createElement(normalizedVNode);
    $root.appendChild($el);
    $root.prevNode = normalizedVNode;
  } else {
    // 재렌더링: updateElement로 기존 DOM 업데이트
    updateElement($root, $root.prevNode, normalizedVNode);
    $root.prevNode = normalizedVNode;
  }

  // 3. 이벤트 리스너 설정 (이벤트 위임을 위해)
  setupEventListeners($root);
}
