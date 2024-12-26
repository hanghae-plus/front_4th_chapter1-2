import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// basicNode가 초기화 되지 않기 위해 renderElement 밖에 선언하기
const basicNode = new Map();

export function renderElement(vNode, realNode) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.

  // 가상돔 객체
  console.log("vNode", vNode);
  // 실제 컴포넌트
  console.log("realNode", realNode);

  const realVNode = basicNode.get(realNode);
  const newVNode = normalizeVNode(vNode);

  // 이전에 한 번도 그려진 적이 없으면
  if (!realVNode) {
    const newRealNode = createElement(newVNode);
    realNode.appendChild(newRealNode);
    // 한 번이라도 그려진 적 있으면(#root 컴포넌트)
  } else {
    updateElement(realNode, newVNode, realVNode);
  }
  // 보여질 노드를 basicNode에 저장해놓기
  basicNode.set(realNode, newVNode);

  // 이벤트 등록
  setupEventListeners(realNode);
}
