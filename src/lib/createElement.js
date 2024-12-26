import { addEvent } from "./eventManager";

// 이벤트 속성인지 확인하는 유틸리티 함수
const isEventProp = (key) => key.startsWith("on");
const extractEventName = (key) => key.slice(2).toLowerCase();

// 속성 업데이트 함수
function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    if (isEventProp(key) && typeof value === "function") {
      addEvent($el, extractEventName(key), value);
    } else if (key === "className") {
      $el.className = value;
    } else {
      $el.setAttribute(key, value);
    }
  });
}

// vNode를 실제 DOM으로 변환하는 함수
export function createElement(vNode) {
  const createEmptyTextNode = () => document.createTextNode("");
  const createTextNode = (content) => document.createTextNode(String(content));
  const createFragmentFromArray = (nodes) => {
    const fragment = document.createDocumentFragment();
    nodes.forEach((child) => fragment.appendChild(createElement(child)));
    return fragment;
  };

  if (vNode == null || typeof vNode === "boolean") {
    return createEmptyTextNode();
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    return createFragmentFromArray(vNode);
  }

  const $el = document.createElement(vNode.type);
  updateAttributes($el, vNode.props);

  if (vNode.children) {
    vNode.children.forEach((child) => {
      $el.appendChild(createElement(child));
    });
  }

  return $el;
}
