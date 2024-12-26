import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // null, undefined, boolean -> 빈 텍스트 노드 생성
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // string, number -> 텍스트 노드 생성
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    // fragment 생성
    const fragment = document.createDocumentFragment();

    // 자식 노드 생성
    vNode.forEach((child) => {
      // 재귀적으로 자식 노드 생성
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });

    // fragment 반환
    return fragment;
  }

  // 객체일 경우 - 재귀적으로 자식 노드 생성
  const element = document.createElement(vNode.type);

  // props 처리
  if (vNode.props) {
    // 각 속성 처리
    Object.entries(vNode.props).forEach(([key, value]) => {
      // 이벤트 핸들러 처리
      // onClick, onMouseOver, onMouseOut -> click, mouseover, mouseout
      if (key.startsWith("on") && typeof value === "function") {
        addEvent(element, key, value);
      }
      // className 특별 처리
      // tailwind 클래스로 변환 처리를 위해 추가
      else if (key === "className") {
        element.setAttribute("class", value);
      }
      // 일반 속성 처리
      // children 제외
      else if (key !== "children") {
        element.setAttribute(key, value);
      }
    });
  }

  // 자식노드가 있을 경우 재귀적으로 호출
  if (vNode.children) {
    vNode.children
      .filter(Boolean) // falsy 값 제거
      .map(createElement) // 재귀적으로 자식 노드 생성
      .forEach((child) => element.appendChild(child)); // 자식 노드 추가
  }

  return element;
}
