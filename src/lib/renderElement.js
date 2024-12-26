import { addEvent, removeEvent, setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// 이벤트 리스너를 업데이트
export function updateEventListeners(element, newProps, oldProps) {
  // 기존 이벤트 제거
  Object.keys(oldProps || {}).forEach((key) => {
    if (key.startsWith("on") && (!newProps || !(key in newProps))) {
      const eventType = key.slice(2).toLowerCase();
      removeEvent(element, eventType);
    }
  });

  // 새로운 이벤트 핸들러 추가
  Object.keys(newProps || {}).forEach((key) => {
    if (key.startsWith("on") && oldProps[key] !== newProps[key]) {
      const eventType = key.slice(2).toLowerCase();
      removeEvent(element, eventType); // 기존 이벤트 제거
      addEvent(element, eventType, newProps[key]); // 새로운 이벤트 추가
    }
  });
}

// 최초 렌더링 시에는 createElement로 DOM을 생성
// 이후에는 updateElement로 기존 DOM을 업데이트
export function renderElement(vNode, container) {
  const oldVNode = container._vNode; // 이전 가상 DOM

  if (oldVNode) {
    updateElement(container, normalizeVNode(vNode), oldVNode);
  } else {
    // 최초 렌더링: DOM 생성 및 추가
    container.appendChild(createElement(normalizeVNode(vNode)));
  }

  // 새로운 가상 DOM을 저장하여 다음 렌더링에서 비교
  container._vNode = normalizeVNode(vNode);
  setupEventListeners(container); // 이벤트 리스너 설정
}
