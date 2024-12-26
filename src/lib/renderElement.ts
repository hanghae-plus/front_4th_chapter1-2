// TODO: renderElement 함수 구현 [심화]
// 기존의 renderElement에서 코드를 수정해야 합니다.
// - 최초 렌더링일 때는 createElement 사용
// - 리렌더링일 때는 updateElement 사용

import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

interface VNode {
  type: string | Function;
  props: Record<string, any>;
  children?: Array<VNode | string | number>;
}

// 이전 가상 DOM 상태를 저장하기 위한 WeakMap
const oldVNodeMap = new WeakMap<HTMLElement, VNode>();

export function renderElement(vNode: VNode, container: HTMLElement): void {
  const normalizedNode = normalizeVNode(vNode);
  const oldVNode = oldVNodeMap.get(container);

  if (oldVNode) {
    // 이전 가상 DOM이 있으면 비교 후 업데이트
    updateElement(container, normalizedNode, oldVNode);
  } else {
    // 최초 렌더링
    container.appendChild(createElement(normalizedNode));
  }

  // 현재 가상 DOM을 저장
  oldVNodeMap.set(container, normalizedNode);

  // 이벤트 리스너 설정
  setupEventListeners(container);
}
