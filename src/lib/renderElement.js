import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// 초기화된 컨테이너 목록
const initializedContainers = new WeakSet();

// 이전 VNode 목록
const previousVNodes = new WeakMap();

export function renderElement(vNode, container) {
  // 최초 한 번만 이벤트 리스너 설정
  if (!initializedContainers.has(container)) {
    setupEventListeners(container);
    initializedContainers.add(container);
  }

  // 새로운 VNode 정규화
  const normalizedNewVNode = normalizeVNode(vNode);

  // 이전 VNode 가져오기
  const prevVNode = previousVNodes.get(container);

  // 이전 VNode가 없으면 최초 렌더링
  if (!prevVNode) {
    container.appendChild(createElement(normalizedNewVNode));
  } else {
    // diff 알고리즘으로 변경점 업데이트
    updateElement(container, normalizedNewVNode, prevVNode, 0);
  }

  // 현재 vNode를 저장
  previousVNodes.set(container, normalizedNewVNode);
}

// 순서
// 1. 이벤트 리스너 설정
// 2. 정규화
// 3. 이전 VNode 가져오기
// 4. 이전 VNode가 없으면 최초 렌더링
// 5. 이전 VNode가 있으면 변경점 업데이트
// 6. 현재 VNode 저장
