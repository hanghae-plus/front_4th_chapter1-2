import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const nodeToContainerMap = new WeakMap();

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
