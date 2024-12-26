import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const nodeToContainerMap = new WeakMap();

/**
 * vNode를 DOM으로 렌더링하고, 컨테이너에 삽입하거나 업데이트
 * @param {VNode} vNode - 렌더링할 가상 DOM 노드
 * @param {Element} container - DOM 요소를 삽입할 컨테이너
 */
export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);

  // 최초 렌더링 시 DOM을 생성
  if (!nodeToContainerMap.has(container)) {
    container.append(createElement(normalizedVNode));
  } else {
    // 이후 업데이트: 기존 vNode와 비교하여 업데이트
    const oldNode = nodeToContainerMap.get(container);

    updateElement(container, normalizedVNode, oldNode);
  }
  // 렌더링 완료 후 root에 이벤트 리스너 등록
  setupEventListeners(container);
  nodeToContainerMap.set(container, normalizedVNode);
}
