import { setupEventListeners, removeEvent, addEvent } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(newVNode, container) {
  // container의 첫 번째 자식 요소를 가져옴
  if (!container._vnode) {
    container._vnode = null; // 초기화
  }

  const oldVNode = container._vnode; // 이전 VNode를 저장하는 속성 추가
  const normalizedVNode = normalizeVNode(newVNode); // vNode 정규화

  if (!oldVNode) {
    // 최초 렌더링 시 createElement로 DOM을 생성하고
    const $el = createElement(normalizedVNode); // createElement로 노드 생성
    container.appendChild($el); // container에 삽입
    container._vnode = normalizedVNode; // 현재 VNode를 저장
    setupEventListeners(container); // 이벤트 등록
  } else {
    // 이전 VNode의 이벤트 핸들러를 제거
    oldVNode.children.forEach((child) => {
      if (child.props) {
        Object.keys(child.props).forEach((prop) => {
          if (prop.startsWith("on")) {
            const eventType = prop.slice(2).toLowerCase(); // onClick -> click
            removeEvent(container, eventType, child.props[prop]);
          }
        });
      }
    });

    // 새로운 VNode의 이벤트 핸들러를 추가
    normalizedVNode.children.forEach((child) => {
      if (child.props) {
        Object.keys(child.props).forEach((prop) => {
          if (prop.startsWith("on")) {
            const eventType = prop.slice(2).toLowerCase(); // onClick -> click
            // 새로운 핸들러를 추가
            addEvent(container, eventType, child.props[prop]);
          }
        });
      }
    });

    updateElement(container, normalizedVNode, oldVNode); // DOM 업데이트
    container._vnode = normalizedVNode; // 현재 VNode를 업데이트
  }
}
