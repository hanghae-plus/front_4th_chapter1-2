import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let globalVNode;

/**
 * globalVNode 초기화 함수
 * @description globalVNode 변수의 메모리 관리를 위해 container에 자식 노드가 없는 경우 globalVNode를 null로 초기화
 * @param {*} container
 */
function initGlobalVNode(container) {
  if (!container.hasChildNodes()) {
    globalVNode = null;
  }
}

/**
 * vNode를 받아서 해당 vNode를 container에 렌더링
 * @description 첫 렌더링 시 DOM 생성 및 이벤트 핸들러 등록, 이후 렌더링 시 diff 알고리즘 수행하여 변경분만 업데이트
 * @param {*} vNode
 * @param {*} container
 * @returns {void}
 */
export function renderElement(vNode, container) {
  initGlobalVNode(container);

  if (!globalVNode) {
    const normalizedVNode = normalizeVNode(vNode);
    const el = createElement(normalizedVNode);
    container.appendChild(el);
    globalVNode = normalizedVNode;
  } else {
    const newNodes = normalizeVNode(vNode);
    updateElement(container, newNodes, globalVNode);
    globalVNode = newNodes;
  }

  setupEventListeners(container);
}
