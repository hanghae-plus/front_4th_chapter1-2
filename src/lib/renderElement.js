import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const vDom = new WeakMap();

/**
 * vNode를 받아서 해당 vNode를 container에 렌더링
 * @description
 * - 이전 가상 DOM과 비교하기 위해 WeakMap을 사용하여 container에 대한 가상 DOM 저장
 * - container에 가상 DOM이 존재하지 않는 경우, createElement를 통해 DOM 생성
 * - 가상 DOM이 존재할 경우 새로운 가상 DOM과 비교하여 변경분만 업데이트
 * @param {*} vNode
 * @param {*} container
 * @returns {void}
 */
export function renderElement(vNode, container) {
  const newVNode = normalizeVNode(vNode);

  if (!vDom.has(container)) {
    const el = createElement(newVNode);
    container.appendChild(el);
  } else {
    const oldVNode = vDom.get(container);
    updateElement(container, newVNode, oldVNode);
  }

  setupEventListeners(container);
  vDom.set(container, newVNode);
}
