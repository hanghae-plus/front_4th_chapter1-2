import { handleUpdateAttr } from "../utils";

/**
 * 가상 노드를 실제 DOM 노드로 변환.
 *
 * @param vNode - 변환할 가상 노드
 * @returns 변환된 실제 DOM 노드
 * @description
 * - null, undefined, boolean 타입의 vNode는 빈 텍스트 노드를 반환합니다.
 * - 문자열이나 숫자는 텍스트 노드로 변환됩니다.
 * - 배열 형태의 vNode는 DocumentFragment에 각 자식을 재귀적으로 추가합니다.
 * - 그 외의 경우(객체) vNode는 실제 DOM 요소로 변환하며, 속성 및 자식을 처리합니다.
 */
export function createElement(vNode) {
  //  null, undefined, boolean 타입 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 문자열 및 숫자 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    const docFragment = document.createDocumentFragment();

    vNode.forEach((childVNode) =>
      docFragment.appendChild(createElement(childVNode)),
    );

    return docFragment;
  }

  // 객체 형태의 가상 노드 처리
  const domElement = document.createElement(vNode.type); // DOM 요소 생성

  handleUpdateAttr(domElement, vNode.props); // 속성 적용

  domElement.append(...vNode.children.map(createElement)); // 자식 요소 추가

  return domElement;
}
