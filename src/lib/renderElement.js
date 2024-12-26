import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let oldNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  // 1. 가상 DOM을 정규화
  const newNode = normalizeVNode(vNode); // 컴포넌트를 정규화 한 다음에 : 발사

  // 2. 첫 랜더링 시점
  if (oldNodeMap.has(container)) {
    const oldNode = oldNodeMap.get(container);

    // 3. 그 외 시점 시작
    updateElement(container, newNode, oldNode);

    // 4. 새로운 이벤트 리스너 설정
    setupEventListeners(container);

    // 5. 현재 가상 DOM을 저장
    oldNodeMap.set(container, newNode);
  } else {
    // 2.1. 새로운 DOM 요소 생성
    const newDom = createElement(newNode);

    // 2.2. 생성된 요소를 컨테이너에 추가
    container.appendChild(newDom); // container에 삽입하며

    // 2.3. 이벤트 리스너 설정
    setupEventListeners(container); // 마지막으로 이벤트를 등록

    // 2.4. 현재 가상 DOM을 저장
    oldNodeMap.set(container, newNode);
  }
}
