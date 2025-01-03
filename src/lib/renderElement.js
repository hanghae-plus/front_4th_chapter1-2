import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let oldVNodeMap = new WeakMap(); // 이전 가상 노드를 저장

/**
 * 가상 노드를 실제 DOM에 렌더링.
 *
 * @param vNode - 렌더링할 가상 노드
 * @param container - DOM을 삽입할 대상 컨테이너
 * @description
 * - 가상 노드를 정규화하여 표준 형태로 변환합니다.
 * - 기존 노드가 존재하면 업데이트하고, 없으면 새로 생성하여 삽입합니다.
 * - 렌더링 완료 후 이벤트 리스너를 등록합니다.
 */
export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);

  if (oldVNodeMap.has(container)) {
    const oldVNode = oldVNodeMap.get(container);

    updateElement(container, normalizedVNode, oldVNode);
  } else {
    // 새로운 노드를 DocumentFragment에 추가
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createElement(normalizedVNode));

    container.append(fragment);
  }

  setupEventListeners(container);

  // 현재 노드를 oldVNodeMap에 저장
  oldVNodeMap.set(container, normalizedVNode);
}
