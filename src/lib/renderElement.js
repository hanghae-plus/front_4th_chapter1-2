import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// 최초 렌더링시에는 createElement로 DOM을 생성하고
// 이후에는 updateElement로 기존 DOM을 업데이트한다.
// 렌더링이 완료되면 container에 이벤트를 등록한다.

export function renderElement(vNode, container) {
  // 1. 정규화
  const normalizedNode = normalizeVNode(vNode);
  if (!container.prevNode) {
    //최초 랜더링
    //2. 정규화된 노드로 실제 DOM 엘리먼트 생성
    //3. container 초기화 및 새로운 엘리먼트 삽입
    const element = createElement(normalizedNode);
    container.innerHTML = "";
    container.appendChild(element);
  } else {
    // 기존 DOM을 업데이트
    updateElement(container, normalizedNode, container.prevNode);
  }

  //다음 업데이트때 비교하도록 저장
  container.prevNode = normalizedNode;
  setupEventListeners(container);
}
