import { setupEventListeners, removeEvent } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

let oldVDom = null;

export function renderElement(vNode, container) {
  // 1. 가상 DOM을 정규화
  const newVDom = normalizeVNode(vNode); // 컴포넌트를 정규화 한 다음에 : 발사

  // 2. 첫 랜더링 시점
  if (!oldVDom) {
    // 2.1. 새로운 DOM 요소 생성
    const newDom = createElement(newVDom);
    // 2.2. 생성된 요소를 컨테이너에 추가
    container.appendChild(newDom); // container에 삽입하며

    // 2.3. 이벤트 리스너 설정
    setupEventListeners(container); // 마지막으로 이벤트를 등록

    // 2.4. 현재 가상 DOM을 저장
    oldVDom = newVDom;

    return;
  }

  // 3. 그 외 시점 시작
  // 3.1. 기존 이벤트 리스너 제거
  removeEvent();

  // 3.2. 기존 DOM을 업데이트
  // updateElement(container, newVDom, oldVDom);

  // 3.3. 이벤트 리스너 재설정
  setupEventListeners(container);

  // 3.4. 현재 가상 DOM을 저장
  oldVDom = newVDom;
}
