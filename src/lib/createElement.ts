// 1. vNode가 null, undefined, boolean 면 빈 텍스트 노드를 반환합니다.
// 2. vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
// 3. vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
// 4. 위 경우가 아니면 실제 DOM 요소를 생성합니다:
//     - vNode.type에 해당하는 요소를 생성
//     - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
//     - vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가

import { addEvent } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";

interface VNode {
  type: string | Function;
  props: Record<string, any>;
  children?: Array<VNode | string | number>;
}

export function createElement(vNode: VNode) {
  if (vNode && typeof vNode.type === "function") {
    throw new Error("Function component is not supported");
  }

  // vNode 정규화
  let normalizedVNode = normalizeVNode(vNode);

  // null, undefined, boolean 빈 텍스트 노드 변환
  if (
    typeof normalizedVNode === "boolean" ||
    normalizedVNode === null ||
    normalizedVNode === undefined
  ) {
    return document.createTextNode("");
  }

  if (
    typeof normalizedVNode === "string" ||
    typeof normalizedVNode === "number"
  ) {
    return document.createTextNode(String(normalizedVNode));
  }

  if (Array.isArray(normalizedVNode)) {
    const fragment = document.createDocumentFragment();

    normalizedVNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });

    return fragment;
  }

  // 일반 DOM 요소 생성
  const { type, props = {}, children = [] } = normalizedVNode;
  const $element = document.createElement(type) as HTMLElement;

  // props 적용
  updateAttributes($element, props);

  // children 추가
  children.forEach((child) => {
    $element.appendChild(createElement(child));
  });

  return $element;
}

function updateAttributes($element: HTMLElement, props: Record<string, any>) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    // 이벤트 핸들러 등록
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.toLowerCase().substring(2);
      addEvent($element, eventType, value);
      return;
    }

    // className 등록
    if (key === "className") {
      $element.setAttribute("class", value);
      return;
    }

    // 일반 속성 등록
    $element.setAttribute(key, value);
  });
}
