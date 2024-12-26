import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let virtualDOM = null;

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.

  // vNode를 정규화
  const normalizedVNode = normalizeVNode(vNode);

  if (virtualDOM === null) {
    // 최초 렌더링
    const element = createElement(normalizedVNode);
    container.append(element); // DOM 요소를 container에 추가
    virtualDOM = normalizedVNode; // 가상 DOM을 저장
    setupEventListeners(container); // 이벤트 등록
    return;
  }

  // 이후 렌더링에서는 vNode가 변경되었을 때만 업데이트
  if (container.firstChild) {
    updateElement(container, normalizedVNode, virtualDOM); // DOM 업데이트
    virtualDOM = normalizedVNode; // 가상 DOM을 최신 상태로 갱신
  } else {
    // 컨테이너에 자식이 없다면 새로운 요소를 추가
    const element = createElement(normalizedVNode);
    container.append(element);
    virtualDOM = normalizedVNode; // 가상 DOM을 갱신
  }

  setupEventListeners(container); // 이벤트 등록
}
