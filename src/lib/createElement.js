import { isFalsyTypeWithoutZero } from "../utils/validateType";

export function createElement(vNode) {
  // vNode가 null, undefined, boolean 면 빈 텍스트 노드를 반환
  if (isFalsyTypeWithoutZero(vNode)) {
    return document.createTextNode("");
  }

  // vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  // 실제 DOM 요소를 생성
  if (typeof vNode === "object") {
    const { type, props = {}, children = [] } = vNode;

    // vNode.type에 해당하는 요소를 생성
    const element = document.createElement(type);

    // vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
    updateAttributes(element, props);

    // vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
    children.forEach((child) => {
      element.appendChild(createElement(child));
    });

    return element;
  }

  return document.createTextNode("");
}

function updateAttributes(element, props) {
  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      // 이벤트 리스너 처리
      const event = key.slice(2).toLowerCase();
      element.addEventListener(event, props[key]);
    } else if (key === "className") {
      // className 처리
      element.className = props[key];
    } else {
      // 일반 속성 처리
      element.setAttribute(key, props[key]);
    }
  }
}
