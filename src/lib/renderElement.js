import { setupEventListeners, removeEvent, addEvent } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  if (!container._vnode) {
    container._vnode = null; // 초기화
  }

  const oldVNode = container._vnode; // 이전 VNode를 저장하는 속성 추가
  const normalizedVNode = normalizeVNode(vNode); // vNode 정규화

  if (!oldVNode) {
    // 최초 렌더링 시 createElement로 DOM을 생성하고
    console.log("Creating element:", normalizedVNode);
    const $el = createElement(normalizedVNode); // createElement로 노드 생성
    container.appendChild($el); // container에 삽입
    container._vnode = normalizedVNode; // 현재 VNode를 저장
    setupEventListeners(container); // 이벤트 등록
    console.log("Element created:", normalizedVNode);
    console.log("Container:", container);
    console.log("container.innerHTML:", container.innerHTML);
  } else {
    // 이전 VNode의 이벤트 핸들러를 제거
    removeEventHandlers(oldVNode);

    // 새로운 VNode의 이벤트 핸들러를 추가
    addEventHandlers(normalizedVNode);

    updateElement(container, normalizedVNode, oldVNode); // DOM 업데이트
    container._vnode = normalizedVNode; // 현재 VNode를 업데이트
  }
}

function removeEventHandlers(vNode) {
  if (vNode.props) {
    Object.keys(vNode.props).forEach((prop) => {
      if (prop.startsWith("on")) {
        const eventType = prop.slice(2).toLowerCase(); // onClick -> click
        removeEvent(vNode, eventType, vNode.props[prop]);
        console.log(`Removed event: ${eventType} from element:`, vNode);
      }
    });
  }
  if (vNode.children) {
    vNode.children.forEach((child) => {
      removeEventHandlers(child);
    });
  }
}

function addEventHandlers(vNode) {
  console.log("Adding event handlers to element:", vNode);
  if (vNode.props) {
    console.log("Props:", vNode.props);
    Object.keys(vNode.props).forEach((prop) => {
      if (prop.startsWith("on")) {
        const eventType = prop.slice(2).toLowerCase(); // onClick -> click
        addEvent(vNode, eventType, vNode.props[prop]);
        console.log(`Added event: ${eventType} to element:`, vNode);
      }
    });
  }
  if (vNode.children) {
    console.log("Children:", vNode.children);
    vNode.children.forEach((child) => {
      console.log("Child:", child);
      addEventHandlers(child);
    });
  }
}
