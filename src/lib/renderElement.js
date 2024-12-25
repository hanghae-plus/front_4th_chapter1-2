import { createElement } from "./createElement";
import { createElementChildRemoveObserver } from "./elementObserver";
import { clearEvents, setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let oldVNode = null;

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
  if (!oldVNode) {
    // step3. DOM 추가
    const element = createElement(normalizedVNode);
    container.append(element); // 첫 렌더링 때만 container에 DOM 추가
    // 예외처리 :  DOM 삭제 감지
    createElementChildRemoveObserver([container, document.body], () => {
      initOldVNode();
      clearEvents();
    });
  }

  // step3. DOM 업데이트
  oldVNode && updateElement(container, normalizedVNode, oldVNode);

  // step4. 이벤트 핸들러 등록
  setupEventListeners(container);

  // step5. oldVNode 업데이트
  oldVNode = normalizedVNode;
}

function initOldVNode() {
  oldVNode = null;
}
