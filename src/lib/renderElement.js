import { createElement } from "./createElement";
import { clearEvents, setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";

/**
 * @description VNode를 실제 DOM 엘리먼트로 렌더링하는 함수
 * @param {*} vNode createVNode 함수를 통해 생성된 VNode
 * @param {HTMLElement} container 실제 DOM 엘리먼트(해당 VNode를 렌더링할 대상)
 */
export function renderElement(vNode, container) {
  // step0. 이벤트 초기화
  clearEvents();

  // step1. vNode 정규화
  if (!vNode) {
    return;
  }
  const normalizedVNode = normalizeVNode(vNode);

  // step2. 정규화된 vNode를 기반으로 DOM 생성 또는 업데이트
  const element = createElement(normalizedVNode);

  // step3. DOM 초기화 및 업데이트
  container.innerHTML = ""; // container 초기화
  container.append(element); // container에 DOM 추가

  // step4. 이벤트 핸들러 등록
  setupEventListeners(container);
}
