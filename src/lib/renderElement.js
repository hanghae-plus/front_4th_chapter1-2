import { setupEventListeners, removeEvent } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

let oldVDom = null;

export function renderElement(vNode, container) {
  const newVDom = normalizeVNode(vNode); // 컴포넌트를 정규화 한 다음에 : 발사

  // 첫 랜더링 시점
  if (!oldVDom) {
    const newDom = createElement(newVDom);
    container.appendChild(newDom); // container에 삽입하며

    setupEventListeners(container); // 마지막으로 이벤트를 등록

    oldVDom = newVDom;

    return;
  }

  // 그 외 시점 시작
  removeEvent();

  // updateElement로 기존 DOM을 업데이트
  // updateElement(container, newVDom, oldVDom);

  // 랜더링이 완료되는 시점 / container 에 이벤트 등록
  setupEventListeners(container);

  oldVDom = newVDom;
}
